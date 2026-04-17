// ============================================================
// WOLOG — OWL Ontology
// Declarative class hierarchy and properties for the WOLOG domain.
// ============================================================

export const WOLOG_ONTOLOGY_PREFIXES = `PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX wolog: <urn:wolog:ontology:>`;

export const WOLOG_ONTOLOGY_TURTLE = `${WOLOG_ONTOLOGY_PREFIXES}

# ====================
# CLASSES
# ====================

# Structural Core
wolog:Polyform a owl:Class ;
  rdfs:label "Polyform" ;
  rdfs:comment "Structural arrangement of lawful cells" .

wolog:BasisFamily a owl:Class ;
  rdfs:label "BasisFamily" ;
  rdfs:comment "Base polyform type (polyomino, polycube, etc.)" .

wolog:DegreeClass a owl:Class ;
  rdfs:label "DegreeClass" ;
  rdfs:comment "Number of cells in a polyform" .

wolog:RankClass a owl:Class ;
  rdfs:label "RankClass" ;
  rdfs:comment "2D/2.5D/3D/nD classification" .

wolog:GroupClass a owl:Class ;
  rdfs:label "GroupClass" ;
  rdfs:comment "Symmetry group classification" .

wolog:NormalizedForm a owl:Class ;
  rdfs:label "NormalizedForm" ;
  rdfs:comment "Canonical form of a polyform" .

# Carrier Classes (Barcode Quartet)
wolog:Carrier a owl:Class ;
  rdfs:label "Carrier" ;
  rdfs:comment "Abstract carrier base class" .

wolog:AztecCarrier a owl:Class ;
  rdfs:subClassOf wolog:Carrier ;
  rdfs:label "AztecCarrier" ;
  rdfs:comment "Serializable sprite - identity and persistence" .

wolog:MaxiCodeCarrier a owl:Class ;
  rdfs:subClassOf wolog:Carrier ;
  rdfs:label "MaxiCodeCarrier" ;
  rdfs:comment "Scene projection - tilemap/voxel/hexel/pixel views" .

wolog:BeeTagCarrier a owl:Class ;
  rdfs:subClassOf wolog:Carrier ;
  rdfs:label "BeeTagCarrier" ;
  rdfs:comment "Transport message - physical/computational transport" .

wolog:Code16KCarrier a owl:Class ;
  rdfs:subClassOf wolog:Carrier ;
  rdfs:label "Code16KCarrier" ;
  rdfs:comment "Record stack carrier - row-oriented stacked message transport" .

# Projection & Instrument
wolog:ProjectionDialect a owl:Class ;
  rdfs:label "ProjectionDialect" ;
  rdfs:comment "Named surface generator" .

wolog:Instrument a owl:Class ;
  rdfs:label "Instrument" ;
  rdfs:comment "Readable transformation surface" .

wolog:SmithChart a owl:Class ;
  rdfs:subClassOf wolog:Instrument ;
  rdfs:comment "Smith chart instrument" .

wolog:GenailleRods a owl:Class ;
  rdfs:subClassOf wolog:Instrument ;
  rdfs:comment "Genaille rods instrument" .

wolog:BinaryGuessSurface a owl:Class ;
  rdfs:subClassOf wolog:Instrument ;
  rdfs:comment "Binary guess surface instrument" .

# Witness & Replay
wolog:Witness a owl:Class ;
  rdfs:label "Witness" ;
  rdfs:comment "Structural evidence from replay" .

wolog:ReplayLog a owl:Class ;
  rdfs:label "ReplayLog" ;
  rdfs:comment "Ordered execution history" .

wolog:ReplayEntry a owl:Class ;
  rdfs:label "ReplayEntry" ;
  rdfs:comment "Single transform applied at one step" .

# Artifact & Descriptors
wolog:Artifact a owl:Class ;
  rdfs:label "Artifact" ;
  rdfs:comment "Encoded or serialized form" .

wolog:TopologyDescriptor a owl:Class ;
  rdfs:label "TopologyDescriptor" ;
  rdfs:comment "Structural topology description" .

wolog:CombinatorialDescriptor a owl:Class ;
  rdfs:label "CombinatorialDescriptor" ;
  rdfs:comment "Combinatorial properties" .

# Virtual Codepoint
wolog:VirtualCodepoint a owl:Class ;
  rdfs:label "VirtualCodepoint" ;
  rdfs:comment "Dual-address 40-bit identity plus symbolic alias" .

wolog:CodepointFamily a owl:Class ;
  rdfs:label "CodepointFamily" ;
  rdfs:comment "Family classification for codepoints" .

# ====================
# OBJECT PROPERTIES
# ====================

# Structural Relations
wolog:hasBasisFamily a owl:ObjectProperty ;
  rdfs:domain wolog:Polyform ;
  rdfs:range wolog:BasisFamily ;
  rdfs:label "has basis family" .

wolog:hasDegreeClass a owl:ObjectProperty ;
  rdfs:domain wolog:Polyform ;
  rdfs:range wolog:DegreeClass ;
  rdfs:label "has degree class" .

wolog:hasRankClass a owl:ObjectProperty ;
  rdfs:domain wolog:Polyform ;
  rdfs:range wolog:RankClass ;
  rdfs:label "has rank class" .

wolog:hasGroupClass a owl:ObjectProperty ;
  rdfs:domain wolog:Polyform ;
  rdfs:range wolog:GroupClass ;
  rdfs:label "has group class" .

wolog:hasCellCount a owl:DatatypeProperty ;
  rdfs:domain wolog:Polyform ;
  rdfs:range xsd:integer ;
  rdfs:label "has cell count" .

# Projection Relations
wolog:projectsTo a owl:ObjectProperty ;
  rdfs:domain wolog:Polyform ;
  rdfs:range wolog:ProjectionDialect ;
  rdfs:label "projects to" .

wolog:hasProjection a owl:ObjectProperty ;
  rdfs:domain wolog:Polyform ;
  rdfs:range wolog:Carrier ;
  rdfs:label "has projection" .

wolog:hasInstrument a owl:ObjectProperty ;
  rdfs:domain wolog:Polyform ;
  rdfs:range wolog:Instrument ;
  rdfs:label "has instrument" .

# Carrier Relations
wolog:carrierRole a owl:DatatypeProperty ;
  rdfs:domain wolog:Carrier ;
  rdfs:range xsd:string ;
  rdfs:label "carrier role" .

wolog:serializableSprite a owl:ObjectProperty ;
  rdfs:subPropertyOf wolog:hasProjection ;
  rdfs:domain wolog:Polyform ;
  rdfs:range wolog:AztecCarrier ;
  rdfs:label "serializable sprite" .

wolog:sceneProjection a owl:ObjectProperty ;
  rdfs:subPropertyOf wolog:hasProjection ;
  rdfs:domain wolog:Polyform ;
  rdfs:range wolog:MaxiCodeCarrier ;
  rdfs:label "scene projection" .

wolog:transportMessage a owl:ObjectProperty ;
  rdfs:subPropertyOf wolog:hasProjection ;
  rdfs:domain wolog:Polyform ;
  rdfs:range wolog:BeeTagCarrier ;
  rdfs:label "transport message" .

wolog:recordStack a owl:ObjectProperty ;
  rdfs:subPropertyOf wolog:hasProjection ;
  rdfs:domain wolog:Polyform ;
  rdfs:range wolog:Code16KCarrier ;
  rdfs:label "record stack" .

# Witness & Replay Relations
wolog:hasWitness a owl:ObjectProperty ;
  rdfs:domain wolog:Polyform ;
  rdfs:range wolog:Witness ;
  rdfs:label "has witness" .

wolog:hasReplayLog a owl:ObjectProperty ;
  rdfs:domain wolog:Polyform ;
  rdfs:range wolog:ReplayLog ;
  rdfs:label "has replay log" .

wolog:hasEntry a owl:ObjectProperty ;
  rdfs:domain wolog:ReplayLog ;
  rdfs:range wolog:ReplayEntry ;
  rdfs:label "has entry" .

wolog:tick a owl:DatatypeProperty ;
  rdfs:domain wolog:ReplayEntry ;
  rdfs:range xsd:integer ;
  rdfs:label "tick" .

wolog:opcode a owl:DatatypeProperty ;
  rdfs:domain wolog:ReplayEntry ;
  rdfs:range xsd:string ;
  rdfs:label "opcode" .

wolog:halted a owl:DatatypeProperty ;
  rdfs:domain wolog:ReplayLog ;
  rdfs:range xsd:boolean ;
  rdfs:label "halted" .

# Normalization Relations
wolog:normalizedAs a owl:ObjectProperty ;
  rdfs:domain wolog:Polyform ;
  rdfs:range wolog:NormalizedForm ;
  rdfs:label "normalized as" .

wolog:hasTopologyDescriptor a owl:ObjectProperty ;
  rdfs:domain wolog:Polyform ;
  rdfs:range wolog:TopologyDescriptor ;
  rdfs:label "has topology descriptor" .

wolog:hasCombinatorialDescriptor a owl:ObjectProperty ;
  rdfs:domain wolog:Polyform ;
  rdfs:range wolog:CombinatorialDescriptor ;
  rdfs:label "has combinatorial descriptor" .

# Codepoint Relations
wolog:hasCodepoint a owl:ObjectProperty ;
  rdfs:domain wolog:Carrier ;
  rdfs:range wolog:VirtualCodepoint ;
  rdfs:label "has codepoint" .

wolog:codepointFamily a owl:ObjectProperty ;
  rdfs:domain wolog:VirtualCodepoint ;
  rdfs:range wolog:CodepointFamily ;
  rdfs:label "codepoint family" .

wolog:packed40 a owl:DatatypeProperty ;
  rdfs:domain wolog:VirtualCodepoint ;
  rdfs:range xsd:hexBinary ;
  rdfs:label "packed 40-bit value" .

wolog:codepointAlias a owl:DatatypeProperty ;
  rdfs:domain wolog:VirtualCodepoint ;
  rdfs:range xsd:string ;
  rdfs:label "codepoint alias" .

# ====================
# CARDINALITY CONSTRAINTS
# ====================

# Each polyform has exactly one basis family
wolog:Polyform wolog:hasBasisFamily [
  a owl:Restriction ;
  owl:onProperty wolog:hasBasisFamily ;
  owl:cardinality 1 ;
] .

# Each carrier has exactly one role
wolog:Carrier wolog:carrierRole [
  a owl:Restriction ;
  owl:onProperty wolog:carrierRole ;
  owl:cardinality 1 ;
] .

# ====================
# DISJOINT CLASSES
# ====================

wolog:AztecCarrier owl:disjointWith wolog:MaxiCodeCarrier .
wolog:AztecCarrier owl:disjointWith wolog:BeeTagCarrier .
wolog:AztecCarrier owl:disjointWith wolog:Code16KCarrier .
wolog:MaxiCodeCarrier owl:disjointWith wolog:BeeTagCarrier .
wolog:MaxiCodeCarrier owl:disjointWith wolog:Code16KCarrier .
wolog:BeeTagCarrier owl:disjointWith wolog:Code16KCarrier .

wolog:SmithChart owl:disjointWith wolog:GenailleRods .
wolog:SmithChart owl:disjointWith wolog:BinaryGuessSurface .
wolog:GenailleRods owl:disjointWith wolog:BinaryGuessSurface .`;

