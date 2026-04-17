// ============================================================
// WOLOG — SPARQL Query Builder
// Lightweight SPARQL helpers for polyforms, carriers, and traces.
// ============================================================

import type { TurtleTriple } from "./semantic-web.js";
import type {
  AztecCarrier,
  MaxiCodeCarrier,
  BeeTagCarrier,
  Code16KCarrier,
  VirtualCodepoint,
} from "../carriers/aztec-slide-rule.js";

export const WOLOG_SPARQL_PREFIXES = `PREFIX wolog: <urn:wolog:property:>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX sh: <http://www.w3.org/ns/shacl#>`;

export interface SparqlVariable {
  readonly var: string;
}

export interface SparqlFilter {
  readonly expression: string;
}

export interface SparqlOrderBy {
  readonly variable: string;
  readonly direction: "ASC" | "DESC";
}

export interface SparqlSelectQuery {
  readonly type: "SELECT";
  readonly distinct: boolean;
  readonly variables: readonly (string | SparqlVariable)[];
  readonly where: readonly (SparqlTriplePattern | SparqlFilter)[];
  readonly orderBy: readonly SparqlOrderBy[];
  readonly limit: number | undefined;
  readonly offset: number | undefined;
}

export interface SparqlTriplePattern {
  readonly subject: string;
  readonly predicate: string;
  readonly object: string;
}

export interface SparqlConstructQuery {
  readonly type: "CONSTRUCT";
  readonly template: readonly TurtleTriple[];
  readonly where: readonly (SparqlTriplePattern | SparqlFilter)[];
}

export type SparqlQuery = SparqlSelectQuery | SparqlConstructQuery;

export function spqVar(name: string): SparqlVariable {
  return { var: name };
}

export function triple(
  subject: string,
  predicate: string,
  object: string,
): SparqlTriplePattern {
  return { subject, predicate, object };
}

export function filter(expression: string): SparqlFilter {
  return { expression };
}

export function select(
  variables: readonly (string | SparqlVariable)[],
  where: readonly (SparqlTriplePattern | SparqlFilter)[],
  options?: {
    readonly distinct?: boolean;
    readonly orderBy?: readonly SparqlOrderBy[];
    readonly limit?: number;
    readonly offset?: number;
  },
): SparqlSelectQuery {
  return {
    type: "SELECT",
    distinct: options?.distinct ?? false,
    variables,
    where,
    orderBy: options?.orderBy ?? ([] as readonly SparqlOrderBy[]),
    limit: options?.limit,
    offset: options?.offset,
  };
}

export function construct(
  template: readonly TurtleTriple[],
  where: readonly (SparqlTriplePattern | SparqlFilter)[],
): SparqlConstructQuery {
  return { type: "CONSTRUCT", template, where };
}

