# Eval

`eval {company}` decides whether a company is worth targeting, writes a report, and adds or updates the company in the ledger.

The interview also uses this procedure (see `references/interview.md`). When it does, run only steps 1 to 4 and return the findings: the interview decides when to write the report and the ledger row, using steps 5 and 6.

Uses: `references/privacy.md`, `references/rubric.md`, `references/ats-hosts.md`, `references/review-sites.md`, and the template `templates/EVAL.md`.

## 1. Check the blacklist first

Compare the company with `BLACKLIST.md` as `references/privacy.md` describes, before any web search or fetch. On a match, say that the company is on the blacklist and stop. Send no query and write nothing. (For the `eval` command, preflight has already done this.)

## 2. Read the directive files

Read `PROFILE.md` (time zone), `IDEAL_COMPANIES.md` (profile, Must-haves, Nice-to-haves and ledger), `IDEAL_ROLES.md`, `IDEAL_BENEFITS.md` and `RED_FLAGS.md`. Note whether the company is already in the ledger.

If the name is ambiguous (two or more companies match), ask the operator which one before researching.

## 3. Gather

Search and fetch only public pages. Record the link for every fact you use.

1. **Board.** Find the company's careers page or tracking-system board with `references/ats-hosts.md`. Open it, confirm it lists at least one job, and record the URL, the board type and today's date for `Last verified`. If you cannot find or open one, record "not verified" and never guess a URL. An aggregator such as LinkedIn, Indeed or Built In is never the board.
2. **Reviews.** Glassdoor, Levels.fyi and Blind, following `references/review-sites.md`.
3. **News.** About two web searches for the signals listed in `RED_FLAGS.md`, for example `"Example Co" layoffs {current year}` and `"Example Co" return to office`. Record each finding with its source link and date, and say when a claim comes from a single unverified source such as a forum.
4. **Open roles.** From the board, list the open postings whose titles match the titles and keywords in `IDEAL_ROLES.md` and are not excluded, with links. If the board shows locations or pay, include them as shown.
5. **Company facts** needed for the Must-haves, such as size, stage, work arrangement and where it hires, from the company's own pages first and reputable reporting second.

## 4. Decide

Mark each company Must-have and Nice-to-have from `IDEAL_COMPANIES.md` as met, unmet or unknown, and each dealbreaker from `RED_FLAGS.md` as found, not found or unknown. Apply the company verdict in `references/rubric.md`: **Strong fit**, **Possible fit** or **Not a fit**.

Note soft warning signs from `RED_FLAGS.md` too; they never change the verdict.

## 5. Write the report

Write `DATA/evals/{company-slug}-{yyyyMMdd-HHmmss}.md` from `templates/EVAL.md` (slug rules in `references/files.md`, timestamp rules in `references/privacy.md`). Create `evals/` if needed. Fill every section; write "none found" or "unknown" rather than leaving one empty.

## 6. Update the ledger

Copy `IDEAL_COMPANIES.md` to `.history/` before changing it (see `references/privacy.md`).

- **New company, Strong or Possible fit:** add a row with status `active`, a one-line "why it fits" tied to the profile, the board URL and type, `Last verified`, the three review columns, `Reviews checked` set to today, and `Last eval` set to the verdict and report path.
- **New company, Not a fit:** do not add it. Say why in chat.
- **Company already in the ledger:** update its board, review, `Reviews checked` and `Last eval` columns. Leave `Why it fits` unless it no longer holds, and leave `Status` alone. If the verdict is Not a fit and the status is `active`, propose changing it to `paused` with the reason, and change it only after the operator agrees.
- **Blacklist:** if a dealbreaker found is serious enough that the operator might never want this company searched, propose adding it to `BLACKLIST.md` with the reason. Add it only after explicit approval, following `references/files.md`.

## 7. Report in chat

In a few lines: the verdict, the Must-haves that decided it, any dealbreaker or warning sign found, the number of matching open roles, the review values or "not checked", what changed in the ledger, and the report path.
