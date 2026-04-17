// ============================================================
// WOLOG — Semantic Web Integration
// BCP 47 parsing/matching plus RDF/Turtle and SHACL helpers.
// ============================================================

import {
  AZTEC_EMBEDDING_SHACL_TURTLE,
  AZTEC_TRACE_SHACL_TURTLE,
  type AztecReplayResult,
  formatMask64,
} from "../core/binary.js";

import type {
  AztecCarrier,
  MaxiCodeCarrier,
  BeeTagCarrier,
  Code16KCarrier,
  VirtualCodepoint,
} from "../carriers/aztec-slide-rule.js";

const ALPHANUM = "[A-Za-z0-9]";
const RE_LANGUAGE = "[A-Za-z]{2,3}(?:-[A-Za-z]{3}){0,3}|[A-Za-z]{4}|[A-Za-z]{5,8}";
const RE_SCRIPT = "[A-Za-z]{4}";
const RE_REGION = "[A-Za-z]{2}|[0-9]{3}";
const RE_VARIANT = `(?:${ALPHANUM}{5,8}|[0-9]${ALPHANUM}{3})`;
const RE_SINGLETON = "[0-9A-WY-Za-wy-z]";
const RE_EXTENSION = `${RE_SINGLETON}(?:-${ALPHANUM}{2,8})+`;
const RE_PRIVATEUSE = `x(?:-${ALPHANUM}{1,8})+`;

const LANGTAG_PATTERN = new RegExp(
  `^(?:(${RE_LANGUAGE})(?:-(${RE_SCRIPT}))?(?:-(${RE_REGION}))?(?:-(${RE_VARIANT}))*` +
  `(?:-(${RE_EXTENSION}))*(?:-(${RE_PRIVATEUSE}))?|${RE_PRIVATEUSE})$`,
  "i",
);

const GRANDFATHERED = new Set([
  "art-lojban", "cel-gaulish", "en-gb-oed", "i-ami", "i-bnn", "i-default",
  "i-enochian", "i-hak", "i-klingon", "i-lux", "i-mingo", "i-navajo",
  "i-pwn", "i-tao", "i-tay", "i-tsu", "no-bok", "no-nyn", "sgn-be-fr",
  "sgn-be-nl", "sgn-ch-de", "zh-guoyu", "zh-hakka", "zh-min",
  "zh-min-nan", "zh-xiang",
]);

export interface Bcp47TagParts {
  readonly raw: string;
  readonly normalized: string;
  readonly language?: string;
  readonly extlangs: readonly string[];
  readonly script?: string;
  readonly region?: string;
  readonly variants: readonly string[];
  readonly extensions: readonly string[];
  readonly privateUse: readonly string[];
  readonly grandfathered: boolean;
}

export type WellFormedLanguageTag = string & {
  readonly __wellFormedLanguageTag: unique symbol;
};

export type NormalizedLanguageTag = WellFormedLanguageTag & {
  readonly __normalizedLanguageTag: unique symbol;
};

export type BasicLanguageRange = string & {
  readonly __basicLanguageRange: unique symbol;
};

export interface LanguageTagContract {
  readonly kind: "BCP47LanguageTag";
  readonly conformance: "well-formed";
  readonly raw: WellFormedLanguageTag;
  readonly normalized: NormalizedLanguageTag;
  readonly parts: Bcp47TagParts;
  readonly source: "RFC5646";
}

export interface LanguageLiteral {
  readonly value: string;
  readonly language: NormalizedLanguageTag;
}

export interface TurtleTriple {
  readonly subject: string;
  readonly predicate: string;
  readonly object: string;
}

export interface SemanticAztecResource {
  readonly subject: string;
  readonly encryptedHex: string;
  readonly seedHex?: string;
  readonly replay?: AztecReplayResult;
  readonly label?: LanguageLiteral;
}

export function isWellFormedLanguageTag(tag: string): tag is WellFormedLanguageTag {
  const trimmed = tag.trim();
  if (trimmed.length === 0 || /\s/.test(trimmed)) {
    return false;
  }
  const lower = trimmed.toLowerCase();
  return GRANDFATHERED.has(lower) || LANGTAG_PATTERN.test(trimmed);
}

export function asWellFormedLanguageTag(tag: string): WellFormedLanguageTag {
  if (!isWellFormedLanguageTag(tag)) {
    throw new Error(`Not a well-formed BCP 47 language tag: ${tag}`);
  }
  return tag.trim() as WellFormedLanguageTag;
}

