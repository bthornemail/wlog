# skills.md

# WOLOG Portable Skills Contract
# Target: POSIX shell + BusyBox + minimal C toolchain + awk + sed + grep

## Core Principle

Build systems that remain understandable, reproducible, and functional
in constrained environments.

Prefer:
- text streams
- deterministic transforms
- small tools
- explicit files
- stable formats

---

## 1. Shell Literacy

Can confidently use:

- sh
- ash
- dash
- bash (without requiring bashisms)

Understands:

- pipes
- redirection
- exit codes
- quoting
- command substitution
- environment variables
- subshells
- here-docs

Example:

```sh
cat input.pg | awk -f parse.awk | sort > graph.norm
````

---

## 2. File / Process Tools

Can use:

* cat
* cp
* mv
* rm
* mkdir
* find
* xargs
* tee
* sort
* uniq
* cut
* tr
* wc
* head
* tail

Can compose them into pipelines.

---

## 3. Text Processing

Strong with:

* grep
* sed
* awk

Required abilities:

* tokenization
* field extraction
* stateful line parsing
* substitutions
* filtering
* report generation

Example uses:

* parse PG lines
* validate ontology edges
* generate receipts
* normalize logs

---

## 4. AWK as Runtime Tool

Can write AWK programs for:

* parsers
* finite state machines
* counters
* matrix transforms
* stream interpreters
* bitwise ops (gawk if needed)

WOLOG relevance:

* canonical replay
* graph normalization
* receipt generation

---

## 5. POSIX C Basics

Can write small C programs using:

* stdio
* stdlib
* string
* unistd
* fcntl
* errno

Can build:

* CLI tools
* stream processors
* parsers
* deterministic runtimes

Compile with:

```sh
cc -O2 -Wall tool.c -o tool
```

---

## 6. Binary / Byte Skills

Understands:

* bytes
* hex
* bit masks
* shifts
* endianness
* fixed-width integers

Can inspect with:

* hexdump
* od
* xxd (if present)

WOLOG relevance:

* header8
* control bytes
* frame envelopes
* packed transport

---

## 7. Deterministic Build Discipline

Can produce repeatable outputs.

Uses:

* Makefile
* explicit dependencies
* no hidden state

Checks:

* same input -> same output
* stable hashes
* clean rebuilds

---

## 8. Graph / Serialization Skills

Can work with text graph formats:

* PG
* JSON
* NDJSON
* TSV / CSV

Can convert between them.

WOLOG relevance:

```text
typed graph -> PG -> viewer
```

---

## 9. Validation Mindset

Can write checks for:

* malformed input
* duplicate ids
* invalid relations
* missing fields
* schema drift

Uses shell scripts as gates.

Example:

```sh
./validate_pg.sh
./validate_ontology.sh
```

---

## 10. Networking Basics

Can use:

* nc
* wget
* curl (if available)
* httpd (BusyBox)

Enough for:

* local demos
* file serving
* append streams
* simple federation tests

---

## 11. Documentation as Source

Can maintain:

* README.md
* specs
* contracts
* examples

Text-first, versioned, diffable.

---

## 12. WOLOG-Specific Competencies

Understands:

* canonical core vs projection layer
* deterministic replay
* clocks / ticks
* frame snapshots
* world patches
* PG as surface, not truth
* components as modules
* buffers as substrate

---

# Anti-Patterns

Avoid dependence on:

* giant frameworks for simple tasks
* opaque build systems
* hidden mutable state
* GUI-only workflows
* non-reproducible manual steps

---

# Success Metric

A new machine with BusyBox, awk, sh, and cc
can clone the repo and run meaningful parts of the system.
