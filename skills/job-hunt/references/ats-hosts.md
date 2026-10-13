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
| Workday | `POST https://{host}/wday/cxs/{tenant}/{site}/jobs` with JSON body `{"appliedFacets":{},"limit":20,"offset":{n},"searchText":"{text}"}` (20 per page; page with `offset`) | `externalUrl` from the posting's one-posting record |

Rules for these endpoints:

- The only URLs you may build yourself are these listing endpoints filled with a slug you are probing, and the same API's one-posting endpoint filled with an `id` that its listing returned (for example `https://boards-api.greenhouse.io/v1/boards/{slug}/jobs/{id}`). Every other URL, including the one you report for a posting, must come from a page or endpoint you opened.
- A posting's record in the listing, or its own one-posting record from the same API, counts as opening the posting. The report links the posting URL from the right-hand column, and `seen.csv` uses that same URL.
- When you have only a company name, try one or two slugs derived from it (lowercase, punctuation removed, with and without hyphens) against these endpoints, and stop at the first confirmed hit.
- **Workday** endpoints are built only from a board URL you opened, never guessed from a company name. In `https://{tenant}.wd{n}.myworkdayjobs.com/{locale?}/{site}`, `{host}` is the full host, `{tenant}` is the leftmost subdomain and `{site}` is the last path segment, after any locale such as `en-US`. The listing record has `title`, `externalPath`, `locationsText` and `postedOn` only. Opening a posting means a `GET` of the one-posting endpoint `https://{host}/wday/cxs/{tenant}/{site}{externalPath}`, using an `externalPath` the listing returned. Its `jobPostingInfo` holds the description, `location`, `additionalLocations`, `startDate` (the posting date), and the `externalUrl` to report. A record with `posted` false or `canApply` false is not open. Workday's `searchText` is a keyword search, not a title filter: query each target title from `IDEAL_ROLES.md` separately, de-duplicate by `externalPath`, and still apply the role filter to each title. Record the `total` each query returned.

Other systems, including iCIMS, Taleo, Oracle Recruiting Cloud, SuccessFactors, Teamtailor, Jobvite, Eightfold and Phenom careers sites, are not covered by these endpoints and can only be found from a URL. Workday is likewise found only from a URL: "could not find a Workday board" never means "not on Workday". For these, open the careers page itself. If it lists jobs only through JavaScript, use the browser fallback below.

## Browser fallback for JavaScript-only careers pages

When a careers page lists jobs only through JavaScript and no endpoint above covers it, render it in a browser tool the agent has, such as the Claude desktop app's built-in browser, Playwright, or a headless browser. Rules:

- Public pages only, the same as `references/privacy.md`. Use a fresh, signed-out browser context. If the browser already holds a session for the site, or the page asks you to sign in, accept terms, or solve a CAPTCHA, stop and record the board under "Sources not checked". Decline non-essential cookies. Never submit a form other than the site's own job-search box.
- Search the page's job-search box with the target titles from `IDEAL_ROLES.md`, one at a time, and read the result list as text. Follow only posting links the page shows, and record the URL of each posting page you read.
- A posting page you rendered and read counts as opening it, under the same open/closed rules as any other posting.
- Read pages as text or through the accessibility tree; do not rely on screenshots for facts. If results are paged, read pages in order until the role filter finds no new titles or the run cap is reached.
- The page's own data requests, as shown in the browser's network log, may be read in place of the rendered text. Read them at a human pace, one request at a time with a pause between, never in parallel bursts.
- On HTTP 429 (rate limited), wait and retry at a slower pace, at most three times. On HTTP 403, a block page or a challenge, stop reading that site for the rest of the run. Record what was listed before the block as unverified leads, and list the board under "Sources not checked".
- If no browser tool is available, or rendering fails, list the board under "Sources not checked" with its link, and say why.

## Confirm a hit

A board that answers is not yet proof. Before recording it:

1. **The board's own name.** If the endpoint returns a company name, it must be the company you asked about. Otherwise it belongs to another employer: reject it.
2. **Open roles.** Zero postings means "a board exists but is empty", not a confirmed board. For Lever, `200 []` is an empty board and `404` is no board.
3. **Common words.** Short or common-word names often share slugs with unrelated companies. When the name is a common word and the board is small, open a posting and check that it names the company before accepting the board.

`Last verified` is the date the board loaded and listed at least one job in this run.

The host table, the probing endpoints and these checks are adapted from `ats-detective` in squerne/open-career-skills; see `NOTICE`. The EU hosts, the rows for Oracle Recruiting Cloud, Dayforce, Paycor and TeamWork Online, the posting URL column, the Workday endpoints, the browser fallback and the `Last verified` rule were added for job-hunt.
