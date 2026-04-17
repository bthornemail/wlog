// ============================================================
// WLOG — Runtime
// stepRuntime : Runtime → [Runtime, Event] | null
// runAll      : Runtime → Event[]
// initRuntime : WLOG    → Runtime
// ============================================================

import type { Runtime, WLOG, Event, Config } from "./types.js";
import { ZERO_B8, slot, Done } from "./types.js";
import { runOpcode } from "./eval.js";

// ------------------------------------------------------------------
// Seed → Config
// ------------------------------------------------------------------

export function seedConfig(
  seed: WLOG["header"]["seed"],
): Config {
  return {
    slot:  seed.slot,
    mode:  seed.mode,
    line:  seed.line,
    point: seed.point,
    tile:  seed.tile,
    bits:  ZERO_B8,
  };
}

// ------------------------------------------------------------------
// Single interpreter tick
// ------------------------------------------------------------------

export function stepRuntime(rt: Runtime): [Runtime, Event] | null {
  if (rt.program.tag === "Done") return null;

  const { log, rest } = rt.program;

  // If the current slot matches the LOG slot, execute.
  if (rt.config.slot === log.slot) {
    const [cfg2, ev] = runOpcode(rt.config, log.slot, log.opcode);
    return [{ header: rt.header, config: cfg2, program: rest }, ev];
  }

  // Slot mismatch: wait tick (do NOT consume LOG)
  return [
    { header: rt.header, config: rt.config, program: rt.program },
    { tag: "EventWait", slot: rt.config.slot },
  ];
}

// ------------------------------------------------------------------
// Run to completion (eager, returns full event list)
// ------------------------------------------------------------------

export function runAll(rt: Runtime): Event[] {
  const events: Event[] = [];
  let current: Runtime = rt;

  for (;;) {
    const result = stepRuntime(current);
    if (result === null) break;
    const [next, ev] = result;
    events.push(ev);
    current = next;
  }

  return events;
}

// ------------------------------------------------------------------
// Lazy generator — yields one Event at a time
// ------------------------------------------------------------------

export function* runLazy(rt: Runtime): Generator<Event, void, unknown> {
  let current: Runtime = rt;

  for (;;) {
    const result = stepRuntime(current);
    if (result === null) return;
    const [next, ev] = result;
    yield ev;
    current = next;
  }
}

// ------------------------------------------------------------------
// Create minimal runtime (empty program)
// ------------------------------------------------------------------

export function createRuntime(): Runtime {
  return {
    header: {
      marker: { orientation: "Identity" },
      clock: { base: "Base60" },
      seed: { slot: slot(0), mode: "XX", line: "L0", point: "P0", tile: "T0" },
    },
    config: seedConfig({ slot: slot(0), mode: "XX", line: "L0", point: "P0", tile: "T0" }),
    program: Done(),
  };
}

// ------------------------------------------------------------------
// Construct a Runtime from a WLOG
// ------------------------------------------------------------------

export function initRuntime(wlog: WLOG): Runtime {
  return {
    header:  wlog.header,
    config:  seedConfig(wlog.header.seed),
    program: wlog.program,
  };
}
