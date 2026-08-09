---
downstream_modified: true
title: Use the Oink theme
weight: 1
date: 2021-12-08T10:33:16+01:00
description:
  Import the Oink Hugo Module or inspect the independent project site.
---

Oink separates the consuming site from the maintained theme. A site owns its
content, brand assets, configuration, and business components; the theme owns
the common shell, styles, browser runtimes, and reusable shortcodes.

## Recommended setup

Import `github.com/pgsty/oink` as a pinned Hugo Module. The independent
[`pgsty/oink.pgsty.com`](https://github.com/pgsty/oink.pgsty.com) repository
demonstrates the full production contract with English and Chinese content,
local search, dark mode, diagrams, API documentation, and component examples.

Experienced Hugo users can [start from scratch](start-from-scratch/). Existing
Docsy sites should use the [migration guide](/docs/oink/migration/) instead of
recreating the shell by hand.

## Theme source options

The preferred source is a released `github.com/pgsty/oink` module tag. A
complete release archive, pinned Git submodule, or pinned clone also works. Read
[Other setup options](/docs/get-started/other-options/) for the trade-offs;
production must never follow an unversioned branch.

## Build contract

Whichever source option is selected, this command must build the site:

```sh
hugo --gc --minify
```

Node-based commands in the project-site repository are maintainers' regression
tooling, not prerequisites for a consuming site.
