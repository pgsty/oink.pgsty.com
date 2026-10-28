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

`oink` is an optional command-line companion for OINK sites that helps create
sites, inspect Hugo output, and review content or theme changes. Hugo still
renders the site, and the project remains a standard Hugo repository.

> [!NOTE] Optional draft · not needed for ordinary sites
> Everyday OINK sites build and preview with standard `hugo` and `hugo server`
> commands—you do not need to install or build `oink-cli`. OINK CLI is
> developed in the independent `oink-cli` repository as a local `0.1.0-dev`
> candidate with no public release or installer yet; commands may still change.

## What it does {#capabilities}

| Command | Purpose |
| --- | --- |
| `oink init` | Create a site from a fixed Starter and select its profile and languages. |
| `oink doctor` | Inspect tools, configuration, and the resolved theme source. |
| `oink check` | Check rendered links, translation relationships, and source/style rules. |
| `oink dev` / `oink build` | Run Hugo's preview server or production build. |
| `oink new` / `oink move` | Preview page creation or moves before applying a saved plan. |
| `oink translations` | Inspect translation status and diffs, and record human reviews. |
| `oink upgrade` | Compare a theme upgrade before writing module changes. |

The CLI also supports JSON/YAML output, explicit multi-site workspaces, and
checked build artifacts. Studio and general source-editing commands have been
retired: use `oink dev` for live preview, a regular editor for authoring, and
`inspect` or `check` for structured diagnostics.

## Try the local candidate {#try-locally}

From an `oink-cli` source checkout, build the binary with Go 1.27.3+ and Make:

```sh
cd oink-cli
make deps
make build
./bin/oink --help
./bin/oink doctor --site ../my-docs
./bin/oink check --site ../my-docs
```

Replace `../my-docs` with your site path. Site commands require Hugo Extended
0.168.0+ and Go 1.27+ for module operations. `oink init` uses the CLI's
bundled Starter snapshot; follow the [upgrade guide](/docs/admin/upgrade/) to
update a generated site to OINK v1.4.0.

`make deps` downloads Go build dependencies. CLI commands run offline by
default; pass `--network` when a command needs uncached remote inputs.
Inspection and plan previews (`new`, `move`, `upgrade`) leave site sources
untouched until you run their explicit apply step, whereas `dev` and `build`
write normal Hugo output and caches.

## Further reading {#further-reading}

- [CLI contract](/docs/design/decisions/cli/): supported behavior and maintainer rules.
- [Maintenance roadmap](/docs/design/proposals/oink-cli-maintenance-roadmap/): historical development stages and their retirement status.
