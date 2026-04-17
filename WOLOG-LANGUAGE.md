# WOLOG Language

This document defines the first constitutional shape of the WOLOG language.

The language is intentionally split into two layers:

- a direct, human-readable **surface language**
- a small explicit **CPS core**

This preserves WOLOG law:

```text
surface language
-> normalized AST
-> CPS core IR
-> replay log / witness
-> polyform / graph / scene projections
```

The replay log remains authoritative. All rendered or graph-shaped outputs are
downstream projections.

## 1. Architectural Position

The WOLOG language belongs inside this stack:

```text
constitutional core
-> typed polyform model
-> WOLOG language surface
-> CPS core IR
-> replay / witness
-> graph / scene / browser projections
```

The language is not a browser feature and not a page format. It is a typed
authoring and execution description that can later be projected into editors,
viewers, PG output, SVG, canvas, or other surfaces.

## 2. Core Semantic Objects

The minimum semantic objects are:

- `Value` :: literal, symbol, tagged value, or structural value
- `Polyform` :: structural arrangement of lawful cells
- `Transform` :: lawful state change over a polyform
- `Predicate` :: recognizer or constraint
- `Continuation` :: one-shot logical next-step handler
- `Effect` :: traceable operational event
- `ReplayEntry` :: authoritative execution event
- `Witness` :: derived evidence from replay or final state

Required continuations:

- `ok`
- `err`
- `halt`

Reserved continuation:

- `yield`

Continuations are explicit in the core and are never implicit returns.

## 3. Surface Language

The first surface language is direct-style and small.

Supported surface operations:

- `seed`
- `join`
- `split`
- `move`
- `rotate`
- `flip`
- `match`
- `trace`
- `step`
- `sync`
- `halt`

Example:

```text
seed domino at 5 5
before move trace
rotate 90
move 2 0
after rotate trace
step
halt
```

The surface language should read like authored instructions over forms, not
like inside-out CPS lambda terms.

### 3.1 Surface Decorators

WOLOG uses a mixed decorator model. At the surface, decorators follow
method-combination semantics rather than classic object-wrapper semantics.

Supported timings:

- `before op`
- `after op`
- `around op`

Meaning:

- `before` runs a body before the target operation
- `after` runs a body after the target operation
- `around` wraps the target operation and may continue, redirect, or halt

Decorators apply to polyform operations and transform families. They do not
decorate UI widgets or browser components.

Example:

```text
before move trace
after rotate trace
around match trace
```

## 4. Normalized AST

The surface syntax normalizes into a typed AST. A minimal normalized program
shape is:

```ts
interface PolyformProgram {
  name: string;
  decorators: PolyformDecorator[];
  forms: WOLOGSurfaceForm[];
}
```

Where:

- `decorators` hold `before`, `after`, and `around` advice
- `forms` hold the ordered executable surface statements

Representative normalized AST:

```json
{
  "name": "plain-rotate-move",
  "decorators": [
    {
      "name": "trace-before-move",
      "timing": "before",
      "target": "Move",
      "body": [{ "tag": "Trace", "label": "before-move" }]
    }
  ],
  "forms": [
    { "tag": "Seed", "shape": "domino", "at": { "x": 5, "y": 5 } },
    { "tag": "Rotate", "quarterTurns": 1 },
    { "tag": "Move", "dx": 2, "dy": 0 },
    { "tag": "Step" },
    { "tag": "Halt", "reason": "done" }
  ]
}
```

## 5. CPS Core IR

The WOLOG core IR is continuation-passing style. All control flow and
evaluation order are explicit.

Core operations are:

- `Seed`
- `Join`
- `Split`
- `Move`
- `Rotate`
- `Flip`
- `Match`
- `Trace`
- `Step`
- `Sync`
- `Halt`
- `Call`
- `Branch`
- `Cont`

Each executable operation carries explicit continuations. Branching operations
name both paths. Error paths route to `err`, not hidden exceptions.

### 5.1 Thunks, Overlays, and Dynamic Linking

WOLOG adopts the thunk as a lawful deferred boundary.

A thunk may stand for:

- deferred execution of a core operation
- overlay reload boundary
- dynamic link boundary between modules
- delayed continuation transfer into a segment not yet resident

This makes thunks part of the execution substrate rather than a mere compiler
artifact. A `Call` may target a loaded callee directly or may pass through a
thunk that resolves a module/entry boundary first and then resumes the
continuation.

Representative shape:

```ts
interface WOLOGThunk {
  name: string;
  module?: string;
  entry: string;
  continuation: WOLOGContinuation;
}
```

This gives the language a place for:

- overlay-style loading
- lazy module resolution
- same-language dynamic linking
- deferred or resumable continuation handoff

Representative core shape:

```ts
interface WOLOGContinuation {
  tag: "ok" | "err" | "halt" | "yield";
  target: string;
}
```

