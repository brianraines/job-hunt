# Changelog

## 0.5.0 — unreleased

- `score companies` and `score jobs`: review a weight matrix with the operator (one row per company, or role and benefits, Must-have and Nice-to-have; weights sum to 100; first proposal 70/30), then rank ledger companies from their latest evals or the latest search's opportunities from their scorecards. Reports go to `scores/`; `score companies` also updates the ledger's `Last eval`. No web access needed.
- `eval` scores the company after writing its report and records the score in the report and the ledger; `search` adds a scorecard to each opportunity, scores them once the write-ups are finished, and orders by score within each rating. Scores never change a verdict or rating. A score is the weight of criteria confirmed met, out of 100; unknown criteria earn nothing and are reported as a share of weight.
- New reference `score.md` and template `SCORING.md`; status reports whether each matrix is set and in sync.

## 0.4.0 — unreleased

- `connect {company}`: records up to 10 recruiters and hiring managers per run from public search results only, with the spec's fields, duplicate handling and an operator-owned `Status`; refuses blacklisted companies before any query. New template `CONNECTIONS.md`.
- Status reports connections by status and suggests `connect` for companies with strong postings.

## 0.3.0 — unreleased

- `search`: reads active ledger boards through public tracking-system endpoints, re-verifies stale rows, runs keyword web searches, opens up to 300 matching postings, confirms each is open, flags eligibility blockers, rates postings with the rubric, checks news for strong and possible matches, cross-references connections, and writes a dated report. New templates `SEARCH.md` and `seen.csv`; previously reported postings are skipped unless their title or rating changes.
- Privacy: public pages only, no LinkedIn automation, untrusted-content rule, and no private details in outgoing queries.

## 0.2.0 — unreleased

- `eval {company}`: refuses blacklisted companies without any outgoing query; finds and verifies the job board, checks Glassdoor, Levels.fyi and Blind without signing in, searches news for red-flag signals, lists matching open roles, applies the company verdict, writes a report and updates the ledger. New template `EVAL.md`.
- Interview builds the ledger in a new step after the blacklist is confirmed and the red flags and benefits are complete: it evaluates named companies and proposes batches of about 10, each evaluated first; only kept companies are added. Blacklist entries can list other names ("also known as …").
- New references: `rubric.md` (company and posting ratings), `ats-hosts.md` (job board hosts and public endpoints), `review-sites.md`.
- `NOTICE` credits the adapted material from github/awesome-copilot and squerne/open-career-skills.
- Repository check: every reference file must be reachable from `SKILL.md`.

## 0.1.0 — unreleased

- Skill entry point with preflight and subcommand routing for Claude Code (`/job-hunt`) and Codex (`$job-hunt`).
- Private data safeguards: data only in a Git-ignored `docs/job_hunt/`, a second `.gitignore`, history copies before overwrites, no deletions.
- Directive files `PROFILE.md`, `IDEAL_ROLES.md`, `IDEAL_COMPANIES.md`, `IDEAL_BENEFITS.md`, `RED_FLAGS.md` and `BLACKLIST.md`, with templates and completeness checklists.
- `interview` and status.
- Repository checks: skill frontmatter, referenced files, no committed private data, and a personal-data deny-list in CI.
