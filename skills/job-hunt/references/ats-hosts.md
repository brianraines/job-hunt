# Job boards and tracking systems

Used by `references/eval.md` to find and verify a company's board, and by `references/search.md` to list its postings. Report a tracking system only when you confirmed it; a guess from the company name is not evidence. Never send a blacklisted company's name or fetch its board (see `references/privacy.md`).

## Identify the system from a URL

The host of a careers or posting URL usually names the system. Follow redirects from the company's own careers page and read the final URL.

| Host contains | Board type |
| --- | --- |
| `myworkdayjobs.com`, `myworkdaysite.com` | Workday |
| `boards.greenhouse.io`, `job-boards.greenhouse.io`, `job-boards.eu.greenhouse.io` | Greenhouse |
| `jobs.ashbyhq.com` | Ashby |
| `jobs.lever.co`, `jobs.eu.lever.co` | Lever |
| `apply.workable.com`, `jobs.workable.com` | Workable |
| `jobs.smartrecruiters.com` | SmartRecruiters |
| `.icims.com` | iCIMS |
| `taleo.net` | Oracle Taleo |
| `oraclecloud.com/hcmui` | Oracle Recruiting Cloud |
| `successfactors.com`, `.sapsf.com` | SAP SuccessFactors |
| `.recruitee.com` | Recruitee |
| `.teamtailor.com` | Teamtailor |
| `.bamboohr.com` | BambooHR |
| `.breezy.hr` | Breezy |
| `jobs.jobvite.com` | Jobvite |
| `.applytojob.com` | JazzHR |
| `jobs.personio.` | Personio |
| `dayforcehcm.com` | Dayforce |
| `recruitingbypaycor.com` | Paycor |
| `teamworkonline.com` | TeamWork Online (sports) |

The path segment or leftmost subdomain is usually the board slug: `boards.greenhouse.io/example` has the slug `example`. A board on the company's own domain with no recognizable host is a "careers page".

## Public listing endpoints

Prefer these public, unauthenticated JSON endpoints over reading HTML.

| Board type | List postings | Posting URL to report |
| --- | --- | --- |
| Greenhouse | `https://boards-api.greenhouse.io/v1/boards/{slug}/jobs?content=true` (includes each description) | `absolute_url` of the posting |
| Ashby | `https://api.ashbyhq.com/posting-api/job-board/{slug}?includeCompensation=true` | `jobUrl` of the posting |
| Lever | `https://api.lever.co/v0/postings/{slug}?mode=json` (EU boards: `api.eu.lever.co`) | `hostedUrl` of the posting |
| Workable | `https://apply.workable.com/api/v1/widget/accounts/{slug}` | `url` of the posting |
| SmartRecruiters | `https://api.smartrecruiters.com/v1/companies/{slug}/postings` | The posting page linked from the posting's record |
| Recruitee | `https://{slug}.recruitee.com/api/offers/` | `careers_url` of the offer |

Rules for these endpoints:

- The only URLs you may build yourself are these listing endpoints filled with a slug you are probing, and the same API's one-posting endpoint filled with an `id` that its listing returned (for example `https://boards-api.greenhouse.io/v1/boards/{slug}/jobs/{id}`). Every other URL, including the one you report for a posting, must come from a page or endpoint you opened.
- A posting's record in the listing, or its own one-posting record from the same API, counts as opening the posting. The report links the posting URL from the right-hand column, and `seen.csv` uses that same URL.
- When you have only a company name, try one or two slugs derived from it (lowercase, punctuation removed, with and without hyphens) against these endpoints, and stop at the first confirmed hit.

Other systems, including Workday, iCIMS, Taleo, Oracle Recruiting Cloud, SuccessFactors, Teamtailor and Jobvite, are not covered by these endpoints and can only be found from a URL. "Could not probe for Workday" never means "not on Workday". For these, open the careers page itself. If it lists jobs only through JavaScript you cannot run, record the board as found but list it under "Sources not checked" in a search, with its link.

## Confirm a hit

A board that answers is not yet proof. Before recording it:

1. **The board's own name.** If the endpoint returns a company name, it must be the company you asked about. Otherwise it belongs to another employer: reject it.
2. **Open roles.** Zero postings means "a board exists but is empty", not a confirmed board. For Lever, `200 []` is an empty board and `404` is no board.
3. **Common words.** Short or common-word names often share slugs with unrelated companies. When the name is a common word and the board is small, open a posting and check that it names the company before accepting the board.

`Last verified` is the date the board loaded and listed at least one job in this run.

The host table, the probing endpoints and these checks are adapted from `ats-detective` in squerne/open-career-skills; see `NOTICE`. The EU hosts, the rows for Oracle Recruiting Cloud, Dayforce, Paycor and TeamWork Online, the posting URL column and the `Last verified` rule were added for job-hunt.
