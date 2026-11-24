# DOCUMENTATION-BACKLOG.md

> **Purpose:** the register of documentation findings.
> **Read when:** triaging a documentation audit, or checking an open documentation defect.
> **Canonical for:** documentation findings and their status.
> **Do not duplicate:** the rule they violate (`DOC-STANDARD.md`).

**Last update:** 2026-11-24

One row per finding, ordered by identifier; the rule identifier is cited so the
finding survives a rewrite of the prose.

---

## 1. Entries

| ID | Date | Type | Description | Origin | Priority | Status |
|---|---|---|---|---|---|---|
| — | — | — | no entries | — | — | — |

## 2. States

- `new` — registered, not approved, not planned.
- `in progress` — accepted and being worked.
- `accepted` — approved by the owner, not scheduled.
- `blocked` — waits on another item, named in the row.
- `deferred` — postponed behind a named milestone.
- `implemented` — fixed, with the date.
- `moved` — addressed elsewhere; the target identifier owns the work.
- `discarded` — rejected, with the reason.

## 3. Types

- `docs` — wording, structure or a broken link.
- `correction` — the documentation contradicts the code it describes.
- `improvement` — documentation content that did not exist.
- `restructuring` — a file or a section must move.
- `security`, `performance`, `test` — as named.
- `tech-debt` — the documentation describes a state the code does not have.
