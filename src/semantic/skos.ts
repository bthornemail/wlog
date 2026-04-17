// ============================================================
// WOLOG — SKOS Knowledge Organization
// Simple Knowledge Organization System aligned with Unicode addressing
// and duodecimal (base-12) classification.
// ============================================================

import type { TurtleTriple } from "./semantic-web.js";

export const SKOS_PREFIXES = `PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX skosxl: <http://www.w3.org/2008/05/skos-xl#>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX wolog: <urn:wolog:ontology:>
PREFIX wres: <urn:wolog:resource:>`;

export const SKOS_NAMESPACES = {
  SKOS: "http://www.w3.org/2004/02/skos/core#",
  SKOSXL: "http://www.w3.org/2008/05/skos-xl#",
  DCTERMS: "http://purl.org/dc/terms/",
} as const;

export const DUODECIMAL_DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "ᘔ", "Ɛ"] as const;
export const DUODECIMAL_NAMES = [
  "zero", "one", "two", "three", "four", "five",
  "six", "seven", "eight", "nine", "dec", "el",
] as const;

export type DuodecimalDigit = (typeof DUODECIMAL_DIGITS)[number];

export interface UnicodeAddress {
  readonly codePoint: number;
  readonly hex: string;
  readonly duodecimal: string;
  readonly block: string;
  readonly plane: number;
}

export interface ConceptMetadata {
  readonly prefLabel: string;
  readonly altLabels?: readonly string[];
  readonly definition?: string;
  readonly scopeNote?: string;
  readonly historyNote?: string;
  readonly changeNote?: string;
  readonly editorialNote?: string;
  readonly example?: string;
}

export interface ConceptSchemeMetadata {
  readonly title: string;
  readonly description?: string;
  readonly creator?: string;
  readonly date?: string;
  readonly version?: string;
  readonly namespace?: string;
}

export interface SkosConcept {
  readonly uri: string;
  readonly conceptScheme: string;
  readonly notation: string;
  readonly metadata: ConceptMetadata;
  readonly broader?: readonly string[];
  readonly narrower?: readonly string[];
  readonly related?: readonly string[];
  readonly exactMatch?: readonly string[];
  readonly closeMatch?: readonly string[];
}

export interface SkosConceptScheme {
  readonly uri: string;
  readonly metadata: ConceptSchemeMetadata;
  readonly concepts: readonly string[];
}

export interface SkosCollection {
  readonly uri: string;
  readonly label: string;
  readonly description?: string;
  readonly members: readonly string[];
  readonly ordered?: boolean;
}

export type SkosResource = SkosConcept | SkosConceptScheme | SkosCollection;

export function unicodeToDuodecimal(codePoint: number): string {
  let n = codePoint;
  if (n === 0) return "0";
  const digits: string[] = [];
  while (n > 0) {
    const remainder = n % 12;
    digits.push(DUODECIMAL_DIGITS[remainder]!);
    n = Math.floor(n / 12);
  }
  return digits.reverse().join("");
}

export function duodecimalToUnicode(duodecimal: string): number {
  let result = 0;
  for (const char of duodecimal) {
    const digitIndex = DUODECIMAL_DIGITS.indexOf(char as DuodecimalDigit);
    if (digitIndex === -1) {
      throw new Error(`Invalid duodecimal digit: ${char}`);
    }
    result = result * 12 + digitIndex;
  }
  return result;
}

export function generateUnicodeAddress(codePoint: number): UnicodeAddress {
  const hex = codePoint.toString(16).toUpperCase().padStart(4, "0");
  return {
    codePoint,
    hex: `U+${hex}`,
    duodecimal: unicodeToDuodecimal(codePoint),
    block: getUnicodeBlock(codePoint),
    plane: Math.floor(codePoint / 0x10000),
  };
}

