// ============================================================
// Aztec Slide Rule Library
// Virtual codepoint basis algebra for geometric computation.
// ============================================================
import {
  getActiveBeeTagCodebook,
  getAuthoritativeBeeTagCodebook,
  getBeeTagCodebookMode,
  setBeeTagCodebookMode as setBeeTagCodebookModeInternal,
  setComputedBeeTagCodebook,
  type BeeTagCodebookMode,
} from "./beetag-codebook.js";
export type { BeeTagCodebookMode } from "./beetag-codebook.js";

export const BASIS_FAMILIES = [
  "Squares",
  "Cubes",
  "Triangles",
  "Hexagons",
  "RightTriangles",
  "Rhombs",
  "MultiRhombs",
  "Octagons",
  "Rounds",
  "Bends",
  "Hops",
  "GoldenTriangles",
] as const;

export const CODEPOINT_GROUPS = [
  "basis",
  "instrument",
  "carrier",
  "projection",
  "sample",
  "meta",
] as const;

export const SAMPLE_KINDS = [
  "resel",
  "pixel",
  "texel",
  "voxel",
  "tixel",
  "hogel",
] as const;

export const POLYNOMIAL_DEGREES = [0, 1, 2, 3, 4, 5, 6, 7] as const;

export const POLYNOMIAL_PROPERTIES = [
  "Univariate",
  "Bivariate",
  "Multivariate",
  "Monomial",
  "Binomial",
  "Trinomial",
  "Irreducible",
  "SquareFree",
  "Homogeneous",
  "QuasiHomogeneous",
] as const;

export const INSTRUMENTS = [
  "SmithChart",
  "GenailleRods",
  "BinaryGuessSurface",
] as const;

export const CODEPOINT_FLAGS = {
  svgReady: 0b0000_0001,
  declaredOnly: 0b0000_0010,
  reserved25D: 0b0000_0100,
  reserved3D: 0b0000_1000,
} as const;

const FAMILY_CODES: Readonly<Record<BasisFamily, number>> = {
  Squares: 0x01,
  Cubes: 0x02,
  Triangles: 0x03,
  Hexagons: 0x04,
  RightTriangles: 0x05,
  Rhombs: 0x06,
  MultiRhombs: 0x07,
  Octagons: 0x08,
  Rounds: 0x09,
  Bends: 0x0a,
  Hops: 0x0b,
  GoldenTriangles: 0x0c,
};

const GROUP_CODES: Readonly<Record<CodepointGroup, number>> = {
  basis: 0x10,
  instrument: 0x20,
  carrier: 0x30,
  projection: 0x40,
  sample: 0x50,
  meta: 0x60,
};

const FAMILY_BY_CODE = Object.fromEntries(
  Object.entries(FAMILY_CODES).map(([label, code]) => [code, label]),
) as Record<number, BasisFamily>;

const GROUP_BY_CODE = Object.fromEntries(
  Object.entries(GROUP_CODES).map(([label, code]) => [code, label]),
) as Record<number, CodepointGroup>;

export type BasisFamily = (typeof BASIS_FAMILIES)[number];
export type CodepointGroup = (typeof CODEPOINT_GROUPS)[number];
export type SampleKind = (typeof SAMPLE_KINDS)[number];
export type PolynomialDegree = (typeof POLYNOMIAL_DEGREES)[number];
export type PolynomialProperty = (typeof POLYNOMIAL_PROPERTIES)[number];
export type Instrument = (typeof INSTRUMENTS)[number];
export type PackedLayout = "5x8" | "8x5";
export type ProjectionKind = "Svg2D" | "Scene25D" | "Volume3D";

export type PackedCodepoint40Octets = readonly [number, number, number, number, number];
export type PackedCodepoint40Groups5 = readonly [number, number, number, number, number, number, number, number];

export interface PackedCodepoint40 {
  readonly value: bigint;
  readonly octets: PackedCodepoint40Octets;
  readonly groups5: PackedCodepoint40Groups5;
}

export interface SymbolicCodepoint {
  readonly family: BasisFamily;
  readonly group: CodepointGroup;
  readonly variant: number;
  readonly decorator: number;
  readonly flags: number;
  readonly alias: string;
}

export interface VirtualCodepoint {
  readonly packed40: PackedCodepoint40;
  readonly symbolic: SymbolicCodepoint;
}

export interface PolynomialClass {
  readonly degree: PolynomialDegree;
  readonly properties: readonly PolynomialProperty[];
}

export interface SquareCoords {
  readonly tag: "square";
  readonly x: number;
  readonly y: number;
}

export interface TriangleCoords {
  readonly tag: "triangle";
  readonly q: number;
  readonly r: number;
  readonly s: number;
}

export interface HexCoords {
  readonly tag: "hex";
  readonly q: number;
  readonly r: number;
}

