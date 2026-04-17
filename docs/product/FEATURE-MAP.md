# Feature Map

## Core Runtime

- runtime stepping and opcode evaluation: `src/core/`
- deterministic scene/frame reduction: `src/core/`

## Polyform and Language

- polyform model and transforms: `src/polyform/polyform.ts`
- WOLOG surface/core language types: `src/polyform/language.ts`

## Barcode and Carrier Layer

- virtual codepoints and carriers: `src/carriers/aztec-slide-rule.ts`
- quartet reconciliation proof: `src/carriers/quartet-reconciliation-demo.ts`

## Semantic Layer

- ontology and RDF/Turtle integration: `src/semantic/`

## Projection and UI

- renderers: `src/projection/`
- reusable components: `src/ui/components/`
- page bootstraps: `apps/`
