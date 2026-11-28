---
title: Structure a page with Markdown components
linkTitle: Components
description: Turn the Quick start into a page readers can follow with callouts, steps, tabs, titled code, field lists, file trees and cards, all written as Markdown that still reads well on GitHub.
book_kind: chapter
book_number: 4
weight: 40
aliases:
  - /book/03-compose/
---

A reader scanning a technical page looks for a few shapes: the warning they
must not miss, the steps in order, the command for their platform, the setting
they came to look up. OINK draws each shape from plain Markdown plus at most
one attribute line, so the same source still reads as a quote, a list or a
table on GitHub, in print and to an AI assistant. This chapter adds those
shapes to the Acme DB pages one at a time; each source below is followed by
what it renders.

## The pattern {#pattern}

Pick the component by what the reader is doing, not by how it looks:

| The reader needs | Component | You write |
| --- | --- | --- |
| A condition they must not miss | Callout | A blockquote starting with `[!IMPORTANT]` or another type |
| A procedure in order | Steps | An ordered list with `{.steps}` under it |
| One choice among equivalents | Tabs | Adjacent code fences, each with `{tab="…"}` |
| A file or command to copy | Titled code | A fence with `{title="…"}` |
| Settings to look up | Field list | A table with `{.fields}` under it |
| A directory layout | File tree | A `filetree` fence |
| Where to go next | Cards | A link list with `{.cards}` under it |
| A key to press, a status | Keys, badges | The `kbd` and `badge` shortcodes |
{#tbl-component-choice num="4-1" caption="Choosing a component by what the reader is doing."}

Leave everything else as prose. A page where every paragraph sits in a box
reads as noise, and readers stop seeing the boxes.

## A condition readers cannot miss {#callout}

Acme DB refuses to start on a 32-bit host, and a reader who skips that line
loses ten minutes. Put it at the top of Quick start, under the lead paragraph:

```markdown {title="Source"}
> [!IMPORTANT]
> Acme DB needs a 64-bit Linux or macOS host with at least 2 GB of free memory.
```

> [!IMPORTANT]
> Acme DB needs a 64-bit Linux or macOS host with at least 2 GB of free memory.

Choose the type by what happens when the reader skips the box: `NOTE` and `TIP`
are safe to skip, `IMPORTANT` means the task fails without it, `WARNING` and
`CAUTION` mean something breaks or slows down, and `DANGER` marks what cannot
be undone. [Callouts](/docs/components/callout/) lists all ten types and the
collapsible `[!DETAILS]` form.

## A procedure in steps {#steps}

Under "Start the server", the reader does three things in order. An ordered
list with `{.steps}` on the line right after it draws them as a numbered
column, and each step can hold code:

````markdown {title="Source"}
1. Create the data directory.

   ```bash
   mkdir -p ./acme-data
   ```

1. Start the server in the foreground.

   ```bash
   acme server --data ./acme-data
   ```

1. In a second terminal, check that it answers.

   ```bash
   curl http://localhost:8086/health
   ```
{.steps}
````

1. Create the data directory.

   ```bash
   mkdir -p ./acme-data
   ```

1. Start the server in the foreground.

   ```bash
   acme server --data ./acme-data
   ```

1. In a second terminal, check that it answers.

   ```bash
   curl http://localhost:8086/health
   ```
{.steps}

Number every item `1.` and Markdown counts for you, so adding a step never
means renumbering. `{.steps}` must touch the last item: after a blank line it
no longer attaches to the list and shows on the page as text in braces.

## Choices as tabs {#tabs}

Some readers run the binary, others run a container. Two adjacent fences with a
`tab` attribute become one tab set, and readers see only the one that applies:

````markdown {title="Source"}
```bash {tab="Binary" group="runtime" value="binary"}
acme server --data ./acme-data
```
```bash {tab="Docker" value="docker"}
docker run -d -p 8086:8086 -v acme-data:/var/lib/acme acme/acme-db:3.0
```
````

```bash {tab="Binary" group="runtime" value="binary"}
acme server --data ./acme-data
```
```bash {tab="Docker" value="docker"}
docker run -d -p 8086:8086 -v acme-data:/var/lib/acme acme/acme-db:3.0
```

`group` ties every tab set of that name together: choose Docker here, and every
`runtime` set on the site switches with it, and the choice is remembered. The
URL hash `#runtime-docker` opens this page with Docker selected. On GitHub, in
print and without JavaScript, both blocks show one after the other, so nothing
is ever hidden.

## Code readers copy {#code}

Readers copy configuration into a file, so tell them which file and point at
the line that matters:

````markdown {title="Source"}
```toml {title="/etc/acme/acme.toml" hl_lines="3"}
[server]
listen = ":8086"
data_dir = "/var/lib/acme"

[retention]
default = "90d"
```
````

```toml {title="/etc/acme/acme.toml" hl_lines="3"}
[server]
listen = ":8086"
data_dir = "/var/lib/acme"

[retention]
default = "90d"
```

For a terminal session, use a `console` fence and write the prompt. The copy
button then copies only the commands, without the `$` and without the output:

````markdown {title="Source"}
```console
$ acme sql "SELECT host, usage FROM cpu LIMIT 1"
 host | usage
------+-------
 web1 |  0.64
$ acme sql "SELECT count(*) FROM cpu"
```
````

```console
$ acme sql "SELECT host, usage FROM cpu LIMIT 1"
 host | usage
------+-------
 web1 |  0.64
$ acme sql "SELECT count(*) FROM cpu"
```

[Code blocks](/docs/components/code/) covers line numbers, folding long files
with `collapse`, and links to single lines.

## Settings as a field list {#fields}

The Starter's `content/docs/reference/configuration.md` is where readers look a
key up. A table with `{.fields}` under it gives each key its own entry, with
its type and default as chips and the description at full width, which stays
readable on a phone where a four-column table would not:

```markdown {title="Source"}
| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `server.listen` | string | `":8086"` | Address and port for HTTP writes and queries |
| `server.data_dir` | string | `"./acme-data"` | Directory for data files and the write-ahead log |
| `retention.default` | duration | `"90d"` | How long points are kept when a table sets no retention of its own |
{.fields meta="type default"}
```

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `server.listen` | string | `":8086"` | Address and port for HTTP writes and queries |
| `server.data_dir` | string | `"./acme-data"` | Directory for data files and the write-ahead log |
| `retention.default` | duration | `"90d"` | How long points are kept when a table sets no retention of its own |
{.fields meta="type default"}

`meta` names the role of each middle column, so `type` and `default` render as
chips. Every entry gets its own anchor, and local search opens a key's entry
directly when a reader searches for its name.

## A directory layout {#filetree}

After the first write, readers want to know what the server put on disk and
what they may delete. A `filetree` fence says it one entry at a time:

````markdown {title="Source"}
```filetree {title="./acme-data after the first write"}
- acme-data/
  - wal/          # the write-ahead log, replayed after a crash
  - tables/
    - cpu/        # one directory per table
      - 2026-11/  # one partition per month
  - acme.lock     # held while the server runs
```
````

```filetree {title="./acme-data after the first write"}
- acme-data/
  - wal/          # the write-ahead log, replayed after a crash
  - tables/
    - cpu/        # one directory per table
      - 2026-11/  # one partition per month
  - acme.lock     # held while the server runs
```

Indentation sets the depth, a trailing `/` marks a directory, and text after
`#` becomes an aligned comment. Readers can fold the directories.

## Where to go next as cards {#cards}

End Quick start by sending readers onward. A link list with `{.cards}` under
it becomes a grid, and the text after the dash becomes each card's
description:

```markdown {title="Source"}
- [Back up a server](/docs/operations/backup/) — Snapshot a running server and restore it on another host.
- [Configuration](/docs/reference/configuration/) — Every key in acme.toml, with its type and default.
{.cards}
```

Here is the same pattern pointing at the next chapters of this book:

- [Diagrams and media](/book/05-media/) — Draw the architecture, chart a benchmark, play a terminal recording.
- [Blog](/book/06-blog/) — Publish release notes and articles with authors and series.
- [Book](/book/07-book/) — Number figures and tables, cross-reference them, print the whole book.
{.cards}

## When Markdown runs out {#shortcodes}

A key to press and a status label have no Markdown syntax, so they are
shortcodes:

```markdown {title="Source"}
Stop the server with {{</* kbd "Ctrl" "C" */>}}. Tiered storage is
{{</* badge text="Experimental" tone="warning" */>}} in Acme DB 3.0.
```

Stop the server with {{< kbd "Ctrl" "C" >}}. Tiered storage is
{{< badge text="Experimental" tone="warning" >}} in Acme DB 3.0.

OINK has 29 shortcodes, for cards with icons, multi-paragraph tabs, numbered
book figures and the like; [Components](/docs/components/) has a page for each.
Reach for one only when the Markdown form cannot say it, because shortcodes are
Hugo syntax and show up literally on GitHub.

## See how it degrades {#fallback}

Open Quick start and press {{< kbd "M" >}}, or append `index.md` to its
address. The Markdown copy keeps the callout as `> [!IMPORTANT]`, the steps as a
numbered list, the tabs as two fences and the field list as a table. The same
holds in the print view, where every tab panel is expanded. That is why the
components are Markdown first: a reader on GitHub, a printed page and an AI
assistant all get the whole content.

## Check your work {#checkpoint}

- Quick start opens with the IMPORTANT callout and shows its procedure as numbered steps with code inside.
- Choosing Docker in one `runtime` tab set switches every other set on the site.
- The configuration reference shows three entries with type and default chips, and searching for `retention.default` opens that entry.
- The page's Markdown copy contains no HTML from the components.

## Ask your agent {#agent}

```text {num="4-1" caption="Prompt: restructure a page with components." #eg-agent-components}
Rework content/docs/get-started/quick-start.md with OINK's Markdown components:
an IMPORTANT callout for the hardware requirement, {.steps} for the start-up
procedure, tabs grouped as "runtime" for the binary and Docker commands, and
cards at the end pointing to the backup and configuration pages. Turn the
configuration reference into a {.fields} table with type and default columns.
Use the component pages under https://oink.pgsty.com/docs/components/ for
syntax. Keep all prose and commands unchanged, apply the same changes to the
Chinese peer, and check both pages and their Markdown copies in the browser.
```
