# SECURITY-BACKLOG.md

> **Purpose:** the security baseline already in place and the gaps proposed for it.
> **Read when:** reviewing a change with a security surface, or planning hardening.
> **Canonical for:** security proposals, their status and their acceptance line.
> **Do not duplicate:** implementation detail (`TECHNICAL.md`) and operational procedure (`docs/WORKFLOW.md`).

**Last update:** 2026-11-16

Each entry is one section, not a table row, because a proposal needs a paragraph
and an acceptance line.

---

## 1. Baseline already implemented

- No control is recorded yet; the initialization adds the baseline of the chosen stack.

## 2. Not proposed (with rationale)

- Rate limiting, auditing and formal threat modelling are deferred until the first module with a public surface exists.