export function parseLanguageTag(tag: string): Bcp47TagParts {
  const raw = asWellFormedLanguageTag(tag);
  const lower = raw.toLowerCase();
  const normalized = normalizeLanguageTag(raw);

  if (GRANDFATHERED.has(lower)) {
    return {
      raw,
      normalized,
      extlangs: [],
      variants: [],
      extensions: [],
      privateUse: [],
      grandfathered: true,
    };
  }

  const parts = lower.split("-");
  if (parts[0] === "x") {
    return {
      raw,
      normalized,
      extlangs: [],
      variants: [],
      extensions: [],
      privateUse: parts.slice(1),
      grandfathered: false,
    };
  }

  let index = 0;
  const language = parts[index++]!;
  const extlangs: string[] = [];
  while (index < parts.length && extlangs.length < 3 && /^[a-z]{3}$/.test(parts[index]!)) {
    extlangs.push(parts[index++]!);
  }

  const script = index < parts.length && /^[a-z]{4}$/.test(parts[index]!) ? parts[index++]! : undefined;
  const region = index < parts.length && /^(?:[a-z]{2}|[0-9]{3})$/.test(parts[index]!) ? parts[index++]! : undefined;

  const variants: string[] = [];
  while (index < parts.length && /^(?:[a-z0-9]{5,8}|[0-9][a-z0-9]{3})$/.test(parts[index]!)) {
    variants.push(parts[index++]!);
  }

  const extensions: string[] = [];
  while (index < parts.length && /^[0-9a-wy-z]$/i.test(parts[index]!)) {
    const singleton = parts[index++]!;
    const extParts: string[] = [singleton];
    while (index < parts.length && /^[a-z0-9]{2,8}$/i.test(parts[index]!)) {
      if (/^[0-9a-wy-z]$/i.test(parts[index]!) || parts[index] === "x") {
        break;
      }
      extParts.push(parts[index++]!);
    }
    extensions.push(extParts.join("-"));
  }

  const privateUse = index < parts.length && parts[index] === "x"
    ? parts.slice(index + 1)
    : [];

  const result: Bcp47TagParts = {
    raw,
    normalized,
    language,
    extlangs,
    variants,
    extensions,
    privateUse,
    grandfathered: false,
  };
  if (script !== undefined) {
    (result as Bcp47TagParts & { script: string }).script = script;
  }
  if (region !== undefined) {
    (result as Bcp47TagParts & { region: string }).region = region;
  }
  return result;
}

export function normalizeLanguageTagCase(tag: string): string {
  const lower = tag.trim().toLowerCase();
  if (GRANDFATHERED.has(lower)) {
    return lower.split("-").map((part, index) => {
      if (part.length === 2 && index > 0) return part.toUpperCase();
      if (part.length === 4 && index > 0) return titleCase(part);
      return part;
    }).join("-");
  }

  const parts = lower.split("-");
  const out: string[] = [];
  let afterSingleton = false;
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]!;
    if (i === 0) {
      out.push(part);
      afterSingleton = false;
      continue;
    }
    if (part.length === 1) {
      out.push(part);
      afterSingleton = true;
      continue;
    }
    if (!afterSingleton && part.length === 2) {
      out.push(part.toUpperCase());
    } else if (!afterSingleton && part.length === 4) {
      out.push(titleCase(part));
    } else {
      out.push(part);
    }
    afterSingleton = false;
  }
  return out.join("-");
}

export function normalizeLanguageTag(tag: string | WellFormedLanguageTag): NormalizedLanguageTag {
  return normalizeLanguageTagCase(tag) as NormalizedLanguageTag;
}

export function asBasicLanguageRange(range: string): BasicLanguageRange {
  const trimmed = range.trim();
  if (trimmed === "*") {
    return "*" as BasicLanguageRange;
  }
  if (!/^(?:[A-Za-z]{1,8})(?:-[A-Za-z0-9]{1,8})*$/.test(trimmed)) {
    throw new Error(`Not a basic language range: ${range}`);
  }
  return trimmed as BasicLanguageRange;
}

export function parseLanguageTagContract(tag: string): LanguageTagContract {
  const raw = asWellFormedLanguageTag(tag);
  const normalized = normalizeLanguageTag(raw);
  return {
    kind: "BCP47LanguageTag",
    conformance: "well-formed",
    raw,
    normalized,
    parts: parseLanguageTag(raw),
    source: "RFC5646",
  };
}

