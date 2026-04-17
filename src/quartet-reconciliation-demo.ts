import type {
  BasisCell,
  Carrier,
  CarrierEnvelope,
  CarrierReconcileResult,
  CodepointGroup,
  VirtualCodepoint,
} from "./aztec-slide-rule.js";
import {
  basisCell,
  buildCarrierEnvelope,
  buildSvgProjection,
  canonicalPolyformHashFromCodepoint,
  classifyPolynomialClass,
  projectCarrierQuartet,
  reconcileCarrierEnvelopes,
  reconcileCarrierEnvelopesAgainstCanonical,
  reconcileCarriersAgainstCanonical,
  virtualCodepointFromSymbolic,
  virtualCodepointRoundtrip,
} from "./aztec-slide-rule.js";

export interface QuartetCarrierReceiptRow {
  readonly kind: CarrierEnvelope["carrierKind"];
  readonly alias: string;
  readonly payloadHash: string;
  readonly witness: string;
  readonly decodeConfidence: number;
  readonly sequenceMeta?: {
    readonly index: number;
    readonly total: number;
  };
}

export interface QuartetScenarioReceipt {
  readonly name: string;
  readonly acceptedKinds: readonly CarrierEnvelope["carrierKind"][];
  readonly rejectedKinds: readonly CarrierEnvelope["carrierKind"][];
  readonly acceptedCount: number;
  readonly rejectedCount: number;
  readonly canonicalPolyformHash: string;
  readonly pass: boolean;
}

export interface QuartetDeterminismReceipt {
  readonly permutationsChecked: number;
  readonly inferredDeterministic: boolean;
  readonly canonicalDeterministic: boolean;
}

export interface QuartetReconciliationProofReceipt {
  readonly demo: "quartet-reconciliation-demo";
  readonly generatedAt: string;
  readonly canonicalObject: {
    readonly alias: string;
    readonly packed40Hex: string;
    readonly family: string;
    readonly group: CodepointGroup;
    readonly canonicalPolyformHash: string;
  };
  readonly basisCell: {
    readonly family: string;
    readonly sampleKind: string;
    readonly polynomialDegree: number;
    readonly polynomialProperties: readonly string[];
    readonly orientation: number;
    readonly coords: BasisCell["coords"];
  };
  readonly identityRoundtrip: {
    readonly symbolicStable: boolean;
    readonly packedStable: boolean;
  };
  readonly carriers: readonly QuartetCarrierReceiptRow[];
  readonly scenarios: readonly QuartetScenarioReceipt[];
  readonly determinism: QuartetDeterminismReceipt;
}

export interface QuartetReconciliationProofArtifact {
  readonly receipt: QuartetReconciliationProofReceipt;
  readonly receiptJson: string;
  readonly canonicalReceiptJson: string;
  readonly walkthroughMarkdown: string;
  readonly basisSvg: string;
}