export interface CubeCoords {
  readonly tag: "cube";
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

export interface GenericCoords {
  readonly tag: "generic";
  readonly values: readonly number[];
}

export type BasisCoords =
  | SquareCoords
  | TriangleCoords
  | HexCoords
  | CubeCoords
  | GenericCoords;

export interface BasisCell {
  readonly codepoint: VirtualCodepoint;
  readonly family: BasisFamily;
  readonly sampleKind: SampleKind;
  readonly polynomialClass: PolynomialClass;
  readonly orientation: number;
  readonly coords: BasisCoords;
  readonly projectionStatus: "svg-ready" | "declared" | "stub";
}

export interface FunctionalTagPointer<T = BasisCell> {
  readonly codepoint: VirtualCodepoint;
  readonly value: T;
  readonly next?: FunctionalTagPointer<T>;
}

export interface SvgProjection {
  readonly kind: "Svg2D";
  readonly id: string;
  readonly svg: string;
}

export interface Scene25DProjection {
  readonly kind: "Scene25D";
  readonly id: string;
  readonly layers: readonly string[];
}

export interface Volume3DProjection {
  readonly kind: "Volume3D";
  readonly id: string;
  readonly voxels: readonly [number, number, number][];
}

export type Projection = SvgProjection | Scene25DProjection | Volume3DProjection;

export interface SmithChartInput {
  readonly normalizedResistance: number;
  readonly normalizedReactance: number;
}

export interface GenailleRodsInput {
  readonly dividend: number;
  readonly divisor: number;
}

export interface BinaryGuessInput {
  readonly selectedMasks: readonly number[];
  readonly maxBits?: number;
}

// AZTEC = Serializable Sprite (identity, persistence)
export interface AztecCarrier {
  readonly kind: "AztecCarrier";
  readonly codepoint: VirtualCodepoint;
  readonly manifestWitness: string;
  readonly layers: number;
  readonly modeBits: number;
  readonly packedHex: string;
}

// BEE = Message (physical print/scan or computational wire transport)
export interface BeeTagCarrier {
  readonly kind: "BeeTagCarrier";
  readonly codepoint: VirtualCodepoint;
  readonly sourceIdentity15: number;
  readonly identity15: number;
  readonly identityBits15: string;
  readonly identityMatrix3x5: readonly string[];
  readonly errorCheck5: string;
  readonly error10: number;
  readonly errorBits10: string;
  readonly matrix5x5: readonly string[];
  readonly borderModel: {
    readonly whitePixels: 1;
    readonly blackPixels: 1;
  };
  readonly orientationMatches: readonly number[];
  readonly orientationValid: boolean;
  readonly rotationHammingFloor: number;
  readonly codebook: "master-d3";
}

export const MAXICODE_MODES = [2, 3, 4, 5, 6] as const;
export type MaxiCodeMode = (typeof MAXICODE_MODES)[number];

export interface StructuredCarrierMessage {
  readonly countryCode: number;
  readonly classOfService: number;
  readonly postalCode: string;
  readonly secondaryMessage?: string;
}

// MAXI = Scene Projection (tilemap, voxel, hexel, pixel views)
export interface MaxiCodeCarrier {
  readonly kind: "MaxiCodeCarrier";
  readonly codepoint: VirtualCodepoint;
  readonly mode: MaxiCodeMode;
  readonly structuredMessage: StructuredCarrierMessage;
  readonly totalCodewords: number;
  readonly dataCodewords: number;
  readonly eccCodewords: number;
  readonly errorCorrectionLevel: "SEC" | "EEC";
  readonly gridRows: number;
  readonly gridCols: number;
  readonly totalModules: number;
  readonly hexModules: readonly string[];
}

export const CODE16K_MODES = [0, 1, 2, 3, 4, 5, 6] as const;
export type Code16KMode = (typeof CODE16K_MODES)[number];
export type Code16KStartCodeSet = "A" | "B" | "C";
export type Code16KStartShift = "none" | "fnc1" | "single-shift-b" | "double-shift-b";

export interface Code16KConcatenationMeta {
  readonly enabled: boolean;
  readonly blockIndex: number;
  readonly totalBlocks: number;
}

export interface Code16KChecksumMeta {
  readonly modulus: 107;
  readonly check1: number;
  readonly check2: number;
}

// CODE16K = Row-stacked record/message carrier
export interface Code16KCarrier {
  readonly kind: "Code16KCarrier";
  readonly codepoint: VirtualCodepoint;
  readonly rows: number;
  readonly symbolsPerRow: 5;
  readonly mode: Code16KMode;
  readonly startCodeSet: Code16KStartCodeSet;
  readonly startShift: Code16KStartShift;
  readonly concatenation: Code16KConcatenationMeta;
  readonly checksums: Code16KChecksumMeta;
  readonly normalizedPayload: string;
  readonly recordRows: readonly string[];
  readonly manifestWitness: string;
}

export interface PolygonCell {
  readonly sideCount: number;
  readonly optical: "dark" | "light";
  readonly x: number;
  readonly y: number;
}

export interface PolygonAcquisitionTarget {
  readonly kind: "concentric-rings";
  readonly ringCount: number;
  readonly center: { readonly x: number; readonly y: number };
}

export interface PolygonGridSpec {
  readonly geometry: "hexagonal";
  readonly rows: number;
  readonly cols: number;
  readonly axesDegrees: readonly [0, 60, 120];
  readonly cluster: "3x3";
}

export interface PolygonClockRecoveryModel {
  readonly stages: readonly [
    "edge-enhancement",
    "windowing",
    "fft-2d",
    "annular-filter",
    "ifft-2d",
    "axis-estimation",
    "coarse-grid",
    "decode",
  ];
}

export interface PolygonalCarrier {
  readonly kind: "PolygonalCarrier";
  readonly codepoint: VirtualCodepoint;
  readonly declaration: "polygon-grid";
  readonly clockRecovery: PolygonClockRecoveryModel;
  readonly acquisitionTarget: PolygonAcquisitionTarget;
  readonly grid: PolygonGridSpec;
  readonly highPriorityBits: string;
  readonly lowPriorityBits: string;
  readonly polygons: readonly PolygonCell[];
  readonly manifestWitness: string;
}

export type Carrier = AztecCarrier | MaxiCodeCarrier | BeeTagCarrier | Code16KCarrier | PolygonalCarrier;

export interface CarrierEnvelope {
  readonly codepoint: VirtualCodepoint;
  readonly carrierKind: Carrier["kind"];
  readonly payloadHash: string;
  readonly witness: string;
  readonly sequenceMeta?: {
    readonly index: number;
    readonly total: number;
  };
  readonly decodeConfidence: number;
  readonly carrier: Carrier;
}

export interface CarrierReconcileResult {
  readonly canonicalPolyformHash: string;
  readonly accepted: readonly CarrierEnvelope[];
  readonly rejected: readonly CarrierEnvelope[];
  readonly deterministicOrder: readonly string[];
}

export function normalizeSymbolicCodepoint(input: {
  readonly family: BasisFamily;
  readonly group: CodepointGroup;
  readonly variant: number;
  readonly decorator?: number;
  readonly flags?: number;
}): SymbolicCodepoint {
  const variant = assertByte(input.variant, "variant");
  const decorator = assertByte(input.decorator ?? 0, "decorator");
  const flags = assertByte(input.flags ?? 0, "flags");
  const family = input.family;
  const group = input.group;
  const alias = `${family}.${group}.v${toHexByte(variant)}.d${toHexByte(decorator)}.f${toHexByte(flags)}`;
  return { family, group, variant, decorator, flags, alias };
}

export function packedCodepoint40FromOctets(octets: PackedCodepoint40Octets): PackedCodepoint40 {
  for (const [index, octet] of octets.entries()) {
    assertByte(octet, `octet${index}`);
  }
  let value = 0n;
  for (const octet of octets) {
    value = (value << 8n) | BigInt(octet);
  }
  return {
    value,
    octets,
    groups5: packedCodepoint40Groups5FromValue(value),
  };
}

export function packedCodepoint40FromGroups5(groups5: PackedCodepoint40Groups5): PackedCodepoint40 {
  for (const [index, group] of groups5.entries()) {
    if (!Number.isInteger(group) || group < 0 || group > 0x1f) {
      throw new RangeError(`group${index} must be an integer between 0 and 31`);
    }
  }
  let value = 0n;
  for (const group of groups5) {
    value = (value << 5n) | BigInt(group);
  }
  return {
    value,
    octets: packedCodepoint40OctetsFromValue(value),
    groups5,
  };
}

export function virtualCodepointFromSymbolic(symbolicInput: {
  readonly family: BasisFamily;
  readonly group: CodepointGroup;
  readonly variant: number;
  readonly decorator?: number;
  readonly flags?: number;
}): VirtualCodepoint {
  const symbolic = normalizeSymbolicCodepoint(symbolicInput);
  const octets: PackedCodepoint40Octets = [
    FAMILY_CODES[symbolic.family],
    GROUP_CODES[symbolic.group],
    symbolic.variant,
    symbolic.decorator,
    symbolic.flags,
  ];
  return {
    packed40: packedCodepoint40FromOctets(octets),
    symbolic,
  };
}

export function virtualCodepointFromPacked40(packed40: PackedCodepoint40): VirtualCodepoint {
  const [familyCode, groupCode, variant, decorator, flags] = packed40.octets;
  const family = FAMILY_BY_CODE[familyCode];
  const group = GROUP_BY_CODE[groupCode];
  if (!family) {
    throw new RangeError(`Unknown basis family code 0x${familyCode.toString(16)}`);
  }
  if (!group) {
    throw new RangeError(`Unknown codepoint group code 0x${groupCode.toString(16)}`);
  }
  return {
    packed40,
    symbolic: normalizeSymbolicCodepoint({
      family,
      group,
      variant,
      decorator,
      flags,
    }),
  };
}

export function virtualCodepointRoundtrip(codepoint: VirtualCodepoint): VirtualCodepoint {
  return virtualCodepointFromPacked40(
    packedCodepoint40FromGroups5(codepoint.packed40.groups5),
  );
}

export function classifyPolynomialClass(
  degree: PolynomialDegree,
  properties: readonly PolynomialProperty[],
): PolynomialClass {
  return {
    degree,
    properties: [...new Set(properties)],
  };
}

export function basisCell(
  codepoint: VirtualCodepoint,
  sampleKind: SampleKind,
  polynomialClass: PolynomialClass,
  orientation = 0,
  coords?: BasisCoords,
): BasisCell {
  const family = codepoint.symbolic.family;
  return {
    codepoint,
    family,
    sampleKind,
    polynomialClass,
    orientation,
    coords: coords ?? defaultCoordsForFamily(family, codepoint.symbolic.variant),
    projectionStatus: projectionStatusForFamily(family),
  };
}

export function basisNeighbors(cell: BasisCell): readonly BasisCoords[] {
  switch (cell.family) {
    case "Squares": {
      const coords = asSquareCoords(cell.coords);
      return [
        { tag: "square", x: coords.x + 1, y: coords.y },
        { tag: "square", x: coords.x - 1, y: coords.y },
        { tag: "square", x: coords.x, y: coords.y + 1 },
        { tag: "square", x: coords.x, y: coords.y - 1 },
      ];
    }
    case "Triangles": {
      const coords = asTriangleCoords(cell.coords);
      return [
        { tag: "triangle", q: coords.q + 1, r: coords.r, s: coords.s - 1 },
        { tag: "triangle", q: coords.q, r: coords.r + 1, s: coords.s - 1 },
        { tag: "triangle", q: coords.q - 1, r: coords.r + 1, s: coords.s },
      ];
    }
    case "Hexagons": {
      const coords = asHexCoords(cell.coords);
      return [
        { tag: "hex", q: coords.q + 1, r: coords.r },
        { tag: "hex", q: coords.q - 1, r: coords.r },
        { tag: "hex", q: coords.q, r: coords.r + 1 },
        { tag: "hex", q: coords.q, r: coords.r - 1 },
        { tag: "hex", q: coords.q + 1, r: coords.r - 1 },
        { tag: "hex", q: coords.q - 1, r: coords.r + 1 },
      ];
    }
    default:
      return [];
  }
}

export function mapTagPointer<T, U>(
  pointer: FunctionalTagPointer<T>,
  fn: (value: T) => U,
): FunctionalTagPointer<U> {
  const next = pointer.next ? mapTagPointer(pointer.next, fn) : undefined;
  return {
    codepoint: pointer.codepoint,
    value: fn(pointer.value),
    ...(next ? { next } : {}),
  };
}

export function buildSvgProjection(cell: BasisCell): SvgProjection {
  return {
    kind: "Svg2D",
    id: cell.codepoint.symbolic.alias,
    svg: renderBasisCellSvg(cell),
  };
}

export function buildScene25DProjection(cell: BasisCell): Scene25DProjection {
  return {
    kind: "Scene25D",
    id: cell.codepoint.symbolic.alias,
    layers: [
      `base:${cell.codepoint.symbolic.alias}`,
      `elevation:${(cell.codepoint.symbolic.flags & CODEPOINT_FLAGS.reserved25D) !== 0 ? "reserved" : "stub"}`,
    ],
  };
}

export function buildVolume3DProjection(cell: BasisCell): Volume3DProjection {
  const coords = cell.coords;
  const voxels: [number, number, number][] =
    coords.tag === "cube"
      ? [[coords.x, coords.y, coords.z]]
      : [[0, 0, 0]];
  return {
    kind: "Volume3D",
    id: cell.codepoint.symbolic.alias,
    voxels,
  };
}

export function buildSmithChartSvg(input: SmithChartInput): SvgProjection {
  const gammaX = (input.normalizedResistance - 1) / (input.normalizedResistance + 1);
  const gammaY = input.normalizedReactance / (Math.abs(input.normalizedReactance) + input.normalizedResistance + 1);
  const px = 200 + gammaX * 150;
  const py = 200 - gammaY * 150;
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">`,
    `<rect width="400" height="400" fill="#fff8ef"/>`,
    `<circle cx="200" cy="200" r="160" fill="none" stroke="#222" stroke-width="2"/>`,
    `<circle cx="280" cy="200" r="80" fill="none" stroke="#c8b69b" stroke-width="1"/>`,
    `<circle cx="240" cy="200" r="120" fill="none" stroke="#dbcdb8" stroke-width="1"/>`,
    `<path d="M 200 40 A 160 160 0 0 1 200 360" fill="none" stroke="#c8b69b" stroke-width="1"/>`,
    `<path d="M 40 200 H 360" fill="none" stroke="#444" stroke-width="1"/>`,
    `<circle cx="${round(px)}" cy="${round(py)}" r="6" fill="#ba3d22"/>`,
    `<text x="20" y="28" font-size="16" font-family="monospace">SmithChart r=${input.normalizedResistance} x=${input.normalizedReactance}</text>`,
    `</svg>`,
  ].join("");
  return { kind: "Svg2D", id: "SmithChart", svg };
}