export function getUnicodeBlock(codePoint: number): string {
  if (codePoint >= 0x0000 && codePoint <= 0x007F) return "Basic Latin";
  if (codePoint >= 0x0080 && codePoint <= 0x00FF) return "Latin-1 Supplement";
  if (codePoint >= 0x0100 && codePoint <= 0x017F) return "Latin Extended-A";
  if (codePoint >= 0x0180 && codePoint <= 0x024F) return "Latin Extended-B";
  if (codePoint >= 0x0250 && codePoint <= 0x02AF) return "IPA Extensions";
  if (codePoint >= 0x0300 && codePoint <= 0x036F) return "Combining Diacritical Marks";
  if (codePoint >= 0x0370 && codePoint <= 0x03FF) return "Greek and Coptic";
  if (codePoint >= 0x0400 && codePoint <= 0x04FF) return "Cyrillic";
  if (codePoint >= 0x0500 && codePoint <= 0x052F) return "Cyrillic Supplement";
  if (codePoint >= 0x0530 && codePoint <= 0x058F) return "Armenian";
  if (codePoint >= 0x0590 && codePoint <= 0x05FF) return "Hebrew";
  if (codePoint >= 0x0600 && codePoint <= 0x06FF) return "Arabic";
  if (codePoint >= 0x0900 && codePoint <= 0x097F) return "Devanagari";
  if (codePoint >= 0x0980 && codePoint <= 0x09FF) return "Bengali";
  if (codePoint >= 0x2000 && codePoint <= 0x206F) return "General Punctuation";
  if (codePoint >= 0x2070 && codePoint <= 0x209F) return "Superscripts and Subscripts";
  if (codePoint >= 0x20A0 && codePoint <= 0x20CF) return "Currency Symbols";
  if (codePoint >= 0x2100 && codePoint <= 0x214F) return "Letterlike Symbols";
  if (codePoint >= 0x2150 && codePoint <= 0x218F) return "Number Forms";
  if (codePoint >= 0x2190 && codePoint <= 0x21FF) return "Arrows";
  if (codePoint >= 0x2200 && codePoint <= 0x22FF) return "Mathematical Operators";
  if (codePoint >= 0x2300 && codePoint <= 0x23FF) return "Miscellaneous Technical";
  if (codePoint >= 0x2500 && codePoint <= 0x257F) return "Box Drawing";
  if (codePoint >= 0x2580 && codePoint <= 0x259F) return "Block Elements";
  if (codePoint >= 0x25A0 && codePoint <= 0x25FF) return "Geometric Shapes";
  if (codePoint >= 0x2600 && codePoint <= 0x26FF) return "Miscellaneous Symbols";
  if (codePoint >= 0x2700 && codePoint <= 0x27BF) return "Dingbats";
  if (codePoint >= 0x2800 && codePoint <= 0x28FF) return "Braille Patterns";
  if (codePoint >= 0x1F300 && codePoint <= 0x1F5FF) return "Miscellaneous Symbols and Pictographs";
  if (codePoint >= 0x1F600 && codePoint <= 0x1F64F) return "Emoticons";
  if (codePoint >= 0x1F680 && codePoint <= 0x1F6FF) return "Transport and Map Symbols";
  if (codePoint >= 0x1F900 && codePoint <= 0x1F9FF) return "Supplemental Symbols and Pictographs";
  return "Unknown";
}

export function generateConceptUri(
  scheme: string,
  notation: string,
): string {
  const normalizedNotation = notation.replace(/[^a-zA-Z0-9_-]/g, "_");
  return `${scheme}concept/${normalizedNotation}`;
}