export function buildQuartetReconciliationProofDemo(nowIso = new Date().toISOString()): QuartetReconciliationProofArtifact {
  const canonicalCodepoint = virtualCodepointFromSymbolic({
    family: "Hexagons",
    group: "basis",
    variant: 0x2a,
    decorator: 0x04,
    flags: 0x05,
  });
  const canonicalCell = basisCell(
    canonicalCodepoint,
    "pixel",
    classifyPolynomialClass(2, ["Bivariate", "Homogeneous"]),
    0,
    { tag: "hex", q: 0, r: 0 },
  );
  const basisSvg = buildSvgProjection(canonicalCell).svg;
  const canonicalHash = canonicalPolyformHashFromCodepoint(canonicalCodepoint);
  const roundtrip = virtualCodepointRoundtrip(canonicalCodepoint);
  const symbolicStable = roundtrip.symbolic.alias === canonicalCodepoint.symbolic.alias;
  const packedStable = roundtrip.packed40.value === canonicalCodepoint.packed40.value;

  const quartet = projectCarrierQuartet(canonicalCodepoint);
  const quartetEnvelopes = quartet.map(buildCarrierEnvelope);
  const carrierRows = quartetEnvelopes.map(toCarrierReceiptRow);

  const baseScenario = scenarioReceipt(
    "clean-quartet",
    reconcileCarrierEnvelopesAgainstCanonical(quartetEnvelopes, canonicalCodepoint),
    4,
    0,
  );

  const determinism = determinismReceipt(quartetEnvelopes, canonicalCodepoint, canonicalHash);

  const tamperedCodepoint = virtualCodepointFromSymbolic({
    family: "Hexagons",
    group: "basis",
    variant: 0x2b,
    decorator: 0x04,
    flags: 0x05,
  });
  const tamperedQuartet = projectCarrierQuartet(tamperedCodepoint);

  const oneTampered: readonly Carrier[] = [quartet[0], quartet[1], quartet[2], tamperedQuartet[3]];
  const twoTampered: readonly Carrier[] = [quartet[0], quartet[1], tamperedQuartet[2], tamperedQuartet[3]];
  const mixedEvidence: readonly Carrier[] = [quartet[0], quartet[1], quartet[2], tamperedQuartet[0]];

  const oneTamperedScenario = scenarioReceipt(
    "one-tampered-carrier",
    reconcileCarriersAgainstCanonical(oneTampered, canonicalCodepoint),
    3,
    1,
  );
  const twoTamperedScenario = scenarioReceipt(
    "two-tampered-carriers",
    reconcileCarriersAgainstCanonical(twoTampered, canonicalCodepoint),
    2,
    2,
  );
  const mixedEvidenceScenario = scenarioReceipt(
    "mixed-evidence-3A-1B",
    reconcileCarriersAgainstCanonical(mixedEvidence, canonicalCodepoint),
    3,
    1,
  );

  const receipt: QuartetReconciliationProofReceipt = {
    demo: "quartet-reconciliation-demo",
    generatedAt: nowIso,
    canonicalObject: {
      alias: canonicalCodepoint.symbolic.alias,
      packed40Hex: toHex40(canonicalCodepoint.packed40.value),
      family: canonicalCodepoint.symbolic.family,
      group: canonicalCodepoint.symbolic.group,
      canonicalPolyformHash: canonicalHash,
    },
    basisCell: {
      family: canonicalCell.family,
      sampleKind: canonicalCell.sampleKind,
      polynomialDegree: canonicalCell.polynomialClass.degree,
      polynomialProperties: canonicalCell.polynomialClass.properties,
      orientation: canonicalCell.orientation,
      coords: canonicalCell.coords,
    },
    identityRoundtrip: {
      symbolicStable,
      packedStable,
    },
    carriers: carrierRows,
    scenarios: [baseScenario, oneTamperedScenario, twoTamperedScenario, mixedEvidenceScenario],
    determinism,
  };

  const receiptJson = JSON.stringify(receipt, null, 2);
  const canonicalReceiptJson = stableStringify({ ...receipt, generatedAt: "<redacted>" });
  const walkthroughMarkdown = renderWalkthroughMarkdown(receipt);
  return {
    receipt,
    receiptJson,
    canonicalReceiptJson,
    walkthroughMarkdown,
    basisSvg,
  };
}

function scenarioReceipt(
  name: string,
  result: CarrierReconcileResult,
  expectedAccepted: number,
  expectedRejected: number,
): QuartetScenarioReceipt {
  const acceptedKinds = result.accepted.map((entry) => entry.carrierKind);
  const rejectedKinds = result.rejected.map((entry) => entry.carrierKind);
  const pass = result.accepted.length === expectedAccepted
    && result.rejected.length === expectedRejected;
  return {
    name,
    acceptedKinds,
    rejectedKinds,
    acceptedCount: result.accepted.length,
    rejectedCount: result.rejected.length,
    canonicalPolyformHash: result.canonicalPolyformHash,
    pass,
  };
}