export function buildGenailleRodsSvg(input: GenailleRodsInput): SvgProjection {
  const columns = Math.max(2, input.divisor);
  const rodWidth = 56;
  const height = 280;
  const path = Array.from({ length: columns }, (_, index) => {
    const x1 = 24 + index * rodWidth;
    const x2 = x1 + rodWidth;
    const y1 = 60 + ((input.dividend + index * 13) % 8) * 22;
    const y2 = 60 + ((input.dividend + index * 7) % 8) * 22;
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#2f4f4f" stroke-width="2"/>`;
  }).join("");
  const rods = Array.from({ length: columns }, (_, index) => {
    const x = 20 + index * rodWidth;
    return `<g><rect x="${x}" y="20" width="${rodWidth}" height="${height}" fill="${index === 0 ? "#d9d9d9" : "#ffffff"}" stroke="#222"/><text x="${x + rodWidth / 2}" y="42" font-size="14" text-anchor="middle" font-family="monospace">${index === 0 ? "I" : index}</text></g>`;
  }).join("");
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${40 + columns * rodWidth} 320">`,
    `<rect width="100%" height="100%" fill="#fdfbf7"/>`,
    rods,
    path,
    `<text x="20" y="305" font-size="14" font-family="monospace">GenailleRods dividend=${input.dividend} divisor=${input.divisor}</text>`,
    `</svg>`,
  ].join("");
  return { kind: "Svg2D", id: "GenailleRods", svg };
}

