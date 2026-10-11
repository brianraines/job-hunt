# Interview

Goal: make every directive file complete (see `references/files.md`) without asking the operator for anything their sources already say.

## Scope

- From preflight: interview only the missing or incomplete files.
- From `interview`: review all six files.

## Before asking anything

1. Read every existing directive file.
2. If `PROFILE.md` exists, read the resume and context sources it lists. If one cannot be read in this agent (for example a cloud document with no connector), tell the operator which one and continue with the rest.
3. If `PROFILE.md` does not exist, the first questions are where the operator's resume lives and which other sources you may read. Read them before asking anything else.

Use these sources only as context. Never edit them.

## Order

Work through the files in this order, skipping any outside the scope: `PROFILE.md`, `IDEAL_ROLES.md`, `IDEAL_COMPANIES.md`, `IDEAL_BENEFITS.md`, `RED_FLAGS.md`, `BLACKLIST.md`. Then run the Ledger step below, but only for the `interview` command or when preflight found `IDEAL_COMPANIES.md` missing or incomplete. Otherwise, if the ledger has fewer than 20 `active` companies, just say so and suggest `interview`.

## How to ask

- Ask at most three questions per turn.
- Offer concrete choices drawn from the operator's sources where you can, always with a free-text option.
- For a file that already has content, summarize what it says and ask what has changed, instead of asking from scratch.
- When the operator skips a question, record "not specified" for it. Do not guess. The file stays incomplete.

## Saving

After the questions for one file:

1. Show a short summary of the file's new content and ask the operator to confirm or correct it.
2. Once confirmed: if the file already exists, copy it to `.history/` first (see `references/privacy.md`). Then write the file from its template, set `Last reviewed` to today, and keep the template's headings.
3. Move to the next file.

Save each file as soon as it is confirmed, so an interrupted interview resumes with the files still incomplete.

## Companies

Fill in the company profile and its Must-haves and Nice-to-haves in the normal order. Build the ledger later, in the Ledger step after the blacklist: evaluating a company sends queries, which needs a confirmed `BLACKLIST.md`, and its verdict needs `RED_FLAGS.md` and `IDEAL_BENEFITS.md`. If the operator names companies before then, note them and evaluate them in the Ledger step.

## Ledger

Run this step after `BLACKLIST.md` is confirmed and `RED_FLAGS.md` and `IDEAL_BENEFITS.md` are complete. If any of them is not, skip the step and say why.

- Ask which companies the operator already wants to target, and accept names at any point. Check each against `BLACKLIST.md` first (see `references/privacy.md`), then run steps 1 to 4 of the `references/eval.md` procedure and show the verdict. Write its eval report (eval step 5). Add it to the ledger only when the operator approves, filling the row as eval step 6 describes and copying `IDEAL_COMPANIES.md` to `.history/` first. For a Not a fit, explain why first; add it only if the operator still wants it, as `active` or `paused` as they choose.
- If web access is unavailable, record an approved company with the board URL left empty and `Last verified` set to "not verified", and suggest `eval` for it later. Never guess a URL.
- If the ledger has fewer than 20 `active` companies, offer to propose more. Proposals come in batches of about 10:
  1. Pick candidates that fit the company profile from your own knowledge and web search. Never pick a blacklisted company, a company already in the ledger, or one in an excluded domain or industry.
  2. Run steps 1 to 4 of the `references/eval.md` procedure for each candidate; it writes nothing. Drop every Not a fit.
  3. Show the Strong and Possible fits in one list: company, verdict, "why it fits" line, and verified board URL. Say how many candidates were dropped and why, in a sentence.
  4. The operator keeps or drops them in one reply. For each kept company only, write its eval report (eval step 5) and add a ledger row as `active` (eval step 6), after one `.history/` copy of `IDEAL_COMPANIES.md` for the batch.
  5. Offer another batch until there are at least 20 `active` companies or the operator stops.

## Blacklist

- On the first interview, propose adding the current employer from `PROFILE.md`, with the reason "current employer". Ask whether any past employers or other companies belong on the list.
- Add each company only after the operator explicitly approves that company. Record the reason, today's date and "Approved: yes".
- For each entry, ask whether the company uses other names or brands, and add them to the Reason as "also known as …" so that matching catches them.
- When the operator confirms the list is complete, even if it is empty, set the `Confirmed:` line to today's date.
- Never put a blacklisted name in a search query or URL during the interview.

## Finishing

Report which files were saved, any that remain incomplete and why, and the number of `active` ledger companies. Then continue with the subcommand that triggered the interview, if any.
