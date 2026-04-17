// ============================================================
// WLOG — Core Types
// Direct port of the Haskell type layer.
// All ADTs are modelled as discriminated unions or branded
// number types so the compiler enforces exhaustive matching.
// ============================================================

// ------------------------------------------------------------------
// Primitives
// ------------------------------------------------------------------

export type Bit = 0 | 1;

export const O: Bit = 0;
export const I: Bit = 1;

/** 60-position address space. */
export type Slot60 = number & { readonly __slot60: unique symbol };

export function slot(n: number): Slot60 {
  if (n < 0 || n > 59 || !Number.isInteger(n)) {
    throw new RangeError(`Slot60 must be 0–59, got ${n}`);
  }
  return n as Slot60;
}

/** Infinite-canvas chunk coordinate. */
export interface ChunkCoord {
  readonly chunkX: number;
  readonly chunkY: number;
  readonly slot: Slot60;
}

export function chunkCoord(chunkX: number, chunkY: number, s: Slot60): ChunkCoord {
  return { chunkX, chunkY, slot: s };
}

// ------------------------------------------------------------------
// Enumerations (= Haskell data with no fields)
// ------------------------------------------------------------------

export type Base = "Base60";

export type Orientation =
  | "Identity"
  | "Reverse"
  | "Swap"
  | "Rotate180"
  | "Peer";

export type Mode4 = "XX" | "Xx" | "xX" | "xx";

export type Line7 = "L0" | "L1" | "L2" | "L3" | "L4" | "L5" | "L6";

export type Point3 = "P0" | "P1" | "P2";

export type Tile16 =
  | "T0" | "T1" | "T2" | "T3"
  | "T4" | "T5" | "T6" | "T7"
  | "T8" | "T9" | "TA" | "TB"
  | "TC" | "TD" | "TE" | "TF";

// ------------------------------------------------------------------
// B8 — eight-bit register
// ------------------------------------------------------------------

export type B8 = readonly [Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit];

export function b8(
  a: Bit, b: Bit, c: Bit, d: Bit,
  e: Bit, f: Bit, g: Bit, h: Bit,
): B8 {
  return [a, b, c, d, e, f, g, h];
}

export const ZERO_B8: B8 = [O, O, O, O, O, O, O, O];

// ------------------------------------------------------------------
// Expr — expression payload
// ------------------------------------------------------------------

export type Expr =
  | { readonly tag: "EXOR";     readonly a: Expr; readonly b: Expr }
  | { readonly tag: "EAND";     readonly a: Expr; readonly b: Expr }
  | { readonly tag: "EOR";      readonly a: Expr; readonly b: Expr }
  | { readonly tag: "ENOT";     readonly e: Expr }
  | { readonly tag: "ENOR";     readonly a: Expr; readonly b: Expr }
  | { readonly tag: "ENAND";    readonly a: Expr; readonly b: Expr }
  | { readonly tag: "EMONAD";   readonly e: Expr }
  | { readonly tag: "EFUNCTOR"; readonly e: Expr; readonly f: Expr }
  | { readonly tag: "ETile";    readonly tile: Tile16 }
  | { readonly tag: "EMode";    readonly mode: Mode4 }
  | { readonly tag: "ESlot";    readonly slot: Slot60 }
  | { readonly tag: "EBits";    readonly bits: B8 };

// Smart constructors
export const EXOR     = (a: Expr, b: Expr): Expr => ({ tag: "EXOR", a, b });
export const EAND     = (a: Expr, b: Expr): Expr => ({ tag: "EAND", a, b });
export const EOR      = (a: Expr, b: Expr): Expr => ({ tag: "EOR",  a, b });
export const ENOT     = (e: Expr):           Expr => ({ tag: "ENOT", e });
export const ENOR     = (a: Expr, b: Expr): Expr => ({ tag: "ENOR", a, b });
export const ENAND    = (a: Expr, b: Expr): Expr => ({ tag: "ENAND", a, b });
export const EMONAD   = (e: Expr):           Expr => ({ tag: "EMONAD", e });
export const EFUNCTOR = (e: Expr, f: Expr): Expr => ({ tag: "EFUNCTOR", e, f });
export const ETile    = (tile: Tile16):      Expr => ({ tag: "ETile", tile });
export const EMode    = (mode: Mode4):       Expr => ({ tag: "EMode", mode });
export const ESlot    = (s: Slot60):         Expr => ({ tag: "ESlot", slot: s });
export const EBits    = (bits: B8):          Expr => ({ tag: "EBits", bits });

// ------------------------------------------------------------------
// Value — runtime result of evaluating an Expr
// ------------------------------------------------------------------

export type Value =
  | { readonly tag: "VBit";  readonly bit: Bit }
  | { readonly tag: "VTile"; readonly tile: Tile16 }
  | { readonly tag: "VMode"; readonly mode: Mode4 }
  | { readonly tag: "VSlot"; readonly slot: Slot60 }
  | { readonly tag: "VBits"; readonly bits: B8 };

export const VBit  = (bit: Bit):    Value => ({ tag: "VBit",  bit });
export const VTile = (tile: Tile16): Value => ({ tag: "VTile", tile });
export const VMode = (mode: Mode4): Value => ({ tag: "VMode", mode });
export const VSlot = (s: Slot60):   Value => ({ tag: "VSlot", slot: s });
export const VBits = (bits: B8):    Value => ({ tag: "VBits", bits });

