# Privacy and data location

The operator's job-search data is private: salary expectations, target and blacklisted employers, and names of third parties. It must never be committed, pushed, deployed or copied into tracked files.

## Where data lives

- `ROOT` is the project root: the output of `git rev-parse --show-toplevel` run from the current directory.
- `DATA` is `ROOT/docs/job_hunt/`. All private files live there and nowhere else.
- If the current directory is not inside a Git repository, stop. Explain that job-hunt only runs inside a Git project, so that it can verify the data folder is ignored, and suggest running it from such a project.

## Checks before reading or writing

1. Run `git check-ignore --quiet docs/job_hunt/` from `ROOT`.
2. If it fails, the folder is not ignored. Do not create or write anything. Explain the risk in one sentence, then ask the operator whether to add this line to `ROOT/.gitignore`:

   ```
   docs/job_hunt/
   ```

   Edit `.gitignore` only after an explicit yes, then run the check again. If the operator declines, stop.
3. Run `git ls-files docs/job_hunt`. If it prints anything, files are already tracked. Stop and tell the operator; do not untrack or delete them yourself.
4. If `DATA/.gitignore` does not exist, create it containing a single line: `*`.

## Writing rules

- Never stage, commit, push, upload or deploy anything under `DATA`, and never copy its contents into tracked files, commit messages or pull requests.
- Before overwriting `CONNECTIONS.md` or any directive file, copy the current version to `DATA/.history/{name}-{timestamp}.md`, where `{name}` is the file name without `.md`. Create `.history/` if needed.
- Never delete files in `DATA`.
- Timestamps use the format `yyyyMMdd-HHmmss` in the time zone from `PROFILE.md`, or the system's local time zone before that file exists. For example: `TZ=America/Chicago date +%Y%m%d-%H%M%S`. Dates use `YYYY-MM-DD`.
- File names never contain colons.

## Outgoing queries

Every query or URL you send to a search engine or website leaves the machine. Never include the name of any company listed in `BLACKLIST.md`.
