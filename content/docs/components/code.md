---
title: Code Blocks
linkTitle: Code Blocks
description: Use a Markdown fence and attributes for titles, exact copying, line numbers, highlighting, wrapping, folding, and line links.
weight: 30
search_keywords: [Code Block, fence, copy, lineNos, hl-lines, collapse, wrap, Chroma, syntax highlighting]
aliases:
  - /docs/components/code-blocks/
---

A code block uses an ordinary Markdown fence. Hugo's embedded Chroma highlighter runs at build time. The browser has no highlighter.
Use code blocks for commands, configuration snippets, and source code.
The `{…}` attributes on the fence's info line control the title bar, copy behavior, line numbers, and line anchors.
Diagram fences such as `mermaid`, `echarts`, and `filetree` use their own render hooks.

## Shortest form {#minimal}

````markdown {title="Source"}
```sql
SELECT datname, numbackends FROM pg_stat_database ORDER BY numbackends DESC;
```
````

```sql
SELECT datname, numbackends FROM pg_stat_database ORDER BY numbackends DESC;
```

A fence without attributes still has the complete shell and a copy button. Without a title, there is no empty title bar.
The copy button appears at the top right on hover or when focus enters the block. It is always visible on touch devices.
The shell does not display the language. It stores the lexer name in `data-language` for stylesheets and tests.

The language tag is Chroma's lexer name. A `diff` fence displays a patch with Chroma's styles for added and removed lines.
It needs no additional component:

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

`title` adds a visible title bar, usually containing a filename or path. It also sets the block's accessible name.

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

`filename` is a historical alias for `title`. If you provide both, the theme warns and uses `filename`.
Review the warning and rendered fallback before publication.

## Line numbers, start line and highlighting {#line-numbers}

`lineNos` accepts `inline` or `table`. Inline numbers share the code column.
Table numbers have a separate column, can be selected separately, and are never copied.
`lineNoStart` sets the first displayed number. `hl_lines` marks source lines for emphasis.
It counts from 1 inside the fence, independently of `lineNoStart`.

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

`lineNos="table"` puts numbers in a separate column. The copy button removes line numbers in both modes:

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

`tabWidth` sets the number of spaces per tab. The theme passes it and `style` directly to Chroma.
This site uses class-based Chroma palettes for light and dark modes.
Here, `style` takes effect only if Hugo is changed to inline style mode.

## Wrapping long lines {#wrap}

`wrap=true` changes only the display. It preserves the source and copied text. Without it, long lines scroll horizontally.

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

`wrap=true` cannot be combined with table line numbers. Wrapping misaligns the separate number and code cells.
If you provide both, the theme warns and disables wrapping. It suggests `lineNos="inline"` or removing wrapping.
Review the warning and rendered fallback before publication.

## Folding long code {#collapse}

`collapse=N` initially shows N lines, with a "show all N lines" button below them.
The server emits complete code. After measuring line N, the browser clips the visual display.
The complete code remains available without JavaScript, in screen readers, and in print.

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

If the block is no longer than `collapse`, no button appears. Wrapping and folding can be combined.
Folding measures the bottom of the Nth source-line node, so it never cuts a wrapped line in half.

## What gets copied {#copy}

By default, the copy button copies the complete source. For `console` and `shell-session` lexers, it copies only commands.
It keeps prompted lines but removes prompts and output lines. The example below copies two commands, without `$` or output.

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

To include prompts and output, use `copy="all"`.
On ordinary lexers such as `bash` or `sh`, `copy="command"` warns and uses `copy="all"`.
Those lexers cannot distinguish prompts, commands, and output. Review the warning and rendered fallback before publication.
For multiline commands, put a continuation prompt, usually `>`, on each continuation line. Otherwise, those lines are treated as output and excluded.

If a session-lexer block has no prompt, copying fails. The icon shows an error, and an error is logged to the console.
The clipboard stays unchanged. The button never falls back to copying everything.

`copy=false` removes a block's copy button. Use it for counter-examples that readers should not paste:

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

To disable copying by default, use `params.ui.code_copy: false`. An explicit `copy` fence attribute overrides the default.
See [Configuration](/docs/customize/config/).
The copy button uses only an icon. Success or failure changes the icon and announces a localized status.
Copied text keeps indentation, blank lines, and Unicode. It removes line numbers and ends with exactly one newline.

## Line links and stable IDs {#line-links}

To link "see line 3", give the fence an explicit `id`, then enable `anchorLineNos=true`.
Line numbers become links of the form `#<id>-<line>`.

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

Without an `id`, the theme generates an ID that is unique on the page. It depends on the fence's position.
Adding another fence above it changes the ID. Only an author-provided `id` is a permanent link.
IDs must contain no whitespace or control characters. They must not duplicate viewport, tab, panel, title, or line-anchor IDs on the page.
Invalid or duplicate IDs warn. Review the warning and rendered fallback before publication.

