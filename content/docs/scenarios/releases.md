---
title: Releases and downloads
linkTitle: Releases
weight: 20
description: >-
  Keep release facts, archive links, checksums, and rolling or pinned download
  channels consistent without remote API calls.
search_keywords:
  [release card, release assets, checksum, download, rolling, pinned]
---

Oink separates immutable release facts from their presentation. A release page
owns the version and repository identity; local download data owns distribution
channels. Cards, lists, checksum tables, documentation pages, and Landing pages
derive from those records instead of copying URLs and commands into several
templates.

## Define release facts {#release-facts}

Add a strict `release` map to the page front matter:

```yaml
release:
  product: Pig
  version: 1.7.0
  repo: pgsty/pig
  tag: v1.7.0
  date: 2026-08-14
  prev: v1.6.0
  checksums: SHA256SUMS
```

`version` and `repo` are required. Omit `tag` to derive `v{version}` and omit
`date` to use the page date. Optional `product`, `prev`, and `checksums` fields
complete the record. Unknown keys, wrong types, or a repository outside the
`owner/name` form fail the build.

For a simple GitHub release, the exact tag URL is also accepted as shorthand:

```yaml
release: https://github.com/pgsty/pig/releases/tag/v1.7.0
```

Oink derives repository, release, archive, compare, checksum, and asset links
locally. It does not call GitHub during a build and does not claim that a tag or
asset exists remotely.

## Render the release card {#release-card}

Place the parameter-free shortcode where the fact summary should appear:

```go-html-template
{{</* release-card */>}}
```

The invocation accepts no facts and no parameters; the page front matter is the
only authority. HTML receives a semantic link card with no runtime. Print and
RSS receive a static link list, and Markdown receives ordinary Markdown links.

## Build a release index {#release-index}

A release section can opt into deterministic ordering:

```yaml
---
title: Releases
layout: releases
release_group_by_product: true
release_products: [OINK, Pig]
---
```

Pages sort by normalized release date descending, then valid SemVer precedence,
then a deterministic lexical fallback. The default is one global sequence.
`release_group_by_product: true` requires each selected page to define
`product`. `release_products` accepts one product or an array, matches the
product string exactly, and filters before sorting. Invalid filters fail instead
of rendering a plausible but empty page.

## Publish checksum assets {#release-assets}

Write exact `sha*sum` lines inside `release-assets`:

<!-- prettier-ignore-start -->
```go-html-template
{{</* release-assets group="auto" */>}}
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef  pig-1.7.0-linux-amd64.tar.gz
fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210 *pig-1.7.0-darwin-arm64.tar.gz
{{</* /release-assets */>}}
```
<!-- prettier-ignore-end -->

Or commit a checksum file as a page or Hugo asset and reference exactly one
source:

```go-html-template
{{</* release-assets src="release/SHA256SUMS" group="auto" */>}}
```

The parser rejects malformed lines with their line number, mixed algorithms,
algorithm/hash-length disagreement, path-like filenames, and ambiguous input
sources. HTML links each asset and conditionally loads one local copy runtime;
print shows complete hashes without controls; Markdown and RSS emit full-hash
tables.

`group="auto"` groups common platform and architecture names. Use `algo` only
when declaring the expected checksum algorithm, and `base` only when the asset
base differs from the URL derived from `release` facts.

## Define download channels once {#download-data}

Create `data/download/pig.yaml`:

```yaml
version: 1.7.0
repo: pgsty/pig
published: true
channels:
  - id: script
    kind: rolling
    title: Install script
    title_zh: 安装脚本
    icon: fa-solid fa-bolt
    note: Tracks the rolling stable channel.
    note_zh: 跟随滚动稳定渠道。
    steps:
      - title: Install
        title_zh: 安装
        code: curl -fsSL https://repo.example.org/pig/install | bash
        lang: bash
  - id: source
    kind: pinned
    title: Source archive
    title_zh: 源码归档
    icon: fa-solid fa-code-branch
    url: https://github.com/pgsty/pig/archive/refs/tags/${tag}.tar.gz
    steps:
      - title: Clone the tag
        title_zh: 克隆标签
        code: git clone --branch ${tag} https://github.com/pgsty/pig.git
        lang: bash
  - id: assets
    kind: pinned
    title: Release assets
    title_zh: 发布资产
    icon: fa-solid fa-box-open
    checksums_src: release/pig-SHA256SUMS
```

A record needs a string `version` directly or through `params.version`, plus a
non-empty `channels` array. Every channel needs a unique anchor-safe `id`, one
kind (`rolling` or `pinned`), and a localized title.

Shared fields resolve from the exact language suffix, then the primary-language
suffix, then the unsuffixed field. For example, Chinese may resolve
`title_zh_cn`, then `title_zh`, then `title`. Only a pinned channel's `url` and
`steps[].code` may interpolate `${version}` or `${tag}`. Rolling channels reject
all interpolation so a stable command cannot accidentally pretend to be pinned.

## Render downloads {#download-shortcode}

Reference the data key with one positional parameter:

```go-html-template
{{</* download "pig" */>}}
```

HTML renders a channel index and static-first sections. Code steps reuse Oink's
enhanced code renderer; checksum channels reuse Release Assets. Print expands
the same safe content, Markdown emits headings, source fences, and full hashes,
and RSS omits the component.

Set `published: false` before the immutable release exists. Rolling channels
remain usable, while pinned channels show a non-linking pending state, omit
pinned commands, and disable asset links and copy controls. Flip the fact only
after the tag and assets resolve; never paste speculative links into prose.

A Landing page can consume the same record with a `download` section:

```yaml
sections:
  - type: download
    data:
      title: Download Pig
      keys: [pig]
```

## Release checklist {#validation}

1. Confirm the version, tag, previous tag, repository, and date from the source
   release process.
2. Validate every checksum against the published artifact before committing it.
3. Build HTML, print, and Markdown; inspect complete hashes outside HTML.
4. Test `published: false` before publication and `true` only after the remote
   tag and assets resolve.
5. Verify every language and a subpath deployment.
6. Treat source completion, theme tag publication, module resolution, consumer
   pinning, and hosted availability as separate gates.