export function conceptTriples(concept: SkosConcept): TurtleTriple[] {
  const triples: TurtleTriple[] = [];
  const subject = concept.uri;

  triples.push(
    { subject, predicate: "a", object: "skos:Concept" },
    { subject, predicate: "skos:notation", object: `"${concept.notation}"` },
    { subject, predicate: "skos:prefLabel", object: `"${concept.metadata.prefLabel}"@en` },
  );

  if (concept.metadata.altLabels) {
    for (const alt of concept.metadata.altLabels) {
      triples.push({ subject, predicate: "skos:altLabel", object: `"${alt}"@en` });
    }
  }

  if (concept.metadata.definition) {
    triples.push({ subject, predicate: "skos:definition", object: `"${concept.metadata.definition}"@en` });
  }

  if (concept.metadata.scopeNote) {
    triples.push({ subject, predicate: "skos:scopeNote", object: `"${concept.metadata.scopeNote}"@en` });
  }

  if (concept.metadata.historyNote) {
    triples.push({ subject, predicate: "skos:historyNote", object: `"${concept.metadata.historyNote}"@en` });
  }

  if (concept.metadata.changeNote) {
    triples.push({ subject, predicate: "skos:changeNote", object: `"${concept.metadata.changeNote}"@en` });
  }

  if (concept.metadata.editorialNote) {
    triples.push({ subject, predicate: "skos:editorialNote", object: `"${concept.metadata.editorialNote}"@en` });
  }

  if (concept.metadata.example) {
    triples.push({ subject, predicate: "skos:example", object: `"${concept.metadata.example}"@en` });
  }

  if (concept.broader) {
    for (const broader of concept.broader) {
      triples.push({ subject, predicate: "skos:broader", object: `<${broader}>` });
    }
  }

  if (concept.narrower) {
    for (const narrower of concept.narrower) {
      triples.push({ subject, predicate: "skos:narrower", object: `<${narrower}>` });
    }
  }

  if (concept.related) {
    for (const related of concept.related) {
      triples.push({ subject, predicate: "skos:related", object: `<${related}>` });
    }
  }

  if (concept.exactMatch) {
    for (const match of concept.exactMatch) {
      triples.push({ subject, predicate: "skos:exactMatch", object: `<${match}>` });
    }
  }

  if (concept.closeMatch) {
    for (const match of concept.closeMatch) {
      triples.push({ subject, predicate: "skos:closeMatch", object: `<${match}>` });
    }
  }

  triples.push({ subject, predicate: "skos:inScheme", object: `<${concept.conceptScheme}>` });

  return triples;
}

export function conceptSchemeTriples(scheme: SkosConceptScheme): TurtleTriple[] {
  const triples: TurtleTriple[] = [];
  const subject = scheme.uri;

  triples.push(
    { subject, predicate: "a", object: "skos:ConceptScheme" },
    { subject, predicate: "dcterms:title", object: `"${scheme.metadata.title}"@en` },
  );

  if (scheme.metadata.description) {
    triples.push({ subject, predicate: "dcterms:description", object: `"${scheme.metadata.description}"@en` });
  }

  if (scheme.metadata.creator) {
    triples.push({ subject, predicate: "dcterms:creator", object: `"${scheme.metadata.creator}"` });
  }

  if (scheme.metadata.date) {
    triples.push({ subject, predicate: "dcterms:date", object: `"${scheme.metadata.date}"^^xsd:date` });
  }

  if (scheme.metadata.version) {
    triples.push({ subject, predicate: "dcterms:hasVersion", object: `"${scheme.metadata.version}"` });
  }

  for (const conceptUri of scheme.concepts) {
    triples.push({ subject, predicate: "skos:hasTopConcept", object: `<${conceptUri}>` });
  }

  return triples;
}

export function collectionTriples(collection: SkosCollection): TurtleTriple[] {
  const triples: TurtleTriple[] = [];
  const subject = collection.uri;
  const type = collection.ordered ? "skos:OrderedCollection" : "skos:Collection";

  triples.push(
    { subject, predicate: "a", object: type },
    { subject, predicate: "skos:prefLabel", object: `"${collection.label}"@en` },
  );

  if (collection.description) {
    triples.push({ subject, predicate: "dcterms:description", object: `"${collection.description}"@en` });
  }

  const memberPredicate = collection.ordered ? "skos:memberList" : "skos:member";
  for (const member of collection.members) {
    triples.push({ subject, predicate: memberPredicate, object: `<${member}>` });
  }

  return triples;
}

export function skosTriples(resource: SkosResource): TurtleTriple[] {
  if ("notation" in resource) return conceptTriples(resource as SkosConcept);
  if ("concepts" in resource) return conceptSchemeTriples(resource as SkosConceptScheme);
  return collectionTriples(resource as SkosCollection);
}