export function sameLanguageTag(
  left: string | WellFormedLanguageTag,
  right: string | WellFormedLanguageTag,
): boolean {
  return left.trim().toLowerCase() === right.trim().toLowerCase();
}

export function basicFilterLanguageTags(
  range: string | BasicLanguageRange,
  tags: readonly (string | WellFormedLanguageTag)[],
): NormalizedLanguageTag[] {
  const normalizedRange = range.trim().toLowerCase();
  if (normalizedRange === "*") {
    return tags.map((tag) => normalizeLanguageTag(String(tag)));
  }
  return tags.filter((tag) => {
    const candidate = tag.trim().toLowerCase();
    return candidate === normalizedRange || candidate.startsWith(`${normalizedRange}-`);
  }).map((tag) => normalizeLanguageTag(String(tag)));
}

export function lookupLanguageTag(
  priorityList: readonly (string | BasicLanguageRange)[],
  tags: readonly (string | WellFormedLanguageTag)[],
  defaultTag?: string | WellFormedLanguageTag,
): NormalizedLanguageTag | undefined {
  const normalizedTags = tags.map((tag) => normalizeLanguageTag(String(tag)));
  for (const range of priorityList) {
    let candidate = normalizeLanguageTagCase(String(range));
    if (candidate === "*") {
      continue;
    }
    for (;;) {
      const match = normalizedTags.find((tag) => tag.toLowerCase() === candidate.toLowerCase());
      if (match) {
        return match;
      }
      const cut = candidate.lastIndexOf("-");
      if (cut === -1) {
        break;
      }
      candidate = candidate.slice(0, cut);
      if (/^[0-9A-WY-Za-wy-z]$/i.test(candidate.slice(-1))) {
        const singletonCut = candidate.lastIndexOf("-");
        candidate = singletonCut === -1 ? "" : candidate.slice(0, singletonCut);
      }
      if (candidate.length === 0) {
        break;
      }
    }
  }
  return defaultTag === undefined ? undefined : normalizeLanguageTag(defaultTag);
}

export function languageLiteral(
  value: string,
  language: string | WellFormedLanguageTag | NormalizedLanguageTag,
): LanguageLiteral {
  return { value, language: normalizeLanguageTag(language) };
}

export function turtleLanguageLiteral(literal: LanguageLiteral): string {
  return `${escapeTurtleString(literal.value)}@${literal.language}`;
}

export function turtleNamedNode(iri: string): string {
  if (/^<.*>$/.test(iri)) {
    return iri;
  }
  return `<${iri}>`;
}

export function turtleLiteral(value: string): string {
  return escapeTurtleString(value);
}

export function serializeTurtle(triples: readonly TurtleTriple[], prefixes?: Readonly<Record<string, string>>): string {
  const lines: string[] = [];
  if (prefixes) {
    for (const [prefix, iri] of Object.entries(prefixes)) {
      lines.push(`@prefix ${prefix}: <${iri}> .`);
    }
    lines.push("");
  }
  for (const triple of triples) {
    lines.push(`${triple.subject} ${triple.predicate} ${triple.object} .`);
  }
  return lines.join("\n");
}

export function semanticAztecTriples(resource: SemanticAztecResource): TurtleTriple[] {
  const subject = turtleNamedNode(resource.subject);
  const triples: TurtleTriple[] = [
    { subject, predicate: "a", object: "wolog:AztecEmbedding" },
    { subject, predicate: "wolog:embeddingHex", object: turtleLiteral(resource.encryptedHex) },
    { subject, predicate: "wolog:encodingMode", object: turtleLiteral("bitwise-only") },
    { subject, predicate: "wolog:termination", object: turtleLiteral("HALT") },
  ];

  if (resource.seedHex) {
    triples.push({
      subject,
      predicate: "wolog:seedMask",
      object: turtleLiteral(resource.seedHex),
    });
  }

  if (resource.label) {
    triples.push({
      subject,
      predicate: "rdfs:label",
      object: turtleLanguageLiteral(resource.label),
    });
  }

  if (resource.replay) {
    triples.push({
      subject,
      predicate: "wolog:finalMask",
      object: turtleLiteral(formatMask64(resource.replay.finalMask)),
    });
    triples.push({
      subject,
      predicate: "wolog:halted",
      object: resource.replay.halted ? "\"true\"^^xsd:boolean" : "\"false\"^^xsd:boolean",
    });
  }

  return triples;
}

