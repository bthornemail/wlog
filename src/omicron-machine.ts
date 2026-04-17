// ============================================================
// WOLOG — Omicron Optical-Rewriting Machine
// A kinematic computation system where geometry, logic, and time
// fuse into a single mechanical apparatus.
// ============================================================
//
// The machine is a 5-tuple:
//   M = (A, M, B, Φ, R)
//
// Where:
//   A = Aztec bitboard (40-bit core with spiral layers)
//   M = MaxiCode tilemap (hexagonal grid, 6-neighbor connectivity)
//   B = BEEtag polynomial function (25-bit, 2-of-5 encoded)
//   Φ = Temporal phase (Tick ∈ [0, 5039], mod 5040)
//   R = Rewrite rule set (FEFF/FFFE toggled, 420-tick harmonic)
//
// ============================================================

import type { HornTerm } from "./rif.js";
import { hornConst, hornVar } from "./rif.js";

// ============================================================
// Constants
// ============================================================

export const MASTER_PERIOD = 5040; // 7! — the master kinematic cycle
export const SYNC_INTERVAL = 420; // 12 harmonic sync points
export const SYNC_POINTS: readonly number[] = [
  0, 420, 840, 1260, 1680, 2100, 2520, 2940, 3360, 3780, 4200, 4620
];
export const FANO_POINTS = 7; // Projective plane of order 2

export const BEE_TAG_BITS = 25;
export const AZTEC_CORE_BITS = 40;
export const MAXICODE_DIRECTIONS = 6 as const;

// ============================================================
// Types
// ============================================================

export type Tick = number & { readonly __tag: unique symbol };
export type Bit5 = number & { readonly __tag: unique symbol };
export type Bit40 = bigint & { readonly __tag: unique symbol };

export type InversionMode = "forward" | "inverted";
export type LinkType = "symmetric" | "asymmetric";

export interface AztecCore {
  readonly bits: Bit40;
  readonly layers: number;
  readonly fanoPhase: number; // 0-6
}

export interface MaxiTile {
  readonly id: string;
  readonly cellType: PolyformBasisType;
  readonly orientation: number; // 0, 60, 120, 180, 240, 300
  readonly links: readonly HexDirection[];
}

export type HexDirection = "N" | "NE" | "SE" | "S" | "SW" | "NW";
export type PolyformBasisType = "square" | "triangle" | "hexagon";

export interface BEEtagFunction {
  readonly p: Bit5;
  readonly q: Bit5;
  readonly r: Bit5;
  readonly t: Tick;
}

export interface OmMachine {
  readonly aztec: AztecCore;
  readonly maxi: MaxiScene;
  readonly bee: BEEtagFunction;
  readonly phase: Tick;
  readonly inversion: InversionMode;
  readonly linkType: LinkType;
}

export interface MaxiScene {
  readonly tiles: readonly MaxiTile[];
  readonly centerX: number;
  readonly centerY: number;
}

export interface Frame {
  readonly aztecProjection: string;
  readonly maxiProjection: string;
  readonly beeProjection: Bit5;
  readonly timestamp: number;
  readonly syncPoint: boolean;
}

// ============================================================
// Aztec Bitboard (Projective Geometry)
// ============================================================

export function createAztecCore(bits: bigint, layers: number = 1): AztecCore {
  const fanoPhase = Number(BigInt.asUintN(3, bits)) % 7;
  return {
    bits: bits as Bit40,
    layers,
    fanoPhase,
  };
}

export function rotateAztecCore(core: AztecCore, steps: number): AztecCore {
  const rotation = steps % 7;
  const rotated = (core.bits << BigInt(rotation)) | (core.bits >> BigInt(64 - rotation));
  return {
    bits: rotated as Bit40,
    layers: core.layers,
    fanoPhase: (core.fanoPhase + rotation) % 7,
  };
}

export function aztecToFanoPoints(core: AztecCore): readonly number[] {
  const points: number[] = [];
  for (let i = 0; i < FANO_POINTS; i++) {
    points.push((core.fanoPhase * 60 + i * 60) % MASTER_PERIOD);
  }
  return points;
}

// ============================================================
// MaxiCode Tilemap (Hexagonal Grid)
// ============================================================

const HEX_DIRECTIONS: readonly HexDirection[] = ["N", "NE", "SE", "S", "SW", "NW"];

export function createMaxiTile(
  id: string,
  cellType: PolyformBasisType = "square",
  orientation: number = 0,
  linkType: LinkType = "symmetric",
): MaxiTile {
  const links = linkType === "symmetric"
    ? [...HEX_DIRECTIONS]
    : (["N", "NE"] as readonly HexDirection[]);
  
  return { id, cellType, orientation, links };
}

