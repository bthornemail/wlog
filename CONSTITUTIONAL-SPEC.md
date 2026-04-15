# CONSTITUTIONAL SPEC

## The Unified Computational Substrate

**Version**: 1.0  
**Date**: 2026-04-15  
**Status**: Frozen Specification  

---

## 0. Preamble

This document defines the constitutional substrate: the minimal symbolic kernel that unifies the ABI thread (syntax/machine law) and the Omicron thread (number/identity law).

### WOLOG — Root Constructor

**WOLOG** := *representative closure*

Meaning:
- one case may be activated
- the total structure remains available  
- no symmetry is destroyed
- continuation remains possible

WOLOG is the root constructor. Everything else occurs within it:

```
WOLOG XOR
WOLOG MONAD
WOLOG FUNCTOR
...
```

The substrate consists of five interdependent laws:
1. **Alphabet** — the finite symbolic alphabet
2. **Structural Laws** — how symbols compose and reduce
3. **Clock Laws** — temporal state and replay
4. **Address Laws** — indexed access and sequencing
5. **Projection Laws** — output surfaces and encoding

No law depends on external primitives. All primitives are defined within the substrate.

---

## 0.1 Edge Taxonomy

All relationships in the graph use these frozen relation types:

| Relation | Meaning | Arity |
| ------- | ------- | ---- |
| `activates` | primitive is available within WOLOG | 1→1 |
| `contains` | law is part of WOLOG | 1→1 |
| `composes` | structural law transforms | 2→1 |
| `derives` | clock derives from primitive | 1→1 |
| `extends` | clock extends base period | 1→1 |
| `combines` | omega combines periods | 2→1 |
| `indexes` | address indexes channel | 1→1 |
| `hashes` | witness hashes to identity | 1→1 |
| `uses` | replay uses base clock | 1→1 |

---

## 1. Alphabet

### 1.1 Prime Symbols (9)

| Symbol | Name | Arity | Definition |
|--------|------|------|------------|
| **WLOG** | Closure Anchor | 0 | The replay boundary; nothing precedes it |
| **MONAD** | Identity | 1 | λx.x — the idle transform |
| **FUNCTOR** | Map | 2 | λf.λx.f x — apply after lift |
| **XOR** | Exclusive Disjoin | 2 | (¬a ∧ b) ∨ (a ∧ ¬b) |
| **AND** | Conjunction | 2 | a ∧ b — both true |
| **OR** | Disjunction | 2 | a ∨ b — either true |
| **NOT** | Negation | 1 | ¬a — flip boolean |
| **NOR** | Joint Denial | 2 | ¬(a ∨ b) — neither true |
| **NAND** | Not Conjunction | 2 | ¬(a ∧ b) — not both |

### 1.2 Derived Symbols (Extended)

| Symbol | Definition | Notes |
|--------|------------|-------|
| **IFF** | (a → b) ∧ (b → a) | If and only if |
| **XNOR** | ¬(a XOR b) | Equivalence |
| **TRUE** | 1 | Constant true |
| **FALSE** | 0 | Constant false |
| **ZERO** | WLOG | Absence marker |
| **UNIT** | MONAD | Identity carrier |

### 1.3 Alphabet Invariants

1. **Finiteness**: Exactly 9 prime symbols
2. **Completeness**: All boolean functions reducible to these 9
3. **Independence**: No prime symbol is definable from others

---

## 2. Structural Laws

### 2.1 Compose (·)

```
(a · b) ≡ λx.a(bx)
```

Law: **Rightmost evaluates first** (normal order reduction)

```
WLOG · FUNCTOR → FUNCTOR
MONAD · MONAD → MONAD
```

### 2.2 Join (⧫)

```
(a ⧫ b) ≡ a ∨ b  with  a ∧ b = 0
```

Law: **Disjoint union** — no overlap in truth

```
XOR · XOR → FALSE
AND · NAND → FALSE
```

### 2.3 Replay (↺)

```
↺a ≡  a, then a, then a...
```

Law: **Append-only iteration** — same input produces same output sequence

```
↺WLOG → WLOG,WLOG,WLOG...
↺MONAD → MONAD,MONAD,MONAD...
```

### 2.4 Index ([n])

```
a[n] ≡  nth position of a
```

Law: **Zero-indexed** — first element is position 0

```
FUNCTOR[0] → FUNCTOR
FUNCTOR[1] → ERROR
```

### 2.5 Project (→)

```
a → p  ≡  encode a into projection p
```

Law: **Lossless encoding** — p uniquely determines a

```
WLOG → braille    → utf-8
FUNCTOR → hexagram → matrix
```

---

## 3. Clock Laws

### 3.1 step_identity (σ⁰)

```
σ⁰ ≡ MONAD
```

Law: **No temporal change** — the identity step

```
↺σ⁰  →  MONAD,MONAD,MONAD...
```

### 3.2 differential7 (σ⁷)

```
σ⁷ ≡  step through 7 positions, then return
```

Law: **Heptadic pulse** —周期 = 7

```
↺σ⁷  →  0,1,2,3,4,5,6,0,1,2...
```

### 3.3 differential15 (σ¹⁵)

```
σ¹⁵ ≡  step through 15 positions, then return
```

Law: **Pentadecimal pulse** — period = 15

```
↺σ¹⁵  →  0..14,0..
```

### 3.4 cycle60 (σ⁶⁰)

```
σ⁶⁰ ≡  step through 60 positions, then return
```

Law: **Sexagesimal cycle** — period = 60