function escapeSparqlString(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function formatVariable(v: string | SparqlVariable): string {
  return typeof v === "string" ? v : `?${v.var}`;
}

function formatTriple(t: SparqlTriplePattern): string {
  return `${t.subject} ${t.predicate} ${t.object} .`;
}

function formatFilter(f: SparqlFilter): string {
  return `FILTER(${f.expression})`;
}

export function toSparqlString(query: SparqlQuery): string {
  const lines: string[] = [WOLOG_SPARQL_PREFIXES, ""];

  if (query.type === "SELECT") {
    const vars = query.variables.map(formatVariable).join(" ");
    const distinct = query.distinct ? "DISTINCT " : "";
    lines.push(`SELECT ${distinct}${vars} {`);

    for (const pattern of query.where) {
      if ("expression" in pattern) {
        lines.push(`  ${formatFilter(pattern)}`);
      } else {
        lines.push(`  ${formatTriple(pattern)}`);
      }
    }

    lines.push("}");

    if (query.orderBy) {
      const orders = query.orderBy
        .map((o) => `${o.direction}(?${o.variable})`)
        .join(" ");
      lines.push(`ORDER BY ${orders}`);
    }

    if (query.limit !== undefined) {
      lines.push(`LIMIT ${query.limit}`);
    }

    if (query.offset !== undefined) {
      lines.push(`OFFSET ${query.offset}`);
    }
  } else {
    lines.push("CONSTRUCT {");
    for (const t of query.template) {
      lines.push(`  ${t.subject} ${t.predicate} ${t.object} .`);
    }
    lines.push("} WHERE {");
    for (const pattern of query.where) {
      if ("expression" in pattern) {
        lines.push(`  ${formatFilter(pattern)}`);
      } else {
        lines.push(`  ${formatTriple(pattern)}`);
      }
    }
    lines.push("}");
  }

  return lines.join("\n");
}

export function uri(value: string): string {
  if (value.startsWith("<") || value.startsWith("urn:") || value.startsWith("http://") || value.startsWith("https://")) {
    return `<${value}>`;
  }
  return value;
}

export function literal(value: string | number | boolean, datatype?: string): string {
  if (typeof value === "boolean") {
    return `"${value}"^^xsd:boolean`;
  }
  if (typeof value === "number") {
    return `"${value}"^^xsd:integer`;
  }
  if (datatype) {
    return `"${escapeSparqlString(value)}"^^xsd:${datatype}`;
  }
  return `"${escapeSparqlString(value)}"`;
}

export function langLiteral(value: string, lang: string): string {
  return `"${escapeSparqlString(value)}"@${lang}`;
}

export function orderAsc(variable: string): SparqlOrderBy {
  return { variable, direction: "ASC" };
}

export function orderDesc(variable: string): SparqlOrderBy {
  return { variable, direction: "DESC" };
}

export const CARRIER_QUERIES = {
  findAllCarriers: select(
    ["?carrier", "?role", "?codepoint"],
    [
      triple("?carrier", "a", "?type"),
      filter("CONTAINS(STR(?type), 'Carrier')"),
      triple("?carrier", "wolog:carrierRole", "?role"),
      triple("?carrier", "wolog:codepointAlias", "?codepoint"),
    ],
  ),

  findAztecCarriers: select(
    ["?carrier", "?witness", "?layers"],
    [
      triple("?carrier", "a", "wolog:AztecCarrier"),
      triple("?carrier", "wolog:manifestWitness", "?witness"),
      triple("?carrier", "wolog:layers", "?layers"),
    ],
    { orderBy: [orderAsc("layers")] },
  ),

  findMaxiCodeCarriers: select(
    ["?carrier", "?mode", "?ecc"],
    [
      triple("?carrier", "a", "wolog:MaxiCodeCarrier"),
      triple("?carrier", "wolog:mode", "?mode"),
      triple("?carrier", "wolog:errorCorrectionLevel", "?ecc"),
    ],
  ),

  findBeeTagCarriers: select(
    ["?carrier", "?identity", "?valid"],
    [
      triple("?carrier", "a", "wolog:BeeTagCarrier"),
      triple("?carrier", "wolog:identity15", "?identity"),
      triple("?carrier", "wolog:orientationValid", "?valid"),
    ],
  ),

  findCode16KCarriers: select(
    ["?carrier", "?mode", "?rows"],
    [
      triple("?carrier", "a", "wolog:Code16KCarrier"),
      triple("?carrier", "wolog:mode", "?mode"),
      triple("?carrier", "wolog:rows", "?rows"),
    ],
  ),

  findCarriersByFamily: (family: string) =>
    select(
      ["?carrier", "?role"],
      [
        triple("?carrier", "a", "?type"),
        filter("CONTAINS(STR(?type), 'Carrier')"),
        triple("?carrier", "wolog:family", literal(family)),
        triple("?carrier", "wolog:carrierRole", "?role"),
      ],
    ),

  findCarriersByRole: (role: "serializable-sprite" | "scene-projection" | "transport-message" | "record-stack") =>
    select(
      ["?carrier", "?codepoint"],
      [
        triple("?carrier", "a", "?type"),
        filter("CONTAINS(STR(?type), 'Carrier')"),
        triple("?carrier", "wolog:carrierRole", literal(role)),
        triple("?carrier", "wolog:codepointAlias", "?codepoint"),
      ],
    ),

  countCarriersByType: select(
    ["?type", "COUNT(?carrier) as ?count"],
    [
      triple("?carrier", "a", "?type"),
      filter("CONTAINS(STR(?type), 'Carrier')"),
    ],
    { distinct: true },
  ),
};

export const POLYFORM_QUERIES = {
  findAllPolyforms: select(
    ["?polyform", "?degree"],
    [
      triple("?polyform", "a", "wolog:Polyform"),
      triple("?polyform", "wolog:degree", "?degree"),
    ],
    { orderBy: [orderAsc("degree")] },
  ),

  findPolyformsByFamily: (family: string) =>
    select(
      ["?polyform", "?witness"],
      [
        triple("?polyform", "a", "wolog:Polyform"),
        triple("?polyform", "wolog:basisFamily", literal(family)),
        triple("?polyform", "wolog:manifestWitness", "?witness"),
      ],
    ),

  findReplays: select(
    ["?polyform", "?tick", "?op", "?witness"],
    [
      triple("?polyform", "a", "wolog:Polyform"),
      triple("?replay", "wolog:polyform", "?polyform"),
      triple("?replay", "wolog:tick", "?tick"),
      triple("?replay", "wolog:opcode", "?op"),
      triple("?replay", "wolog:witness", "?witness"),
    ],
    { orderBy: [orderAsc("tick")] },
  ),

  findHaltedReplays: select(
    ["?replay", "?finalWitness"],
    [
      triple("?replay", "a", "wolog:ReplayLog"),
      triple("?replay", "wolog:halted", literal("true", "boolean")),
      triple("?replay", "wolog:finalWitness", "?finalWitness"),
    ],
  ),
};

export const VIRTUAL_CODEPOINT_QUERIES = {
  findCodepointsByFamily: (family: string) =>
    select(
      ["?codepoint", "?alias", "?packed40"],
      [
        triple("?codepoint", "a", "wolog:VirtualCodepoint"),
        triple("?codepoint", "wolog:family", literal(family)),
        triple("?codepoint", "wolog:codepointAlias", "?alias"),
        triple("?codepoint", "wolog:packed40", "?packed40"),
      ],
    ),

  findCodepointsByGroup: (group: string) =>
    select(
      ["?codepoint", "?alias"],
      [
        triple("?codepoint", "a", "wolog:VirtualCodepoint"),
        triple("?codepoint", "wolog:group", literal(group)),
        triple("?codepoint", "wolog:codepointAlias", "?alias"),
      ],
    ),

  lookupByAlias: (alias: string) =>
    select(
      ["?codepoint", "?packed40", "?family"],
      [
        triple("?codepoint", "a", "wolog:VirtualCodepoint"),
        triple("?codepoint", "wolog:codepointAlias", literal(alias)),
        triple("?codepoint", "wolog:packed40", "?packed40"),
        triple("?codepoint", "wolog:family", "?family"),
      ],
      { limit: 1 },
    ),
};

export function queryAllCarriers(): string {
  return toSparqlString(CARRIER_QUERIES.findAllCarriers);
}

export function queryCarriersByFamily(family: string): string {
  return toSparqlString(CARRIER_QUERIES.findCarriersByFamily(family));
}

export function queryCarriersByRole(
  role: "serializable-sprite" | "scene-projection" | "transport-message" | "record-stack",
): string {
  return toSparqlString(CARRIER_QUERIES.findCarriersByRole(role));
}

export function queryAztecCarriers(): string {
  return toSparqlString(CARRIER_QUERIES.findAztecCarriers);
}

export function queryMaxiCodeCarriers(): string {
  return toSparqlString(CARRIER_QUERIES.findMaxiCodeCarriers);
}

export function queryBeeTagCarriers(): string {
  return toSparqlString(CARRIER_QUERIES.findBeeTagCarriers);
}

export function queryCode16KCarriers(): string {
  return toSparqlString(CARRIER_QUERIES.findCode16KCarriers);
}

export function queryCarrierCounts(): string {
  return toSparqlString(CARRIER_QUERIES.countCarriersByType);
}

export function queryPolyformsByFamily(family: string): string {
  return toSparqlString(POLYFORM_QUERIES.findPolyformsByFamily(family));
}

export function queryReplays(): string {
  return toSparqlString(POLYFORM_QUERIES.findReplays);
}

export function queryCodepointsByFamily(family: string): string {
  return toSparqlString(VIRTUAL_CODEPOINT_QUERIES.findCodepointsByFamily(family));
}

export function queryCodepointByAlias(alias: string): string {
  return toSparqlString(VIRTUAL_CODEPOINT_QUERIES.lookupByAlias(alias));
}
