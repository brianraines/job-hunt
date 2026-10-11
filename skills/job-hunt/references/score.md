# Score

Scores rank companies and postings within the verdicts and ratings that `references/rubric.md` gives them. A score never changes a verdict or a rating, and a dealbreaker still decides Not a fit or Skip.

Uses: `references/privacy.md`, `references/files.md` and the template `templates/SCORING.md`.

## The matrices

`DATA/SCORING.md` holds two weight matrices:

- **Company matrix:** one row per Must-have and Nice-to-have in `IDEAL_COMPANIES.md`.
- **Job matrix:** one row per Must-have and Nice-to-have in `IDEAL_ROLES.md` and `IDEAL_BENEFITS.md`, with the source file named in each row.

Each row copies its criterion word for word from the directive file. Weights are whole numbers from 0 to 100, and each matrix's weights sum to exactly 100. A list written as "None" contributes no rows.

A matrix is **in sync** when its rows are exactly the current list items, comparing text without regard to case, surrounding spaces or a trailing period. A matrix with no rows, or with weights that do not sum to 100, is not set.

## Scoring one company or posting

Inputs: the matrix, and a result of met, unmet or unknown for each criterion, as `references/rubric.md` defines them.

To take results from a report, match each report row to a matrix row. Two texts match when they are equal, comparing as for sync, or when one is the leading part of the other and it matches no other matrix row. A report row that matches no matrix row, or more than one, is ignored.

1. Score = the sum of weights of criteria that are met. Unmet and unknown criteria earn nothing, so the score counts only confirmed evidence.
2. Unknown weight = the sum of weights of criteria that are unknown.
3. If every criterion is unknown, the item is "not scored (all criteria unknown)".

Write it as `Score 53/100 (30% of weight unknown)`. When the unknown weight is more than 50, add "low confidence": more evidence could raise the score a lot.

The score is not computed, and the reason is written in its place, when:

- `SCORING.md` does not exist, or the needed matrix is not set: "not scored: no scoring matrix; run `score companies`" (or `score jobs`).
- The matrix is not in sync with the directive files: "not scored: scoring matrix out of date; run `score companies`" (or `score jobs`).
- The item's results do not cover every row of the matrix, for example an eval written before a list changed: "not scored: results predate the current criteria".

`eval` and `search` never edit `SCORING.md`; only the `score` commands do.

## Reviewing a matrix

`score companies` and `score jobs` start here, for their own matrix only. Preflight steps 1 and 2 in `SKILL.md` apply; these commands send no queries and need no web access.

1. Read the source directive files and `SCORING.md` if it exists.
2. Build the proposed matrix:
   - **No matrix yet:** Must-haves share 70 and Nice-to-haves share 30, split evenly within each list; if either list has no items, the other gets 100. Round each weight down, then add the remaining points one at a time to rows in list order until the total is 100.
   - **Existing matrix:** keep the weight of every criterion still present, add new criteria with weight 0, and drop criteria no longer in the lists.
3. Show the operator the matrix as a table with each row's type and weight and the total, and say which rows were added or dropped. Ask whether to keep it or change weights. Follow the interview rules in `references/interview.md` for how to ask.
4. Apply the operator's changes. Repeat until every weight is a whole number from 0 to 100, the total is exactly 100, and the operator confirms.
5. Save `SCORING.md` from `templates/SCORING.md`, copying the current file to `.history/` first if it exists (see `references/privacy.md`). Set `Last reviewed` to today. Change only this command's matrix; keep the other matrix as it is, or leave it empty if the file is new.

If the operator declines to confirm, save nothing and stop.

## `score companies`

1. Review the company matrix as above.
2. For every ledger company in `IDEAL_COMPANIES.md`, `active` or `paused`, read the eval report named in its `Last eval` column. Take each Must-have and Nice-to-have result from the report's tables and score the company. A company with no eval report is "not scored: no eval; run `eval {company}`".
3. Write `DATA/scores/COMPANIES-{yyyyMMdd-HHmmss}.md`, never overwriting an earlier one. Start with the date and time, the matrix's `Last reviewed` date, and then a table with the columns Rank, Company, Status, Verdict, Score, Unknown weight and Eval report. Order rows by verdict (Strong fit, Possible fit, Not a fit), then by score from high to low, then by unknown weight from high to low (more room to rise, because less is confirmed unmet). List companies that were not scored after the table, each with its reason.
4. Copy `IDEAL_COMPANIES.md` to `.history/`, then update only the `Last eval` column of each scored company to `{Verdict}, score {n}: {report path}`. Change no other column.
5. Report in chat: the report path, the top five companies with their scores, and how many were not scored and why.

## `score jobs`

1. Review the job matrix as above.
2. Find the latest search report under `DATA/search/`. If there is none, say so, suggest `search`, and stop after the matrix review.
3. For every opportunity in that report, score it from its scorecard. An opportunity without a scorecard, from a report written before scoring existed, is "not scored: no scorecard; run `search`".
4. Write `DATA/scores/JOBS-{yyyyMMdd-HHmmss}.md`, never overwriting an earlier one. Start with the date and time, the matrix's `Last reviewed` date and the search report path, and then a table with the columns Rank, Title, Company, Fit, Score, Unknown weight and Posting. Order rows by fit (Strong, Possible, Stretch), then by score from high to low, then by unknown weight from high to low (more room to rise, because less is confirmed unmet). List postings that were not scored after the table, each with its reason.
5. Never change the search report or `search/seen.csv`.
6. Report in chat: the report path, the top five postings with their scores and links, and how many were not scored and why.
