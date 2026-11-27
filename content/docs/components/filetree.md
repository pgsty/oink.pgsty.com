---
title: FileTree
linkTitle: FileTree
description: Draw an annotated directory tree in a `filetree` fence, with aligned comments, per-entry icons and collapsible directories.
weight: 90
search_keywords: [FileTree, directory tree, tree, repository layout, fence, icon, tone, open]
---

A file tree explains a directory layout one entry at a time: where the
configuration lives, which directory holds data, what a reader may delete. You
write it in a `filetree` fence, where indentation sets the depth, a trailing
`/` marks a directory and the text after `#` is a comment. The theme lines the
comments up in their own column and turns directories into folders that
readers can open and close.

A file tree shows the part of a layout that matters and says why. When readers
need to copy the exact listing, use an ordinary [code block](/docs/components/code/)
instead.

## Shortest form {#minimal}

````markdown {title="Source"}
```filetree
- content/
  - _index.md
  - docs/
  - blog/
- hugo.yml
- go.mod
```
````

```filetree
- content/
  - _index.md
  - docs/
  - blog/
- hugo.yml
- go.mod
```

The bullets (`-`, `*` or `+`) are optional and change nothing. An entry with
children is a directory; an entry without children is a directory only when
its name ends in `/`.

## Adding comments {#comments}

Everything after the first `#` that follows whitespace is a comment, shown in
an aligned column on the right. Comments are plain text, so Markdown in them
shows literally; write `\#` for a literal hash.

````markdown {title="Source"}
```filetree
- content/          # every page, both languages in one directory
  - docs/          # the documentation tree you are reading
  - blog/           # release notes and articles
- assets/css/       # the site's own CSS, loaded after the theme's
- layouts/          # site-level template overrides, the fewer the better
- static/images/    # images that need no build-time processing
- hugo.yml         # site configuration: languages, menus, params.ui
```
````

```filetree
- content/          # every page, both languages in one directory
  - docs/          # the documentation tree you are reading
  - blog/           # release notes and articles
- assets/css/       # the site's own CSS, loaded after the theme's
- layouts/          # site-level template overrides, the fewer the better
- static/images/    # images that need no build-time processing
- hugo.yml         # site configuration: languages, menus, params.ui
```

You do not need to align the `#` signs in the source: the theme starts the
comment column after the widest name, so every comment lines up anyway. The
comment column takes between three tenths and half of the panel. Readers can
drag the dashed splitter between the columns, or focus it with <kbd>Tab</kbd>
and move it with the arrow keys, <kbd>Home</kbd> and <kbd>End</kbd> jumping to
the limits. The splitter is the tree's only script, so a tree without comments
loads no JavaScript.

A long name or comment is cut off with an ellipsis inside its column, and
hovering shows the full text:

````markdown {title="Source"}
```filetree {title="truncation in both columns"}
- runbooks/
  - a-deliberately-long-runbook-filename-for-a-failover-drill.md  # an equally overlong comment, kept on one line so it has to be clipped inside the comment column
  - restart.md                                                    # short
```
````

```filetree {title="truncation in both columns"}
- runbooks/
  - a-deliberately-long-runbook-filename-for-a-failover-drill.md  # an equally overlong comment, kept on one line so it has to be clipped inside the comment column
  - restart.md                                                    # short
```

On screens narrower than the `sm` breakpoint the tree becomes a single column:
each comment moves under its name and shows in full, and the splitter is
hidden.

## Wrap long comments {#wrap}

When the comments are the point of the tree and must be read in full, add
`wrap=true` to the fence. Comments then wrap inside their column, even unbroken
identifiers, and rows grow to fit; names keep their ellipsis. Everything else
works as before: folding, the splitter, the narrow-screen layout and print.

````markdown {title="Source"}
```filetree {title="Complete storage comments" wrap=true}
- storage/
  - metadata/ # Schema definitions: property keys, vertex and edge labels, indexes, and counters.
  - graph/    # Graph data: vertices, edges, index tables, and OLAP analysis data.
```
````

```filetree {title="Complete storage comments" wrap=true}
- storage/
  - metadata/ # Schema definitions: property keys, vertex and edge labels, indexes, and counters.
  - graph/    # Graph data: vertices, edges, index tables, and OLAP analysis data.
```

## Title bars {#title}

`{title="…"}` on the fence adds a title bar above the tree, which helps when
the reader needs to know which machine or repository the tree describes.

````markdown {title="Source"}
```filetree {title="pgBackRest repository on the backup host"}
- /pg/backup/
  - archive/         # WAL segments, needed for point-in-time recovery
  - backup/          # full, differential and incremental backups
- /etc/pgbackrest/
  - pgbackrest.conf  # stanza, retention and repository settings
```
````

