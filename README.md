# GTC

`gtc` is a Bun-powered CLI for managing [Ghostty](https://ghostty.org) config, themes, and fonts.

- Inspect Ghostty config entries
- Validate the current config with the local `ghostty` binary
- Install, remove, and apply themes
- Browse fonts reported by Ghostty and set `font-family`
- Build native binaries for macOS and Linux

## Install

```sh
curl -fsSL https://raw.githubusercontent.com/xingxingmofashu/gtc/main/install | bash
```

## Supported platforms

| Platform      | Architectures                  |
| ------------- | ------------------------------ |
| macOS         | `arm64`, `x64`                 |
| Linux (glibc) | `arm64`, `x64`, `x64-baseline` |
| Linux (musl)  | `arm64`, `x64`, `x64-baseline` |

Windows is not supported.

## Command overview

The CLI has three top-level command groups:

```sh
gtc config
gtc theme
gtc font
```

## Config commands

Work with `~/.config/ghostty/config`.

### List config

```sh
gtc config list
gtc config show
gtc config ls
```

Options:

- `--query <text>`, `-q <text>`: filter by key substring
- `--global`, `-g`: read the local config file instead of `ghostty +show-config`

Examples:

```sh
gtc config list
gtc config list --query font
gtc config list -q background
```

### Remove a config key

```sh
gtc config remove <name>
gtc config rm <name>
```

Example:

```sh
gtc config remove font-size
```

`gtc` also removes consecutive comment lines immediately above the deleted key.

### Validate config

```sh
gtc config validate
gtc config check
```

This runs `ghostty +validate-config`.

## Theme commands

Work with themes under `~/.config/ghostty/themes`.

### List installed themes

```sh
gtc theme list
gtc theme ls
```

This lists local theme files that also exist in the remote theme index.

### Install a theme

```sh
gtc theme install
```

This opens an interactive picker backed by the remote theme API, then writes the selected theme to `~/.config/ghostty/themes/<slug>`.

### Remove a theme

```sh
gtc theme remove
gtc theme rm
```

This opens an interactive picker for locally installed themes.

### Apply a theme

```sh
gtc theme set
```

This opens an interactive picker for local themes and writes:

```ini
theme = <slug>
```

to the Ghostty config.

## Font commands

Font commands use the local `ghostty` binary via `ghostty +list-fonts`.

### List fonts

```sh
gtc font list
gtc font ls
```

### Set font-family

```sh
gtc font set
```

This opens an interactive picker and writes the selected font variant to:

```ini
font-family = <variant>
```

## Paths

- Config file: `~/.config/ghostty/config`
- Theme directory: `~/.config/ghostty/themes`
- Theme cache: `~/.config/gtc/cache/themes.json`

There is also a font cache path constant at `~/.config/gtc/cache/fonts.json`, but the current font implementation does not use it.

## Environment variables

| Variable             | Description                                    |
| -------------------- | ---------------------------------------------- |
| `GTC_BIN_PATH`       | Override the executable path used by `bin/gtc` |
| `GTC_THEME_BASE_URL` | Override the theme site base URL               |
| `GTC_THEME_API_URL`  | Override the theme API endpoint                |

## Development

Prerequisite: [Bun](https://bun.sh) 1.x

```sh
bun install
bun run dev
bun run lint
bun run lint:fix
bun run typecheck
bun run fmt
bun run fmt:fix
bun run build
bun run build -- --single
bun run build -- --single --baseline
```

Notes:

- `bun run dev` runs the CLI directly from `src/index.ts`
- `bun run typecheck` is `oxlint --type-aware`
- `bun run fmt` is check-only; `bun run fmt:fix` writes changes
- Pre-commit runs `bun run lint && bun run typecheck && bun run fmt`
- There is no test suite

### Manual verification

```sh
bun run src/index.ts config list
bun run src/index.ts config list --query font
bun run src/index.ts config validate
bun run src/index.ts theme list
bun run src/index.ts font list
```

## Build

`bun run build` cross-compiles these targets:

- `gtc-linux-arm64`
- `gtc-linux-x64`
- `gtc-linux-x64-baseline`
- `gtc-linux-arm64-musl`
- `gtc-linux-x64-musl`
- `gtc-linux-x64-baseline-musl`
- `gtc-darwin-arm64`
- `gtc-darwin-x64`

`bun run build -- --single` builds only the current host target.

`bun run build -- --single --baseline` includes the host baseline build when available.

The build script wipes `dist/` before compiling.

Each output directory contains:

- `bin/gtc`
- a target-specific `package.json`

## Implementation notes

- Valid Ghostty config keys come from the static allowlist in `src/config/constants.ts`
- New Ghostty keys must be added there manually
- `bin/gtc` is a CommonJS shim that resolves the correct platform binary at runtime
- Theme features use a cached remote index; the cache lifetime is one hour
