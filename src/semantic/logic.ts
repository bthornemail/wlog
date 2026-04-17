// ============================================================
// WOLOG — Logic and Proof Layer
// Inference engine basics and proof verification for polyforms.
// ============================================================

import type { TurtleTriple } from "./semantic-web.js";
import type { SkosConcept } from "./skos.js";

export const LOGIC_PREFIXES = `PREFIX log: <http://www.w3.org/2000/10/swap/log#>
PREFIX math: <http://www.w3.org/2000/10/swap/math#>
PREFIX str: <http://www.w3.org/2000/10/swap/string#>
PREFIX list: <http://www.w3.org/2000/10/swap/list#>
PREFIX wolog: <urn:wolog:ontology:>
PREFIX wprop: <urn:wolog:property:>`;

export type LogicalOperator = "And" | "Or" | "Not" | "Implies" | "Equiv";

export interface Literal {
  readonly type: "URI" | "Literal" | "Variable";
  readonly value: string;
  readonly datatype: string | undefined;
  readonly language: string | undefined;
}

export interface AtomicFormula {
  readonly type: "Atomic";
  readonly predicate: string;
  readonly terms: readonly Literal[];
}

export interface CompoundFormula {
  readonly type: "Compound";
  readonly operator: LogicalOperator;
  readonly operands: readonly Formula[];
}

export type Formula = AtomicFormula | CompoundFormula;

export interface Rule {
  readonly id: string;
  readonly antecedent: Formula;
  readonly consequent: Formula;
}

export interface ProofStep {
  readonly step: number;
  readonly conclusion: Formula;
  readonly rule?: string;
  readonly premises: readonly number[];
  readonly justification?: string;
}

export interface Proof {
  readonly id: string;
  readonly query: Formula;
  readonly steps: readonly ProofStep[];
  readonly conclusion: boolean;
  readonly timestamp: string;
}

export interface InferenceResult {
  readonly provable: boolean;
  readonly proof?: Proof;
  readonly bindings: readonly Record<string, Literal>[];
  readonly errors: readonly string[];
}

export interface PolyformBinding {
  readonly variable: string;
  readonly polyform: string;
  readonly family?: string;
  readonly degree?: number;
  readonly properties?: readonly string[];
}

export interface Constraint {
  readonly id: string;
  readonly variable: string;
  readonly predicate: string;
  readonly value: Literal;
  readonly optional?: boolean;
}

export interface Query {
  readonly head: readonly Literal[];
  readonly body: readonly AtomicFormula[];
  readonly constraints?: readonly Constraint[];
}

export function uri(value: string): Literal {
  return { type: "URI", value, datatype: undefined, language: undefined };
}

export function literal(value: string, datatype?: string): Literal {
  return { type: "Literal", value, datatype: datatype ?? undefined, language: undefined };
}

export function variable(name: string): Literal {
  return { type: "Variable", value: name.startsWith("?") ? name : `?${name}`, datatype: undefined, language: undefined };
}

export function atomic(predicate: string, ...terms: readonly Literal[]): AtomicFormula {
  return { type: "Atomic", predicate, terms };
}

export function and(...operands: readonly Formula[]): CompoundFormula {
  return { type: "Compound", operator: "And", operands };
}

export function or(...operands: readonly Formula[]): CompoundFormula {
  return { type: "Compound", operator: "Or", operands };
}

export function not(operand: Formula): CompoundFormula {
  return { type: "Compound", operator: "Not", operands: [operand] };
}

export function implies(antecedent: Formula, consequent: Formula): CompoundFormula {
  return { type: "Compound", operator: "Implies", operands: [antecedent, consequent] };
}

export function rule(antecedent: Formula, consequent: Formula, id?: string): Rule {
  return { id: id ?? `rule-${Date.now()}`, antecedent, consequent };
}

export function formatFormula(f: Formula): string {
  if (f.type === "Atomic") {
    const terms = f.terms.map((t) => {
      switch (t.type) {
        case "URI": return `<${t.value}>`;
        case "Literal": return `"${t.value}"${t.datatype ? `^^${t.datatype}` : t.language ? `@${t.language}` : ""}`;
        case "Variable": return t.value;
      }
    }).join(" ");
    return `${f.predicate}(${terms})`;
  }

  const ops = f.operands.map(formatFormula);
  switch (f.operator) {
    case "And": return `And(${ops.join(" ")})`;
    case "Or": return `Or(${ops.join(" ")})`;
    case "Not": return `Not(${ops.join(" ")})`;
    case "Implies": return `Implies(${ops[0]} => ${ops[1]})`;
    case "Equiv": return `Equiv(${ops.join(" <=> ")})`;
  }
}

export function formulaToTriples(f: Formula, subject: string): TurtleTriple[] {
  const triples: TurtleTriple[] = [];

  if (f.type === "Atomic") {
    triples.push({
      subject,
      predicate: "log:predicate",
      object: `"${f.predicate}"`,
    });
    f.terms.forEach((term, index) => {
      triples.push({
        subject,
        predicate: `log:term${index}`,
        object: term.type === "URI" ? `<${term.value}>` : `"${term.value}"`,
      });
    });
  } else {
    triples.push({
      subject,
      predicate: "log:operator",
      object: `"${f.operator}"`,
    });
    f.operands.forEach((op, index) => {
      triples.push(...formulaToTriples(op, `${subject}/operand${index}`));
    });
  }

  return triples;
}

