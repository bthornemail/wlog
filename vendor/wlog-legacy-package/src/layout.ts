// ============================================================
// WLOG — Layout
// Deterministic mapping from Slot60 to 2D coordinates.
// ============================================================

import type { Slot60 } from "./types.js";

export interface LayoutOptions {
  readonly cellSize?: number;
  readonly gap?: number;
  readonly columns?: number;
}

export function slotToGridXY(
  slot: Slot60,
  opts: LayoutOptions = {},
): { x: number; y: number } {
  const cellSize = opts.cellSize ?? 32;
  const gap = opts.gap ?? 4;
  const columns = opts.columns ?? 12;

  const n = slot as number;
  const col = n % columns;
  const row = Math.floor(n / columns);

  return {
    x: col * (cellSize + gap),
    y: row * (cellSize + gap),
  };
}

export function gridXYToSlot(
  x: number,
  y: number,
  opts: LayoutOptions = {},
): Slot60 {
  const cellSize = opts.cellSize ?? 32;
  const gap = opts.gap ?? 4;
  const columns = opts.columns ?? 12;

  const col = Math.floor(x / (cellSize + gap));
  const row = Math.floor(y / (cellSize + gap));

  return (row * columns + col) as Slot60;
}