// ------------------------------------------------------------------
// Opcode
// ------------------------------------------------------------------

export type Opcode =
  | { readonly tag: "Sync" }
  | { readonly tag: "Wait" }
  | { readonly tag: "RotateL" }
  | { readonly tag: "RotateR" }
  | { readonly tag: "Join" }
  | { readonly tag: "Split" }
  | { readonly tag: "Emit";     readonly expr: Expr }
  | { readonly tag: "Hash";     readonly expr: Expr }
  | { readonly tag: "Map";      readonly expr: Expr }
  | { readonly tag: "Load";     readonly tile: Tile16 }
  | { readonly tag: "SetMode";  readonly mode: Mode4 }
  | { readonly tag: "SetLine";  readonly line: Line7 }
  | { readonly tag: "SetPoint"; readonly point: Point3 };

export const Sync     = (): Opcode => ({ tag: "Sync" });
export const Wait     = (): Opcode => ({ tag: "Wait" });
export const RotateL  = (): Opcode => ({ tag: "RotateL" });
export const RotateR  = (): Opcode => ({ tag: "RotateR" });
export const Join     = (): Opcode => ({ tag: "Join" });
export const Split    = (): Opcode => ({ tag: "Split" });
export const Emit     = (expr: Expr):   Opcode => ({ tag: "Emit",     expr });
export const Hash     = (expr: Expr):   Opcode => ({ tag: "Hash",     expr });
export const Map      = (expr: Expr):   Opcode => ({ tag: "Map",      expr });
export const Load     = (tile: Tile16): Opcode => ({ tag: "Load",     tile });
export const SetMode  = (mode: Mode4):  Opcode => ({ tag: "SetMode",  mode });
export const SetLine  = (line: Line7):  Opcode => ({ tag: "SetLine",  line });
export const SetPoint = (point: Point3): Opcode => ({ tag: "SetPoint", point });

// ------------------------------------------------------------------
// LOG — one scheduled action
// ------------------------------------------------------------------

export interface LOG {
  readonly slot: Slot60;
  readonly opcode: Opcode;
}

export function log_(slot: Slot60, opcode: Opcode): LOG {
  return { slot, opcode };
}

// ------------------------------------------------------------------
// Program — linked list of steps
// ------------------------------------------------------------------

export type Program =
  | { readonly tag: "Done" }
  | { readonly tag: "Step"; readonly log: LOG; readonly rest: Program };

export const Done = (): Program => ({ tag: "Done" });
export const Step = (l: LOG, rest: Program): Program => ({ tag: "Step", log: l, rest });

// ------------------------------------------------------------------
// Header, Marker, Clock, ConfigSeed
// ------------------------------------------------------------------

export interface Marker    { readonly orientation: Orientation }
export interface Clock     { readonly base: Base }
export interface ConfigSeed {
  readonly slot: Slot60;
  readonly mode: Mode4;
  readonly line: Line7;
  readonly point: Point3;
  readonly tile: Tile16;
}
export interface Header {
  readonly marker: Marker;
  readonly clock: Clock;
  readonly seed: ConfigSeed;
}

// ------------------------------------------------------------------
// WLOG — canonical typed schedule (the closed shared object)
// ------------------------------------------------------------------

export interface WLOG {
  readonly orientation: Orientation;
  readonly base: Base;
  readonly header: Header;
  readonly program: Program;
}

// ------------------------------------------------------------------
// Config — mutable runtime state (never mutated in place; replaced)
// ------------------------------------------------------------------

export interface Config {
  readonly slot: Slot60;
  readonly mode: Mode4;
  readonly line: Line7;
  readonly point: Point3;
  readonly tile: Tile16;
  readonly bits: B8;
}

// ------------------------------------------------------------------
// Runtime
// ------------------------------------------------------------------

export interface Runtime {
  readonly header: Header;
  readonly config: Config;
  readonly program: Program;
}

// ------------------------------------------------------------------
// Event — observable receipt
// ------------------------------------------------------------------

export type Event =
  | { readonly tag: "EventSync";    readonly slot: Slot60 }
  | { readonly tag: "EventWait";    readonly slot: Slot60 }
  | { readonly tag: "EventEmit";    readonly slot: Slot60; readonly value: Value }
  | { readonly tag: "EventHash";    readonly slot: Slot60; readonly value: Value }
  | { readonly tag: "EventMap";     readonly slot: Slot60; readonly value: Value }
  | { readonly tag: "EventRotateL"; readonly slot: Slot60 }
  | { readonly tag: "EventRotateR"; readonly slot: Slot60 }
  | { readonly tag: "EventJoin";    readonly slot: Slot60 }
  | { readonly tag: "EventSplit";   readonly slot: Slot60 }
  | { readonly tag: "EventLoad";    readonly slot: Slot60; readonly tile: Tile16 }
  | { readonly tag: "EventSetMode"; readonly slot: Slot60; readonly mode: Mode4 }
  | { readonly tag: "EventSetLine"; readonly slot: Slot60; readonly line: Line7 }
  | { readonly tag: "EventSetPoint"; readonly slot: Slot60; readonly point: Point3 };