export function createMaxiScene(tiles: readonly MaxiTile[]): MaxiScene {
  return {
    tiles,
    centerX: 0,
    centerY: 0,
  };
}

export function toggleMaxiLinks(tile: MaxiTile): MaxiTile {
  const newLinkType: LinkType = tile.links.length === 6 ? "asymmetric" : "symmetric";
  return {
    ...tile,
    links: newLinkType === "symmetric" ? [...HEX_DIRECTIONS] : (["N", "NE"] as readonly HexDirection[]),
  };
}

export function retileScene(scene: MaxiScene, _aztec: AztecCore): MaxiScene {
  return {
    ...scene,
    tiles: scene.tiles.map(toggleMaxiLinks),
  };
}

// ============================================================
// BEEtag Polynomial (2-of-5 Encoding)
// ============================================================

const TWO_OF_FIVE_PATTERN: Record<number, number> = {
  0: 0b01101,  // 13
  1: 0b11001,  // 25
  2: 0b11010,  // 26
  3: 0b10110,  // 22
  4: 0b01110,  // 14
  5: 0b11101,  // 29
  6: 0b11011,  // 27
  7: 0b10111,  // 23
  8: 0b11110,  // 30
  9: 0b01111,  // 15
};

export function twoOfFiveEncode(n: number): number {
  return TWO_OF_FIVE_PATTERN[n % 10] ?? 0;
}

export function twoOfFiveDecode(pattern: number): number {
  for (const [digit, p] of Object.entries(TWO_OF_FIVE_PATTERN)) {
    if (p === pattern) return parseInt(digit, 10);
  }
  return 0;
}

export function createBEEtagFunction(p: number, q: number, r: number, t: number): BEEtagFunction {
  return {
    p: (p & 0x1F) as Bit5,
    q: (q & 0x1F) as Bit5,
    r: (r & 0x1F) as Bit5,
    t: (t % MASTER_PERIOD) as Tick,
  };
}

export function evaluateBEEtag(bee: BEEtagFunction, inversion: InversionMode): Bit5 {
  const { p, q, r, t } = bee;
  
  const fanoPhase = t % 7;
  const units = Math.floor(t / 60) % 60;
  const primes = Math.floor(t / 3600) % 7;
  const doublePrimes = Math.floor(t / 25200) % 20;
  
  const spatial = twoOfFiveEncode(units);
  
  if (isSyncPoint(t)) {
    return centralInversion(p, q, r, spatial) as Bit5;
  }
  
  const result = (spatial ^ (p | q | r) ^ fanoPhase) & 0x1F;
  return (inversion === "inverted" ? (~result & 0x1F) : result) as Bit5;
}

export function centralInversion(p: Bit5, q: Bit5, r: Bit5, spatial: number): number {
  const step1 = ~(p | q | r) & 0x1F;
  const step2 = step1 ^ (p & q & r);
  return step2 ^ spatial;
}

// ============================================================
// Sync Point Detection
// ============================================================

export function isSyncPoint(tick: number): boolean {
  return tick % SYNC_INTERVAL === 0;
}

export function getSyncPointIndex(tick: number): number {
  return Math.floor(tick / SYNC_INTERVAL) % 12;
}

export function isFanoPoint(tick: number): boolean {
  return tick % 60 === 0;
}

export function getFanoPhase(tick: number): number {
  return Math.floor(tick / 60) % 7;
}

// ============================================================
// OmMachine Transition Function
// ============================================================

export function createOmMachine(
  aztecBits: bigint = 0n,
  beeP: number = 0,
  beeQ: number = 0,
  beeR: number = 0,
): OmMachine {
  return {
    aztec: createAztecCore(aztecBits),
    maxi: createMaxiScene([
      createMaxiTile("center", "square", 0, "symmetric"),
      createMaxiTile("N", "square", 0, "symmetric"),
      createMaxiTile("NE", "square", 60, "symmetric"),
      createMaxiTile("SE", "square", 120, "symmetric"),
      createMaxiTile("S", "square", 180, "symmetric"),
      createMaxiTile("SW", "square", 240, "symmetric"),
      createMaxiTile("NW", "square", 300, "symmetric"),
    ]),
    bee: createBEEtagFunction(beeP, beeQ, beeR, 0),
    phase: 0 as Tick,
    inversion: "forward",
    linkType: "symmetric",
  };
}

