/**
 * WOLOG - Omicron ISA Runtime in C
 * 
 * FIFO/stdin/stdout based execution with SWAR operations.
 * TrackLog records all state transitions.
 * 
 * Compile: gcc -O2 -o wolog wolog.c
 * Run:     ./wolog < input.bin > output.bin 2> trace.log
 */

#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <string.h>
#include <stdbool.h>
#include <unistd.h>
#include <fcntl.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <errno.h>

/* ============================================================================
 * CONSTANTS
 * ============================================================================ */

#define NUM_REGISTERS    16
#define MEMORY_SIZE      (64 * 1024)  /* 64KB */
#define TRACKLOG_SIZE    1024
#define MASTER_PERIOD    5040         /* 7! */
#define SONAR_PERIOD     60           /* 4 channels × 15 slots */
#define OMICRON_PERIOD   420          /* LCM(7, 60) */
#define FANO_PERIOD      7

/* ============================================================================
 * TYPES
 * ============================================================================ */

/* Byte Order Mark - determines complement mode */
typedef enum {
    BOM_FEFF = 0,  /* Two's complement (forward) */
    BOM_FFFE = 1   /* One's complement (inverted) */
} BOM;

/* Condition flags */
typedef struct {
    bool zero;
    bool carry;
    bool overflow;
    bool sign;
    bool omicron;
} Flags;

/* Register file */
typedef struct {
    uint64_t r[NUM_REGISTERS];
} Registers;

/* Instruction */
typedef enum {
    INST_MOV,     INST_MOVR,    INST_LDM,     INST_STM,
    INST_POPCNT,  INST_CLZ,      INST_CTZ,
    INST_ZBYTE,   INST_CMPBYTE,  INST_SWARADD, INST_SWARSUB,
    INST_DIV_R,   INST_DIV_NR,   INST_SRT4,
    INST_GNOMON,  INST_CHIRAL,   INST_TILE,
    INST_JMP,     INST_JZ,       INST_JNZ,     INST_JOMI,
    INST_HALT,
    INST_TRACE,   INST_SYNC,
    INST_NOP
} InstType;

/* Full instruction */
typedef struct {
    InstType type;
    uint8_t  rd;      /* Destination register */
    uint8_t  rs;      /* Source register 1 */
    uint8_t  rt;      /* Source register 2 */
    uint64_t imm;     /* Immediate value */
    uint64_t addr;    /* Jump address */
} Instruction;

/* TrackLog entry */
typedef struct {
    uint64_t    pc;
    InstType    inst;
    uint64_t    regs[NUM_REGISTERS];
    Flags       flags;
    BOM         bom;
    bool        omicron_event;
    uint64_t    timestamp;
} TrackEntry;

/* Processor state */
typedef struct {
    Registers   regs;
    uint64_t    pc;
    Flags       flags;
    BOM         bom;
    uint8_t     *memory;
    TrackEntry  *tracklog;
    int         tracklog_head;
    int         tracklog_count;
    uint64_t    tick;           /* Current tick (0-5039) */
} Processor;

/* ============================================================================
 * SWAR OPERATIONS
 * ============================================================================ */

/* Population count using SWAR - counts bits in each byte lane */
static inline uint64_t swar_popcnt(uint64_t x) {
    x = x - ((x >> 1) & 0x5555555555555555ULL);
    x = (x & 0x3333333333333333ULL) + ((x >> 2) & 0x3333333333333333ULL);
    x = (x + (x >> 4)) & 0x0F0F0F0F0F0F0F0FULL;
    return (x * 0x0101010101010101ULL) >> 56;
}

/* Count leading zeros */
static inline uint64_t swar_clz(uint64_t x) {
    if (x == 0) return 64;
    return __builtin_clzll(x);
}

/* Count trailing zeros */
static inline uint64_t swar_ctz(uint64_t x) {
    if (x == 0) return 64;
    return __builtin_ctzll(x);
}

/* Find zero bytes - returns mask with bit 7 set for each zero byte */
static inline uint64_t swar_zbyte(uint64_t x) {
    uint64_t x7 = x - 0x0101010101010101ULL;
    return (x7 & ~x) & 0x8080808080808080ULL;
}

/* SWAR addition - no carry between byte lanes */
static inline uint64_t swar_add_bytes(uint64_t a, uint64_t b) {
    uint64_t sum = a + b;
    uint64_t carry = ((a & b) | ((a ^ b) & ~sum)) & 0x8080808080808080ULL;
    return sum ^ (carry | (carry >> 7));
}