```
↺σ⁶⁰  →  0..59,0..
```

### 3.5 closure5040 (ω)

```
ω ≡  σ⁰ · σ⁷ · σ⁶⁰
```

Law: **Full closure** — 5040 = LCM(7,60)

```
↺ω   →  complete replay then STOP
```

---

## 4. Address Laws

### 4.1 lane

```
lane(n)  ≡  position n in stream
```

Law: **Sequential access** — contiguous memory model

```
lane(0) → first symbol
lane(1) → second symbol
```

### 4.2 channel

```
channel(id)  ≡  isolated replay stream
```

Law: **Independent timing** — each channel has own σ

```
channel(a) ↺ σ⁷
channel(b) ↺ σ⁶⁰
```

### 4.3 slot

```
slot(x,y)  ≡  coordinate (lane x, channel y)
```

Law: **2D addressing** — lane × channel matrix

```
slot(0,0) → lane 0, channel 0
slot(5,3) → lane 5, channel 3
```

### 4.4 witness

```
witness(a)  ≡  hash(a) → compact digest
```

Law: **Deterministic fingerprint** — same input, same hash

```
witness(MONAD) → digest
witness(FUNCTOR) → digest
```

---

## 5. Projection Laws

### 5.1 braille

```
→ braille  ≡  6-dot binary encoding
```

Law: **Tactile output** — each symbol becomes 6-bit pattern

```
WLOG   →  ⠁ (dot 1)
MONAD  →  ⠃ (dots 1,2)
FUNCTOR → ⠉ (dots 1,3)
```

### 5.2 hexagram

```
→ hexagram  ≡  6-line binary encoding
```

Law: **I Ching projection** — 6 lines, solid/broken

```
WLOG   →  ☰ (all solid)
MONAD  →  ☱ (top broken)
FUNCTOR →  ☲ (second broken)
```

### 5.3 matrix

```
→ matrix  ≡  geometric transformation
```

Law: **Linear algebra output** — symbols as matrices

```
MONAD  →  [1 0; 0 1] (identity)
NOT   →  [0 1; 1 0] (flip)
```

### 5.4 utf

```
→ utf  ≡  Unicode code point
```

Law: **Text output** — standard encoding

```
WLOG   →  U+0000 (null)
MONAD  →  U+0001 (SOH)
FUNCTOR → U+0002 (STX)
```

### 5.5 html/webgl

```
→ html  →  DOM element
→ webgl →  GL render
```

Law: **Visual output** — browser/3D rendering

```
WLOG → <canvas>
FUNCTOR → <svg>
```

---

## 6. Constitutional Dependencies

```
         ┌─────────────┐
         │  ALPHABET  │
         └──────┬──────┘
                │
         ┌──────┴──────┐
         │            │
    ┌────▼────┐   ┌▼──────────┐
    │STRUCT  │   │ CLOCK     │
    │Laws    │   │ Laws     │
    └────┬───┘   └─────┬────┘
         │             │
    ┌────▼────────────▼────┐
    │   Address Laws     │
    └────────┬───────────┘
             │
        ┌────▼────┐
        │PROJECT │
        │ Laws   │
        └─────────┘
```

### Dependency Rules

1. **Alphabet** defines all primitives — nothing outside
2. **Structural Laws** combine Alphabet symbols
3. **Clock Laws** control temporal behavior
4. **Address Laws** enable indexed access
5. **Projection Laws** encode for output

No downstream law modifies upstream primitives.

---

## 7. Invariants

| Invariant | Statement |
|----------|------------|
| **I1** | Exactly 9 prime symbols |
| **I2** | WLOG is the replay boundary — nothing precedes it |
| **I3** | σ⁰ is identity — ↺σ⁰ never changes |
| **I4** | ω completes — ↺ω produces closure then STOP |
| **I5** | Projection is lossless — decode(encode(a)) = a |
| **I6** | No privilege — all laws are internal |

---

## 8. Reference Implementation (Pseudo-Haskell)

```haskell
-- Primes
data Prime = WLOG | MONAD | FUNCTOR | XOR | AND | OR | NOT | NOR | NAND
  deriving (Eq, Show)

-- Structural
compose :: Prime -> Prime -> Prime
join :: Prime -> Prime -> Prime  
replay :: Prime -> [Prime]
index :: Prime -> Int -> Prime
project :: Prime -> Projection

-- Clocks
data Clock = Clock { period :: Int, ticks :: [Prime] }
sigma0  = Clock 1  [MONAD]
sigma7  = Clock 7  [MONAD,MONAD,MONAD,MONAD,MONAD,MONAD,MONAD]
sigma60 = Clock 60 [MONAD] -- 60 repeats
omega   = lcm sigma7.period sigma60.period  -- 420

-- Address
data Address = Lane Int | Channel Int | Slot (Int,Int) | Witness Prime

-- Projections
data Projection = Braille | Hexagram | Matrix | UTF | HTML | WebGL

-- Laws
laws :: Prime -> [Prime] -> Clock -> Address -> Projection
laws p as c a proj = undefined
```

---

## 9. Extensions (Future)

- **Haskell DSL**: Pure implementation of above
- **AWK Streams**: Unary stream interpreter
- **Protocol**: Wire format specification
- **Hardware**: FPGA/ASIC target

---

## 10. Frozen Date

This specification is frozen as of **2026-04-15**.

Changes require:
1. Proposal through projection channel
2. Review by 3 independent implementers
3. Consensus on minimal addition

---

*End of Constitutional Spec*