# Omicron Math Model

## A Whitepaper on Periodic Synchronization via Balanced Ternary Operators

**Version**: 0.1  
**Date**: 2026-04-15  
**Status**: Working Draft

---

## 1. Abstract

This whitepaper describes the Omicron mathematical model: a framework for federated clock synchronization using bijective base notation, periodic harmonic convergence, and balanced ternary operators as the foundational step identity. The model draws from ancient counting systems (Nepōhualtzintzin), positional notation reform (Ptolemy's omicron as zero), polyhedral geometry (tetrahemihexahedron), and modern signed-digit arithmetic (balanced ternary).

---

## 2. Motivation

### 2.1 The Problem with Base-10

Standard positional notation uses 0 as an empty placeholder, but this creates ambiguity:
- Leading zeros are discarded
- No inherent representation of negative values
- Division requires special handling

### 2.2 Ptolemy's Omcron as Zero

From Claudius Ptolemy's *Almagest* (c. 100–170 AD):

> Tables of sexagesimal numbers 1...59 are represented in conventional Greek numerals. Since the letter omicron (which represents 70 in the standard system) is not used in sexagesimal, it is repurposed to represent an empty number cell.

The omicron (ο) became zero — not as a number, but as an **absence marker**. This is the key insight:

**NULL** = absent data value  
**Sentinel** = control token  
**BOM** = parse marker

---

## 3. Core Definitions

### 3.1 Omicron as Tetrahemihexahedron

In geometry, the tetrahemihexahedron (or hemicuboctahedron) is a uniform star polyhedron with:
- 7 faces (4 triangles, 3 squares)
- 12 edges
- 6 vertices

```
Visual model (unfolded net):

    △
   ┌───┐
  ◇│   │◇
   └───┘
    ▢
```

The 2⁸ = 256 limits form our operational bounds. We stop at 2⁸ because:
- 2⁹ (512) and 2¹⁰ (1024) exceed the simplex dimensions used for braille-like dot patterns
- 256 = 16×16 fits cleanly in a UTF-16 code page

### 3.2 Bijective Base Notation

**Bijective base-10**: 1-10, no zero
```
1, 2, 3, 4, 5, 6, 7, 8, 9, 10
```

**Bijective base-26**: A-Z (no zero)
```
A, B, C, ..., X, Y, Z, AA, AB, ...
```

This eliminates leading/trailing ambiguity and simplifies encoding.

### 3.3 Periodic Sync via Harmonic Mean

The periodic sync sequence: **49′36′′25′15′1°15′25″36″49⁗**

This is a palindrome representing convergent timing:
- Forward: 1 → 15 → 25 → 36 → 49
- Center: 1° (unity/zero reference)
- Reverse: 49 → 36 → 25 → 15 → 1

The harmonic mean formula for sync convergence:
```
H = 2ab / (a + b)
```

When a = 1° and b cycles through the sequence, convergence approaches a from both directions.

---

## 4. Balanced Ternary Operator (TTC)

### 4.1 Definition

**Balanced ternary** uses three digits: −1, 0, +1

| Symbol | Value | Name |
|--------|-------|------|
| T | −1 | Negative (like omicron orientation) |
| 0 | 0 | Zero/neutral |
| 1 | +1 | Positive |

We write this as **TTC** (Ternary Token Codec) where:
- T is the "turned" or inverted state
- 0 is the neutral state
- 1 is the standard state

### 4.2 TTC Step Identity

The step identity notation from your example:
```
49‵36‵25‵15‵1°15′25″36″49⁗
```

Interpretation:
- `‵` = T (−1) descending
- `°` = 0 (center/unity)  
- `′` = 1 (+1) ascending
- `‵` = T (−1) descending
- `⁗` = T flipped (sentinel/control)

This creates a **balanced palindrome** where:
- The sequence mirrors around center
- Each step is its own inverse
- No separate sign bit needed

### 4.3 Arithmetic

**Addition table:**
```
+   T   0   1
T  1T   T   0
0   T   0   1
1   0   1  1T
```

**Multiplication table:**
```
×   T   0   1
T   1   0   T
0   0   0   0
1   T   0   1
```

---

## 5. The Model in Practice

### 5.1 Encoding Flow

```
Input → Normalize → Bijective encode → TTC encode → Sync converge → Transmit
```

1. **Normalize**: Convert to canonical form
2. **Bijective encode**: 1-10 (base-10) or A-Z (base-26)
3. **TTC encode**: Convert to balanced ternary digits
4. **Sync converge**: Apply harmonic mean convergence
5. **Transmit**: Send with BOM marker

### 5.2 Decoding Flow

```
Receive → Parse BOM → TTC decode → Bijective decode → Validate
```

### 5.3 Error Correction (2-of-5)

From your previous work, 2-of-5 provides:
- **Detection**: Weight must equal 2
- **Correction**: Single-bit error recoverable

---

## 6. Relationship to Existing Work

### 6.1 WLOG Clock Demos

The clock demos implement the visual/temporal aspect:
- Sexagesimal (base-60) display
- Federated sync via BroadcastChannel
- UTF-32 signaling protocol

Omicron provides the **mathematical foundation** for those implementations.

### 6.2 Braille/Simplex Connection

6-dot braille ≡ 6-simplex
8-dot braille ≡ 8-simplex

This connects to:
- Polyhedral symbol notation (TP-3, SP-4, OC-6, etc.)
- Configuration geometry from crystallography

### 6.3 UTF Encoding

| Encoding | BOM |
|----------|-----|
| UTF-16 (BE) | FE FF |
| UTF-16 (LE) | FF FE |
| UTF-32 (BE) | 00 00 FE FF |
| UTF-32 (LE) | FF FE 00 00 |

The BOM serves as our **parse marker**, the omicron equivalent.

---

## 7. Mathematical Properties

### 7.1 Invariants

1. **No leading zeros**: Bijective notation guarantees this
2. **Self-inverse**: T and 1 are inverses; 0 is its own inverse
3. **Symmetric around zero**: Palindrome structure
4. **Convergent sync**: Harmonic mean approaches unit

### 7.2 Bounds

- **Power limit**: 2⁸ = 256 (operational)
- **Simplex dimension**: 6-8 (braille correspondence)
- **Bijective ranges**: 1-10 (decimal), A-Z (alphabetic)

---

## 8. Future Directions

1. **Haskell DSL**: Pure functional implementation of TTC operations
2. **Protocol definition**: Formal wire specification
3. **Hardware**: FPGA or ASIC implementation
4. **Integration**: Connect to existing WLOG clock demos

---

## 9. References

- Ptolemy's *Almagest* — omicron as zero
- Nepōhualtzintzin — Aztec base-20 abacus
- Knuth, D. — *The Art of Computer Programming* Vol. 2 (balanced ternary)
- Sator square — Latin word palindrome
- Tetrahemihexahedron — Uniform star polyhedron (U₄)
- Crossing ladders problem — Harmonic mean in geometry

---

## 10. Appendix: Quick Reference

### TTC Digit Mapping
```
Balanced Ternary → Decimal
T   = -1
0   =  0
1   = +1
```

### Periodic Sync Sequence
```
Ascending:  1 → 15 → 25 → 36 → 49
Center:    1°
Descending: 49 → 36 → 25 → 15 → 1
```

### BOM Markers
```
FE FF  = UTF-16 Big Endian
FF FE  = UTF-16 Little Endian
00 00 FE FF = UTF-32 Big Endian
FF FE 00 00 = UTF-32 Little Endian
```

---

*This document is a working draft. The Omicron model is under active development.*