export function buildBinaryGuessSurfaceSvg(input: BinaryGuessInput): SvgProjection {
  const maxBits = input.maxBits ?? 5;
  const cards = Array.from({ length: maxBits }, (_, bit) => {
    const x = 20;
    const y = 20 + bit * 120;
    const nums = numbersForBit(bit, maxBits).slice(0, 12).join(" ");
    const active = input.selectedMasks.includes(bit);
    return [
      `<g>`,
      `<rect x="${x}" y="${y}" width="340" height="100" rx="18" fill="${active ? "#ffe4c0" : "#eef3ff"}" stroke="#223"/>`,
      `<text x="${x + 18}" y="${y + 28}" font-size="15" font-family="monospace">bit ${bit} (+${2 ** bit})</text>`,
      `<text x="${x + 18}" y="${y + 64}" font-size="13" font-family="monospace">${nums}</text>`,
      `</g>`,
    ].join("");
  }).join("");
  const value = input.selectedMasks.reduce((sum, bit) => sum + (1 << bit), 0);
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 ${40 + maxBits * 120}">`,
    `<rect width="100%" height="100%" fill="#fff"/>`,
    cards,
    `<text x="20" y="${18 + maxBits * 120}" font-size="16" font-family="monospace">BinaryGuessSurface value=${value}</text>`,
    `</svg>`,
  ].join("");
  return { kind: "Svg2D", id: "BinaryGuessSurface", svg };
}

export function projectToAztecCarrier(codepoint: VirtualCodepoint): AztecCarrier {
  const layers = 1 + (codepoint.symbolic.variant % 4);
  return {
    kind: "AztecCarrier",
    codepoint,
    manifestWitness: `aztec:${codepoint.symbolic.alias}:${toHex40(codepoint.packed40.value)}`,
    layers,
    modeBits: 8 + layers * 2,
    packedHex: toHex40(codepoint.packed40.value),
  };
}

export function projectToBeeTagCarrier(codepoint: VirtualCodepoint): BeeTagCarrier {
  const rawIdentity15 = Number((codepoint.packed40.value >> 10n) & 0x7fffn);
  const sourceIdentity15 = rawIdentity15 === 0 ? 1 : rawIdentity15;
  const identity15 = normalizeToMasterBeeTagIdentity(sourceIdentity15);
  const derived = beeTagFromIdentity15(identity15);
  return {
    kind: "BeeTagCarrier",
    codepoint,
    sourceIdentity15,
    identity15: derived.identity15,
    identityBits15: derived.identityBits15,
    identityMatrix3x5: derived.identityMatrix3x5,
    errorCheck5: derived.errorCheck5,
    error10: Number.parseInt(derived.errorBits10, 2),
    errorBits10: derived.errorBits10,
    matrix5x5: derived.matrix5x5,
    borderModel: {
      whitePixels: 1,
      blackPixels: 1,
    },
    orientationMatches: derived.orientationMatches,
    orientationValid: derived.orientationValid,
    rotationHammingFloor: derived.rotationHammingFloor,
    codebook: "master-d3",
  };
}

export function beeTagFromIdentity15(identity15: number): {
  readonly identity15: number;
  readonly identityBits15: string;
  readonly identityMatrix3x5: readonly string[];
  readonly errorCheck5: string;
  readonly errorBits10: string;
  readonly matrix5x5: readonly string[];
  readonly orientationMatches: readonly number[];
  readonly orientationValid: boolean;
  readonly rotationHammingFloor: number;
} {
  if (!Number.isInteger(identity15) || identity15 < 1 || identity15 > 32767) {
    throw new RangeError("identity15 must be an integer between 1 and 32767");
  }
  const identityBits15 = identity15.toString(2).padStart(15, "0");
  const identityMatrix3x5 = beeTagIdentityMatrix3x5(identityBits15);
  const errorCheck5 = beeTagErrorCheck5(identityMatrix3x5);
  const errorBits10 = beeTagErrorBits10(errorCheck5);
  const matrix5x5 = beeTagMatrixFromIdentityAndError(identityMatrix3x5, errorBits10);
  const orientationMatches = beeTagOrientationMatches(matrix5x5);
  return {
    identity15,
    identityBits15,
    identityMatrix3x5,
    errorCheck5,
    errorBits10,
    matrix5x5,
    orientationMatches,
    orientationValid: orientationMatches.length === 1,
    rotationHammingFloor: beeTagRotationHammingFloor(matrix5x5),
  };
}

export function beeTagIsOrientationValid(identity15: number): boolean {
  return beeTagFromIdentity15(identity15).orientationValid;
}

export function enumerateBeeTagOrientationValidIdentities(): readonly number[] {
  const valid: number[] = [];
  for (let identity15 = 1; identity15 <= 32767; identity15++) {
    if (beeTagIsOrientationValid(identity15)) {
      valid.push(identity15);
    }
  }
  return valid;
}

export function enumerateBeeTagMasterIdentities(): readonly number[] {
  return getActiveBeeTagCodebook();
}

export function enumerateBeeTagAuthoritativeMasterIdentities(): readonly number[] {
  return getAuthoritativeBeeTagCodebook();
}

export function getBeeTagCodebookStrategy(): BeeTagCodebookMode {
  return getBeeTagCodebookMode();
}

export function setBeeTagCodebookStrategy(mode: BeeTagCodebookMode): void {
  if (mode === "computed") {
    setComputedBeeTagCodebook(getOrBuildComputedBeeTagMasterCodebook());
  }
  setBeeTagCodebookModeInternal(mode);
}

export function projectToPolygonalCarrier(codepoint: VirtualCodepoint): PolygonalCarrier {
  const sideCount = polygonSidesForFamily(codepoint.symbolic.family);
  const payloadBits = codepoint.packed40.value.toString(2).padStart(40, "0");
  const highPriorityBits = payloadBits.slice(0, 16);
  const lowPriorityBits = payloadBits.slice(16);
  const grid = {
    geometry: "hexagonal" as const,
    rows: 33,
    cols: 30,
    axesDegrees: [0, 60, 120] as const,
    cluster: "3x3" as const,
  };
  const acquisitionTarget = {
    kind: "concentric-rings" as const,
    ringCount: 3,
    center: { x: Math.floor(grid.cols / 2), y: Math.floor(grid.rows / 2) },
  };
  const clockRecovery = {
    stages: [
      "edge-enhancement",
      "windowing",
      "fft-2d",
      "annular-filter",
      "ifft-2d",
      "axis-estimation",
      "coarse-grid",
      "decode",
    ] as const,
  };
  const polygons = polygonGridCells(grid.rows, grid.cols, sideCount, payloadBits);
  return {
    kind: "PolygonalCarrier",
    codepoint,
    declaration: "polygon-grid",
    clockRecovery,
    acquisitionTarget,
    grid,
    highPriorityBits,
    lowPriorityBits,
    polygons,
    manifestWitness: `polygonal:${codepoint.symbolic.alias}:hex-grid:${grid.rows}x${grid.cols}`,
  };
}

