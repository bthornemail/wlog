// ============================================================
// WOLOG Language
// Direct-style surface forms with a CPS-shaped constitutional core.
// This module reserves the public type layer for the WOLOG language.
// ============================================================

import type { PolyCell, PolyTransform } from "./polyform.js";

export const WOLOG_REQUIRED_CONTINUATIONS = ["ok", "err", "halt"] as const;
export const WOLOG_RESERVED_CONTINUATIONS = ["yield"] as const;
export const WOLOG_DECORATOR_TIMINGS = ["before", "after", "around"] as const;
export const WOLOG_SURFACE_OPS = [
  "Seed",
  "Join",
  "Split",
  "Move",
  "Rotate",
  "Flip",
  "Match",
  "Trace",
  "Step",
  "Sync",
  "Halt",
] as const;

export type WOLOGContinuationTag =
  | (typeof WOLOG_REQUIRED_CONTINUATIONS)[number]
  | (typeof WOLOG_RESERVED_CONTINUATIONS)[number];

export type WOLOGDecoratorTiming = (typeof WOLOG_DECORATOR_TIMINGS)[number];
export type WOLOGSurfaceOpTag = (typeof WOLOG_SURFACE_OPS)[number];

export type WOLOGScalar = string | number | boolean | null;

export interface WOLOGTaggedValue {
  readonly kind: "tagged";
  readonly tag: string;
  readonly value: WOLOGValue;
}

export interface WOLOGRecordValue {
  readonly kind: "record";
  readonly fields: Readonly<Record<string, WOLOGValue>>;
}

export interface WOLOGListValue {
  readonly kind: "list";
  readonly items: readonly WOLOGValue[];
}

export type WOLOGValue =
  | WOLOGScalar
  | WOLOGTaggedValue
  | WOLOGRecordValue
  | WOLOGListValue;

export interface WOLOGContinuation {
  readonly tag: WOLOGContinuationTag;
  readonly target: string;
  readonly terminal?: boolean;
}

export interface WOLOGThunk {
  readonly name: string;
  readonly module?: string;
  readonly entry: string;
  readonly continuation: WOLOGContinuation;
}

export interface WOLOGEffect {
  readonly tag:
    | "Seed"
    | "Join"
    | "Split"
    | "Move"
    | "Rotate"
    | "Flip"
    | "Match"
    | "Trace"
    | "Step"
    | "Sync"
    | "Halt"
    | "Call"
    | "Branch"
    | "Decorate"
    | "Error";
  readonly detail?: string;
  readonly value?: WOLOGValue;
}

export interface WOLOGSeedForm {
  readonly tag: "Seed";
  readonly shape: string;
  readonly at: { readonly x: number; readonly y: number };
}

export interface WOLOGJoinForm {
  readonly tag: "Join";
  readonly cells: readonly { readonly x: number; readonly y: number }[];
}

export interface WOLOGSplitForm {
  readonly tag: "Split";
  readonly keys: readonly string[];
}

export interface WOLOGMoveForm {
  readonly tag: "Move";
  readonly dx: number;
  readonly dy: number;
}

export interface WOLOGRotateForm {
  readonly tag: "Rotate";
  readonly quarterTurns: 0 | 1 | 2 | 3;
}

export interface WOLOGFlipForm {
  readonly tag: "Flip";
  readonly axis: "x" | "y";
}

export interface WOLOGMatchForm {
  readonly tag: "Match";
  readonly predicate: string;
  readonly then: readonly WOLOGSurfaceForm[];
  readonly else: readonly WOLOGSurfaceForm[];
}

export interface WOLOGTraceForm {
  readonly tag: "Trace";
  readonly label?: string;
}

export interface WOLOGStepForm {
  readonly tag: "Step";
}

export interface WOLOGSyncForm {
  readonly tag: "Sync";
}

export interface WOLOGHaltForm {
  readonly tag: "Halt";
  readonly reason?: string;
}

export type WOLOGSurfaceForm =
  | WOLOGSeedForm
  | WOLOGJoinForm
  | WOLOGSplitForm
  | WOLOGMoveForm
  | WOLOGRotateForm
  | WOLOGFlipForm
  | WOLOGMatchForm
  | WOLOGTraceForm
  | WOLOGStepForm
  | WOLOGSyncForm
  | WOLOGHaltForm;

export interface PolyformDecorator {
  readonly name: string;
  readonly timing: WOLOGDecoratorTiming;
  readonly target: WOLOGSurfaceOpTag | "*";
  readonly body: readonly WOLOGSurfaceForm[];
}

export interface PolyformProgram {
  readonly name: string;
  readonly decorators: readonly PolyformDecorator[];
  readonly forms: readonly WOLOGSurfaceForm[];
}

export interface WOLOGSeedCoreOp {
  readonly tag: "Seed";
  readonly cell: PolyCell;
  readonly ok: WOLOGContinuation;
  readonly err: WOLOGContinuation;
}

export interface WOLOGTransformCoreOp {
  readonly tag:
    | "Join"
    | "Split"
    | "Move"
    | "Rotate"
    | "Flip"
    | "Trace"
    | "Step"
    | "Sync"
    | "Halt";
  readonly transform: PolyTransform;
  readonly ok: WOLOGContinuation;
  readonly err: WOLOGContinuation;
}

export interface WOLOGMatchCoreOp {
  readonly tag: "Match";
  readonly predicate: string;
  readonly whenTrue: WOLOGContinuation;
  readonly whenFalse: WOLOGContinuation;
  readonly err: WOLOGContinuation;
}

export interface WOLOGCallCoreOp {
  readonly tag: "Call";
  readonly callee: string;
  readonly module?: string;
  readonly thunk?: WOLOGThunk;
  readonly args: readonly WOLOGValue[];
  readonly ok: WOLOGContinuation;
  readonly err: WOLOGContinuation;
}

export interface WOLOGBranchCoreOp {
  readonly tag: "Branch";
  readonly condition: string;
  readonly whenTrue: WOLOGContinuation;
  readonly whenFalse: WOLOGContinuation;
  readonly err: WOLOGContinuation;
}

export interface WOLOGContCoreOp {
  readonly tag: "Cont";
  readonly name: string;
  readonly body: readonly WOLOGCoreOp[];
}

export type WOLOGCoreOp =
  | WOLOGSeedCoreOp
  | WOLOGTransformCoreOp
  | WOLOGMatchCoreOp
  | WOLOGCallCoreOp
  | WOLOGBranchCoreOp
  | WOLOGContCoreOp;

export interface WOLOGCoreProgram {
  readonly entry: string;
  readonly ops: readonly WOLOGCoreOp[];
}

export interface WOLOGReplayEntry {
  readonly tick: number;
  readonly opTag: WOLOGCoreOp["tag"];
  readonly continuation: WOLOGContinuationTag;
  readonly effect?: WOLOGEffect;
  readonly witness?: string;
}

export function continuation(
  tag: WOLOGContinuationTag,
  target: string,
  terminal = false,
): WOLOGContinuation {
  return { tag, target, terminal };
}

export function definePolyformProgram(program: PolyformProgram): PolyformProgram {
  return {
    name: program.name,
    decorators: [...program.decorators],
    forms: [...program.forms],
  };
}

export function decoratorTargets(
  decorators: readonly PolyformDecorator[],
  target: WOLOGSurfaceOpTag,
): readonly PolyformDecorator[] {
  return decorators.filter((decorator) => decorator.target === "*" || decorator.target === target);
}

export function requiredContinuations(): readonly WOLOGContinuationTag[] {
  return [...WOLOG_REQUIRED_CONTINUATIONS];
}
