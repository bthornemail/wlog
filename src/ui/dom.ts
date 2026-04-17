// ============================================================
// WLOG — DOM Renderer
// Translates Events into data-attribute mutations on HTML elements.
//
// Usage:
//   const grid = buildGrid(document.getElementById("canvas")!, 60);
//   for (const ev of runLazy(initRuntime(myWLOG))) {
//     applyEventToDOM(ev, grid);
//   }
// ============================================================

import type { Event, Value, Slot60, B8, Tile16, Mode4 } from "../core/types.js";
import { b8ToString } from "../core/bits.js";

// ------------------------------------------------------------------
// Grid — a map from Slot60 to HTMLElement
// ------------------------------------------------------------------

export type Grid = ReadonlyMap<Slot60, HTMLElement>;

/**
 * Build a flat grid of <div> cells inside `container`.
 * Assigns `data-slot="N"` and the WLOG CSS classes.
 * Returns the Grid map.
 */
export function buildGrid(container: HTMLElement, size: 60): Grid {
  const map = new Map<Slot60, HTMLElement>();

  for (let i = 0; i < size; i++) {
    const el = document.createElement("div");
    el.className = "wlog-cell";
    el.dataset["slot"] = String(i);
    el.dataset["wlogState"] = "idle";
    container.appendChild(el);
    map.set(i as Slot60, el);
  }

  return map;
}

// ------------------------------------------------------------------
// Value → data-attribute string
// ------------------------------------------------------------------

function valueToString(v: Value): string {
  switch (v.tag) {
    case "VBit":  return String(v.bit);
    case "VTile": return v.tile;
    case "VMode": return v.mode;
    case "VSlot": return String(v.slot);
    case "VBits": return b8ToString(v.bits);
  }
}

// ------------------------------------------------------------------
// Apply one Event to the DOM
// ------------------------------------------------------------------

export function applyEventToDOM(ev: Event, grid: Grid): void {
  const el = grid.get(ev.slot);
  if (!el) return;

  switch (ev.tag) {
    case "EventSync":
      el.dataset["wlogState"] = "sync";
      el.dataset["wlogLastOp"] = "sync";
      break;

    case "EventWait":
      el.dataset["wlogState"] = "wait";
      break;

    case "EventEmit":
      el.dataset["wlogState"] = "emit";
      el.dataset["wlogLastOp"] = "emit";
      el.dataset["wlogValue"] = valueToString(ev.value);
      el.dataset["wlogValueTag"] = ev.value.tag;
      applyValueAttrs(el, ev.value);
      break;

    case "EventHash":
      el.dataset["wlogState"] = "hash";
      el.dataset["wlogLastOp"] = "hash";
      el.dataset["wlogHash"] = valueToString(ev.value);
      break;

    case "EventMap":
      el.dataset["wlogState"] = "map";
      el.dataset["wlogLastOp"] = "map";
      el.dataset["wlogMap"] = valueToString(ev.value);
      applyValueAttrs(el, ev.value);
      break;

    case "EventRotateL":
      el.dataset["wlogState"] = "rotate-l";
      el.dataset["wlogLastOp"] = "rotate-l";
      break;

    case "EventRotateR":
      el.dataset["wlogState"] = "rotate-r";
      el.dataset["wlogLastOp"] = "rotate-r";
      break;

    case "EventJoin":
      el.dataset["wlogState"] = "join";
      el.dataset["wlogLastOp"] = "join";
      break;

    case "EventSplit":
      el.dataset["wlogState"] = "split";
      el.dataset["wlogLastOp"] = "split";
      break;

    case "EventLoad":
      el.dataset["wlogState"] = "load";
      el.dataset["wlogTile"] = ev.tile;
      break;

    case "EventSetMode":
      el.dataset["wlogMode"] = ev.mode;
      break;

    case "EventSetLine":
      el.dataset["wlogLine"] = ev.line;
      break;

    case "EventSetPoint":
      el.dataset["wlogPoint"] = ev.point;
      break;
  }
}

/** Write type-specific data-attributes for richer CSS targeting. */
function applyValueAttrs(el: HTMLElement, v: Value): void {
  switch (v.tag) {
    case "VBit":  el.dataset["wlogBit"]  = String(v.bit);  break;
    case "VTile": el.dataset["wlogTile"] = v.tile;          break;
    case "VMode": el.dataset["wlogMode"] = v.mode;          break;
    case "VSlot": el.dataset["wlogSlot"] = String(v.slot);  break;
    case "VBits": el.dataset["wlogBits"] = b8ToString(v.bits); break;
  }
}

// ------------------------------------------------------------------
// CSS template (inject into <head> or a <style> tag)
// ------------------------------------------------------------------

export const WLOG_CSS = `
.wlog-cell {
  display: inline-block;
  width: var(--wlog-cell-size, 24px);
  height: var(--wlog-cell-size, 24px);
  border: 1px solid var(--wlog-border, #333);
  background: var(--wlog-bg, #111);
  transition: background 0.1s, outline 0.1s;
}
.wlog-cell[data-wlog-state="sync"]     { background: var(--wlog-sync-color,    #1a4a7a); }
.wlog-cell[data-wlog-state="emit"]     { background: var(--wlog-emit-color,    #2a6e3a); }
.wlog-cell[data-wlog-state="hash"]     { background: var(--wlog-hash-color,    #6e3a2a); }
.wlog-cell[data-wlog-state="map"]      { background: var(--wlog-map-color,     #5a2a6e); }
.wlog-cell[data-wlog-state="rotate-l"] { background: var(--wlog-rotate-color,  #6e6e1a); }
.wlog-cell[data-wlog-state="rotate-r"] { background: var(--wlog-rotate-color,  #6e6e1a); }
.wlog-cell[data-wlog-state="join"]     { background: var(--wlog-join-color,    #1a6e6e); }
.wlog-cell[data-wlog-state="split"]    { background: var(--wlog-split-color,   #6e1a1a); }
.wlog-cell[data-wlog-state="wait"]     { opacity: 0.4; }

/* Focus and selection states */
.wlog-focused {
  outline: 3px solid #ffeb3b;
  outline-offset: -1px;
  z-index: 10;
  box-shadow: 0 0 20px rgba(255, 235, 59, 0.5);
}
.wlog-selected {
  outline: 2px solid #4caf50;
  outline-offset: -1px;
}

/* Chunk container */
.wlog-chunk {
  position: absolute;
  display: grid;
  grid-template-columns: repeat(60, var(--wlog-cell-size, 24px));
  will-change: transform;
}
`.trim();
