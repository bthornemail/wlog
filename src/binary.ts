/**
 * WOLOG Binary Frame Buffer
 * 
 * BitView + DataStream pattern for efficient frame synchronization.
 * Based on bitview.js (kig) and DataStream.js patterns.
 * 
 * Used for:
 * - Frame data packing/unpacking
 * - Clock tick sync via binary payloads
 * - Worker-based frame processing
 */

// BitView - packed bit field reader/writer
export class BitView {
  buffer: ArrayBuffer;
  u8: Uint8Array;
  static test: () => boolean;
  
  constructor(buffer: ArrayBuffer | number) {
    if (typeof buffer === 'number') {
      this.buffer = new ArrayBuffer(buffer);
    } else {
      this.buffer = buffer;
    }
    this.u8 = new Uint8Array(this.buffer);
  }
  
  getBit(idx: number): number {
    const v = this.u8[idx >> 3] ?? 0;
    const off = idx & 0x7;
    return (v >> (7 - off)) & 1;
  }
  
  setBit(idx: number, val: number): void {
    const off = idx & 0x7;
    const current = this.u8[idx >> 3] ?? 0;
    if (val) {
      this.u8[idx >> 3] = current | (0x80 >> off);
    } else {
      this.u8[idx >> 3] = current & ~(0x80 >> off);
    }
  }
  
  // Signed 12-bit integer [-2048, 2047]
  getInt12(idx: number): number {
    const bidx = (idx / 8) | 0;
    const a = this.u8[bidx] ?? 0;
    const b = this.u8[bidx + 1] ?? 0;
    const c = this.u8[bidx + 2] ?? 0;
    const off = idx % 8;
    const abits = 8 - off;
    const bbits = Math.min(12 - abits, 8);
    const cbits = Math.max(12 - abits - bbits, 0);
    const am = ~(0xff << abits);
    const bm = (0xff << (8 - bbits));
    const cm = (0xff << (8 - cbits));
    return (((((a & am) << 16) + ((b & bm) << 8) + (c & cm)) >> (12 - off)) - 2048);
  }
  
  setInt12(idx: number, val: number): void {
    val += 2048;
    const bidx = (idx / 8) | 0;
    const off = idx % 8;
    const v = val << (12 - off);
    const abits = 8 - off;
    const bbits = Math.min(12 - abits, 8);
    const cbits = Math.max(12 - abits - bbits, 0);
    
    this.u8[bidx] = ((this.u8[bidx] ?? 0) & (0xff << abits)) + ((v & 0xff0000) >> 16);
    this.u8[bidx + 1] = ((this.u8[bidx + 1] ?? 0) & ~(0xff << (8 - bbits))) + ((v & 0x00ff00) >> 8);
    this.u8[bidx + 2] = ((this.u8[bidx + 2] ?? 0) & ~(0xff << (8 - cbits))) + (v & 0x0000ff);
  }
  
  // Signed 6-bit integer [-32, 31]
  getInt6(idx: number): number {
    const bidx = (idx / 8) | 0;
    const a = this.u8[bidx] ?? 0;
    const b = this.u8[bidx + 1] ?? 0;
    const off = idx % 8;
    const abits = 8 - off;
    const bbits = Math.max(6 - abits, 0);
    const am = ~((0xff << abits) + (0xff >> (8 - (2 - off))));
    const bm = (0xff << (8 - bbits));
    return ((((a & am) << 8) + (b & bm)) >> (10 - off)) - 32;
  }
  
  setInt6(idx: number, val: number): void {
    val += 32;
    const bidx = (idx / 8) | 0;
    const off = idx % 8;
    const v = val << (10 - off);
    const abits = 8 - off;
    const bbits = Math.max(6 - abits, 0);
    const am = ((0xff << abits) + (0xff >> (8 - (2 - off))));
    this.u8[bidx] = ((this.u8[bidx] ?? 0) & am) + ((v & 0xff00) >> 8);
    this.u8[bidx + 1] = ((this.u8[bidx + 1] ?? 0) & ~(0xff << (8 - bbits))) + (v & 0x00ff);
  }
  
  // Convenience: get/set unsigned 8/16/32
  getUint8(idx: number): number {
    return this.u8[idx] ?? 0;
  }
  
  setUint8(idx: number, val: number): void {
    this.u8[idx] = val & 0xff;
  }
  
  getUint16(idx: number, le: boolean = false): number {
    const a = this.u8[idx] ?? 0;
    const b = this.u8[idx + 1] ?? 0;
    if (le) {
      return a | (b << 8);
    }
    return (a << 8) | b;
  }
  
