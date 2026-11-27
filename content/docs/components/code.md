---
title: Code Blocks
linkTitle: Code Blocks
description: Show commands, configuration and source code in a Markdown fence with a filename, exact copying, line numbers, highlighting, wrapping, folding and linkable lines.
weight: 30
search_keywords: [Code Block, fence, copy, lineNos, hl-lines, collapse, wrap, Chroma, syntax highlighting]
aliases:
  - /docs/components/code-blocks/
---

Commands, configuration files and source code go in an ordinary Markdown
fence. Hugo's built-in Chroma highlighter colors it while the site builds, so
the page ships highlighted HTML and the browser runs no highlighter. Attributes
on the fence's opening line add what readers of technical docs rely on: a
filename above the code, a copy button that copies exactly the right text, line
numbers, folding for long files, and links to individual lines. Fences for
diagrams and data, such as `mermaid`, `echarts` and `filetree`, are separate
components with their own pages.

## Shortest form {#minimal}

````markdown {title="Source"}
```sql
SELECT datname, numbackends FROM pg_stat_database ORDER BY numbackends DESC;
```
````

```sql
SELECT datname, numbackends FROM pg_stat_database ORDER BY numbackends DESC;
```

Every fence gets the full frame and a copy button, even without attributes; a
block without a title simply has no title bar. The copy button sits at the top
right and appears when the pointer is over the block or focus is inside it, and
on touch screens it is always visible. The language is not displayed, but site
CSS can read it from the block's `data-language` attribute.

The language tag is a Chroma lexer name, and Chroma has a lexer for most
languages and file formats. A `diff` fence, for example, shows added and
removed lines in their own colors, with no extra component:

````markdown {title="Source"}
```diff {title="a change to hugo.yml"}
 params:
   ui:
-    sidebar_menu_compact: true
+    sidebar_menu_compact: false
     sidebar_menu_foldable: true
```
````

```diff {title="a change to hugo.yml"}
 params:
   ui:
-    sidebar_menu_compact: true
+    sidebar_menu_compact: false
     sidebar_menu_foldable: true
```

## Filename titles {#title}

`title` adds a title bar above the code, usually the file's name or path, so
readers know where the snippet belongs. It also becomes the block's accessible
name.

````markdown {title="Source"}
```yaml {title="hugo.yml"}
markup:
  goldmark:
    parser:
      attribute:
        block: true
    renderer:
      unsafe: true
```
````

```yaml {title="hugo.yml"}
markup:
  goldmark:
    parser:
      attribute:
        block: true
    renderer:
      unsafe: true
```

`filename` is an alias for `title`. If a fence has both, the build warns and
uses `filename`.

## Line numbers, start line and highlighting {#line-numbers}

`lineNos="inline"` puts line numbers in the code column, and `lineNoStart`
sets the first number, which helps when the snippet is an excerpt of a longer
file. `hl_lines` highlights the lines you want the reader to look at. It counts
the lines inside the fence from 1, whatever `lineNoStart` says.

````markdown {title="Source"}
```ini {title="postgresql.conf" lineNos="inline" lineNoStart=120 hl_lines="2 4-5"}
shared_buffers = 8GB
max_connections = 200
work_mem = 64MB
wal_level = replica
max_wal_senders = 10
```
````

```ini {title="postgresql.conf" lineNos="inline" lineNoStart=120 hl_lines="2 4-5"}
shared_buffers = 8GB
max_connections = 200
work_mem = 64MB
wal_level = replica
max_wal_senders = 10
```

`lineNos="table"` puts the numbers in a column of their own, so a reader who
selects the code by hand does not pick up the numbers. The copy button leaves
them out in both modes.

````markdown {title="Source"}
```bash {title="deployment in three commands" lineNos="table"}
./configure -c rich
./install.yml
pig ext install pg_duckdb
```
````

```bash {title="deployment in three commands" lineNos="table"}
./configure -c rich
./install.yml
pig ext install pg_duckdb
```

Hugo's other highlighting options, such as `tabWidth` for the number of
spaces a tab expands to, pass straight through to Chroma. `style` has no
effect by default: OINK highlights with CSS classes so that code colors follow
light and dark mode, and a Chroma style applies only after you switch to
inline styles with `params.highlight_classes: false`.

