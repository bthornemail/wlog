## Continuation Prompt — WOLOG Project State

We are building **WOLOG** (formerly WLOG): a constitutional computational substrate where the core remains minimal, deterministic, and type-first, while all UI/graph/media layers are downstream projections.

---

# Core Principles

## WOLOG Meaning

```text
WOLOG = representative closure
choose one, lose none
one stands for many without loss
```

Use:

* **WOLOG** = canonical / theoretical / documentation name
* **WLOG** = engineering alias / legacy shorthand

---

# Architectural Law

```text
constitutional core
-> typed graph AST
-> PG surface
-> scene/frame projections
-> browser/UI surfaces
```

Never reverse this.

PG, SVG, HTML, A-Frame, viewer pages, etc. are **surfaces**, not sources of truth.

---

# Current Browser Stack

We moved toward a Vite + TypeScript architecture.

## Source of Truth

`/root/wlog/src/`

Contains domain-organized TS modules:

* `core/` → evaluator, runtime, scene, frame, viewport, binary/control-plane foundations
* `polyform/` → polyform model and WOLOG language
* `carriers/` → codepoints, carriers, barcode quartet, reconciliation
* `semantic/` → ontology, RDF/Turtle, SHACL, SKOS, SPARQL, RIF, resources
* `projection/` → SVG/canvas and downstream visual surfaces
* `ui/` → reusable browser components and composition helpers
* `index.ts` → public API barrel

---

# UI Direction

Old standalone HTML demos should become **thin shells**.

## Final Shape

```text
runtime modules
-> Web Components
-> Vite pages
-> optional iframe peers
```

## Rule

* components = real reusable units
* pages = orchestrators
* iframes = isolated peers / sync demos

---

# Existing / Planned Pages

## `viewer.html`

Graph viewer + PG visualization + clock streams.

## `scene.html`

Scene/world inspector:

* live scene
* frozen frame compare
* viewport state
* renderer switching

## `compose.html`

Authoring surface (CM6 style):

* overlays
* patches
* selection
* clipboard
* composition
* serialization

## `index.html`

Landing page linking all tools.

---

# Property Graph Direction

We decided to use **PG format now**, but only as a downstream serialization surface.

## Canonical Flow

```text
typed graph AST
-> emit PG
-> inspect in Blitzboard / viewer
```

## Frozen AST Shape

```text
Node
Edge
Label
Prop
Value
```

## Example Graphs

* person node
* relationship edge
* small 3-node graph
* WOLOG constitutional graph

Stored in:

```text
/root/wlog/fixtures/pg/
```

---

# WOLOG Ontology Direction

WOLOG is now the root constructor.

Example graph meaning:

```text
WOLOG
 ├─ activates → MONAD
 ├─ activates → FUNCTOR
 ├─ activates → XOR
 ├─ contains  → laws
 ├─ projects  → surfaces
```

## Relation Vocabulary

Use a stable taxonomy:

```text
activates
contains
derives
extends
projects
indexes
hashes
composes
syncs
renders
captures
spawns
uses
```

---

# Binary / Sync Layer

We explored browser-native substrate tools.

## Constitutional Law Layer

* Symbols as finite type markers
* Pure functions as laws
* Explicit tagged values

## Carrier Layer

Use:

* `ArrayBuffer`
* `SharedArrayBuffer`
* `DataView`
* typed arrays
* Atomics

## Libraries Used as References

### BitView

Packed bitfields / non-byte-aligned integers.

Used for:

* flags
* occupancy
* compact state
* small deltas
* timing masks

### DataStream

Sequential struct reading/writing over buffers.

Used for:

* frame envelopes
* patch envelopes
* binary transport
* endian-safe IO

---

# Sync Model

## Local Same-Origin

Use:

* Workers
* SharedArrayBuffer
* Atomics
* waitAsync where possible

## Cross-Page

Use:

* BroadcastChannel
* optional iframes
* SharedWorker later

## Remote Feed

Use:

* EventSource (append-only stream)

Avoid using hyperlink `ping` as protocol sync.

---

# Web Components Direction

Pages should be replaced by modular components.

Examples:

```html
<wolog-clock-node>
<wolog-graph-viewer>
<wolog-scene-viewer>
<wolog-composer>
<wolog-frame-viewer>
<wolog-federation-hub>
```

Then pages only compose these units.

---

# Immediate Next Steps

## 1. Stabilize Vite App

Run:

```bash
npm install
npm run dev
```

Verify:

* viewer.html
* scene.html
* compose.html
* index.html

## 2. Freeze One Page Pattern

Convert one page fully into:

```text
HTML shell + TS bootstrap + Web Component
```

Then migrate others.

## 3. Finish Binary Layer

Create:

* `binary.ts`
* safe BitView wrapper
* FrameEnvelope
* PatchEnvelope

## 4. Connect PG to Viewer

Load generated `.pg` graphs directly.

## 5. Create Real Components

Build:

* `<wolog-scene-viewer>`
* `<wolog-composer>`
* `<wolog-graph-viewer>`

---

# Short Project Identity

```text
Symbols define identity.
Functions define law.
Buffers define substrate.
Graphs define structure.
Views define projection.
WOLOG preserves closure.
```

## Repo Structure Rule

Do not add new root-level demo HTML files outside the approved active shells.
New product-facing pages must use the active app/bootstrap structure and be
registered intentionally.
