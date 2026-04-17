// ============================================================
// WOLOG — RDF Resources
// Real-world entities identified by URIs and described via carriers.
// ============================================================

import type { TurtleTriple } from "./semantic-web.js";
import type {
  AztecCarrier,
  MaxiCodeCarrier,
  BeeTagCarrier,
  Code16KCarrier,
  VirtualCodepoint,
} from "./aztec-slide-rule.js";
import { WOLOG_CARRIER_ROLES } from "./ontology.js";

export const WOLOG_RESOURCE_PREFIXES = `PREFIX wolog: <urn:wolog:ontology:>
PREFIX wres: <urn:wolog:resource:>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX time: <http://www.w3.org/2006/time#>
PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>`;

export const RESOURCE_NAMESPACES = {
  RESOURCE: "urn:wolog:resource:",
  ONTOLOGY: "urn:wolog:ontology:",
  PROPERTY: "urn:wolog:property:",
  CARRIER: "urn:wolog:carrier:",
} as const;

export type ResourceKind =
  | "PhysicalObject"
  | "DigitalArtifact"
  | "Scene"
  | "TransformEvent"
  | "WitnessReceipt"
  | "SceneProjection";

export interface ResourceMetadata {
  readonly createdAt: string;
  readonly modifiedAt: string | undefined;
  readonly version: number | undefined;
  readonly provenance: string | undefined;
  readonly description: string | undefined;
  readonly label: string | undefined;
}

export interface ResourceIdentity {
  readonly uri: string;
  readonly kind: ResourceKind;
  readonly codepoint?: VirtualCodepoint;
  readonly primaryCarrier?: AztecCarrier | MaxiCodeCarrier | BeeTagCarrier | Code16KCarrier;
}

export interface PhysicalObjectResource extends ResourceIdentity {
  readonly kind: "PhysicalObject";
  readonly barcodeIdentity: AztecCarrier;
  readonly sceneProjections: readonly MaxiCodeCarrier[];
  readonly transportMessages: readonly BeeTagCarrier[];
  readonly recordStacks: readonly Code16KCarrier[];
  readonly metadata: ResourceMetadata;
  readonly location: GeoLocation | undefined;
}

export interface DigitalArtifactResource extends ResourceIdentity {
  readonly kind: "DigitalArtifact";
  readonly payloadCarrier: BeeTagCarrier;
  readonly associatedObjects: readonly string[];
  readonly metadata: ResourceMetadata;
  readonly format: string | undefined;
}

export interface SceneResource extends ResourceIdentity {
  readonly kind: "Scene";
  readonly memberResources: readonly string[];
  readonly sceneProjection: MaxiCodeCarrier;
  readonly bounds: SceneBounds | undefined;
  readonly metadata: ResourceMetadata;
}

export interface TransformEventResource extends ResourceIdentity {
  readonly kind: "TransformEvent";
  readonly subjectResource: string;
  readonly transformType: string;
  readonly beforeState: string | undefined;
  readonly afterState: string | undefined;
  readonly timestamp: string;
  readonly metadata: ResourceMetadata;
}

export interface WitnessReceiptResource extends ResourceIdentity {
  readonly kind: "WitnessReceipt";
  readonly witnessHash: string;
  readonly polyformUri: string;
  readonly replayLogUri: string;
  readonly issuedAt: string;
  readonly issuer: string | undefined;
  readonly metadata: ResourceMetadata;
}

export interface SceneProjectionResource extends ResourceIdentity {
  readonly kind: "SceneProjection";
  readonly projectionType: "tilemap" | "voxel" | "hexel" | "pixel";
  readonly sourceResource: string;
  readonly projectionCarrier: MaxiCodeCarrier;
  readonly metadata: ResourceMetadata;
}

export interface GeoLocation {
  readonly latitude: number;
  readonly longitude: number;
  readonly altitude?: number;
  readonly precision?: number;
}

export interface SceneBounds {
  readonly minX: number;
  readonly minY: number;
  readonly maxX: number;
  readonly maxY: number;
}

export type WOLOGResource =
  | PhysicalObjectResource
  | DigitalArtifactResource
  | SceneResource
  | TransformEventResource
  | WitnessReceiptResource
  | SceneProjectionResource;

export function generateResourceUri(
  kind: ResourceKind,
  identifier: string,
): string {
  const normalizedId = identifier.replace(/[^a-zA-Z0-9_-]/g, "_");
  return `${RESOURCE_NAMESPACES.RESOURCE}${kind.toLowerCase()}/${normalizedId}`;
}