export function serializeSkosResource(resource: SkosResource): string {
  const lines: string[] = [SKOS_PREFIXES, ""];

  if ("notation" in resource) {
    lines.push(`# Concept: ${resource.uri}`);
    lines.push(`# Notation: ${resource.notation}`);
  } else if ("concepts" in resource) {
    lines.push(`# Concept Scheme: ${resource.uri}`);
    lines.push(`# Title: ${resource.metadata.title}`);
  } else {
    lines.push(`# Collection: ${resource.uri}`);
    lines.push(`# Label: ${resource.label}`);
  }

  lines.push("");

  for (const triple of skosTriples(resource)) {
    lines.push(`${triple.subject} ${triple.predicate} ${triple.object} .`);
  }

  return lines.join("\n");
}

export const WOLOG_BASIS_FAMILY_SCHEME = "urn:wolog:skos:basis-family";
export const WOLOG_CARRIER_ROLE_SCHEME = "urn:wolog:skos:carrier-role";
export const WOLOG_INSTRUMENT_SCHEME = "urn:wolog:skos:instrument";

export const WOLOG_BASIS_FAMILY_CONCEPTS: SkosConcept[] = [
  {
    uri: generateConceptUri(WOLOG_BASIS_FAMILY_SCHEME, "squares"),
    conceptScheme: WOLOG_BASIS_FAMILY_SCHEME,
    notation: "squares",
    metadata: {
      prefLabel: "Squares",
      altLabels: ["Polyominoes"],
      definition: "2D basis family using square cells in regular grid arrangement",
    },
  },
  {
    uri: generateConceptUri(WOLOG_BASIS_FAMILY_SCHEME, "triangles"),
    conceptScheme: WOLOG_BASIS_FAMILY_SCHEME,
    notation: "triangles",
    metadata: {
      prefLabel: "Triangles",
      definition: "2D basis family using triangular cells in regular tiling",
    },
  },
  {
    uri: generateConceptUri(WOLOG_BASIS_FAMILY_SCHEME, "hexagons"),
    conceptScheme: WOLOG_BASIS_FAMILY_SCHEME,
    notation: "hexagons",
    metadata: {
      prefLabel: "Hexagons",
      altLabels: ["Honeycombs"],
      definition: "2D basis family using hexagonal cells in close-packed arrangement",
    },
  },
  {
    uri: generateConceptUri(WOLOG_BASIS_FAMILY_SCHEME, "cubes"),
    conceptScheme: WOLOG_BASIS_FAMILY_SCHEME,
    notation: "cubes",
    metadata: {
      prefLabel: "Cubes",
      altLabels: ["Polycubes", "Space-filling cubes"],
      definition: "3D basis family using cubic cells in regular grid arrangement",
    },
  },
];

export const WOLOG_CARRIER_ROLE_CONCEPTS: SkosConcept[] = [
  {
    uri: generateConceptUri(WOLOG_CARRIER_ROLE_SCHEME, "aztec-sprite"),
    conceptScheme: WOLOG_CARRIER_ROLE_SCHEME,
    notation: "serializable-sprite",
    metadata: {
      prefLabel: "Serializable Sprite",
      altLabels: ["Aztec Carrier", "Identity Carrier"],
      definition: "Carrier defining what it IS - identity and persistence",
      example: "urn:wolog:carrier:aztec:*",
    },
    broader: [generateConceptUri(WOLOG_CARRIER_ROLE_SCHEME, "carrier")],
  },
  {
    uri: generateConceptUri(WOLOG_CARRIER_ROLE_SCHEME, "maxi-projection"),
    conceptScheme: WOLOG_CARRIER_ROLE_SCHEME,
    notation: "scene-projection",
    metadata: {
      prefLabel: "Scene Projection",
      altLabels: ["MaxiCode Carrier", "View Modifier"],
      definition: "Carrier defining how it APPEARS in a scene",
      example: "urn:wolog:carrier:maxi:*:mode*",
    },
    broader: [generateConceptUri(WOLOG_CARRIER_ROLE_SCHEME, "carrier")],
  },
  {
    uri: generateConceptUri(WOLOG_CARRIER_ROLE_SCHEME, "bee-message"),
    conceptScheme: WOLOG_CARRIER_ROLE_SCHEME,
    notation: "transport-message",
    metadata: {
      prefLabel: "Transport Message",
      altLabels: ["BEEtag Carrier", "Payload Carrier"],
      definition: "Carrier defining how it MOVES - physical or computational transport",
      example: "urn:wolog:carrier:bee:*",
    },
    broader: [generateConceptUri(WOLOG_CARRIER_ROLE_SCHEME, "carrier")],
  },
  {
    uri: generateConceptUri(WOLOG_CARRIER_ROLE_SCHEME, "code16k-record-stack"),
    conceptScheme: WOLOG_CARRIER_ROLE_SCHEME,
    notation: "record-stack",
    metadata: {
      prefLabel: "Record Stack",
      altLabels: ["Code16K Carrier", "Stacked Record Message"],
      definition: "Carrier defining row-stacked record/message transport semantics",
      example: "urn:wolog:carrier:code16k:*",
    },
    broader: [generateConceptUri(WOLOG_CARRIER_ROLE_SCHEME, "carrier")],
  },
  {
    uri: generateConceptUri(WOLOG_CARRIER_ROLE_SCHEME, "carrier"),
    conceptScheme: WOLOG_CARRIER_ROLE_SCHEME,
    notation: "carrier",
    metadata: {
      prefLabel: "Carrier",
      definition: "Abstract base for all barcode carriers in the WOLOG Barcode Quartet",
    },
  },
];

