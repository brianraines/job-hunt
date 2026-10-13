# `job-hunt` skill specification

Status: approved design, October 10, 2026; scoring added October 11, 2026. Versions 0.1 to 0.5 are implemented; 1.0 awaits the acceptance checks. This document is the contract the `job-hunt` agent skill is built and reviewed against. Design decisions were settled in a structured review; each is recorded here as a requirement.

## Purpose

`job-hunt` helps a software professional (the operator) run a focused job search with an AI coding agent. It keeps a small set of private directive files describing what the operator wants, evaluates companies against them, searches for matching openings, and keeps a list of people worth contacting.

The skill supports the search; it never acts on the operator's behalf. It does not apply to jobs, fill application forms, send messages or connection requests, sign in to any site, or edit the operator's resume.

## Distribution

- Repository: `brianraines/job-hunt`, public, MIT license. Content adapted from other MIT-licensed skills is credited in `NOTICE` with its original copyright lines.
- Install: `npx skills add brianraines/job-hunt` (project) or with `-g` (all projects). The installer places the skill in `.agents/skills/job-hunt` for Codex and other agents and links it into `.claude/skills/job-hunt` for Claude Code.
- Invocation: Claude Code `/job-hunt <subcommand>`; Codex `$job-hunt <subcommand>` or a matching natural-language request. This document writes `/job-hunt`; behavior is identical in both agents. Verified October 10, 2026 with Claude Code and Codex CLI 0.160.0: both discover the skill in a project's `.agents/skills/job-hunt` (Claude Code through the `.claude/skills` link) and invoke it as described.
- Listing on [skills.sh](https://skills.sh) is automatic from installer telemetry; there is no submission step.
- Until v1.0.0 the skill's frontmatter sets `metadata.internal: true`, which hides it from normal discovery. It is installed explicitly with `INSTALL_INTERNAL_SKILLS=1` during development.

### Repository layout

```
skills/job-hunt/
  SKILL.md               Entry point: frontmatter, preflight, subcommand routing
  references/
    interview.md         Interview procedure
    eval.md              Company evaluation procedure
    search.md            Search procedure
    connect.md           Connect procedure
    score.md             Scoring matrices and the score commands
    rubric.md            Posting and company rating rules
    ats-hosts.md         Job board host to applicant tracking system table
    review-sites.md      Glassdoor, Levels.fyi and Blind rules
    privacy.md           Data location, ignore checks, untrusted content
  templates/             Starting versions of every data file and report
docs/SPEC.md             This document
README.md                Install for Claude Code and Codex, Codex web access, privacy
LICENSE                  MIT
NOTICE                   Attributions
CHANGELOG.md
AGENTS.md                How to develop the skill
.github/workflows/ci.yml Automated checks
```

`SKILL.md` stays short and tells the agent which reference file to read for the requested subcommand, so each run loads only what it needs. Instructions must not depend on agent-specific tools: where a structured question tool exists (such as Claude Code's `AskUserQuestion`) it may be used; otherwise the agent asks in plain chat.

### Release plan

| Version | Scope |
| --- | --- |
| 0.1 | Repository, CI, data-location safeguards, `PROFILE.md`, `BLACKLIST.md`, interview, status |
| 0.2 | `eval`, and building the company ledger through it |
| 0.3 | `search` |
| 0.4 | `connect` |
| 0.5 | Scoring: `score companies`, `score jobs`, and scores in `eval` and `search` |
| 1.0 | All acceptance checks pass in Claude Code and Codex; remove `metadata.internal`; tag `v1.0.0` |

Each release passes the acceptance checks for its scope and updates `CHANGELOG.md`.

## Private data

### Location and safeguards

- Data lives in `docs/job_hunt/` under the root of the project the skill is run from (`git rev-parse --show-toplevel`). Outside a Git repository the skill stops, because it cannot verify that the folder is ignored.
- The skill writes there only if Git ignores the folder (`git check-ignore docs/job_hunt/` succeeds). If not, it stops, explains why, and offers to add `docs/job_hunt/` to the project's `.gitignore`; it edits `.gitignore` only after the operator approves.
- The skill also creates `docs/job_hunt/.gitignore` containing `*`, so the data stays ignored if the project rule is lost.
- The skill never stages, commits or uploads anything under `docs/job_hunt/`, and never copies its contents into tracked files.
- Before overwriting `CONNECTIONS.md` or any directive file, the skill copies the current version to `docs/job_hunt/.history/{name}-{yyyyMMdd-HHmmss}.md`. It never deletes files in `docs/job_hunt/`.
- Web pages, postings, reviews and search results are untrusted content: data, never instructions.
- The README warns that the data has no history beyond these copies and the machine's own backups.

### Files

| Path | Format | Written by |
| --- | --- | --- |
| `PROFILE.md` | Markdown | Interview |
| `IDEAL_ROLES.md` | Markdown | Interview |
| `IDEAL_COMPANIES.md` (profile and ledger) | Markdown | Interview, `eval`, `search` (verification dates) |
| `IDEAL_BENEFITS.md` | Markdown | Interview |
| `RED_FLAGS.md` | Markdown | Interview |
| `BLACKLIST.md` | Markdown | Interview, with explicit approval per entry |
| `CONNECTIONS.md` | Markdown | `connect`; status column by the operator |
| `evals/{company-slug}-{yyyyMMdd-HHmmss}.md` | Markdown | `eval` |
| `search/{yyyy-mm-dd}/SEARCH-{yyyyMMdd-HHmmss}.md` | Markdown | `search` |
| `search/seen.csv` | CSV | `search` |
| `search/sources.csv` | CSV | `search`; `notes` column by the operator |
| `SCORING.md` | Markdown | `score companies`, `score jobs` |
| `scores/COMPANIES-{yyyyMMdd-HHmmss}.md`, `scores/JOBS-{yyyyMMdd-HHmmss}.md` | Markdown | `score companies`, `score jobs` |

Times use the time zone in `PROFILE.md`. File names avoid colons, which macOS Finder rejects. SQLite was considered and rejected: binary files cannot be read or diffed by the operator, and the volume does not warrant a database.

## Directive files

The six files above `CONNECTIONS.md` in the table are the directive files. Each begins with `Last reviewed: YYYY-MM-DD`. Every directive file except `BLACKLIST.md` ends with two lists, **Must-haves** and **Nice-to-haves**, phrased so they can be checked against a posting or company; ratings use only these lists. Each file has a sufficiency checklist; a missing or insufficient file is incomplete.

### `PROFILE.md`

Name; location; time zone; current employer; resume sources the skill may read (file paths or URLs, in priority order); optional context sources such as a portfolio site or professional profile. The skill uses these only as context and never edits them.

Sufficiency: location, time zone, current employer (or "none") and at least one readable resume source.

### `IDEAL_ROLES.md`

Target titles and levels in order of preference; individual contributor versus management and what makes each attractive; technical focus areas (from the resume); technologies welcome, tolerated and unwanted; expected scope of impact; search keywords and title variants; titles to exclude.

Sufficiency: at least one target title per level considered; focus areas and exclusions; search keywords; Must-haves and Nice-to-haves.

### `IDEAL_COMPANIES.md`

Profile: domains of interest and to avoid; stage and size; engineering culture (for example AI adoption, autonomy, quality practices, on-call); work arrangement and acceptable locations and travel; industries and business models preferred or excluded; Must-haves and Nice-to-haves.

Ledger table:

| Column | Contents |
| --- | --- |
| Company | Name |
| Why it fits | One line tied to the profile |
| Job board URL | Company careers page or applicant tracking system board, never an aggregator |
| Board type | Tracking system name from `ats-hosts.md`, or "careers page" |
| Last verified | Date the board URL last loaded and listed jobs |
| Glassdoor | Public overall rating and review count, link, or "not checked" |
| Levels.fyi | Link and median total compensation at the operator's target level, or "not checked" |
| Blind | Link to the public company page, or "not checked" |
| Reviews checked | Date review columns were last refreshed |
| Last eval | Verdict, score when scored, and link to the eval report |
| Status | `active` or `paused`, with an optional reason |

Sufficiency: every profile section filled; Must-haves and Nice-to-haves. Fewer than 20 `active` companies is a warning shown by status and search, not a gap: the interview offers to add more until there are at least 20.

### `IDEAL_BENEFITS.md`

Compensation: base salary range, total compensation expectations, minimum acceptable, equity preferences; health, retirement and other core benefits; time off and leave; learning budget and equipment; remote-work support and travel; Must-haves and Nice-to-haves.

Sufficiency: a minimum acceptable base or total compensation figure; Must-haves and Nice-to-haves.

### `RED_FLAGS.md`

Hard dealbreakers (exclude); soft warning signs (allow and call out); signals to check in postings and news (for example mandatory relocation, recent mass layoffs, unclear funding); review thresholds chosen by the operator (for example "Glassdoor below 3.5 is a warning, below 3.0 a dealbreaker"); Must-haves and Nice-to-haves where relevant.

Sufficiency: at least one hard dealbreaker and one soft warning sign, each checkable; review thresholds stated or explicitly "none".

### `BLACKLIST.md`

Companies the skill must never search against, with columns Company, Reason, Date added, Approved. Each entry is added only after the operator explicitly approves that entry. The current employer from `PROFILE.md` is proposed during the first interview.

Sufficiency: the file exists and the operator has confirmed the list (an empty list may be confirmed). If the file is missing, every command stops until the interview recreates it.

Effect of a blacklisted company:

- Its job board is never fetched, and its postings are dropped from search results. Reports show dropped postings only as a count, without the company name.
- Its name never appears in any query the agent sends to search engines or websites.
- `eval` and `connect` refuse it without research or outgoing queries.
- The interview never proposes it for the ledger.

## Commands

| Command | Behavior |
| --- | --- |
| `/job-hunt` | Status: each directive file's completeness and last-reviewed date, active ledger size, latest search date and result count, number of evals and connections. Suggests `/job-hunt interview` for any file not reviewed in 90 days, without forcing it. Suggests the next useful command. |
| `/job-hunt interview` | Full interview of all directive files, starting from their current content. |
| `/job-hunt eval {company}` | Evaluate a company; add or update it in the ledger. |
| `/job-hunt search` | Search for matching openings and write a report. |
| `/job-hunt connect {company}` | Find recruiters and hiring managers at a company and add them to `CONNECTIONS.md`. |
| `/job-hunt score companies` | Review the company weight matrix with the operator, then score and rank every ledger company from its latest eval. |
| `/job-hunt score jobs` | Review the job weight matrix with the operator, then score and rank the opportunities in the latest search report. |

Unknown subcommands list the commands. `eval` and `connect` ask for a company when none is given; `score` asks whether to score companies or jobs.

### Preflight (every command)

1. Confirm the data folder is ignored by Git (see Private data). If not, stop.
2. If any directive file is missing or incomplete, run the interview for those files before the requested command.
3. For `eval`, `search` and `connect`, confirm live web search and page fetching work. If not, stop and explain; in Codex, show the documented launch command from the README that enables live web search and network access.

## Interview

Goal: complete every directive file without asking for facts the operator's sources already hold.

- First read the existing directive files and the resume and context sources listed in `PROFILE.md` (on the first run, ask for these sources first). If a listed source cannot be read in the current agent (for example a cloud document without a connector), say which and continue with the others.
- Order: profile, roles, companies, benefits, red flags, blacklist. At most three questions per turn; offer concrete choices with a free-text option.
- After each file, summarize the answers and ask for confirmation. Once confirmed, save that file immediately, after its history copy. A later run resumes with the files that are still incomplete.
- Never fill a gap with an assumption. A skipped question is recorded as "not specified" and leaves the file incomplete.
- Companies: propose batches of about 10 candidates. Each candidate is first run through the `eval` procedure, and only Strong or Possible fits are proposed, each with its "why it fits" line and verified board URL. The operator keeps or drops them in one reply; kept companies are added with their eval reports saved. The operator may add companies at any point.
- Blacklist: propose the current employer and ask about past employers; add each entry only after explicit approval.
- `/job-hunt interview` reviews every file, summarizing current content and asking what has changed.

## Eval

`/job-hunt eval {company}` decides whether a company is worth targeting.

- Blacklisted: refuse and stop.
- Gathers:
  - Board URL: find the company's careers page or tracking-system board, verify it loads, and identify the board type.
  - Reviews: public Glassdoor rating and review count, Levels.fyi compensation at the operator's target level, Blind company page link. Never sign in. If a site blocks fetching, record the link and "not checked"; never guess a number.
  - News: about two searches for signals listed in `RED_FLAGS.md`, recorded with source links.
  - Open roles: currently open postings matching `IDEAL_ROLES.md`, with links.
- Verdict, in order:
  1. Any dealbreaker from `RED_FLAGS.md`, including review or compensation thresholds: **Not a fit**.
  2. All company Must-haves met: **Strong fit**.
  3. Most Must-haves met: **Possible fit**.
  4. Otherwise: **Not a fit**.
  Unknown information (for example a blocked review site) is neutral: it is reported as unknown and neither meets nor fails a Must-have.
- Score: after the report is written, the company is scored with the company matrix (see Scoring) and the score is added to the report and the ledger's `Last eval`. The score never changes the verdict.
- Output: a report at `evals/{company-slug}-{yyyyMMdd-HHmmss}.md` containing the verdict, each company Must-have and Nice-to-have marked met, unmet or unknown, red flags found, review results, news, matching open roles and a sources list; plus a short verdict in chat.
- Ledger:
  - New company, Strong or Possible: add as `active` with the review columns, `Last verified`, `Reviews checked` and `Last eval`.
  - New company, Not a fit: do not add.
  - Existing company: update its row. If the verdict is Not a fit, propose changing its status to `paused`; change it only after approval.
  - If the result suggests a dealbreaker that warrants blacklisting, propose it; add it only after explicit approval.

## Search

`/job-hunt search` finds open postings that match the directive files.

Sources:

1. Every `active` ledger company's board. Prefer a tracking system's documented public listing endpoint (for example Greenhouse, Lever, Ashby or Workday) over scraping HTML. A careers page that lists jobs only through JavaScript is rendered in a signed-out browser, if the agent has one. When `Last verified` or `Reviews checked` is more than 90 days old, re-verify the board and refresh the reviews during the run and update the ledger.
2. Lead boards: employer boards outside the ledger recorded in `search/sources.csv` by earlier runs. Search never adds them to the ledger.
3. General web search with the keywords from `IDEAL_ROLES.md`, varied across tracking-system hosts (including Workday) and with unrestricted queries.

Rules:

- Only public pages. Never sign in or use a logged-in browser session. No automated LinkedIn access, including its unauthenticated job endpoints; LinkedIn postings found through ordinary web search may be linked.
- Open the full posting only for titles that match the role keywords and are not excluded. Cap a run at 300 full-posting fetches; report how many were opened and how many the cap skipped.
- Every listed opportunity links to a posting opened in this run and confirmed open. A search snippet or redirect is not proof. Prefer the employer's own URL over aggregator copies. Never construct or guess a URL.
- When a source blocks fetching, list it under "Sources not checked" with a ready-to-open link. Never guess its contents.
- No age filter. Report each posting's age when the posting shows a date, otherwise "date not shown".
- Check the end of each full posting for eligibility blockers (sponsorship, citizenship or clearance, mandatory relocation, required on-site days) and flag them. Never infer a blocker from silence.
- Rate each posting with `rubric.md`:
  1. Any hard dealbreaker, or a stated compensation figure below the minimum in `IDEAL_BENEFITS.md`: **Skip**, listed under Excluded.
  2. All Must-haves from `IDEAL_ROLES.md` and `IDEAL_BENEFITS.md` met, plus at least two Nice-to-haves: **Strong**.
  3. Most Must-haves met, or all Must-haves with fewer Nice-to-haves: **Possible**.
  4. A credible core match with a material gap: **Stretch**, gap stated.
  Unknown information (compensation not posted, scores not retrieved) is neutral and reported as unknown.
- Ledger companies use their latest eval. For a company not in the ledger: check the blacklist and the red flags visible in the posting, mark it "not evaluated", and for each Strong or Possible posting suggest `/job-hunt eval {company}`. Search never adds companies to the ledger.
- For companies with a Strong or Possible posting in this run, check news (about two searches each) for red-flag signals and report findings with links.
- Cross-reference `CONNECTIONS.md` and name known contacts at each company.
- `search/seen.csv` columns: `url,company,title,first_seen,last_seen,last_rating`. A posting already seen is reported again only if its rating or title changed; otherwise it counts as previously reported.
- Record every query and source used, with result counts, including those that returned nothing.
- The report includes a source mix by board type (boards read, boards not checked, postings opened, opportunities by rating) and warns when more than 75% of opportunities come from one board type.
- `search/sources.csv` columns: `url,kind,board_type,company,first_seen,last_checked,read_method,last_listed,last_matching,last_opened,last_opportunities,opportunities_total,status,notes`. One row per board or discovery site, so later runs reuse productive boards and skip recently dead or empty ones. No blacklisted company name is written in it.
- Report salary only as posted. Cite only facts from the operator's resume sources; never claim unlisted experience.
- Each reported opportunity carries a scorecard: every Must-have and Nice-to-have from `IDEAL_ROLES.md` and `IDEAL_BENEFITS.md` marked met, unmet or unknown. When the write-ups are finished, each opportunity is scored from its scorecard with the job matrix (see Scoring).
- Order opportunities by rating, then by score within each rating. The report shows the last-reviewed date of each directive file.

Report format:

```markdown
# Job search — 2026-10-10 14:32 CDT

Directive files: PROFILE.md (reviewed 2026-10-10), IDEAL_ROLES.md (...), ...
Sources: 23 ledger boards (2 re-verified), 6 web searches. Postings opened: 140 of 152 matching titles (cap 300).
Opportunities: 9. Excluded: 4. Blacklisted companies dropped: 1. Previously reported: 3.

## Source mix

| Board type | Boards read | Boards not checked | Postings opened | Strong | Possible | Stretch |
| --- | --- | --- | --- | --- | --- | --- |
| Greenhouse | 12 | 0 | 80 | 2 | 3 | 1 |
| Workday | 4 | 1 | 35 | 1 | 1 | 0 |

## 1. Principal Engineer, Platform — Example Co

- Posting: https://...
- Fit: Strong | Possible | Stretch
- Score: 53/100 (30% of weight unknown), or "not scored: {reason}"
- Company: Strong fit (eval 2026-10-01, link) | not evaluated — run /job-hunt eval Example Co
- Location and arrangement: Remote (US)
- Compensation: as posted, or "not stated"
- Posted: 6 days ago, or "date not shown"
- Eligibility: blockers found, or "none stated"
- Known contacts: from CONNECTIONS.md, or "none"
- News: red-flag findings with links, or "none found"

**Executive summary.** Two to four sentences on why this matches, tied to specific Must-haves and to the operator's resume.

**Gaps or warning signs.** Unmet Must-haves, soft warning signs, or "None found".

## Excluded

| Company | Title | Reason |
| --- | --- | --- |

## Sources not checked

Each with a ready-to-open link.

## Queries used

Each query and source with its result count.
```

## Scoring

Scores rank companies and postings within their verdict or rating. They never change a verdict or rating; dealbreakers still decide Not a fit and Skip.

- `SCORING.md` holds two matrices. The company matrix has one row per Must-have and Nice-to-have in `IDEAL_COMPANIES.md`; the job matrix has one row per Must-have and Nice-to-have in `IDEAL_ROLES.md` and `IDEAL_BENEFITS.md`. Criteria are copied word for word; weights are whole numbers that sum to 100 in each matrix.
- `SCORING.md` is not a directive file: it is not part of the completeness check, and a missing or out-of-date matrix never triggers the interview. It is written only by the `score` commands, after the operator confirms the weights, with a `.history/` copy first.
- First matrix: Must-haves share 70 points and Nice-to-haves 30, split evenly; if either list is empty the other gets 100. Later runs keep existing weights, add new criteria at 0 and drop removed ones, then ask the operator to confirm or adjust.
- Score = the total weight of criteria confirmed met, out of 100. Unmet and unknown criteria earn nothing, so missing evidence never raises a score; the weight of unknown criteria is reported alongside as "% of weight unknown", and above 50% the score is marked low confidence. With every criterion unknown, the item is not scored. (A score rescaled over known criteria was rejected on October 11, 2026: with typical evals it gave almost every company 100 and ranked a company with a confirmed unmet criterion below companies with no evidence.)
- Ties within a verdict or rating are broken by unknown weight, highest first.
- `eval` and `search` score only when the needed matrix is set and matches the current directive lists; otherwise they record "not scored" with the reason and suggest the `score` command. They never edit `SCORING.md`.
- `score companies` scores every ledger company from the results in its latest eval report, writes `scores/COMPANIES-{timestamp}.md` ranked by verdict then score, and updates only the ledger's `Last eval` column. A company whose eval predates the current criteria is listed as not scored.
- `score jobs` scores the opportunities in the latest search report from their scorecards and writes `scores/JOBS-{timestamp}.md` ranked by rating then score. It never changes the search report or `seen.csv`.
- The `score` commands send no queries and need no web access.

## Connect

`/job-hunt connect {company}` records people the operator might contact. The operator decides whether and how to contact them.

- Blacklisted: refuse and stop. Not in the ledger: suggest `/job-hunt eval {company}` first, then continue if the operator wants.
- Look for recruiters or talent acquisition staff who hire engineers, and engineering managers or directors in groups matching `IDEAL_ROLES.md`.
- Use public search results only (for example queries restricted to `linkedin.com/in`). Never sign in to LinkedIn, automate a LinkedIn session, scrape behind a login, or send requests or messages.
- Record only: company, name, title, role type (`recruiter` or `hiring manager`), public profile URL, how found, date found, confidence (`confirmed` when the public result shows the current role, otherwise `unverified`). Never record or guess personal emails, phone numbers or other personal details.
- At most 10 new people per run. Skip people already listed; update the title if it changed.
- `Status` (`not contacted`, `requested`, `connected`, `replied`, `not a fit`) belongs to the operator: new rows start as `not contacted`, and the skill never changes an existing status.

`CONNECTIONS.md` columns: Company, Name, Title, Role type, Profile URL, Found, Confidence, Status, Notes.

## Clarifications

Settled while implementing 0.2 to 0.4, October 11, 2026, including fixes from an independent review:

- **Order of checks.** For `eval` and `connect`, the blacklist check runs before the web-access check, and the web-access check uses a neutral query that names no company and no operator data.
- **Interview ledger step.** Evaluating companies sends queries and needs the red flags and minimum pay, so the interview builds the ledger only after `BLACKLIST.md` is confirmed and `RED_FLAGS.md` and `IDEAL_BENEFITS.md` are complete. Companies the operator names earlier are noted and evaluated then. The ledger step runs only for `/job-hunt interview` or when `IDEAL_COMPANIES.md` itself is incomplete; other commands only warn about a short ledger. Each operator-named company is evaluated and its report saved; a Not a fit is explained and added only if the operator still wants it, as `active` or `paused`. Proposed candidates run only the gathering and decision steps of eval; their reports and ledger rows are written only when kept.
- **Item results.** Each Must-have, Nice-to-have and dealbreaker is met (found), unmet (not found) or unknown. "All Must-haves met" requires every one to be met. "Most" means at least one is met and more are met than unmet, leaving unknown items out of the count; reports state how many were unknown. Evidence must come from a page or endpoint opened in the run; a search snippet counts as unknown.
- **Company compensation dealbreakers** count only when a source states a figure at the operator's target level: a Levels.fyi median at that level (total compensation, compared only with a total-compensation minimum) or posted ranges on every matching open role.
- **Posting compensation.** A stated figure is below the minimum only when the top of its range is below it. When a posting does not say whether a figure is base or total, it is treated as base.
- **`PROFILE.md` Must-haves** (such as work authorization or location) are reported as gaps on every posting that misses them; they change the rating only when `RED_FLAGS.md` lists them as dealbreakers.
- **Search order.** Ratings are final after the news check, and only then compared with `seen.csv`, so a second run with unchanged postings reports nothing new. Postings that match no rating are not listed but are recorded in `seen.csv`.
- **Posting URLs and the fetch cap.** A posting's record from a tracking system's public endpoint counts as opening it, and the report links the posting URL that record gives. The only URLs the skill builds are the public listing endpoints with a probed slug, and the same API's one-posting endpoint with an `id` its listing returned. Each posting assessed counts once toward the cap of 300, and postings not yet in `seen.csv` are opened first.
- **Aggregator results in search** (LinkedIn, Indeed, Built In and similar) are leads only. The employer's own copy is found and opened; when it cannot be found, the lead is listed under "Sources not checked". linkedin.com pages are never fetched.
- **Boards without a public listing endpoint** (iCIMS, Eightfold, Phenom and others) are read from the careers page. Workday boards use Workday's public listing endpoint, built only from a board URL the agent opened. When a careers page lists jobs only through JavaScript, the agent renders it in a fresh signed-out browser, uses only the site's job-search box, and reads the page's own data requests at a human pace; a sign-in, terms or CAPTCHA prompt, an HTTP 403 or a block page stops that site for the run, and without a browser the board is listed under "Sources not checked". A stale board that cannot be re-verified keeps its old date and is listed there too. Search refreshes only `Last verified`, the review columns and `Reviews checked`; a moved board is not read in that run; it is listed under "Sources not checked" with an `eval` suggestion.
- **Blacklist names.** Matching ignores case, punctuation and legal suffixes, and treats other names given in an entry's Reason ("also known as …") as the same company. A known brand or subsidiary of a blacklisted company is treated as blacklisted; `eval`, `connect` and the interview tell the operator, and `search` drops it without stopping and lists it only in the chat summary. The interview asks for other names when adding an entry. The report's "Blacklisted companies dropped" counts distinct companies.
- **Connect** reads names and titles from search-result titles and snippets, never from opened LinkedIn pages; a company's own public pages may be opened. People whose result names the company and a matching role are recorded, as `confirmed` when the result shows the role is current and `unverified` otherwise; people shown to have left are skipped.

## Adapted material

Rather than installing companion skills, `job-hunt` adapts two small pieces of MIT-licensed material into its own reference files and credits them in `NOTICE`:

- The must-have and nice-to-have split for job descriptions and the posting red-flag list, from `technical-job-search` in [github/awesome-copilot](https://github.com/github/awesome-copilot/tree/82701c24b994/skills/technical-job-search) (commit `82701c24b994`).
- The job board host to tracking system table, from `ats-detective` in [squerne/open-career-skills](https://github.com/squerne/open-career-skills/tree/daaf01f832e5/.claude/skills/ats-detective) (commit `daaf01f832e5`).

Installing those skills was rejected: they would trigger on the same requests as `job-hunt`, and only a few lines of each are needed.

## Automated checks

A GitHub Actions workflow with read-only permissions runs on every push and pull request:

- Every `SKILL.md` has valid frontmatter with `name` and `description`.
- Every file referenced from `SKILL.md` and the reference files exists.
- Every file in `references/` is reachable from `SKILL.md` through a chain of references.
- A personal-data check fails if the repository contains any value from a deny-list held in repository secrets (the maintainer's phone number, personal email, current employer, home city and similar), or any path under `docs/job_hunt/`.

The acceptance checks below are run manually in both agents before each release.

## Acceptance checks

1. Claude Code lists and starts the skill with `/job-hunt`; Codex with `$job-hunt`. Every subcommand behaves the same in both.
2. In a project where `docs/job_hunt/` is not ignored, every command stops; approving the offered `.gitignore` change makes it ignored; `docs/job_hunt/.gitignore` contains `*`.
3. With no data folder, any command runs the interview first; each directive file is written only after its own confirmation; interrupting midway and rerunning resumes with the incomplete files.
4. With one directive file deleted, any command interviews for that file only. With `BLACKLIST.md` deleted, no command proceeds until it is recreated.
5. Rerunning `/job-hunt interview` summarizes existing content, writes only after approval and leaves `.history/` copies.
6. Proposed companies have eval reports and are added only when kept; blacklist entries are added only after explicit approval.
7. `eval` on a new company writes a report and adds a Strong or Possible fit to the ledger; on a listed company updates its row and proposes `paused` for Not a fit; on a blacklisted company refuses without any outgoing query.
8. `search` writes a report at the dated path; every opportunity link opens to an open posting; ratings follow the rubric; blacklisted names appear in no outgoing query and only as a count in the report; stale ledger rows are re-verified; `seen.csv` is updated and a second run skips unchanged postings; blocked sources are listed with links; the report has a source mix by board type, and `search/sources.csv` records each board read or attempted.
9. `connect` adds at most 10 people with only the listed fields, skips duplicates, never changes an existing status, and refuses blacklisted companies.
10. Without live web access, `eval`, `search` and `connect` stop with an explanation; in Codex the explanation includes the launch command.
11. After any run, `git status` shows nothing under `docs/job_hunt/`.
12. `score companies` with no `SCORING.md` proposes a 70/30 matrix that sums to 100, saves only after confirmation, ranks every ledger company with an eval, and updates only `Last eval`; after a Must-have is added to `IDEAL_COMPANIES.md`, it proposes the new row at weight 0, and `eval` records "not scored" until the matrix is confirmed again.
13. `score jobs` ranks the latest search report's opportunities from their scorecards without changing the report or `seen.csv`; `search` and `eval` show scores and order by them within each rating, and a score never changes a verdict or rating.

## Non-goals

- Applying to jobs, filling forms or uploading a resume
- Sending email, LinkedIn messages or connection requests
- Editing the operator's resume or other source documents
- Scheduled or automatic runs
- Tracking applications and interviews (see later ideas)

## Later ideas

From a review of comparable skills on skills.sh and skillz.sh on October 10, 2026:

| Idea | Seen in |
| --- | --- |
| `/job-hunt fit {url}`: rate a single posting with the search rubric | dbhat93/job-search-os `fit`, madslorentzen/ai-job-search `job-application-assistant` |
| Application tracker (`APPLICATIONS.md`) | Most comparable systems |
| Outreach drafting with platform limits (LinkedIn connection notes: 300 characters); drafts only | dbhat93/job-search-os `outreach` |
| Matching results against the operator's own LinkedIn connections export | proficientlyjobs/proficiently-claude-skills |
| Learned title aliases and rotating query sets | toughdave/job-search |
