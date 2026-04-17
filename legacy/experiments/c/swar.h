/**
 * WOLOG SWAR Library
 * 
 * SIMD Within A Register - Bit-parallel operations for 64-bit integers.
 * Used by the Omicron ISA for population count, byte operations, etc.
 * 
 * Compile: gcc -O2 -c swar.c
 * Or: #include "swar.h" in your project
 */

#ifndef WOLOG_SWAR_H
#define WOLOG_SWAR_H

#include <stdint.h>
#include <stdbool.h>

/* ============================================================================
 * POPULATION COUNT (SWAR)
 * ============================================================================ */

/**
 * Count bits set in a 64-bit word using SWAR.
 * Treats the word as 8 × 8-bit fields and accumulates in parallel.
 * 
 * Algorithm: Hacked bit population count
 * Time: O(1) - 6 operations
 */
static inline uint64_t swar_popcnt(uint64_t x) {
    x = x - ((x >> 1) & 0x5555555555555555ULL);
    x = (x & 0x3333333333333333ULL) + ((x >> 2) & 0x3333333333333333ULL);
    x = (x + (x >> 4)) & 0x0F0F0F0F0F0F0F0FULL;
    return (x * 0x0101010101010101ULL) >> 56;
}

/**
 * Count bits in each byte lane (returns 8-byte result)
 */
static inline uint64_t swar_popcnt_bytes(uint64_t x) {
    x = x - ((x >> 1) & 0x5555555555555555ULL);
    x = (x & 0x3333333333333333ULL) + ((x >> 2) & 0x3333333333333333ULL);
    x = (x + (x >> 4)) & 0x0F0F0F0F0F0F0F0FULL;
    return x;
}

/* ============================================================================
 * LEADING/TRAILING ZEROS
 * ============================================================================ */

/**
 * Count leading zeros (clz)
 */
static inline uint64_t swar_clz(uint64_t x) {
    if (x == 0) return 64;
    return (uint64_t)__builtin_clzll(x);
}

/**
 * Count trailing zeros (ctz)
 */
static inline uint64_t swar_ctz(uint64_t x) {
    if (x == 0) return 64;
    return (uint64_t)__builtin_ctzll(x);
}

/**
 * Count leading zeros in each byte lane
 */
static inline uint64_t swar_clz_bytes(uint64_t x) {
    uint64_t result = 0;
    for (int i = 0; i < 8; i++) {
        uint8_t byte = (x >> (i * 8)) & 0xFF;
        uint8_t clz = (byte == 0) ? 8 : (uint8_t)__builtin_clz(byte);
        result |= ((uint64_t)clz << (i * 8));
    }
    return result;
}

/* ============================================================================
 * ZERO BYTE DETECTION
 * ============================================================================ */

/**
 * Find zero bytes in a word.
 * Returns a mask with bit 7 set for each zero byte.
 * 
 * Uses the "add 0x7F" trick to detect bytes that would cause carry.
 */
static inline uint64_t swar_zbyte(uint64_t x) {
    uint64_t x7 = x - 0x0101010101010101ULL;
    return (x7 & ~x) & 0x8080808080808080ULL;
}

/**
 * Check if any byte is zero
 */
static inline bool swar_any_zero(uint64_t x) {
    return ((x - 0x0101010101010101ULL) & ~x & 0x8080808080808080ULL) != 0;
}

/**
 * Find index of first zero byte (0-7), or 8 if none
 */
static inline int swar_find_first_zero(uint64_t x) {
    uint64_t mask = swar_zbyte(x);
    if (mask == 0) return 8;
    return __builtin_ctzll(mask) / 8;
}

/* ============================================================================
 * BYTE-PARALLEL ARITHMETIC
 * ============================================================================ */

/**
 * Add bytes without carry between lanes.
 * Each byte lane is independent.
 */
static inline uint64_t swar_add_bytes(uint64_t a, uint64_t b) {
    uint64_t sum = a + b;
    uint64_t carry = ((a & b) | ((a ^ b) & ~sum)) & 0x8080808080808080ULL;
    return sum ^ (carry | (carry >> 7));
}

/**
 * Subtract bytes without borrow between lanes.
 */
