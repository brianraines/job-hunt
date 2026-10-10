# job-hunt

An agent skill for a focused, private job search with Claude Code or Codex. It interviews you about what you want, keeps that in private files, and (in later versions) evaluates companies, searches for matching openings and finds people worth contacting.

It never acts for you: it does not apply to jobs, fill forms, send messages or connection requests, sign in to websites, or edit your resume.

> **Status: 0.1, in development.** Interview and status work. `eval` (0.2), `search` (0.3) and `connect` (0.4) are not available yet. The skill is marked internal until 1.0, so installing it requires `INSTALL_INTERNAL_SKILLS=1`. See [docs/SPEC.md](docs/SPEC.md) for the full design.

## Install

```sh
INSTALL_INTERNAL_SKILLS=1 npx skills add brianraines/job-hunt -g
```

Omit `-g` to install it into the current project only. The installer links the skill for both Claude Code (`.claude/skills/`) and Codex (`.agents/skills/`).

## Use

Run it from the root of a Git project where you want to keep your private job-search files.

| Claude Code | Codex | What it does |
| --- | --- | --- |
| `/job-hunt` | `$job-hunt` | Status of your files, and the next step |
| `/job-hunt interview` | `$job-hunt interview` | Review all your directive files with you |

The first run interviews you for anything missing.

### Codex web access

`eval`, `search` and `connect` need live web search and network access. If Codex does not have them, start it with:

```sh
codex --search -c sandbox_workspace_write.network_access=true
```

## Privacy

Your answers include salary expectations, target and excluded employers, and names of people. They are stored only in `docs/job_hunt/` inside your project, and the skill refuses to write there unless Git ignores that folder. It offers to add the ignore rule for you, and adds a second `.gitignore` inside the folder.

The skill never commits, pushes or deploys that folder. Before overwriting one of your files it saves a copy in `docs/job_hunt/.history/`. There is no other history, so make sure your machine is backed up.

Companies on your blacklist are never searched for and never named in any query the skill sends.

## Your files

| File | Contents |
| --- | --- |
| `PROFILE.md` | Location, time zone, current employer, resume sources the skill may read |
| `IDEAL_ROLES.md` | Titles, levels, focus areas, keywords, exclusions |
| `IDEAL_COMPANIES.md` | The kind of company you want, and a ledger of companies to target |
| `IDEAL_BENEFITS.md` | Compensation and benefits, including your minimum |
| `RED_FLAGS.md` | Dealbreakers, warning signs, review-score thresholds |
| `BLACKLIST.md` | Companies never to search against |

## Development

See [AGENTS.md](AGENTS.md).

## License

MIT. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