/* SWAR subtraction with borrow suppression */
static inline uint64_t swar_sub_bytes(uint64_t a, uint64_t b) {
    uint64_t diff = a - b;
    uint64_t borrow = ((~a) & b) | (~(a ^ b) & diff);
    uint64_t borrow_mask = ((borrow & 0x8080808080808080ULL) >> 7) * 0xFFULL;
    return diff ^ borrow_mask;
}

/* ============================================================================
 * DIVISION ALGORITHMS
 * ============================================================================ */

/* Restoring division (Two's complement, FEFF mode) */
static void div_restoring(uint64_t n, uint64_t d, uint64_t *q, uint64_t *r) {
    if (d == 0) { *q = 0xFFFFFFFFFFFFFFFFULL; *r = n; return; }
    
    *q = 0;
    *r = 0;
    
    for (int i = 63; i >= 0; i--) {
        *r = (*r << 1) | ((n >> i) & 1);
        
        if (*r >= d) {
            *r -= d;
            *q |= (1ULL << i);
        }
    }
}

/* Non-restoring division (One's complement, FFFE mode) */
static void div_non_restoring(uint64_t n, uint64_t d, uint64_t *q, uint64_t *r) {
    if (d == 0) { *q = 0xFFFFFFFFFFFFFFFFULL; *r = n; return; }
    
    *q = 0;
    int64_t rem = 0;
    
    for (int i = 63; i >= 0; i--) {
        rem = (rem << 1) | ((n >> i) & 1);
        
        if (rem >= 0) {
            rem -= d;
            *q = (*q << 1) | 1;
        } else {
            rem += d;
            *q = (*q << 1) | 0;
        }
    }
    
    /* Handle final remainder */
    if (rem < 0) {
        *q -= 1;
        rem += d;
    }
    *r = (uint64_t)rem;
}

/* ============================================================================
 * POLYOMINO OPERATIONS
 * ============================================================================ */

/* Gnomon - add one cell to polyomino */
static uint64_t poly_gnomon(uint64_t mask) {
    if (mask == 0) return 1;  /* Start with single cell */
    
    /* Find lowest set bit and expand */
    uint64_t lowest = mask & -mask;
    uint64_t expansion = (lowest << 1) | (lowest >> 1);
    return mask | expansion;
}

/* Chirality test - apply complement based on BOM */
static uint64_t poly_chiral(uint64_t val, BOM bom) {
    return (bom == BOM_FFFE) ? ~val : val;
}

/* Convert to domino tile (2-of-5 pattern) */
static uint64_t poly_tile(uint64_t val) {
    uint8_t top = (val >> 2) & 0x7;
    uint8_t bottom = val & 0x7;
    return ((uint64_t)top << 32) | ((uint64_t)bottom << 16) | val;
}

/* ============================================================================
 * PROCESSOR OPERATIONS
 * ============================================================================ */

/* Initialize processor */
Processor* proc_init(void) {
    Processor *p = calloc(1, sizeof(Processor));
    p->memory = calloc(1, MEMORY_SIZE);
    p->tracklog = calloc(TRACKLOG_SIZE, sizeof(TrackEntry));
    p->tracklog_head = 0;
    p->tracklog_count = 0;
    p->tick = 0;
    p->pc = 0;
    p->bom = BOM_FEFF;
    p->flags = (Flags){0};
    return p;
}

/* Free processor */
void proc_free(Processor *p) {
    free(p->memory);
    free(p->tracklog);
    free(p);
}

/* Get register */
static uint64_t proc_reg(Processor *p, int r) {
    return p->regs.r[r & 0xF];
}

/* Set register */
static void proc_set_reg(Processor *p, int r, uint64_t val) {
    p->regs.r[r & 0xF] = val;
}

/* Add to TrackLog */
static void proc_trace(Processor *p, InstType inst) {
    TrackEntry *e = &p->tracklog[p->tracklog_head];
    e->pc = p->pc;
    e->inst = inst;
    memcpy(e->regs, p->regs.r, sizeof(e->regs));
    e->flags = p->flags;
    e->bom = p->bom;
    e->omicron_event = p->flags.omicron;
    e->timestamp = p->tick;
    
    p->tracklog_head = (p->tracklog_head + 1) % TRACKLOG_SIZE;
    if (p->tracklog_count < TRACKLOG_SIZE) p->tracklog_count++;
}