static inline uint64_t swar_sub_bytes(uint64_t a, uint64_t b) {
    uint64_t diff = a - b;
    uint64_t borrow = ((~a) & b) | (~(a ^ b) & diff);
    uint64_t borrow_mask = ((borrow & 0x8080808080808080ULL) >> 7) * 0xFFULL;
    return diff ^ borrow_mask;
}

/**
 * Compare bytes for equality.
 * Returns 0xFF where equal, 0x00 where different.
 */
static inline uint64_t swar_eq_bytes(uint64_t a, uint64_t b) {
    uint64_t diff = a ^ b;
    return ~(diff | (diff >> 4) | (diff >> 8) | (diff >> 12) |
             (diff >> 16) | (diff >> 20) | (diff >> 24) | (diff >> 28) |
             (diff >> 32) | (diff >> 36) | (diff >> 40) | (diff >> 44) |
             (diff >> 48) | (diff >> 52) | (diff >> 56) | (diff >> 60)) & 0xFFULL;
}

/**
 * Minimum of bytes (lane-wise)
 */
static inline uint64_t swar_min_bytes(uint64_t a, uint64_t b) {
    return a - ((a - b) & (a - b) > a ? (a - b) : 0);
    // Simpler: use comparisons
    uint64_t diff = a - b;
    uint64_t mask = (diff ^ (a ^ b)) & 0x8080808080808080ULL;
    return a - (diff & (mask >> 7));
}

/* ============================================================================
 * 2-OF-5 ENCODING
 * ============================================================================ */

/**
 * Validate 2-of-5 code (exactly 2 ones in 5 bits)
 */
static inline bool swar_two_of_five_validate(uint8_t code) {
    uint8_t weight = ((code >> 0) & 1) + ((code >> 1) & 1) + 
                    ((code >> 2) & 1) + ((code >> 3) & 1) + ((code >> 4) & 1);
    return weight == 2;
}

/**
 * Encode digit to 2-of-5 pattern
 */
static inline uint8_t swar_two_of_five_encode(uint8_t digit) {
    static const uint8_t table[10] = {
        0x18,  // 0: 11000
        0x14,  // 1: 10100
        0x12,  // 2: 10010
        0x11,  // 3: 10001
        0x0C,  // 4: 01100
        0x0A,  // 5: 01010
        0x09,  // 6: 01001
        0x06,  // 7: 00110
        0x05,  // 8: 00101
        0x03   // 9: 00011
    };
    return table[digit % 10];
}

/**
 * Decode 2-of-5 pattern to digit
 */
static inline int8_t swar_two_of_five_decode(uint8_t code) {
    // Simple lookup - would need error correction in production
    for (int i = 0; i < 10; i++) {
        if (swar_two_of_five_encode(i) == code) return i;
    }
    return -1;
}

/**
 * Check 2-of-5 weight (should be exactly 2)
 */
static inline int swar_two_of_five_weight(uint8_t code) {
    return ((code >> 0) & 1) + ((code >> 1) & 1) + 
           ((code >> 2) & 1) + ((code >> 3) & 1) + ((code >> 4) & 1);
}

/* ============================================================================
 * BIT EXTRACTION (SIMD-like)
 * ============================================================================ */

/**
 * Extract even bits
 */
static inline uint64_t swar_even_bits(uint64_t x) {
    return x & 0xAAAAAAAAAAAAAAAAULL;
}

/**
 * Extract odd bits
 */
static inline uint64_t swar_odd_bits(uint64_t x) {
    return x & 0x5555555555555555ULL;
}

/**
 * Interleave even and odd bits (inverse of even/odd extraction)
 */
static inline uint64_t swar_interleave_bits(uint64_t even, uint64_t odd) {
    uint64_t result = 0;
    for (int i = 0; i < 32; i++) {
        if (even & (1ULL << (2*i))) result |= (1ULL << i);
        if (odd & (1ULL << (2*i))) result |= (1ULL << (i + 32));
    }
    return result;
}

/* ============================================================================
 * PARITY
 * ============================================================================ */

/**
 * Compute parity of entire word
 */
static inline bool swar_parity(uint64_t x) {
    return (__builtin_parityll(x) != 0);
}

/**
 * Compute parity of each byte lane
 */
static inline uint64_t swar_parity_bytes(uint64_t x) {
    uint64_t result = 0;
    for (int i = 0; i < 8; i++) {
        uint8_t byte = (x >> (i * 8)) & 0xFF;
        result |= ((uint64_t)(__builtin_parity(byte) ? 1 : 0) << (i * 8));
    }
    return result;
}