export function serializeSemanticAztecResource(resource: SemanticAztecResource): string {
  return serializeTurtle(semanticAztecTriples(resource), {
    wolog: "urn:wolog:property:",
    rdfs: "http://www.w3.org/2000/01/rdf-schema#",
    xsd: "http://www.w3.org/2001/XMLSchema#",
  });
}

export interface CarrierResource {
  readonly subject: string;
  readonly codepoint: VirtualCodepoint;
}

export function codepointTriples(resource: CarrierResource): TurtleTriple[] {
  const subject = turtleNamedNode(resource.subject);
  const cp = resource.codepoint;
  return [
    { subject, predicate: "a", object: "wolog:VirtualCodepoint" },
    { subject, predicate: "wolog:codepointAlias", object: turtleLiteral(cp.symbolic.alias) },
    { subject, predicate: "wolog:family", object: turtleLiteral(cp.symbolic.family) },
    { subject, predicate: "wolog:group", object: turtleLiteral(cp.symbolic.group) },
    { subject, predicate: "wolog:variant", object: turtleLiteral(toHexByte(cp.symbolic.variant)) },
    { subject, predicate: "wolog:decorator", object: turtleLiteral(toHexByte(cp.symbolic.decorator)) },
    { subject, predicate: "wolog:flags", object: turtleLiteral(toHexByte(cp.symbolic.flags)) },
    { subject, predicate: "wolog:packed40", object: turtleLiteral(toHex40(cp.packed40.value)) },
  ];
}

export function aztecCarrierTriples(carrier: AztecCarrier): TurtleTriple[] {
  const subject = turtleNamedNode(`urn:wolog:carrier:aztec:${carrier.manifestWitness}`);
  const triples: TurtleTriple[] = [
    { subject, predicate: "a", object: "wolog:AztecCarrier" },
    { subject, predicate: "wolog:carrierRole", object: turtleLiteral("serializable-sprite") },
    { subject, predicate: "wolog:manifestWitness", object: turtleLiteral(carrier.manifestWitness) },
    { subject, predicate: "wolog:layers", object: turtleLiteral(String(carrier.layers)) },
    { subject, predicate: "wolog:modeBits", object: turtleLiteral(String(carrier.modeBits)) },
    { subject, predicate: "wolog:packedHex", object: turtleLiteral(carrier.packedHex) },
    ...codepointTriples({ subject, codepoint: carrier.codepoint }),
  ];
  return triples;
}

export function maxiCodeCarrierTriples(carrier: MaxiCodeCarrier): TurtleTriple[] {
  const subject = turtleNamedNode(`urn:wolog:carrier:maxi:${carrier.codepoint.symbolic.alias}:mode${carrier.mode}`);
  const triples: TurtleTriple[] = [
    { subject, predicate: "a", object: "wolog:MaxiCodeCarrier" },
    { subject, predicate: "wolog:carrierRole", object: turtleLiteral("scene-projection") },
    { subject, predicate: "wolog:mode", object: turtleLiteral(String(carrier.mode)) },
    { subject, predicate: "wolog:errorCorrectionLevel", object: turtleLiteral(carrier.errorCorrectionLevel) },
    { subject, predicate: "wolog:totalCodewords", object: turtleLiteral(String(carrier.totalCodewords)) },
    { subject, predicate: "wolog:dataCodewords", object: turtleLiteral(String(carrier.dataCodewords)) },
    { subject, predicate: "wolog:eccCodewords", object: turtleLiteral(String(carrier.eccCodewords)) },
    { subject, predicate: "wolog:gridRows", object: turtleLiteral(String(carrier.gridRows)) },
    { subject, predicate: "wolog:gridCols", object: turtleLiteral(String(carrier.gridCols)) },
    { subject, predicate: "wolog:totalModules", object: turtleLiteral(String(carrier.totalModules)) },
  ];

  const scm = carrier.structuredMessage;
  triples.push(
    { subject, predicate: "wolog:countryCode", object: turtleLiteral(String(scm.countryCode)) },
    { subject, predicate: "wolog:classOfService", object: turtleLiteral(String(scm.classOfService)) },
    { subject, predicate: "wolog:postalCode", object: turtleLiteral(scm.postalCode) },
  );

  if (scm.secondaryMessage) {
    triples.push({
      subject,
      predicate: "wolog:secondaryMessage",
      object: turtleLiteral(scm.secondaryMessage),
    });
  }

  triples.push(...codepointTriples({ subject, codepoint: carrier.codepoint }));
  return triples;
}