  setUint16(idx: number, val: number, le: boolean = false): void {
    if (le) {
      this.u8[idx] = val & 0xff;
      this.u8[idx + 1] = (val >> 8) & 0xff;
    } else {
      this.u8[idx] = (val >> 8) & 0xff;
      this.u8[idx + 1] = val & 0xff;
    }
  }
  
  // Slice returns a view on subset
  slice(start: number, length: number): BitView {
    const view = new BitView(this.buffer.slice(start, start + length));
    return view;
  }
}

// DataStream - read/write structured binary data
export class DataStream {
  buffer: ArrayBuffer;
  view: DataView;
  pos: number = 0;
  endian: 'big' | 'little' = 'big';
  
  constructor(buffer?: ArrayBuffer, endian: 'big' | 'little' = 'big') {
    this.buffer = buffer || new ArrayBuffer(1024);
    this.view = new DataView(this.buffer);
    this.endian = endian;
  }
  
  ensureCapacity(need: number): void {
    if (this.pos + need > this.buffer.byteLength) {
      const newBuf = new ArrayBuffer(Math.max(this.buffer.byteLength * 2, this.pos + need));
      new Uint8Array(newBuf).set(new Uint8Array(this.buffer));
      this.buffer = newBuf;
      this.view = new DataView(this.buffer);
    }
  }
  
  // Write methods
  writeUint8(val: number): void {
    this.ensureCapacity(1);
    this.view.setUint8(this.pos++, val);
  }
  
  writeInt8(val: number): void {
    this.ensureCapacity(1);
    this.view.setInt8(this.pos++, val);
  }
  
  writeUint16(val: number): void {
    this.ensureCapacity(2);
    this.view.setUint16(this.pos, val, this.endian === 'little');
    this.pos += 2;
  }
  
  writeInt16(val: number): void {
    this.ensureCapacity(2);
    this.view.setInt16(this.pos, val, this.endian === 'little');
    this.pos += 2;
  }
  
  writeUint32(val: number): void {
    this.ensureCapacity(4);
    this.view.setUint32(this.pos, val, this.endian === 'little');
    this.pos += 4;
  }
  
  writeInt32(val: number): void {
    this.ensureCapacity(4);
    this.view.setInt32(this.pos, val, this.endian === 'little');
    this.pos += 4;
  }
  
  writeFloat64(val: number): void {
    this.ensureCapacity(8);
    this.view.setFloat64(this.pos, val, this.endian === 'little');
    this.pos += 8;
  }
  
  writeBytes(arr: Uint8Array | number[]): void {
    this.ensureCapacity(arr.length);
    for (let i = 0; i < arr.length; i++) {
      this.view.setUint8(this.pos++, arr[i] as number);
    }
  }
  
  // Read methods
  readUint8(): number {
    return this.view.getUint8(this.pos++);
  }
  
  readInt8(): number {
    return this.view.getInt8(this.pos++);
  }
  
  readUint16(): number {
    const val = this.view.getUint16(this.pos, this.endian === 'little');
    this.pos += 2;
    return val;
  }
  
  readInt16(): number {
    const val = this.view.getInt16(this.pos, this.endian === 'little');
    this.pos += 2;
    return val;
  }
  
  readUint32(): number {
    const val = this.view.getUint32(this.pos, this.endian === 'little');
    this.pos += 4;
    return val;
  }
  
  readInt32(): number {
    const val = this.view.getInt32(this.pos, this.endian === 'little');
    this.pos += 4;
    return val;
  }
  
  readFloat64(): number {
    const val = this.view.getFloat64(this.pos, this.endian === 'little');
    this.pos += 8;
    return val;
  }
  
  readBytes(len: number): Uint8Array {
    const arr = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      arr[i] = this.view.getUint8(this.pos++);
    }
    return arr;
  }
  
  // Seek
  seek(pos: number): void {
    this.pos = pos;
  }
  
  tell(): number {
    return this.pos;
  }
  
  // Get buffer slice
  getBuffer(): ArrayBuffer {
    return this.buffer.slice(0, this.pos);
  }
}

// ============================================================================
// WOLOG Aztec Bitwise Embeddings
// Self-terminating bytecode for reversible field replay.
//
// Constitutional rule:
// - no polyform length/count field
// - structure is defined by replay over a 64-bit field
// - only shifts, rotations, flips, xor, and halt participate in shape replay
// ============================================================================

const MASK64 = 0xffff_ffff_ffff_ffffn;
const U64_BYTES = 8;
const OPCODE_SHIFT = 5;
const OPERAND_MASK = 0x1f;

export const AZTEC_VERSION = 0x01;