export function matchAtomic(
  pattern: AtomicFormula,
  fact: AtomicFormula,
  bindings: Record<string, Literal>,
): Record<string, Literal> | null {
  if (pattern.predicate !== fact.predicate) return null;
  if (pattern.terms.length !== fact.terms.length) return null;

  const newBindings = { ...bindings };

  for (let i = 0; i < pattern.terms.length; i++) {
    const pTerm = pattern.terms[i]!;
    const fTerm = fact.terms[i]!;

    if (pTerm.type === "Variable") {
      const existing = newBindings[pTerm.value];
      if (existing !== undefined) {
        if (existing.value !== fTerm.value) return null;
      } else {
        newBindings[pTerm.value] = fTerm;
      }
    } else {
      if (pTerm.value !== fTerm.value) return null;
    }
  }

  return newBindings;
}

export function evaluateFormula(
  f: Formula,
  facts: readonly AtomicFormula[],
  bindings: Record<string, Literal> = {},
): InferenceResult {
  if (f.type === "Atomic") {
    const boundTerms = f.terms.map((t): Literal => {
      if (t.type === "Variable" && bindings[t.value]) {
        return bindings[t.value]!;
      }
      return t;
    });

    const matchFact = atomic(f.predicate, ...boundTerms);
    const match = facts.find((fact) => matchAtomic(matchFact, fact, {}) !== null);

    return {
      provable: match !== undefined,
      bindings: match ? [{}] : [],
      errors: [],
    };
  }

  switch (f.operator) {
    case "And":
      for (const op of f.operands) {
        const result = evaluateFormula(op, facts, bindings);
        if (!result.provable) return result;
      }
      return { provable: true, bindings: [{}], errors: [] };

    case "Or":
      for (const op of f.operands) {
        const result = evaluateFormula(op, facts, bindings);
        if (result.provable) return result;
      }
      return { provable: false, bindings: [], errors: [] };

    case "Not":
      const inner = evaluateFormula(f.operands[0]!, facts, bindings);
      return { provable: !inner.provable, bindings: inner.bindings, errors: [] };

    case "Implies":
      return evaluateFormula(f.operands[0]!, facts, bindings);

    default:
      return { provable: false, bindings: [], errors: ["Unknown operator"] };
  }
}

export function applyRule(
  r: Rule,
  facts: readonly AtomicFormula[],
): InferenceResult {
  const result = evaluateFormula(r.antecedent, facts);

  if (!result.provable) {
    return result;
  }

  const step: ProofStep = {
    step: 0,
    conclusion: r.consequent,
    rule: r.id,
    premises: [],
    justification: "Rule applied",
  };

  const proof: Proof = {
    id: `proof-${Date.now()}`,
    query: r.antecedent,
    steps: [step],
    conclusion: true,
    timestamp: new Date().toISOString(),
  };

  return { provable: true, proof, bindings: result.bindings, errors: [] };
}

export function prove(
  query: Formula,
  rules: readonly Rule[],
  facts: readonly AtomicFormula[],
): InferenceResult {
  let currentFacts = [...facts];

  for (const r of rules) {
    const result = applyRule(r, currentFacts);
    if (result.provable) {
      currentFacts.push({
        type: "Atomic",
        predicate: "derived",
        terms: [],
      });
    }
  }

  return evaluateFormula(query, currentFacts);
}

export function polyformQuery(
  polyform: string,
  family?: string,
  degree?: number,
): Query {
  const head = [variable("result")];
  const body: AtomicFormula[] = [
    atomic("wolog:Polyform", variable("result")),
  ];

  if (family) {
    body.push(atomic("wolog:hasBasisFamily", variable("result"), uri(family)));
  }

  if (degree !== undefined) {
    body.push(atomic("wolog:hasCellCount", variable("result"), literal(String(degree))));
  }

  return { head, body };
}

export function carrierQuery(
  polyform: string,
  role: "serializable-sprite" | "scene-projection" | "transport-message" | "record-stack",
): Query {
  const head = [variable("carrier")];
  const body: AtomicFormula[] = [
    atomic("wolog:Polyform", uri(polyform)),
    atomic("wolog:hasProjection", uri(polyform), variable("carrier")),
    atomic("wolog:carrierRole", variable("carrier"), literal(role)),
  ];

  return { head, body };
}

export function conceptQuery(conceptScheme: string): Query {
  const head = [variable("concept"), variable("label")];
  const body: AtomicFormula[] = [
    atomic("skos:Concept", variable("concept")),
    atomic("skos:inScheme", variable("concept"), uri(conceptScheme)),
    atomic("skos:prefLabel", variable("concept"), variable("label")),
  ];

  return { head, body };
}