export function projectToMaxiCodeCarrier(codepoint: VirtualCodepoint): MaxiCodeCarrier {
  const rawMode = ((codepoint.symbolic.variant >> 2) & 0x03);
  const mode: MaxiCodeMode = (rawMode === 0 ? 2 : rawMode === 1 ? 3 : rawMode === 2 ? 4 : rawMode === 3 ? 5 : 6);
  const postalCodeNumeric = String(codepoint.packed40.value % 100000000n).padStart(8, "0");
  const countryCode = Number((codepoint.packed40.value >> 8n) & 0x3ffn);
  const classOfService = Number((codepoint.packed40.value >> 18n) & 0x07n);
  const totalCodewords = 144;
  const dataCodewords = mode >= 5 ? 60 : 68;
  const eccCodewords = totalCodewords - dataCodewords;
  const gridRows = 33;
  const gridCols = 30;
  const totalModules = gridRows === 33 ? 884 : 0;
  return {
    kind: "MaxiCodeCarrier",
    codepoint,
    mode,
    structuredMessage: {
      countryCode,
      classOfService,
      postalCode: mode === 2 ? postalCodeNumeric : postalCodeNumeric.replace(/0+$/, "A").slice(0, 12),
      secondaryMessage: `wolog:${codepoint.symbolic.alias}`,
    },
    totalCodewords,
    dataCodewords,
    eccCodewords,
    errorCorrectionLevel: mode >= 5 ? "EEC" : "SEC",
    gridRows,
    gridCols,
    totalModules,
    hexModules: generateMaxiCodeHexModules(codepoint),
  };
}

const CODE16K_MODE_TABLE: Record<Code16KMode, { readonly startCodeSet: Code16KStartCodeSet; readonly startShift: Code16KStartShift }> = {
  0: { startCodeSet: "A", startShift: "none" },
  1: { startCodeSet: "B", startShift: "none" },
  2: { startCodeSet: "C", startShift: "none" },
  3: { startCodeSet: "B", startShift: "fnc1" },
  4: { startCodeSet: "C", startShift: "fnc1" },
  5: { startCodeSet: "C", startShift: "single-shift-b" },
  6: { startCodeSet: "C", startShift: "double-shift-b" },
};

