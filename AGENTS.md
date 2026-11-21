## Agent skills

### Issue tracker

Issues and PRDs live as GitHub issues on `evilpaper/super-hero-card-brawl`. See `docs/agents/issue-tracker.md`.

### Triage labels

Five canonical roles, label strings equal to their names: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.

## Code style

Comments are always multi-line `/** ... */` blocks, never `//` line or end-of-line comments. Name a type for the role the caller sees, and leave the data structure out of the type name. See `docs/agents/code-style.md`.
