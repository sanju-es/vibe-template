# WORKFLOW.md — way of working

> **Purpose:** the project way of working: cycle, states and documentation maintenance.
> **Read when:** starting a session, closing a module, or changing a process rule.
> **Canonical for:** the per-module cycle, the module life cycle, change management, versioning and documentation maintenance.
> **Do not duplicate:** the form (`DOC-STANDARD.md`) and the decisions (`DECISIONS.md`).

**Last update:** 2026-11-16

The workflow is a cycle of approved increments: nothing is implemented before a
proposal exists and nothing is claimed without evidence.

---

## 1. Incremental development by modules

- Work is done on **one main module at a time**: a screen, a component, a group of endpoints or a functional area.
- The assistant **does not choose modules on its own initiative**: after closing one, it waits for the owner.
- The inventory and the states live in [`PROJECT_STATE.md` §6](../PROJECT_STATE.md#6-module-inventory-and-state). The recommended order is recorded, but the owner decides.

## 2. Per-module cycle

1. **Analysis** — goal, screens or components, user actions, data, operations, endpoints, entities, business rules, validations, permissions, dependencies. Missing information is asked for, never invented. Approval moves the module to `Implementation proposal`.
2. **Implementation proposal** — what is built, how it behaves, backend changes, frontend changes, database changes, reusable components and planned tests. **Approval is required** and no implementation code exists in this state.
3. **Implementation** — backend, endpoints, UI connected to the real API, validations and the loading, success, empty and error states. Conventions and reuse are respected and other modules are not touched. Approval of the proposal moves the state to `In development`; the API contract is updated before or at the same time as the code.
4. **Closure** — the module ends when the criteria are met and the documentation matches the code. The summary reports features, files, endpoints, database changes, tests and open problems, and the owner decides.

## 3. Module states and life cycle

- Valid states: V-01 in [`DOC-STANDARD.md`](DOC-STANDARD.md#5-vocabularies).
- Usual sequence: `In analysis` → `Implementation proposal` → `In development` → `Implemented` → `Tested`. `Blocked` applies from any state; `Pending` is the initial state of a roadmap module.
- **Module 0 exception:** the core container is always `Active (permanent)`, never closes as `Tested` and does not consume the active-module slot. Its items follow the same cycle one by one.
- The state reflects the reality of the moment; nothing is left `In development` preventively.
- **Reopening:** state → `In development`, cause recorded in the module `CHANGELOG.md`; closing demands the tests again.
- Bug fix: restores documented behaviour. New functionality: a new requirement and the change flow of §4.

## 4. Change management

- Analysis of the impact first: affected modules, technical and functional consequences, incompatibilities. Then a proposal and the owner approval.
- A change belonging to another module is added to that module pending list.
- A small change does not authorise a general refactor.
- Documentation is updated in the same task in which the change happens.

## 5. Version control and commits

- Versioning follows the decision recorded in `DECISIONS.md`; this section states the mechanics only.
- **One version = one milestone** with substantial changes: a module closure, a major feature, an architectural or database change. The tag is placed on the milestone commit.
- **Commits are made per task or per approved phase**, each one grouping the code and the documentation updated in that task. Documentation is never left out of the commit that implements its change.
- One repository, one agent session at a time. Parallel work uses separate worktrees.
- Staging uses explicit paths; `git add -A` and `git add .` are forbidden.

## 6. Documentation honesty

- Nothing is marked as implemented when it is only planned.
- Proposals never become confirmed requirements or approved decisions by themselves.
- Recorded information is never deleted: a change of decision is a new dated entry.
- The assistant proposes, warns and explains; the owner has the final word.

## 7. Documentation maintenance

**When starting a session**

- Read `PROJECT_STATE.md` and identify the active module; load **only** its documentation. Do not load the documentation of other modules.
- A module `BACKLOG.md` is read only when reopening that module or planning its reopening.

**When working on a module**

- Update `MODULE.md` when the scope or the state changes, `REQUIREMENTS.md` when a requirement changes, `TECHNICAL.md` when the implementation, the API or the data model changes and `CHANGELOG.md` when a relevant change occurs.
- Update `PROJECT_STATE.md` when the global state changes.
- On reopening, read the module `BACKLOG.md`, triage it into the requirements and align the status header of every file of the module in the same step.

**When modifying the architecture**

- Update `ARCHITECTURE.md`, record the decision in `DECISIONS.md` and update the affected references, including `api-contract.md` when the API is involved.

**When closing a module**

- Check that the documentation matches the code and align every status header with `PROJECT_STATE.md` §6, including the tag and the contract version.
- Leave the module `BACKLOG.md` with its header and its entries.
- Run `node scripts/check-docs.mjs --strict`; a blocking finding stops the closure.
- Run the `docs-auditor` subagent over the module and the global files it touches; a blocking finding stops the closure.
- Remediation order: script, auditor, fixes, script again, and the auditor in delta mode when the fixes renamed sections or touched more than two files.

**Golden rule:** `PROJECT_STATE.md` never concentrates detail. It is an index and the global state; the detail lives in `ARCHITECTURE.md`, `DECISIONS.md`, `api-contract.md` and `docs/modules/`.
