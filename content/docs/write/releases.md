---
title: Releases and downloads
linkTitle: Releases and downloads
description: Publish a release page with a GitHub release card, a checksummed asset table and install instructions, all built from facts kept in your repository.
weight: 60
search_keywords: [release, download, checksums, sha256, release card, asset table, rolling channel, pinned version]
release_url: https://github.com/pgsty/oink/releases/tag/v0.4.0
aliases:
  - /docs/scenarios/releases/
---

A release page tells readers what shipped and lets them download it safely: a
card linking the GitHub release and its source archives, a table of files with
their checksums, and install instructions for each way of getting the
software. OINK builds all of it from facts kept in your repository (one
`release_url` in the page's front matter, the `sha256sum` output you paste
into the body, and a `data/download/<key>.yaml` record), so the build never
contacts GitHub.

> [!NOTE] The examples on this page are rendered for real
> This page's own front matter sets `release_url` to OINK v0.4.0, so the card,
> asset tables and download block below are live output. The checksums and
> asset filenames are made up, and the download links they produce point at
> files that do not exist. Do not verify anything against these hashes.

## What a release page is made of {#overview}

| What you want | What renders it | Where the facts come from |
| --- | --- | --- |
| A summary card with tag, date, source archives and repository | `release-card` | The page's `release_url` |
| A table of assets with checksums | The `checksums` fence, or `release-assets` | `sha*sum` lines in the page body |
| Install instructions for several channels | `download` | `data/download/<key>.yaml` |
| A chronological index of releases | `layout: releases` | Each page's `release_url`, or its title |

## Link the release {#release-facts}

A release page names its GitHub release with one front matter key, the release
URL for an exact tag:

```yaml {title="content/blog/release/0.4.0.md"}
release_url: https://github.com/pgsty/oink/releases/tag/v0.4.0
```

