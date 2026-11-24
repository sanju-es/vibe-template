# Documentation standard — v1.3

> **Purpose:** single contract for the form of every `.md` in the repository.
> **Read when:** writing or reviewing documentation, or when the documentation gate fails.
> **Canonical for:** file skeletons, table columns, vocabularies, identifier notation and the machine checks.
> **Do not duplicate:** the process (`WORKFLOW.md`) and the facts themselves.

**Status:** `approved` (2026-11-24)
**Last update:** 2026-11-24

One skeleton, one table registry and one vocabulary set apply to every document.
A rule is either checked by `scripts/check-docs.mjs` or reviewed by the documentation auditor at closure.

---

## 1. Scope, authority and language

- **G-01 — Scope.** Applies to every `.md` under `docs/**` and to the root files registered in §7.1. A root `.md` outside that registry is outside the standard: no rule of this document applies to it and it is never a source. A root `.html` tool is not a document: no rule of this document applies to it. Tooling configuration under `.opencode/**` is out of scope.
- **G-02 — Precedence.** `AGENTS.md` (process) → this standard (form) → file-local notes. A file note never contradicts this standard.
- **G-03 — Keywords.** **must** = gate failure; **should** = advisory, justified in the same task when skipped; **may** = free choice.
- **G-04 — Language.** Every artifact uses the language chosen at initialization. A quoted owner statement keeps its original language; the control comment of G-21 keeps its fixed form.
- **G-05 — Non-goals.** This standard creates no requirement, authorises no code and rewrites no dated entry.

## 2. Rule identifiers

- **G-06 — Prefixes.** `G` general, `T` tables, `V` vocabulary, `R` references, `F` file skeletons, `AG` agent, `L` lifecycle and governance, `E` enforcement.
- **G-07 — Citation.** A review or a finding cites the rule instead of quoting prose.
- **G-08 — Shape.** One rule is one sentence plus at most one short example.

## 3. Universal skeleton

Every live document starts exactly like this:

```markdown
# <Title from the file registry, §7>

> **Purpose:** one line.
> **Read when:** task triggers, short.
> **Canonical for:** the facts this file owns.
> **Do not duplicate:** where the rest lives.

**Status:** `Implemented` (2026-11-16)      ← only where a state applies
**Last update:** 2026-11-16

Two sentences, at most 400 characters, no new fact and no identifier created here.

---

## 1. First slot
```

- **G-09 — H1.** One H1, on the first content line, matching the pattern of §7.
- **G-10 — Front block.** The four `**Key:**` lines are mandatory on live documents; `**Last update:**` carries the date of the last content edit.
- **G-11 — Status.** `**Status:**` carries one token of the vocabulary that applies (§5) in backticks and the date in parentheses; the gloss goes in the body.
- **G-12 — Summary.** At most two sentences and 400 characters.
- **G-13 — Sections.** `## N. Title`, ascending from 1; subsections are `### Title` or `### N.M Title`; `####` is forbidden. A slot may be omitted and is never renumbered.
- **G-14 — Separator.** `---` only once, between the front block and §1.
- **G-15 — Dashes.** `—` separates the parts of a title; `-` appears only inside compound words.
- **G-16 — Dates.** `YYYY-MM-DD` everywhere, including inside a cell.
- **G-17 — Emphasis and code spans.** **Bold** for a status keyword, the operative sentence of a cell and a label that opens a list item. `Code spans` for paths, identifiers, endpoints, error codes, columns and variables.
- **G-18 — Links.** Relative, never absolute and never `file://`. A section link uses the GitHub anchor of the heading.
- **G-19 — One fact per item.** An item that needs a second fact becomes two items.
- **G-20 — Length.** A table cell stays under 600 characters; beyond that the detail goes to prose below the table.
- **G-21 — Control comment.** Line 1 of `PROJECT_STATE.md` is the recorded control comment, kept verbatim; no other file carries one.

## 4. Tables

