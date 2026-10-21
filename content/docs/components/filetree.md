---
title: FileTree
linkTitle: FileTree
description: Write directory listings in a `filetree` fence. Use indentation for depth, trailing slashes for directories, and aligned comments for explanations.
weight: 90
search_keywords: [FileTree, directory tree, tree, repository layout, fence, icon, tone, open]
---

A `filetree` fence contains a directory listing. Indentation sets depth, a trailing `/` marks a directory, and text after `#` is a comment.
Use it to explain the relevant directory structure, with one annotation per entry.
If readers need to copy the exact listing, use an ordinary code block.

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

Bullets (`-`, `*`, `+`) are optional and do not change the result.
Entries with children are directories. For entries without children, a trailing `/` marks a directory.

## Adding comments {#comments}

Text after the first whitespace-preceded `#` is a comment. Comments appear in an aligned column on the right.
They are plain text, so Markdown appears literally. Use `\#` for a literal hash.

````markdown {title="Source"}
```filetree
- content/          # every page, both languages in one directory
  - docs/          # the documentation tree you are reading
  - blog/           # release notes and articles
- assets/scss/      # the site's own SCSS, overriding theme variables
- layouts/          # site-level template overrides, the fewer the better
- static/images/    # images that need no build-time processing
- hugo.yml         # site configuration: languages, menus, params.ui
```
````

```filetree
- content/          # every page, both languages in one directory
  - docs/          # the documentation tree you are reading
  - blog/           # release notes and articles
- assets/scss/      # the site's own SCSS, overriding theme variables
- layouts/          # site-level template overrides, the fewer the better
- static/images/    # images that need no build-time processing
- hugo.yml         # site configuration: languages, menus, params.ui
```

At build time, the widest row determines the comment column's starting position. Each `#` aligns even if the source does not.
The comment column occupies at least three tenths and at most half of the panel.
Drag the dashed splitter to change the width. Alternatively, focus it with <kbd>Tab</kbd> and move it with arrow keys.
<kbd>Home</kbd> / <kbd>End</kbd> move it to the limits.

Long names and comments are truncated with an ellipsis within their columns. Hover to see the full text in `title`.
Only trees **with comments** load JavaScript. This script controls the splitter.

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

## Wrap long comments {#wrap}

Use `wrap=true` on the `filetree` fence to show complete comments in their
column. Rows grow as needed, including for unbroken identifiers. The default
`wrap=false` keeps compact rows with ellipsis. Names, folding, splitter controls,
mobile layout, and expanded Print output retain their existing behavior.

## Title bars {#title}

The fence attribute `{title="…"}` adds a title bar above the tree. Without it, no title bar appears.

````markdown {title="Source"}
```filetree {title="the oink.pgsty.com repository root"}
- content/          # pages
- assets/           # resources that take part in the build
- data/             # data for the home page, landings and downloads
- layouts/          # template overrides
- static/           # files copied verbatim
- tests/            # Playwright and node --test
- hugo.yml
- go.mod            # the theme, imported as a Hugo Module
- Makefile          # make d / make b / make c
```
````

```filetree {title="the oink.pgsty.com repository root"}
- content/          # pages
- assets/           # resources that take part in the build
- data/             # data for the home page, landings and downloads
- layouts/          # template overrides
- static/           # files copied verbatim
- tests/            # Playwright and node --test
- hugo.yml
- go.mod            # the theme, imported as a Hugo Module
- Makefile          # make d / make b / make c
```

## Indentation and depth {#indent}

Indentation sets depth. Two spaces, four spaces, and tabs, counted as four columns, are supported.
Indentation widths can vary within one tree, but every level that you return to must have been opened previously.
You can paste complete `tree` command output, including the root and summary lines. The summary is removed.

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

Returning to an unopened indentation level warns and skips that line. The warning identifies the line inside the fence.
Review the warning and rendered fallback before publication.

## Folding and explicit types {#dir-file}

Directories with children are open by default. `{open=false}` makes a directory initially closed.
Directories use native `<details>` and work with the keyboard without JavaScript. Only directories accept `open`.
An entry without children or a trailing `/` is a file. `{type=dir}` forces a directory, and `{type=file}` forces a file.

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

The theme infers icons from names. Directory icons follow the open state.
Files are matched first by full filename (`LICENSE`, `Makefile`, `go.mod`, `package.json`, `.gitignore` …), then by extension (`md yml toml json
sh py go js sql css png svg pdf zip` …). Other files use a generic file icon.