export const CARRIER_ONTOLOGY_TURTLE = `# Barcode Quartet OWL Ontology
# Aztec = Serializable Sprite (identity, persistence)
# MaxiCode = Scene Projection (tilemap, voxel, hexel, pixel)
# BEEtag = Transport Message (physical/computational)
# Code16K = Record Stack (row-stacked message transport)

wolog:AztecCarrier a owl:Class ;
  rdfs:subClassOf wolog:Carrier ;
  rdfs:comment "Serializable sprite - defines what it IS" ;
  owl:equivalentClass [
    a owl:Class ;
    owl:intersectionOf (
      wolog:Carrier
      [ a owl:Restriction ; owl:onProperty wolog:carrierRole ; owl:hasValue "serializable-sprite" ]
    )
  ] .

wolog:MaxiCodeCarrier a owl:Class ;
  rdfs:subClassOf wolog:Carrier ;
  rdfs:comment "Scene projection - defines how it APPEARS" ;
  owl:equivalentClass [
    a owl:Class ;
    owl:intersectionOf (
      wolog:Carrier
      [ a owl:Restriction ; owl:onProperty wolog:carrierRole ; owl:hasValue "scene-projection" ]
    )
  ] .

wolog:BeeTagCarrier a owl:Class ;
  rdfs:subClassOf wolog:Carrier ;
  rdfs:comment "Transport message - defines how it MOVES" ;
  owl:equivalentClass [
    a owl:Class ;
    owl:intersectionOf (
      wolog:Carrier
      [ a owl:Restriction ; owl:onProperty wolog:carrierRole ; owl:hasValue "transport-message" ]
    )
  ] .

wolog:Code16KCarrier a owl:Class ;
  rdfs:subClassOf wolog:Carrier ;
  rdfs:comment "Record stack - defines row-stacked message transport" ;
  owl:equivalentClass [
    a owl:Class ;
    owl:intersectionOf (
      wolog:Carrier
      [ a owl:Restriction ; owl:onProperty wolog:carrierRole ; owl:hasValue "record-stack" ]
    )
  ] .

# Carrier role vocabulary
wolog:serializableSpriteRole a owl:NamedIndividual ;
  rdfs:label "serializable-sprite" .

wolog:sceneProjectionRole a owl:NamedIndividual ;
  rdfs:label "scene-projection" .

wolog:transportMessageRole a owl:NamedIndividual ;
  rdfs:label "transport-message" .

wolog:recordStackRole a owl:NamedIndividual ;
  rdfs:label "record-stack" .`;

