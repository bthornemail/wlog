// ============================================================
// WOLOG — Polyform Core
// Shapes as data, transforms as law, replay as truth.
// ============================================================

export type PolyCellKind = "square";

export interface PolyCell {
  readonly x: number;
  readonly y: number;
  readonly kind: PolyCellKind;
}

export interface Polyform {
  readonly kind: PolyCellKind;
  readonly cells: ReadonlyMap<string, PolyCell>;
}

export type PolyTransform =
  | { readonly tag: "Seed"; readonly cell: PolyCell }
  | { readonly tag: "Join"; readonly cells: readonly PolyCell[] }
  | { readonly tag: "Split"; readonly keys: readonly string[] }
  | { readonly tag: "Move"; readonly dx: number; readonly dy: number }
  | { readonly tag: "Rotate"; readonly quarterTurns: 0 | 1 | 2 | 3 }
  | { readonly tag: "Flip"; readonly axis: "x" | "y" }
  | { readonly tag: "Merge"; readonly cells: readonly PolyCell[] }
  | { readonly tag: "Cut"; readonly keys: readonly string[] }
  | { readonly tag: "Trace" }
  | { readonly tag: "Step" }
  | { readonly tag: "Sync" }
  | { readonly tag: "Halt" };

export interface PolyReplayEntry {
  readonly tick: number;
  readonly transform: PolyTransform;
  readonly witness: string;
}

export interface PolyReplayLog {
  readonly entries: readonly PolyReplayEntry[];
  readonly halted: boolean;
}

export interface PolyWitness {
  readonly state: string;
  readonly area: number;
  readonly bounds: PolyBounds;
}

export interface PolyBounds {
  readonly minX: number;
  readonly minY: number;
  readonly maxX: number;
  readonly maxY: number;
}

export interface PolyBitboard64 {
  readonly width: 8;
  readonly height: 8;
  readonly mask: bigint;
}

export function polyCell(x: number, y: number, kind: PolyCellKind = "square"): PolyCell {
  return { x, y, kind };
}

export function polyCellKey(x: number, y: number): string {
  return `${x},${y}`;
}

export function emptyPolyform(kind: PolyCellKind = "square"): Polyform {
  return {
    kind,
    cells: new Map(),
  };
}

export function polyformFromCells(cells: readonly PolyCell[], kind: PolyCellKind = "square"): Polyform {
  const map = new Map<string, PolyCell>();
  for (const cell of cells) {
    map.set(polyCellKey(cell.x, cell.y), { ...cell, kind });
  }
  return { kind, cells: map };
}

export function polyformArea(polyform: Polyform): number {
  return polyform.cells.size;
}

export function polyformBounds(polyform: Polyform): PolyBounds {
  if (polyform.cells.size === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  }
  const cells = [...polyform.cells.values()];
  return {
    minX: Math.min(...cells.map((cell) => cell.x)),
    minY: Math.min(...cells.map((cell) => cell.y)),
    maxX: Math.max(...cells.map((cell) => cell.x)),
    maxY: Math.max(...cells.map((cell) => cell.y)),
  };
}

export function polyformWitness(polyform: Polyform): PolyWitness {
  const cells = [...polyform.cells.values()]
    .sort((a, b) => a.y - b.y || a.x - b.x)
    .map((cell) => polyCellKey(cell.x, cell.y))
    .join(";");
  return {
    state: cells,
    area: polyformArea(polyform),
    bounds: polyformBounds(polyform),
  };
}

export function applyPolyTransform(polyform: Polyform, transform: PolyTransform): Polyform {
  switch (transform.tag) {
    case "Seed":
      return polyformFromCells([transform.cell], transform.cell.kind);

    case "Join":
    case "Merge": {
      const next = new Map(polyform.cells);
      for (const cell of transform.cells) {
        next.set(polyCellKey(cell.x, cell.y), { ...cell, kind: polyform.kind });
      }
      return { kind: polyform.kind, cells: next };
    }

    case "Split":
    case "Cut": {
      const next = new Map(polyform.cells);
      for (const key of transform.keys) {
        next.delete(key);
      }
      return { kind: polyform.kind, cells: next };
    }

    case "Move": {
      const moved = [...polyform.cells.values()].map((cell) =>
        polyCell(cell.x + transform.dx, cell.y + transform.dy, polyform.kind),
      );
      return polyformFromCells(moved, polyform.kind);
    }

    case "Rotate": {
      const rotated = [...polyform.cells.values()].map((cell) => {
        switch (transform.quarterTurns) {
          case 0: return polyCell(cell.x, cell.y, polyform.kind);
          case 1: return polyCell(-cell.y, cell.x, polyform.kind);
          case 2: return polyCell(-cell.x, -cell.y, polyform.kind);
          case 3: return polyCell(cell.y, -cell.x, polyform.kind);
        }
      });
      return polyformFromCells(rotated, polyform.kind);
    }

    case "Flip": {
      const flipped = [...polyform.cells.values()].map((cell) =>
        transform.axis === "x"
          ? polyCell(cell.x, -cell.y, polyform.kind)
          : polyCell(-cell.x, cell.y, polyform.kind),
      );
      return polyformFromCells(flipped, polyform.kind);
    }

    case "Trace":
    case "Step":
    case "Sync":
    case "Halt":
      return polyform;
  }
}

export function replayPolyTransforms(
  seed: Polyform,
  transforms: readonly PolyTransform[],
): { readonly polyform: Polyform; readonly log: PolyReplayLog } {
  let current = seed;
  const entries: PolyReplayEntry[] = [];
  let halted = false;

  for (let tick = 0; tick < transforms.length; tick++) {
    const transform = transforms[tick]!;
    current = applyPolyTransform(current, transform);
    entries.push({
      tick,
      transform,
      witness: polyformWitness(current).state,
    });
    if (transform.tag === "Halt") {
      halted = true;
      break;
    }
  }

  return {
    polyform: current,
    log: { entries, halted },
  };
}

export function polyformToBitboard64(polyform: Polyform): PolyBitboard64 {
  let mask = 0n;
  for (const cell of polyform.cells.values()) {
    if (cell.x < 0 || cell.x >= 8 || cell.y < 0 || cell.y >= 8) {
      throw new RangeError(`Cell ${polyCellKey(cell.x, cell.y)} does not fit in 8x8 bitboard`);
    }
    const bit = BigInt(cell.y * 8 + cell.x);
    mask |= 1n << bit;
  }
  return {
    width: 8,
    height: 8,
    mask,
  };
}

export function isPolyformConnected(polyform: Polyform): boolean {
  const cells = [...polyform.cells.values()];
  if (cells.length <= 1) {
    return true;
  }

  const visited = new Set<string>();
  const queue: PolyCell[] = [cells[0]!];
  visited.add(polyCellKey(cells[0]!.x, cells[0]!.y));

  while (queue.length > 0) {
    const current = queue.shift()!;
    const neighbors = [
      polyCellKey(current.x + 1, current.y),
      polyCellKey(current.x - 1, current.y),
      polyCellKey(current.x, current.y + 1),
      polyCellKey(current.x, current.y - 1),
    ];
    for (const key of neighbors) {
      if (polyform.cells.has(key) && !visited.has(key)) {
        visited.add(key);
        queue.push(polyform.cells.get(key)!);
      }
    }
  }

  return visited.size === polyform.cells.size;
}
