---
title: FileTree
description: >-
  Present annotated repository and directory structures with a `filetree` code
  fence: aligned comments, per-entry icons, and collapsible directories.
weight: 50
---

Use FileTree to explain the part of a repository or directory layout that
matters to the reader. The component is a `filetree` code fence whose body is
the listing itself: indentation is the hierarchy, a trailing `/` marks a
directory, and everything after `#` is a comment that OINK renders as an aligned
grey column. On GitHub and in any Markdown reader the fence stays a readable
monospace listing; OINK renders it as a panel with icons, native folding, and an
optional title bar.

## When to use {#when-to-use}

FileTree works best for curated structures in setup guides, architecture
overviews, deployment runbooks, and contribution instructions. Use it whenever
entries deserve a comment, a link, or an icon; use an ordinary code block when a
listing must be copied verbatim. Describe generated or highly dynamic trees in
prose instead of committing a large snapshot that will quickly drift.

## Quick start {#quick-start}

### Source {#source}

````markdown
```filetree {title="Repository structure"}
- content/                        # Page bundles and templates
  - _index.md                     # Section landing page
  - docs/                         # Product guides
    - [configuration.md](/docs/configure/)   # Runtime settings
    - operations/                 # Runbooks and recovery   {open=false}
  - blog/
- [hugo.yml](https://github.com/pgsty/oink.pgsty.com/blob/main/hugo.yml)   # Site configuration
```
````

### Rendered result {#rendered-result}

```filetree {title="Repository structure"}
- content/                        # Page bundles and templates
  - _index.md                     # Section landing page
  - docs/                         # Product guides
    - operations-and-troubleshooting/     # Runbooks and recovery
      - [a-deliberately-long-runbook-filename-that-does-not-wrap.md](/docs/)   # Emergency procedure
    - [configuration.md](/docs/configure/)   # Runtime settings
  - blog/                         # Release notes and stories   {open=false}
    - release.md                  # Release announcement
- [hugo.yml](https://github.com/pgsty/oink.pgsty.com/blob/main/hugo.yml)   # Site configuration
- LICENSE
```

Directories with children fold and unfold on click (or with the keyboard); the
comment column starts at the same position on every row and never takes more
than the right half of the panel — drag the dashed divider (or focus it and use
the arrow keys) to give the comments less room; long names and comments
truncate with an ellipsis and show the full text as a tooltip.

## Notation {#notation}

| Notation        | Meaning                                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------------------------ |
| indentation     | The hierarchy: two spaces, four spaces, tabs, or the `│   ├── └──` drawing that `tree` prints — any consistent unit works |
| `- name/`       | A directory (an entry with children is a directory even without the slash); the name renders as written                  |
| `- name`        | A file; the bullet is optional                                                                                           |
| `# comment`     | Everything after the first `#` preceded by whitespace; rendered as the aligned grey column. Write `\#` for a literal hash |
| `[name](url)`   | A linked entry; the URL is validated like every other component link                                                     |
| `{key=value …}` | Trailing per-entry attributes: `icon`, `tone`, `open`, `type` (see below)                                                |
| `{title="…"}`   | Fence attribute: a title bar above the tree. Without it no bar is drawn                                                  |

Comments and names are plain text — emphasis, code spans, and other inline
Markdown render literally, which keeps the fence readable as source.

### Parameters {#parameters}

Fence attributes (on the opening line):

| Attribute | Type   | Default | Description                                           |
| --------- | ------ | ------- | ----------------------------------------------------- |
| `title`   | string | —       | Title bar above the tree. Without it no bar is drawn. |
{.fields caption="FileTree fence attributes"}

Per-entry attributes (trailing `{…}` on an entry line):

| Attribute | Type   | Default           | Description                                                                                                  |
| --------- | ------ | ----------------- | ------------------------------------------------------------------------------------------------------------ |
| `icon`    | string | by name/extension | One Font Awesome class pair such as `fa-solid fa-lock`; replaces the default icon.                           |
| `tone`    | enum   | `neutral`         | `neutral`, `info`, `success`, `warning`, or `danger` — colours the icon (the [Badge](../badge/) vocabulary). |
| `open`    | bool   | `true`            | Directories only; `false` starts the directory collapsed.                                                    |
| `type`    | enum   | detected          | `dir` or `file`; overrides the detection when neither a trailing `/` nor children apply.                     |
{.fields caption="FileTree entry attributes"}

