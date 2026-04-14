// ============================================================
// WLOG — Public API
// ============================================================

// Types
export type {
  Bit, Slot60, ChunkCoord, Base, Orientation,
  Mode4, Line7, Point3, Tile16, B8,
  Expr, Value, Opcode, LOG, Program,
  Marker, Clock, ConfigSeed, Header, WLOG,
  Config, Runtime, Event,
} from "./types.js";

export {
  O, I, slot, b8, ZERO_B8,
  EXOR, EAND, EOR, ENOT, ENOR, ENAND, EMONAD, EFUNCTOR,
  ETile, EMode, ESlot, EBits,
  VBit, VTile, VMode, VSlot, VBits,
  Sync, Wait, RotateL, RotateR, Join, Split,
  Emit, Hash, Map, Load, SetMode, SetLine, SetPoint,
  Done, Step, log_,
} from "./types.js";

// Bit helpers
export {
  bitNot, bitAnd, bitOr, bitXor,
  bitsNot, bitsAnd, bitsOr, bitsXor,
  rotL8, rotR8,
  b8ToUint8, uint8ToB8, b8ToString,
} from "./bits.js";

// Evaluator
export { evalExpr, runOpcode } from "./eval.js";

// Runtime
export { seedConfig, stepRuntime, runAll, runLazy, initRuntime } from "./runtime.js";

// DOM renderer (browser-only)
export type { Grid } from "./dom.js";
export { buildGrid, applyEventToDOM, WLOG_CSS } from "./dom.js";

// Infinite canvas
export type { PeerMessage, SerializedLOG, ChunkStore } from "./canvas.js";
export {
  pixelToAddress, addressToPixel,
  serializeLOG, deserializeLOG, makePeerMessage,
  tickLamport,
  programAppend, programFromLogs, programToLogs,
  emptyChunkStore, getChunk, putChunk, applyPeerMessage,
} from "./canvas.js";

// Scene model and rendering
export type { Scene, SceneCell, SceneFrame } from "./scene.js";
export { emptyScene, reduceEvent } from "./scene.js";

export { slotToGridXY, gridXYToSlot } from "./layout.js";

export { renderSceneSvg } from "./render-svg.js";
export { renderSceneCanvas } from "./render-canvas.js";

export { stepEngine, runEngine, initSceneEngine } from "./engine.js";

// Frame types (WLOG = river, frames = photographs)
export type {
  WorldScene, ChunkScene, FrameSpec, FrameSnapshot,
  BoundedScene, CellSnapshot, Bounds,
  RenderSource, FrameStatus, FrameDiff,
} from "./frame.js";

export type { ChunkKey } from "./frame.js";
export {
  chunkKey as chunkKey,
  parseChunkKey,
  emptyBounds,
  expandBounds,
  boundsArea,
} from "./frame.js";

// World builder (builds WorldScene from WLOG, captures frames)
export {
  buildWorldScene,
  captureFrame,
  getFrameStatus,
  refreshFrame,
  diffFrames,
} from "./world-builder.js";

// Viewport (zoom, pan, focus)
export type { ViewportState, UIMode } from "./viewport.js";
export { Viewport } from "./viewport.js";

// Composer (data-attribute overlay layer)
export type {
  ComposerState,
  ComposerIntent,
  AttrPatch,
  CellOverlay,
  ComposerMode,
} from "./composer.js";
export {
  emptyComposerState,
  toggleSelection,
  clearSelection,
  applyPatchToSelection,
  setComposerMode,
  eyedropperAttrs,
  clearOverlay,
  projectCellAttrs,
  cellKey,
  parseCellKey,
  deriveCellAttrs,
  isSelected,
  isHovered,
  getSelectedCount,
} from "./composer.js";