## Numbered examples {#numbered}

For books or long manuals, use `num` and `caption` to create a numbered Book "example" target.
`xref` can reference the target, which also appears in the book-wide list of examples.
The author provides the number. The theme never counts examples. `id` defaults to `eg-<num>`.

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

`num` and `caption` must appear together. A caption without a number is ignored. A number without a caption is removed with a warning.
Review the warning and rendered fallback before publication. `num` cannot be combined with the tab attribute `tab`.
For figure, table, and equation numbering and indexing, see [publishing books](/docs/write/book/).

## A set of fences as tabs {#tabs}

The browser combines consecutive fences with `tab` into a tab set.
Add `group` to the first fence to enable shared links, synchronization, and saved selections.

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

See [Tabs](/docs/components/tabs/) for group syntax, URL hashes, synchronization across groups, and tabs in prose.

## Common errors {#pitfalls}

- Showing a shortcode in the docs: a fence does not stop Hugo from parsing, so a
  `{{</* tabs */>}}` written inside a code block still executes. To display it
  verbatim, add a comment marker inside each delimiter —
  <code>&#123;&#123;&lt;/&#42; tabs &#42;/&gt;&#125;&#125;</code>, and
  <code>&#123;&#123;%/&#42; steps &#42;/%&#125;&#125;</code> for the percent
  form. Every shortcode shown on this page is written that way.
- Fences inside fences: four backticks outside, three inside — every "Source"
  block on this page does it. Add another backtick when the inner block has
  fences of its own.
- Attributes go on the info line: a fence's attributes follow the language on
  the opening line. Only tables and images take their attributes on the line
  below. Put them on the next line and you get a visible line of braces.
- Unknown, unsafe, and theme-reserved attributes warn and are ignored in
  ordinary preview; the message lists the allowed names. Review the warning and rendered fallback before publication.
- Fences in list items: indent them to line up with the item's content (three
  spaces after `1.`), or the fence leaves the list.

## Output {#outputs}

| Output | Shape |
| --- | --- |
| HTML | A `<div class="td-code">` shell around Chroma's `.highlight`/`.chroma`; copy and fold buttons ship `hidden` and appear once the script confirms it can run |
| Print | Complete code; copy, fold and the fade are removed; long blocks may break across pages; the title bar stays |
| Markdown | The source fence, `{…}` attributes and all, emitted as written |
| RSS | A static code block with no buttons |

A page with no copy or fold control never loads `code-block.js`; print, Markdown
and RSS never load it.

## Parameter reference {#reference}

Inside the `{…}` after the language on the opening line, OINK's own attributes:

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | non-empty string | none | The visible title bar (usually a filename) and the accessible name |
| `filename` | non-empty string | none | Historical alias of `title`; both together warn and use `filename` |
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
| `class` | class list | none | Appended to the `.td-code` root element |
| `data-*` / `aria-*` / `role` | string | none | Passed through to the root element |
{.fields meta="type default"}

`title`, `filename`, and `label` give the block an accessible name and `role="group"`.
If you also provide `aria-label`, `aria-labelledby`, or `role`, the theme warns and ignores the conflicting attribute.
Review the warning and rendered fallback before publication. These three attributes pass through only if the block has neither a title nor `label`.

The same line accepts Chroma options. The theme passes them to Hugo unchanged:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `lineNos` | `false` `inline` `table` | `false` | Line-number style; `table` is mutually exclusive with `wrap=true` |
| `lineNoStart` | positive integer | `1` | First displayed number; does not affect how `hl_lines` counts |
| `hl_lines` | lines and ranges | none | For example `"2 4-5"`, counted over the source lines in the fence |
| `anchorLineNos` | boolean | `false` | Line numbers become anchor links prefixed with the block's `id` |
| `tabWidth` | positive integer | Hugo's default | Spaces a tab expands to |
{.fields meta="type default"}

## Limits {#limits}

- The highlighter cannot be replaced. There is no Shiki, Twoslash, browser highlighting, or runnable playground.
  For patches, use a `diff` fence. Chroma's `.gi`/`.gd` style added and removed lines.
- `copy="command"` supports only session lexers. Other languages warn and copy everything. Review the warning and rendered fallback before publication.
- Generated IDs are not permanent links. Write `id` for a link that you plan to share.
- `mermaid`, `math`, `chem`, `markmap`, `plantuml`, `echarts`, `infographic`, `checksums`, `filetree`, and `gallery` are not code blocks.
  Each has its own render hook, without a code shell or copy button.

## Related {#related}

- [Tabs](/docs/components/tabs/) — the full rules for assembling adjacent fences
- [Include](/docs/components/include/) — pull a real file from the repository in as a code block
- [Publishing books](/docs/write/book/) — numbered examples, cross references, the list of examples
- [Print](/docs/customize/print/) — what long code looks like on paper
