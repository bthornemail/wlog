# Polyform Computation

## Shapes as Data, Transforms as Law

This document formalizes polyform computation for WOLOG.

Core claim:

```text
polyform = structural program object
transform = lawful change over structure
replay log = authoritative execution history
projection = downstream rendering or transport
```

Polyforms are not just puzzle pieces. In WOLOG they can serve as:

- state units
- logic bricks
- memory blocks
- routing pieces
- visual code
- distributed witnesses

## Constitutional Form

Polyform computation should follow this order:

```text
seed
-> lawful transform
-> replay log
-> witness
-> projection
```

This means:

1. Shapes are data.
2. Transforms are law.
3. Replay defines truth.
4. Rendering is downstream.
5. Logs are authoritative.
6. Same input gives same result.
7. Network exchange should prefer transforms or witnesses, not arbitrary rendered surfaces.

## Minimal Core

### Primitive Objects

- `Cell` :: one lawful unit in a lattice
- `Polyform` :: a finite set of occupied cells
- `Transform` :: a lawful operation over a polyform
- `ReplayEntry` :: one transform applied at one step
- `ReplayLog` :: an ordered list of replay entries
- `Witness` :: a deterministic digest or state signature derived from replay/state

### Minimal Structural Algebra

```text
JOIN
SPLIT
MOVE
ROTATE
FLIP
COPY
MERGE
CUT
```

### Minimal Logical/Temporal Algebra

```text
MATCH
COUNT
TRACE
REPLAY
STEP
SYNC
HALT
```

These operations are sufficient to build a language without requiring text-first programming.

## Computational Interpretation

### Polyform as Form

A polyform is a structural arrangement of identical cells over a field.

Examples:

- monomino
- domino
- tromino
- tetromino
- pentomino

### Polyform as Program

A program can be interpreted as a sequence of transforms over a seed polyform.

```text
seed shape
-> transform
-> transform
-> transform
-> result
```

### Polyform as Predicate

A predicate recognizes a property of a polyform:

- connectivity
- occupancy
- symmetry
- collision
- containment
- port compatibility

### Polyform as Witness

A witness records that a particular polyform arose by a lawful replay:

- replay log
- bitboard state
- state hash
- signed receipt

## Bitboard Carrier

For efficient execution, polyforms can be carried by bitboards.

Example:

```text
8 x 8 board = 64 bits
1 bit = occupied cell
```

Useful operations:

- shift left/right/up/down
- `AND` for collision
- `OR` for merge
- `XOR` for toggle or parity
- masked rotation/flip

This makes polyform computation both human-readable and machine-efficient.

## Network Interpretation

Polyforms should travel as:

- transforms
- replay entries
- witnesses

More than as raw rendered surfaces.

Example:

```text
SEED domino
GROW
ROTATE 90
MOVE 2 0
STEP
HALT
```

This keeps online and offline execution aligned.

## Layering Rule

For WOLOG, polyform computation belongs in this stack:

```text
constitutional law
-> typed polyform model
-> replay/execution
-> witness and synchronization
-> projection (SVG, canvas, UI, PG, network packet)
```

Never invert this.

## Recommended Next Steps

1. Freeze the core types: `Cell`, `Polyform`, `Transform`, `ReplayLog`, `Witness`.
2. Keep one deterministic reference execution path.
3. Add bitboard projection as an implementation carrier, not as the ontology.
4. Add SHACL/RDF vocabulary only after the core transform law is stable.
5. Promote one browser surface into a real polyform editor/viewer once the core is settled.
