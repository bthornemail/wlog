// ============================================================
// WLOG — Composer
// Data-attribute overlay layer for live/frozen rendering.
// Composes authored attributes with derived cell metadata.
// ============================================================

import type { InfiniteAddress, ChunkKey } from "../core/frame.js";
import type { RenderSource, CellSnapshot } from "../core/frame.js";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export type ComposerMode = "select" | "paint" | "erase" | "inspect";

export type AttrValue = string;

export interface AttrPatch {
  readonly key: string;
  readonly value: AttrValue | null; // null = remove
}

export interface CellOverlay {
  readonly address: InfiniteAddress;
  readonly attrs: Readonly<Record<string, AttrValue>>;
}

export interface ComposerState {
  readonly selected: ReadonlySet<string>; // "cx,cy,slot"
  readonly hovered: string | null;
  readonly clipboard: Readonly<Record<string, AttrValue>> | null;
  readonly overlays: ReadonlyMap<string, CellOverlay>;
  readonly mode: ComposerMode;
  readonly dragStart: string | null;
  readonly currentPatch: AttrPatch | null;
}

export interface ComposerIntent {
  readonly kind: "overlay" | "log";
  readonly selection: readonly InfiniteAddress[];
  readonly patch: AttrPatch;
}

// ------------------------------------------------------------------
// State management
// ------------------------------------------------------------------

export function emptyComposerState(): ComposerState {
  return {
    selected: new Set(),
    hovered: null,
    clipboard: null,
    overlays: new Map(),
    mode: "select",
    dragStart: null,
    currentPatch: null,
  };
}

// Alias for backward compatibility
export function createComposer(): ComposerState {
  return emptyComposerState();
}

export function toggleSelection(
  state: ComposerState,
  key: string,
): ComposerState {
  const next = new Set(state.selected);
  if (next.has(key)) {
    next.delete(key);
  } else {
    next.add(key);
  }
  return { ...state, selected: next };
}

export function setSelection(
  state: ComposerState,
  keys: Iterable<string>,
): ComposerState {
  return { ...state, selected: new Set(keys) };
}

export function addToSelection(
  state: ComposerState,
  key: string,
): ComposerState {
  if (state.selected.has(key)) return state;
  const next = new Set(state.selected);
  next.add(key);
  return { ...state, selected: next };
}

export function clearSelection(state: ComposerState): ComposerState {
  return { ...state, selected: new Set() };
}

export function setHovered(state: ComposerState, key: string | null): ComposerState {
  return { ...state, hovered: key };
}

export function setComposerMode(state: ComposerState, mode: ComposerMode): ComposerState {
  return { ...state, mode };
}

export function setCurrentPatch(state: ComposerState, patch: AttrPatch | null): ComposerState {
  return { ...state, currentPatch: patch };
}

export function startDrag(state: ComposerState, key: string): ComposerState {
  return { ...state, dragStart: key };
}

export function endDrag(state: ComposerState): ComposerState {
  return { ...state, dragStart: null };
}

// ------------------------------------------------------------------
// Selection operations
// ------------------------------------------------------------------

export function applyPatchToSelection(
  state: ComposerState,
  patch: AttrPatch,
  decodeKey: (key: string) => InfiniteAddress,
): ComposerState {
  const overlays = new Map(state.overlays);

  for (const key of state.selected) {
    const prev = overlays.get(key);
    const address = prev?.address ?? decodeKey(key);
    const attrs = { ...(prev?.attrs ?? {}) };

    if (patch.value === null) {
      delete attrs[patch.key];
    } else {
      attrs[patch.key] = patch.value;
    }

    if (Object.keys(attrs).length === 0) {
      overlays.delete(key);
    } else {
      overlays.set(key, { address, attrs });
    }
  }

  return { ...state, overlays };
}

export function applyPatchToAddress(
  state: ComposerState,
  key: string,
  patch: AttrPatch,
  decodeKey: (key: string) => InfiniteAddress,
): ComposerState {
  const overlays = new Map(state.overlays);
  const prev = overlays.get(key);
  const address = prev?.address ?? decodeKey(key);
  const attrs = { ...(prev?.attrs ?? {}) };

  if (patch.value === null) {
    delete attrs[patch.key];
  } else {
    attrs[patch.key] = patch.value;
  }

  if (Object.keys(attrs).length === 0) {
    overlays.delete(key);
  } else {
    overlays.set(key, { address, attrs });
  }

  return { ...state, overlays };
}

