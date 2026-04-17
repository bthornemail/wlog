# WOLOG Repository Structure

## Top Level

- `docs/` public documentation and supporting references
- `src/` active product code
- `apps/` active page bootstraps used by browser shells
- `fixtures/` shared graphs and example artifacts
- `tools/` maintenance scripts and repo checks
- `legacy/` preserved non-primary demos and experiments
- `vendor/` embedded external or legacy package trees

## Source Domains

- `src/core/` runtime, scene, frame, viewport, binary, control-plane foundations
- `src/polyform/` polyform model, language, and polynomial truth tables
- `src/carriers/` Aztec, MaxiCode, BEEtag, Code16K, reconciliation, and codebooks
- `src/semantic/` ontology, semantic-web, SKOS, SPARQL, RIF, resources, logic
- `src/projection/` SVG/canvas/output surfaces
- `src/ui/` reusable components and authoring/view helpers
- `src/index.ts` public API barrel only

## Active Browser Surfaces

- `index.html`
- `viewer.html`
- `scene.html`
- `compose.html`
- `aztec-slide-rule.html`
- `quartet-reconciliation-demo.html`

These shells load bootstraps from `apps/`.

## Non-Primary Areas

- `legacy/demos-html/` older standalone demos
- `legacy/experiments/` non-primary language/runtime experiments
- `vendor/blitzboard/` embedded upstream project
- `vendor/wlog-legacy-package/` legacy packaged source tree