- **T-01 — Mechanics.** Header row, `|---|` separator on the next line, constant column count, no blank line inside the table, no nested table.
- **T-02 — Cells.** A phrase without a trailing period; a full sentence keeps it. `|` inside a cell is escaped as `\|`; an empty value is `—`.
- **T-03 — Order.** Each registered table declares its order; an unordered table is a defect.
- **T-04 — One table per purpose.** Two tables with the same purpose in one file are merged.
- **T-05 — History is append-only.** A dated row is never edited or removed.

### 4.1 Table registry

| Table | File | Columns (exact) | Order |
|---|---|---|---|
| Backlog entries | `*/BACKLOG.md` | `ID` · `Date` · `Type` · `Description` · `Origin` · `Priority` · `Status` | ID ascending |
| Approved decisions | `DECISIONS.md` §1 | `#` · `Date` · `Decision` · `Context / reason` | ID ascending |
| Contract history | `api-contract.md` | `Date` · `Version` · `Change` · `Scope` | chronological |
| Contract errors | `api-contract.md` §1 | `HTTP code` · `When` | numeric ascending |
| Core invariants | `00-core/MODULE.md` §4 | `ID` · `Invariant` · `Source of truth` | ID ascending |
| Acceptance | `REQUIREMENTS.md` §9 | `FR` · `Criterion` · `Evidence` · `Status` | identifier ascending |
| Module inventory | `PROJECT_STATE.md` §6 | `#` · `Module` · `State` · `Tag` · `Open items` · `Documentation` | module number ascending |
| Key-value facts | `PROJECT_STATE.md` §2 | `Key` · `Value` | semantic |
| Accounts | `PROJECT_STATE.md` §8 | `User` · `Password` · `Notes` | role, then address |
| Services | `PROJECT_STATE.md` §8 | `Service` · `Credentials` · `Notes` | service name |
| Release notes | `RELEASES.md` | `Tag` · `Date` · `Modules` · `Migrations` · `Contract` · `Upgrade / rollback` | tag ascending |
| Glossary | `GLOSSARY.md` | `Term` · `Definition` · `Canonical name (wire / DB / UI)` | alphabetical |

## 5. Vocabularies

- **V-01 — Module states.** `Pending` · `In analysis` · `Implementation proposal` · `In development` · `Implemented` · `Tested` · `Blocked`, plus `Active (permanent)` for module 0.
- **V-02 — Backlog status.** `new` · `in progress` · `accepted` · `blocked` · `deferred` · `implemented (YYYY-MM-DD[, vX.Y.Z])` · `moved (<ID>, YYYY-MM-DD)` · `discarded`.
- **V-03 — Backlog type.** `correction` · `improvement` · `restructuring` · `security` · `performance` · `docs` · `test` · `tech-debt`.
- **V-04 — Priority.** `high` · `medium` · `low`. Severity for a defect: `blocking` · `major` · `minor` · `advisory`.
- **V-05 — Document state.** `draft` · `proposed` · `approved` · `current` · `superseded` · `archived`.
- **V-06 — No synonyms.** One token per concept: `implemented`, never `done`, `resolved` or `closed`; `Tested`, never `Verified`.

## 6. Identifiers and references

| Prefix | Scope | Owner file | Outside the owner |
|---|---|---|---|
| `D-` | project decision | `DECISIONS.md` §1 | never qualified |
| `CR-` | core invariant | `00-core/MODULE.md` §4 | never qualified |
| `CORE-` | core work item | `00-core/BACKLOG.md` | never qualified |
| `SEC-` | security proposal | `SECURITY-BACKLOG.md` | never qualified |
| `DOC-` | documentation item | `DOCUMENTATION-BACKLOG.md` | never qualified |
| `B-` | backlog entry | `<NN>/BACKLOG.md` | `<NN> B-NN` |
| `FR-`, `BR-`, `NFR-`, `AC-` | requirement | `<NN>/REQUIREMENTS.md` | `<NN> FR-NN` |
| `DEF-`, `IMP-` | audit finding | the backlog row that records it | `<NN> DEF-NN` |