// ------------------------------------------------------------------
// Marquee selection
// ------------------------------------------------------------------

export function selectInRect(
  state: ComposerState,
  cellKeys: Iterable<string>,
): ComposerState {
  return { ...state, selected: new Set(cellKeys) };
}

// ------------------------------------------------------------------
// Eyedropper (read attrs from cell)
// ------------------------------------------------------------------

export function eyedropperAttrs(
  state: ComposerState,
  key: string,
): ComposerState {
  const overlay = state.overlays.get(key);
  if (!overlay) return state;

  return {
    ...state,
    clipboard: overlay.attrs,
  };
}

// ------------------------------------------------------------------
// Clipboard
// ------------------------------------------------------------------

export function copySelectionAttrs(state: ComposerState): ComposerState {
  if (state.selected.size === 0) return state;

  const iter = state.selected.values().next();
  if (!iter.value) return state;
  const firstKey = iter.value;
  const overlay = state.overlays.get(firstKey);

  return {
    ...state,
    clipboard: overlay ? { ...overlay.attrs } : null,
  };
}

export function pasteToSelection(
  state: ComposerState,
  decodeKey: (key: string) => InfiniteAddress,
): ComposerState {
  if (!state.clipboard || state.selected.size === 0) return state;

  const patches: AttrPatch[] = Object.entries(state.clipboard).map(
    ([key, value]) => ({ key, value }),
  );

  let nextState = state;
  for (const patch of patches) {
    nextState = applyPatchToSelection(nextState, patch, decodeKey);
  }

  return nextState;
}

// ------------------------------------------------------------------
// Clear overlay
// ------------------------------------------------------------------

export function clearOverlay(
  state: ComposerState,
  key: string,
): ComposerState {
  const overlays = new Map(state.overlays);
  overlays.delete(key);
  return { ...state, overlays };
}

export function clearAllOverlays(state: ComposerState): ComposerState {
  return { ...state, overlays: new Map() };
}

// ------------------------------------------------------------------
// Projection merge
// ------------------------------------------------------------------

export function projectCellAttrs(
  derived: Record<string, string>,
  composer: ComposerState,
  key: string,
): Record<string, string> {
  const overlay = composer.overlays.get(key)?.attrs ?? {};
  return { ...derived, ...overlay };
}

// ------------------------------------------------------------------
// Key encoding
// ------------------------------------------------------------------

export function cellKey(addr: InfiniteAddress): string {
  return `${addr.chunkX},${addr.chunkY},${addr.slot}`;
}

export function parseCellKey(key: string): InfiniteAddress | null {
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
    slot: slot as any,
  };
}

// ------------------------------------------------------------------
// Render helper - derive base attributes from cell
// ------------------------------------------------------------------

export function deriveCellAttrs(
  snapshot: CellSnapshot,
  revision: number,
): Record<string, string> {
  const { address, value } = snapshot;
  const base: Record<string, string> = {
    "data-key": cellKey(address),
    "data-chunk-x": String(address.chunkX),
    "data-chunk-y": String(address.chunkY),
    "data-slot": String(address.slot),
    "data-revision": String(revision),
  };

  if (value) {
    base["data-value-kind"] = value.tag;
    switch (value.tag) {
      case "VBit":
        base["data-bit"] = String(value.bit);
        break;
      case "VTile":
        base["data-tile"] = value.tile;
        break;
      case "VMode":
        base["data-mode"] = value.mode;
        break;
      case "VSlot":
        base["data-slot-value"] = String(value.slot);
        break;
      case "VBits":
        base["data-bits"] = value.bits.join("");
        break;
    }
  }

  return base;
}

// ------------------------------------------------------------------
// Selection UI helpers
// ------------------------------------------------------------------

export function isSelected(composer: ComposerState, key: string): boolean {
  return composer.selected.has(key);
}

export function isHovered(composer: ComposerState, key: string): boolean {
  return composer.hovered === key;
}

export function getSelectedCount(state: ComposerState): number {
  return state.selected.size;
}

// Aliases for backward compatibility
export const addOverlay = toggleSelection;
export const removeOverlay = clearOverlay;
export const applyPatch = applyPatchToSelection;
export const serializeComposer = (state: ComposerState): string => JSON.stringify(state, (_, v) => {
  if (v instanceof Set) return { __set: [...v] };
  if (v instanceof Map) return { __map: [...v] };
  return v;
}, 2);
