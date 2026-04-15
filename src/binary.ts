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
  
  constructor(buffer: ArrayBuffer | number) {
    if (typeof buffer === 'number') {
      this.buffer = new ArrayBuffer(buffer);
    } else {
      this.buffer = buffer;
    }
    this.u8 = new Uint8Array(this.buffer);
  }
  
  getBit(idx: number): number {
    const v = this.u8[idx >> 3];
    const off = idx & 0x7;
    return (v >> (7 - off)) & 1;
  }
  
  setBit(idx: number, val: number): void {
    const off = idx & 0x7;
    if (val) {
      this.u8[idx >> 3] |= (0x80 >> off);
    } else {
      this.u8[idx >> 3] &= ~(0x80 >> off);
    }
  }
  
  // Signed 12-bit integer [-2048, 2047]
  getInt12(idx: number): number {
    const bidx = (idx / 8) | 0;
    const a = this.u8[bidx];
    const b = this.u8[bidx + 1];
    const c = this.u8[bidx + 2];
    const off = idx % 8;
    const abits = 8 - off;
    const bbits = Math.min(12 - abits, 8);
    const cbits = Math.max(12 - abits - bbits, 0);
    const am = ~(0xff << abits);
    const bm = (0xff << (8 - bbits));
    const cm = (0xff << (8 - cbits));
    return (((((a & am) << 16) + ((b & bm) << 8) + (c & cm)) >> (12 - off)) - 2048;
  }
  
  setInt12(idx: number, val: number): void {
    val += 2048;
    const bidx = (idx / 8) | 0;
    const off = idx % 8;
    const v = val << (12 - off);
    const abits = 8 - off;
    const bbits = Math.min(12 - abits, 8);
    const cbits = Math.max(12 - abits - bbits, 0);
    
    this.u8[bidx] = (this.u8[bidx] & (0xff << abits)) + ((v & 0xff0000) >> 16);
    this.u8[bidx + 1] = (this.u8[bidx + 1] & ~(0xff << (8 - bbits))) + ((v & 0x00ff00) >> 8);
    this.u8[bidx + 2] = (this.u8[bidx + 2] & ~(0xff << (8 - cbits))) + (v & 0x0000ff);
  }
  
  // Signed 6-bit integer [-32, 31]
  getInt6(idx: number): number {
    const bidx = (idx / 8) | 0;
    const a = this.u8[bidx];
    const b = this.u8[bidx + 1];
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
    this.u8[bidx] = (this.u8[bidx] & am) + ((v & 0xff00) >> 8);
    this.u8[bidx + 1] = (this.u8[bidx + 1] & ~(0xff << (8 - bbits))) + (v & 0x00ff);
  }
  
  // Convenience: get/set unsigned 8/16/32
  getUint8(idx: number): number {
    return this.u8[idx];
  }
  
  setUint8(idx: number, val: number): void {
    this.u8[idx] = val & 0xff;
  }
  
  getUint16(idx: number, le: boolean = false): number {
    if (le) {
      return this.u8[idx] | (this.u8[idx + 1] << 8);
    }
    return (this.u8[idx] << 8) | this.u8[idx + 1];
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