## Wrapping long lines {#wrap}

Long lines scroll sideways by default. `wrap=true` wraps them on screen
instead, which suits long URLs and checksums; the source and the copied text
keep their original lines.

````markdown {title="Source"}
```text {title="config/artifacts.env" wrap=true}
ARTIFACT_URL=https://repo.pigsty.io/pkg/infra/v3.6.0/infra-pkg-v3.6.0.el9.x86_64.tgz
CHECKSUM=sha256:6d3dce4f7acb18f586469adcb80ab35f3e859f9837786e151cfbc2b3c0f587b2
```
````

```text {title="config/artifacts.env" wrap=true}
ARTIFACT_URL=https://repo.pigsty.io/pkg/infra/v3.6.0/infra-pkg-v3.6.0.el9.x86_64.tgz
CHECKSUM=sha256:6d3dce4f7acb18f586469adcb80ab35f3e859f9837786e151cfbc2b3c0f587b2
```

Wrapping does not combine with `lineNos="table"`, because a wrapped line would
no longer line up with its number in the separate column. With both, the build
warns and turns wrapping off; use `lineNos="inline"` if you need both.

## Folding long code {#collapse}

`collapse=N` shows the first N lines with a "show all N lines" button under
them, so a complete configuration file does not push the explanation off the
screen.

````markdown {title="Source"}
```yaml {title="hugo.yml" collapse=8}
baseURL: https://oink.pgsty.com/
title: OINK
defaultContentLanguage: en
languages:
  en:
    languageName: English
    weight: 1
  zh:
    languageName: 简体中文
    weight: 2
params:
  offline_search: true
  ui:
    sidebar_menu_foldable: true
```
````

```yaml {title="hugo.yml" collapse=8}
baseURL: https://oink.pgsty.com/
title: OINK
defaultContentLanguage: en
languages:
  en:
    languageName: English
    weight: 1
  zh:
    languageName: 简体中文
    weight: 2
params:
  offline_search: true
  ui:
    sidebar_menu_foldable: true
```

Folding only hides lines on screen. The page contains the whole file, so it
is complete without JavaScript, for screen readers and on paper. A block no
longer than N lines gets no button. Folding works together with wrapping and
never cuts a wrapped line in half.

## What gets copied {#copy}

The copy button copies the whole block, except for terminal sessions. In a
`console` or `shell-session` fence it copies only the commands: it keeps the
lines that start with a prompt, strips the prompt, and drops the output. The
block below copies two commands, without `$` and without the output lines:

````markdown {title="Source"}
```console
$ pig ext list duckdb
name       version  category
pg_duckdb  1.0.0    OLAP
$ pig ext install pg_duckdb
INFO installing pg_duckdb
```
````

```console
$ pig ext list duckdb
name       version  category
pg_duckdb  1.0.0    OLAP
$ pig ext install pg_duckdb
INFO installing pg_duckdb
```

Write `copy="all"` to copy prompts and output as well. Other lexers such as
`bash` or `sh` cannot tell a prompt from a command or its output, so on them
`copy="command"` warns and copies everything. When a command continues over
several lines, start each continuation line with its prompt, usually `>`;
otherwise it counts as output and is left out.

A session block with no prompt at all cannot be copied: the button shows an
error icon and logs an error to the browser console, and the clipboard keeps
its previous content rather than receiving the whole block.

`copy=false` removes the button, for a counter-example that nobody should
paste:

````markdown {title="Source"}
```yaml {title="counter-example: an invalid boolean" copy=false}
params:
  ui:
    image_zoom: sometimes   # wrong: use true or false
```
````

```yaml {title="counter-example: an invalid boolean" copy=false}
params:
  ui:
    image_zoom: sometimes   # wrong: use true or false
```

`params.ui.code_copy: false` removes the button from every block that does
not set `copy` itself (see [Configuration](/docs/customize/config/)). The
button is an icon only; it changes icon and announces a localized status on
success or failure. Copied text keeps indentation, blank lines and Unicode,
leaves out line numbers, and ends with exactly one newline.

## One-line commands {#presentation}