/* Execute one instruction */
static bool proc_exec(Processor *p, Instruction *inst) {
    uint64_t rs = proc_reg(p, inst->rs);
    uint64_t rt = proc_reg(p, inst->rt);
    uint64_t result = 0;
    bool jump = false;
    uint64_t jump_addr = 0;
    
    switch (inst->type) {
        /* Data Movement */
        case INST_MOV:
            proc_set_reg(p, inst->rd, inst->imm);
            break;
            
        case INST_MOVR:
            proc_set_reg(p, inst->rd, rs);
            break;
            
        case INST_LDM:
            if (inst->imm < MEMORY_SIZE) {
                uint64_t *ptr = (uint64_t*)&p->memory[inst->imm];
                proc_set_reg(p, inst->rd, *ptr);
            }
            break;
            
        case INST_STM:
            if (inst->imm < MEMORY_SIZE - 7) {
                uint64_t *ptr = (uint64_t*)&p->memory[inst->imm];
                *ptr = rs;
            }
            break;
            
        /* SWAR Bit Operations */
        case INST_POPCNT:
            result = swar_popcnt(rs);
            proc_set_reg(p, inst->rd, result);
            p->flags.zero = (result == 0);
            break;
            
        case INST_CLZ:
            result = swar_clz(rs);
            proc_set_reg(p, inst->rd, result);
            break;
            
        case INST_CTZ:
            result = swar_ctz(rs);
            proc_set_reg(p, inst->rd, result);
            break;
            
        /* SWAR Byte Operations */
        case INST_ZBYTE:
            result = swar_zbyte(rs);
            proc_set_reg(p, inst->rd, result);
            break;
            
        case INST_CMPBYTE:
            result = (rs == rt) ? 0xFFFFFFFFFFFFFFFFULL : 0;
            proc_set_reg(p, inst->rd, result);
            break;
            
        case INST_SWARADD:
            result = swar_add_bytes(rs, rt);
            proc_set_reg(p, inst->rd, result);
            break;
            
        case INST_SWARSUB:
            result = swar_sub_bytes(rs, rt);
            proc_set_reg(p, inst->rd, result);
            break;
            
        /* Division */
        case INST_DIV_R: {
            uint64_t q, r;
            div_restoring(rs, rt, &q, &r);
            proc_set_reg(p, inst->rd, q);
            proc_set_reg(p, (inst->rd + 1) & 0xF, r);
            break;
        }
            
        case INST_DIV_NR: {
            uint64_t q, r;
            div_non_restoring(rs, rt, &q, &r);
            proc_set_reg(p, inst->rd, q);
            proc_set_reg(p, (inst->rd + 1) & 0xF, r);
            break;
        }
        
        /* Polyomino */
        case INST_GNOMON:
            result = poly_gnomon(rs);
            proc_set_reg(p, inst->rd, result);
            /* Check for Omicron event */
            p->flags.omicron = ((p->tick % OMICRON_PERIOD) == 0);
            break;
            
        case INST_CHIRAL:
            result = poly_chiral(rs, p->bom);
            proc_set_reg(p, inst->rd, result);
            break;
            
        case INST_TILE:
            result = poly_tile(rs);
            proc_set_reg(p, inst->rd, result);
            break;
            
        /* Control Flow */
        case INST_JMP:
            jump = true;
            jump_addr = inst->addr;
            break;
            
        case INST_JZ:
            if (p->flags.zero) { jump = true; jump_addr = inst->addr; }
            break;
            
        case INST_JNZ:
            if (!p->flags.zero) { jump = true; jump_addr = inst->addr; }
            break;
            
        case INST_JOMI:
            if (p->flags.omicron) { jump = true; jump_addr = inst->addr; }
            break;
            
        case INST_HALT:
            return false;
            
        /* System */
        case INST_TRACE:
            proc_trace(p, inst->type);
            break;
            
        case INST_SYNC:
            p->bom = (inst->imm == 0) ? BOM_FEFF : BOM_FFFE;
            p->flags.omicron = true;  /* BOM change is an event */
            break;
            
        case INST_NOP:
            break;
            
        default:
            break;
    }
    
    /* Update tick */
    p->tick = (p->tick + 1) % MASTER_PERIOD;
    
    /* Check for Master Reset event */
    if (p->tick == 0) {
        p->flags.omicron = true;
    }
    
    /* Jump or advance PC */
    if (jump) {
        p->pc = jump_addr;
    } else {
        p->pc++;
    }
    
    return true;
}

/* ============================================================================
 * BINARY INPUT/OUTPUT
 * ============================================================================ */

