// ============================================================
// WLOG — Scene
// Shared scene model and deterministic event reduction.
// ============================================================

import type { Slot60, Tile16, Mode4, Value, Event } from "./types.js";
import { slot } from "./types.js";
import { slotToGridXY } from "./layout.js";

// ------------------------------------------------------------------
// Scene Types
// ------------------------------------------------------------------

export interface SceneCell {
  readonly slot: Slot60;
  readonly x: number;
  readonly y: number;
  readonly tile?: Tile16;
  readonly mode?: Mode4;
  readonly value?: Value;
  readonly state?: "idle" | "emit" | "join" | "split" | "wait" | "hash" | "map";
  readonly rotationQuarterTurns?: 0 | 1 | 2 | 3;
  readonly classes?: readonly string[];
  readonly data?: Readonly<Record<string, string>>;
}

export interface SceneFrame {
  readonly tick: number;
  readonly activeSlot?: Slot60;
  readonly title?: string;
}

export interface Scene {
  readonly frame: SceneFrame;
  readonly cells: ReadonlyMap<number, SceneCell>;
}

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------

function valueToData(value: Value): Record<string, string> {
  switch (value.tag) {
    case "VBit":
      return { valueKind: "bit", bit: String(value.bit) };
    case "VTile":
      return { valueKind: "tile", tile: value.tile };
    case "VMode":
      return { valueKind: "mode", mode: value.mode };
    case "VSlot":
      return { valueKind: "slot", slot: String(value.slot) };
    case "VBits":
      return {
        valueKind: "bits",
        bits: value.bits.join(""),
      };
  }
}

function updateCell(
  scene: Scene,
  slotNum: number,
  patch: Partial<SceneCell>,
): Scene {
  const prev = scene.cells.get(slotNum);
  if (!prev) return scene;

  const nextCells = new Map(scene.cells);
  nextCells.set(slotNum, { ...prev, ...patch });

  return {
    ...scene,
    cells: nextCells,
  };
}

// ------------------------------------------------------------------
// Scene Initialization
// ------------------------------------------------------------------

export function emptyScene(): Scene {
  const cells = new Map<number, SceneCell>();

  for (let i = 0; i < 60; i++) {
    const s = slot(i);
    const { x, y } = slotToGridXY(s);
    cells.set(i, {
      slot: s,
      x,
      y,
      state: "idle",
      rotationQuarterTurns: 0,
      classes: [],
      data: {},
    });
  }

  return {
    frame: { tick: 0 },
    cells,
  };
}

export function createScene(): Scene {
  return emptyScene();
}

// ------------------------------------------------------------------
// Event Reduction
// ------------------------------------------------------------------

export function reduceEvent(scene: Scene, event: Event): Scene {
  const slotNum = event.slot as number;

  let next: Scene = {
    ...scene,
    frame: {
      ...scene.frame,
      tick: scene.frame.tick + 1,
      activeSlot: event.slot,
    },
  };

  switch (event.tag) {
    case "EventSync":
      return updateCell(next, slotNum, { state: "idle" });

    case "EventWait":
      return updateCell(next, slotNum, { state: "wait" });

    case "EventJoin":
      return updateCell(next, slotNum, { state: "join" });

    case "EventSplit":
      return updateCell(next, slotNum, { state: "split" });

    case "EventRotateL": {
      const cell = next.cells.get(slotNum)!;
      const rot = (((cell.rotationQuarterTurns ?? 0) + 1) % 4) as 0 | 1 | 2 | 3;
      return updateCell(next, slotNum, {
        state: "idle",
        rotationQuarterTurns: rot,
      });
    }

    case "EventRotateR": {
      const cell = next.cells.get(slotNum)!;
      const rot = (((cell.rotationQuarterTurns ?? 0) + 3) % 4) as 0 | 1 | 2 | 3;
      return updateCell(next, slotNum, {
        state: "idle",
        rotationQuarterTurns: rot,
      });
    }

    case "EventEmit":
      return updateCell(next, slotNum, {
        state: "emit",
        value: event.value,
        data: valueToData(event.value),
      });

    case "EventHash":
      return updateCell(next, slotNum, {
        state: "hash",
        value: event.value,
        data: valueToData(event.value),
      });

    case "EventMap":
      return updateCell(next, slotNum, {
        state: "map",
        value: event.value,
        data: valueToData(event.value),
      });

    case "EventLoad":
      return updateCell(next, slotNum, {
        tile: event.tile,
        state: "idle",
      });

    case "EventSetMode":
      return updateCell(next, slotNum, {
        mode: event.mode,
        state: "idle",
      });

    case "EventSetLine":
    case "EventSetPoint":
      return next;
  }
}

export function reduceScene(
  scene: Scene,
  events: Event | readonly Event[] | null,
): Scene {
  if (events === null) {
    return scene;
  }
  if (!("tag" in events)) {
    return events.reduce((current, event) => reduceEvent(current, event), scene);
  }
  return reduceEvent(scene, events);
}
