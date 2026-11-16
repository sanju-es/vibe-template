# Starting point

> **Purpose:** how to use this folder as the starting point of a new project.
> **Read when:** before the first OpenCode session on this folder.
> **Canonical for:** the copy procedure and the trigger phrase.
> **Do not duplicate:** the initialization protocol (`.opencode/skills/bootstrap-wizard/SKILL.md`).

**Last update:** 2026-11-16

This folder is a starting point, not a project. It is deleted automatically once
the guided initialization completes.

## Procedure

1. Create an empty folder named after the new project. The folder name becomes
   part of the delivered project, so it must not carry the name of this starting
   point.
2. Copy the **contents** of this folder into it. Do not copy `.git`, and never
   reuse a repository that already has history.
3. Open OpenCode with the new folder as the working directory.
4. Send exactly this message:

   ```
   inicializar proyecto
   ```

   `initialize project` and the other declared equivalents work as well.
5. Answer the five question blocks. Each block allows `defaults`.
6. Review the plan and answer `confirm`.

Any other first message receives a single line asking for the trigger. The
bootstrap agent enforces this through `opencode.json` (`default_agent`), the
`.opencode/agents/bootstrap.md` prompt and `AGENTS.md` §0, so the gate survives
the loss of any one of them.

## What the initialization leaves behind

- The documentation graph rewritten for the new project, with the included
  standard and its machine checks.
- The module 0 container and the first functional module folder.
- Project agents and skills derived from the chosen stack.
- `scripts/check-docs.mjs` as the documentation gate.
- The control comment on line 1 of `PROJECT_STATE.md`.

## What it removes

`.opencode/bootstrap/`, the bootstrap agent, the bootstrap skill, the two
initialization commands and `scripts/sanitize-check.mjs`. The second pass proves
the removal before the handover.
