# Status

Shown by `job-hunt` with no subcommand, after preflight. Read files only; never write anything here.

Report, briefly:

1. Each directive file from `references/files.md`: complete or incomplete, and its `Last reviewed` date. For any file reviewed more than 90 days ago, suggest `interview`. Do not force it.
2. The number of `active` and `paused` companies in the `IDEAL_COMPANIES.md` ledger. If fewer than 20 are `active`, say so and suggest adding companies.
3. The number of ledger rows whose `Last verified` or `Reviews checked` date is more than 90 days old or missing. The next `search` refreshes them.
4. The number of companies in `BLACKLIST.md`, without naming them.
5. The number of eval reports in `evals/`, and the date of the latest.
6. The latest report in `search/`: its date, opportunity count and excluded count. If there is none, say so.
7. The number of rows in `CONNECTIONS.md`, by `Status`, if the file exists.
8. Scoring: for each matrix in `SCORING.md`, whether it is set and in sync with the directive files (see `references/score.md`), and the date of the latest `scores/` report of each kind. If the file is missing or a matrix is not set or out of date, say so.

End with one suggested next step, for example `interview` for an incomplete or stale file, `eval {company}` to grow a short ledger, `search` when no search has run in the last 7 days, `connect {company}` for a company with a Strong posting and no contacts, or `score companies` or `score jobs` when a matrix is missing or out of date.
