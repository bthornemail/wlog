// ============================================================
// WOLOG — RIF Rule Layer
// Rule Interchange Format for polyform inference rules.
// ============================================================
//
// Constrained Horn Clause (CHC) alignment with Barcode Quartet:
//
//   φ ∧ P₁(x₁) ∧ ... ∧ Pₙ(xₙ) → P(x)
//
//   φ (constraint) = Aztec (defines identity, "what it IS")
//   P (predicate)  = MaxiCode (defines projection, "how it APPEARS")
//   x (variable)   = BEEtag (defines message, "how it MOVES")
//   r (record)     = Code16K (defines stacked record messaging)
//
// ============================================================

import type { TurtleTriple } from "./semantic-web.js";
import { WOLOG_CARRIER_ROLES } from "./ontology.js";

export const RIF_PREFIXES = `PREFIX rif: <http://www.w3.org/2007/rif#>
PREFIX rifbld: <http://www.w3.org/2007/rif Builtins#>
PREFIX wolog: <urn:wolog:ontology:>
PREFIX wprop: <urn:wolog:property:>
PREFIX wres: <urn:wolog:resource:>`;

export type RIFDialect = "BLD" | "PRD" | "Core";

// ============================================================
// Constrained Horn Clause Types
// ============================================================

export interface ConstrainedHornClause {
  readonly type: "CHC";
  readonly constraint: AztecConstraint;
  readonly body: readonly HornAtom[];
  readonly head: HornAtom;
}

export interface AztecConstraint {
  readonly carrierType: "AztecCarrier";
  readonly manifestWitness: string;
  readonly layers: number;
  readonly packedHex: string;
}

export interface HornAtom {
  readonly predicate: string;
  readonly terms: readonly HornTerm[];
}

export type HornTerm =
  | { type: "Var"; name: string }
  | { type: "Const"; value: string }
  | { type: "BeeTag"; identity15: HornTerm; error10: HornTerm }
  | { type: "MaxiCode"; mode: HornTerm; gridRows: HornTerm; gridCols: HornTerm };

export interface HornClauseRule {
  readonly id: string;
  readonly chc: ConstrainedHornClause;
  readonly label: string;
  readonly description: string | undefined;
}

// ============================================================
// RIF Types
// ============================================================

export interface RIFCondition {
  readonly type: "And" | "Or" | "Atom" | "External" | "Exists" | "Literal";
  readonly content?: readonly RIFCondition[];
  readonly atom?: RIFAtomic;
  readonly external?: RIFExternal;
  readonly variable?: string;
  readonly frame?: RIFFrame;
  readonly literal?: RIFLiteral;
}

export interface RIFAtomic {
  readonly type: "Atom";
  readonly predicate: string;
  readonly args: readonly RIFTerm[];
}

export interface RIFExternal {
  readonly type: "External";
  readonly content: RIFAtomic;
}

export interface RIFTerm {
  readonly type: "Const" | "Var" | "List" | "Func" | "Frame";
  readonly value?: string;
  readonly name?: string;
  readonly args?: readonly RIFTerm[];
  readonly op?: string;
  readonly slots?: readonly RIFSlot[];
  readonly object?: RIFTerm;
}

export interface RIFSlot {
  readonly name: RIFTerm;
  readonly value: RIFTerm;
}

export interface RIFFrame {
  readonly type: "Frame";
  readonly object: RIFTerm;
  readonly slots: readonly RIFSlot[];
}

export interface RIFLiteral {
  readonly type: "Literal";
  readonly value: string;
  readonly datatype?: string;
}

export interface RIFRule {
  readonly type: "Implies" | "Fact" | "Query";
  readonly label: string | undefined;
  readonly condition: RIFCondition | undefined;
  readonly action: RIFCondition | undefined;
  readonly conclusion: RIFCondition | undefined;
}

export interface RIFDocument {
  readonly dialect: RIFDialect;
  readonly rules: readonly RIFRule[];
  readonly imports?: readonly RIFImport[];
  readonly prefixes?: readonly RIFPrefix[];
}

export interface RIFImport {
  readonly iri: string;
  readonly dialect?: RIFDialect;
}

export interface RIFPrefix {
  readonly prefix: string;
  readonly iri: string;
}

export interface PolyformRule {
  readonly id: string;
  readonly label: string;
  readonly condition: string;
  readonly conclusion: string;
  readonly description?: string;
  readonly examples?: readonly string[];
}

// ============================================================
// Horn Clause Constructors
// ============================================================

export function hornVar(name: string): HornTerm {
  return { type: "Var", name };
}

export function hornConst(value: string): HornTerm {
  return { type: "Const", value };
}

