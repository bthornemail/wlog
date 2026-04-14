# `wlog` — Append-Only Deterministic Replay Machine

A pure TypeScript port of the WLOG Haskell evaluator.

```
WLOG    = canonical typed schedule   (the shared object)
Runtime = current replay state
Event   = observable receipt
View    = local projection (DOM / canvas / SVG / …)
```

Peers share **WLOG programs**, not rendered surfaces.

---

## Architecture

```
types.ts   – all ADTs (Bit, Slot60, Expr, Value, Opcode, LOG, Program, WLOG, …)
bits.ts    – pure B8 / Bit arithmetic
eval.ts    – evalExpr, runOpcode
runtime.ts – stepRuntime, runAll, runLazy, initRuntime
dom.ts     – applyEventToDOM, buildGrid, WLOG_CSS
canvas.ts  – infinite addressing, peer messages, ChunkStore
index.ts   – public barrel re-export
example.ts – runnable demos
```

---

## Quick start

```ts
import {
  slot, b8, I, O,
  ETile, EBits, Emit, Sync, RotateL, Hash, ESlot, Map,
  Done, Step, log_,
  initRuntime, runAll,
} from "wlog";

const wlog = {
  orientation: "Identity",
  base: "Base60",
  header: {
    marker: { orientation: "Identity" },
    clock:  { base: "Base60" },
    seed:   { slot: slot(17), mode: "xX", line: "L3", point: "P1", tile: "TA" },
  },
  program:
    Step(log_(slot(17), Sync()),
    Step(log_(slot(17), Emit(ETile("TA"))),
    Step(log_(slot(17), RotateL()),
    Done()))),
};

const events = runAll(initRuntime(wlog));
// → [EventSync, EventEmit, EventRotateL]
```

---

## DOM renderer

```ts
import { buildGrid, applyEventToDOM, runLazy, initRuntime, WLOG_CSS } from "wlog";

// Inject styles once
const style = document.createElement("style");
style.textContent = WLOG_CSS;
document.head.appendChild(style);

// Build a 60-cell grid
const container = document.getElementById("canvas")!;
const grid = buildGrid(container, 60);

// Replay WLOG into the DOM
for (const ev of runLazy(initRuntime(myWLOG))) {
  applyEventToDOM(ev, grid);
}
```

Each cell receives `data-*` attributes:

| Attribute            | Set by events              |
|----------------------|---------------------------|
| `data-wlog-state`    | all events                |
| `data-wlog-value`    | Emit, Map                 |
| `data-wlog-value-tag`| Emit, Map                 |
| `data-wlog-tile`     | Load, Emit(VTile)         |
| `data-wlog-mode`     | SetMode, Emit(VMode)      |
| `data-wlog-bits`     | Emit(VBits), Map(VBits)   |
| `data-wlog-hash`     | Hash                      |
| `data-wlog-last-op`  | most opcodes              |

---

## Infinite canvas

```ts
import { pixelToAddress, makePeerMessage, applyPeerMessage,
         emptyChunkStore, tickLamport, log_, slot, Emit, ETile } from "wlog";

// Map a pixel click to a chunk address
const addr = pixelToAddress(137, 200, 60);
// → { chunkX: 2, chunkY: 3, slot: 17 }

// Create a peer message
let lamport = 0;
lamport = tickLamport(lamport);
const msg = makePeerMessage(addr.chunkX, addr.chunkY,
  log_(addr.slot, Emit(ETile("TB"))), lamport);

// Broadcast msg via WebRTC / WebSocket / libp2p …

// Receiving peer applies the message
let store = emptyChunkStore();
store = applyPeerMessage(store, msg, defaultWLOGFactory);
```

---

## Core invariant

```
The decentralized canvas synchronizes WLOG programs and replays
events. It never synchronizes rendered surfaces.
```

---

## Derivation chain

```
Haskell types/evaluator
  → this TypeScript browser evaluator
  → C substrate evaluator  (forthcoming)
```

TypeScript semantics are derived from the Haskell law, not invented independently.
# wlog
