# Changelog

## 0.1.0 — unreleased

- Skill entry point with preflight and subcommand routing for Claude Code (`/job-hunt`) and Codex (`$job-hunt`).
- Private data safeguards: data only in a Git-ignored `docs/job_hunt/`, a second `.gitignore`, history copies before overwrites, no deletions.
- Directive files `PROFILE.md`, `IDEAL_ROLES.md`, `IDEAL_COMPANIES.md`, `IDEAL_BENEFITS.md`, `RED_FLAGS.md` and `BLACKLIST.md`, with templates and completeness checklists.
- `interview` and status.
- Repository checks: skill frontmatter, referenced files, no committed private data, and a personal-data deny-list in CI.
