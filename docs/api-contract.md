# Project API contract — v0.1

> **Purpose:** the single source of truth for the backend ↔ frontend coupling.
> **Read when:** adding or changing an endpoint, a payload, a status or an error code.
> **Canonical for:** endpoints, payloads, statuses, error codes and their change history.
> **Do not duplicate:** implementation (`TECHNICAL.md`) and decisions (`DECISIONS.md`).

**Last update:** 2026-11-16

No endpoint exists yet: the contract starts with its conventions and grows with
every approved module.

---

## 1. Cross-cutting conventions

- Format: JSON over HTTP, UTF-8, field names in `snake_case`.
- Errors: one shape, `{"error": {"code": "...", "message": "..."}}`, for every route, including unknown routes.
- Caching: authenticated responses are not cached.
- Base path: not recorded.

| HTTP code | When |
|---|---|
| 400 | `invalid_body` — unparseable payload |
| 401 | `not_authenticated` · `invalid_credentials` · `session_expired` |
| 403 | `permission_denied` — authenticated with insufficient permission |
| 404 | `resource_not_found` |
| 405 | `method_not_allowed` |
| 409 | `unique_conflict` |
| 422 | `invalid_form` |
| 500 | `internal_error` — never leaks internals |

## 2. Permission model

not recorded.

## 3. Records pending in future versions

- not recorded.

## 4. Contract change history

| Date | Version | Change | Scope |
|---|---|---|---|
| 2026-11-16 | v0.1 | Initial conventions and error table; no endpoint yet | `Cross-cutting` |
