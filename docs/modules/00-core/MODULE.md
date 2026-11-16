# Module 00 — Core

> **Purpose:** the permanent container of shared platform work: boundaries, invariants, state and pending items.
> **Read when:** a task touches the shared layer, or core work is being planned.
> **Canonical for:** the core boundary rule, the invariants, the core item list and the core documentation map.
> **Do not duplicate:** architecture (`../../ARCHITECTURE.md`), decisions (`../../DECISIONS.md`), wire (`../../api-contract.md`).

**Status:** `Active (permanent)` (2026-11-16)
**Last update:** 2026-11-16

Module 0 holds the work that belongs to no functional module. It never closes as
`Tested` and does not consume the active-module slot.

---

## 1. Purpose

Keep the shared platform layer in one place: the bootstrap, configuration, the
shared middleware, the cross-cutting conventions and the invariants that every
module must respect.

## 2. Scope

### In scope

- configuration and startup, shared middleware, the shared data layer and the shared interface layer;
- the cross-cutting conventions that no single module owns;
- the core work items recorded in `BACKLOG.md`.

### Out of scope

- any functional behaviour: it belongs to its module;
- decisions and architecture: they keep their own files and module 0 links to them.

## 3. Boundary rule

A change belongs to module 0 when it is consumed by two or more modules, or when
it changes the platform without changing a module behaviour. A change that alters
a functional module observable behaviour belongs to that module and needs its
impact analysis.

## 4. Invariants (`CR-NN`)

| ID | Invariant | Source of truth |
|---|---|---|
| `CR-01` | The API contract is the only coupling between backend and frontend | [`api-contract.md`](../../api-contract.md) |
| `CR-02` | Every authenticated route resolves the session before the handler | [`ARCHITECTURE.md`](../../ARCHITECTURE.md) |
| `CR-03` | A fact has one home and the others link to it | [`DOC-STANDARD.md`](../../DOC-STANDARD.md) |
| `CR-04` | Nothing is marked implemented without recorded evidence | [`WORKFLOW.md`](../../WORKFLOW.md) |

## 5. Lifecycle and state

`Active (permanent)`: core work items follow the normal cycle one by one and the
container never closes. An item is verified on its own before its row changes
status.

## 6. Documentation map

- [`TECHNICAL.md`](TECHNICAL.md) — shared backend and frontend layer, boot order, migrations.
- [`BACKLOG.md`](BACKLOG.md) — core items; read when planning core work.
- [`CHANGELOG.md`](CHANGELOG.md) — dated core history.

## 7. Decisions

- not recorded.

## 8. Risks and known limitations

- The container can become a dumping ground: the boundary rule of §3 is the control.

## 9. Next step

The initialization records the shared layer of the chosen stack here.

## 10. Module-specific notes

_not applicable_
