---
title: OINK CLI
linkTitle: CLI
description: Learn what the optional OINK command-line tool does and how to build its unreleased local candidate.
weight: 80
type: docs
icon: fa-solid fa-terminal
comments: false
aliases:
  - /docs/start/cli/
  - /docs/start/cli-overview/
---

`oink` is an optional command-line tool for OINK sites. It checks the links,
anchors and translations in Hugo's real output, creates a site from the
Starter, and previews a theme upgrade before writing it. Hugo still renders
the site, and a project you manage with `oink` remains an ordinary Hugo
repository.

> [!NOTE] Unreleased, and not required
> Every OINK site builds and previews with plain `hugo` and `hugo server`; you
> do not need the CLI. It is developed in its own repository,
> [pgsty/oink-cli](https://github.com/pgsty/oink-cli), with its own version and
> release cycle, and is currently a local `0.1.0-dev` candidate: there is no
> published binary or installer yet, and its commands may still change.

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

Every command can also report in JSON or YAML (`--json`, `--yaml`) for
scripts and CI, and the CLI can check several explicitly registered sites
together and produce checked build artifacts. It has no editor of its own:
write in your usual editor, preview with `oink dev`, and use `oink inspect` or
`oink check` for structured diagnostics.

## Try the local candidate {#try-locally}

Build the binary from a checkout of `oink-cli` with Go 1.27.4 or newer and
Make:

```sh
cd oink-cli
make deps
make build
./bin/oink --help
./bin/oink doctor --site ../my-docs
./bin/oink check --site ../my-docs
```

Replace `../my-docs` with the path to your site. `make deps` is the only step
that downloads anything (the Go build dependencies); the CLI itself runs
offline unless you pass `--network` to a command that needs remote inputs it
has not cached.

The candidate still expects Hugo Extended {{< param hugoMinVersion >}} or newer
for its site commands, even though OINK itself builds with any edition, and its
module operations need Go 1.27 or newer. `oink init` copies a Starter snapshot
pinned to OINK v1.3.2, so follow the [upgrade guide](/docs/admin/upgrade/) to
bring a generated site to the current release.

Previews change nothing: `new`, `move` and `upgrade` leave site sources
untouched until you run the explicit apply step (`oink plans apply` for a
saved plan, `oink upgrade --write --expect-plan ID` for an upgrade). `dev` and `build` write
Hugo's normal output and caches.

## Further reading {#further-reading}

- [CLI contract](/docs/design/decisions/cli/): every supported command, what it may change, and the maintainer rules.
- [Maintenance roadmap](/docs/design/proposals/oink-cli-maintenance-roadmap/): the historical development stages and which of them were retired.
