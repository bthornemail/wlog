// ============================================================
// WOLOG — Polynomial Truth Table
// The isomorphism: 16 Boolean functions ↔ polyform basis types
// Truth table as specification, polyform as implementation
// ============================================================
//
// The 16 Boolean functions (Wittgenstein's truth table):
//
//   φ ∧ P₁(x₁) ∧ ... ∧ Pₙ(xₙ) → P(x)
//
//   Where each Boolean function is a pure function (same input → same output)
//
// The 15-bit MaxiCode identity encodes the polynomial signature:
//   4 bits: truth function (0-15)
//   2 bits: arity (1-4)
//   2 bits: ordering (lex, graded, etc.)
//   2 bits: grouping (monomial, binomial, etc.)
//   2 bits: sequencing (sequential, parallel, etc.)
//   1 bit: closure (open/closed)
//   2 bits: reserved
//
// ============================================================

import type { HornTerm } from "../semantic/rif.js";
import { hornConst } from "../semantic/rif.js";

export const BOOLEAN_FUNCTION_NAMES = [
  "Zero",           // 0: ⊥ (always false)
  "NOR",            // 1: p ↓ q
  "ConverseNonImp", // 2: p ↚ q
  "NOT_p",          // 3: ¬p
  "NonImplication", // 4: p ↛ q
  "NOT_q",          // 5: ¬q
  "XOR",            // 6: p ↮ q
  "NAND",           // 7: p ↑ q
  "AND",            // 8: p ∧ q
  "XNOR",           // 9: p ↔ q
  "q",              // 10: q
  "Implication",    // 11: p → q
  "p",              // 12: p
  "ConverseImp",    // 13: p ← q
  "OR",             // 14: p ∨ q
  "One",            // 15: ⊤ (always true)
] as const;

export type BooleanFunctionName = (typeof BOOLEAN_FUNCTION_NAMES)[number];

export type BooleanValue = 0 | 1;

export type TruthTableRow = readonly [BooleanValue, BooleanValue, BooleanValue, BooleanValue];

export const TRUTH_TABLES: Record<number, TruthTableRow> = {
  0:  [0, 0, 0, 0] as TruthTableRow,  // Zero
  1:  [0, 0, 0, 1] as TruthTableRow,  // NOR
  2:  [0, 0, 1, 0] as TruthTableRow,  // ConverseNonImplication
  3:  [0, 0, 1, 1] as TruthTableRow,  // NOT_p
  4:  [0, 1, 0, 0] as TruthTableRow,  // NonImplication
  5:  [0, 1, 0, 1] as TruthTableRow,  // NOT_q
  6:  [0, 1, 1, 0] as TruthTableRow,  // XOR
  7:  [0, 1, 1, 1] as TruthTableRow,  // NAND
  8:  [1, 0, 0, 0] as TruthTableRow,  // AND
  9:  [1, 0, 0, 1] as TruthTableRow,  // XNOR
  10: [1, 0, 1, 0] as TruthTableRow,  // q
  11: [1, 0, 1, 1] as TruthTableRow,  // Implication
  12: [1, 1, 0, 0] as TruthTableRow,  // p
  13: [1, 1, 0, 1] as TruthTableRow,  // ConverseImplication
  14: [1, 1, 1, 0] as TruthTableRow,  // OR
  15: [1, 1, 1, 1] as TruthTableRow,  // One
};

export interface PolyformSignature {
  readonly truthFunction: number;      // 4 bits (0-15)
  readonly arity: number;            // 2 bits (1-4)
  readonly ordering: TermOrdering;     // 2 bits
  readonly grouping: GroupingType;     // 2 bits
  readonly sequencing: SequencingType; // 2 bits
  readonly closure: ClosureType;        // 1 bit
  readonly reserved: number;           // 2 bits
}

export type TermOrdering = "lexicographic" | "gradedLex" | "gradedRevLex" | "elimination";
export type GroupingType = "monomial" | "binomial" | "trinomial" | "quadrinomial";
export type SequencingType = "sequential" | "parallel" | "recursive" | "iterative";
export type ClosureType = "open" | "closed";

export interface PolynomialCoefficient {
  readonly degree: number;
  readonly value: bigint;
}

export interface PolynomialContinuation {
  readonly coefficients: readonly PolynomialCoefficient[];
  readonly variable: string;
  readonly evaluationMode: SequencingType;
}