export function formatQuery(q: Query): string {
  const formatLit = (l: Literal): string => {
    switch (l.type) {
      case "URI": return `<${l.value}>`;
      case "Literal": return `"${l.value}"${l.datatype ? `^^${l.datatype}` : l.language ? `@${l.language}` : ""}`;
      case "Variable": return l.value;
    }
  };
  const headStr = q.head.map(formatLit).join(" ");
  const bodyStr = q.body.map(formatFormula).join(" ^ ");
  return `${headStr} :- ${bodyStr} .`;
}

export function queryToTriples(q: Query, subject: string): TurtleTriple[] {
  const triples: TurtleTriple[] = [];

  q.head.forEach((lit, index) => {
    triples.push({
      subject,
      predicate: `log:select${index}`,
      object: lit.type === "URI" ? `<${lit.value}>` : lit.value,
    });
  });

  q.body.forEach((atom, index) => {
    triples.push(...formulaToTriples(atom, `${subject}/body${index}`));
  });

  return triples;
}

export const POLYFORM_LOGIC_RULES: Rule[] = [
  rule(
    and(atomic("wolog:Polyform", variable("p")), atomic("wolog:hasBasisFamily", variable("p"), variable("f"))),
    atomic("wolog:BasisFamily", variable("p")),
  ),
  rule(
    and(atomic("wolog:Polyform", variable("p")), atomic("wolog:hasCellCount", variable("p"), variable("n"))),
    atomic("wolog:DegreeClass", variable("p")),
  ),
  rule(
    and(atomic("wolog:Polyform", variable("p")), atomic("wolog:hasProjection", variable("p"), variable("c"))),
    atomic("wolog:Carrier", variable("c")),
  ),
  rule(
    and(atomic("wolog:Polyform", variable("p")), atomic("wolog:serializableSprite", variable("p"), variable("a"))),
    atomic("wolog:AztecCarrier", variable("a")),
  ),
  rule(
    and(atomic("wolog:Polyform", variable("p")), atomic("wolog:sceneProjection", variable("p"), variable("m"))),
    atomic("wolog:MaxiCodeCarrier", variable("m")),
  ),
  rule(
    and(atomic("wolog:Polyform", variable("p")), atomic("wolog:transportMessage", variable("p"), variable("b"))),
    atomic("wolog:BeeTagCarrier", variable("b")),
  ),
];

export const SEMANTIC_INFERENCE_RULES: Rule[] = [
  rule(
    atomic("skos:Concept", variable("c")),
    atomic("rdf:type", variable("c"), uri("http://www.w3.org/2000/01/rdf-schema#Resource")),
  ),
  rule(
    and(atomic("skos:broader", variable("c1"), variable("c2")), atomic("skos:narrower", variable("c2"), variable("c1"))),
    atomic("log:implies", variable("c1"), variable("c2")),
  ),
  rule(
    and(atomic("skos:exactMatch", variable("c1"), variable("c2"))),
    atomic("owl:sameAs", variable("c1"), variable("c2")),
  ),
];

export function deriveProperties(polyform: string, facts: readonly AtomicFormula[]): {
  readonly family: string | undefined;
  readonly degree: number | undefined;
  readonly carriers: readonly string[];
} {
  let family: string | undefined;
  let degree: number | undefined;
  const carriers: string[] = [];

  for (const fact of facts) {
    if (fact.predicate === "wolog:hasBasisFamily" && fact.terms[0]?.value === polyform) {
      family = fact.terms[1]?.value;
    }
    if (fact.predicate === "wolog:hasCellCount" && fact.terms[0]?.value === polyform) {
      degree = parseInt(fact.terms[1]?.value ?? "0", 10);
    }
    if (fact.predicate === "wolog:hasProjection" && fact.terms[0]?.value === polyform) {
      carriers.push(fact.terms[1]?.value ?? "");
    }
  }

  return { family, degree, carriers };
}

export function verifyProof(proof: Proof, rules: readonly Rule[], facts: readonly AtomicFormula[]): {
  readonly valid: boolean;
  readonly errors: readonly string[];
} {
  const errors: string[] = [];
  let allValid = true;

  for (const step of proof.steps) {
    if (step.rule) {
      const rule = rules.find((r) => r.id === step.rule);
      if (!rule) {
        errors.push(`Step ${step.step}: Unknown rule ${step.rule}`);
        allValid = false;
        continue;
      }

      const premises = step.premises.map((p) => proof.steps[p]?.conclusion).filter(Boolean) as Formula[];
      if (premises.length > 0) {
        const antecedentMatches = evaluateFormula(rule.antecedent, premises as AtomicFormula[]);
        if (!antecedentMatches.provable) {
          errors.push(`Step ${step.step}: Rule premises not satisfied`);
          allValid = false;
        }
      }
    }

    const conclusionMatches = evaluateFormula(step.conclusion, facts);
    if (!conclusionMatches.provable && proof.steps.indexOf(step) < proof.steps.length - 1) {
      errors.push(`Step ${step.step}: Conclusion not derivable from facts`);
      allValid = false;
    }
  }

  return { valid: allValid, errors };
}
