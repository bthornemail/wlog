// ============================================================
// WLOG — Examples
//
// Direct port of the Haskell example at the bottom of the
// original module, plus infinite-canvas usage patterns.
// ============================================================

import {
  // Types
  type WLOG, type Event,
  // Constructors
  O, I, slot, b8,
  ETile, EBits, ESlot,
  Emit, Hash, Map, Sync, RotateL,
  Done, Step, log_,
  // Runtime
  initRuntime, runAll, runLazy,
  // Canvas
  pixelToAddress, programAppend, emptyChunkStore,
  makePeerMessage, applyPeerMessage, tickLamport,
} from "../src/index.js";

// ------------------------------------------------------------------
// 1. Exact port of the Haskell example
// ------------------------------------------------------------------

const exampleHeader = {
  marker: { orientation: "Identity" as const },
  clock:  { base: "Base60"          as const },
  seed: {
    slot:  slot(17),
    mode:  "xX"  as const,
    line:  "L3"  as const,
    point: "P1"  as const,
    tile:  "TA"  as const,
  },
};

const exampleProgram =
  Step(log_(slot(17), Sync()),
  Step(log_(slot(17), Emit(ETile("TA"))),
  Step(log_(slot(17), RotateL()),
  Step(log_(slot(17), Map(EBits(b8(I, O, I, I, O, O, I, O)))),
  Step(log_(slot(17), Hash(ESlot(slot(17)))),
  Done())))));

const exampleWLOG: WLOG = {
  orientation: "Identity",
  base:         "Base60",
  header:       exampleHeader,
  program:      exampleProgram,
};

const exampleEvents: Event[] = runAll(initRuntime(exampleWLOG));

console.log("=== Example Events ===");
for (const ev of exampleEvents) {
  console.log(JSON.stringify(ev));
}

// ------------------------------------------------------------------
// 2. Lazy generator — process events one at a time
// ------------------------------------------------------------------

console.log("\n=== Lazy generator ===");
for (const ev of runLazy(initRuntime(exampleWLOG))) {
  // In a real app: applyEventToDOM(ev, grid);
  console.log(ev.tag, "slot:", ev.slot);
}

// ------------------------------------------------------------------
// 3. Infinite canvas — pixel → chunk → address
// ------------------------------------------------------------------

console.log("\n=== Infinite canvas addressing ===");
const addr = pixelToAddress(137, 200, 60);
console.log("pixel (137,200) →", addr);
// → { chunkX: 2, chunkY: 3, slot: 17 }

// ------------------------------------------------------------------
// 4. Peer sync simulation
// ------------------------------------------------------------------

console.log("\n=== Peer sync simulation ===");

let store   = emptyChunkStore();
let lamport = 0;

// Peer A appends a LOG to chunk (0,0)
const logFromA = log_(slot(17), Emit(ETile("TB")));
lamport        = tickLamport(lamport);
const msgA     = makePeerMessage(0, 0, logFromA, lamport);

// Peer B receives that message and applies it
store = applyPeerMessage(store, msgA, (cx, cy) => ({
  ...exampleWLOG,
  header: {
    ...exampleWLOG.header,
    seed: { ...exampleWLOG.header.seed, slot: slot(cx + cy) },
  },
}));

const updatedChunk = store.chunks.get("0,0")!;
console.log("chunk (0,0) program length after peer append:");
let count = 0;
let p = updatedChunk.program;
while (p.tag === "Step") { count++; p = p.rest; }
console.log(count, "steps");

// Run the updated chunk
const peerEvents = runAll(initRuntime(updatedChunk));
console.log("events:", peerEvents.map(e => e.tag));