export function generateCarrierUri(carrier: AztecCarrier | MaxiCodeCarrier | BeeTagCarrier | Code16KCarrier): string {
  switch (carrier.kind) {
    case "AztecCarrier":
      return `${RESOURCE_NAMESPACES.CARRIER}aztec:${carrier.manifestWitness}`;
    case "MaxiCodeCarrier":
      return `${RESOURCE_NAMESPACES.CARRIER}maxi:${carrier.codepoint.symbolic.alias}:mode${carrier.mode}`;
    case "BeeTagCarrier":
      return `${RESOURCE_NAMESPACES.CARRIER}bee:${carrier.identity15}`;
    case "Code16KCarrier":
      return `${RESOURCE_NAMESPACES.CARRIER}code16k:${carrier.codepoint.symbolic.alias}:m${carrier.mode}:r${carrier.rows}`;
  }
}

export function createPhysicalObject(
  barcodeIdentity: AztecCarrier,
  sceneProjections: readonly MaxiCodeCarrier[],
  transportMessages: readonly BeeTagCarrier[],
  recordStacks: readonly Code16KCarrier[],
  options?: {
    readonly label?: string;
    readonly description?: string;
    readonly provenance?: string;
    readonly location?: GeoLocation;
  },
): PhysicalObjectResource {
  const uri = generateResourceUri("PhysicalObject", barcodeIdentity.manifestWitness);
  const now = new Date().toISOString();

  return {
    kind: "PhysicalObject",
    uri,
    codepoint: barcodeIdentity.codepoint,
    primaryCarrier: barcodeIdentity,
    barcodeIdentity,
    sceneProjections: [...sceneProjections],
    transportMessages: [...transportMessages],
    recordStacks: [...recordStacks],
    metadata: {
      createdAt: now,
      modifiedAt: undefined,
      version: undefined,
      provenance: options?.provenance,
      description: options?.description,
      label: options?.label,
    },
    location: options?.location ?? undefined,
  };
}

export function createDigitalArtifact(
  payloadCarrier: BeeTagCarrier,
  associatedObjects?: readonly string[],
  options?: {
    readonly label?: string;
    readonly description?: string;
    readonly format?: string;
    readonly provenance?: string;
  },
): DigitalArtifactResource {
  const uri = generateResourceUri("DigitalArtifact", `bee_${payloadCarrier.identity15}`);
  const now = new Date().toISOString();

  return {
    kind: "DigitalArtifact",
    uri,
    codepoint: payloadCarrier.codepoint,
    primaryCarrier: payloadCarrier,
    payloadCarrier,
    associatedObjects: associatedObjects ? [...associatedObjects] : [],
    metadata: {
      createdAt: now,
      modifiedAt: undefined,
      version: undefined,
      provenance: options?.provenance,
      description: options?.description,
      label: options?.label,
    },
    format: options?.format,
  };
}

export function createScene(
  memberResources: readonly string[],
  sceneProjection: MaxiCodeCarrier,
  options?: {
    readonly label?: string;
    readonly description?: string;
    readonly provenance?: string;
    readonly bounds?: SceneBounds;
  },
): SceneResource {
  const sceneId = `scene_${sceneProjection.codepoint.symbolic.alias}_${Date.now()}`;
  const uri = generateResourceUri("Scene", sceneId);
  const now = new Date().toISOString();

  return {
    kind: "Scene",
    uri,
    codepoint: sceneProjection.codepoint,
    primaryCarrier: sceneProjection,
    memberResources: [...memberResources],
    sceneProjection,
    bounds: options?.bounds,
    metadata: {
      createdAt: now,
      modifiedAt: undefined,
      version: undefined,
      provenance: options?.provenance,
      description: options?.description,
      label: options?.label,
    },
  };
}

export function createTransformEvent(
  subjectResource: string,
  transformType: string,
  options?: {
    readonly beforeState?: string;
    readonly afterState?: string;
    readonly timestamp?: string;
    readonly label?: string;
    readonly provenance?: string;
  },
): TransformEventResource {
  const eventId = `evt_${transformType}_${Date.now()}`;
  const uri = generateResourceUri("TransformEvent", eventId);
  const timestamp = options?.timestamp ?? new Date().toISOString();

  return {
    kind: "TransformEvent",
    uri,
    subjectResource,
    transformType,
    beforeState: options?.beforeState,
    afterState: options?.afterState,
    timestamp,
    metadata: {
      createdAt: timestamp,
      modifiedAt: undefined,
      version: undefined,
      provenance: options?.provenance,
      description: undefined,
      label: options?.label ?? transformType,
    },
  };
}