export interface TruthTableCell {
  readonly row: number;
  readonly col: number;
  readonly value: BooleanValue;
  readonly position: { x: number; y: number };
}

export interface PolyformAsTruthTable {
  readonly signature: PolyformSignature;
  readonly booleanFunction: BooleanFunctionName;
  readonly truthTable: TruthTableRow;
  readonly cells: readonly TruthTableCell[];
  readonly arity: number;
  readonly degree: number;
}

export function evaluateBooleanFunction(
  functionId: number,
  p: BooleanValue,
  q: BooleanValue,
): BooleanValue {
  const table = TRUTH_TABLES[functionId];
  if (!table) throw new Error(`Unknown boolean function: ${functionId}`);

  const pBit = p ? 2 : 0;
  const qBit = q ? 1 : 0;
  const index = pBit + qBit;
  return table[index] as BooleanValue;
}

export function truthTableToBits(fid: number): readonly BooleanValue[] {
  return TRUTH_TABLES[fid] ?? ([0, 0, 0, 0] as const);
}

export function bitsToHex(bits: readonly BooleanValue[]): string {
  let value = 0;
  for (let i = 0; i < bits.length; i++) {
    if (bits[i]) {
      value |= (1 << (bits.length - 1 - i));
    }
  }
  return value.toString(16).toUpperCase().padStart(Math.ceil(bits.length / 4), "0");
}

export function encodePolyformSignature(sig: PolyformSignature): bigint {
  let value = BigInt(sig.reserved & 0x3);
  value = (value << 1n) | (sig.closure === "closed" ? 1n : 0n);
  value = (value << 2n) | BigInt(sig.sequencing === "sequential" ? 0 : sig.sequencing === "parallel" ? 1 : sig.sequencing === "recursive" ? 2 : 3);
  value = (value << 2n) | BigInt(sig.grouping === "monomial" ? 0 : sig.grouping === "binomial" ? 1 : sig.grouping === "trinomial" ? 2 : 3);
  value = (value << 2n) | BigInt(sig.ordering === "lexicographic" ? 0 : sig.ordering === "gradedLex" ? 1 : sig.ordering === "gradedRevLex" ? 2 : 3);
  value = (value << 2n) | BigInt((sig.arity - 1) & 0x3);
  value = (value << 4n) | BigInt(sig.truthFunction & 0xf);
  return value;
}

export function decodePolyformSignature(bits: bigint): PolyformSignature {
  let remaining = bits;

  const truthFunction = Number(remaining & 0xfn);
  remaining >>= 4n;

  const arity = (Number(remaining & 3n) + 1) as 1 | 2 | 3 | 4;
  remaining >>= 2n;

  const orderingVals: TermOrdering[] = ["lexicographic", "gradedLex", "gradedRevLex", "elimination"];
  const ordering = orderingVals[Number(remaining & 3n)] ?? "lexicographic";
  remaining >>= 2n;

  const groupingVals: GroupingType[] = ["monomial", "binomial", "trinomial", "quadrinomial"];
  const grouping = groupingVals[Number(remaining & 3n)] ?? "monomial";
  remaining >>= 2n;

  const sequencingVals: SequencingType[] = ["sequential", "parallel", "recursive", "iterative"];
  const sequencing = sequencingVals[Number(remaining & 3n)] ?? "sequential";
  remaining >>= 2n;

  const closure = (remaining & 1n) === 1n ? "closed" : "open";
  remaining >>= 1n;

  const reserved = Number(remaining & 3n);

  return { truthFunction, arity, ordering, grouping, sequencing, closure, reserved };
}

export function polyformSignatureToMaxiCodeID(sig: PolyformSignature): number {
  return Number(encodePolyformSignature(sig) & 0x7FFFn);
}

export function maxiCodeIDToPolyformSignature(id: number): PolyformSignature {
  return decodePolyformSignature(BigInt(id & 0x7FFF));
}