export function beeTagCarrierTriples(carrier: BeeTagCarrier): TurtleTriple[] {
  const subject = turtleNamedNode(`urn:wolog:carrier:bee:${carrier.identity15}`);
  const triples: TurtleTriple[] = [
    { subject, predicate: "a", object: "wolog:BeeTagCarrier" },
    { subject, predicate: "wolog:carrierRole", object: turtleLiteral("transport-message") },
    { subject, predicate: "wolog:identity15", object: turtleLiteral(String(carrier.identity15)) },
    { subject, predicate: "wolog:error10", object: turtleLiteral(String(carrier.error10)) },
    { subject, predicate: "wolog:orientationValid", object: carrier.orientationValid ? turtleLiteral("true") : turtleLiteral("false") },
    { subject, predicate: "wolog:rotationHammingFloor", object: turtleLiteral(String(carrier.rotationHammingFloor)) },
    { subject, predicate: "wolog:matrix5x5", object: turtleLiteral(carrier.matrix5x5.join("")) },
    ...codepointTriples({ subject, codepoint: carrier.codepoint }),
  ];
  return triples;
}

export function code16kCarrierTriples(carrier: Code16KCarrier): TurtleTriple[] {
  const subject = turtleNamedNode(`urn:wolog:carrier:code16k:${carrier.codepoint.symbolic.alias}:m${carrier.mode}:r${carrier.rows}`);
  const triples: TurtleTriple[] = [
    { subject, predicate: "a", object: "wolog:Code16KCarrier" },
    { subject, predicate: "wolog:carrierRole", object: turtleLiteral("record-stack") },
    { subject, predicate: "wolog:mode", object: turtleLiteral(String(carrier.mode)) },
    { subject, predicate: "wolog:rows", object: turtleLiteral(String(carrier.rows)) },
    { subject, predicate: "wolog:symbolsPerRow", object: turtleLiteral(String(carrier.symbolsPerRow)) },
    { subject, predicate: "wolog:startCodeSet", object: turtleLiteral(carrier.startCodeSet) },
    { subject, predicate: "wolog:startShift", object: turtleLiteral(carrier.startShift) },
    { subject, predicate: "wolog:check1", object: turtleLiteral(String(carrier.checksums.check1)) },
    { subject, predicate: "wolog:check2", object: turtleLiteral(String(carrier.checksums.check2)) },
    { subject, predicate: "wolog:normalizedPayload", object: turtleLiteral(carrier.normalizedPayload) },
    { subject, predicate: "wolog:manifestWitness", object: turtleLiteral(carrier.manifestWitness) },
    ...codepointTriples({ subject, codepoint: carrier.codepoint }),
  ];
  return triples;
}

export function carrierTriples(carrier: AztecCarrier | MaxiCodeCarrier | BeeTagCarrier | Code16KCarrier): TurtleTriple[] {
  switch (carrier.kind) {
    case "AztecCarrier":
      return aztecCarrierTriples(carrier);
    case "MaxiCodeCarrier":
      return maxiCodeCarrierTriples(carrier);
    case "BeeTagCarrier":
      return beeTagCarrierTriples(carrier);
    case "Code16KCarrier":
      return code16kCarrierTriples(carrier);
  }
}

export function serializeCarrier(carrier: AztecCarrier | MaxiCodeCarrier | BeeTagCarrier | Code16KCarrier): string {
  return serializeTurtle(carrierTriples(carrier), {
    wolog: "urn:wolog:property:",
    rdfs: "http://www.w3.org/2000/01/rdf-schema#",
    xsd: "http://www.w3.org/2001/XMLSchema#",
  });
}