export function createWitnessReceipt(
  witnessHash: string,
  polyformUri: string,
  options?: {
    readonly replayLogUri?: string;
    readonly issuedAt?: string;
    readonly issuer?: string;
    readonly label?: string;
    readonly provenance?: string;
  },
): WitnessReceiptResource {
  const receiptId = `receipt_${witnessHash.slice(0, 16)}_${Date.now()}`;
  const uri = generateResourceUri("WitnessReceipt", receiptId);
  const issuedAt = options?.issuedAt ?? new Date().toISOString();

  return {
    kind: "WitnessReceipt",
    uri,
    witnessHash,
    polyformUri,
    replayLogUri: options?.replayLogUri ?? "",
    issuedAt,
    issuer: options?.issuer,
    metadata: {
      createdAt: issuedAt,
      modifiedAt: undefined,
      version: undefined,
      provenance: options?.provenance,
      description: undefined,
      label: options?.label ?? "Witness Receipt",
    },
  };
}

export function createSceneProjection(
  sourceResource: string,
  projectionCarrier: MaxiCodeCarrier,
  projectionType: "tilemap" | "voxel" | "hexel" | "pixel",
  options?: {
    readonly label?: string;
    readonly description?: string;
    readonly provenance?: string;
  },
): SceneProjectionResource {
  const projId = `proj_${projectionType}_${projectionCarrier.codepoint.symbolic.alias}`;
  const uri = generateResourceUri("SceneProjection", projId);
  const now = new Date().toISOString();

  return {
    kind: "SceneProjection",
    uri,
    codepoint: projectionCarrier.codepoint,
    primaryCarrier: projectionCarrier,
    projectionType,
    sourceResource,
    projectionCarrier,
    metadata: {
      createdAt: now,
      modifiedAt: undefined,
      version: undefined,
      provenance: options?.provenance,
      description: options?.description,
      label: options?.label ?? `${projectionType} projection`,
    },
  };
}

export function resourceTriples(resource: WOLOGResource): TurtleTriple[] {
  const triples: TurtleTriple[] = [];
  const subject = resource.uri;

  triples.push(
    { subject, predicate: "a", object: `wolog:${resource.kind}` },
    { subject, predicate: "dcterms:identifier", object: `"${resource.uri}"` },
    { subject, predicate: "dcterms:created", object: `"${resource.metadata.createdAt}"^^xsd:dateTime` },
  );

  if (resource.metadata.label) {
    triples.push({ subject, predicate: "dcterms:title", object: `"${resource.metadata.label}"` });
  }

  if (resource.metadata.description) {
    triples.push({ subject, predicate: "dcterms:description", object: `"${resource.metadata.description}"` });
  }

  if (resource.metadata.provenance) {
    triples.push({ subject, predicate: "dcterms:provenance", object: `"${resource.metadata.provenance}"` });
  }

  if (resource.codepoint) {
    triples.push({ subject, predicate: "wolog:hasCodepoint", object: `<${RESOURCE_NAMESPACES.CARRIER}codepoint:${resource.codepoint.symbolic.alias}>` });
  }

  switch (resource.kind) {
    case "PhysicalObject":
      triples.push(
        { subject, predicate: "wolog:hasBarcodeIdentity", object: `<${generateCarrierUri(resource.barcodeIdentity)}>` },
        { subject, predicate: "wolog:hasTransportMessage", object: resource.transportMessages.map((m) => `<${generateCarrierUri(m)}>`).join(" ") },
        { subject, predicate: "wolog:hasRecordStack", object: resource.recordStacks.map((m) => `<${generateCarrierUri(m)}>`).join(" ") },
      );
      if (resource.location) {
        triples.push(
          { subject, predicate: "geo:lat", object: `"${resource.location.latitude}"^^xsd:decimal` },
          { subject, predicate: "geo:long", object: `"${resource.location.longitude}"^^xsd:decimal` },
        );
      }
      break;

    case "DigitalArtifact":
      triples.push({ subject, predicate: "wolog:hasPayload", object: `<${generateCarrierUri(resource.payloadCarrier)}>` });
      if (resource.format) {
        triples.push({ subject, predicate: "dcterms:format", object: `"${resource.format}"` });
      }
      break;

    case "Scene":
      triples.push(
        { subject, predicate: "wolog:hasSceneProjection", object: `<${generateCarrierUri(resource.sceneProjection)}>` },
        { subject, predicate: "wolog:hasMember", object: resource.memberResources.map((r) => `<${r}>`).join(" ") },
      );
      break;

    case "TransformEvent":
      triples.push(
        { subject, predicate: "wolog:transforms", object: `<${resource.subjectResource}>` },
        { subject, predicate: "wolog:transformType", object: `"${resource.transformType}"` },
        { subject, predicate: "prov:occurredAtTime", object: `"${resource.timestamp}"^^xsd:dateTime` },
      );
      break;

    case "WitnessReceipt":
      triples.push(
        { subject, predicate: "wolog:hasWitness", object: `"${resource.witnessHash}"^^xsd:hexBinary` },
        { subject, predicate: "wolog:certifies", object: `<${resource.polyformUri}>` },
        { subject, predicate: "prov:generatedAtTime", object: `"${resource.issuedAt}"^^xsd:dateTime` },
      );
      if (resource.issuer) {
        triples.push({ subject, predicate: "prov:wasGeneratedBy", object: `"${resource.issuer}"` });
      }
      break;

    case "SceneProjection":
      triples.push(
        { subject, predicate: "wolog:projectsFrom", object: `<${resource.sourceResource}>` },
        { subject, predicate: "wolog:projectionType", object: `"${resource.projectionType}"` },
        { subject, predicate: "wolog:hasProjectionCarrier", object: `<${generateCarrierUri(resource.projectionCarrier)}>` },
      );
      break;
  }

  return triples;
}

