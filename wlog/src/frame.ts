// ============================================================
// WLOG — Frame Types
// WLOG = river, frames = photographs
// ============================================================

import type { Slot60, Config, Value, WLOG } from "./types.js";
import type { UIMode, ViewportState } from "./viewport.js";

export type ChunkKey = string;

export function chunkKey(cx: number, cy: number): ChunkKey {
  return `${cx},${cy}`;
}

export function parseChunkKey(key: string): { chunkX: number; chunkY: number } | null {
  const parts = key.split(",");
  const cx = Number(parts[0]);
  const cy = Number(parts[1]);
  if (isNaN(cx) || isNaN(cy)) return null;
  return { chunkX: cx, chunkY: cy };
}

// ------------------------------------------------------------------
// WorldScene — the complete derived field from WLOG replay
// ------------------------------------------------------------------

export interface WorldScene {
  readonly revision: number;
  readonly chunks: ReadonlyMap<ChunkKey, ChunkScene>;
  readonly createdAt: number;
  readonly sourceWLOG: WLOG;
}

export interface ChunkScene {
  readonly chunkX: number;
  readonly chunkY: number;
  readonly cells: ReadonlyMap<number, Value>;
  readonly config: Config;
}

// ------------------------------------------------------------------
// FrameSpec — the rule for what to capture
// ------------------------------------------------------------------

export interface Bounds {
  readonly minX: number;
  readonly minY: number;
  readonly maxX: number;
  readonly maxY: number;
}

export interface InfiniteAddress {
  readonly chunkX: number;
  readonly chunkY: number;
  readonly slot: Slot60;
}

export type FrameSpec =
  | { readonly tag: "Region"; readonly bounds: Bounds }
  | { readonly tag: "Focus"; readonly focus: InfiniteAddress; readonly radius: number }
  | { readonly tag: "Selection"; readonly addresses: readonly InfiniteAddress[] }
  | { readonly tag: "Viewport"; readonly viewport: ViewportState }
  | { readonly tag: "Full"; readonly chunkFilter?: (cx: number, cy: number) => boolean };

// ------------------------------------------------------------------
// FrameSnapshot — the frozen artifact
// ------------------------------------------------------------------

export interface FrameSnapshot {
  readonly frameId: string;
  readonly worldRevision: number;
  readonly createdAt: number;
  readonly spec: FrameSpec;
  readonly scene: BoundedScene;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface BoundedScene {
  readonly bounds: Bounds;
  readonly cells: ReadonlyMap<string, CellSnapshot>;
  readonly chunks: ReadonlyArray<ChunkKey>;
}

export interface CellSnapshot {
  readonly address: InfiniteAddress;
  readonly value: Value;
  readonly config: Config;
}

// ------------------------------------------------------------------
// RenderSource — what the viewport looks at
// ------------------------------------------------------------------

export type RenderSource =
  | { readonly tag: "Live"; readonly world: WorldScene }
  | { readonly tag: "Frame"; readonly frame: FrameSnapshot }
  | { readonly tag: "Compare"; readonly left: RenderSource; readonly right: RenderSource };

// ------------------------------------------------------------------
// FrameStatus — relevance tracking
// ------------------------------------------------------------------

export interface FrameStatus {
  readonly frameId: string;
  readonly frameRevision: number;
  readonly currentRevision: number;
  readonly isCurrent: boolean;
  readonly stepDelta: number;
  readonly isStale: boolean;
}

// ------------------------------------------------------------------
// FrameDiff — comparison result
// ------------------------------------------------------------------

export interface FrameDiff {
  readonly added: CellSnapshot[];
  readonly removed: CellSnapshot[];
  readonly changed: Array<{ before: CellSnapshot; after: CellSnapshot }>;
  readonly unchanged: CellSnapshot[];
}

// ------------------------------------------------------------------
// Helper functions
// ------------------------------------------------------------------

export function addressKey(addr: InfiniteAddress): string {
  return `${addr.chunkX},${addr.chunkY},${addr.slot}`;
}

export function parseAddressKey(key: string): InfiniteAddress | null {
  const parts = key.split(",");
  if (parts.length !== 3) return null;
  const p0 = parts[0];
  const p1 = parts[1];
  const p2 = parts[2];
  if (!p0 || !p1 || !p2) return null;
  const cx = parseInt(p0, 10);
  const cy = parseInt(p1, 10);
  const slot = parseInt(p2, 10);
  if (isNaN(cx) || isNaN(cy) || isNaN(slot)) return null;
  return {
    chunkX: cx,
    chunkY: cy,
    slot: slot as Slot60,
  };
}

export function emptyBounds(): Bounds {
  return { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
}

export function expandBounds(b: Bounds, x: number, y: number): Bounds {
  return {
    minX: Math.min(b.minX, x),
    minY: Math.min(b.minY, y),
    maxX: Math.max(b.maxX, x),
    maxY: Math.max(b.maxY, y),
  };
}

export function boundsArea(b: Bounds): number {
  return (b.maxX - b.minX) * (b.maxY - b.minY);
}