export const CARRIER_SHACL_TURTLE = `@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix wolog: <urn:wolog:property:> .

wolog:AztecCarrierShape a sh:NodeShape ;
  sh:targetClass wolog:AztecCarrier ;
  sh:property [ sh:path wolog:carrierRole ; sh:hasValue "serializable-sprite" ] ;
  sh:property [ sh:path wolog:manifestWitness ; sh:datatype xsd:string ; sh:minCount 1 ] ;
  sh:property [ sh:path wolog:layers ; sh:datatype xsd:integer ; sh:minCount 1 ; sh:maxCount 1 ] ;
  sh:property [ sh:path wolog:packedHex ; sh:datatype xsd:string ; sh:minCount 1 ] .

wolog:MaxiCodeCarrierShape a sh:NodeShape ;
  sh:targetClass wolog:MaxiCodeCarrier ;
  sh:property [ sh:path wolog:carrierRole ; sh:hasValue "scene-projection" ] ;
  sh:property [ sh:path wolog:mode ; sh:datatype xsd:integer ; sh:in (2 3 4 5 6) ] ;
  sh:property [ sh:path wolog:errorCorrectionLevel ; sh:hasValue "SEC" , "EEC" ] ;
  sh:property [ sh:path wolog:totalCodewords ; sh:datatype xsd:integer ; sh:hasValue 144 ] ;
  sh:property [ sh:path wolog:gridRows ; sh:datatype xsd:integer ; sh:hasValue 33 ] ;
  sh:property [ sh:path wolog:gridCols ; sh:datatype xsd:integer ; sh:in (29 30) ] .

wolog:BeeTagCarrierShape a sh:NodeShape ;
  sh:targetClass wolog:BeeTagCarrier ;
  sh:property [ sh:path wolog:carrierRole ; sh:hasValue "transport-message" ] ;
  sh:property [ sh:path wolog:identity15 ; sh:datatype xsd:integer ; sh:minCount 1 ; sh:maxCount 1 ] ;
  sh:property [ sh:path wolog:error10 ; sh:datatype xsd:integer ; sh:minCount 1 ; sh:maxCount 1 ] ;
  sh:property [ sh:path wolog:matrix5x5 ; sh:datatype xsd:string ; sh:pattern "^[01X]{25}$" ] .`;
  
export const CODE16K_CARRIER_SHACL_TURTLE = `@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix wolog: <urn:wolog:property:> .

wolog:Code16KCarrierShape a sh:NodeShape ;
  sh:targetClass wolog:Code16KCarrier ;
  sh:property [ sh:path wolog:carrierRole ; sh:hasValue "record-stack" ] ;
  sh:property [ sh:path wolog:mode ; sh:datatype xsd:integer ; sh:in (0 1 2 3 4 5 6) ] ;
  sh:property [ sh:path wolog:rows ; sh:datatype xsd:integer ; sh:minInclusive 2 ; sh:maxInclusive 16 ] ;
  sh:property [ sh:path wolog:symbolsPerRow ; sh:datatype xsd:integer ; sh:hasValue 5 ] ;
  sh:property [ sh:path wolog:check1 ; sh:datatype xsd:integer ; sh:minCount 1 ; sh:maxCount 1 ] ;
  sh:property [ sh:path wolog:check2 ; sh:datatype xsd:integer ; sh:minCount 1 ; sh:maxCount 1 ] .`;

function toHexByte(value: number): string {
  return value.toString(16).padStart(2, "0").toUpperCase();
}

function toHex40(value: bigint): string {
  return value.toString(16).padStart(10, "0").toUpperCase();
}

export const BCP47_LANGTAG_SHACL_TURTLE = `@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix wolog: <urn:wolog:property:> .

wolog:LanguageTaggedLiteralShape a sh:NodeShape ;
  sh:targetClass wolog:LanguageTaggedLiteral ;
  sh:property [
    sh:path wolog:languageTag ;
    sh:datatype xsd:string ;
    sh:pattern "^[A-Za-z0-9-]+$" ;
    sh:description "BCP 47 well-formed language tag contract boundary" ;
  ] ;
  sh:property [
    sh:path wolog:conformance ;
    sh:hasValue "well-formed" ;
  ] ;
  sh:property [
    sh:path wolog:lexicalValue ;
    sh:datatype xsd:string ;
  ] .`;

export const SEMANTIC_WEB_SHACL_TURTLE = [
  BCP47_LANGTAG_SHACL_TURTLE,
  AZTEC_EMBEDDING_SHACL_TURTLE,
  AZTEC_TRACE_SHACL_TURTLE,
  CARRIER_SHACL_TURTLE,
  CODE16K_CARRIER_SHACL_TURTLE,
].join("\n\n");

function titleCase(value: string): string {
  return value[0]!.toUpperCase() + value.slice(1).toLowerCase();
}

function escapeTurtleString(value: string): string {
  return `"${value
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t")}"`;
}
