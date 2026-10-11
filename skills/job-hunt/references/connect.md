# Connect

`connect {company}` records recruiters and hiring managers at a company whom the operator might contact. The operator decides whether and how to contact anyone. Never send a message, connection request or email, and never draft one unless the operator asks.

Uses: `references/privacy.md` and the template `templates/CONNECTIONS.md`.

## 1. Check first

1. Compare the company with `BLACKLIST.md` as `references/privacy.md` describes, before any web search. On a match, say that the company is on the blacklist and stop. Send no query and write nothing.
2. If the company is not in the `IDEAL_COMPANIES.md` ledger, suggest running `eval {company}` first. Continue only if the operator wants to.
3. Read `IDEAL_ROLES.md` for the operator's target titles, focus areas and levels, and `CONNECTIONS.md` if it exists.

## 2. Find people

Look for two role types:

- `recruiter`: recruiters, technical recruiters or talent acquisition staff who hire engineers.
- `hiring manager`: engineering managers, directors or heads of engineering for groups that match the focus areas in `IDEAL_ROLES.md`.

Use public web search results only. Queries restricted to public profiles work well, for example:

- `site:linkedin.com/in "Example Co" "technical recruiter"`
- `site:linkedin.com/in "Example Co" "engineering manager" platform`
- `"Example Co" "director of engineering"` for the company's own team pages, engineering blog and conference talks

Read names and titles from the search results themselves. Never open linkedin.com pages, sign in to LinkedIn, automate a LinkedIn session or read anything behind a login (see `references/privacy.md`). Other public pages, such as the company's own team page or a conference speaker page, may be opened.

Keep people whose result names this company and a title in one of the two role types. Mark them `confirmed` when the result shows the role is current, for example "at Example Co" with no end date or "Present", and `unverified` otherwise. Skip people whose result shows they have left. Never guess a person's name, title, profile URL or employer.

## 3. Record

At most 10 new people per run. Prefer people whose current role is confirmed, then those closest to the operator's focus areas.

For each person, record only these fields:

| Column | Contents |
| --- | --- |
| Company | The company name as in the ledger |
| Name | As shown in the result |
| Title | As shown in the result |
| Role type | `recruiter` or `hiring manager` |
| Profile URL | The public profile or page URL from the result, exactly as shown |
| Found | How it was found, such as the query or the page, and today's date |
| Confidence | `confirmed` when the result shows the current role at this company, otherwise `unverified` |
| Status | `not contacted` for new rows |
| Notes | Empty, or a short note such as the team or focus area from the result |

Never record or guess personal email addresses, phone numbers, home locations or other personal details, even if a page shows them.

## 4. Update `CONNECTIONS.md`

1. If it does not exist, create it from `templates/CONNECTIONS.md`. Otherwise copy it to `.history/` first (see `references/privacy.md`).
2. A person already listed for this company, matched by profile URL or by name, is not added again. If their title changed, update `Title`, `Found` and `Confidence`, and keep everything else.
3. Never change an existing `Status` or `Notes`: those belong to the operator. Never delete a row.
4. Set `Last updated` to today.

## 5. Report in chat

List the people added and updated with name, title, role type and confidence, the number of search queries used, and the number of results skipped because they showed a past role or did not match a role type. Remind the operator that contacting people is their decision, and that `Status` is theirs to update.
