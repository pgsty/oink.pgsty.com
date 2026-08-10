---
downstream_modified: true
title: Get Started
description: Build a bilingual Oink documentation site with Hugo Extended.
date: 2018-07-30
aliases: [/tutorial/, /docs/get-started/, /docs/getting-started/]
weight: 2
icon: fa-solid fa-rocket
---

Oink is a Hugo theme whose complete browser runtime ships with the theme. A
consumer site builds with Hugo Extended alone: no Node.js package installation,
PostCSS step, CDN, or build-time remote asset download is part of the default
path.

## Choose a starting point

- **Hugo Module — recommended:** import `github.com/pgsty/oink` in an existing
  or new Hugo site. See the [Oink quick start](/docs/tutorial/install/).
- **Project site:** use the independent
  [`pgsty/oink.pgsty.com`](https://github.com/pgsty/oink.pgsty.com) repository
  as a complete bilingual configuration and regression reference.
- **Existing Docsy site:** follow the
  [migration guide](/docs/upgrade/migrate-from-docsy/) to remove common
  overrides and the consumer npm asset pipeline without rewriting content.

## Install the prerequisites

Install Git, Go, and Hugo Extended `{{% param hugoMinVersion %}}` or newer. See
[Before you begin](prerequisites/) for platform notes and verification commands.

## Add Oink

From the site root:

```sh
hugo mod init github.com/example/product-docs
hugo mod get github.com/pgsty/oink@THEME_REF
```

Then import the theme in `hugo.yaml`:

```yaml
module:
  imports:
    - path: github.com/pgsty/oink
```

Pin `THEME_REF` to a released tag or immutable commit and commit `go.mod` and
`go.sum`.

## Build contract

The same commands preview and build every supported module consumer:

```sh
hugo server --disableFastRender
hugo --gc --minify
```

## Next steps

1. Set the [basic configuration](basic-configuration/).
2. Add repository, copyright, logo, and menu values.
3. Put translations side by side as `page.md` and `page.zh.md`.
4. Add and customize [content](/docs/content/).
5. Choose a [deployment target](/docs/deploy/).