function determinismReceipt(
  envelopes: readonly CarrierEnvelope[],
  canonicalCodepoint: VirtualCodepoint,
  canonicalHash: string,
): QuartetDeterminismReceipt {
  const perms = permutations(envelopes);
  const inferredStable = perms.every((perm) => {
    const result = reconcileCarrierEnvelopes(perm);
    return result.canonicalPolyformHash === canonicalHash && result.accepted.length === envelopes.length && result.rejected.length === 0;
  });
  const canonicalStable = perms.every((perm) => {
    const result = reconcileCarrierEnvelopesAgainstCanonical(perm, canonicalCodepoint);
    return result.canonicalPolyformHash === canonicalHash && result.accepted.length === envelopes.length && result.rejected.length === 0;
  });
  return {
    permutationsChecked: perms.length,
    inferredDeterministic: inferredStable,
    canonicalDeterministic: canonicalStable,
  };
}

function toCarrierReceiptRow(envelope: CarrierEnvelope): QuartetCarrierReceiptRow {
  return {
    kind: envelope.carrierKind,
    alias: envelope.codepoint.symbolic.alias,
    payloadHash: envelope.payloadHash,
    witness: envelope.witness,
    decodeConfidence: envelope.decodeConfidence,
    ...(envelope.sequenceMeta ? { sequenceMeta: envelope.sequenceMeta } : {}),
  };
}

function renderWalkthroughMarkdown(receipt: QuartetReconciliationProofReceipt): string {
  const scenarioLines = receipt.scenarios.map((scenario) =>
    `- ${scenario.name}: accepted=${scenario.acceptedCount}, rejected=${scenario.rejectedCount}, pass=${scenario.pass}`
  );
  return [
    "# Quartet Reconciliation Demo",
    "",
    "## Canonical Object",
    "",
    `- alias: \`${receipt.canonicalObject.alias}\``,
    `- packed40: \`${receipt.canonicalObject.packed40Hex}\``,
    `- canonicalPolyformHash: \`${receipt.canonicalObject.canonicalPolyformHash}\``,
    "",
    "## Identity Stability",
    "",
    `- symbolic roundtrip stable: ${receipt.identityRoundtrip.symbolicStable}`,
    `- packed roundtrip stable: ${receipt.identityRoundtrip.packedStable}`,
    "",
    "## Quartet Projection",
    "",
    ...receipt.carriers.map((carrier) =>
      `- ${carrier.kind}: payloadHash=\`${carrier.payloadHash}\`, witness=\`${carrier.witness}\`, confidence=${carrier.decodeConfidence.toFixed(2)}`
    ),
    "",
    "## Reconciliation Scenarios",
    "",
    ...scenarioLines,
    "",
    "## Determinism",
    "",
    `- permutations checked: ${receipt.determinism.permutationsChecked}`,
    `- inferred deterministic: ${receipt.determinism.inferredDeterministic}`,
    `- canonical deterministic: ${receipt.determinism.canonicalDeterministic}`,
    "",
  ].join("\n");
}

function permutations<T>(items: readonly T[]): readonly (readonly T[])[] {
  if (items.length <= 1) {
    return [items];
  }
  const out: T[][] = [];
  for (let i = 0; i < items.length; i++) {
    const head = items[i]!;
    const rest = [...items.slice(0, i), ...items.slice(i + 1)];
    for (const tail of permutations(rest)) {
      out.push([head, ...tail]);
    }
  }
  return out;
}

function stableStringify(value: unknown): string {
  return JSON.stringify(sortJson(value), null, 2);
}

function sortJson(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortJson);
  }
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const sortedKeys = Object.keys(record).sort();
    const out: Record<string, unknown> = {};
    for (const key of sortedKeys) {
      out[key] = sortJson(record[key]);
    }
    return out;
  }
  return value;
}

function toHex40(value: bigint): string {
  return value.toString(16).padStart(10, "0");
}