- **R-01 — Global namespaces.** `D-`, `CORE-`, `CR-`, `SEC-` and `DOC-` are unique repository-wide and never qualified.
- **R-02 — Module namespaces.** `B-`, `FR-`, `BR-`, `NFR-`, `AC-`, `DEF-` and `IMP-` are module-scoped; the bare form is allowed only inside the owning module.
- **R-03 — Global files qualify.** `PROJECT_STATE.md`, `DECISIONS.md`, `WORKFLOW.md`, `AGENTS.md`, `ARCHITECTURE.md`, `api-contract.md`, `SECURITY-BACKLOG.md` and `DOCUMENTATION-BACKLOG.md` always write the qualified form.
- **R-04 — One meaning per file.** A bare token whose value exists in two modules is forbidden.
- **R-05 — Link form.** The link text is the qualified identifier and the target is the owning file.
- **R-06 — Immutability.** An identifier is never renumbered or reused; a replaced decision keeps its identifier.
- **R-07 — External references resolve.** A path exists; a variable appears in `.env.example`; an error code appears in `api-contract.md`.
- **R-08 — History exemption.** `CHANGELOG.md` and `docs/plans/*` are append-only and never retro-normalised; each new entry obeys this standard.

## 7. Canonical skeletons

- **F-01 — Fixed slots.** A file uses the numbered slots of its catalogue; an omitted slot keeps its number reserved.
- **F-02 — Clarifier.** A slot title may carry one parenthetical clarifier after the canonical title.
- **F-03 — Free block.** Everything that does not fit goes to the last slot, `Module-specific notes`, as `###` subsections.
- **F-04 — Empty optional slot.** Omit it; write `_not applicable_` only when the absence is informative.
- **F-05 — Free headings.** `AGENTS.md` carries the H1, the four front-block keys and `**Last update:**`; its `##` headings are free and unnumbered.

### 7.1 File registry

| File | H1 | Required slots |
|---|---|---|
| `PROJECT_STATE.md` | `# PROJECT_STATE.md` | 1 Project · 2 Stack and environment · 3 Architecture (one line) · 4 Way of working · 5 Quick links · 6 Module inventory and state · 7 Open problems and pending corrections · 8 Development credentials and data · 9 Next steps |
| `WORKFLOW.md` | `# WORKFLOW.md — way of working` | 1 Incremental development · 2 Per-module cycle · 3 Module states and life cycle · 4 Change management · 5 Version control and commits · 6 Documentation honesty · 7 Documentation maintenance |
| `DECISIONS.md` | `# DECISIONS.md` | 1 Approved decisions · 2 Adopted by default · 3 Conditioning design requirements · 4 Open questions · 5 Decision change history |
| `ARCHITECTURE.md` | `# ARCHITECTURE.md` | 1 General architecture · 2 Code organization · 3 Frontend ↔ backend communication · 4 Database · 5 Global data model · 6 General conventions · 7 Repository organization · 8 Non-functional requirements · 9 Data classification and retention · 10 Testing strategy |
| `api-contract.md` | `# <Project> API contract — vX.Y` | 1 Cross-cutting conventions · 2 Permission model · 3+ one slot per module area · last two: `Records pending in future versions`, `Contract change history` |
| `SECURITY-BACKLOG.md` | `# SECURITY-BACKLOG.md` | 1 Baseline already implemented · 2+ one `## SEC-NN — Title` per entry · last: `Not proposed (with rationale)` |
| `DOCUMENTATION-BACKLOG.md` | `# DOCUMENTATION-BACKLOG.md` | 1 Entries · 2 States · 3 Types |
| `DOC-STANDARD.md` | `# Documentation standard — vX.Y` | 1 Scope, authority and language · 2 Rule identifiers · 3 Universal skeleton · 4 Tables · 5 Vocabularies · 6 Identifiers and references · 7 Canonical skeletons · 8 Lifecycle coverage · 9 Agent contract · 10 Enforcement · 11 Migration · 12 Governance · 13 Change history |
| `GLOSSARY.md` | `# GLOSSARY.md` | 1 Terms |
| `RELEASES.md` | `# RELEASES.md` | 1 Releases |
| `AGENTS.md` | `# AGENTS.md — project instructions` | free headings (F-05) |
| `<NN>/MODULE.md` | `# Module NN — <Name>` | 1 Purpose · 2 Scope · 3 Actors and screens · 4 Domain model · 5 Delivered features · 6 Module documentation map · 7 Decisions · 8 Risks and known limitations · 9 Next step · 10 Module-specific notes |
| `<NN>/REQUIREMENTS.md` | `# Module NN — REQUIREMENTS` | 1 Goal · 2 Functional requirements · 3 Business rules · 4 Flows · 5 Validations · 6 Edge cases · 7 Out of scope · 8 Dependencies · 9 Acceptance criteria · 10 Module-specific notes |
| `<NN>/TECHNICAL.md` | `# Module NN — TECHNICAL` | 1 Design and principles · 2 Endpoints · 3 Migrations · 4 Backend implementation · 5 Frontend implementation · 6 Tests and evidence · 7 Performance and limits · 8 Risks and known limitations · 9 Implementation status · 10 Module-specific notes |
| `<NN>/CHANGELOG.md` | `# Module NN — CHANGELOG` | dated `##` entries, newest first |
| `<NN>/BACKLOG.md` | `# Module NN — BACKLOG (corrections and future work)` | 1 Entries · 2 States · 3 Types |

