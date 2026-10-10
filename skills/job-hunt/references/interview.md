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

Work through the files in this order, skipping any outside the scope: `PROFILE.md`, `IDEAL_ROLES.md`, `IDEAL_COMPANIES.md`, `IDEAL_BENEFITS.md`, `RED_FLAGS.md`, `BLACKLIST.md`.

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

- Fill in the company profile and its Must-haves and Nice-to-haves.
- Ask which companies the operator already wants to target. For each, find its careers page or applicant tracking system board through web search, open it to confirm it loads and lists jobs, and record the URL and today's date in `Last verified`. If web access is unavailable, or the board cannot be found or opened, record the company with the board URL left empty and `Last verified` set to "not verified". Never guess a URL.
- Add companies to the ledger only when the operator approves them. Set their status to `active`.
- Batch proposals of new companies, each checked against the company profile, start in version 0.2 with `eval`. Until then, if the ledger has fewer than 20 `active` companies, say so and invite the operator to name more.

## Blacklist

- On the first interview, propose adding the current employer from `PROFILE.md`, with the reason "current employer". Ask whether any past employers or other companies belong on the list.
- Add each company only after the operator explicitly approves that company. Record the reason, today's date and "Approved: yes".
- When the operator confirms the list is complete, even if it is empty, set the `Confirmed:` line to today's date.
- Never put a blacklisted name in a search query or URL during the interview.

## Finishing

Report which files were saved, any that remain incomplete and why, and the number of `active` ledger companies. Then continue with the subcommand that triggered the interview, if any.