export function normalizeCode16KPayload(payload: string): string {
  return payload
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

export function computeCode16KChecksums(symbolValues: readonly number[]): Code16KChecksumMeta {
  let weighted1 = 0;
  let weighted2 = 0;
  for (let index = 0; index < symbolValues.length; index++) {
    const value = symbolValues[index]!;
    weighted1 += (index + 2) * value;
    weighted2 += (index + 1) * value;
  }
  return {
    modulus: 107,
    check1: ((weighted1 % 107) + 107) % 107,
    check2: ((weighted2 % 107) + 107) % 107,
  };
}

export function validateCode16KChecksums(
  symbolValues: readonly number[],
  check1: number,
  check2: number,
): boolean {
  const computed = computeCode16KChecksums(symbolValues);
  return computed.check1 === check1 && computed.check2 === check2;
}

export function validateCode16KCarrierStructure(carrier: Code16KCarrier): {
  readonly valid: boolean;
  readonly errors: readonly string[];
} {
  const errors: string[] = [];
  if (carrier.rows < 2 || carrier.rows > 16) {
    errors.push("rows must be between 2 and 16");
  }
  if (carrier.symbolsPerRow !== 5) {
    errors.push("symbolsPerRow must be 5");
  }
  if (carrier.recordRows.length !== carrier.rows) {
    errors.push("recordRows length must equal rows");
  }
  if (!CODE16K_MODES.includes(carrier.mode)) {
    errors.push("mode must be one of 0..6");
  }
  if (carrier.concatenation.totalBlocks < 1 || carrier.concatenation.totalBlocks > 107) {
    errors.push("concatenation.totalBlocks must be between 1 and 107");
  }
  if (carrier.concatenation.blockIndex < 0 || carrier.concatenation.blockIndex >= carrier.concatenation.totalBlocks) {
    errors.push("concatenation.blockIndex must be within totalBlocks range");
  }
  const values = code16kSymbolValues(carrier.normalizedPayload);
  if (!validateCode16KChecksums(values, carrier.checksums.check1, carrier.checksums.check2)) {
    errors.push("checksum mismatch");
  }
  return { valid: errors.length === 0, errors };
}

export function projectToCode16KCarrier(codepoint: VirtualCodepoint): Code16KCarrier {
  const mode = ((codepoint.symbolic.variant >> 5) % 7) as Code16KMode;
  const rows = 2 + (codepoint.symbolic.variant % 15);
  const payloadRaw = `WLOG ${codepoint.symbolic.alias} ${toHex40(codepoint.packed40.value)}`;
  const normalizedPayload = normalizeCode16KPayload(payloadRaw);
  const recordRows = code16kRecordRows(normalizedPayload, rows);
  const symbolValues = code16kSymbolValues(normalizedPayload);
  const checksums = computeCode16KChecksums(symbolValues);
  const meta = CODE16K_MODE_TABLE[mode];
  const totalBlocks = 1 + (codepoint.symbolic.decorator % 3);
  const blockIndex = codepoint.symbolic.flags % totalBlocks;
  return {
    kind: "Code16KCarrier",
    codepoint,
    rows,
    symbolsPerRow: 5,
    mode,
    startCodeSet: meta.startCodeSet,
    startShift: meta.startShift,
    concatenation: {
      enabled: totalBlocks > 1,
      blockIndex,
      totalBlocks,
    },
    checksums,
    normalizedPayload,
    recordRows,
    manifestWitness: `code16k:${codepoint.symbolic.alias}:m${mode}:r${rows}:c${checksums.check1}-${checksums.check2}`,
  };
}

function generateMaxiCodeHexModules(codepoint: VirtualCodepoint): readonly string[] {
  const hexes: string[] = [];
  const value = codepoint.packed40.value;
  for (let row = 0; row < 33; row++) {
    const cols = row % 2 === 0 ? 30 : 29;
    for (let col = 0; col < cols; col++) {
      const centerRow = 16;
      const centerCol = row % 2 === 0 ? 14 : 13;
      const dx = col - centerCol + (row % 2 === 1 ? 0.5 : 0);
      const dy = row - centerRow;
      const distSquared = dx * dx + dy * dy;
      if (distSquared > 16) {
        const bitIndex = (row * 30 + col) % 40;
        const bit = (value >> BigInt(bitIndex)) & 1n;
        hexes.push(bit ? "1" : "0");
      } else {
        hexes.push(distSquared < 4 ? "X" : "B");
      }
    }
  }
  return hexes;
}

export function projectBarcodeTrinity(codepoint: VirtualCodepoint): readonly [AztecCarrier, MaxiCodeCarrier, BeeTagCarrier] {
  return [
    projectToAztecCarrier(codepoint),
    projectToMaxiCodeCarrier(codepoint),
    projectToBeeTagCarrier(codepoint),
  ];
}

export function projectCarrierQuartet(
  codepoint: VirtualCodepoint,
): readonly [AztecCarrier, MaxiCodeCarrier, BeeTagCarrier, Code16KCarrier] {
  return [
    projectToAztecCarrier(codepoint),
    projectToMaxiCodeCarrier(codepoint),
    projectToBeeTagCarrier(codepoint),
    projectToCode16KCarrier(codepoint),
  ];
}

export function projectCarrierSuite(
  codepoint: VirtualCodepoint,
): readonly [AztecCarrier, MaxiCodeCarrier, BeeTagCarrier, Code16KCarrier, PolygonalCarrier] {
  return [
    projectToAztecCarrier(codepoint),
    projectToMaxiCodeCarrier(codepoint),
    projectToBeeTagCarrier(codepoint),
    projectToCode16KCarrier(codepoint),
    projectToPolygonalCarrier(codepoint),
  ];
}

export function buildCarrierEnvelope(carrier: Carrier): CarrierEnvelope {
  const payload = carrierPayloadString(carrier);
  const payloadHash = hashHex(payload);
  const decodeConfidence = carrierDecodeConfidence(carrier);
  const witness = carrierWitness(carrier);
  const sequenceMeta = carrierSequenceMeta(carrier);
  return {
    codepoint: carrier.codepoint,
    carrierKind: carrier.kind,
    payloadHash,
    witness,
    ...(sequenceMeta ? { sequenceMeta } : {}),
    decodeConfidence,
    carrier,
  };
}

export function canonicalPolyformHashFromCodepoint(codepoint: VirtualCodepoint): string {
  const canonical = `${codepoint.symbolic.family}|${codepoint.symbolic.group}|${codepoint.symbolic.variant}|${codepoint.symbolic.decorator}|${codepoint.symbolic.flags}|${toHex40(codepoint.packed40.value)}`;
  return hashHex(`polyform:${canonical}`);
}

export function reconcileCarrierEnvelopesWithCanonical(
  envelopes: readonly CarrierEnvelope[],
  canonicalPolyformHash: string,
): CarrierReconcileResult {
  const ordered = [...envelopes].sort((a, b) =>
    `${a.codepoint.symbolic.alias}:${a.carrierKind}:${a.payloadHash}`.localeCompare(
      `${b.codepoint.symbolic.alias}:${b.carrierKind}:${b.payloadHash}`,
    ),
  );
  const accepted: CarrierEnvelope[] = [];
  const rejected: CarrierEnvelope[] = [];
  for (const envelope of ordered) {
    const candidateHash = canonicalPolyformHashFromCodepoint(envelope.codepoint);
    if (candidateHash === canonicalPolyformHash) {
      accepted.push(envelope);
    } else {
      rejected.push(envelope);
    }
  }
  return {
    canonicalPolyformHash,
    accepted,
    rejected,
    deterministicOrder: ordered.map((item) => `${item.codepoint.symbolic.alias}:${item.carrierKind}`),
  };
}

export function reconcileCarrierEnvelopes(envelopes: readonly CarrierEnvelope[]): CarrierReconcileResult {
  if (envelopes.length === 0) {
    return {
      canonicalPolyformHash: "",
      accepted: [],
      rejected: [],
      deterministicOrder: [],
    };
  }
  const counts = new Map<string, number>();
  for (const envelope of envelopes) {
    const candidateHash = canonicalPolyformHashFromCodepoint(envelope.codepoint);
    counts.set(candidateHash, (counts.get(candidateHash) ?? 0) + 1);
  }
  let inferredCanonical = "";
  let bestCount = -1;
  for (const [candidateHash, count] of counts.entries()) {
    if (count > bestCount || (count === bestCount && candidateHash < inferredCanonical)) {
      inferredCanonical = candidateHash;
      bestCount = count;
    }
  }
  return reconcileCarrierEnvelopesWithCanonical(envelopes, inferredCanonical);
}

export function reconcileCarriers(carriers: readonly Carrier[]): CarrierReconcileResult {
  return reconcileCarrierEnvelopes(carriers.map(buildCarrierEnvelope));
}

export function reconcileCarrierEnvelopesAgainstCanonical(
  envelopes: readonly CarrierEnvelope[],
  canonicalCodepoint: VirtualCodepoint,
): CarrierReconcileResult {
  return reconcileCarrierEnvelopesWithCanonical(
    envelopes,
    canonicalPolyformHashFromCodepoint(canonicalCodepoint),
  );
}

export function reconcileCarriersAgainstCanonical(
  carriers: readonly Carrier[],
  canonicalCodepoint: VirtualCodepoint,
): CarrierReconcileResult {
  return reconcileCarrierEnvelopesAgainstCanonical(
    carriers.map(buildCarrierEnvelope),
    canonicalCodepoint,
  );
}

export function renderWorkedExample(): {
  readonly codepoint: VirtualCodepoint;
  readonly cell: BasisCell;
  readonly svg: SvgProjection;
  readonly carriers: readonly [AztecCarrier, MaxiCodeCarrier, BeeTagCarrier];
  readonly quartet: readonly [AztecCarrier, MaxiCodeCarrier, BeeTagCarrier, Code16KCarrier];
  readonly polygonal: PolygonalCarrier;
} {
  const codepoint = virtualCodepointFromSymbolic({
    family: "Hexagons",
    group: "basis",
    variant: 0x2a,
    decorator: 0x04,
    flags: CODEPOINT_FLAGS.svgReady | CODEPOINT_FLAGS.reserved25D,
  });
  const cell = basisCell(
    codepoint,
    "pixel",
    classifyPolynomialClass(2, ["Bivariate", "Homogeneous"]),
    0,
    { tag: "hex", q: 0, r: 0 },
  );
  return {
    codepoint,
    cell,
    svg: buildSvgProjection(cell),
    carriers: projectBarcodeTrinity(codepoint),
    quartet: projectCarrierQuartet(codepoint),
    polygonal: projectToPolygonalCarrier(codepoint),
  };
}

function renderBasisCellSvg(cell: BasisCell): string {
  const base = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">`,
    `<rect width="240" height="240" fill="#fffaf1"/>`,
    `<g transform="translate(120 120) rotate(${cell.orientation * 90})">`,
  ];
  let shape = "";
  switch (cell.family) {
    case "Squares":
      shape = `<rect x="-36" y="-36" width="72" height="72" fill="#ffcf99" stroke="#222" stroke-width="2"/>`;
      break;
    case "Triangles":
      shape = `<polygon points="0,-48 42,24 -42,24" fill="#ffd966" stroke="#222" stroke-width="2"/>`;
      break;
    case "Hexagons":
      shape = `<polygon points="0,-48 42,-24 42,24 0,48 -42,24 -42,-24" fill="#a8d5ba" stroke="#222" stroke-width="2"/>`;
      break;
    default:
      shape = `<circle cx="0" cy="0" r="36" fill="#d7d7d7" stroke="#222" stroke-width="2"/>`;
      break;
  }
  const footer = [
    `</g>`,
    `<text x="16" y="22" font-size="14" font-family="monospace">${cell.codepoint.symbolic.alias}</text>`,
    `</svg>`,
  ];
  return [...base, shape, ...footer].join("");
}

function defaultCoordsForFamily(family: BasisFamily, variant: number): BasisCoords {
  switch (family) {
    case "Squares":
      return { tag: "square", x: variant & 0x0f, y: variant >> 4 };
    case "Triangles":
      return { tag: "triangle", q: variant & 0x03, r: (variant >> 2) & 0x03, s: -((variant & 0x03) + ((variant >> 2) & 0x03)) };
    case "Hexagons":
      return { tag: "hex", q: variant & 0x0f, r: (variant >> 4) & 0x0f };
    case "Cubes":
      return { tag: "cube", x: variant & 0x03, y: (variant >> 2) & 0x03, z: (variant >> 4) & 0x03 };
    default:
      return { tag: "generic", values: [variant] };
  }
}