The owner, project and tag come from the URL, and the date from the page's own
`date`. A value that is not an exact-tag GitHub release URL warns and the
release block is skipped. Pages written for OINK 0.5 (the `release` map,
`release_products`, `release_group_by_product`) get a warning naming the
replacement; see the [0.6.0 release notes](/release/0.6.0/#migration).

Put the card where you want the summary. The shortcode takes no parameters,
because every fact comes from the front matter:

```markdown {title="Source"}
{{</* release-card */>}}
```

{{< release-card >}}

The card carries four links derived from the URL: the release itself, the
`.tar.gz` and `.zip` source archives, and the repository. It does not list
checksum files, which belong in the asset table below, or compare the release
with the previous one, which GitHub already does on the release page.

## Checksums and assets {#assets}

Paste the output of `sha256sum` (or any `sha*sum` command) into a `checksums`
fence, and the page gets a download table with each file linked and its hash
ready to copy:

````markdown {title="Source"}
```checksums
1e2f4c8a9d05b7361f8ac25d0e7b4913a6c8df215047eb9c3a1d6b8250f9e7c4  oink-0.4.0-linux-amd64.tar.gz
7b3d9e0c145a8f26d0b7e93c48156aa2f0d9c7b31e846a5029df1b6c7a3e8250 *oink-0.4.0-darwin-arm64.tar.gz
```
````

```checksums
1e2f4c8a9d05b7361f8ac25d0e7b4913a6c8df215047eb9c3a1d6b8250f9e7c4  oink-0.4.0-linux-amd64.tar.gz
7b3d9e0c145a8f26d0b7e93c48156aa2f0d9c7b31e846a5029df1b6c7a3e8250 *oink-0.4.0-darwin-arm64.tar.gz
```

Each line must be either `<hex><two spaces><filename>` or
`<hex><space>*<filename>`, exactly as the tools print it; blank lines and lines
starting with `#` are ignored. The hash length identifies the algorithm (MD5,
SHA-1, SHA-256 or SHA-512), and one block holds one algorithm. A filename must
be a single path segment, and package type, operating system and architecture
badges are added when the filename makes them recognizable. A malformed line, or
one whose algorithm differs from the rest of the block, warns with its line
number and is skipped, so a single typo costs one row rather than the table.

On a page with `release_url`, asset links point at
`https://github.com/<owner>/<repo>/releases/download/<tag>/`. On a page without
one, set `base=` to wherever the files are hosted. Setting both, or neither,
warns and skips the block, because a guessed base would publish links to the
wrong files:

````markdown {title="a page with no release_url"}
```checksums {base="https://repo.pigsty.io/oink/v0.4.0/" algo="sha256"}
1e2f4c8a9d05b7361f8ac25d0e7b4913a6c8df215047eb9c3a1d6b8250f9e7c4  oink-0.4.0-linux-amd64.tar.gz
```
````

`algo=` pins the algorithm instead of inferring it, and `group="auto"` groups
rows by platform and architecture.

`release-assets` is the shortcode form of the same table. It adds one
parameter the fence lacks, `src=`, which reads the checksum file itself from a
page resource or global asset instead of inline lines; use either `src` or
inline lines, not both.

```markdown {title="Source"}
{{</* release-assets group="auto" */>}}
5a0c7d1e93b4826f0ad35c9e17b6402d8f1c95ae63d70b28c4e19a5f38207db6  oink-0.4.0-1.el9.x86_64.rpm
c93f16a8d052b7e41ac68d3907b25fe0a41d8c7362b95e0187ac4d63f9520ea8  oink-0.4.0-1.el9.aarch64.rpm
{{</* /release-assets */>}}
```

{{< release-assets group="auto" >}}
5a0c7d1e93b4826f0ad35c9e17b6402d8f1c95ae63d70b28c4e19a5f38207db6  oink-0.4.0-1.el9.x86_64.rpm
c93f16a8d052b7e41ac68d3907b25fe0a41d8c7362b95e0187ac4d63f9520ea8  oink-0.4.0-1.el9.aarch64.rpm
{{< /release-assets >}}

The HTML table shortens each hash for display, while screen readers and the
copy button get the full value; the copy button's script loads only on pages
that have a table. Without JavaScript the table is still complete and linked.
Print and RSS show the full hashes without controls, and the page's Markdown
output is a pipe table of full hashes.

## Download block {#download-shortcode}

Install instructions belong to the product rather than to one release: the
install script, the source archive and the package repository stay the same
from version to version. Keep them in one data record and render it with
`download`, whose only parameter is the record's key, the file name under
`data/download/` without `.yaml`:

```markdown {title="Source"}
{{</* download "prd5" */>}}
```

{{< download "prd5" >}}

The block opens with a row of links to each channel, followed by one section
per channel. Code steps use the enhanced code block and its copy button, and a
channel with checksums renders the same asset table as above. Print shows the
same content expanded, the Markdown output keeps the titles, code fences and
full hashes, and RSS leaves the block out. A landing page's `download` section
reads the same record, so the home page and the docs never disagree about the
current version; see [Home and landing pages](/docs/customize/home/).

## Release workflow {#release-notes}

A release note and the download data do different jobs. The release note,
written as a [blog post](/docs/write/blog/#release-notes), tells readers what
changed, how to upgrade and what breaks; it carries `release_url` and can open
with a `release-card`. The download data tells them which channel to use,
which command to run and which hash to check, and it changes in one place when
the version does.

Publish a new version in this order, so that no page ever links to a file that
is not there yet:

1. In `data/download/<key>.yaml`, set `version` to the new version and
   `published: false`. Rolling channels keep working, while pinned channels
   show a "pending release" state with their commands omitted and their asset
   links and copy buttons disabled.
2. Write the release note, for example `content/blog/release/0.4.0.md`, with
   its `release_url`.
3. Create the tag and upload the assets, then set `published: true`. Do not
   write a guessed download link into the prose in the meantime.

## The release index page {#release-index}

A section of release notes can list them as a strict chronology instead of a
blog index:

```yaml {title="content/blog/release/_index.md"}
---
title: Releases
layout: releases
---
```

Every regular page in the section is listed newest first by `date`; when two
pages share a date, the version in their tags breaks the tie, by SemVer
precedence with a deterministic fallback for tags that are not SemVer. An entry
whose `release_url` parses reads `project tag`, such as `oink v0.4.0`, above
the page description. A page without one keeps its own title, so an ordinary
note between releases is a normal entry rather than an error.

When you would rather keep the blog shell, `blog_index: table` gives a compact
date-ordered archive instead; this site's [release notes](/release/) use it.

## Download data format {#download-data}

This site's real record is `data/download/prd5.yaml`, the one rendered above:

```yaml {title="data/download/prd5.yaml"}
version: 0.4.0
repo: pgsty/oink
published: true
channels:
  - id: script
    kind: rolling
    title: Install script
    title_zh: 安装脚本
    icon: fa-solid fa-bolt
    note: The rolling channel deliberately contains no version interpolation.
    note_zh: 滚动渠道刻意不插入版本号。
    steps:
      - title: Install
        title_zh: 安装
        code: curl -fsSL https://repo.example.org/oink/install | bash
        lang: bash
  - id: source
    kind: pinned
    title: Source archive
    title_zh: 源码归档
    icon: fa-solid fa-code-branch
    url: https://github.com/pgsty/oink/archive/refs/tags/${tag}.tar.gz
    steps:
      - title: Clone the tag
        title_zh: 克隆标签
        code: git clone --branch ${tag} https://github.com/pgsty/oink.git
        lang: bash
  - id: assets
    kind: pinned
    title: Release assets
    title_zh: 发布资产
    icon: fa-solid fa-box-open
    checksums: |
      aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa  oink-0.4.0.tar.gz
```

A record takes the five top-level fields below; any other key warns and the
whole block is skipped.

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `version` | string | site `params.version` | The current version. Missing from both the record and the site, it warns and the block is skipped |
| `repo` | `owner/name` | — | GitHub repository; required once a pinned channel has a link or assets |
| `tag` | string | `v{version}` | Release tag. URL-safe characters only |
| `published` | boolean | `true` | `false` while the tagged release and its assets do not exist yet |
| `channels` | array | — | The channels, in display order. Must not be empty |
{.fields meta="type default"}

Each channel:

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `^[a-z][a-z0-9-]*$` | — | Unique within the record; also the channel's anchor |
| `kind` | `rolling` \| `pinned` | — | Whether the channel follows the latest release or one exact version, which decides whether version facts may be interpolated |
| `title` | localized string | — | Channel name. Must resolve to a non-empty value |
| `note` | localized string | — | One line of explanation under the channel name |
| `icon` | Font Awesome class pair | — | For example `fa-solid fa-bolt` |
| `url` | http(s) URL or site path | — | Download link. Interpolated on `pinned` channels only |
| `steps[]` | `title` / `code` / `lang` | `lang: text` | Code steps, rendered by OINK's enhanced code block |
| `checksums` | `sha*sum` text | — | Assets for this channel. `pinned` only; use this or `checksums_src`, not both |
| `checksums_src` | asset path | — | Reads the checksum file as a Hugo asset |
{.fields meta="type default"}

Two rules govern the text fields:

- Localized fields resolve by suffix, from `<field>_<exact language>` to
  `<field>_<base language>` to `<field>`. A `zh-cn` page tries `title_zh_cn`,
  then `title_zh`, then `title`. camelCase variants are not accepted.
- Only a pinned channel's `url` and `steps[].code` interpolate `${version}` and
  `${tag}`. A rolling channel refuses interpolation, so a command meant to
  install the latest release is never silently tied to one version. Titles and
  notes never interpolate.

## Verify {#verify}

1. Build with diagnostics visible: `hugo --printPathWarnings`. A malformed hash
   line, mixed algorithms, a missing `base` and a misspelled channel field each
   produce a warning; read them, because each one means a row, a table or a
   channel is missing from the page.
2. On the page, check that the card's tag and date match the repository and
   that every asset row opens a real download.
3. Check each hash against the real artifact yourself. The table only displays
   the hashes you paste; it verifies nothing.
4. Confirm the Markdown output carries the full hashes:

   ```bash
   curl -s http://localhost:1313/docs/write/releases/index.md | grep -c '^| '
   ```

5. Try the page with `published: false` first, and switch to `true` only once
   the tag and assets exist. Check every language, and a subpath deployment if
   you use one.

## Related {#related}

- [Blog posts](/docs/write/blog/) — where release notes live and how they are ordered
- [Code Blocks](/docs/components/code/) — code rendering and copying inside download steps
- [Home and landing pages](/docs/customize/home/) — the landing `download` section
- [Configuration](/docs/customize/config/) — `params.version` and the related site parameters
- [Upgrade](/docs/admin/upgrade/) — how a site keeps up with new OINK versions