```ts
type WOLOGCoreOp =
  | { tag: "Seed"; cell: PolyCell; ok: WOLOGContinuation; err: WOLOGContinuation }
  | { tag: "Move"; transform: PolyTransform; ok: WOLOGContinuation; err: WOLOGContinuation }
  | { tag: "Rotate"; transform: PolyTransform; ok: WOLOGContinuation; err: WOLOGContinuation }
  | { tag: "Match"; predicate: string; whenTrue: WOLOGContinuation; whenFalse: WOLOGContinuation; err: WOLOGContinuation }
  | { tag: "Call"; callee: string; args: WOLOGValue[]; ok: WOLOGContinuation; err: WOLOGContinuation }
  | { tag: "Branch"; condition: string; whenTrue: WOLOGContinuation; whenFalse: WOLOGContinuation; err: WOLOGContinuation }
  | { tag: "Cont"; name: string; body: WOLOGCoreOp[] };
```

## 6. Decorator Lowering

Decorators lower into explicit continuation structure.

### 6.1 Before

Surface:

```text
before move trace
move 2 0
```

Core idea:

- emit `Trace`
- continue into `Move`

### 6.2 After

Surface:

```text
after rotate trace
rotate 90
```

Core idea:

- perform `Rotate`
- route `ok` into `Trace`
- then continue onward

### 6.3 Around

Surface:

```text
around match trace
match occupied
```

Core idea:

- create an explicit continuation wrapper
- the wrapper may call through, branch, redirect, or halt

This is method-combination semantics, not object inheritance or runtime class
wrapping.

## 7. Worked Example

### 7.1 Surface Program

```text
seed domino at 5 5
before move trace
rotate 90
move 2 0
step
halt
```

### 7.2 Normalized AST

```json
{
  "name": "worked-example",
  "decorators": [
    {
      "name": "trace-before-move",
      "timing": "before",
      "target": "Move",
      "body": [{ "tag": "Trace", "label": "before-move" }]
    }
  ],
  "forms": [
    { "tag": "Seed", "shape": "domino", "at": { "x": 5, "y": 5 } },
    { "tag": "Rotate", "quarterTurns": 1 },
    { "tag": "Move", "dx": 2, "dy": 0 },
    { "tag": "Step" },
    { "tag": "Halt", "reason": "done" }
  ]
}
```

### 7.3 CPS Lowering Sketch

```json
{
  "entry": "cont:seed",
  "ops": [
    {
      "tag": "Seed",
      "cell": { "x": 5, "y": 5, "kind": "square" },
      "ok": { "tag": "ok", "target": "cont:rotate" },
      "err": { "tag": "err", "target": "cont:error" }
    },
    {
      "tag": "Rotate",
      "transform": { "tag": "Rotate", "quarterTurns": 1 },
      "ok": { "tag": "ok", "target": "cont:trace-before-move" },
      "err": { "tag": "err", "target": "cont:error" }
    },
    {
      "tag": "Trace",
      "transform": { "tag": "Trace" },
      "ok": { "tag": "ok", "target": "cont:move" },
      "err": { "tag": "err", "target": "cont:error" }
    },
    {
      "tag": "Move",
      "transform": { "tag": "Move", "dx": 2, "dy": 0 },
      "ok": { "tag": "ok", "target": "cont:step" },
      "err": { "tag": "err", "target": "cont:error" }
    },
    {
      "tag": "Step",
      "transform": { "tag": "Step" },
      "ok": { "tag": "ok", "target": "cont:halt" },
      "err": { "tag": "err", "target": "cont:error" }
    },
    {
      "tag": "Halt",
      "transform": { "tag": "Halt" },
      "ok": { "tag": "halt", "target": "terminal:done", "terminal": true },
      "err": { "tag": "err", "target": "cont:error" }
    }
  ]
}
```

### 7.4 Replay Trace

Representative replay events:

```text
tick 0 -> Seed   -> witness w0
tick 1 -> Rotate -> witness w1
tick 2 -> Trace  -> witness w1
tick 3 -> Move   -> witness w2
tick 4 -> Step   -> witness w2
tick 5 -> Halt   -> witness w2
```

The replay is authoritative. Any graph, scene, or viewer representation is
derived from this execution history.

## 8. Acceptance Scenarios

The initial language definition must support these cases:

- plain transform flow: `seed -> rotate -> move -> halt`
- before advice: trace runs before the target operation
- after advice: trace runs after the target operation
- around advice pass-through: wrapped operation continues unchanged
- around advice short-circuit: wrapped operation halts or redirects
- predicate branch: `match` lowers to explicit true/false continuations
- error path: invalid transform routes to `err`
- replay determinism: same surface program yields same normalized core
- projection independence: replay may feed polyform, graph, or scene surfaces

## 9. Reserved Public Interfaces

The following public concepts are reserved in the TS layer:

- `PolyformProgram`
- `PolyformDecorator`
- `WOLOGContinuation`
- `WOLOGThunk`
- `WOLOGEffect`
- `WOLOGReplayEntry`
- `WOLOGCoreOp`
- `WOLOGSurfaceForm`

These names should stay aligned between spec, code comments, and public API to
avoid vocabulary drift.