export function tickMachine(machine: OmMachine): OmMachine {
  const newPhase = ((machine.phase + 1) % MASTER_PERIOD) as Tick;
  const newFanoPhase = getFanoPhase(newPhase);
  
  const rotatedAztec: AztecCore = {
    ...machine.aztec,
    bits: ((machine.aztec.bits << BigInt(newFanoPhase)) | 
           (machine.aztec.bits >> BigInt(64 - newFanoPhase))) as Bit40,
    fanoPhase: newFanoPhase,
  };
  
  const updatedMaxi = retileScene(machine.maxi, rotatedAztec);
  
  const newBee: BEEtagFunction = {
    ...machine.bee,
    t: newPhase,
  };
  
  const newInversion: InversionMode = isSyncPoint(newPhase) 
    ? (machine.inversion === "forward" ? "inverted" : "forward")
    : machine.inversion;
  
  const newLinkType: LinkType = isSyncPoint(newPhase)
    ? (machine.linkType === "symmetric" ? "asymmetric" : "symmetric")
    : machine.linkType;
  
  return {
    aztec: rotatedAztec,
    maxi: updatedMaxi,
    bee: newBee,
    phase: newPhase,
    inversion: newInversion,
    linkType: newLinkType,
  };
}

export function transition(
  aztec: AztecCore,
  maxi: MaxiScene,
  bee: BEEtagFunction,
  phase: Tick,
): { aztec: AztecCore; maxi: MaxiScene; bee: BEEtagFunction; phase: Tick } {
  const machine = { aztec, maxi, bee, phase, inversion: "forward" as InversionMode, linkType: "symmetric" as LinkType };
  const next = tickMachine(machine);
  return { aztec: next.aztec, maxi: next.maxi, bee: next.bee, phase: next.phase };
}

// ============================================================
// Frame Projection
// ============================================================

export function projectMachine(machine: OmMachine): Frame {
  const beeOutput = evaluateBEEtag(machine.bee, machine.inversion);
  
  const aztecHex = machine.aztec.bits.toString(16).toUpperCase().padStart(10, "0");
  const fanoPoints = aztecToFanoPoints(machine.aztec);
  
  return {
    aztecProjection: `Aztec(${aztecHex})[${machine.aztec.fanoPhase}]`,
    maxiProjection: `Maxi[${machine.maxi.tiles.length} tiles, ${machine.linkType}]`,
    beeProjection: beeOutput,
    timestamp: machine.phase,
    syncPoint: isSyncPoint(machine.phase),
  };
}

export function projectToString(frame: Frame): string {
  const sync = frame.syncPoint ? " [SYNC]" : "";
  return `${frame.aztecProjection} | ${frame.maxiProjection} | BEE(${frame.beeProjection})${sync}`;
}

// ============================================================
// Kinematic Cycle Computation
// ============================================================

export function* kinematicCycle(
  machine: OmMachine,
  steps: number = MASTER_PERIOD,
): Generator<OmMachine, void, unknown> {
  let current = machine;
  for (let i = 0; i < steps; i++) {
    yield current;
    current = tickMachine(current);
  }
}

export function runKinematicCycle(
  machine: OmMachine,
  steps: number = MASTER_PERIOD,
): readonly Frame[] {
  const frames: Frame[] = [];
  for (const state of kinematicCycle(machine, steps)) {
    frames.push(projectMachine(state));
  }
  return frames;
}

// ============================================================
// Semantic Integration (RIF Horn Terms)
// ============================================================

export function machineToHornTerms(machine: OmMachine): {
  aztecTerm: HornTerm;
  maxiTerm: HornTerm;
  beeTerm: HornTerm;
  phaseTerm: HornTerm;
} {
  return {
    aztecTerm: {
      type: "Const",
      value: `aztec(${machine.aztec.bits.toString(16)})`,
    },
    maxiTerm: {
      type: "Const",
      value: `maxi(${machine.maxi.tiles.length}:${machine.linkType})`,
    },
    beeTerm: {
      type: "Const",
      value: `bee(${machine.bee.p},${machine.bee.q},${machine.bee.r})`,
    },
    phaseTerm: hornConst(String(machine.phase)),
  };
}

export function createCHCRule(machine: OmMachine): {
  head: HornTerm;
  body: readonly HornTerm[];
} {
  const { aztecTerm, maxiTerm, beeTerm, phaseTerm } = machineToHornTerms(machine);
  
  return {
    head: {
      type: "MaxiCode",
      mode: hornConst(String(machine.inversion === "inverted" ? 1 : 0)),
      gridRows: hornConst(String(machine.maxi.tiles.length)),
      gridCols: hornConst("6"),
    },
    body: [aztecTerm, maxiTerm, beeTerm, phaseTerm],
  };
}