export function createPolyformFromTruthTable(
  functionId: number,
  arity: 1 | 2 | 3 | 4 = 2,
  ordering: TermOrdering = "gradedLex",
  grouping: GroupingType = "binomial",
  sequencing: SequencingType = "sequential",
  closure: ClosureType = "closed",
): PolyformAsTruthTable {
  const sig: PolyformSignature = {
    truthFunction: functionId,
    arity,
    ordering,
    grouping,
    sequencing,
    closure,
    reserved: 0,
  };

  const truthTable = TRUTH_TABLES[functionId] ?? [0, 0, 0, 0] as TruthTableRow;
  const cells: TruthTableCell[] = [];

  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 2; col++) {
      const index = row * 2 + col;
      const value = truthTable[index] as BooleanValue;

      let x = col;
      let y = row;

      if (ordering === "gradedRevLex") {
        y = 1 - row;
      }

      cells.push({
        row,
        col,
        value,
        position: { x, y },
      });
    }
  }

  const degree = Math.max(1, functionId % 8);

  return {
    signature: sig,
    booleanFunction: BOOLEAN_FUNCTION_NAMES[functionId] ?? "Zero",
    truthTable,
    cells,
    arity,
    degree,
  };
}

export function polyformToTruthTableBits(polyform: PolyformAsTruthTable): readonly BooleanValue[] {
  return polyform.truthTable;
}

export function polyformToAztecWitness(polyform: PolyformAsTruthTable): string {
  const bits = polyformToTruthTableBits(polyform);
  const hexBits = bitsToHex(bits);
  const sigHex = encodePolyformSignature(polyform.signature).toString(16).toUpperCase().padStart(4, "0");
  return `aztec:${polyform.booleanFunction}:${sigHex}:${hexBits}`;
}

export function polyformToBEEtagPackets(polyform: PolyformAsTruthTable): readonly {
  readonly packetIndex: number;
  readonly identity15: number;
  readonly error10: number;
  readonly bits: readonly BooleanValue[];
}[] {
  const bits = polyformToTruthTableBits(polyform);
  const packets: { packetIndex: number; identity15: number; error10: number; bits: readonly BooleanValue[] }[] = [];

  const paddedBits: BooleanValue[] = [...bits];
  while (paddedBits.length < 15) {
    paddedBits.push(0);
  }

  const identity15 = paddedBits.slice(0, 15).reduce((acc: number, bit, i) => {
    return acc | ((bit ? 1 : 0) << (14 - i));
  }, 0);

  const errorBits = paddedBits.slice(0, 5);
  const error10 = errorBits.reduce((acc: number, bit, i) => {
    return acc | ((bit ? 1 : 0) << (4 - i));
  }, 0);

  for (let i = 0; i < 3; i++) {
    const start = i * 5;
    const end = start + 5;
    const packetBits = paddedBits.slice(start, end);
    packets.push({
      packetIndex: i,
      identity15,
      error10,
      bits: packetBits,
    });
  }

  return packets;
}

export function polynomialContinuation(
  coefficients: readonly PolynomialCoefficient[],
  variable: string,
  evaluationMode: SequencingType = "sequential",
): PolynomialContinuation {
  return { coefficients, variable, evaluationMode };
}

export function evaluatePolynomial(
  poly: PolynomialContinuation,
  value: number,
): bigint {
  const { coefficients, evaluationMode } = poly;

  switch (evaluationMode) {
    case "sequential":
      return coefficients.reduce((acc, { degree, value: coef }) => {
        return acc + coef * BigInt(value) ** BigInt(degree);
      }, 0n);

    case "recursive":
      if (coefficients.length === 0) return 0n;
      let result = coefficients[coefficients.length - 1]!.value;
      for (let i = coefficients.length - 2; i >= 0; i--) {
        result = coefficients[i]!.value + result * BigInt(value);
      }
      return result;

    case "iterative":
    case "parallel":
    default:
      return coefficients.reduce((acc, { degree, value: coef }) => {
        return acc + coef * BigInt(value) ** BigInt(degree);
      }, 0n);
  }
}

export const CLOSURE_FUNCTION: Record<number, number> = {
  0: 15,   // Zero → One
  1: 14,   // NOR → OR
  2: 13,   // ConverseNonImp → ConverseImp
  3: 12,   // NOT_p → p
  4: 11,   // NonImplication → Implication
  5: 10,   // NOT_q → q
  6: 9,    // XOR → XNOR
  7: 8,    // NAND → AND
  8: 7,    // AND → NAND
  9: 6,     // XNOR → XOR
  10: 5,    // q → NOT_q
  11: 4,    // Implication → NonImplication
  12: 3,    // p → NOT_p
  13: 2,    // ConverseImp → ConverseNonImp
  14: 1,    // OR → NOR
  15: 0,    // One → Zero
};

