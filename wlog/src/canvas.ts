// ============================================================
// WLOG — Infinite Canvas
//
// Extends Slot60 to an infinite plane:
//   Address = ChunkX × ChunkY × Slot60
//
// Peers share WLOG programs (not DOM state).
// Serialization helpers produce JSON-safe plain objects.
// ============================================================

import type {
  WLOG, Program, LOG, Opcode, Expr, Header,
  Marker, Clock, ConfigSeed,
  Slot60, Tile16, Mode4, Line7, Point3, B8, Bit,
  Orientation, Base,
} from "./types.js";
import { slot, b8, O, I, Step, Done, log_ } from "./types.js";

// ------------------------------------------------------------------
// Infinite address
// ------------------------------------------------------------------

export interface InfiniteAddress {
  readonly chunkX: number;
  readonly chunkY: number;
  readonly slot: Slot60;
}

/** Hash a 2-D pixel coordinate into an InfiniteAddress. */
export function pixelToAddress(
  px: number,
  py: number,
  chunkSize: number = 60,
): InfiniteAddress {
  const chunkX = Math.floor(px / chunkSize);
  const chunkY = Math.floor(py / chunkSize);
  const localIndex = ((px % chunkSize) + chunkSize) % chunkSize;
  return { chunkX, chunkY, slot: slot(localIndex) };
}

/** Inverse: from an InfiniteAddress back to a pixel origin. */
export function addressToPixel(
  addr: InfiniteAddress,
  chunkSize: number = 60,
): { px: number; py: number } {
  return {
    px: addr.chunkX * chunkSize + addr.slot,
    py: addr.chunkY * chunkSize,
  };
}

// ------------------------------------------------------------------
// Peer message format (JSON-safe)
// ------------------------------------------------------------------

export interface PeerMessage {
  readonly type:    "WLOG_APPEND";
  readonly chunkX:  number;
  readonly chunkY:  number;
  readonly log:     SerializedLOG;
  readonly lamport: number;   // Lamport timestamp for ordering
}

export interface SerializedLOG {
  readonly slot:   number;
  readonly opcode: string;    // JSON.stringify of Opcode
}

export function serializeLOG(l: LOG): SerializedLOG {
  return { slot: l.slot, opcode: JSON.stringify(l.opcode) };
}

export function deserializeLOG(s: SerializedLOG): LOG {
  return log_(slot(s.slot), JSON.parse(s.opcode) as Opcode);
}

export function makePeerMessage(
  chunkX: number,
  chunkY: number,
  l: LOG,
  lamport: number,
): PeerMessage {
  return { type: "WLOG_APPEND", chunkX, chunkY, log: serializeLOG(l), lamport };
}

// ------------------------------------------------------------------
// Lamport clock (immutable)
// ------------------------------------------------------------------

export function tickLamport(local: number, received?: number): number {
  return Math.max(local, received ?? 0) + 1;
}

// ------------------------------------------------------------------
// Program helpers — append a LOG to an existing Program
// ------------------------------------------------------------------

export function programAppend(prog: Program, l: LOG): Program {
  if (prog.tag === "Done") return Step(l, Done());
  return Step(prog.log, programAppend(prog.rest, l));
}

export function programFromLogs(logs: readonly LOG[]): Program {
  let p: Program = Done();
  for (let i = logs.length - 1; i >= 0; i--) {
    p = Step(logs[i]!, p);
  }
  return p;
}

export function programToLogs(prog: Program): LOG[] {
  const out: LOG[] = [];
  let p = prog;
  while (p.tag === "Step") {
    out.push(p.log);
    p = p.rest;
  }
  return out;
}

// ------------------------------------------------------------------
// ChunkStore — multi-chunk WLOG registry
// ------------------------------------------------------------------

export type ChunkKey = `${number},${number}`;

export function chunkKey(chunkX: number, chunkY: number): ChunkKey {
  return `${chunkX},${chunkY}`;
}

export interface ChunkStore {
  readonly chunks: ReadonlyMap<ChunkKey, WLOG>;
}

export function emptyChunkStore(): ChunkStore {
  return { chunks: new Map() };
}

export function getChunk(store: ChunkStore, cx: number, cy: number): WLOG | undefined {
  return store.chunks.get(chunkKey(cx, cy));
}

export function putChunk(
  store: ChunkStore,
  cx: number,
  cy: number,
  wlog: WLOG,
): ChunkStore {
  const next = new Map(store.chunks);
  next.set(chunkKey(cx, cy), wlog);
  return { chunks: next };
}

/** Apply a peer message to a ChunkStore, creating the chunk if absent. */
export function applyPeerMessage(
  store: ChunkStore,
  msg: PeerMessage,
  makeDefaultWLOG: (cx: number, cy: number) => WLOG,
): ChunkStore {
  const key = chunkKey(msg.chunkX, msg.chunkY);
  const existing = store.chunks.get(key) ?? makeDefaultWLOG(msg.chunkX, msg.chunkY);
  const newLog   = deserializeLOG(msg.log);
  const updated: WLOG = {
    ...existing,
    program: programAppend(existing.program, newLog),
  };
  return putChunk(store, msg.chunkX, msg.chunkY, updated);
}
