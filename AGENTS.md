# Working in this repository

This repository publishes the `job-hunt` agent skill. The design contract is [docs/SPEC.md](docs/SPEC.md); change the spec first when behavior changes.

## Layout

- `skills/job-hunt/SKILL.md`: entry point. Keep it short; it routes each subcommand to one reference file.
- `skills/job-hunt/references/`: one file per procedure. Agents load only the file the current subcommand needs.
- `skills/job-hunt/templates/`: starting versions of the operator's private files.
- `scripts/check-skill.mjs` and `tests/`: repository checks, run by `npm test` and CI.

## Rules

- This repository is public. Never commit anyone's personal data: no real names of operators or contacts, phone numbers, emails, employers, salaries, or anything from a `docs/job_hunt/` folder. Examples use placeholders such as "Example Co".
- The skill must work the same in Claude Code and Codex. Do not depend on one agent's tools; where a tool helps (such as a structured question tool), say "if available" and give the plain-chat fallback.
- Use only standard skill frontmatter: `name`, `description`, `metadata`.
- Every path referenced from the skill in backticks must exist; `npm test` checks this.
- Adapted third-party material must be MIT-compatible and credited in `NOTICE`.
- Update `CHANGELOG.md` with each change.

## Checks

```sh
npm test
```

Runs the unit tests for the checker, then the checker itself: frontmatter, referenced files, no committed private data, and the personal-data deny-list when `PERSONAL_DATA_DENYLIST` is set (one value per line). CI reads it from a repository secret and fails if it is missing.

Before each release, run the acceptance checks in docs/SPEC.md in both Claude Code and Codex, with the skill installed from this repository.