export type WOLOGClass =
  | "Polyform"
  | "BasisFamily"
  | "DegreeClass"
  | "RankClass"
  | "GroupClass"
  | "NormalizedForm"
  | "Carrier"
  | "AztecCarrier"
  | "MaxiCodeCarrier"
  | "BeeTagCarrier"
  | "Code16KCarrier"
  | "ProjectionDialect"
  | "Instrument"
  | "SmithChart"
  | "GenailleRods"
  | "BinaryGuessSurface"
  | "Witness"
  | "ReplayLog"
  | "ReplayEntry"
  | "Artifact"
  | "TopologyDescriptor"
  | "CombinatorialDescriptor"
  | "VirtualCodepoint"
  | "CodepointFamily";

export type WOLOGObjectProperty =
  | "hasBasisFamily"
  | "hasDegreeClass"
  | "hasRankClass"
  | "hasGroupClass"
  | "hasCellCount"
  | "projectsTo"
  | "hasProjection"
  | "hasInstrument"
  | "carrierRole"
  | "serializableSprite"
  | "sceneProjection"
  | "transportMessage"
  | "recordStack"
  | "hasWitness"
  | "hasReplayLog"
  | "hasEntry"
  | "tick"
  | "opcode"
  | "halted"
  | "normalizedAs"
  | "hasTopologyDescriptor"
  | "hasCombinatorialDescriptor"
  | "hasCodepoint"
  | "codepointFamily"
  | "packed40"
  | "codepointAlias";

export const WOLOG_CLASS_HIERARCHY: Record<string, string[]> = {
  Carrier: ["AztecCarrier", "MaxiCodeCarrier", "BeeTagCarrier", "Code16KCarrier"],
  Instrument: ["SmithChart", "GenailleRods", "BinaryGuessSurface"],
  Polyform: [],
};

export const WOLOG_CARRIER_ROLES = {
  AZTEC_SPRITE: "serializable-sprite",
  MAXI_PROJECTION: "scene-projection",
  BEE_TRANSPORT: "transport-message",
  CODE16K_RECORD_STACK: "record-stack",
} as const;

export type WOLOGCarrierRole =
  | (typeof WOLOG_CARRIER_ROLES)[keyof typeof WOLOG_CARRIER_ROLES];
