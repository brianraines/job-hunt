# Search

`search` finds open postings that match the directive files and writes a report. It never applies to anything and never adds companies to the ledger.

Uses: `references/privacy.md`, `references/rubric.md`, `references/ats-hosts.md`, `references/review-sites.md`, `references/score.md`, and the templates `templates/SEARCH.md` and `templates/seen.csv`.

## 1. Prepare

1. Read all six directive files, `CONNECTIONS.md` if it exists, and `search/seen.csv` if it exists.
2. Read the resume sources in `PROFILE.md`. If one cannot be read, say which and continue.
3. Note the start time in the `PROFILE.md` time zone. The report path is `DATA/search/{yyyy-mm-dd}/SEARCH-{yyyyMMdd-HHmmss}.md`.
4. Build the role filter from `IDEAL_ROLES.md`: target titles, title variants and search keywords, and the excluded titles and work.
5. If the ledger has fewer than 20 `active` companies, say so at the start; the search still runs.

Keep a running log of every query and source with its result count, including those that returned nothing. The report lists them all.

"Blacklisted companies dropped" in the report counts distinct blacklisted companies whose postings or results were dropped in this run, from any source.

## 2. Ledger boards

For each `active` ledger company, in ledger order:

1. Check it against `BLACKLIST.md`. A ledger company should never be blacklisted; if one is, skip it, count it as dropped, and tell the operator at the end without naming it in any query.
2. If `Last verified` or `Reviews checked` is older than 90 days, "not verified" or empty, re-verify the board with `references/ats-hosts.md` and refresh the review columns with `references/review-sites.md`. Remember the new values for step 10. If the board cannot be re-verified, keep its old `Last verified` value, list it under "Sources not checked" with its link, and move on. If the board has moved to a new URL, keep the ledger's URL, do not read the new board in this run, list the new URL under "Sources not checked", and suggest `eval {company}`.
3. List the board's open postings, preferring the public endpoint for its board type in `references/ats-hosts.md`. If the board cannot be read, add it to "Sources not checked" with its link and move on.
4. Keep postings whose title matches the role filter and is not excluded.

`paused` companies are not searched.

## 3. Web search

Run web searches built from the role filter, for example `"Principal Software Engineer" remote`, `"Staff Engineer" "AI agents" remote`, or the same titles with the operator's acceptable locations. You may restrict a query to a tracking-system host from `references/ats-hosts.md`, for example `site:jobs.ashbyhq.com "Staff Engineer"`. Never put a company name from `BLACKLIST.md` in a query, and never put the operator's private details in one.

For each result that looks like a posting:

- Identify the employer. If it matches `BLACKLIST.md`, drop the result without opening it and count the company. Never write its name anywhere.
- Find the employer's own posting URL. An aggregator copy, such as LinkedIn, Indeed or Built In, is a lead only: search for the same posting on the employer's board and use that. If you cannot find the employer's copy, list the lead under "Sources not checked" with its link. Never open linkedin.com pages.
- Keep it if the title matches the role filter and is not excluded.

## 4. Open the matching postings

Remove duplicates by URL across steps 2 and 3. Then open the full posting for every kept title, in this order: postings not in `seen.csv` first, then those already in it. Stop at 300 postings opened in one run, and record how many were opened and how many the cap skipped.

One posting counts as one opening, whether you read it from a listing that already includes its description, from its own API record, or from its web page.

A posting counts as open only if, in this run, its page or its record from the tracking system's public endpoint returned the posting itself and did not say it was closed, filled or no longer accepting applications. A search snippet, a cached copy, or a redirect to a list of jobs is not proof. Report the posting URL that page or record gives (see `references/ats-hosts.md`); never construct or guess one.

From each open posting, take:

- Title, company, URL, location and arrangement as stated.
- Compensation exactly as posted, or "not stated". Never estimate it.
- Posting date, reported as its age in days, or "date not shown".
- Eligibility blockers stated anywhere in the posting, especially near the end: no visa sponsorship, citizenship or clearance required, mandatory relocation, or required on-site days. Quote the phrase. If none is stated, write "none stated"; never infer a blocker from silence.
- The required and preferred items, as `references/rubric.md` describes.

## 5. Rate

Rate each posting with the posting rules in `references/rubric.md`: Skip, Strong, Possible, Stretch, or not a match.

- **Ledger company:** use its latest eval in `Last eval`. A dealbreaker in that eval makes the posting Skip.
- **Company not in the ledger:** check it against `BLACKLIST.md` (drop it if it matches), apply the dealbreakers visible in the posting, and mark the company "not evaluated". For each Strong or Possible posting, suggest `eval {company}` in the report.

## 6. News

For each company with a Strong or Possible posting in this run, run about two web searches for the signals in `RED_FLAGS.md`. This includes companies whose postings may turn out to be previously reported, so that new red flags still change their ratings. Record findings with links and dates, or "none found". A dealbreaker found here makes that company's postings Skip. These are the final ratings.

## 7. Previously reported postings

Compare each posting rated in this run with `search/seen.csv` by URL, using its final rating:

- **New URL:** report it, and add a row with `first_seen` and `last_seen` set to today and `last_rating` set to its rating.
- **Seen before, with the same title and rating:** do not report it again. Set `last_seen` to today and count it as previously reported.
- **Seen before, with a changed title or rating:** report it, note what changed, and update `title`, `last_seen` and `last_rating`.

Record every rated posting, including Skip and not a match, so a later change can be detected. Reported Skip postings go under Excluded. `seen.csv` columns are `url,company,title,first_seen,last_seen,last_rating`, with standard CSV quoting. Start it from `templates/seen.csv` if it does not exist.

## 8. Write up each reported opportunity

For each reported Strong, Possible or Stretch posting:

1. **Contacts:** list the people in `CONNECTIONS.md` at that company with their role type and status, or "none".
2. **Executive summary:** two to four sentences tied to specific Must-haves and to facts from the resume sources. Never claim experience the resume sources do not state.
3. **Gaps or warning signs:** unmet or unknown Must-haves, unmet `PROFILE.md` Must-haves, soft warning signs from `RED_FLAGS.md`, and the posting warning signs in `references/rubric.md`. Write "None found" if there are none.
4. **Scorecard:** each Must-have and Nice-to-have in `IDEAL_ROLES.md` and `IDEAL_BENEFITS.md`, word for word, marked met, unmet or unknown with the same results used for the rating.

## 9. Score

When every write-up in step 8 is finished, score each reported opportunity from its scorecard with the job matrix in `references/score.md`. Record the score, or the reason it was not scored, on the opportunity. The score never changes a rating.

## 10. Write

1. Write the report from `templates/SEARCH.md`. Order opportunities Strong, then Possible, then Stretch; within each, by score from high to low, with unscored opportunities last; break ties with ledger companies with a Strong fit first, then by most recent posting date. Show each directive file's `Last reviewed` date. Name no blacklisted company anywhere; show only the count dropped.
2. Write `search/seen.csv`.
3. If step 2 refreshed any ledger rows, copy `IDEAL_COMPANIES.md` to `.history/` and update only `Last verified`, the three review columns and `Reviews checked` for those rows. Never add, remove or reorder rows, and never change any other column.

## 11. Report in chat

In a few lines: the report path, the counts (opportunities by rating, excluded, blacklisted companies dropped, previously reported, postings opened and skipped by the cap), the top three opportunities with their scores and links, whether scoring was skipped and why, sources not checked, ledger rows refreshed, and any `eval` suggestions.