export function hornBeeTag(identity15: HornTerm, error10: HornTerm): HornTerm {
  return { type: "BeeTag", identity15, error10 };
}

export function hornMaxiCode(mode: HornTerm, gridRows: HornTerm, gridCols: HornTerm): HornTerm {
  return { type: "MaxiCode", mode, gridRows, gridCols };
}

export function hornAtom(predicate: string, ...terms: readonly HornTerm[]): HornAtom {
  return { predicate, terms };
}

export function chc(
  constraint: AztecConstraint,
  body: readonly HornAtom[],
  head: HornAtom,
): ConstrainedHornClause {
  return { type: "CHC", constraint, body, head };
}

export function chcRule(
  id: string,
  label: string,
  constraint: AztecConstraint,
  body: readonly HornAtom[],
  head: HornAtom,
  description?: string,
): HornClauseRule {
  return { id, label, chc: chc(constraint, body, head), description };
}

// ============================================================
// Horn Clause Formatters
// ============================================================

function formatHornTerm(t: HornTerm): string {
  switch (t.type) {
    case "Var": return `?${t.name}`;
    case "Const": return `"${t.value}"`;
    case "BeeTag": return `BEE(${t.identity15}, ${t.error10})`;
    case "MaxiCode": return `MAXI(mode=${t.mode}, ${t.gridRows}×${t.gridCols})`;
  }
}

function formatHornAtom(a: HornAtom): string {
  const args = a.terms.map(formatHornTerm).join(", ");
  return `${a.predicate}(${args})`;
}

function formatAztecConstraint(c: AztecConstraint): string {
  return `Aztec(witness="${c.manifestWitness}", layers=${c.layers})`;
}

export function chcToString(chc: ConstrainedHornClause): string {
  const constraint = formatAztecConstraint(chc.constraint);
  const body = chc.body.map(formatHornAtom).join(" ∧ ");
  const head = formatHornAtom(chc.head);

  if (chc.body.length === 0) {
    return `${constraint} → ${head}`;
  }
  return `${constraint} ∧ ${body} → ${head}`;
}

export function chcRuleToString(rule: HornClauseRule): string {
  const parts: string[] = [`# ${rule.label}`];
  if (rule.description) {
    parts.push(`# ${rule.description}`);
  }
  parts.push(`# ${rule.id}`);
  parts.push(chcToString(rule.chc));
  return parts.join("\n");
}

export function chcToTurtle(chc: ConstrainedHornClause, subject: string): TurtleTriple[] {
  const triples: TurtleTriple[] = [];

  triples.push(
    { subject, predicate: "a", object: "wolog:ConstrainedHornClause" },
    { subject, predicate: "wolog:chcConstraint", object: turtleLiteral(formatAztecConstraint(chc.constraint)) },
  );

  chc.body.forEach((atom, index) => {
    triples.push(
      { subject, predicate: `wolog:chcBody${index}`, object: turtleLiteral(formatHornAtom(atom)) },
    );
  });

  triples.push({
    subject,
    predicate: "wolog:chcHead",
    object: turtleLiteral(formatHornAtom(chc.head)),
  });

  return triples;
}

function turtleLiteral(value: string): string {
  return `"${value.replace(/"/g, '\\"')}"`;
}

// ============================================================
// Pre-defined Aztec Constraints
// ============================================================

export function aztecConstraint(manifestWitness: string, layers: number, packedHex: string): AztecConstraint {
  return { carrierType: "AztecCarrier", manifestWitness, layers, packedHex };
}

// ============================================================
// Pre-defined CHC Rules (Barcode Quartet)
// ============================================================