export const enum AztecOpcode {
  NOP = 0,
  SHL = 1,
  SHR = 2,
  ROL = 3,
  ROR = 4,
  FLIP = 5,
  XOR = 6,
  HALT = 7,
}

export interface AztecInstruction {
  readonly opcode: AztecOpcode;
  readonly operand: number;
  readonly immediate?: bigint;
  readonly size: number;
}

export interface AztecTraceEntry {
  readonly pc: number;
  readonly opcode: AztecOpcode;
  readonly operand: number;
  readonly before: bigint;
  readonly after: bigint;
  readonly immediate?: bigint;
  readonly witness: bigint;
}

export interface AztecReplayResult {
  readonly version: number;
  readonly seed: bigint;
  readonly finalMask: bigint;
  readonly halted: boolean;
  readonly trace: readonly AztecTraceEntry[];
}

export function mask64(value: bigint): bigint {
  return value & MASK64;
}

export function rotl64(value: bigint, shift: number): bigint {
  const s = shift & 63;
  const v = mask64(value);
  if (s === 0) {
    return v;
  }
  return mask64((v << BigInt(s)) | (v >> BigInt(64 - s)));
}

export function rotr64(value: bigint, shift: number): bigint {
  const s = shift & 63;
  const v = mask64(value);
  if (s === 0) {
    return v;
  }
  return mask64((v >> BigInt(s)) | (v << BigInt(64 - s)));
}

export function flip64(value: bigint): bigint {
  return mask64(~value);
}

export function shl64(value: bigint, shift: number): bigint {
  return mask64(value << BigInt(shift & 63));
}

export function shr64(value: bigint, shift: number): bigint {
  return mask64(value >> BigInt(shift & 63));
}

export function xor64(value: bigint, immediate: bigint): bigint {
  return mask64(value ^ immediate);
}

export function encodeAztecInstruction(
  opcode: AztecOpcode,
  operand = 0,
  immediate?: bigint,
): Uint8Array {
  const head = ((opcode & 0x7) << OPCODE_SHIFT) | (operand & OPERAND_MASK);
  if (opcode === AztecOpcode.XOR) {
    if (immediate === undefined) {
      throw new Error("XOR instruction requires a 64-bit immediate");
    }
    const out = new Uint8Array(1 + U64_BYTES);
    out[0] = head;
    writeUint64BE(out, 1, immediate);
    return out;
  }
  return Uint8Array.of(head);
}

export function decodeAztecInstruction(program: Uint8Array, pc: number): AztecInstruction {
  if (pc < 0 || pc >= program.length) {
    throw new RangeError(`Program counter out of bounds: ${pc}`);
  }
  const head = program[pc] ?? 0;
  const opcode = (head >> OPCODE_SHIFT) as AztecOpcode;
  const operand = head & OPERAND_MASK;

  if (opcode === AztecOpcode.XOR) {
    const end = pc + 1 + U64_BYTES;
    if (end > program.length) {
      throw new Error("Truncated XOR instruction");
    }
    return {
      opcode,
      operand,
      immediate: readUint64BE(program, pc + 1),
      size: 1 + U64_BYTES,
    };
  }

  return { opcode, operand, size: 1 };
}

export function assembleAztecProgram(instructions: readonly AztecInstruction[]): Uint8Array {
  const chunks = instructions.map((inst) =>
    encodeAztecInstruction(inst.opcode, inst.operand, inst.immediate),
  );
  const size = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const out = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return out;
}

export function runAztecProgram(
  program: Uint8Array,
  seed: bigint = 0x1n,
): AztecReplayResult {
  if (program.length === 0) {
    throw new Error("Aztec program must contain at least a version byte");
  }

  const version = program[0] ?? 0;
  if (version !== AZTEC_VERSION) {
    throw new Error(`Unsupported Aztec version: ${version}`);
  }

  let pc = 1;
  let witness = 0n;
  let mask = mask64(seed);
  let halted = false;
  const trace: AztecTraceEntry[] = [];

  while (pc < program.length) {
    const inst = decodeAztecInstruction(program, pc);
    const before = mask;
    let after = before;

    switch (inst.opcode) {
      case AztecOpcode.NOP:
        break;
      case AztecOpcode.SHL:
        after = shl64(before, inst.operand);
        break;
      case AztecOpcode.SHR:
        after = shr64(before, inst.operand);
        break;
      case AztecOpcode.ROL:
        after = rotl64(before, inst.operand);
        break;
      case AztecOpcode.ROR:
        after = rotr64(before, inst.operand);
        break;
      case AztecOpcode.FLIP:
        after = flip64(before);
        break;
      case AztecOpcode.XOR:
        after = xor64(before, inst.immediate ?? 0n);
        break;
      case AztecOpcode.HALT:
        halted = true;
        break;
      default:
        throw new Error(`Unknown Aztec opcode at pc=${pc}: ${inst.opcode}`);
    }

    witness = traceWitness(witness, BigInt(inst.opcode), before, after, inst.immediate ?? 0n);
    const entryBase = {
      pc,
      opcode: inst.opcode,
      operand: inst.operand,
      before,
      after,
      witness,
    };
    trace.push(
      inst.immediate === undefined
        ? entryBase
        : { ...entryBase, immediate: inst.immediate },
    );

    mask = after;
    pc += inst.size;

    if (halted) {
      break;
    }
  }

  return {
    version,
    seed: mask64(seed),
    finalMask: mask,
    halted,
    trace,
  };
}

