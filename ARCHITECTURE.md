# WOLOG Architecture Specification

**Version:** 1.0  
**Status:** FOUNDATIONAL  
**Last Updated:** 2026-04-16

---

## Table of Contents

1. [Invariant Core](#1-invariant-core)
2. [Three Structural Axes](#2-three-structural-axes)
3. [Normalized Stack](#3-normalized-stack)
4. [Glossary Schema](#4-glossary-schema)
5. [Semantic Overlay Pipeline](#5-semantic-overlay-pipeline)
6. [N-ary Relation Pattern](#6-n-ary-relation-pattern)
7. [Frozen Vocabulary](#7-frozen-vocabulary)
8. [URI Scheme](#8-uri-scheme)
9. [Omicron Timing Model](#9-omicron-timing-model)

---

## 1. Invariant Core

The following survived all research iterations:

```
canonical state
→ lawful transform  
→ deterministic replay
→ address / classify
→ project into a surface
→ optionally encode / transport / scan
```

### Constitutional Test

> What can be removed while the same canonical unfold / replay / projection still results?

That is the correct filter for any new component.

### What IS the Core

- **distinction** — presence/absence, mark/boundary
- **state** — the addressable thing
- **transition** — step function
- **ordering** — τ₇ (Fano), τ₆₀ (Sonar), τ₄₂₀ (Omicron)
- **addressing** — codepoint, index, coordinate
- **classification** — family, degree, group, symmetry
- **replay** — deterministic reconstruction
- **projection** — surface generation

### What is NOT the Core (Surfaces/Helpers)

- Unicode itself
- Aztec itself
- Smith chart itself
- Genaille rods themselves
- braille itself
- dominoes themselves
- WordNet itself

These are surfaces, instruments, or carriers—not the kernel.

---

## 2. Three Structural Axes

These were frequently mixed, causing confusion.

### A. Structural Axis

**Question:** What kind of object is this?

- bit pattern
- cell set
- graph
- stream
- polynomial class
- resource tree
- witness

### B. Instrument Axis

**Question:** How do I read or operate it?

- slide rule
- Smith chart
- Genaille rods
- semi-log graph
- binary guess grid
- reticle / gnomon / graticule

### C. Carrier Axis

**Question:** How is it stored or transported?

- Unicode codepoints
- ABI bytes
- SVG
- Aztec-like matrix
- FIFO / IPC
- browser worker / shared buffer

---

## 3. Normalized Stack

### Layer 0: Distinction

Presence/absence, mark/boundary, empty/non-empty.

### Layer Ω: Generative Mathematics

Mixed radix, gnomon growth, simplex counts, barycentric coordinates, polyhedral schedules, logarithmic/exponential transforms.

### Canonical Kernel

| Concept | Definition |
|---------|------------|
| State | Addressable configuration |
| Step | Lawful transform function |
| Replay | Deterministic reconstruction |
| Normalize | Canonical form derivation |
| Identity | Structural equivalence |
| Address | Unique reference |

### Classification Layer

| Concept | Definition |
|---------|------------|
| Glossary | Typed semantic index |
| Taxonomy | Hierarchical classification |
| WordNet synsets | Lexical neighborhoods |
| Dewey-like banding | Duodecimal index ranges |
| Polynomial descriptors | Combinatorial tags |
| Symmetry classes | Group-theoretic categories |

### Instrument Layer

| Instrument | Purpose |
|------------|---------|
| Smith_chart_gen | Coordinate transformation |
| Genaille_division_rods | Path-following arithmetic |
| Binary_guess_surface | Subset/mask revelation |
| Semi_log_duodecimal_classifier | Classification navigation |
| Reticle_overlay | Reference grid |

### Projection Layer

- SVG
- 2.5D sprites
- 3D scene
- scan artifact

### Transport/Envelope

- ABI bit packing
- Reed-Solomon ECC
- Aztec-like spiral
- Center40 deterministic matrix

### Bitwise Aztec Embeddings

For polyform transport, Aztec is a downstream carrier, never the source of truth.

Canonical flow:

```
typed graph / replay law
→ HALT-terminated bitwise bytecode
→ XOR open/close envelope
→ trace log
→ matrix / SVG / viewer surface
```

Frozen transport rule:
- do not store polyform order/length as a separate field
- encode structure through replay using only `SHL`, `SHR`, `ROL`, `ROR`, `FLIP`, `XOR`, `HALT`
- recover the field by replay, not by trusting a rendered surface

This keeps the representation aligned with WOLOG:

```
bytes → replay → structure → witness → projection
```

---

## 4. Glossary Schema

Each term is a structured object with these fields:

```json
{
  "term": "polyomino",
  "canonical_form": "polynomial plane figure",
  "aliases": ["polyominoes", "polyomino form"],
  "synset_ids": ["106835851", "106839722"],
  "kind": "basis_family",
  "layer": "structural",
  "definition": "plane figure formed from edge-connected equal squares",
  "invariants": ["degree = number of cells"],
  "operators": ["rotate", "reflect", "normalize", "tile"],
  "related_terms": ["octomino", "polycube", "polyiamond"],
  "projection_surfaces": ["svg", "sprite25d", "mesh3d"],
  "transport_forms": ["svg", "abi_bits"],
  "status": "frozen"
}
```

### Field Definitions

| Field | Type | Description |
|-------|------|-------------|
| term | string | Canonical name |
| canonical_form | string | Normalized description |
| aliases | string[] | Known variants |
| synset_ids | string[] | WordNet synset references |
| kind | enum | basis_family, instrument_surface, control_operator, etc. |
| layer | enum | structural, projection, carrier, generative |
| definition | string | Human-readable definition |
| invariants | string[] | Structural constraints |
| operators | string[] | Applicable operations |
| related_terms | string[] | Linked glossary entries |
| projection_surfaces | string[] | Valid output formats |
| transport_forms | string[] | Valid encoding formats |
| status | enum | frozen, experimental, deprecated |

---

## 5. Semantic Overlay Pipeline

### 5.1 Unicode (Symbol Surface)

```
Codepoint → Symbol → Block Reference
```

Stable identifiers, block partitions, glyph projection.

### 5.2 URI Model (Identity Surface)

Everything important needs a URI:

```
urn:wolog:term:polyomino
urn:wolog:projection:smith-chart
urn:wolog:artifact:center40
urn:wolog:relation:projectsTo
urn:wolog:synset:100001740
urn:wolog:codepoint:U+001B
```

### 5.3 OWL (Type System)

Declarative class hierarchy:

```ttl
@prefix wolog: <http://wolog.org/ontology/> .

wolog:Poliform a owl:Class .
wolog:BasisFamily a owl:Class .
wolog:DegreeClass a owl:Class .
wolog:RankClass a owl:Class .
wolog:GroupClass a owl:Class .
wolog:ProjectionDialect a owl:Class .
wolog:Witness a owl:Class .
wolog:Artifact a owl:Class .
wolog:TopologyDescriptor a owl:Class .
wolog:CombinatorialDescriptor a owl:Class .

wolog:hasBasisFamily a owl:ObjectProperty .
wolog:hasDegreeClass a owl:ObjectProperty .
wolog:hasRankClass a owl:ObjectProperty .
wolog:hasGroupClass a owl:ObjectProperty .
wolog:hasProjectionDialect a owl:ObjectProperty .
wolog:hasWitness a owl:ObjectProperty .
wolog:hasTopologyDescriptor a owl:ObjectProperty .
wolog:hasCombinatorialDescriptor a owl:ObjectProperty .
wolog:projectsTo a owl:ObjectProperty .
wolog:normalizedAs a owl:ObjectProperty .
```

### 5.4 RIF (Rule Layer)

Operational inference:

```rif
if wolog:Artifact(?a) and wolog:hasBasisFamily(?a, wolog:Polyomino)
   and wolog:hasDegreeClass(?a, wolog:Octomino)
then wolog:hasCellCount(?a, "8"^^xsd:integer)
```

### 5.5 RDF (Graph Surface)

Instance data as triples.

### 5.6 SHACL (Validation)

```shacl
wolog:PoliformShape a sh:NodeShape ;
  sh:targetClass wolog:Poliform ;
  sh:property [
    sh:path wolog:hasBasisFamily ;
    sh:minCount 1 ;
    sh:maxCount 1
  ] .
```

For bitwise Aztec embeddings, SHACL Core validates the carrier boundary:

```shacl
wolog:AztecEmbeddingShape a sh:NodeShape ;
  sh:targetClass wolog:AztecEmbedding ;
  sh:property [
    sh:path wolog:embeddingHex ;
    sh:datatype xsd:hexBinary
  ] ;
  sh:property [
    sh:path wolog:encodingMode ;
    sh:hasValue "bitwise-only"
  ] ;
  sh:property [
    sh:path wolog:termination ;
    sh:hasValue "HALT"
  ] .
```

The runtime trace remains the executable witness:

```json
{
  "pc": 1,
  "opcode": "ROL",
  "before": "0x0000000000000001",
  "after": "0x0000000000000008",
  "witness": "0x0000000000000480"
}
```

### 5.7 SPARQL (Query Layer)

```sparql
SELECT ?artifact ?projection ?topology
WHERE {
  ?artifact wolog:hasDegreeClass wolog:Octomino .
  ?artifact wolog:projectsTo ?projection .
  ?projection wolog:hasTopologyDescriptor ?topology .
}
```

---

## 6. N-ary Relation Pattern

Per W3C Note on N-ary Relations: introduce a class for the relation.

### Anti-Pattern (Don't Do)

```ttl
synsetA wolog:relatedTo synsetB 
         wolog:withDistance 2 
         wolog:withBasis barycentric
```

### Pattern (Do This)

```ttl
:LexicalEmbedding_1 a wolog:BarycentricEmbedding ;
  wolog:hasSourceSynset :synsetA ;
  wolog:hasTargetSynset :synsetB ;
  wolog:hasOperator :hyp ;
  wolog:hasStepDistance 2 ;
  wolog:hasCoordinate "(1,0,2)" ;
  wolog:hasProjectionMode :OmicronStep .
```

---

## 7. Frozen Vocabulary

### Nouns

| Term | Layer | Definition |
|------|-------|------------|
| poliform | structural | General plane figure family |
| basis family | structural | Base polyform type (polyomino, polycube, etc.) |
| degree/order | structural | Number of cells |
| rank | structural | 2D / 2.5D / 3D / nD |
| group | structural | Symmetry group class |
| normalization | structural | Canonical form derivation |
| canonical id | structural | Unique structural identifier |
| center word | transport | 40-bit deterministic header |
| witness | structural | Structural evidence |
| projection dialect | projection | Named surface generator |
| instrument surface | projection | Readable transformation |
| transport envelope | carrier | Encoding specification |

### Operators

| Term | Definition |
|------|-------------|
| normalize | Derive canonical form |
| project | Generate surface |
| encode | Transform to carrier |
| classify | Assign taxonomy |
| witness | Record evidence |
| replay | Deterministic reconstruction |
| compose | Combine transformations |
| transform | Apply operation |
| address | Assign reference |

### Projection Dialects

| Dialect | Purpose |
|---------|---------|
| Smith_chart_gen | Impedance-like navigation |
| Genaille_division_rods | Path-following arithmetic |
| Binary_guess_surface | Bit-wise classification |
| Semi_log_duodecimal_classifier | Classification navigation |
| Reticle_overlay | Reference grid |

---

## 8. URI Scheme

### Namespace

```
urn:wolog:
```

### Registered Prefixes

| Prefix | Expansion |
|--------|-----------|
| term | urn:wolog:term: |
| projection | urn:wolog:projection: |
| artifact | urn:wolog:artifact: |
| relation | urn:wolog:relation: |
| synset | urn:wolog:synset: |
| codepoint | urn:wolog:codepoint: |
| class | urn:wolog:class: |
| property | urn:wolog:property: |

### Examples

```
urn:wolog:term:polyomino
urn:wolog:projection:smith-chart
urn:wolog:artifact:center40
urn:wolog:codepoint:U+001B
urn:wolog:synset:100001740
urn:wolog:relation:projectsTo
```

---

## 9. Omicron Timing Model

### Constants

| Symbol | Value | Derivation |
|--------|-------|------------|
| τ₇ | 7 | Fano plane period |
| τ₆₀ | 60 | Sonar period (4×15) |
| τ₄₂₀ | 420 | Omicron period (LCM 7,60) |
| MASTER | 5040 | 7! (Master period) |

### Relationships

```
LCM(7, 60) = 420        # Omicron alignment
5040 / 420 = 12        # Omicron events per master
5040 / 60 = 84         # Sonar sweeps per master
5040 / 7 = 720         # Fano cycles per master
```

### BOM/Endian as Chirality

| BOM | Mode | Operation |
|-----|------|-----------|
| U+FEFF | Forward | Two's complement |
| U+FFFE | Inverted | One's complement |

**Rule:** BOM/endian selects serialization chirality. Traversal chirality is an explicit algorithm parameter, not implied by BOM alone.

---

## Appendix: WordNet Integration

### Prolog Files

| File | Content |
|------|---------|
| wn_s.pl | Synsets (sense + gloss) |
| wn_hyp.pl | Hypernym relations |
| wn_sim.pl | Similarity relations |
| wn_der.pl | Derivation relations |
| wn_mm.pl | Meronym relations |
| wn_mp.pl | Morphological relations |
| wn_cls.pl | Classification relations |

### Synset Format

```prolog
s(synset_id, lex_id, word, pos, sense_count, sense_key).
```

Example:
```prolog
s(100001740,1,'entity',n,1,11).
```

### Lexical Graph Operators

- `s` — synset
- `g` — gloss
- `hyp` — hypernym (is-a)
- `sim` — similar to
- `mm` — meronym (has-part)
- `mp` — member meronym
- `der` — derived from
- `cls` — classification

---

## Appendix: Barycentric Coordinates

Following John Wallis's Mathesis Universalis notation:

```
...d‴c‴b‴a°a′b′c′d′...
         ↑
    unit marker (×1)
```

Left of °: multiplied by higher 60-powers  
Right of °: divided by lower 60-powers  
° marker: multiplied by 1

### URI Pattern for Coordinates

```
urn:wolog:coord:barycentric:{synset}:{operator}:{distance}
```

Example:
```
urn:wolog:coord:barycentric:100001740:hyp:2
```

---

## Status

**FROZEN** — These definitions are stable and subject to change control.

---

*This document is the memory you were missing.*
