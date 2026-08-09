---
downstream_modified: true
title: Before you begin
date: 2021-12-08
weight: 1
description: Prerequisites for building an OINK site.
---

The consumer prerequisite is Hugo Extended. Git and Go are conditional on how
the theme source is obtained.

<a id="install-hugo"></a>

## Install Hugo Extended

Install version `{{% param hugoMinVersion %}}` or newer. The current validation
baseline is `0.164.0`. A release's support matrix takes precedence when these
values change.

Verify the selected binary:

```sh
hugo version
```

The output must contain `extended`. Standard Hugo cannot compile the theme's
SCSS. Use Hugo's official [installation guides][] for the platform and pin the
same version in local development and CI.

## Install Git when needed

Git is required to clone the site, use submodules, preserve `.GitInfo`, or fetch
a theme checkout. Verify it with:

```sh
git --version
```

A site built from an already extracted offline archive can run Hugo without
network access, but keeping the source in version control remains recommended.

## Install Go only for Hugo Modules

Hugo's module commands use Go. Install Go when the site imports the theme as a
Hugo Module, then verify:

```sh
go version
hugo mod graph
```

A versioned archive, adjacent theme directory, or Git submodule does not require
Go at site build time.

<a id="install-postcss"></a>

## Do not install a frontend toolchain

OINK ships Bootstrap, Font Awesome, LTR and RTL CSS, fonts, search, and browser
runtimes as local versioned assets. Consumer sites do not install Node.js, npm,
PostCSS, Autoprefixer, or RTLCSS for the theme.

Node-based commands in the project-site repository are maintainer-only tools.
The production consumer command is:

```sh
hugo --gc --minify
```

## Check the complete distribution

For offline or air-gapped use, confirm that the theme archive contains `go.mod`,
`hugo.yaml`, `assets/`, `layouts/`, `static/`, `i18n/`, `LICENSE`, `NOTICE`, and
`VENDOR.json`. Install Hugo Extended before entering the isolated environment,
then run the same build command with network access disabled.

## What's next?

- [Inspect the bilingual project site](example-site-as-template/)
- [Start a site from scratch](start-from-scratch/)
- [Compare distribution options](/docs/get-started/other-options/)

[installation guides]: https://gohugo.io/installation/