export function appendVersion(programBody: Uint8Array): Uint8Array {
  const out = new Uint8Array(1 + programBody.length);
  out[0] = AZTEC_VERSION;
  out.set(programBody, 1);
  return out;
}

export function bytesToHex(bytes: Uint8Array): string {
  let out = "";
  for (const byte of bytes) {
    out += byte.toString(16).padStart(2, "0");
  }
  return out;
}

export function hexToBytes(hex: string): Uint8Array {
  const clean = hex.trim();
  if (clean.length % 2 !== 0) {
    throw new Error("Hex string must have even length");
  }
  if (!/^[0-9a-fA-F]*$/.test(clean)) {
    throw new Error("Hex string contains non-hex characters");
  }
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < clean.length; i += 2) {
    out[i / 2] = Number.parseInt(clean.slice(i, i + 2), 16);
  }
  return out;
}

export function xorBytes(payload: Uint8Array, key: Uint8Array): Uint8Array {
  if (key.length === 0) {
    throw new Error("XOR key must not be empty");
  }
  const out = new Uint8Array(payload.length);
  for (let i = 0; i < payload.length; i++) {
    out[i] = payload[i]! ^ key[i % key.length]!;
  }
  return out;
}

export function xorEncryptHex(payload: Uint8Array, key: Uint8Array | string): string {
  return bytesToHex(xorBytes(payload, normalizeKeyBytes(key)));
}

export function xorDecryptHex(hex: string, key: Uint8Array | string): Uint8Array {
  return xorBytes(hexToBytes(hex), normalizeKeyBytes(key));
}

export function openAztecEmbedding(
  encryptedHex: string,
  key: Uint8Array | string,
  seed: bigint = 0x1n,
): AztecReplayResult {
  return runAztecProgram(xorDecryptHex(encryptedHex, key), seed);
}

export function closeAztecEmbedding(
  program: Uint8Array,
  key: Uint8Array | string,
): string {
  return xorEncryptHex(program, key);
}

export function formatMask64(mask: bigint): string {
  return `0x${mask64(mask).toString(16).padStart(16, "0")}`;
}

export function formatTraceLog(trace: readonly AztecTraceEntry[]): string {
  const lines = [
    "tick pc opcode operand before after witness immediate",
  ];
  for (let i = 0; i < trace.length; i++) {
    const entry = trace[i]!;
    lines.push([
      i.toString().padStart(4, "0"),
      entry.pc.toString().padStart(2, "0"),
      aztecOpcodeName(entry.opcode).padEnd(5, " "),
      entry.operand.toString().padStart(2, "0"),
      formatMask64(entry.before),
      formatMask64(entry.after),
      formatMask64(entry.witness),
      entry.immediate === undefined ? "-" : formatMask64(entry.immediate),
    ].join(" "));
  }
  return lines.join("\n");
}

export function aztecOpcodeName(opcode: AztecOpcode): string {
  switch (opcode) {
    case AztecOpcode.NOP: return "NOP";
    case AztecOpcode.SHL: return "SHL";
    case AztecOpcode.SHR: return "SHR";
    case AztecOpcode.ROL: return "ROL";
    case AztecOpcode.ROR: return "ROR";
    case AztecOpcode.FLIP: return "FLIP";
    case AztecOpcode.XOR: return "XOR";
    case AztecOpcode.HALT: return "HALT";
    default: return "UNKNOWN";
  }
}

export const AZTEC_EMBEDDING_SHACL_TURTLE = `@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix wolog: <urn:wolog:property:> .

wolog:AztecEmbeddingShape a sh:NodeShape ;
  sh:targetClass wolog:AztecEmbedding ;
  sh:property [
    sh:path wolog:embeddingHex ;
    sh:datatype xsd:hexBinary ;
    sh:minLength 2 ;
    sh:pattern "^[0-9A-Fa-f]+$" ;
  ] ;
  sh:property [
    sh:path wolog:encodingMode ;
    sh:hasValue "bitwise-only" ;
  ] ;
  sh:property [
    sh:path wolog:termination ;
    sh:hasValue "HALT" ;
  ] .`;

