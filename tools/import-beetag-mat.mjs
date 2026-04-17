#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const [, , inputPath, outputPath] = process.argv;

if (!inputPath || !outputPath) {
  console.error("Usage: node tools/import-beetag-mat.mjs <input.mat> <output.ts>");
  process.exit(1);
}

const MI = {
  INT8: 1,
  UINT8: 2,
  INT16: 3,
  UINT16: 4,
  INT32: 5,
  UINT32: 6,
  SINGLE: 7,
  DOUBLE: 9,
  MATRIX: 14,
  COMPRESSED: 15,
};

function align8(n) {
  return (n + 7) & ~7;
}

function parseElements(buffer, littleEndian) {
  const out = [];
  let offset = 0;
  while (offset + 8 <= buffer.length) {
    const rawTag = buffer.readUInt32LE(offset);
    let type;
    let size;
    let dataOffset;
    let bytesConsumed;
    const smallData = (rawTag >> 16) !== 0;
    if (smallData) {
      type = rawTag & 0xffff;
      size = rawTag >>> 16;
      dataOffset = offset + 4;
      bytesConsumed = 8;
    } else {
      type = littleEndian ? buffer.readUInt32LE(offset) : buffer.readUInt32BE(offset);
      size = littleEndian ? buffer.readUInt32LE(offset + 4) : buffer.readUInt32BE(offset + 4);
      dataOffset = offset + 8;
      bytesConsumed = 8 + align8(size);
    }
    if (size < 0 || dataOffset + size > buffer.length) {
      break;
    }
    out.push({ type, size, dataOffset, nextOffset: offset + bytesConsumed, smallData });
    offset += bytesConsumed;
  }
  return out;
}

function parseMatrixElement(buffer, littleEndian) {
  const elements = parseElements(buffer, littleEndian);
  let name = "";
  let dims = [];
  let real = null;
  let sawName = false;
  for (const el of elements) {
    if (el.type === MI.INT32) {
      const dimCount = Math.floor(el.size / 4);
      dims = Array.from({ length: dimCount }, (_, i) =>
        littleEndian ? buffer.readInt32LE(el.dataOffset + i * 4) : buffer.readInt32BE(el.dataOffset + i * 4),
      );
    } else if (el.type === MI.INT8) {
      const candidate = buffer.toString("utf8", el.dataOffset, el.dataOffset + el.size).replace(/\0+$/g, "");
      if (!sawName && /^[A-Za-z_]\w*$/.test(candidate)) {
        name = candidate;
        sawName = true;
      }
    } else if (el.type === MI.DOUBLE || el.type === MI.UINT16 || el.type === MI.UINT32) {
      if (el.type === MI.DOUBLE) {
        const count = Math.floor(el.size / 8);
        real = Array.from({ length: count }, (_, i) =>
          littleEndian ? buffer.readDoubleLE(el.dataOffset + i * 8) : buffer.readDoubleBE(el.dataOffset + i * 8),
        );
      } else if (el.type === MI.UINT16) {
        const count = Math.floor(el.size / 2);
        real = Array.from({ length: count }, (_, i) =>
          littleEndian ? buffer.readUInt16LE(el.dataOffset + i * 2) : buffer.readUInt16BE(el.dataOffset + i * 2),
        );
      } else {
        const count = Math.floor(el.size / 4);
        real = Array.from({ length: count }, (_, i) =>
          littleEndian ? buffer.readUInt32LE(el.dataOffset + i * 4) : buffer.readUInt32BE(el.dataOffset + i * 4),
        );
      }
    }
  }
  return { name, dims, real };
}

function parseMatFile(fileBuffer) {
  if (fileBuffer.length < 128) {
    throw new Error("MAT file too small");
  }
  const endianIndicator = fileBuffer.toString("ascii", 126, 128);
  const littleEndian = endianIndicator === "IM";
  const payload = fileBuffer.subarray(128);
  const top = parseElements(payload, littleEndian);
  const vars = new Map();
  for (const el of top) {
    if (el.type === MI.COMPRESSED) {
      const inflated = zlib.inflateSync(payload.subarray(el.dataOffset, el.dataOffset + el.size));
      const compressedElements = parseElements(inflated, littleEndian);
      for (const inner of compressedElements) {
        if (inner.type !== MI.MATRIX) {
          continue;
        }
        const matrixBytes = inflated.subarray(inner.dataOffset, inner.dataOffset + inner.size);
        const matrix = parseMatrixElement(matrixBytes, littleEndian);
        if (matrix.name && matrix.real) {
          vars.set(matrix.name, matrix);
        }
      }
    } else if (el.type === MI.MATRIX) {
      const matrixBytes = payload.subarray(el.dataOffset, el.dataOffset + el.size);
      const matrix = parseMatrixElement(matrixBytes, littleEndian);
      if (matrix.name && matrix.real) {
        vars.set(matrix.name, matrix);
      }
    }
  }
  return vars;
}

function encodeUint16Base64(values) {
  const bytes = Buffer.alloc(values.length * 2);
  values.forEach((v, i) => {
    bytes.writeUInt16LE(v, i * 2);
  });
  return bytes.toString("base64");
}

const inputBuffer = fs.readFileSync(path.resolve(inputPath));
const vars = parseMatFile(inputBuffer);
const grand = vars.get("grand");
if (!grand || !grand.real) {
  throw new Error("Could not find variable 'grand' in MAT file");
}
const ids = grand.real.map((n) => Math.trunc(n)).filter((n) => Number.isFinite(n) && n > 0);
const base64 = encodeUint16Base64(ids);

const out = `/* Auto-generated from ${path.basename(inputPath)} via tools/import-beetag-mat.mjs */
export const BEETAG_MASTER_D3_COUNT = ${ids.length} as const;
export const BEETAG_MASTER_D3_BASE64 = "${base64}";
`;

fs.writeFileSync(path.resolve(outputPath), out, "utf8");
console.log(`Wrote ${ids.length} ids to ${outputPath}`);