export const BARCODE_QUARTET_CHC_RULES: HornClauseRule[] = [
  chcRule(
    "wolog:chc:aztec-constrains-maxi",
    "Aztec constraint determines MaxiCode projection",
    aztecConstraint("aztec:identity", 2, "0001020304"),
    [
      hornAtom("wolog:Polyform", hornVar("P")),
      hornAtom("wolog:BeeTagCarrier", hornBeeTag(hornVar("ID"), hornVar("ECC"))),
    ],
    hornAtom("wolog:MaxiCodeCarrier", hornMaxiCode(hornConst("2"), hornConst("33"), hornConst("30"))),
    "The Aztec carrier constrains what MaxiCode projection is valid",
  ),

  chcRule(
    "wolog:chc:bee-carries-identity",
    "BEEtag carries the message variable",
    aztecConstraint("aztec:identity", 1, "0001020304"),
    [
      hornAtom("wolog:Polyform", hornVar("P")),
    ],
    hornAtom("wolog:BeeTagCarrier", hornBeeTag(hornVar("ID"), hornVar("ECC"))),
    "Any polyform constrained by Aztec has a corresponding BEEtag carrier",
  ),

  chcRule(
    "wolog:chc:maxi-is-projection",
    "MaxiCode is the scene projection predicate",
    aztecConstraint("aztec:projection", 3, "0001020304"),
    [
      hornAtom("wolog:Polyform", hornVar("P")),
    ],
    hornAtom("wolog:MaxiCodeCarrier", hornMaxiCode(hornVar("MODE"), hornConst("33"), hornConst("30"))),
    "MaxiCode defines the scene projection (how it APPEARS)",
  ),

  chcRule(
    "wolog:chc:code16k-record-stack",
    "Code16K is stacked record message",
    aztecConstraint("aztec:record-stack", 2, "0001020304"),
    [
      hornAtom("wolog:Polyform", hornVar("P")),
    ],
    hornAtom("wolog:Code16KCarrier", hornVar("C")),
    "Code16K carriers define stacked record messaging and concatenation order",
  ),

  chcRule(
    "wolog:chc:full-quartet",
    "Full Barcode Quartet: Aztec → Maxi → BEE → Code16K",
    aztecConstraint("aztec:full", 4, "0001020304"),
    [
      hornAtom("wolog:Polyform", hornVar("P")),
    ],
    hornAtom("wolog:FullQuartet",
      hornMaxiCode(hornVar("M"), hornConst("33"), hornConst("30")),
      hornBeeTag(hornVar("ID"), hornVar("ECC")),
      hornVar("C"),
    ),
    "Complete flow: constraint → projection → message → record stack",
  ),
];

// Backward-compatible alias while quartet naming becomes primary.
export const BARCODE_TRINITY_CHC_RULES = BARCODE_QUARTET_CHC_RULES;

// ============================================================
// Polyform CHC Rules
// ============================================================

export const POLYFORM_CHC_RULES: HornClauseRule[] = [
  chcRule(
    "wolog:chc:polyform-degree",
    "Polyform degree from cell count",
    aztecConstraint("aztec:degree", 1, "0001020304"),
    [
      hornAtom("wolog:Polyform", hornVar("P")),
      hornAtom("wolog:hasCellCount", hornVar("P"), hornConst("4")),
    ],
    hornAtom("wolog:DegreeClass", hornVar("P"), hornConst("tetromino")),
    "A polyform with 4 cells is a tetromino",
  ),

  chcRule(
    "wolog:chc:polyform-family",
    "Polyform family from basis",
    aztecConstraint("aztec:family", 1, "0001020304"),
    [
      hornAtom("wolog:Polyform", hornVar("P")),
      hornAtom("wolog:BasisFamily", hornVar("F")),
    ],
    hornAtom("wolog:hasFamily", hornVar("P"), hornVar("F")),
    "A polyform has a basis family",
  ),

  chcRule(
    "wolog:chc:serializable-sprite",
    "Aztec is serializable sprite (identity)",
    aztecConstraint("aztec:sprite", 2, "0001020304"),
    [],
    hornAtom("wolog:AztecCarrier", hornVar("A")),
    "Aztec carriers define serializable sprites (what it IS)",
  ),

  chcRule(
    "wolog:chc:scene-projection",
    "MaxiCode is scene projection (view)",
    aztecConstraint("aztec:scene", 3, "0001020304"),
    [],
    hornAtom("wolog:MaxiCodeCarrier", hornMaxiCode(hornVar("M"), hornConst("33"), hornConst("30"))),
    "MaxiCode carriers define scene projections (how it APPEARS)",
  ),

  chcRule(
    "wolog:chc:transport-message",
    "BEEtag is transport message (payload)",
    aztecConstraint("aztec:transport", 1, "0001020304"),
    [],
    hornAtom("wolog:BeeTagCarrier", hornBeeTag(hornVar("ID"), hornVar("ECC"))),
    "BEEtag carriers define transport messages (how it MOVES)",
  ),

  chcRule(
    "wolog:chc:record-stack",
    "Code16K is record stack message",
    aztecConstraint("aztec:record-stack", 2, "0001020304"),
    [],
    hornAtom("wolog:Code16KCarrier", hornVar("C")),
    "Code16K carriers define stacked records (how it ORDERS messages)",
  ),
];

export function rifTerm(value: string, type: "Const" | "Var" = "Const"): RIFTerm {
  if (type === "Var" && !value.startsWith("?")) {
    return { type, name: `?${value}` };
  }
  return { type, value };
}

export function rifAtomic(predicate: string, ...args: readonly RIFTerm[]): RIFAtomic {
  return { type: "Atom", predicate, args };
}

