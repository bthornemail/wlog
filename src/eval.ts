// ============================================================
// WLOG — Evaluator
// evalExpr  : Config → Expr → Value
// runOpcode : Config → Slot60 → Opcode → [Config, Event]
// ============================================================

import type {
  Expr, Value, Config, Opcode, Event,
  Slot60, B8, Bit,
} from "./types.js";
import {
  VBit, VTile, VMode, VSlot, VBits,
  slot,
} from "./types.js";
import {
  bitNot, bitsNot,
  bitAnd, bitsAnd,
  bitOr,  bitsOr,
  bitXor, bitsXor,
  rotL8,  rotR8,
} from "./bits.js";

// ------------------------------------------------------------------
// evalExpr
// ------------------------------------------------------------------

export function evalExpr(cfg: Config, expr: Expr): Value {
  switch (expr.tag) {
    case "ETile":    return VTile(expr.tile);
    case "EMode":    return VMode(expr.mode);
    case "ESlot":    return VSlot(expr.slot);
    case "EBits":    return VBits(expr.bits);
    case "EMONAD":   return evalExpr(cfg, expr.e);
    case "EFUNCTOR": return evalExpr(cfg, expr.e);   // projection of e, ignoring f

    case "ENOT": {
      const v = evalExpr(cfg, expr.e);
      if (v.tag === "VBit")  return VBit(bitNot(v.bit));
      if (v.tag === "VBits") return VBits(bitsNot(v.bits));
      return v;
    }

    case "EAND": {
      const [va, vb] = [evalExpr(cfg, expr.a), evalExpr(cfg, expr.b)];
      if (va.tag === "VBit"  && vb.tag === "VBit")  return VBit(bitAnd(va.bit,  vb.bit));
      if (va.tag === "VBits" && vb.tag === "VBits") return VBits(bitsAnd(va.bits, vb.bits));
      return va;
    }

    case "EOR": {
      const [va, vb] = [evalExpr(cfg, expr.a), evalExpr(cfg, expr.b)];
      if (va.tag === "VBit"  && vb.tag === "VBit")  return VBit(bitOr(va.bit,  vb.bit));
      if (va.tag === "VBits" && vb.tag === "VBits") return VBits(bitsOr(va.bits, vb.bits));
      return va;
    }

    case "EXOR": {
      const [va, vb] = [evalExpr(cfg, expr.a), evalExpr(cfg, expr.b)];
      if (va.tag === "VBit"  && vb.tag === "VBit")  return VBit(bitXor(va.bit,  vb.bit));
      if (va.tag === "VBits" && vb.tag === "VBits") return VBits(bitsXor(va.bits, vb.bits));
      return va;
    }

    case "ENOR": {
      const v = evalExpr(cfg, { tag: "EOR", a: expr.a, b: expr.b });
      if (v.tag === "VBit")  return VBit(bitNot(v.bit));
      if (v.tag === "VBits") return VBits(bitsNot(v.bits));
      return v;
    }

    case "ENAND": {
      const v = evalExpr(cfg, { tag: "EAND", a: expr.a, b: expr.b });
      if (v.tag === "VBit")  return VBit(bitNot(v.bit));
      if (v.tag === "VBits") return VBits(bitsNot(v.bits));
      return v;
    }
  }
}

// ------------------------------------------------------------------
// Config helpers (immutable update)
// ------------------------------------------------------------------

function setMode  (c: Config, mode:  Config["mode"])  : Config { return { ...c, mode  }; }
function setLine  (c: Config, line:  Config["line"])  : Config { return { ...c, line  }; }
function setPoint (c: Config, point: Config["point"]) : Config { return { ...c, point }; }
function setTile  (c: Config, tile:  Config["tile"])  : Config { return { ...c, tile  }; }
function setBits  (c: Config, bits:  B8)              : Config { return { ...c, bits  }; }

// ------------------------------------------------------------------
// runOpcode
// ------------------------------------------------------------------

export function runOpcode(
  cfg: Config,
  sl: Slot60,
  op: Opcode,
): [Config, Event] {
  switch (op.tag) {
    case "Sync":    return [cfg, { tag: "EventSync", slot: sl }];
    case "Wait":    return [cfg, { tag: "EventWait", slot: sl }];
    case "Join":    return [cfg, { tag: "EventJoin", slot: sl }];
    case "Split":   return [cfg, { tag: "EventSplit", slot: sl }];

    case "RotateL": {
      const cfg2 = setBits(cfg, rotL8(cfg.bits));
      return [cfg2, { tag: "EventRotateL", slot: sl }];
    }
    case "RotateR": {
      const cfg2 = setBits(cfg, rotR8(cfg.bits));
      return [cfg2, { tag: "EventRotateR", slot: sl }];
    }

    case "Emit":
      return [cfg, { tag: "EventEmit", slot: sl, value: evalExpr(cfg, op.expr) }];
    case "Hash":
      return [cfg, { tag: "EventHash", slot: sl, value: evalExpr(cfg, op.expr) }];
    case "Map":
      return [cfg, { tag: "EventMap",  slot: sl, value: evalExpr(cfg, op.expr) }];

    case "Load":
      return [setTile(cfg, op.tile),   { tag: "EventLoad",     slot: sl, tile:  op.tile  }];
    case "SetMode":
      return [setMode(cfg, op.mode),   { tag: "EventSetMode",  slot: sl, mode:  op.mode  }];
    case "SetLine":
      return [setLine(cfg, op.line),   { tag: "EventSetLine",  slot: sl, line:  op.line  }];
    case "SetPoint":
      return [setPoint(cfg, op.point), { tag: "EventSetPoint", slot: sl, point: op.point }];
  }
}
