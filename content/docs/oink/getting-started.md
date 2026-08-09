---
title: Getting started
weight: 10
description: Add Oink to a site as a Hugo Module
---

Oink is published as the Hugo Module `github.com/pgsty/oink`. A consuming site
builds with Hugo Extended alone; Node.js, npm, PostCSS, and CDN-hosted browser
packages are not part of the build contract.

## Prerequisites

Install Git, Go, and Hugo Extended `0.160.1` or newer. The project site
currently validates with `0.164.0`:

```sh
git --version
go version
hugo version
```

The Hugo version output must include `extended`.

## Add the module

From your Hugo site root, initialize a module if the site does not already have
one, then pin an Oink release:

```sh
hugo mod init github.com/example/product-docs
hugo mod get github.com/pgsty/oink@THEME_REF
```

Replace `THEME_REF` with a published tag such as `v0.16.0` or an immutable
commit. Add the import to `hugo.yaml`:

```yaml
module:
  imports:
    - path: github.com/pgsty/oink
```

Commit the resulting `go.mod` and `go.sum`. Do not run production builds against
an unpinned branch.

## Preview the site

Start an editing server:

```sh
hugo server --disableFastRender
```

Create a production artifact with:

```sh
hugo --gc --minify
```

Oink ships Bootstrap, Font Awesome, fonts, search, diagrams, API documentation
runtimes, and its content components. A consuming site does not need a
`node_modules` directory.

## Develop against a local checkout

Clone the theme and site as siblings, then use a local Go workspace:

```text
~/pgsty/
├── oink/
└── product-docs/
```

```sh
cd ~/pgsty/product-docs
go work init .
go work edit -replace=github.com/pgsty/oink=../oink
export HUGO_MODULE_WORKSPACE=go.work
hugo server
```

Keep `go.work` out of version control. The committed `go.mod` remains pinned to
the public module; the workspace substitutes the sibling checkout only on your
machine.

## Add bilingual content

Create the English page first:

```text
content/docs/operations.md
```

Then add its translation beside it:

```text
content/docs/operations.zh.md
```

Keep front matter identifiers, code, commands, parameter names, and link targets
semantically aligned. Translate reader-facing prose. For stable cross-language
deep links, preserve the English heading ID explicitly in the Chinese heading:

```markdown
## 故障恢复 {#failure-recovery}
```

## Configure the minimum site

The essential configuration is small:

```yaml
title: Product Docs
baseURL: https://docs.example.com/
defaultContentLanguage: en

languages:
  en:
    label: English
    locale: en-US
    weight: 1
  zh:
    label: 简体中文
    locale: zh-CN
    weight: 2

params:
  logo: icons/logo.svg
  offlineSearch: true

module:
  imports:
    - path: github.com/pgsty/oink
  hugoVersion:
    extended: true
    min: 0.160.1
```

Add menus, outputs, markup extensions, repository links, and optional features
as the site grows. See [Configuration](/docs/oink/configuration/) for the
supported model.

## Validate before publishing

At minimum:

1. build from a clean checkout with the committed module files;
2. run `hugo --gc --minify` with the pinned Hugo Extended version;
3. browse representative English and Chinese pages;
4. verify language switching, search, mobile navigation, dark mode, and print;
5. inspect browser network requests if the site promises offline operation.

These checks establish a build artifact. Publishing that artifact and verifying
the hosted URL are separate deployment steps.
