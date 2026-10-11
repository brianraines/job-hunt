# Directive files

Six directive files live in `DATA` (see `references/privacy.md`). Start each from its template in `templates/`. Each begins with a `Last reviewed: YYYY-MM-DD` line. Every file except `BLACKLIST.md` ends with **Must-haves** and **Nice-to-haves** lists; each item must be phrased so it can be checked against a job posting or a company.

A file is **complete** when it exists and passes its checklist below. A section containing only "not specified", a template placeholder or nothing at all does not count as filled.

## PROFILE.md

Template: `templates/PROFILE.md`. Who the operator is and which sources the skill may read.

Complete when it has:

- Location and time zone (an IANA name such as `America/Chicago`)
- Current employer, or "none"
- At least one resume source the current agent can read (a file path or URL), in priority order
- Must-haves and Nice-to-haves (for example work authorization or location constraints), each with at least one item or explicitly "none"

Optional: name, other context sources such as a portfolio site.

## IDEAL_ROLES.md

Template: `templates/IDEAL_ROLES.md`. The range of roles the operator would consider.

Complete when it has:

- At least one target title for each level the operator considers, in order of preference
- Technical focus areas
- Titles or work to exclude
- Search keywords and title variants
- At least one Must-have and one Nice-to-have

## IDEAL_COMPANIES.md

Template: `templates/IDEAL_COMPANIES.md`. The kind of company the operator wants, and the ledger of specific companies to target.

Complete when it has:

- Every profile section filled: domains of interest and to avoid; stage and size; engineering culture; work arrangement and acceptable locations; industries and business models
- At least one Must-have and one Nice-to-have

The ledger may be short. Fewer than 20 `active` companies is a warning, not a gap: report it, and offer to add companies during the interview.

Ledger columns, one row per company:

| Column | Contents |
| --- | --- |
| Company | Name |
| Why it fits | One line tied to the company profile |
| Job board URL | The company's careers page or tracking-system board, never an aggregator |
| Board type | Tracking-system name from `references/ats-hosts.md`, or "careers page" |
| Last verified | Date the board URL last loaded and listed jobs, or "not verified" |
| Glassdoor | Public overall rating and review count with link, or "not checked" |
| Levels.fyi | Link and median total compensation at the operator's target level, or "not checked" |
| Blind | Link to the public company page, or "not checked" |
| Reviews checked | Date the three review columns were last refreshed |
| Last eval | Verdict and the path of the latest eval report |
| Status | `active` or `paused`, with an optional reason |

Interview, `eval` and `search` write the ledger. Search only refreshes `Last verified`, the three review columns and `Reviews checked` of existing rows; it never adds, removes or reorders rows or changes any other column.

## IDEAL_BENEFITS.md

Template: `templates/IDEAL_BENEFITS.md`. Compensation and benefits expectations.

Complete when it has:

- A minimum acceptable base salary or total compensation, with currency
- At least one Must-have and one Nice-to-have

## RED_FLAGS.md

Template: `templates/RED_FLAGS.md`. What to avoid.

Complete when it has:

- At least one hard dealbreaker and one soft warning sign, each checkable against a posting or company
- Review-score thresholds, or explicitly "none"

## BLACKLIST.md

Template: `templates/BLACKLIST.md`. Companies the skill must never search against.

Complete when the file exists and its `Confirmed:` line carries a date: the operator has confirmed the list, which may be empty.

Rules:

- Add a company only after the operator explicitly approves that company.
- Never send a blacklisted company's name in a search query or URL, never fetch its job board, never propose it for the ledger, and refuse to evaluate or research it.
- Remove an entry only when the operator asks.

## Other data files

These are not directive files and are never part of the completeness check.

| Path in `DATA` | Template | Written by |
| --- | --- | --- |
| `CONNECTIONS.md` | `templates/CONNECTIONS.md` | `connect`; the `Status` column belongs to the operator |
| `evals/{company-slug}-{yyyyMMdd-HHmmss}.md` | `templates/EVAL.md` | `eval` |
| `search/{yyyy-mm-dd}/SEARCH-{yyyyMMdd-HHmmss}.md` | `templates/SEARCH.md` | `search` |
| `search/seen.csv` | `templates/seen.csv` | `search` |

A company slug is the company name in lowercase ASCII with each run of other characters replaced by one hyphen, and no leading or trailing hyphen: "Example Co." becomes `example-co`.