export function applyClosure(functionId: number): number {
  return CLOSURE_FUNCTION[functionId] ?? functionId;
}

export const POLYFORM_BASIS_NAMES = [
  "Zero",           // 0 cells → Zero function
  "Monomino",       // 1 cell → NOT_p / NOT_q
  "Domino",         // 2 cells → AND
  "Tromino",        // 3 cells → OR
  "Tetromino",      // 4 cells → XOR
  "Pentomino",      // 5 cells → NAND
  "Hexomino",       // 6 cells → NOR
  "Heptomino",      // 7 cells → Implication
  "Octomino",       // 8 cells → XNOR
  "Nonomino",       // 9 cells → NOT_q
  "Decomino",       // 10 cells → NOT_p
  "Hendecomino",    // 11 cells → ConverseImp
  "Dodecomino",     // 12 cells → ConverseNonImp
  "Tridecomino",    // 13 cells → NonImplication
  "Tetradecomino",  // 14 cells → q
  "Pentadecomino",  // 15 cells → p
  "Hexadecomino",   // 16 cells → One
] as const;

export type PolyformBasisName = (typeof POLYFORM_BASIS_NAMES)[number];

export function basisNameToFunction(basisName: PolyformBasisName): number {
  const idx = (POLYFORM_BASIS_NAMES as readonly string[]).indexOf(basisName);
  if (idx <= 1) return idx === 0 ? 0 : 3; // Zero → 0, Monomino → NOT_p
  if (idx >= 16) return 15; // Hexadecomino → One

  const functionMap: Record<number, number> = {
    2: 8,   // Domino → AND
    3: 14,  // Tromino → OR
    4: 6,   // Tetromino → XOR
    5: 7,   // Pentomino → NAND
    6: 1,   // Hexomino → NOR
    7: 11,  // Heptomino → Implication
    8: 9,   // Octomino → XNOR
    9: 5,   // Nonomino → NOT_q
    10: 3,  // Decomino → NOT_p
    11: 13, // Hendecomino → ConverseImp
    12: 2,  // Dodecomino → ConverseNonImp
    13: 4,  // Tridecomino → NonImplication
    14: 10, // Tetradecomino → q
    15: 12, // Pentadecomino → p
  };

  return functionMap[idx] ?? 0;
}

export function polyformToHornTerm(polyform: PolyformAsTruthTable): HornTerm {
  const sig = polyform.signature;
  const truthBits = polyformToTruthTableBits(polyform);
  const hexValue = bitsToHex(truthBits);

  return {
    type: "MaxiCode",
    mode: hornConst(String(sig.truthFunction)),
    gridRows: hornConst("33"),
    gridCols: hornConst(String(sig.arity * 8 + sig.grouping.length)),
  };
}

export const TRUTH_TABLE_TO_POLYFORM: Record<number, {
  readonly name: PolyformBasisName;
  readonly degree: number;
  readonly latticePosition: number;
}> = {
  0:  { name: "Zero",          degree: 0,  latticePosition: 0  },
  1:  { name: "Hexomino",       degree: 6,  latticePosition: 1  },
  2:  { name: "Dodecomino",    degree: 12, latticePosition: 2  },
  3:  { name: "Decomino",       degree: 10, latticePosition: 3  },
  4:  { name: "Tridecomino",    degree: 13, latticePosition: 4  },
  5:  { name: "Nonomino",       degree: 9,  latticePosition: 5  },
  6:  { name: "Tetromino",      degree: 4,  latticePosition: 6  },
  7:  { name: "Pentomino",      degree: 5,  latticePosition: 7  },
  8:  { name: "Domino",        degree: 2,  latticePosition: 8  },
  9:  { name: "Octomino",       degree: 8,  latticePosition: 9  },
  10: { name: "Tetradecomino", degree: 14, latticePosition: 10 },
  11: { name: "Heptomino",      degree: 7,  latticePosition: 11 },
  12: { name: "Pentadecomino", degree: 15, latticePosition: 12 },
  13: { name: "Hendecomino",   degree: 11, latticePosition: 13 },
  14: { name: "Tromino",       degree: 3,  latticePosition: 14 },
  15: { name: "Hexadecomino", degree: 16, latticePosition: 15 },
};
