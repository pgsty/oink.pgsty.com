---
title: Releases and downloads
linkTitle: Releases and downloads
description: Record versions, tags, archive links, checksums, and install commands locally. Release cards, asset tables, download blocks, and index pages use these records.
weight: 60
search_keywords: [release, download, checksums, sha256, release card, asset table, rolling channel, pinned version]
release_url: https://github.com/pgsty/oink/releases/tag/v0.4.0
aliases:
  - /docs/scenarios/releases/
---

OINK stores release metadata in two local places: a page's front matter
`release_url` identifies its GitHub release, and `data/download/<key>.yaml`
records installation instructions. Release cards, asset tables, download blocks,
and index pages derive their links from those records without contacting GitHub
at build time.

> [!NOTE] This page carries demonstration release facts
> Its front matter holds a `release_url` (OINK v0.4.0), and the card, asset
> table and download block below are really rendered. The checksums and asset
> filenames are fabricated. The URLs are derived locally from the repository and
> tag. Their target files do not exist in any real release.
> Do not use these hashes to verify anything.

## Components and where the facts come from {#overview}

| What you want | What renders it | Facts come from |
| --- | --- | --- |
| A version summary card (tag, date, archives, repo) | `release-card` | The page's `release_url` |
| A checksum asset table | The `checksums` fence / `release-assets` | `sha*sum` lines in the body |
| A multi-channel download block | `download` | `data/download/<key>.yaml` |
| A chronological release index | `layout: releases` | Each page's `release_url`, or its title |

## The page owns the release facts {#release-facts}

One front matter key contains the release record. It is the GitHub release URL
for an exact tag:

```yaml {title="content/blog/release/0.4.0.md"}
release_url: https://github.com/pgsty/oink/releases/tag/v0.4.0
```

The URL supplies the owner, project, and tag. The page's `date` supplies the
date. An invalid exact-tag GitHub release URL warns and skips the release block.
The 0.5
`release` map (product / version / repo / tag / date / prev / checksums) and
its string shorthand are removed. A page that still uses either gets a warning
that names `release_url`.

Put a parameterless shortcode where you want the summary. The call accepts
no release facts:

```markdown {title="Source"}
{{</* release-card */>}}
```

{{< release-card >}}

The card shows four locally derived links: the release, both source archives,
and the repository. Checksum files
belong in the asset table below a note, and comparisons live on GitHub.

## The release index page {#release-index}

A section can switch to the release index layout. It lists every regular page
in the section, newest first by page date. Within one day, the tag's version
breaks ties. It uses SemVer precedence with a deterministic fallback for
non-SemVer tags:

```yaml {title="content/blog/release/_index.md"}
---
title: Releases
layout: releases
---
```

If `release_url` parses, the entry shows `project tag`, such as `oink v0.4.0`,
above the page description. A page without that URL keeps its own title. A
plain note between releases is therefore an ordinary entry and causes no warning. The 0.5
`release_products` filter and `release_group_by_product` grouping are gone;
Using either warns.

This site's [Releases](/blog/release/) currently uses the ordinary blog list.
Switch to `layout: releases` when a strict chronology is wanted.

## Checksum assets {#assets}

The `checksums` fence is the native form of a checksum table, holding the
verbatim output of a `sha*sum` command:

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

Only two line shapes are accepted: `<hex><two spaces><filename>` and
`<hex><space>*<filename>`. Blank lines and lines starting with `#` are ignored.
The hash length determines the algorithm (MD5 / SHA-1 / SHA-256 / SHA-512), and
each block holds a single algorithm. Malformed lines log a warning with the
line number and are skipped. Each filename must be a single path segment;
package type, OS, and architecture badges are inferred from the filename when
recognized.

If the page has `release_url` front matter, the base for asset links is derived
as `https://github.com/<repo>/releases/download/<tag>/`. A page without release
facts must set `base=` explicitly. Having both is an error.

````markdown {title="a page with no release front matter"}
```checksums {base="https://repo.pigsty.io/oink/v0.4.0/" algo="sha256"}
1e2f4c8a9d05b7361f8ac25d0e7b4913a6c8df215047eb9c3a1d6b8250f9e7c4  oink-0.4.0-linux-amd64.tar.gz
```
````

`release-assets` is the shortcode form of the same parser and renderer. It adds
one parameter that the fence lacks, `src=`. Use it for a checksum file stored
as a page resource or global asset. `src` and inner content are mutually
exclusive. `group="auto"` groups by platform and architecture:

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

HTML shows a truncated hash. The accessible name and copied text retain the
full value. The copy button uses a local runtime loaded on demand. With JavaScript disabled it is still a complete linked
table. Print expands the full hash without controls, and Markdown and RSS emit a
pipe table of full hashes.