```filetree {title="pgBackRest repository on the backup host"}
- /pg/backup/
  - archive/         # WAL segments, needed for point-in-time recovery
  - backup/          # full, differential and incremental backups
- /etc/pgbackrest/
  - pgbackrest.conf  # stanza, retention and repository settings
```

## Indentation and depth {#indent}

Indentation sets the depth. Two spaces, four spaces and tabs (counted as four
columns) all work and may even be mixed in one tree, as long as every level you
return to was opened earlier. That makes it easy to paste the output of the
`tree` command as it is, root line and summary included; the summary line is
dropped.

````markdown {title="Source"}
```filetree
content/docs
├── about
│   ├── _index.md
│   └── features.md
├── components
│   ├── filetree.md
│   └── image
│       └── index.md
└── _index.md

3 directories, 5 files
```
````

```filetree
content/docs
├── about
│   ├── _index.md
│   └── features.md
├── components
│   ├── filetree.md
│   └── image
│       └── index.md
└── _index.md

3 directories, 5 files
```

A line that returns to a level that was never opened warns, naming its line in
the fence, and is skipped.

## Folding and explicit types {#dir-file}

Directories with children start open; `{open=false}` at the end of a line
starts one closed, which keeps a large tree focused on the part you are
explaining. Directories are native `<details>` elements, so they open and close
with the keyboard and need no JavaScript. When the name alone does not reveal
the type, `{type=dir}` or `{type=file}` sets it.

````markdown {title="Source"}
```filetree {title="the content directory"}
- content/
  - docs/                # the documentation tree
    - components/         # 22 component pages    {open=false}
      - callout.md
      - filetree.md
      - image/            # page bundle: body + images  {type=dir}
    - customize/          # site-level configuration    {open=false}
      - config.md
  - blog/
    - release.md
```
````

```filetree {title="the content directory"}
- content/
  - docs/                # the documentation tree
    - components/         # 22 component pages    {open=false}
      - callout.md
      - filetree.md
      - image/            # page bundle: body + images  {type=dir}
    - customize/          # site-level configuration    {open=false}
      - config.md
  - blog/
    - release.md
```

## Icons and tones {#icon-tone}

The theme picks each icon from the name. Directory icons follow the open or
closed state. Files match first on the full name (`LICENSE`, `Makefile`,
`go.mod`, `package.json`, `.gitignore` …), then on the extension (`md yml toml
json sh py go js sql css png svg pdf zip` …), and anything else gets a generic
file icon.

`{icon=…}` replaces the icon with one Font Awesome class pair. `{tone=…}`
colors the icon with the [badge](/docs/components/badge/) vocabulary: `neutral`,
`info`, `success`, `warning`, `danger`.

````markdown {title="Source"}
```filetree {title="deployment layout: permissions and what matters"}
- /etc/pigsty/                 # 0755 root:root · configuration root        {icon="fa-solid fa-server" tone=info}
  - pigsty.yml                 # 0644 root:root · cluster inventory
  - ca/                        # 0700 root:root · self-signed CA, never commit  {icon="fa-solid fa-lock" tone=danger open=false}
    - ca.key                   # 0600 root:root
- /var/lib/pgsql/18/data/      # 0700 postgres:postgres · data directory    {tone=warning}
  - postgresql.conf            # 0600 postgres:postgres
- /usr/bin/pig                 # 0755 root:root · command-line tool         {icon="fa-solid fa-terminal" tone=success}
```
````

```filetree {title="deployment layout: permissions and what matters"}
- /etc/pigsty/                 # 0755 root:root · configuration root        {icon="fa-solid fa-server" tone=info}
  - pigsty.yml                 # 0644 root:root · cluster inventory
  - ca/                        # 0700 root:root · self-signed CA, never commit  {icon="fa-solid fa-lock" tone=danger open=false}
    - ca.key                   # 0600 root:root
- /var/lib/pgsql/18/data/      # 0700 postgres:postgres · data directory    {tone=warning}
  - postgresql.conf            # 0600 postgres:postgres
- /usr/bin/pig                 # 0755 root:root · command-line tool         {icon="fa-solid fa-terminal" tone=success}
```

`tone` colors the icon and never the text, so put the meaning in the name or
the comment; readers who cannot tell the colors apart still get it there.

## Linked entries {#link}

Write an entry as `[name](link)` to make it a link, for example to the page
that documents that file. Site paths, relative paths and `http(s):` URLs are
accepted, and they pass the same URL checks as links in other components.

