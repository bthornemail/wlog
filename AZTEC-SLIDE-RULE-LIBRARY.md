# Aztec Slide Rule Library

This document defines the WOLOG library layer for virtual codepoint basis
algebra, instrument builders, and barcode carriers.

The library is spec-first. It freezes public concepts and deterministic
projection rules before committing to a large runtime or editor surface.

## 1. Architectural Law

```text
virtual codepoint space
-> basis-cell algebra
-> functional tag pointers
-> instrument builders
-> barcode carriers
-> SVG / 2.5D / 3D projections
```

The basis cell is primary. Barcode carriers are projections of the same object
model, not the ontology itself.

## 2. Core Algebra

The library freezes these public concepts:

- `BasisFamily`
- `BasisCell`
- `PolynomialClass`
- `SampleKind`
- `VirtualCodepoint`
- `PackedCodepoint40`
- `SymbolicCodepoint`
- `FunctionalTagPointer`
- `Instrument`
- `Carrier`
- `Projection`

### 2.1 Basis Families

The basis-family layer declares:

- `Squares`
- `Cubes`
- `Triangles`
- `Hexagons`
- `RightTriangles`
- `Rhombs`
- `MultiRhombs`
- `Octagons`
- `Rounds`
- `Bends`
- `Hops`
- `GoldenTriangles`

For v1, complete SVG projection rules are required for:

- `Squares`
- `Triangles`
- `Hexagons`

All remaining families are type-complete but may be projection-incomplete.

### 2.2 Polynomial and Sample Law

Polynomial identity is metadata law, not primary identity.

It is recorded as:

- `degree`
- `properties`

Sample kinds are:

- `resel`
- `pixel`
- `texel`
- `voxel`
- `tixel`
- `hogel`

## 3. Dual-Address Virtual Codepoint

Every canonical identity has two equivalent views:

- packed `40-bit` binary identity
- symbolic alias

### 3.1 Packed Identity

The 40-bit identity supports two first-class projections:

- `5×8` octets
- `8×5` grouped cells

They are not separate identities. They are two packings of the same value.

### 3.2 Symbolic Alias

The symbolic alias is normalized as:

```text
family.group.vXX.dYY.fZZ
```

Where:

- `family` is the basis family
- `group` is one of `basis`, `instrument`, `carrier`, `projection`, `sample`, `meta`
- `vXX` is the 8-bit variant in hex
- `dYY` is the 8-bit decorator slot in hex
- `fZZ` is the 8-bit flag field in hex

The packed identity is canonical for transport. The symbolic alias is canonical
for readability. Both must roundtrip through the same `VirtualCodepoint`.

### 3.3 Stable Field Meaning

The v1 field meaning is:

- octet 0 = family code
- octet 1 = group code
- octet 2 = variant
- octet 3 = decorator
- octet 4 = flags

Reserved flag bits include:

- `svgReady`
- `declaredOnly`
- `reserved25D`
- `reserved3D`

## 4. Basis Cells and Coordinates

`BasisCell` is the canonical unit object:

```ts
interface BasisCell {
  codepoint: VirtualCodepoint;
  family: BasisFamily;
  sampleKind: SampleKind;
  polynomialClass: PolynomialClass;
  orientation: number;
  coords: BasisCoords;
  projectionStatus: "svg-ready" | "declared" | "stub";
}
```

Coordinate forms in v1:

- `square` -> `{ x, y }`
- `triangle` -> `{ q, r, s }`
- `hex` -> `{ q, r }`
- `cube` -> `{ x, y, z }`
- `generic` -> fallback vector for declared-only families

## 5. Instrument Builders

Instruments are pure geometric readouts over typed basis/state.

Initial instruments:

- `SmithChart`
- `GenailleRods`
- `BinaryGuessSurface`

### 5.1 Smith Chart

Role:

- projective/coordinatized transform surface

Input:

- normalized resistance
- normalized reactance

Output:

- deterministic SVG artifact containing chart geometry and marked point

### 5.2 Genaille Rods

Role:

- path-following carry/remainder automaton surface

Input:

- dividend
- divisor

Output:

- deterministic SVG artifact with rod columns and transition path

### 5.3 Binary Guess Surface

Role:

- subset / mask / bit-plane classifier surface

Input:

- selected bit masks
- optional bit width

Output:

- deterministic SVG artifact showing card basis and resolved value

## 6. Barcode Quartet

The library includes four coordinated carriers forming a compact polyform transport pipeline:

```
Polyform Kernel (basis-cell layout)
  ├─ AZTEC   → Serializable Sprite (identity/persistence)
  ├─ MAXI    → Scene Projection (tilemap, voxel, hexel, pixel views)
  ├─ BEE     → Physical/Computational Transport (print/scan or wire)
  └─ CODE16K → Stacked Record Message (ordered row-stack interchange)
```