export const WOLOG_INSTRUMENT_CONCEPTS: SkosConcept[] = [
  {
    uri: generateConceptUri(WOLOG_INSTRUMENT_SCHEME, "smith-chart"),
    conceptScheme: WOLOG_INSTRUMENT_SCHEME,
    notation: "smith-chart",
    metadata: {
      prefLabel: "Smith Chart",
      definition: "Coordinate transformation instrument for complex impedance visualization",
    },
  },
  {
    uri: generateConceptUri(WOLOG_INSTRUMENT_SCHEME, "genaille-rods"),
    conceptScheme: WOLOG_INSTRUMENT_SCHEME,
    notation: "genaille-rods",
    metadata: {
      prefLabel: "Genaille Rods",
      definition: "Path-following arithmetic instrument for division visualization",
    },
  },
  {
    uri: generateConceptUri(WOLOG_INSTRUMENT_SCHEME, "binary-guess-surface"),
    conceptScheme: WOLOG_INSTRUMENT_SCHEME,
    notation: "binary-guess-surface",
    metadata: {
      prefLabel: "Binary Guess Surface",
      definition: "Subset/mask revelation instrument for binary search visualization",
    },
  },
  {
    uri: generateConceptUri(WOLOG_INSTRUMENT_SCHEME, "semi-log-duodecimal"),
    conceptScheme: WOLOG_INSTRUMENT_SCHEME,
    notation: "semi-log-duodecimal",
    metadata: {
      prefLabel: "Semi-Log Duodecimal Classifier",
      definition: "Classification navigation instrument using duodecimal (base-12) indexing",
    },
  },
];

export const DUODECIMAL_CLASSIFICATION_SCHEME = "urn:wolog:skos:duodecimal-class";

export const DUODECIMAL_DIGIT_CONCEPTS: SkosConcept[] = DUODECIMAL_DIGITS.map((digit, index): SkosConcept => ({
  uri: generateConceptUri(DUODECIMAL_CLASSIFICATION_SCHEME, digit),
  conceptScheme: DUODECIMAL_CLASSIFICATION_SCHEME,
  notation: digit,
  metadata: {
    prefLabel: DUODECIMAL_NAMES[index] ?? String(index),
    altLabels: [String(index), index.toString(16).toUpperCase()],
    definition: `Duodecimal digit representing ${index} in base-12`,
    example: `The digit represents the value ${index}`,
  },
}));

