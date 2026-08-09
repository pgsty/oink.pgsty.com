---
downstream_modified: true
title: Update the OINK Hugo module
linkTitle: Hugo module
aliases: [/docs/updating/updating-hugo-module/]
weight: 1
description: Update a site that imports the theme as a pinned Hugo module.
---

## Pin a version

Production sites should import a release tag or immutable commit, never an
unversioned branch. From the site root, update Oink to a specific ref:

```sh
hugo mod get github.com/pgsty/oink@THEME_REF
hugo mod tidy
```

Replace `THEME_REF` with the published root tag or commit named by the release.

## Test a local checkout

To test the current OINK checkout without changing the committed module path,
use an ignored Go workspace with the local theme checkout:

```sh
go work init .
go work edit -replace=github.com/pgsty/oink=/absolute/path/to/oink
export HUGO_MODULE_WORKSPACE=go.work
hugo --gc --minify
```

Keep `go.work` out of version control rather than committing a
developer-specific absolute path.

## Verify the resolved module

Inspect Hugo's dependency graph:

```sh
hugo mod graph
```

Confirm that the theme resolves to the intended tag, commit, or local
replacement. No `hugo mod npm pack` or `npm install` step is required for OINK:
browser dependencies already ship with the theme.

Continue with [Review theme overrides](/docs/update/#update-overrides).