export function serializeResource(resource: WOLOGResource): string {
  const lines: string[] = [
    WOLOG_RESOURCE_PREFIXES,
    "",
    `# ${resource.kind}: ${resource.uri}`,
    "",
  ];

  for (const triple of resourceTriples(resource)) {
    if (Array.isArray(triple.object)) {
      for (const obj of triple.object) {
        lines.push(`${triple.subject} ${triple.predicate} ${obj} .`);
      }
    } else {
      lines.push(`${triple.subject} ${triple.predicate} ${triple.object} .`);
    }
  }

  return lines.join("\n");
}

export function serializeResources(resources: readonly WOLOGResource[]): string {
  return resources.map(serializeResource).join("\n\n");
}

export function getResourceSummary(resource: WOLOGResource): {
  readonly uri: string;
  readonly kind: ResourceKind;
  readonly label: string;
  readonly carriers: number;
} {
  return {
    uri: resource.uri,
    kind: resource.kind,
    label: resource.metadata.label ?? resource.uri,
    carriers: resource.primaryCarrier ? 1 : 0,
  };
}

export const RESOURCE_QUERIES = {
  findAllResources: (type?: ResourceKind) => ({
    type: "SELECT" as const,
    distinct: true as const,
    variables: ["?resource", "?kind", "?created"],
    where: type
      ? [
          { subject: "?resource", predicate: "a", object: `wolog:${type}` },
          { subject: "?resource", predicate: "a", object: "?kind" },
          { subject: "?resource", predicate: "dcterms:created", object: "?created" },
        ]
      : [
          { subject: "?resource", predicate: "a", object: "?kind" },
          { subject: "?resource", predicate: "dcterms:created", object: "?created" },
        ],
    orderBy: [{ variable: "created", direction: "DESC" as const }],
  }),

  findResourcesByKind: (kind: ResourceKind) => ({
    variables: ["?resource", "?label"],
    where: [
      { subject: "?resource", predicate: "a", object: `wolog:${kind}` },
      { subject: "?resource", predicate: "dcterms:title", object: "?label" },
    ],
  }),

  findResourcesWithCarrier: (carrierUri: string) => ({
    variables: ["?resource", "?kind"],
    where: [
      { subject: "?resource", predicate: "a", object: "?kind" },
      { subject: "?resource", predicate: "wolog:hasCodepoint", object: `<${carrierUri}>` },
    ],
  }),

  findPhysicalObjects: () => ({
    variables: ["?object", "?barcode", "?location"],
    where: [
      { subject: "?object", predicate: "a", object: "wolog:PhysicalObject" },
      { subject: "?object", predicate: "wolog:hasBarcodeIdentity", object: "?barcode" },
      { subject: "?object", predicate: "geo:lat", object: "?lat" },
      { subject: "?object", predicate: "geo:long", object: "?long" },
    ],
  }),

  findScenes: () => ({
    variables: ["?scene", "?label", "?memberCount"],
    where: [
      { subject: "?scene", predicate: "a", object: "wolog:Scene" },
      { subject: "?scene", predicate: "dcterms:title", object: "?label" },
      { subject: "?scene", predicate: "wolog:hasMember", object: "?member" },
    ],
  }),

  findTransformEvents: () => ({
    variables: ["?event", "?subject", "?transformType", "?timestamp"],
    where: [
      { subject: "?event", predicate: "a", object: "wolog:TransformEvent" },
      { subject: "?event", predicate: "wolog:transforms", object: "?subject" },
      { subject: "?event", predicate: "wolog:transformType", object: "?transformType" },
      { subject: "?event", predicate: "prov:occurredAtTime", object: "?timestamp" },
    ],
    orderBy: [{ variable: "timestamp", direction: "DESC" as const }],
  }),

  findWitnessReceipts: () => ({
    variables: ["?receipt", "?witness", "?polyform", "?issued"],
    where: [
      { subject: "?receipt", predicate: "a", object: "wolog:WitnessReceipt" },
      { subject: "?receipt", predicate: "wolog:hasWitness", object: "?witness" },
      { subject: "?receipt", predicate: "wolog:certifies", object: "?polyform" },
      { subject: "?receipt", predicate: "prov:generatedAtTime", object: "?issued" },
    ],
  }),
};