// ============================================================
// Bit-Meta-Circular Property
// ============================================================

export interface BitMetaCircular {
  readonly asCode: AztecCore;
  readonly asData: BEEtagFunction;
  readonly isInverted: boolean;
}

export function createBitMetaCircular(aztec: AztecCore, bee: BEEtagFunction): BitMetaCircular {
  return {
    asCode: aztec,
    asData: bee,
    isInverted: false,
  };
}

export function interpretBitMetaCircular(bmc: BitMetaCircular): BitMetaCircular {
  const beeResult = evaluateBEEtag(bmc.asData, bmc.isInverted ? "inverted" : "forward");
  
  return {
    asCode: rotateAztecCore(bmc.asCode, getFanoPhase(bmc.asData.t)),
    asData: { ...bmc.asData, p: beeResult },
    isInverted: isSyncPoint(bmc.asData.t) ? !bmc.isInverted : bmc.isInverted,
  };
}

export function fixedPointBitMetaCircular(bmc: BitMetaCircular): BitMetaCircular {
  let current = bmc;
  const maxIterations = MASTER_PERIOD;
  
  for (let i = 0; i < maxIterations; i++) {
    const next = interpretBitMetaCircular(current);
    if (next.asCode.bits === current.asCode.bits && 
        next.asData.p === current.asData.p &&
        next.isInverted === current.isInverted) {
      return current;
    }
    current = next;
  }
  
  return current;
}

// ============================================================
// Rewrite Rules
// ============================================================

export interface RewriteRule {
  readonly leftHandSide: string;
  readonly rightHandSide: string;
  readonly inversion: InversionMode;
}

export function aztecRewrite(core: AztecCore): AztecCore {
  return rotateAztecCore(core, 1);
}

export function maxiRewrite(scene: MaxiScene): MaxiScene {
  return {
    ...scene,
    tiles: scene.tiles.map(toggleMaxiLinks),
  };
}

export function beeRewrite(bee: BEEtagFunction, inv: InversionMode): BEEtagFunction {
  const output = evaluateBEEtag(bee, inv);
  return { ...bee, p: output };
}

export function compositeRewrite(machine: OmMachine): OmMachine {
  const stepped = tickMachine(machine);
  return {
    ...stepped,
    inversion: stepped.inversion,
  };
}

// ============================================================
// OWL/RDF Serialization
// ============================================================

export const OOM_PREFIXES = `PREFIX oom: <http://omicron.org/ontology/>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>`;

export function machineToTurtle(machine: OmMachine): readonly string[] {
  const id = `oom:machine-${machine.phase}`;
  const triples: string[] = [
    `${id} a oom:OmicronMachine .`,
    `${id} oom:phase "${machine.phase}"^^xsd:integer .`,
    `${id} oom:inversion "${machine.inversion}" .`,
    `${id} oom:linkType "${machine.linkType}" .`,
    `${id} oom:aztecBits "${machine.aztec.bits.toString(16)}" .`,
    `${id} oom:aztecLayers "${machine.aztec.layers}"^^xsd:integer .`,
    `${id} oom:fanoPhase "${machine.aztec.fanoPhase}"^^xsd:integer .`,
    `${id} oom:tileCount "${machine.maxi.tiles.length}"^^xsd:integer .`,
    `${id} oom:beeP "${machine.bee.p}"^^xsd:integer .`,
    `${id} oom:beeQ "${machine.bee.q}"^^xsd:integer .`,
    `${id} oom:beeR "${machine.bee.r}"^^xsd:integer .`,
  ];
  
  if (isSyncPoint(machine.phase)) {
    triples.push(`${id} oom:isSyncPoint "true"^^xsd:boolean .`);
  }
  
  return triples;
}

export const OOM_SHACL_TURTLE = `# Omicron Optical Machine SHACL Shape
oom:OmicronMachineShape a sh:NodeShape ;
  sh:targetClass oom:OmicronMachine ;
  sh:property [
    sh:path oom:phase ;
    sh:minCount 1 ;
    sh:maxCount 1 ;
    sh:datatype xsd:integer ;
    sh:minInclusive 0 ;
    sh:maxInclusive 5039 ;
  ] ;
  sh:property [
    sh:path oom:inversion ;
    sh:minCount 1 ;
    sh:maxCount 1 ;
    sh:in ( "forward" "inverted" ) ;
  ] ;
  sh:property [
    sh:path oom:linkType ;
    sh:minCount 1 ;
    sh:maxCount 1 ;
    sh:in ( "symmetric" "asymmetric" ) ;
  ] .
`;
