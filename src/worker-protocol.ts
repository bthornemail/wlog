// ============================================================
// WLOG — Worker Protocol
// Message types for main thread ↔ worker communication.
// ============================================================

import type { WLOG, Config, Value, Slot60 } from "./types.js";
import type { ChunkKey, WorldScene, FrameSpec, FrameSnapshot, BoundedScene, Bounds, CellSnapshot, RenderSource } from "./frame.js";
import type { ViewportState, InfiniteAddress } from "./viewport.js";

// ------------------------------------------------------------------
// Main → Worker
// ------------------------------------------------------------------

export type WorkerRequest =
  | { tag: "init"; wlog: WLOG }
  | { tag: "appendWlog"; append: WlogAppendEnvelope }
  | { tag: "setOverlay"; patch: OverlayPatchEnvelope }
  | { tag: "captureFrame"; requestId: string; spec: FrameSpec }
  | { tag: "refreshFrame"; requestId: string; frameId: string }
  | { tag: "getWorldSlice"; requestId: string; bounds: Bounds }
  | { tag: "getVisible"; requestId: string; viewport: ViewportState }
  | { tag: "getWorld"; requestId: string }
  | { tag: "reset"; wlog: WLOG }
  | { tag: "ping"; requestId: string };

export interface WlogAppendEnvelope {
  readonly appendId: string;
  readonly parentRevision: number;
  readonly ops: readonly WorkerOp[];
}

export type WorkerOp =
  | { tag: "op"; slot: Slot60; opcode: unknown }
  | { tag: "batch"; ops: readonly WorkerOp[] };

export interface OverlayPatchEnvelope {
  readonly patchId: string;
  readonly target: OverlayTarget;
  readonly selection: readonly string[];
  readonly attrs: Readonly<Record<string, string | null>>;
}

export type OverlayTarget =
  | { tag: "live"; revision: number }
  | { tag: "frame"; frameId: string };

// ------------------------------------------------------------------
// Worker → Main
// ------------------------------------------------------------------

export type WorkerResponse =
  | { tag: "ready"; revision: number }
  | { tag: "worldPatch"; revision: number; patch: WorldPatch }
  | { tag: "frameCaptured"; requestId: string; frame: FrameSnapshot }
  | { tag: "frameRefreshed"; requestId: string; frame: FrameSnapshot }
  | { tag: "visibleSlice"; requestId: string; slice: BoundedScene }
  | { tag: "world"; requestId: string; world: WorldScene }
  | { tag: "pong"; requestId: string; ts: number }
  | { tag: "error"; requestId?: string; message: string };

export interface WorldPatch {
  readonly revision: number;
  readonly touchedChunks: readonly ChunkKey[];
  readonly upserts: readonly CellSnapshot[];
  readonly removes: readonly string[];
}

// ------------------------------------------------------------------
// Worker lifecycle
// ------------------------------------------------------------------

export interface WorkerStatus {
  readonly revision: number;
  readonly state: "idle" | "replaying" | "ready" | "error";
  readonly lastError?: string;
}

// ------------------------------------------------------------------
// Request helpers
// ------------------------------------------------------------------

export function makeInitRequest(wlog: WLOG): WorkerRequest {
  return { tag: "init", wlog };
}

export function makeAppendRequest(
  appendId: string,
  parentRevision: number,
  ops: readonly WorkerOp[],
): WorkerRequest {
  return {
    tag: "appendWlog",
    append: { appendId, parentRevision, ops },
  };
}

export function makeCaptureFrameRequest(
  requestId: string,
  spec: FrameSpec,
): WorkerRequest {
  return { tag: "captureFrame", requestId, spec };
}

export function makeRefreshFrameRequest(
  requestId: string,
  frameId: string,
): WorkerRequest {
  return { tag: "refreshFrame", requestId, frameId };
}

export function makeGetVisibleRequest(
  requestId: string,
  viewport: ViewportState,
): WorkerRequest {
  return { tag: "getVisible", requestId, viewport };
}

export function makeGetWorldRequest(requestId: string): WorkerRequest {
  return { tag: "getWorld", requestId };
}

// ------------------------------------------------------------------
// Response helpers
// ------------------------------------------------------------------

export function isErrorResponse(resp: WorkerResponse): resp is WorkerResponse & { tag: "error" } {
  return resp.tag === "error";
}

export function getFrameFromResponse(resp: WorkerResponse): FrameSnapshot | null {
  if (resp.tag === "frameCaptured" || resp.tag === "frameRefreshed") {
    return resp.frame;
  }
  return null;
}

export function getWorldPatchFromResponse(resp: WorkerResponse): WorldPatch | null {
  if (resp.tag === "worldPatch") {
    return resp.patch;
  }
  return null;
}