/* ============================================================================
 * REVERSE
 * ============================================================================ */

/**
 * Reverse bits in a 64-bit word
 */
static inline uint64_t swar_reverse_bits(uint64_t x) {
    x = ((x & 0xAAAAAAAAAAAAAAAAULL) >> 1) | ((x & 0x5555555555555555ULL) << 1);
    x = ((x & 0xCCCCCCCCCCCCCCCCULL) >> 2) | ((x & 0x3333333333333333ULL) << 2);
    x = ((x & 0xF0F0F0F0F0F0F0F0ULL) >> 4) | ((x & 0x0F0F0F0F0F0F0F0FULL) << 4);
    x = ((x & 0xFF00FF00FF00FF00ULL) >> 8) | ((x & 0x00FF00FF00FF00FFULL) << 8);
    x = ((x & 0xFFFF0000FFFF0000ULL) >> 16) | ((x & 0x0000FFFF0000FFFFULL) << 16);
    return (x >> 32) | (x << 32);
}

/**
 * Reverse bytes in a 64-bit word
 */
static inline uint64_t swar_reverse_bytes(uint64_t x) {
    x = ((x & 0xFF00FF00FF00FF00ULL) >> 8) | ((x & 0x00FF00FF00FF00FFULL) << 8);
    x = ((x & 0xFFFF0000FFFF0000ULL) >> 16) | ((x & 0x0000FFFF0000FFFFULL) << 16);
    return (x >> 32) | (x << 32);
}

/* ============================================================================
 * SATURATION
 * ============================================================================ */

/**
 * Saturating add bytes (cap at 255)
 */
static inline uint64_t swar_sat_add_bytes(uint64_t a, uint64_t b) {
    uint64_t sum = a + b;
    uint64_t carry = ((a & b) | ((a ^ b) & ~sum)) & 0x8080808080808080ULL;
    return sum ^ (carry | (carry >> 7)) | ((sum & 0x8080808080808080ULL) >> 7) * 0xFFULL;
}

/**
 * Saturating subtract bytes (floor at 0)
 */
static inline uint64_t swar_sat_sub_bytes(uint64_t a, uint64_t b) {
    uint64_t diff = a - b;
    uint64_t borrow = ((~a) & b) | (~(a ^ b) & diff);
    uint64_t borrow_mask = ((borrow & 0x8080808080808080ULL) >> 7) * 0xFFULL;
    return diff ^ borrow_mask | ((diff & 0x8080808080808080ULL) >> 7) * 0xFFULL;
}

/* ============================================================================
 * MASK GENERATION
 * ============================================================================ */

/**
 * Generate a mask with n low bits set
 */
static inline uint64_t swar_low_mask(int n) {
    if (n >= 64) return 0xFFFFFFFFFFFFFFFFULL;
    if (n <= 0) return 0;
    return (1ULL << n) - 1;
}

/**
 * Generate a mask with n high bits set
 */
static inline uint64_t swar_high_mask(int n) {
    if (n >= 64) return 0xFFFFFFFFFFFFFFFFULL;
    if (n <= 0) return 0;
    return ~((1ULL << (64 - n)) - 1);
}

/* ============================================================================
 * INTERLEAVING (FOR 2D OPERATIONS)
 * ============================================================================ */

/**
 * Interleave 32-bit halves ( Morton order / Z-order )
 */
static inline uint64_t swar_interleave_32(uint32_t a, uint32_t b) {
    uint64_t x = (uint64_t)a;
    uint64_t y = (uint64_t)b;
    x = (x | (x << 16)) & 0x0000FFFF0000FFFFULL;
    y = (y | (y << 16)) & 0x0000FFFF0000FFFFULL;
    x = (x | (x << 8)) & 0x00FF00FF00FF00FFULL;
    y = (y | (y << 8)) & 0x00FF00FF00FF00FFULL;
    x = (x | (x << 4)) & 0x0F0F0F0F0F0F0F0FULL;
    y = (y | (y << 4)) & 0x0F0F0F0F0F0F0F0FULL;
    x = (x | (x << 2)) & 0x3333333333333333ULL;
    y = (y | (y << 2)) & 0x3333333333333333ULL;
    return x | (y << 1);
}

#endif /* WOLOG_SWAR_H */