## Download channel data {#download-data}

Installation instructions belong to the product rather than one release. Store
them in `data/download/<key>.yaml`. This site's real record is
`data/download/prd5.yaml`:

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

The record has five top-level fields: `version`, `repo`, `tag`, `published`,
and `channels` (any unknown top-level key logs a warning and skips the record).
`version` may be omitted here and supplied by the site's `params.version`
instead.

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `version` | string | site `params.version` | Missing in both places warns and skips the block |
| `repo` | `owner/name` | — | Required once a pinned channel has a link or assets |
| `tag` | string | `v{version}` | URL-safe characters only |
| `published` | boolean | `true` | `false` means the immutable release does not exist yet |
| `channels` | array | — | Must be non-empty |
{.fields meta="type default"}

Each channel:

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `^[a-z][a-z0-9-]*$` | — | Unique within the record. Used as the anchor |
| `kind` | `rolling` \| `pinned` | — | Decides whether release facts may be interpolated |
| `title` | localized string | — | Must resolve to a non-empty value |
| `note` | localized string | — | One line of explanation under the channel |
| `icon` | Font Awesome class pair | — | For example `fa-solid fa-bolt` |
| `url` | http(s) or a site path | — | Interpolatable on `pinned` only |
| `steps[]` | `title` / `code` / `lang` | `lang: text` | Code steps go through OINK's enhanced code renderer |
| `checksums` | `sha*sum` text | — | `pinned` only. Mutually exclusive with `checksums_src` |
| `checksums_src` | asset path | — | Reads the checksum file as a Hugo asset |
{.fields meta="type default"}

Two rules:

- Localization resolves by suffix: `<field>_<exact language>` → `<field>_<base language>` → `<field>`. A Chinese site resolves `title_zh_cn`, then `title_zh`, then `title`. camelCase aliases are not accepted.
- Only a pinned channel's `url` and `steps[].code` interpolate `${version}` and `${tag}`. A rolling channel refuses interpolation, so a stable install command is never bound to one version. Titles and notes never interpolate.

## Rendering the download block {#download-shortcode}

`download` takes exactly one positional parameter, the data key:

```markdown {title="Source"}
{{</* download "prd5" */>}}
```

{{< download "prd5" >}}

HTML renders a row of anchor chips and one section per channel. Code steps
reuse the enhanced code block and its on-demand copy runtime. A checksum
channel reuses the asset table above. Print statically expands the same
content, Markdown emits the titles, source fences and full hashes, and RSS omits
the component.

Before you create the tag and upload assets, mark the record unpublished:

```yaml {title="data/download/<key>.yaml"}
published: false
```

Rolling channels keep working. Pinned channels become an unclickable "pending
release" state, omit the pinned commands, and disable asset links and copy
controls. After the tag and assets resolve, change the publication state. Do not write
a guessed link in the prose.

The same record can supply a landing page's `download` section. No second version
model is required. See
[Home and landing pages](/docs/customize/home/).

## How this relates to blog release notes {#release-notes}

The two have different jobs:

- A release note in the blog (this site keeps them in `content/blog/release/`) explains what changed, how to upgrade, and what breaks. Its front matter carries `release_url`, and a `release-card` can sit at the top. For writing instructions, see [Blog posts](/docs/write/blog/).
- Download data identifies the channel, command, and hash. It is separate from the version number. An upgrade changes one place.

For a release, follow this order: update `version` in `data/download/<key>.yaml` → write a
new `content/blog/release/<version>.md` with its `release_url` → set
`published` to `true` after the tag and assets are in place.

## Verify {#verify}

1. Build with visible diagnostics: `hugo --printPathWarnings`. A malformed hash line, mixed algorithms, a missing `base` and a misspelled channel field all produce warnings that need review.
2. On the page: the card's tag and date match the repository, and every asset row opens a real download URL.
3. Check hashes against the actual artifacts manually. The component only displays them. It verifies nothing.
4. Confirm the hashes are complete in non-HTML output:

```bash
curl -s http://localhost:1313/docs/write/releases/index.md | grep -c '^| '
```

5. Test with `published: false` first. Set it to `true` only after the tag and assets exist. Test each language and a subpath deployment.

## Related {#related}

- [Blog posts](/docs/write/blog/) — where release notes live and how they are ordered
- [Code Blocks](/docs/components/code/) — code rendering and copying inside download steps
- [Home and landing pages](/docs/customize/home/) — the landing `download` section
- [Configuration](/docs/customize/config/) — `params.version` and the related site parameters
- [Upgrade](/docs/admin/upgrade/) — how a consuming site tracks theme versions