A single command the reader is meant to paste can be a compact command strip
with its copy button in a column of its own: add `{class="td-code-command"}`
to a one-line fence. A block with more than one line, line numbers or
`collapse` warns and keeps the regular frame. See
[Component presentation](/docs/components/presentation/#tabs) for examples.

## Line links and stable IDs {#line-links}

To link to "line 4" from your text, give the fence an `id` and set
`anchorLineNos=true`. Each line number then becomes a link to `#<id>-<line>`:

````markdown {title="Source"}
```sql {id="ex-explain" title="explain.sql" lineNos="table" anchorLineNos=true}
EXPLAIN (ANALYZE, BUFFERS)
SELECT relname, n_live_tup
FROM pg_stat_user_tables
WHERE n_live_tup > 1000
ORDER BY n_live_tup DESC;
```

Jump to [line 4](#ex-explain-4).
````

```sql {id="ex-explain" title="explain.sql" lineNos="table" anchorLineNos=true}
EXPLAIN (ANALYZE, BUFFERS)
SELECT relname, n_live_tup
FROM pg_stat_user_tables
WHERE n_live_tup > 1000
ORDER BY n_live_tup DESC;
```

Jump to [line 4](#ex-explain-4).

Write the `id` yourself whenever you plan to share a link. Without one, the
theme generates an ID that is unique on the page but depends on the fence's
position, so adding a fence above it changes the ID and breaks old links. An
`id` must not contain spaces or control characters, and must not repeat
another ID on the page; an invalid or duplicate `id` warns and is replaced by
a generated one.

## Numbered examples {#numbered}

In a book or a long manual, `num` and `caption` turn a fence into a numbered
example that [`xref`](/docs/write/book/#xref) can refer to and that appears in
the book's list of examples. You write the number yourself; the theme never
counts. The anchor defaults to `eg-<num>`.

````markdown {title="Source"}
```sql {num="4-1" caption="Bloat ratio per table" #eg-bloat}
SELECT schemaname, relname, n_dead_tup, n_live_tup
FROM pg_stat_user_tables
WHERE n_dead_tup > n_live_tup * 0.2;
```

See {{</* xref eg="4-1" anchor="eg-bloat" */>}}.
````

```sql {num="4-1" caption="Bloat ratio per table" #eg-bloat}
SELECT schemaname, relname, n_dead_tup, n_live_tup
FROM pg_stat_user_tables
WHERE n_dead_tup > n_live_tup * 0.2;
```

See {{< xref eg="4-1" anchor="eg-bloat" />}}.

`num` and `caption` go together: a caption without a number, or a number
without a caption, warns and is dropped. A numbered example cannot also be a
tab, so `num` with `tab` warns and ignores `tab`. Numbering for figures, tables
and equations is covered in [Publishing books](/docs/write/book/).

## A set of fences as tabs {#tabs}

Consecutive fences that each have a `tab` attribute become one tab set, which
suits the same command for different package managers. A `group` on the first
fence lets readers share a link to a tab, keeps groups with the same name in
sync, and remembers the reader's choice.

````markdown {title="Source"}
```bash {tab="Homebrew" group="oink-install" value="brew"}
brew install hugo
```
```bash {tab="APT" value="apt"}
sudo apt install hugo
```
````

```bash {tab="Homebrew" group="oink-install" value="brew"}
brew install hugo
```
```bash {tab="APT" value="apt"}
sudo apt install hugo
```

[Tabs](/docs/components/tabs/) has the group syntax, URL hashes,
synchronization and tabs that hold prose.

## Common errors {#pitfalls}

- **A shortcode inside a fence still runs.** A fence does not stop Hugo from
  parsing shortcodes, so writing `{{</* tabs */>}}` in a code block executes
  it. To show a shortcode as text, put a comment marker inside each delimiter:
  <code>&#123;&#123;&lt;/&#42; tabs &#42;/&gt;&#125;&#125;</code>, or
  <code>&#123;&#123;%/&#42; steps &#42;/%&#125;&#125;</code> for the percent
  form. Every shortcode shown on this page is written that way.
- **Fences inside fences** need a longer outer fence: four backticks outside,
  three inside, as in every "Source" block on this page. Add another backtick
  when the inner block contains fences of its own.
- **Attributes go on the opening line**, after the language. Tables and
  images take their attribute line below the block, fences do not; a `{…}`
  line under a fence shows up as text.
- **Fences in list items** must be indented to the item's text (three spaces
  after `1.`), or the fence ends the list.

## Output {#outputs}

The copy and fold buttons appear only once the page script is running, and a
page with no copy or fold control does not load that script at all. Print
shows every block in full, without buttons and with its title bar, and long
blocks may break across pages. The page's Markdown output keeps each fence as
written, attributes included.

## Parameter reference {#reference}

OINK's attributes, inside the `{…}` after the language on the opening line:

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | non-empty string | none | The visible title bar (usually a filename) and the accessible name |
| `filename` | non-empty string | none | Alias of `title`; both together warn and use `filename` |
| `copy` | `all` `command` `true` `false` | `command` for session lexers, `all` otherwise | `true` is `all`; `command` is allowed only on `console`/`shell-session` |
| `wrap` | boolean | `false` | Visual wrapping, source unchanged; mutually exclusive with table line numbers |
| `collapse` | positive integer | none | Lines shown initially; ignored when the block is shorter |
| `label` | non-empty string | derived from the title | Accessible name, not displayed; mutually exclusive with `aria-label` |
| `id` | non-empty token | generated | Stable block ID and line-anchor prefix; no whitespace |
| `tab` | non-empty string | none | Tab label, see [Tabs](/docs/components/tabs/); mutually exclusive with `num` |
| `group` | `^[a-z][a-z0-9_-]*$` | none | On the first fence of a set; enables hash / sync / persistence; requires `tab` |
| `value` | `^[a-z0-9][a-z0-9_-]*$` | none | Required on every fence of a group, forbidden without one; requires `tab` |
| `num` | `[0-9A-Za-z.-]+` | none | Numbered example (Book `eg`); must appear with `caption` |
| `caption` | plain text | none | The numbered example's caption; must appear with `num` |
| `class` | class list | none | Appended to the `.td-code` root element; `td-code-command` makes a [command strip](#presentation) |
| `data-*` / `aria-*` / `role` | string | none | Passed through to the root element |
{.fields meta="type default"}

`title`, `filename` and `label` already give the block an accessible name and
`role="group"`, so `aria-label`, `aria-labelledby` or `role` next to any of
them warns and is ignored; those three pass through only on a block with
neither a title nor a `label`. Unknown, unsafe and theme-reserved attributes
warn and are ignored, and the warning lists the allowed names.

The same line also takes Chroma's options, which the theme hands to Hugo
unchanged:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `lineNos` | `false` `inline` `table` | `false` | Line-number style; `table` is mutually exclusive with `wrap=true` |
| `lineNoStart` | positive integer | `1` | First displayed number; does not affect how `hl_lines` counts |
| `hl_lines` | lines and ranges | none | For example `"2 4-5"`, counted over the source lines in the fence |
| `anchorLineNos` | boolean | `false` | Line numbers become anchor links prefixed with the block's `id` |
| `tabWidth` | positive integer | Hugo's default | Spaces a tab expands to |
{.fields meta="type default"}

## Limits {#limits}

- Chroma is the only highlighter. There is no Shiki, Twoslash, in-browser
  highlighting or runnable playground; for patches, use a `diff` fence.
- `copy="command"` works only with the `console` and `shell-session` lexers;
  anywhere else it warns and copies everything.
- A generated ID is not a permanent link. Write `id` for any line or block you
  link to from elsewhere.
- `mermaid`, `math`, `chem`, `markmap`, `plantuml`, `echarts`, `infographic`,
  `checksums`, `filetree` and `gallery` fences are not code blocks. Each
  renders as its own component, without the code frame or copy button.

## Related {#related}

- [Tabs](/docs/components/tabs/) — the full rules for assembling adjacent fences
- [Include](/docs/components/include/) — pull a real file from the repository in as a code block
- [Publishing books](/docs/write/book/) — numbered examples, cross references, the list of examples
- [Print](/docs/customize/print/) — what long code looks like on paper
