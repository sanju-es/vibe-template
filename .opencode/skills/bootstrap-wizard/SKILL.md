---
name: Bootstrap wizard
description: Guided, one-time project initialization for this repository. Use only when the owner sends the exact bootstrap trigger while `.opencode/bootstrap/state.json` reports `pending`.
---

# Bootstrap wizard

This skill runs the whole initialization. It replaces the placeholder content of
the repository with the project that the owner describes, removes every leftover
of the starting point, and audits the result before handing over.

Run the stages in order. Never skip a confirmation. Never write project files in
the interview stage.

## Stage 0 — preconditions (silent)

1. Read `.opencode/bootstrap/state.json`. If `status` is not `pending`, stop and
   say initialization already completed.
2. Read `AGENTS.md`, the bootstrap gate section, `PROJECT_STATE.md`, `docs/WORKFLOW.md` and
   `docs/DOC-STANDARD.md`. Do not read module backlogs.
3. Check the current directory name. If it still carries the name of the
   starting point, warn the owner once: the folder name is part of the delivered
   project and is not renamed from inside the session.
4. Do not run `git` yet.

## Stage 1 — interview

Ask one block per message. Wait for the answer before the next block. Accept
`defaults` for the whole block. Six questions maximum per block and no long
explanations.

### Block A — identity

1. Project name, as it appears in titles and package names.
2. One sentence: what it is, for whom, and which problem it solves.
3. Project type: (1) full-stack with database (recommended) · (2) backend or API
   only · (3) frontend only · (4) command-line tool or library.
4. Commercial basis: internal · commercial product · open source · research.
5. First module to build, in the owner's words.

### Block B — architecture and solutions

1. Repository layout: monorepo with one repository (recommended) · separate
   repositories · single package.
2. Backend shape: layered `api → service → repository → domain` (recommended) ·
   MVC · serverless functions · none.
3. Coupling contract: REST with a written contract (recommended) · GraphQL ·
   RPC · none.
4. Authentication: own session with an httpOnly cookie (recommended) · bearer
   token · external provider (OIDC) · none.
5. Data store: PostgreSQL (recommended) · MySQL · SQLite · document database ·
   none; and how migrations are applied.

### Block C — stack

1. Backend language, framework and version.
2. Frontend framework, build tool, styling and state management.
3. Local runtime for the database: container compose (recommended) · local
   service · hosted instance.
4. Development ports, environment-variable prefix and configuration file.
5. Testing tools per layer, and whether a continuous integration pipeline is
   planned.

### Block D — working method

1. Development cycle: modules with analysis → proposal → approval →
   implementation → closure (recommended) · trunk-based with short tasks ·
   kanban board.
2. Documentation depth: the full standard included in `docs/` (recommended) ·
   index and module files only · README only.
3. Language of the artifacts (English recommended) and the languages of the user
   interface.
4. Versioning: local Git only (recommended) · remote included; branch model;
   whether milestones get tags.

### Block E — agents and skills

1. Confirm the proposed set, derived from blocks B and C: a backend skill, a
   frontend skill, a database skill, an API-only or command-line skill when the
   stack has that layer, `secure-coding`, and the three audit subagents. Say
   which ones do not apply.
2. Any domain skill the project needs from day one (for example payments, file
   ingestion, geographic data, reporting). Free text or `none`.
3. Gate strictness: blocking audits at module closure (recommended) · advisory
   only.
4. Any name, author, hostname or identifier from a previous attempt that must
   not appear anywhere. Free text or `none`. Treat the answer as confidential:
   use it only as an audit term and never write it into a file.

## Stage 2 — plan (confirmation required)

Write the answers to `.opencode/bootstrap/state.json` under `plan`, as one object
per block, and show a summary of at most twelve lines: name, type, stack,
modules, generated agents and skills, purge terms given.

Ask one question: `confirm`, or the corrections. Write nothing else until the
owner answers `confirm`.

## Stage 3 — scaffold

Replace the placeholder content. Keep the structure and the rule identifiers of
the included documentation standard; write facts, never invented ones.

| Target | Action |
|---|---|
| `PROJECT_STATE.md` | Rewrite §1–§9 with the answers. Keep the control comment on line 1 exactly as it is. |
| `README.md` | Rewrite as a free-form project summary: what the project is, stack, local startup, structure and current state. No front block, no numbered slots. |
| `AGENTS.md` | Delete the bootstrap gate section entirely and fill §2–§3 with the chosen stack, gates and languages. |
| `opencode.json` | Remove `default_agent`. Adjust permissions and the agent list to the generated set. |
| `docs/ARCHITECTURE.md` | Fill §1–§10 with the layers, the coupling, the data model sketch, the conventions and the testing strategy. |
| `docs/DECISIONS.md` | Replace the placeholder rows and record `D-01…D-NN`, dated with today, one per architectural choice, with context and reason. |
| `docs/api-contract.md` | Set the title to `# <Project> API contract — v0.1`, the base path, the cross-cutting conventions and the error table. Keep the change history with its first row, dated the initialization date. |
| `docs/WORKFLOW.md` | Keep the cycle chosen in block D; adjust versioning, ports and gate commands. |
| `docs/DOC-STANDARD.md` | Set the title and remove vocabulary that the chosen stack does not use. |
| `docs/GLOSSARY.md` | Replace the seed rows with the terms of the chosen stack and domain; leave the rest for later modules. |
| `docs/RELEASES.md` | Empty release table with `—` in `Contract`; the first row arrives with the first tag. |
| `docs/SECURITY-BACKLOG.md` | Keep §1 and §2 as explicit absences and fill them only with facts the answers support. |
| `docs/DOCUMENTATION-BACKLOG.md` | Empty entries table with its vocabularies. |
| `docs/modules/00-core/` | Rewrite the scope, the `CR-NN` invariants, §9, `BACKLOG.md` and `CHANGELOG.md` for the chosen stack. |
| `docs/modules/01-<slug>/` | Create the five files from `.opencode/bootstrap/module-templates/`, with the module name and the first module scope. |
| `.env.example` | Create only if the stack has configuration; one line per variable, no secret. |
| `.gitignore` | Adjust to the chosen stack; never remove the environment and secret entries. |