export const AZTEC_TRACE_SHACL_TURTLE = `@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix wolog: <urn:wolog:property:> .

wolog:AztecTraceEntryShape a sh:NodeShape ;
  sh:targetClass wolog:AztecTraceEntry ;
  sh:property [
    sh:path wolog:opcode ;
    sh:in ( "SHL" "SHR" "ROL" "ROR" "FLIP" "XOR" "HALT" "NOP" ) ;
  ] ;
  sh:property [
    sh:path wolog:before ;
    sh:datatype xsd:hexBinary ;
  ] ;
  sh:property [
    sh:path wolog:after ;
    sh:datatype xsd:hexBinary ;
  ] ;
  sh:property [
    sh:path wolog:witness ;
    sh:datatype xsd:hexBinary ;
  ] .`;

function writeUint64BE(target: Uint8Array, offset: number, value: bigint): void {
  const v = mask64(value);
  for (let i = 0; i < U64_BYTES; i++) {
    const shift = BigInt((U64_BYTES - 1 - i) * 8);
    target[offset + i] = Number((v >> shift) & 0xffn);
  }
}

function readUint64BE(source: Uint8Array, offset: number): bigint {
  let out = 0n;
  for (let i = 0; i < U64_BYTES; i++) {
    out = (out << 8n) | BigInt(source[offset + i] ?? 0);
  }
  return out;
}

function traceWitness(
  previous: bigint,
  opcode: bigint,
  before: bigint,
  after: bigint,
  immediate: bigint,
): bigint {
  return rotl64(previous ^ opcode ^ before ^ after ^ immediate, 7);
}

function normalizeKeyBytes(key: Uint8Array | string): Uint8Array {
  if (typeof key !== "string") {
    return key;
  }
  return new TextEncoder().encode(key);
}

// Convert function to worker URL (for offloading frame processing)
export function fn2workerURL(fn: () => void): string {
  const blob = new Blob([`(${fn.toString()})()`], { type: 'text/javascript' });
  return URL.createObjectURL(blob);
}

// Create a worker from a function
export function createFrameWorker(
  onmessage: (data: ArrayBuffer) => ArrayBuffer
): Worker {
  const workerCode = `
    self.onmessage = function(e) {
      const result = (${onmessage.toString()})(e.data);
      self.postMessage(result, result instanceof ArrayBuffer ? [result] : []);
    };
  `;
  const blob = new Blob([workerCode], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);
  return new Worker(url);
}

// Frame structure for clock sync
export interface FramePacket {
  tick: number;          // Clock tick
  offset: number;         // Node offset
  payload: Uint8Array;    // Binary payload
  timestamp: number;      // When sent
}

// Pack frame into binary
export function packFrame(packet: FramePacket): ArrayBuffer {
  const stream = new DataStream();
  
  // Header: tick (32bit), offset (32bit), timestamp (32bit), payload length (16bit)
  stream.writeInt32(packet.tick);
  stream.writeInt32(packet.offset);
  stream.writeInt32(packet.timestamp);
  stream.writeUint16(packet.payload.length);
  
  // Payload bytes
  stream.writeBytes(packet.payload);
  
  return stream.getBuffer();
}

// Unpack frame from binary
export function unpackFrame(buffer: ArrayBuffer): FramePacket {
  const stream = new DataStream(buffer);
  
  return {
    tick: stream.readInt32(),
    offset: stream.readInt32(),
    timestamp: stream.readInt32(),
    payload: stream.readBytes(stream.readUint16())
  };
}

// Default test
BitView.test = function() {
  const buf = new ArrayBuffer(64);
  const bv = new BitView(buf);
  
  // Test 12-bit
  for (let j = 0; j < 12; j++) {
    for (let i = -2048; i < 2048; i++) {
      bv.setInt12(j, i);
      if (bv.getInt12(j) !== i) {
        console.log('12-bit fail:', j, i, bv.getInt12(j));
        return false;
      }
    }
  }
  
  // Test 6-bit
  for (let j = 0; j < 24; j++) {
    for (let i = -32; i < 32; i++) {
      bv.setInt6(j, i);
      if (bv.getInt6(j) !== i) {
        console.log('6-bit fail:', j, i, bv.getInt6(j));
        return false;
      }
    }
  }
  
  return true;
};