````markdown {title="Source"}
```filetree {title="this site's component pages"}
- content/docs/components/
  - [callout.md](/docs/components/callout/)     # callouts
  - [filetree.md](/docs/components/filetree/)   # this page
  - [gallery.md](/docs/components/gallery/)     # galleries
  - image/                                      # page bundle
    - [index.md](/docs/components/image/)       # images
- [hugo.yml](https://github.com/pgsty/oink.pgsty.com/blob/main/hugo.yml)   # this site's configuration on GitHub
```
````

```filetree {title="this site's component pages"}
- content/docs/components/
  - [callout.md](/docs/components/callout/)     # callouts
  - [filetree.md](/docs/components/filetree/)   # this page
  - [gallery.md](/docs/components/gallery/)     # galleries
  - image/                                      # page bundle
    - [index.md](/docs/components/image/)       # images
- [hugo.yml](https://github.com/pgsty/oink.pgsty.com/blob/main/hugo.yml)   # this site's configuration on GitHub
```

## One tree per platform {#tabs}

When the layout differs by platform, give each fence `tab=` (and `group=` /
`value=`); adjacent fences then become one [tab set](/docs/components/tabs/),
which can mix trees and code fences.

````markdown {title="Source"}
```filetree {tab="Linux" group="platform" value="linux"}
- /etc/pigsty/          # configuration
- /var/lib/pgsql/       # data
- /usr/bin/pig          # executable
```
```filetree {tab="macOS" value="macos"}
- ~/Library/Application Support/pigsty/   # configuration
- /opt/homebrew/bin/pig                   # executable
```
````

```filetree {tab="Linux" group="platform" value="linux"}
- /etc/pigsty/          # configuration
- /var/lib/pgsql/       # data
- /usr/bin/pig          # executable
```
```filetree {tab="macOS" value="macos"}
- ~/Library/Application Support/pigsty/   # configuration
- /opt/homebrew/bin/pig                   # executable
```

## Output {#outputs}

Print shows every directory expanded, with comments wrapped instead of cut off
and no splitter. The page's Markdown output keeps the `filetree` fence as you
wrote it, and RSS shows that same source in a `<pre>` block.

## Parameter reference {#reference}

Fence attributes, after ```` ```filetree ````:

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | plain text | — | Title bar above the tree; omitted when absent; must not be empty |
| `wrap` | boolean | `false` | Wrap long comments and grow rows; names keep the ellipsis; an invalid value warns and uses `false` |
| `tab` | plain text | — | Makes this tree one panel of a tab set |
| `group` / `value` | string | — | Tab group and sync value; must appear with `tab` |
| `class` | class list | — | Passed through for site CSS |
{.fields meta="type default"}

Entry attributes, in the `{…}` at the end of a line:

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `icon` | Font Awesome class pair | matched by name / extension | For example `fa-solid fa-lock`; a malformed value warns and uses the default icon |
| `tone` | enum | `neutral` | `neutral` `info` `success` `warning` `danger`; colors the icon only |
| `open` | boolean | `true` | Directories only; `false` starts it closed |
| `type` | enum | inferred | `dir` or `file`, overriding the inference |
{.fields meta="type default"}

The line syntax:

| Element | Description |
| --- | --- |
| Indentation | Two spaces / four spaces / tabs / the `│ ├── └──` drawing from `tree` |
| `- name` | The bullet is optional; `-`, `*` and `+` are equivalent |
| `name/` | A trailing slash marks a directory; the name renders as written, slash kept |
| `[name](url)` | A linked entry |
| `# comment` | Everything after the first whitespace-preceded `#`; `\#` is a literal hash |
| `N directories, M files` | The `tree` summary line, dropped automatically |
{.fields}

Unknown attributes or values, `open` on a file, a malformed `{…}` and a
return to an unopened level all warn with the line number in the fence; the
theme then uses a safe default or skips the line.

## Limits {#limits}

- The `filetree` fence is the only form; there is no `{.filetree}` list marker
  and no shortcode.
- Names and comments are plain text, so `**bold**` shows literally and the
  source stays readable in any Markdown viewer.
- The tree reads nothing from disk. It is the text you wrote or pasted and does
  not follow later changes to the repository.
- There is no search, multiple selection or copy-the-whole-tree control; use a
  code block when readers must copy the listing.
- A dragged splitter position is not saved, so a reload restores the width
  computed at build time.

## Related {#related}

- [Code blocks](/docs/components/code/) — listings meant to be copied verbatim
- [Tabs](/docs/components/tabs/) — one tree per platform, side by side
- [Badges](/docs/components/badge/) — `tone` uses the same vocabulary
- [Organizing content](/docs/write/organize/) — how a real content directory is laid out
