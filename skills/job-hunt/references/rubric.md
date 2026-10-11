# Rating rules

Used by `references/eval.md` for companies and `references/search.md` for postings. Ratings use only the operator's lists in the directive files: Must-haves, Nice-to-haves, and the dealbreakers and thresholds in `RED_FLAGS.md`. Never add criteria of your own.

Scores from `references/score.md` rank items within a verdict or rating; they never change one.

## Checking one item

Mark each Must-have, Nice-to-have and dealbreaker as one of:

- **met** (for a dealbreaker: **found**): the evidence states it, with a source you opened in this run.
- **unmet** (for a dealbreaker: **not found**): the evidence states the opposite. For a dealbreaker, "not found" means you looked and found no sign of it.
- **unknown**: the evidence does not say, or the source could not be read.

Unknown is neutral: it neither meets nor fails an item, and it is always reported as unknown. Never infer an item from silence. For example, a posting that does not mention sponsorship has no sponsorship blocker, and a posting with no salary has compensation "not stated", which is not below the minimum.

"Most" means at least one Must-have is met and more are met than unmet; unknown items are left out of the count. Report how many were unknown, so a verdict resting on little evidence is visible.

Evidence for "met" or "found" must come from a page or endpoint you opened in this run. A search-result snippet may be shown as context but counts as unknown.

## Company verdict (eval)

Must-haves and Nice-to-haves come from `IDEAL_COMPANIES.md`. Apply in order and stop at the first match:

1. Any dealbreaker from `RED_FLAGS.md` found at company level, including a review-score threshold marked as a dealbreaker or compensation evidence below the minimum in `IDEAL_BENEFITS.md`: **Not a fit**. Compensation counts only when the source states a figure for the operator's target level, such as a Levels.fyi median at that level or posted ranges on every matching open role.
2. Every Must-have met: **Strong fit**.
3. Most Must-haves met: **Possible fit**.
4. Otherwise: **Not a fit**.

## Posting rating (search)

Must-haves and Nice-to-haves come from `IDEAL_ROLES.md` and `IDEAL_BENEFITS.md`. Dealbreakers come from `RED_FLAGS.md`. Apply in order and stop at the first match:

1. **Skip** (listed under Excluded with the reason): any dealbreaker found in the posting, its stated eligibility terms or its company's latest eval, or a stated compensation figure whose top is below the minimum in `IDEAL_BENEFITS.md`. Compare base with a base minimum and total with a total minimum; if the posting does not say which it is, treat it as base.
2. **Strong**: every Must-have met, and at least two Nice-to-haves met.
3. **Possible**: most Must-haves met, or every Must-have met with fewer than two Nice-to-haves met. List any unmet Must-have as a gap.
4. **Stretch**: the title, level and technical focus match `IDEAL_ROLES.md`, but one material gap exists, such as an unmet Must-have. State the gap.
5. Anything else is not a match: do not list it, and count it in the report's totals only.

Unmet Must-haves from `PROFILE.md` (for example work authorization or location) are always reported under the posting's gaps, even though they do not change the rating unless `RED_FLAGS.md` lists them as dealbreakers.

## Reading a posting

Split the posting's own requirements into:

- **Required**: stated as required or repeated several times, such as specific skills, years of experience or domain knowledge.
- **Preferred**: marked preferred, a bonus, or mentioned once. Never treat these as gaps; candidates often rule themselves out over requirements that are optional.

Compare the required items with the operator's resume sources to decide whether a gap is material. Cite only facts that the resume sources state; never claim experience they do not list.

## Posting warning signs

Report these as soft warning signs under the posting's gaps. They are not dealbreakers unless `RED_FLAGS.md` lists them.

- "Wear many hats" with no clear scope: risk of undefined ownership.
- Ten or more required technologies for one role: an unrealistic bar or poor team planning.
- No mention of the team, the stack or what the role ships: possible disorganization.

The required and preferred split and these warning signs are adapted from `technical-job-search` in github/awesome-copilot; see `NOTICE`.
