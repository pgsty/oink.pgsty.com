---
title: OINK CLI
linkTitle: CLI
description: An introduction to the optional OINK command-line companion for Hugo sites. The CLI is still a draft.
weight: 80
type: docs
icon: fa-solid fa-terminal
comments: false
aliases:
  - /docs/start/cli/
  - /docs/start/cli-overview/
---

`oink` is an optional command-line companion for OINK sites. It helps create
sites, check Hugo output, and review content or theme changes. Hugo
renders the site. The project remains an ordinary Hugo project.

> [!NOTE] Draft · not yet released
> OINK CLI is under development in the independent `oink-cli` repository.
> This page introduces the local `0.1.0-dev` candidate. There is no formal
> release or public installation entry point yet. Commands may change.

## What it does {#capabilities}

| Command | Purpose |
| --- | --- |
| `oink init` | Create a site from a fixed Starter. Select its profile and languages. |
| `oink doctor` | Inspect tools, configuration, and the resolved theme source. |
| `oink check` | Check rendered links, translation relationships, and source and style policy. |
| `oink dev` / `oink build` | Run Hugo's preview server or production build. |
| `oink new` / `oink move` | Preview page creation or moves before applying a saved plan. |
| `oink translations` | Inspect translation status and differences, and record a human review. |
| `oink upgrade` | Compare a theme upgrade before explicitly writing module changes. |

The local candidate also provides JSON/YAML results, explicit multi-site
workspaces, and checked build artifacts.

Studio and general source editing are retired from the current CLI. Use
`oink dev` for preview, an ordinary editor for changes, and `inspect`/`check`
for structured reports.

## Try the local candidate {#try-locally}

From an available `oink-cli` source checkout, build the executable with Go
1.27.3 or later and Make:

```sh
cd oink-cli
make deps
make build
./bin/oink --help
./bin/oink doctor --site ../my-docs
./bin/oink check --site ../my-docs
```

Replace `../my-docs` with an existing site. Site operations require Hugo
Extended 0.168.0 or later; the fixed Starter's module workflow needs Go 1.27
or later. Development and validation use Hugo Extended 0.168.0, with the
default baseline kept pinned. Generated sites use the CLI's separately maintained
Starter snapshot; follow the [upgrade guide](/docs/admin/upgrade/) to adopt
OINK v1.4.0. Do not enable
`--panicOnWarning` or `HUGO_PANICONWARNING`. Warnings remain visible; the upstream
LibSass deprecation warning is accepted. No external Sass tool is required.

`make deps` downloads build dependencies. CLI commands are offline by default.
If an invocation needs uncached inputs, add `--network`. Checks and change
previews preserve site sources. To write a reviewed change, use an explicit
apply step. Ordinary `dev` and `build` can write Hugo output and caches.

## Further reading {#further-reading}

- [CLI contract](/docs/design/decisions/cli/): supported behavior and maintainer rules.
- [Maintenance roadmap](/docs/design/proposals/oink-cli-maintenance-roadmap/): historical development stages and their retirement status.
