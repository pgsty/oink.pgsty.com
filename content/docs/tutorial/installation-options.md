---
downstream_modified: true
title: Other setup options
description: Use an OINK archive, Git checkout, or Hugo Module.
date: 2021-12-08
weight: 70
icon: fa-solid fa-code-branch
aliases: [/docs/get-started/other-options/]
---

The recommended installation uses the `github.com/pgsty/oink` Hugo Module. The
following options change how Hugo obtains the same theme source; they do not
change content or the Hugo-only build command.

## Prerequisites

Every option requires Hugo Extended `{{% param hugoMinVersion %}}` or newer. Git
options require Git, and Hugo Modules require Go. None of the options requires
Node.js, npm, PostCSS, or Autoprefixer for the consuming site.

## Option 1: complete release archive

The complete offline archive contains the theme, local browser runtimes, fonts,
licenses, notices, vendor manifest, and checksums. It is the preferred input for
air-gapped builds and the simplest way to preserve an exact distribution.

Extract the theme under the site's `themes/` directory:

```text {title="Theme directory layout" copy=false}
site/
├── hugo.yaml
└── themes/
    └── oink/
```

Configure:

```yaml {filename="hugo.yaml"}
theme: oink
```

Verify the archive checksum before extracting it. Use only an archive attached
to an explicit release, not a locally assembled file presented as a published
distribution.

<a id="option-2-clone-the-docsy-theme"></a>

## Option 2: Git submodule

A submodule records the exact OINK repository commit in the site repository:

```sh
git submodule add https://github.com/pgsty/oink.git themes/oink
git -C themes/oink fetch --tags
git -C themes/oink checkout THEME_REF
git add .gitmodules themes/oink
git commit -m "Add OINK theme at THEME_REF"
```

Configure the nested theme path:

```yaml {filename="hugo.yaml"}
theme: oink
```

CI must initialize submodules before running Hugo. Pin `THEME_REF` to a release
tag or immutable commit; do not leave production on `main`.

## Option 3: pinned Git clone

A clone works when the hosting platform requires the complete theme tree in the
build input or when the site vendors a reviewed copy:

```sh
git clone https://github.com/pgsty/oink.git themes/oink
git -C themes/oink checkout THEME_REF
```

Use the same `theme: oink` setting. Record the resolved commit and the process
that restores the clone. If the files are committed into the site repository,
preserve OINK's `LICENSE`, `NOTICE`, and `VENDOR.json`.

<a id="option-3-docsy-as-an-npm-package"></a>

> OINK is not distributed as an npm package. Existing Docsy npm consumers should
> follow the [npm migration guide](/docs/upgrade/npm-package/).

## Option 4: Hugo Module

Pin the public module to a release tag or immutable commit:

```sh
hugo mod get github.com/pgsty/oink@THEME_REF
hugo mod tidy
```

Import it in `hugo.yaml`:

```yaml {filename="hugo.yaml"}
module:
  imports:
    - path: github.com/pgsty/oink
```

For local theme development, use an ignored Go workspace that includes the site
module and a sibling OINK checkout.

## Preview and verify

All source options use the same commands:

```sh
hugo server --disableFastRender
hugo --gc --minify
```

Verify that a clean production build succeeds with no `node_modules` directory,
that local assets resolve under the configured `baseURL`, and that both English
and Chinese pages and search indexes are present.

See [Upgrade Oink](/docs/upgrade/) for version changes and override review.