export function rifAnd(...conditions: readonly RIFCondition[]): RIFCondition {
  return { type: "And", content: conditions };
}

export function rifOr(...conditions: readonly RIFCondition[]): RIFCondition {
  return { type: "Or", content: conditions };
}

export function rifExternal(atomic: RIFAtomic): RIFCondition {
  return { type: "External", external: { type: "External", content: atomic } };
}

export function rifFrame(object: RIFTerm, ...slots: readonly RIFSlot[]): RIFFrame {
  return { type: "Frame", object, slots };
}

export function rifSlot(name: string, value: RIFTerm): RIFSlot {
  return { name: rifTerm(name), value };
}

export function rifImplies(
  condition: RIFCondition,
  conclusion: RIFCondition,
  label?: string,
): RIFRule {
  return { type: "Implies", label: label ?? undefined, condition, action: conclusion, conclusion: undefined };
}

export function rifFact(conclusion: RIFCondition, label?: string): RIFRule {
  return { type: "Fact", label: label ?? undefined, condition: undefined, action: undefined, conclusion };
}

export function rifQuery(condition: RIFCondition, label?: string): RIFRule {
  return { type: "Query", label: label ?? undefined, condition, action: undefined, conclusion: undefined };
}

function formatRIFTerm(term: RIFTerm): string {
  switch (term.type) {
    case "Const":
      return term.value ?? "";
    case "Var":
      return term.name ?? "";
    case "List":
      return `(${term.args?.map(formatRIFTerm).join(" ") ?? ""})`;
    case "Func":
      return `${term.op ?? ""}(${term.args?.map(formatRIFTerm).join(", ") ?? ""})`;
    case "Frame":
      if (!term.object || !term.slots) return "";
      const slots = term.slots.map((s) => `[${formatRIFTerm(s.name)} -> ${formatRIFTerm(s.value)}]`).join(" ");
      return `${formatRIFTerm(term.object)} ${slots}`;
    default:
      return "";
  }
}

function formatRIFCondition(cond: RIFCondition): string {
  switch (cond.type) {
    case "And":
      return `And(${cond.content?.map(formatRIFCondition).join(" ") ?? ""})`;
    case "Or":
      return `Or(${cond.content?.map(formatRIFCondition).join(" ") ?? ""})`;
    case "Atom":
      const args = cond.atom?.args.map(formatRIFTerm).join(" ") ?? "";
      return `${cond.atom?.predicate ?? ""}(${args})`;
    case "External":
      return `External(${cond.external ? formatRIFAtomic(cond.external.content) : ""})`;
    case "Exists":
      const vars = cond.variable ?? "";
      const formula = cond.content?.map(formatRIFCondition).join(" ") ?? "";
      return `Exists ${vars} (${formula})`;
    case "Literal":
      return `"${cond.literal?.value ?? ""}"`;
    default:
      return "";
  }
}

function formatRIFAtomic(atomic: RIFAtomic): string {
  const args = atomic.args.map(formatRIFTerm).join(" ");
  return `${atomic.predicate}(${args})`;
}

export function rifRuleToString(rule: RIFRule): string {
  const parts: string[] = [];

  if (rule.label) {
    parts.push(`# ${rule.label}`);
  }

  switch (rule.type) {
    case "Implies":
      const cond = rule.condition ? formatRIFCondition(rule.condition) : "";
      const concl = rule.action ? formatRIFCondition(rule.action) : "";
      parts.push(`If ${cond} Then ${concl}`);
      break;
    case "Fact":
      const fact = rule.conclusion ? formatRIFCondition(rule.conclusion) : "";
      parts.push(fact);
      break;
    case "Query":
      const query = rule.condition ? formatRIFCondition(rule.condition) : "";
      parts.push(`?(${query})`);
      break;
  }

  return parts.join("\n");
}

export function rifDocumentToString(doc: RIFDocument): string {
  const lines: string[] = [
    RIF_PREFIXES,
    "",
    `# RIF Document (${doc.dialect} dialect)`,
    "",
  ];

  if (doc.imports) {
    for (const imp of doc.imports) {
      lines.push(`Import <${imp.iri}>`);
      if (imp.dialect) {
        lines.push(`  Dialect ${imp.dialect}`);
      }
    }
    lines.push("");
  }

  for (const rule of doc.rules) {
    lines.push(rifRuleToString(rule));
    lines.push("");
  }

  return lines.join("\n");
}

