# Skill recipes

> **Purpose:** outline for the project skills that the initialization generates.
> **Read when:** during stage 3, when writing `.opencode/skills/<id>/SKILL.md`.
> **Canonical for:** the section order and the minimum content of a generated skill.
> **Do not duplicate:** the protocol (`.opencode/skills/bootstrap-wizard/SKILL.md`).

**Last update:** 2026-11-16

A generated skill is short, imperative and specific to this project. It states
rules, never explanations, and it never authorises a refactor or a dependency.

## Required sections

1. `## Read first` — the two or three documents the skill depends on.
2. `## Rules` — numbered, one rule per line, with the forbidden alternative.
3. `## Verification` — the literal commands or the manual check.
4. `## Output` — what the report of a task must contain.

Frontmatter: `name` in title case and a `description` of one sentence that begins
with the layer and names when to use it.

## Backend layered service (Go, Java, Python, Node)

- Layer responsibilities: transport parses and writes, service owns rules,
  repository owns queries, domain owns types and errors.
- Forbidden: queries in the service, business rules in the handler.
- Errors: one error type with a code and a message, mapped to a status in one
  place; a new code enters the API contract first.
- Every rule gets a test at the service level and at the route level.
- Context propagation and structured logs; never log credentials or tokens.
- No abstraction until a second real implementation exists.

## Frontend application (Vue, React, Svelte)

- One typed client for the API; components never call the transport directly.
- Global state only for session, permissions and cross-screen data.
- Design tokens instead of raw colours; both themes.
- Every asynchronous flow has loading, success, empty and error states.
- All user text through the translation dictionary, one key set per locale.
- Accessibility: labelled controls, focus visible, keyboard reachable dialogs.

## Relational database (PostgreSQL, MySQL, SQLite)

- Hand-written SQL in the repository layer; no query builder unless approved.
- Migrations are forward-only in practice and always reversible; both
  directions exist and are exercised once on the development database.
- Naming: tables plural, columns snake_case, one meaning per name.
- Every foreign key has an index; every unique rule is an index, not a
  convention.
- Seeds are idempotent and never overwrite owner data.

## API service only (no interface)

- Transport parses and writes, service owns the rules; no handler holds a query
  or a business rule.
- Every route resolves the caller before the handler and declares its permission
  in the contract.
- One error envelope and one code per cause; a new code enters the contract
  before the code exists.
- Tests at the route level for status and payload, and at the service level for
  every rule.
- The contract is the only surface: no interface, no design token and no locale.

## Command-line tool or library

- One entry point; the commands, the flags and the exit codes are the public
  contract and change with a recorded decision.
- Data on stdout, messages on stderr, a non-zero exit on failure; never a silent
  failure.
- No interactive prompt in a library; a tool asks only when the owner approved
  the interaction.
- Standard library first; one justified dependency at a time, with the reason
  recorded.
- Tests call the public entry point and assert the exit code and the output.

## Secure coding (always generated)

- Server-side authorisation on every protected route; hiding UI is not a control.
- Validation in the backend; the frontend validates for comfort only.
- Secrets from the environment; none in the repository, the logs or the client.
- Sessions: httpOnly cookie, rotation on login, revocation list when applicable.
- Dependencies: one justified addition at a time, with the reason recorded.

## Audit agents

`quality-gate` runs the real build, the real tests, the contract diff and the
documentation check. `security-auditor` reviews only the changed surface.
`docs-auditor` reads every markdown file and reports, never edits.
