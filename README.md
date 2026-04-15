# WOLOG - Representative Closure

The constitutional computational substrate.

## Core Concept

```
WOLOG = representative closure
```

One stands for many without loss. The root constructor from which all primitives derive.

## Architecture

```
WOLOG
├── src/           # TypeScript runtime modules
├── components/    # Web Components
├── pg/            # Property Graph files
└── [pages]        # Vite entry points
```

## Development

```bash
npm install     # Install dependencies
npm run dev    # Start dev server (port 3000)
npm run build  # Build for production
```

## Pages

- `index.html` - Clock demos landing
- `viewer.html` - WOLOG graph viewer

## Property Graph

The constitutional graph is defined in `pg/wlog-terms.pg`:

```
WOLOG (root)
  ├─ activates → MONAD, FUNCTOR, XOR, AND, OR
  ├─ contains → compose, join, sigma0, lane, braille
  └─ ...structural/clock/address/projection laws
```

## Edge Taxonomy

| Relation | Meaning |
| -------- | ------- |
| `activates` | primitive is available within WOLOG |
| `contains` | law is part of WOLOG |
| `composes` | structural law transforms |
| `derives` | clock derives from primitive |
| `extends` | clock extends base period |
| `indexes` | address indexes channel |

## Links

- Viewer: `/viewer.html`
- Spec: `/CONSTITUTIONAL-SPEC.md`