export const POLYFORM_INFERENCE_RULES: PolyformRule[] = [
  {
    id: "wolog:rule:degree-from-cells",
    label: "Degree from cell count",
    condition: `wolog:Polyform(?p) ^ wolog:hasCellCount(?p, ?n)`,
    conclusion: `wolog:DegreeClass(?p) ^ wolog:degreeValue(?p, ?n)`,
    description: "A polyform's degree can be inferred from its cell count",
    examples: ["A tetromino (4 cells) has degree 4"],
  },
  {
    id: "wolog:rule:family-from-basis",
    label: "Family from basis",
    condition: `wolog:Polyform(?p) ^ wolog:hasBasisFamily(?p, ?f)`,
    conclusion: `wolog:BasisFamily(?p) ^ wolog:familyType(?p, ?f)`,
    description: "A polyform's family is determined by its basis cell type",
    examples: ["A polyomino uses squares", "A polyiamond uses triangles"],
  },
  {
    id: "wolog:rule:aztec-sprite-identity",
    label: "Aztec as identity",
    condition: `wolog:Polyform(?p) ^ wolog:serializableSprite(?p, ?a)`,
    conclusion: `wolog:AztecCarrier(?a) ^ wolog:carrierRole(?a, "${WOLOG_CARRIER_ROLES.AZTEC_SPRITE}")`,
    description: "Aztec carriers define what a polyform IS",
  },
  {
    id: "wolog:rule:maxi-projection-view",
    label: "MaxiCode as scene projection",
    condition: `wolog:Polyform(?p) ^ wolog:sceneProjection(?p, ?m)`,
    conclusion: `wolog:MaxiCodeCarrier(?m) ^ wolog:carrierRole(?m, "${WOLOG_CARRIER_ROLES.MAXI_PROJECTION}")`,
    description: "MaxiCode carriers define how a polyform APPEARS",
  },
  {
    id: "wolog:rule:bee-transport-message",
    label: "BEEtag as transport",
    condition: `wolog:Polyform(?p) ^ wolog:transportMessage(?p, ?b)`,
    conclusion: `wolog:BeeTagCarrier(?b) ^ wolog:carrierRole(?b, "${WOLOG_CARRIER_ROLES.BEE_TRANSPORT}")`,
    description: "BEEtag carriers define how a polyform MOVES",
  },
  {
    id: "wolog:rule:code16k-record-stack",
    label: "Code16K as stacked record message",
    condition: `wolog:Polyform(?p) ^ wolog:recordStack(?p, ?c)`,
    conclusion: `wolog:Code16KCarrier(?c) ^ wolog:carrierRole(?c, "${WOLOG_CARRIER_ROLES.CODE16K_RECORD_STACK}")`,
    description: "Code16K carriers define ordered stacked records for interchange",
  },
  {
    id: "wolog:rule:cell-count-symmetry",
    label: "Symmetry from cell count",
    condition: `wolog:Polyform(?p) ^ wolog:hasCellCount(?p, ?n) ^ External(rifbld:greaterThan(?n, 1))`,
    conclusion: `wolog:hasSymmetryGroup(?p, "C1")`,
    description: "All polyforms with more than 1 cell have at least C1 symmetry",
  },
  {
    id: "wolog:rule:serializable-implies-persistent",
    label: "Serializable implies persistent",
    condition: `wolog:AztecCarrier(?a)`,
    conclusion: `wolog:persistent(?a, "true"^^xsd:boolean)`,
    description: "Aztec carriers are by definition persistent",
  },
  {
    id: "wolog:rule:transport-implies-mobile",
    label: "Transport implies mobile",
    condition: `wolog:BeeTagCarrier(?b)`,
    conclusion: `wolog:mobile(?b, "true"^^xsd:boolean)`,
    description: "BEEtag carriers are by definition mobile/transportable",
  },
];

export function rifRulesToTurtle(rules: readonly PolyformRule[]): string {
  const lines: string[] = [
    RIF_PREFIXES,
    "",
    "# WOLOG Polyform Inference Rules",
    "# RIF-like rules expressed in Turtle for documentation",
    "",
  ];

  for (const rule of rules) {
    lines.push(`# Rule: ${rule.id}`);
    if (rule.label) lines.push(`# Label: ${rule.label}`);
    if (rule.description) lines.push(`# Description: ${rule.description}`);
    if (rule.examples) {
      for (const ex of rule.examples) {
        lines.push(`# Example: ${ex}`);
      }
    }
    lines.push(`wolog:rule-${rule.id} a wolog:InferenceRule ;`);
    lines.push(`  wolog:ruleCondition """${rule.condition}""" ;`);
    lines.push(`  wolog:ruleConclusion """${rule.conclusion}""" .`);
    lines.push("");
  }

  return lines.join("\n");
}