### 7.2 Module 0 variant

Module 0 uses `MODULE.md`, `TECHNICAL.md`, `BACKLOG.md` and `CHANGELOG.md`, with no `REQUIREMENTS.md`. `MODULE.md` slot 3 becomes `Boundary rule`, slot 4 `Invariants (CR-NN)`, slot 5 `Lifecycle and state` and slot 6 `Documentation map`; `TECHNICAL.md` slots 1–5 become `Shared backend layer`, `Boot order`, `Middleware and request path`, `Shared frontend layer` and `Migrations`.

### 7.3 Plans and annexes

A plan in `docs/plans/` carries `**Status:**` with a V-05 token, `**Decision:**` from `approved` onwards and `**History:** append-only`. An annex lives in `docs/modules/<NN>-<slug>/ASSETS/` and needs the H1, the front block and `**Last update:**` only; the numbered slots and the table registry do not apply to it, and it never holds a fact that belongs to its module.

## 8. Lifecycle coverage

- **L-01 — Every phase has a home.** A lifecycle fact with no home in §7 is registered here before it is written anywhere.
- **L-02 — No speculative artifacts.** A file is created only when its trigger occurs.

| Phase | Artifact | Home |
|---|---|---|
| Discovery | goal, scope | `MODULE.md` §1–2 |
| Requirements | requirements, rules, flows, validations | `REQUIREMENTS.md` |
| Requirements | non-functional targets | `ARCHITECTURE.md` §8 |
| Design | architecture, conventions, data model | `ARCHITECTURE.md` |
| Design | decisions and alternatives | `DECISIONS.md` |
| Design | wire contract | `api-contract.md` |
| Planning | roadmap, states, credentials | `PROJECT_STATE.md` |
| Implementation | work log and pending work | `CHANGELOG.md`, `BACKLOG.md` |
| Verification | test strategy and evidence | `ARCHITECTURE.md` §10, `REQUIREMENTS.md` §9 |
| Release | release notes and tags | `RELEASES.md`, `WORKFLOW.md` §5 |
| Security | baseline and gaps | `SECURITY-BACKLOG.md` |
| Maintenance | reopening and change management | `WORKFLOW.md` §3–4 |
| Knowledge | index, glossary, onboarding | `GLOSSARY.md`, `AGENTS.md` |

## 9. Agent contract

The document stays readable as a document; machine needs are met with stable markers.