function projectionStatusForFamily(family: BasisFamily): "svg-ready" | "declared" | "stub" {
  switch (family) {
    case "Squares":
    case "Triangles":
    case "Hexagons":
      return "svg-ready";
    case "Cubes":
      return "declared";
    default:
      return "stub";
  }
}

function packedCodepoint40OctetsFromValue(value: bigint): PackedCodepoint40Octets {
  return [
    Number((value >> 32n) & 0xffn),
    Number((value >> 24n) & 0xffn),
    Number((value >> 16n) & 0xffn),
    Number((value >> 8n) & 0xffn),
    Number(value & 0xffn),
  ];
}

function packedCodepoint40Groups5FromValue(value: bigint): PackedCodepoint40Groups5 {
  return [
    Number((value >> 35n) & 0x1fn),
    Number((value >> 30n) & 0x1fn),
    Number((value >> 25n) & 0x1fn),
    Number((value >> 20n) & 0x1fn),
    Number((value >> 15n) & 0x1fn),
    Number((value >> 10n) & 0x1fn),
    Number((value >> 5n) & 0x1fn),
    Number(value & 0x1fn),
  ];
}

function assertByte(value: number, label: string): number {
  if (!Number.isInteger(value) || value < 0 || value > 0xff) {
    throw new RangeError(`${label} must be an integer between 0 and 255`);
  }
  return value;
}

function toHexByte(value: number): string {
  return value.toString(16).padStart(2, "0");
}

function toHex40(value: bigint): string {
  return value.toString(16).padStart(10, "0");
}

function round(value: number): string {
  return value.toFixed(2);
}

function numbersForBit(bit: number, maxBits: number): number[] {
  const max = 1 << maxBits;
  const values: number[] = [];
  for (let value = 0; value < max; value++) {
    if ((value & (1 << bit)) !== 0) {
      values.push(value);
    }
  }
  return values;
}

function polygonSidesForFamily(family: BasisFamily): number {
  switch (family) {
    case "Squares": return 4;
    case "Triangles": return 3;
    case "Hexagons": return 6;
    case "RightTriangles": return 3;
    case "Rhombs": return 4;
    case "MultiRhombs": return 4;
    case "Octagons": return 8;
    case "Rounds": return 0;
    case "Bends": return 0;
    case "Hops": return 4;
    case "GoldenTriangles": return 3;
    case "Cubes": return 6;
  }
}

function polygonGridCells(
  rows: number,
  cols: number,
  sideCount: number,
  payloadBits: string,
): readonly PolygonCell[] {
  const cells: PolygonCell[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const bitIndex = (y * cols + x) % payloadBits.length;
      const bit = payloadBits[bitIndex]!;
      cells.push({
        sideCount,
        optical: bit === "1" ? "dark" : "light",
        x,
        y,
      });
    }
  }
  return cells;
}

function code16kRecordRows(payload: string, rows: number): readonly string[] {
  const clean = payload.replace(/[^A-Z0-9 ]/g, " ");
  const chunks = clean.match(/.{1,5}/g) ?? [];
  const out: string[] = [];
  for (let index = 0; index < rows; index++) {
    out.push((chunks[index] ?? "").padEnd(5, " "));
  }
  return out;
}

function code16kSymbolValues(payload: string): readonly number[] {
  const values: number[] = [];
  for (const char of payload) {
    const code = char.codePointAt(0) ?? 0;
    values.push(code % 107);
  }
  return values;
}

function carrierPayloadString(carrier: Carrier): string {
  switch (carrier.kind) {
    case "AztecCarrier":
      return `${carrier.packedHex}|${carrier.layers}|${carrier.modeBits}`;
    case "MaxiCodeCarrier":
      return `${carrier.mode}|${carrier.structuredMessage.postalCode}|${carrier.totalCodewords}|${carrier.hexModules.join("")}`;
    case "BeeTagCarrier":
      return `${carrier.identity15}|${carrier.error10}|${carrier.matrix5x5.join("")}`;
    case "Code16KCarrier":
      return `${carrier.mode}|${carrier.rows}|${carrier.normalizedPayload}|${carrier.recordRows.join("|")}|${carrier.checksums.check1}|${carrier.checksums.check2}`;
    case "PolygonalCarrier":
      return `${carrier.declaration}|${carrier.grid.rows}x${carrier.grid.cols}|${carrier.highPriorityBits}|${carrier.lowPriorityBits}`;
  }
}

function carrierWitness(carrier: Carrier): string {
  switch (carrier.kind) {
    case "AztecCarrier":
      return carrier.manifestWitness;
    case "MaxiCodeCarrier":
      return `maxicode:${carrier.codepoint.symbolic.alias}:mode${carrier.mode}`;
    case "BeeTagCarrier":
      return `beetag:${carrier.identity15}:${carrier.error10}`;
    case "Code16KCarrier":
      return carrier.manifestWitness;
    case "PolygonalCarrier":
      return carrier.manifestWitness;
  }
}

function carrierSequenceMeta(carrier: Carrier): { readonly index: number; readonly total: number } | undefined {
  switch (carrier.kind) {
    case "Code16KCarrier":
      return { index: carrier.concatenation.blockIndex, total: carrier.concatenation.totalBlocks };
    default:
      return undefined;
  }
}

function carrierDecodeConfidence(carrier: Carrier): number {
  switch (carrier.kind) {
    case "AztecCarrier":
      return 0.98;
    case "MaxiCodeCarrier":
      return 0.94;
    case "BeeTagCarrier":
      return carrier.orientationValid ? 0.91 : 0.55;
    case "Code16KCarrier": {
      const valid = validateCode16KCarrierStructure(carrier).valid;
      return valid ? 0.93 : 0.58;
    }
    case "PolygonalCarrier":
      return 0.86;
  }
}

function hashHex(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return `fnv1a32:${(h >>> 0).toString(16).padStart(8, "0")}`;
}

function beeTagIdentityMatrix3x5(identityBits15: string): readonly string[] {
  if (!/^[01]{15}$/.test(identityBits15)) {
    throw new RangeError("identityBits15 must be a 15-bit binary string");
  }
  // MATLAB reference: im = reshape(bits, 5, 3)' => 3 rows x 5 columns.
  const matrix: string[] = [];
  for (let row = 0; row < 3; row++) {
    let rowBits = "";
    for (let col = 0; col < 5; col++) {
      rowBits += identityBits15[col * 3 + row]!;
    }
    matrix.push(rowBits);
  }
  return matrix;
}

function beeTagErrorCheck5(identityMatrix3x5: readonly string[]): string {
  if (identityMatrix3x5.length !== 3 || identityMatrix3x5.some((row) => row.length !== 5)) {
    throw new RangeError("identityMatrix3x5 must be 3 rows x 5 columns");
  }
  // MATLAB reference checkCode25 / createCode:
  // parity for each of the 3 rows, then parity over first 3 columns and last 2 columns.
  const rowParity = [0, 1, 2].map((row) =>
    parityBit(identityMatrix3x5[row]!),
  );
  const firstThreeColumnsParity = parityBit(identityMatrix3x5.map((row) => row.slice(0, 3)).join(""));
  const lastTwoColumnsParity = parityBit(identityMatrix3x5.map((row) => row.slice(3, 5)).join(""));
  return [...rowParity, firstThreeColumnsParity, lastTwoColumnsParity].join("");
}

