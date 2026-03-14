## Project Overview

Components are the product. CLI is the installer. Website is for showcase.

Read README.md for structure and usage.

## Rules

- No CSS imports in component `.tsx` files (CSS is concatenated at install time)
- No barrel exports (`index.ts`) inside `soluid/`
- Registry categories are `"core"` and `"components"` only

## Branching

- Create feature branches from latest main: `git switch main && git pull && git switch -c feature/xxx`
- One branch per issue. Commit only that issue's changes on that branch
- Run `bun run fmt` on main before branching to avoid formatting-only diffs
- Never commit `docs/` build output on feature branches — rebuild on main after merge
- Keep branches short-lived to minimize merge conflicts
