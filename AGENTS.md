# AGENTS.md

## Source of truth

- `README.md` is stale about the CLI shape and `bun run typecheck`; trust `src/index.ts`, `package.json`, and command files instead.

## Commands

- `bun run dev` runs the CLI from source via `src/index.ts`.
- `bun run lint` uses `oxlint`.
- `bun run typecheck` is `oxlint --type-aware`, not `tsc`.
- `bun run fmt` checks formatting with `oxfmt --check`; `bun run fmt:fix` writes fixes.
- `bun run lint:fix` runs `oxlint --fix`.
- `bun run build` cross-compiles all release targets.
- `bun run build -- --single` builds only the host target.
- `bun run build -- --single --baseline` includes the host baseline build when applicable.
- Pre-commit runs `bun run lint && bun run typecheck && bun run fmt` in that order.
- There is no test suite.

## CLI shape

- Real top-level commands are `gtc config`, `gtc theme`, and `gtc font`; all require a subcommand.
- `config` subcommands: `list` (`show`, `ls`), `remove <name>` (`rm`), `validate` (`check`).
- `theme` subcommands: `list`, `install`, `remove` (`rm`), `set`.
- `font` subcommands: `list`, `set`.
- `config list` uses `--query` / `-q`, not `--search`.

## Verification shortcuts

- `bun run src/index.ts config list`
- `bun run src/index.ts config list --query font`
- `bun run src/index.ts config validate`
- `bun run src/index.ts theme list`
- `bun run src/index.ts font list`

## Code map

- `src/index.ts` wires the yargs entrypoint and registers the `config`, `theme`, and `font` command groups.
- `src/config/index.ts` owns config file I/O, hardcoded Ghostty paths, cache paths, and theme API env overrides.
- `src/theme/index.ts` fetches remote themes, caches them at `~/.config/gtc/cache/themes.json`, and installs/removes local theme files.
- `src/font/index.ts` shells out to `ghostty +list-fonts`; there is no font cache in use even though `GTC_FONT_CACHE_PATH` exists.
- `src/config/constants.ts` is the static allowlist of valid Ghostty config keys; new keys must be added there manually.
- `scripts/build.ts` is the Bun compile pipeline.
- `bin/gtc` is an intentional CJS shim.

## High-signal gotchas

- Config path is hardcoded to `~/.config/ghostty/config`.
- Theme directory is hardcoded to `~/.config/ghostty/themes`.
- Runtime env vars used by the app are `GTC_THEME_BASE_URL` and `GTC_THEME_API_URL`; `GTC_BIN_PATH` is used by `bin/gtc`.
- `config remove` also deletes consecutive comment lines immediately above the removed key.
- Theme and font commands depend on the local `ghostty` binary for `ghostty +validate-config`, `ghostty +show-config`, and `ghostty +list-fonts`.
- `scripts/build.ts` always wipes `dist/` first.
- `--single` skips musl and baseline variants by default.
- Release builds target Linux and macOS only.