function beeTagErrorBits10(errorCheck5: string): string {
  if (!/^[01]{5}$/.test(errorCheck5)) {
    throw new RangeError("errorCheck5 must be a 5-bit binary string");
  }
  return errorCheck5 + [...errorCheck5].reverse().join("");
}

function beeTagMatrixFromIdentityAndError(
  identityMatrix3x5: readonly string[],
  errorBits10: string,
): readonly string[] {
  if (!/^[01]{10}$/.test(errorBits10)) {
    throw new RangeError("errorBits10 must be a 10-bit binary string");
  }
  const check = errorBits10.slice(0, 5);
  const check2 = errorBits10.slice(5, 10);
  return [
    identityMatrix3x5[0]!,
    identityMatrix3x5[1]!,
    identityMatrix3x5[2]!,
    check,
    check2,
  ];
}

function beeTagOrientationMatches(matrix: readonly string[]): readonly number[] {
  const rotations = rotationsByNinety(matrix);
  const matches: number[] = [];
  rotations.forEach((rotation, orientation) => {
    const decoded = decodeBeeTagMatrix(rotation);
    if (decoded.valid) {
      matches.push(orientation);
    }
  });
  return matches;
}

function beeTagRotationHammingFloor(matrix: readonly string[]): number {
  const canonical = matrix.join("");
  return rotationsByNinety(matrix)
    .slice(1)
    .reduce((min, rotation) => Math.min(min, hammingDistance(canonical, rotation.join(""))), Number.POSITIVE_INFINITY);
}

function rotationsByNinety(matrix: readonly string[]): readonly string[][] {
  // MATLAB checkOrs rotates with rot90(imc, cc) for cc=1..4.
  // Return [rot90^4 (canonical), rot90^1, rot90^2, rot90^3] so orientation=0 is canonical.
  const r1 = rotate90CounterClockwise(matrix);
  const r2 = rotate90CounterClockwise(r1);
  const r3 = rotate90CounterClockwise(r2);
  const r4 = rotate90CounterClockwise(r3);
  return [r4, r1, r2, r3];
}

function rotate90CounterClockwise(matrix: readonly string[]): string[] {
  const size = matrix.length;
  return Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, col) => matrix[col]![size - 1 - row]!).join(""),
  );
}

function decodeBeeTagMatrix(matrix5x5: readonly string[]): {
  readonly identity15: number;
  readonly identityBits15: string;
  readonly errorCheck5: string;
  readonly errorBits10: string;
  readonly valid: boolean;
} {
  if (matrix5x5.length !== 5 || matrix5x5.some((row) => row.length !== 5 || !/^[01]{5}$/.test(row))) {
    throw new RangeError("matrix5x5 must be 5 rows of 5 binary digits");
  }
  const identityMatrix3x5 = matrix5x5.slice(0, 3);
  const check = matrix5x5[3]!;
  const check2 = matrix5x5[4]!;
  const errorBits10 = `${check}${check2}`;
  const identityBits15 = serializeIdentityBits15(identityMatrix3x5);
  const derivedErrorCheck5 = beeTagErrorCheck5(identityMatrix3x5);
  const derivedErrorBits10 = beeTagErrorBits10(derivedErrorCheck5);
  return {
    identity15: Number.parseInt(identityBits15, 2),
    identityBits15,
    errorCheck5: derivedErrorCheck5,
    errorBits10,
    valid: errorBits10 === derivedErrorBits10,
  };
}

function hammingDistance(a: string, b: string): number {
  let distance = 0;
  for (let index = 0; index < Math.min(a.length, b.length); index++) {
    if (a[index] !== b[index]) {
      distance++;
    }
  }
  return distance + Math.abs(a.length - b.length);
}

function parityBit(bits: string): "0" | "1" {
  const ones = [...bits].filter((bit) => bit === "1").length;
  return (ones % 2 === 0 ? "0" : "1");
}

function serializeIdentityBits15(identityMatrix3x5: readonly string[]): string {
  if (identityMatrix3x5.length !== 3 || identityMatrix3x5.some((row) => row.length !== 5)) {
    throw new RangeError("identityMatrix3x5 must be 3 rows x 5 columns");
  }
  let bits = "";
  for (let col = 0; col < 5; col++) {
    for (let row = 0; row < 3; row++) {
      bits += identityMatrix3x5[row]![col]!;
    }
  }
  return bits;
}

let beeTagMasterCodebookCache: readonly number[] | null = null;

function getOrBuildComputedBeeTagMasterCodebook(): readonly number[] {
  if (beeTagMasterCodebookCache) {
    return beeTagMasterCodebookCache;
  }
  // Mirrors generateUniqueCodesM.m with minimum Hamming distance >= 3.
  const accepted: number[] = [];
  const acceptedRotations: number[] = [0];
  for (let identity15 = 1; identity15 <= 32767; identity15++) {
    const matrix = beeTagFromIdentity15(identity15).matrix5x5;
    const rotations = rotationsByNinety(matrix);
    const passing = rotations
      .map((m, idx) => (decodeBeeTagMatrix(m).valid ? idx : -1))
      .filter((idx) => idx >= 0);
    if (passing.length !== 1) {
      continue;
    }
    const validWord = Number.parseInt(rotations[passing[0]!]!.join(""), 2);
    let minDistance = Number.POSITIVE_INFINITY;
    for (const prior of acceptedRotations) {
      minDistance = Math.min(minDistance, popcount32(prior ^ validWord));
      if (minDistance <= 2) {
        break;
      }
    }
    if (minDistance > 2) {
      accepted.push(identity15);
      for (const rotated of rotationsByNinety(matrix)) {
        acceptedRotations.push(Number.parseInt(rotated.join(""), 2));
      }
    }
  }
  beeTagMasterCodebookCache = accepted;
  return beeTagMasterCodebookCache;
}

function normalizeToMasterBeeTagIdentity(identity15: number): number {
  const codebook = getActiveBeeTagCodebook();
  const idx = binarySearch(codebook, identity15);
  if (idx.found) {
    return codebook[idx.index]!;
  }
  if (idx.index >= codebook.length) {
    return codebook[0]!;
  }
  return codebook[idx.index]!;
}

function binarySearch(values: readonly number[], target: number): { readonly found: boolean; readonly index: number } {
  let lo = 0;
  let hi = values.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const v = values[mid]!;
    if (v === target) {
      return { found: true, index: mid };
    }
    if (v < target) {
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return { found: false, index: lo };
}

function popcount32(n: number): number {
  let x = n >>> 0;
  let c = 0;
  while (x !== 0) {
    x &= x - 1;
    c++;
  }
  return c;
}

function asSquareCoords(coords: BasisCoords): SquareCoords {
  if (coords.tag !== "square") {
    throw new TypeError(`Expected square coords, received ${coords.tag}`);
  }
  return coords;
}

function asTriangleCoords(coords: BasisCoords): TriangleCoords {
  if (coords.tag !== "triangle") {
    throw new TypeError(`Expected triangle coords, received ${coords.tag}`);
  }
  return coords;
}

function asHexCoords(coords: BasisCoords): HexCoords {
  if (coords.tag !== "hex") {
    throw new TypeError(`Expected hex coords, received ${coords.tag}`);
  }
  return coords;
}