/* Read instruction from binary stream */
static bool read_instruction(FILE *in, Instruction *inst) {
    uint8_t buf[16];
    if (fread(buf, 1, 16, in) != 16) return false;
    
    inst->type = (InstType)buf[0];
    inst->rd = buf[1];
    inst->rs = buf[2];
    inst->rt = buf[3];
    
    inst->imm = 0;
    for (int i = 0; i < 8; i++) {
        inst->imm |= ((uint64_t)buf[4 + i]) << (i * 8);
    }
    
    inst->addr = 0;
    uint64_t addr_val = 0;
    for (int i = 0; i < 8; i++) {
        addr_val |= ((uint64_t)buf[12 + i]) << (i * 8);
    }
    inst->addr = addr_val;
    
    return true;
}

/* Write tracklog entry to binary stream */
static void write_track_entry(FILE *out, TrackEntry *e) {
    uint8_t buf[160];  /* Larger buffer */
    
    /* PC */
    for (int i = 0; i < 8; i++) buf[i] = (e->pc >> (i * 8)) & 0xFF;
    buf[8] = e->inst;
    
    /* Registers */
    for (int i = 0; i < NUM_REGISTERS; i++) {
        for (int j = 0; j < 8; j++) {
            buf[9 + i * 8 + j] = (e->regs[i] >> (j * 8)) & 0xFF;
        }
    }
    
    /* Flags */
    buf[9 + NUM_REGISTERS * 8] = (e->flags.zero ? 1 : 0) |
               (e->flags.carry ? 2 : 0) |
               (e->flags.overflow ? 4 : 0) |
               (e->flags.sign ? 8 : 0) |
               (e->flags.omicron ? 16 : 0);
    
    /* BOM + Event */
    buf[10 + NUM_REGISTERS * 8] = e->bom | (e->omicron_event ? 128 : 0);
    
    /* Timestamp */
    for (int i = 0; i < 8; i++) buf[11 + NUM_REGISTERS * 8 + i] = (e->timestamp >> (i * 8)) & 0xFF;
    
    fwrite(buf, 1, 11 + NUM_REGISTERS * 8 + 8, out);
}

/* Write state snapshot */
static void write_state(FILE *out, Processor *p) {
    uint8_t buf[200];  /* Larger buffer */
    
    /* PC + Tick */
    for (int i = 0; i < 8; i++) {
        buf[i] = (p->pc >> (i * 8)) & 0xFF;
        buf[8 + i] = (p->tick >> (i * 8)) & 0xFF;
    }
    
    /* Registers */
    for (int i = 0; i < NUM_REGISTERS; i++) {
        for (int j = 0; j < 8; j++) {
            buf[16 + i * 8 + j] = (p->regs.r[i] >> (j * 8)) & 0xFF;
        }
    }
    
    /* Flags */
    buf[16 + NUM_REGISTERS * 8] = (p->flags.zero ? 1 : 0) |
               (p->flags.carry ? 2 : 0) |
               (p->flags.overflow ? 4 : 0) |
               (p->flags.sign ? 8 : 0) |
               (p->flags.omicron ? 16 : 0);
    
    buf[17 + NUM_REGISTERS * 8] = p->bom;
    
    fwrite(buf, 1, 18 + NUM_REGISTERS * 8, out);
}

/* ============================================================================
 * MAIN
 * ============================================================================ */

int main(int argc, char *argv[]) {
    /* Setup stdin/stdout/stderr */
    setbuf(stdin, NULL);
    setbuf(stdout, NULL);
    
    /* Initialize processor */
    Processor *p = proc_init();
    
    fprintf(stderr, "WOLOG Omicron ISA Runtime\n");
    fprintf(stderr, "Master Period: %d, Sonar: %d, Omicron: %d\n",
            MASTER_PERIOD, SONAR_PERIOD, OMICRON_PERIOD);
    
    /* Main execution loop - read instructions from stdin */
    Instruction inst;
    while (read_instruction(stdin, &inst)) {
        bool alive = proc_exec(p, &inst);
        
        /* Write state to stdout */
        write_state(stdout, p);
        
        /* Check for HALT */
        if (!alive || inst.type == INST_HALT) break;
    }
    
    /* Write TrackLog to stderr */
    fprintf(stderr, "TrackLog entries: %d\n", p->tracklog_count);
    for (int i = 0; i < p->tracklog_count; i++) {
        int idx = (p->tracklog_head - p->tracklog_count + i + TRACKLOG_SIZE) % TRACKLOG_SIZE;
        write_track_entry(stderr, &p->tracklog[idx]);
    }
    
    proc_free(p);
    return 0;
}