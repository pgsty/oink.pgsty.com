---
title: FileTree
description:
  Present annotated repository and directory structures with an ordinary nested
  Markdown list.
weight: 50
---

Use FileTree to explain the part of a repository or directory layout that
matters to the reader. The component is a plain nested list followed by the
`{.filetree}` marker: indentation is the hierarchy, a trailing `/` marks a
directory, and everything after `—` describes the entry. The source renders as a
nested list on GitHub and in any Markdown reader; OINK styles it as a monospace
tree with folder and file icons.

## When to use {#when-to-use}

FileTree works best for curated structures in setup guides, architecture
overviews, deployment runbooks, and contribution instructions. Use a code block
for literal command output that should be copied verbatim — pasting `tree`
output into an ordinary fence needs no component at all. Describe generated or
highly dynamic trees in prose instead of committing a large snapshot that will
quickly drift.

## Quick start {#quick-start}

### Source {#source}

<!-- prettier-ignore-start -->

```markdown
- content/ — Page bundles and templates
  - _index.md — Section landing page
  - docs/ — Product guides
    - [configuration.md](/docs/configure/) — Runtime settings
    - operations/ — Runbooks and recovery
  - blog/
- [hugo.yml](https://github.com/pgsty/oink.pgsty.com/blob/main/hugo.yml) — Site configuration
{.filetree}
```

<!-- prettier-ignore-end -->

### Rendered result {#rendered-result}

<!-- prettier-ignore-start -->

- content/ — Page bundles and templates
  - _index.md — Section landing page
  - docs/ — Product guides
    - operations-and-troubleshooting/ — Runbooks and recovery
      - [a-deliberately-long-runbook-filename-that-wraps-without-horizontal-overflow.md](/docs/) — Emergency procedure
    - [configuration.md](/docs/configure/) — Runtime settings
  - blog/ — Release notes and stories
    - release.md — Release announcement
- [hugo.yml](https://github.com/pgsty/oink.pgsty.com/blob/main/hugo.yml) — Site configuration
{.filetree}

<!-- prettier-ignore-end -->

Every entry is a normal list item, so links, emphasis, and inline code work as
they do anywhere else in Markdown.

## Notation {#notation}

| Notation         | Meaning                                                                    |
| ---------------- | -------------------------------------------------------------------------- |
| indentation      | The hierarchy; two spaces per level                                        |
| `- name/`        | A directory (an entry with children is a directory even without the slash) |
| `- name`         | A file                                                                     |
| ` — description` | Everything after the separator describes the entry (a writing convention)  |
| `[name](url)`    | A linked entry; `*emphasis*` and `` `code` `` are ordinary Markdown        |
| `{.filetree}`    | The marker on the line right after the list                                |

The tree is static and fully expanded. Directories are recognised by their
nested list; an empty directory written with a trailing `/` keeps the generic
entry icon. There are no per-entry icons, colors, or ownership fields: put
filesystem notation such as `0640 root:wheel` into the description text.

## Rich examples {#rich-examples}

### Ownership and permissions {#ownership-and-permissions}

Write mode and identity into the description when the layout itself explains an
operational boundary:

<!-- prettier-ignore-start -->

```markdown
- /srv/atlas/ — 0755 root:root · Application root
  - releases/ — 0750 deploy:release-engineering · Immutable builds
    - 2026.08.16/ — 0750 deploy:release-engineering · Active release
      - atlas-server — 0555 deploy:atlas · Executable
      - app.toml — 0640 root:atlas · Runtime configuration
  - secrets/ — 0700 root:security · Restricted credentials
    - production.env — 0600 root:security
{.filetree}
```

<!-- prettier-ignore-end -->

<!-- prettier-ignore-start -->

- /srv/atlas/ — 0755 root:root · Application root
  - releases/ — 0750 deploy:release-engineering · Immutable builds
    - 2026.08.16/ — 0750 deploy:release-engineering · Active release
      - atlas-server — 0555 deploy:atlas · Executable
      - app.toml — 0640 root:atlas · Runtime configuration
  - secrets/ — 0700 root:security · Restricted credentials
    - production.env — 0600 root:security
{.filetree}

<!-- prettier-ignore-end -->

### Deep nesting {#deep-nesting}

Long names never wrap; the panel scrolls horizontally instead of widening the
page.

<!-- prettier-ignore-start -->

- warehouse/ — Persistent datasets
  - raw/
    - events/
      - 2026/
        - 08/
          - events-2026-08-16.parquet — Immutable daily partition
  - curated/
    - `orders_daily.parquet` — Rebuilt nightly
- notebooks/
  - *scratch.ipynb* — Not versioned
{.filetree}

<!-- prettier-ignore-end -->

## Semantics and fallback {#semantics-and-fallback}

HTML is the nested `ul` you wrote, with the `filetree` class on the outer list.
CSS draws the monospace panel, the guide lines, and the icons (`li:has(> ul)`
selects directories); no JavaScript is loaded and the tree does not claim
`role="tree"`. Markdown output is the source list; print and RSS render the same
expanded list.

## Deliberate limits {#deliberate-limits}

FileTree does not collapse, sort, read the filesystem, or add per-entry icons,
colors, badges, or a title bar. Keep trees curated and short; when a listing
must be copied verbatim, use a code block.

## Migrated from 0.4 {#migration}

The `filetree`, `filetree/folder`, and `filetree/file` shortcodes were removed.
The theme's migration toolkit rewrites them into the list form: `name` becomes
the entry, `link` becomes a Markdown link, `comment` becomes the description,
and `open`, `icon`, `color`, and `label` are dropped.
