# WOLOG

WOLOG is a constitutional computational substrate where canonical identity,
replay, and polyform structure stay upstream, while carriers, scenes, graphs,
and browser surfaces remain downstream projections.

## Repository Shape

The repo is organized to be readable from the top level:

- `docs/` product docs first, then specs, research, and references
- `src/` active product code only
- `apps/` active browser page bootstraps
- `fixtures/` sample graphs and shared example artifacts
- `tools/` maintenance and catalog scripts
- `legacy/` preserved demos and experiments not in the active product surface
- `vendor/` embedded external or legacy package trees

## Active Surfaces

- `index.html`
- `viewer.html`
- `scene.html`
- `compose.html`
- `aztec-slide-rule.html`
- `quartet-reconciliation-demo.html`

## Start Here

- Repo structure: `docs/product/REPO-STRUCTURE.md`
- Getting started: `docs/product/GETTING-STARTED.md`
- Feature map: `docs/product/FEATURE-MAP.md`
- Active surfaces: `docs/product/ACTIVE-SURFACES.md`
- Catalog and authority index: `index.org`

## Build

```bash
npm install
npm run check:repo
npm run typecheck
npm run build
```