| Carrier | Role | Purpose |
|---------|------|---------|
| Aztec | **Serializable Sprite** | Identity, persistence, the "what it IS" |
| MaxiCode | **Scene Modifiers** | Tilemap/voxel/hexel/pixel projection, the "how it APPEARS" |
| BEEtag | **Messages** | Physical (print/scan) or computational transport, the "how it MOVES" |
| Code16K | **Record Stacks** | Ordered stacked-record messaging, the "how it ORDERS exchange" |

### 6.1 Aztec Carrier — Serializable Sprite

Compact serialized polyform kernel.

Use as:

- dense manifest carrier
- witness carrier
- replay-friendly aggregate carrier
- **identity boundary** for polyform data

Rules:

- the Aztec carrier is never the source of truth
- layer and mode metadata are projection behavior, not ontology

### 6.2 MaxiCode Carrier — Scene Projection

View modifiers for placing sprites in scenes.

Use as:

- **tilemap projection** — 2D grid placement
- **voxel projection** — 3D volumetric placement
- **hexel projection** — hexagonal grid placement
- **pixel projection** — raster display

Grounding constraints (ISO/IEC 16023):

- fixed 1-inch square matrix
- 884 hexagonal modules (33 rows, alternating 30/29)
- central bullseye finder pattern
- 6-bit codewords (0-63)
- modes 2-6: Structured Carrier Message (SCM) formats
- Reed-Solomon error correction (SEC/EEC)

Modes:

- **Mode 2**: SCM with numeric postal code (US domestic)
- **Mode 3**: SCM with alphanumeric postal code (international)
- **Mode 4**: Unformatted ASCII with Standard EC
- **Mode 5**: Unformatted ASCII with Enhanced EC
- **Mode 6**: Reader programming

### 6.3 BEEtag Carrier — Transport Message

Carries payload physically or computationally, using the published BEEtag
structure.

Use as:

- **physical transport** — print and scan
- **computational transport** — wire transmission

Grounding constraints (PLoS ONE BEEtag paper):

- `25-bit` payload matrix (`5x5`)
- identity in `1..32767` encoded as `15-bit` value
- identity bits reoriented using the reference implementation into a `3x5`
  identity matrix (`reshape(bits, 5, 3)'` in MATLAB terms)
- `5-bit` parity check:
  - first 3 bits: parity of each identity row
  - next 2 bits: parity of identity columns `1..3` and `4..5`
- `10-bit` error field = `5-bit` check followed by its reverse
- orientation validity = exactly one of the four rotations passes check
- usable-code filtering mirrors the published MATLAB workflow:
  greedy acceptance with minimum Hamming distance `>= 3` against previously
  accepted codes and their rotations
- robust-code mode (`>= 7`) remains reserved for later export tooling

The library implements strict orientation/error derivation and exposes helper
functions for deriving and validating BEEtag identities.

Compatibility mode:

- `authoritative-mat` (default): uses an imported `masterCodeList.mat`
  codebook snapshot (`8148` ids in current upstream file)
- `computed`: uses deterministic in-library regeneration of a d>=3 set
  (`7487` ids with current generation rules)

Public controls:

- `setBeeTagCodebookStrategy("authoritative-mat" | "computed")`
- `getBeeTagCodebookStrategy()`
- `enumerateBeeTagMasterIdentities()`
- `enumerateBeeTagAuthoritativeMasterIdentities()`

### 6.4 Polygonal Carrier — Declaration/Recovery

This carrier is modeled from polygonal optical encoding/recovery workflows.

Use as:

- declaration of polygonal grid geometry
- acquisition-target metadata
- clock/grid recovery pipeline metadata

Grounding constraints (polygonal encoding patent model):

- contiguous polygonal cell arrays (hexagonal grid in v1)
- concentric-ring acquisition target
- orientation via major-axis estimation
- 2D clock recovery pipeline:
  `edge-enhancement -> windowing -> fft-2d -> annular-filter -> ifft-2d -> axis-estimation -> coarse-grid -> decode`

The v1 implementation provides a deep declaration model rather than a full
scanner/decoder. This keeps the ontology clean while preserving standards
shape and recovery semantics.

### 6.5 Code16K Carrier — Stacked Record Message

Code16K is a first-class fourth carrier for ordered row-stack interchange.

Use as:

- stacked record transport for longer structured messages
- row-level scan resilience and delayed reassembly
- concatenated symbol sets for larger records

Metadata surface:

- row stack metadata: `rows`, `symbolsPerRow`, concatenation descriptors
- mode/codeset metadata and shift/fnc context
- check symbol metadata (`check1`, `check2`) and derived witness hash

Conformance surface (API-level):

- row bounds and per-row symbol grouping are validated
- mode metadata is normalized
- check symbol fields are exposed and verifiable
- concatenation metadata supports multi-symbol records

### 6.6 Canonical Reconciliation Contract (Normative)

All carriers share a unified envelope:

```ts
interface CarrierEnvelope {
  codepoint: VirtualCodepoint;
  carrierKind: "AztecCarrier" | "MaxiCodeCarrier" | "BeeTagCarrier" | "Code16KCarrier" | "PolygonalCarrier";
  payloadHash: string;
  witness: string;
  sequenceMeta?: string;
  decodeConfidence: number;
}
```