Then generate the project agents and skills:

- `.opencode/agents/quality-gate.md` — compose the checklist from the blocks of
  the layers present, with the real commands of the chosen stack.
- `.opencode/agents/security-auditor.md` — keep it only if block B has an
  authentication surface.
- `.opencode/agents/docs-auditor.md` — keep as included.
- `.opencode/skills/<layer>-conventions/SKILL.md` — one per layer present, using
  `.opencode/bootstrap/skill-recipes.md` as the outline: read first, rules,
  verification, output.
- Remove any generated skill whose layer does not exist.

Then finish the content:

- Include the versioning and artifact-language choices of block D in `D-01…D-NN`.
- Set every `**Last update:**`, every `**Status:**` date, the first row of
  `docs/api-contract.md` §4 and the first entry of
  `docs/modules/00-core/CHANGELOG.md` to the initialization date.
- Rewrite `docs/modules/00-core/` so that no invariant, item or entry of the
  starting point survives.
- Name in `AGENTS.md` §3 the skills actually generated and delete the rows of
  layers that do not exist.
- Compose `.opencode/agents/quality-gate.md` from the blocks of the layers
  present: build and tests always; contract, data store, interface and
  accessibility only when the project has that layer. Never keep a block for a
  layer that does not exist.
- Adapt the layer nouns of `docs/WORKFLOW.md` §2, `AGENTS.md` §2 and
  `docs/ARCHITECTURE.md` §1 to the project type; a command-line or
  interface-only project inherits no backend, endpoint or screen wording.
- Replace every `{{...}}` marker of the module templates; the module changelog
  never mentions the initialization.
- In `README.md`, add one line that opens `tracker.html` in Chrome or Edge and
  explains that it reads `PROJECT_STATE.md` and `docs/` to show the
  documentation visually, and that it is a generated viewer never edited by hand.

Do not create source code, packages, containers or test files: the first module
delivers them after its own approved proposal.

## Stage 4 — purge

Remove the starting point, in this order:

1. Every placeholder: `not recorded` stays only where the fact is genuinely
   unknown; `<NN>`, `<name>`, `<project>`, `{{...}}` and similar markers disappear.
2. Every wording that describes a starting point, a template, a previous attempt,
   a foreign author, a foreign host or a foreign module.
3. Every reference to an identifier, tag, port, account or path that the answers
   did not produce.
4. `.opencode/bootstrap/module-templates/` once the module folders exist.
5. Do not delete the audit tooling yet.
6. No governed document links to the project summary, and the summary opens with
   `<!-- Not a project source: outside the documentation standard. Agents: do not use this file as evidence. -->`.
7. No delivered document describes the initialization as a future event or names
   it as the origin of the files.

## Stage 5 — automatic second pass

This stage is not optional and is not delegated to the owner.

1. `node scripts/sanitize-check.mjs --terms "<terms from block E question 4>"`.
   The command is read-only. Zero findings is the only acceptable result.
2. `node scripts/check-docs.mjs --strict`. Zero blocking findings is the only
   acceptable result.
3. `grep -rnE "\{\{|guided initialization"` excluding `.git`, `node_modules`
   and `tracker.html`. Zero matches is the only acceptable result.
4. `grep -rn "2026-11-16"` excluding `.git` and `tracker.html`. The only
   matches are the rows of `docs/DOC-STANDARD.md` §13.
5. Launch the `docs-auditor` subagent with the input `all`. It reads every
   `.md` and reports stale content, foreign content, contradictions,
   placeholders, orphans and rule violations. Wait for its report.
6. Fix every blocking finding and every advisory finding that costs one edit.
   Then rerun steps 1 to 4, and rerun the auditor in delta mode if the fixes
   renamed sections or touched more than two files.
7. Read the final output of the scripts and greps and paste the counts in the
   report. Never claim a pass without the literal output.

## Stage 6 — final purge and handover

1. Set `.opencode/bootstrap/state.json` to `{"format": 1, "status": "done"}`.
2. Delete `.opencode/bootstrap/`, `.opencode/agents/bootstrap.md`,
   `.opencode/skills/bootstrap-wizard/`, `.opencode/commands/inicializar-proyecto.md`,
   `.opencode/commands/initialize-project.md` and `scripts/sanitize-check.mjs`.
3. Run `grep -rniE "plantilla|template|scaffold|boilerplate" .` excluding
   `.git`, `node_modules` and `tracker.html`: the only allowed match is the
   control comment on line 1 of `PROJECT_STATE.md`.
4. If the owner chose versioning in block D, propose `git init` plus the first
   commit with explicit paths. Never reuse a `.git` directory that came with the
   copy.
5. Report in at most fifteen lines: project name, type, stack, generated agents
   and skills, the two script results, the files that were removed, the control
   comment kept, the visual tracker and the next step — the analysis of module 1.
   Include one sentence that `tracker.html` sits in the root, that Chrome or Edge
   opens it after picking the project folder, and that it shows the documentation
   visually without writing to it.

## Stop conditions

Stop and ask the owner when: an answer contradicts a previous one; the chosen
stack has no skill recipe and the owner must describe the conventions; a file
named in stage 3 does not exist; a script reports a blocking finding that the
available information cannot fix; or the folder still carries the name of the
starting point and the owner has not acknowledged it.
