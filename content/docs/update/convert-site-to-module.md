---
downstream_modified: true
title: Migrate a Docsy site to OINK
aliases: [/docs/updating/convert-site-to-module/]
weight: 4
description: Replace a Docsy consumer toolchain with the Hugo-only OINK theme.
---

This migration removes copied common shell overrides and the consumer-side npm
asset pipeline. It does not require a bulk rewrite of Markdown content.

## Before you begin

Create a branch and make sure the existing site builds. Inventory custom files
under `layouts/`, `assets/`, `static/`, and `i18n/`, classifying each as:

- common Docsy shell code now supplied by OINK;
- a reusable component now supplied by OINK;
- a site-owned brand, product page, or business component that must remain.

Do not delete the third category.

## Select a theme distribution

Choose a pinned Git checkout, versioned archive, complete offline distribution,
or the public Oink Hugo Module. For a temporary local rehearsal, import Oink and
use a Go workspace to resolve a local checkout:

```sh
go work init .
go work edit -replace=github.com/pgsty/oink=/absolute/path/to/oink
export HUGO_MODULE_WORKSPACE=go.work
hugo --gc --minify
```

This tests OINK without publishing a developer-specific path in site config or
`go.mod`.

## Remove the consumer asset pipeline

Delete npm mounts and build steps used only to source Bootstrap, Font Awesome,
fonts, or theme browser runtimes. Remove `postCSS` calls and Autoprefixer steps
that exist only for Docsy. Keep `package.json` when site-owned software still
needs it, but the documentation build itself must succeed without installing
those packages.

## Remove common overrides

OINK directly provides the docs and blog shell, navbar, footer, sidebar, table
of contents, search, language selector, head assets, and core content
components. Remove matching site overrides one dependency group at a time.

Keep custom homepages, portals, download pages, product data, and business
shortcodes until they have an explicit replacement. See the [migration
guide](/docs/oink/migration/) for the detailed delete/keep matrix.

## Verify the result

From a clean checkout with Hugo Extended available, run:

```sh
hugo --gc --minify
```

Check the bilingual page set, local search, dark mode, mobile navigation, print
output, diagrams, API docs, content components, and site-specific pages. Inspect
the browser network log to confirm that default theme resources are same-origin.

Only after the migrated build and visual review pass should you remove obsolete
configuration, lockfiles, or workflow steps.