`{icon=…}` overrides the icon with exactly one Font Awesome class pair.
`{tone=…}` colors the icon. It uses the [badges](/docs/components/badge/) vocabulary: `neutral` `info` `success` `warning` `danger`.

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

`tone` colors only the icon. It never colors the text. State the meaning in the name or comment; color supplements it.

## Linked entries {#link}

Write `[name](link)` to make an entry name a link. Site paths, relative paths, and `http(s):` are supported.
Links use the same URL validation as other components.

````markdown {title="Source"}
```filetree {title="this site's component pages"}
- content/docs/
  - [callout.md](/docs/components/callout/)     # callouts
  - [filetree.md](/docs/components/filetree/)   # this page
  - [gallery.md](/docs/components/gallery/)     # galleries
  - image/                                      # page bundle
    - [index.md](/docs/components/image/)       # images
- [hugo.yml](https://github.com/pgsty/oink/blob/main/tests/site/hugo.yaml)   # fixture configuration on GitHub
```
````

```filetree {title="this site's component pages"}
- content/docs/
  - [callout.md](/docs/components/callout/)     # callouts
  - [filetree.md](/docs/components/filetree/)   # this page
  - [gallery.md](/docs/components/gallery/)     # galleries
  - image/                                      # page bundle
    - [index.md](/docs/components/image/)       # images
- [hugo.yml](https://github.com/pgsty/oink/blob/main/tests/site/hugo.yaml)   # fixture configuration on GitHub
```

## One tree per platform {#tabs}

A fence carrying `tab=` (and `group=` / `value=`) becomes one panel of a
[tab set](/docs/components/tabs/) and can sit alongside code fences.

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

| Output | Shape |
| --- | --- |
| HTML | `<div class="td-filetree">`, an optional title bar, directories as native `<details>`; a tree with comments also gets the draggable splitter, its only runtime |
| Print | The same tree, fully expanded, no splitter, comments wrapped instead of truncated |
| Markdown | The `filetree` fence, emitted as written |
| RSS | The fence source inside a `<pre>` |

Below the `sm` breakpoint, the layout becomes one column. Comments move below names, display without truncation, and the splitter is hidden.
Trees without comments always use one column and load no script.

## Parameter reference {#reference}

Fence attributes, after ```` ```filetree ````:

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | plain text | — | Title bar above the tree; omitted when absent; must not be empty |
| `tab` | plain text | — | Makes this tree one panel of a tab set |
| `group` / `value` | string | — | Tab group and sync value; must appear with `tab` |
| `class` | class list | — | Passed through for site CSS |
{.fields meta="type default"}

Entry attributes, in the `{…}` at the end of a line:

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `icon` | Font Awesome class pair | matched by name / extension | For example `fa-solid fa-lock`; a malformed value warns and uses the default icon |
| `tone` | enum | `neutral` | `neutral` `info` `success` `warning` `danger`; colours the icon only |
| `open` | boolean | `true` | Directories only; `false` starts it closed |
| `type` | enum | inferred | `dir` or `file`, overriding the inference |
{.fields meta="type default"}

The line syntax itself:

| Element | Description |
| --- | --- |
| Indentation | Two spaces / four spaces / tabs / the `│ ├── └──` drawing from `tree` |
| `- name` | The bullet is optional; `-`, `*` and `+` are equivalent |
| `name/` | A trailing slash marks a directory; the name renders as written, slash kept |
| `[name](url)` | A linked entry |
| `# comment` | Everything after the first whitespace-preceded `#`; `\#` is a literal hash |
| `N directories, M files` | The `tree` summary line, dropped automatically |
{.fields}

Unknown attributes or values, `open` on files, malformed `{…}`, and dedents to unopened levels warn.
The theme uses a safe fallback or skips the invalid line. The message identifies the line. Review the warning and rendered fallback before publication.

## Limits {#limits}

- `filetree` fences are the only form. There is no `{.filetree}` list marker or shortcode.
- Names and comments are plain text. `**bold**` appears literally, so the source remains readable in other tools.
- The tree reads nothing from disk. You write or paste static content, which does not track the repository.
- There is no search, multiple selection, or control to copy the whole tree. Use a code block when readers must copy the exact listing.
- Split positions are not saved. Reloading restores the width calculated at build time.

## Related {#related}

- [Code blocks](/docs/components/code/) — listings meant to be copied verbatim
- [Tabs](/docs/components/tabs/) — one tree per platform, side by side
- [Badges](/docs/components/badge/) — `tone` uses the same vocabulary
- [Organizing content](/docs/write/organize/) — how a real content directory is laid out