- **AG-01 — Front block is the index.** An agent decides whether to open a file from `Purpose` and `Read when` alone.
- **AG-02 — Fixed markers.** `**Purpose:**`, `**Read when:**`, `**Canonical for:**`, `**Do not duplicate:**`, `**Status:**`, `**Last update:**`, `**History:**` are bold, at line start and always spelled this way.
- **AG-03 — Single owner.** A fact has one home; the other files link to it.
- **AG-04 — No anaphora.** Every item names its subject.
- **AG-05 — Absolute dates.** `2026-11-16`, never a relative expression.
- **AG-06 — Deterministic anchors.** Heading text avoids punctuation variants so the anchor stays computable.
- **AG-07 — Tables for facts, prose for reasons.** No table row without a stable key column.
- **AG-08 — Explicit absence.** `not recorded` or `pending (owner)`; never blank.
- **AG-09 — Bounded onboarding.** A task reads at most three files and never another module.
- **AG-10 — Where does this fact go?** A capability → `REQUIREMENTS.md`; how something is implemented → `TECHNICAL.md`; a convention → `ARCHITECTURE.md` §6; a decision → `DECISIONS.md`; a wire change → `api-contract.md`; a date → `CHANGELOG.md`; pending work → `BACKLOG.md`; a security gap → `SECURITY-BACKLOG.md`; a documentation inconsistency → `DOCUMENTATION-BACKLOG.md`; a release → `RELEASES.md`; a term → `GLOSSARY.md`; the global state → `PROJECT_STATE.md`.
- **AG-11 — Citable rules.** A finding cites the rule identifier.

## 10. Enforcement

`scripts/check-docs.mjs` runs over the repository. Without a flag it reports; with `--strict` any `must` finding exits non-zero. `--json` prints one machine-readable object.

| # | Check | Rule | Severity |
|---|---|---|---|
| E-01 | every relative link resolves, including its anchor | G-18 | must |
| E-02 | the four front-block keys and `**Last update:**` exist on live documents | G-10, AG-02 | must |
| E-03 | the H1 is the first content line and matches its §7.1 row, where one exists | G-09 | must |
| E-04 | `##` slots ascend from 1 and `####` never appears | G-13 | must |
| E-05 | no placeholder marker (`TODO`, `TBD`, `FIXME`) outside a code span | AG-08 | must |
| E-06 | table rows keep a constant column count and no empty cell | T-01, T-02 | must |
| E-07 | module folders carry their required files | §7.1, §7.2 | must |
| E-08 | every document under `docs/` is reachable from `PROJECT_STATE.md` or `AGENTS.md` | AG-03 | should |
| E-09 | no absolute or `file://` link | G-18 | must |
| E-10 | `**Last update:**` is a `YYYY-MM-DD` date | G-16 | must |
| E-11 | line 1 of `PROJECT_STATE.md` is the recorded control comment | G-21 | must |
| E-12 | no `####` heading, no second separator, and none in `AGENTS.md` | G-13, G-14 | must |
| E-13 | a relative link targets a document outside the documentation scope of §1 | G-01, G-18 | must |

**Scope.** E-02 skips `CHANGELOG.md` and `docs/plans/*`. E-04 and E-06 skip an annex. E-07 reads `docs/modules/*`. The gate reads `docs/**` and the root files of §7.1 only: a root document outside the registry is never opened, never checked and never reachable.

**Remediation loop.** Script first, auditor second. Structure before meaning: a semantic review on top of a broken structure produces findings that the next fix invalidates.

## 11. Migration

_not applicable_ — a new project starts with this standard at v1.3.

## 12. Governance

- **L-03 — Change of the standard.** A new or amended rule is a row in §13; the owner approves.
- **L-04 — No smuggled requirements.** This standard defines form only.
- **L-05 — Uncheckable rules name a reviewer.** A rule that cannot be automated states who reviews it at closure.
- **L-06 — Self-application.** This file follows its own skeleton.

## 13. Change history

| Date | Version | Change |
|---|---|---|
| 2026-11-16 | v1.0 | First version: universal skeleton, table registry, vocabularies, identifier rules, file registry, agent contract and the checks that the gate runs. |
| 2026-11-16 | v1.1 | The scope is the file registry: a root document outside it leaves the standard and the gate. New check E-13 rejects a link to a document outside the scope. |
| 2026-11-16 | v1.2 | Traceability of the enforcement table: the control comment becomes G-21, E-07 cites its skeletons, E-12 covers `AGENTS.md` and E-03 states where an H1 row exists. `L` joins the identifier prefixes and G-04 exempts the fixed control comment. |
| 2026-11-24 | v1.3 | The annex is defined as `docs/modules/<NN>-<slug>/ASSETS/*.md`; E-04 and E-06 skip it and E-02 no longer skips it. A root `.html` tool leaves the standard. |
