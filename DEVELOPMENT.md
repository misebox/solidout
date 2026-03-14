## Setup

```sh
bun install                  # install dependencies
sh bin/setup-hooks.sh        # install git hooks (pre-commit, pre-push)
```

## Development

```sh
bun run dev                  # start catalog dev server (localhost:5173)
bun run typecheck            # type check
bun run lint                 # lint (oxlint)
bun run fmt                  # format (dprint)
bun run generate:api         # regenerate API data from component Props
bun run build:catalog        # build catalog site to docs/
bun run build:cli            # build CLI to dist/
```
