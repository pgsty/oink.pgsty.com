---
title: OINK CLI
linkTitle: CLI
description: A draft introduction to the optional OINK command-line companion for Hugo sites.
weight: 80
type: docs
icon: fa-solid fa-terminal
comments: false
---

`oink` is an optional command-line companion for OINK sites. It helps create
sites, check Hugo output, and review content or theme changes. Hugo still
renders the site, and the project remains an ordinary Hugo project.

> [!NOTE] Draft · not yet released
> OINK CLI is under development in the independent `oink-cli` repository.
> This page introduces the local `0.1.0-dev` candidate. There is no formal
> release or public installation entry point yet; commands may change.

## What it does {#capabilities}

| Command | Purpose |
| --- | --- |
| `oink init` | Create a site from a fixed Starter, with a selected profile and languages. |
| `oink doctor` | Inspect tools, configuration, and the resolved theme source. |
| `oink check` | Check rendered links, translation relationships, and source/style policy. |
| `oink dev` / `oink build` | Run Hugo's preview server or production build. |
| `oink new` / `oink move` | Preview page creation or moves before applying a saved plan. |
| `oink translations` | Inspect translation status and differences, and record a human review. |
| `oink upgrade` | Compare a theme upgrade before explicitly writing module changes. |

JSON/YAML results, explicit multi-site workspaces, and checked build artifacts are
also available in the local candidate.

Studio and general source editing are retired from the current CLI. Use
`oink dev` for preview, an ordinary editor for changes, and `inspect`/`check`
for structured reports.

## Try the local candidate {#try-locally}

From an available `oink-cli` source checkout, build the executable with Go
1.26 or later and Make:

```sh
cd oink-cli
make deps
make build
./bin/oink --help
./bin/oink doctor --site ../my-docs
./bin/oink check --site ../my-docs
```

Replace `../my-docs` with an existing site. Site operations require Hugo
Extended; OINK's compatibility floor is 0.160.1, while the CLI's fixed Starter
requires 0.165.0 or later and Go 1.27 or later.

`make deps` downloads build dependencies. CLI commands are offline by default;
add `--network` when that invocation needs uncached inputs. Checks and change
previews preserve site sources; writing a reviewed change requires an explicit
apply step. Ordinary `dev` and `build` can write Hugo output and caches.

## Further reading {#further-reading}

- [Detailed usage guide](/docs/start/cli/): current commands, examples, and limitations.
- [CLI contract](/docs/design/decisions/cli/): supported behavior and maintainer rules.
- [Maintenance roadmap](/docs/design/proposals/oink-cli-maintenance-roadmap/): historical development stages and their retirement status.
