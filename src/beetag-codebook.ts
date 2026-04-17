import { BEETAG_MASTER_D3_BASE64, BEETAG_MASTER_D3_COUNT } from "./beetag-codebook-data.js";

export type BeeTagCodebookMode = "authoritative-mat" | "computed";

let cachedAuthoritative: readonly number[] | null = null;
let cachedComputed: readonly number[] | null = null;
let mode: BeeTagCodebookMode = "authoritative-mat";

export function setBeeTagCodebookMode(next: BeeTagCodebookMode): void {
  mode = next;
}

export function getBeeTagCodebookMode(): BeeTagCodebookMode {
  return mode;
}

export function getAuthoritativeBeeTagCodebook(): readonly number[] {
  if (cachedAuthoritative) {
    return cachedAuthoritative;
  }
  const bytes = decodeBase64(BEETAG_MASTER_D3_BASE64);
  const ids: number[] = [];
  for (let i = 0; i + 1 < bytes.length; i += 2) {
    const value = bytes[i]! | (bytes[i + 1]! << 8);
    if (value > 0) {
      ids.push(value);
    }
  }
  if (ids.length !== BEETAG_MASTER_D3_COUNT) {
    throw new Error(
      `Authoritative BEEtag codebook decode mismatch: expected ${BEETAG_MASTER_D3_COUNT}, got ${ids.length}`,
    );
  }
  cachedAuthoritative = ids;
  return cachedAuthoritative;
}

export function setComputedBeeTagCodebook(ids: readonly number[]): void {
  cachedComputed = validateCodebook(ids);
}

export function getComputedBeeTagCodebook(): readonly number[] | null {
  return cachedComputed;
}

export function getActiveBeeTagCodebook(): readonly number[] {
  if (mode === "authoritative-mat") {
    return getAuthoritativeBeeTagCodebook();
  }
  if (!cachedComputed) {
    throw new Error("Computed BEEtag codebook is not initialized");
  }
  return cachedComputed;
}

function validateCodebook(ids: readonly number[]): readonly number[] {
  if (ids.length === 0) {
    throw new RangeError("BEEtag codebook cannot be empty");
  }
  const unique = new Set<number>();
  for (const id of ids) {
    if (!Number.isInteger(id) || id < 1 || id > 32767) {
      throw new RangeError("BEEtag codebook ids must be integers between 1 and 32767");
    }
    unique.add(id);
  }
  return [...unique].sort((a, b) => a - b);
}

function decodeBase64(value: string): Uint8Array {
  if (typeof atob === "function") {
    const bin = atob(value);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
      out[i] = bin.charCodeAt(i);
    }
    return out;
  }
  // Environment fallback without atob.
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  const clean = value.replace(/=+$/g, "");
  const bytes: number[] = [];
  let buffer = 0;
  let bits = 0;
  for (const ch of clean) {
    const code = alphabet.indexOf(ch);
    if (code < 0) {
      continue;
    }
    buffer = (buffer << 6) | code;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      bytes.push((buffer >> bits) & 0xff);
    }
  }
  return new Uint8Array(bytes);
}