Deterministic reconcile flow:

1. Decode available carriers.
2. Reconstruct candidate polyform state.
3. Compute canonical polyform hash.
4. Accept or reject carrier claims by canonical hash match.

Normative rule:

- canonical polyform hash is authoritative source of truth
- carrier disagreement never overrides canonical object identity
- The canonical polyform hash is the sole reconciliation authority across all carrier projections; carriers may differ in layout, density, and operational role, but not in canonical identity.

### 6.7 Constitutional Flow

```
Polyform Kernel
  │
  ├─ AZTEC   → Serializable Sprite
  │             "what it IS" (identity, persistence)
  │
  ├─ MAXI    → Scene Projection
  │             "how it APPEARS" (tilemap, voxel, hexel, pixel)
  │
  ├─ BEE     → Message
  │             "how it MOVES" (print/scan or wire)
  │
  └─ CODE16K → Record Stack
                "how it ORDERS exchange" (row stacks / concatenation)
```

Flow direction:
```
kernel → AZTEC (serialize) → MAXI (project to scene) → BEE (transport) → CODE16K (stacked records)
```

The Aztec sprite is compact and storable. Maxi projects it into a scene
(with view modifiers). BEE moves it physically or computationally. Code16K
adds ordered row-stack transport for extended records.

## 7. Public Type Layer

The TypeScript public surface includes:

- `VirtualCodepoint`
- `PackedCodepoint40`
- `SymbolicCodepoint`
- `BasisCell`
- `FunctionalTagPointer`
- `SvgProjection`
- `Scene25DProjection`
- `Volume3DProjection`
- `AztecCarrier` (CLASS)
- `MaxiCodeCarrier` (INTERFACE)
- `BeeTagCarrier` (MESSAGE)
- `Code16KCarrier` (RECORD_STACK)

And builder/helpers for:

- packed/symbolic roundtrip
- basis-cell construction
- neighbor law for squares, triangles, hexes
- SVG projection
- instrument SVG builders
- barcode-trinity projections (compatibility)
- barcode-quartet projections (primary)
- carrier-envelope reconciliation by canonical polyform hash

## 8. Worked Example

Representative worked example:

- `VirtualCodepoint`
  - `Hexagons.basis.v2a.d04.f05`
- `BasisCell`
  - `family = Hexagons`
  - `sampleKind = pixel`
  - `polynomialClass = { degree = 2, properties = [Bivariate, Homogeneous] }`
- `SvgProjection`
  - deterministic hex-cell SVG
- `AztecCarrier` (CLASS)
  - manifest witness using the 40-bit packed identity
  - bitwise layout structure
- `MaxiCodeCarrier` (INTERFACE)
  - Mode 3 structured carrier message
  - 6-bit codewords (144 total)
  - Enhanced Reed-Solomon error correction
  - hex-grid protocol specification
- `BeeTagCarrier` (MESSAGE)
  - 15-bit slice + 10-bit parity/error matrix
  - concrete payload
- `Code16KCarrier` (RECORD_STACK)
  - row stack metadata + mode/codeset + check symbol metadata
  - normalized payload + witness

## 9. Acceptance Scenarios

The v1 library must demonstrate:

- symbolic -> packed40 -> `5×8` -> `8×5` -> symbolic roundtrip
- correct neighbor law for squares, triangles, and hexes
- polynomial metadata attached without replacing identity
- deterministic SVG output for basis cells and initial instruments
- one codepoint projecting to all four barcode carriers (CLASS/INTERFACE/MESSAGE/RECORD_STACK)
- same basis identity preserved across carrier changes
- MaxiCode carrier with correct hexagonal module layout
- MaxiCode mode specification (2-6) as protocol interface
- Code16K row bounds, mode metadata, checksum metadata, and concatenation metadata validation
- deterministic reconciliation outcome driven by canonical polyform hash regardless of decode order
- 2.5D and 3D placeholder projections accepting the same identity model

## 10. Polyform Dimensional Expansion (Normative Usability Model)

The object model explicitly separates token transport from structural state:

- barcode token = carrier datum
- polyform = expanded structural state
- replay/time = temporal dimension over polyform states

Usability interpretation:

- `0D` token: isolated carrier datum
- `1D` record sequence: ordered stacked transport
- `2D` basis layout: projected polyform surface
- `3D` volumetric arrangement: polycube or equivalent spatial expansion
- `4D` replay dimension: temporal evolution over canonical state

## 11. Projective/Volumetric Narrative (Informative Only)

Four-point/projective/volumetric/log-resolution framing is retained as design
intuition only.

This section is explicitly non-normative:

- no theorem/proof obligations
- no conformance tests tied to projective equations
- no runtime dependency on volumetric/log formulas

## 12. Dual Spec Note

This library is intentionally dual-specified:

- Haskell-like algebra informs the conceptual shape
- TypeScript defines the public repo-facing API

The two should stay aligned, but TypeScript remains the executable repository
surface for now.