export function createBasisFamilyScheme(): SkosConceptScheme {
  return {
    uri: WOLOG_BASIS_FAMILY_SCHEME,
    metadata: {
      title: "WOLOG Basis Family Classification",
      description: "Controlled vocabulary for polyform basis families in WOLOG",
      creator: "WOLOG",
      date: new Date().toISOString().split("T")[0]!,
      version: "1.0",
    },
    concepts: WOLOG_BASIS_FAMILY_CONCEPTS.map((c) => c.uri),
  };
}

export function createCarrierRoleScheme(): SkosConceptScheme {
  return {
    uri: WOLOG_CARRIER_ROLE_SCHEME,
    metadata: {
      title: "WOLOG Carrier Role Classification",
      description: "Controlled vocabulary for barcode carrier roles (Aztec/MaxiCode/BEEtag/Code16K)",
      creator: "WOLOG",
      date: new Date().toISOString().split("T")[0]!,
      version: "1.0",
    },
    concepts: WOLOG_CARRIER_ROLE_CONCEPTS.map((c) => c.uri),
  };
}

export function createInstrumentScheme(): SkosConceptScheme {
  return {
    uri: WOLOG_INSTRUMENT_SCHEME,
    metadata: {
      title: "WOLOG Instrument Classification",
      description: "Controlled vocabulary for WOLOG instruments (readable transformation surfaces)",
      creator: "WOLOG",
      date: new Date().toISOString().split("T")[0]!,
      version: "1.0",
    },
    concepts: WOLOG_INSTRUMENT_CONCEPTS.map((c) => c.uri),
  };
}

export function createDuodecimalScheme(): SkosConceptScheme {
  return {
    uri: DUODECIMAL_CLASSIFICATION_SCHEME,
    metadata: {
      title: "Duodecimal Digit Classification",
      description: "Base-12 digit classification aligned with Unicode addressing",
      creator: "WOLOG",
      date: new Date().toISOString().split("T")[0]!,
      version: "1.0",
    },
    concepts: DUODECIMAL_DIGIT_CONCEPTS.map((c) => c.uri),
  };
}

export const SKOS_QUERIES = {
  findConceptsByScheme: (schemeUri: string) => ({
    variables: ["?concept", "?notation", "?prefLabel"],
    where: [
      { subject: "?concept", predicate: "a", object: "skos:Concept" },
      { subject: "?concept", predicate: "skos:inScheme", object: `<${schemeUri}>` },
      { subject: "?concept", predicate: "skos:notation", object: "?notation" },
      { subject: "?concept", predicate: "skos:prefLabel", object: "?prefLabel" },
    ],
  }),

  findBroaderNarrower: (conceptUri: string) => ({
    variables: ["?broader", "?narrower"],
    where: [
      { subject: `<${conceptUri}>`, predicate: "skos:broader", object: "?broader" },
      { subject: `<${conceptUri}>`, predicate: "skos:narrower", object: "?narrower" },
    ],
  }),

  findRelatedConcepts: (conceptUri: string) => ({
    variables: ["?related", "?label"],
    where: [
      { subject: `<${conceptUri}>`, predicate: "skos:related", object: "?related" },
      { subject: "?related", predicate: "skos:prefLabel", object: "?label" },
    ],
  }),

  findConceptByNotation: (schemeUri: string, notation: string) => ({
    variables: ["?concept", "?prefLabel", "?definition"],
    where: [
      { subject: "?concept", predicate: "a", object: "skos:Concept" },
      { subject: "?concept", predicate: "skos:inScheme", object: `<${schemeUri}>` },
      { subject: "?concept", predicate: "skos:notation", object: `"${notation}"` },
      { subject: "?concept", predicate: "skos:prefLabel", object: "?prefLabel" },
    ],
  }),
};

export function notationToUnicodeAddress(notation: string, baseOffset: number = 0x1000): UnicodeAddress {
  const duodecimalValue = duodecimalToUnicode(notation);
  return generateUnicodeAddress(baseOffset + duodecimalValue);
}

export function unicodeAddressToNotation(address: UnicodeAddress, baseOffset: number = 0x1000): string {
  const adjustedCodePoint = address.codePoint - baseOffset;
  if (adjustedCodePoint < 0) {
    throw new Error("Code point below base offset");
  }
  return unicodeToDuodecimal(adjustedCodePoint);
}
