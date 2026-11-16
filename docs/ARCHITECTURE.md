# ARCHITECTURE.md

> **Purpose:** the global architecture and the conventions of the platform.
> **Read when:** designing a change, adding a module or checking a convention.
> **Canonical for:** layers, code organization, the global data model and the general conventions.
> **Do not duplicate:** decisions (`DECISIONS.md`), the wire (`api-contract.md`) and module detail (`docs/modules/`).

**Last update:** 2026-11-16

The architecture is described here as layers with one coupling point; the
decisions that produced it live in `DECISIONS.md`.

---

## 1. General architecture

not recorded — written by the guided initialization from the chosen project type.

Principles:

- **Strict separation with a single coupling point:** the API contract is the only shared boundary.
- **Business logic centralized in the backend.** The interface presents and hides actions according to permissions.
- **Validation always in the backend;** the client validates for comfort only.
- **Centralized errors:** one response shape, one mapping from error code to status.
- **Authentication isolated** behind one module so a provider can be replaced without touching the domain.

## 2. Code organization

### Backend

| Layer | Responsibility | Forbidden |
|---|---|---|
| not recorded | — | — |

### Frontend

| Folder | Content | Rule |
|---|---|---|
| not recorded | — | — |

## 3. Frontend ↔ backend communication

not recorded.

## 4. Database

not recorded.

## 5. Global data model

not recorded.

## 6. General conventions

- names, casing, dates and error shape: not recorded.
- identifiers, enums and permissions: not recorded.
- logging and correlation: not recorded.

## 7. Repository organization

not recorded.

## 8. Non-functional requirements

| Target | Value | Source |
|---|---|---|
| not recorded | — | — |

## 9. Data classification and retention

not recorded.

## 10. Testing strategy

| Layer | Tool | What it proves | When |
|---|---|---|---|
| not recorded | — | — | — |
