// ============================================================
// WLOG — Bit & B8 helpers
// Pure functions, no side-effects.
// ============================================================

import type { Bit, B8 } from "./types.js";
import { O, I } from "./types.js";

export function bitNot(b: Bit): Bit {
  return b === O ? I : O;
}

export function bitAnd(a: Bit, b: Bit): Bit {
  return a === I && b === I ? I : O;
}

export function bitOr(a: Bit, b: Bit): Bit {
  return a === O && b === O ? O : I;
}

export function bitXor(a: Bit, b: Bit): Bit {
  return a === b ? O : I;
}

// ------------------------------------------------------------------
// B8 operations
// ------------------------------------------------------------------

export function bitsNot([a, b, c, d, e, f, g, h]: B8): B8 {
  return [
    bitNot(a), bitNot(b), bitNot(c), bitNot(d),
    bitNot(e), bitNot(f), bitNot(g), bitNot(h),
  ];
}

export function bitsAnd(
  [a, b, c, d, e, f, g, h]: B8,
  [i, j, k, l, m, n, o, p]: B8,
): B8 {
  return [
    bitAnd(a, i), bitAnd(b, j), bitAnd(c, k), bitAnd(d, l),
    bitAnd(e, m), bitAnd(f, n), bitAnd(g, o), bitAnd(h, p),
  ];
}

export function bitsOr(
  [a, b, c, d, e, f, g, h]: B8,
  [i, j, k, l, m, n, o, p]: B8,
): B8 {
  return [
    bitOr(a, i), bitOr(b, j), bitOr(c, k), bitOr(d, l),
    bitOr(e, m), bitOr(f, n), bitOr(g, o), bitOr(h, p),
  ];
}

export function bitsXor(
  [a, b, c, d, e, f, g, h]: B8,
  [i, j, k, l, m, n, o, p]: B8,
): B8 {
  return [
    bitXor(a, i), bitXor(b, j), bitXor(c, k), bitXor(d, l),
    bitXor(e, m), bitXor(f, n), bitXor(g, o), bitXor(h, p),
  ];
}

export function rotL8([a, b, c, d, e, f, g, h]: B8): B8 {
  return [b, c, d, e, f, g, h, a];
}

export function rotR8([a, b, c, d, e, f, g, h]: B8): B8 {
  return [h, a, b, c, d, e, f, g];
}

/** Pack a B8 into an 8-bit unsigned integer (MSB = index 0). */
export function b8ToUint8([a, b, c, d, e, f, g, h]: B8): number {
  return (
    (a << 7) | (b << 6) | (c << 5) | (d << 4) |
    (e << 3) | (f << 2) | (g << 1) | h
  );
}

/** Unpack an 8-bit unsigned integer into a B8 (MSB = index 0). */
export function uint8ToB8(n: number): B8 {
  const u = n & 0xff;
  return [
    ((u >> 7) & 1) as Bit,
    ((u >> 6) & 1) as Bit,
    ((u >> 5) & 1) as Bit,
    ((u >> 4) & 1) as Bit,
    ((u >> 3) & 1) as Bit,
    ((u >> 2) & 1) as Bit,
    ((u >> 1) & 1) as Bit,
    (u & 1)        as Bit,
  ];
}

/** Format a B8 as a binary string, e.g. "0b10110010". */
export function b8ToString(bits: B8): string {
  return "0b" + bits.join("");
}