Unknown attributes, unknown values, and `open` on a file fail the build with the
fence line number.

### Default icons {#default-icons}

Directories use the folder glyph, open or closed with the disclosure state. Files
are matched by whole name (`LICENSE`, `Makefile`, `Dockerfile`, `.gitignore`,
`go.mod`, `package.json`, `Cargo.toml`, `.env`, …) and then by extension
(Markdown, YAML/TOML/JSON/INI configuration, shell scripts, Python, Go,
JavaScript, Rust, Java, PHP, HTML, CSS, SQL, images, PDF, archives, lock and key
files, logs, …); anything else gets the plain file glyph. `icon=` always wins.

## Rich examples {#rich-examples}

### Ownership and permissions {#ownership-and-permissions}

Write mode and identity into the comment when the layout itself explains an
operational boundary, and use `icon`/`tone` sparingly to mark what matters:

````markdown
```filetree
- /srv/atlas/                  # 0755 root:root · Application root   {icon="fa-solid fa-server" tone=info}
  - releases/                  # 0750 deploy:release-engineering · Immutable builds
    - 2026.08.16/              # 0750 deploy:release-engineering · Active release
      - atlas-server           # 0555 deploy:atlas · Executable   {icon="fa-solid fa-terminal" tone=success}
      - app.toml               # 0640 root:atlas · Runtime configuration
  - secrets/                   # 0700 root:security · Restricted credentials   {icon="fa-solid fa-lock" tone=danger open=false}
    - production.env           # 0600 root:security
```
````

```filetree
- /srv/atlas/                  # 0755 root:root · Application root   {icon="fa-solid fa-server" tone=info}
  - releases/                  # 0750 deploy:release-engineering · Immutable builds
    - 2026.08.16/              # 0750 deploy:release-engineering · Active release
      - atlas-server           # 0555 deploy:atlas · Executable   {icon="fa-solid fa-terminal" tone=success}
      - app.toml               # 0640 root:atlas · Runtime configuration
  - secrets/                   # 0700 root:security · Restricted credentials   {icon="fa-solid fa-lock" tone=danger open=false}
    - production.env           # 0600 root:security
```

### Pasted `tree` output {#tree-output}

The output of the `tree` command is accepted as is, including the root line and
the trailing summary (which is dropped):

````markdown
```filetree
.
├── bin
│   └── pig
├── etc
│   └── pig.yml
└── README.md

2 directories, 3 files
```
````

```filetree
.
├── bin
│   └── pig
├── etc
│   └── pig.yml
└── README.md

2 directories, 3 files
```

### Deep nesting {#deep-nesting}

Long names never wrap; they truncate inside their column and expose the full
name as a tooltip. Below the small breakpoint the comment moves under the name
instead of truncating.

```filetree
- warehouse/                          # Persistent datasets
  - raw/
    - events/
      - 2026/
        - 08/
          - events-2026-08-16.parquet   # Immutable daily partition
  - curated/
    - orders_daily.parquet            # Rebuilt nightly
- notebooks/
  - scratch.ipynb                     # Not versioned
```

## Semantics and fallback {#semantics-and-fallback}

HTML is a panel `<div>` (theme classes only, `td-` prefixed) with a nested
`ul`; a directory with children is a native `<details>`/`<summary>`
(keyboard-operable, no `role="tree"`). Each row is a two-column grid whose name
column width is computed at build time from the longest entry and clamped to
50–70% of the row, so comments align without a runtime; the only script is the
small divider runtime that makes the split draggable, and without it the tree
is complete. Print renders the same tree fully expanded and static, Markdown
output keeps the fence itself, and RSS carries the source in a `<pre>`.

## Deliberate limits {#deliberate-limits}

FileTree does not sort, read the filesystem, or render inline Markdown inside
names and comments. Keep trees curated and short; when a listing must be copied
verbatim, use a code block.

## Migrated from 0.4 {#migration}

The `filetree`, `filetree/folder`, and `filetree/file` shortcodes and the
interim `{.filetree}` list marker were removed. The theme's migration toolkit
rewrites both into the fence: `label` becomes `title`, `comment` becomes the
`#` comment, `link` becomes a Markdown link, and `open`, `icon`, and `color`
(as `tone`) become the trailing attributes.
