# Review sites

Used by `references/eval.md` and by `references/search.md` when it refreshes stale ledger rows. Follow `references/privacy.md`: public pages only, never sign in, never guess a number.

For each site, record exactly one of:

- the value, with the link you opened and today's date in `Reviews checked`, or
- the link you tried and "not checked", when the page blocked reading, asked you to sign in, or did not show the value.

Find each company page with one web search such as `"Example Co" Glassdoor reviews`, and use only the result on the site's own domain. Never use a number quoted by a third-party page instead.

## Glassdoor

- Value: the overall rating out of 5 and the review count shown on the company's public overview or reviews page, for example "4.1 (2,300 reviews)".
- Glassdoor often asks visitors to sign in or blocks automated reading. Then record "not checked" with the link. If a search-result snippet on glassdoor.com shows the rating and review count, you may add them as "snippet: 4.1 (2,300 reviews), not opened", but the column still counts as not checked.
- Apply the review-score thresholds in `RED_FLAGS.md` only to a rating read from a page you opened. With "not checked" or a snippet, the threshold is unknown.

## Levels.fyi

- Value: the median total compensation at the operator's target level, from the company's public software engineer salaries page on levels.fyi, found through web search, with the level name the company uses.
- Map the operator's target title (from `IDEAL_ROLES.md`) to the company's level only when the page shows the level names. If you cannot match a level, record the overall software engineer median, mark it "level not matched", and treat it as unknown for compensation thresholds.
- Never treat total compensation as base salary. Compare it with the minimum in `IDEAL_BENEFITS.md` only when that minimum is stated as total compensation.

## Blind

- Value: the link to the company's public page on teamblind.com.
- Do not read posts or reviews that need sign-in. A public Blind page can be cited for a red-flag signal, such as a layoff report, only as an unverified claim alongside another source.
