---
title: Tables
linkTitle: Tables
description: Turn an ordinary Markdown table into a captioned table, a compatibility matrix, a field list, a numbered book table or a tab set, and give wide technical tables room to read.
weight: 140
search_keywords: [Table, matrix, full-width, wide, technical tables, caption, numbered table, horizontal scroll, GFM]
aliases:
  - /docs/components/tables/
---

Tables are ordinary GFM pipe tables, so they read the same on GitHub and in any
editor. OINK adds what long technical tables need: a wide table scrolls inside
its own box instead of stretching the page, and one attribute line under the
table turns it into a captioned table, a support matrix, a field list, a
numbered book table or one panel of a tab set.

GFM has no merged cells, sorting or filtering, and OINK does not add them. Data
that needs merged headers usually reads better as two tables or a matrix, and a
cell that needs paragraphs or a list belongs in a [field list](/docs/components/fields/).

## Shortest form {#minimal}

A table without an attribute line renders as an ordinary table. The delimiter
row sets each column's alignment, and header cells become `th scope="col"`.

```markdown {title="Source"}
| Component | Port | Purpose |
| --- | :---: | --- |
| PostgreSQL | 5432 | Database |
| Pgbouncer | 6432 | Connection pool |
| Patroni | 8008 | High-availability orchestration |
```

| Component | Port | Purpose |
| --- | :---: | --- |
| PostgreSQL | 5432 | Database |
| Pgbouncer | 6432 | Connection pool |
| Patroni | 8008 | High-availability orchestration |

## Wide tables scroll themselves {#scroll}

A table wider than the reading column scrolls sideways inside its own region,
so the rest of the page keeps its width on a phone. Keyboard users reach the
region with Tab and scroll it with the arrow keys; screen readers announce it as
"Scrollable table" in the page's language.

```markdown {title="Source"}
| Cluster | Role | Version | State | Lag | Connections | Size | Backup |
| --- | --- | --- | --- | --- | --- | --- | --- |
| pg-meta | primary | 18.1 | running | — | 42 | 12 GB | 2026-08-17 |
| pg-test | replica | 18.1 | streaming | 12 ms | 8 | 12 GB | 2026-08-17 |
```

| Cluster | Role | Version | State | Lag | Connections | Size | Backup |
| --- | --- | --- | --- | --- | --- | --- | --- |
| pg-meta | primary | 18.1 | running | — | 42 | 12 GB | 2026-08-17 |
| pg-test | replica | 18.1 | streaming | 12 ms | 8 | 12 GB | 2026-08-17 |
{.wide .expand}

## Captions {#caption}

`{caption="…"}` adds a visible `<caption>` in plain text. It does not number
the table; for "Table 9-1" use [`num`](#numbered).

```markdown {title="Source"}
| Setting | Value |
| --- | --- |
| Port | 5432 |
| Data directory | `/var/lib/pgsql/18/data` |
| License | PostgreSQL License |
{caption="PostgreSQL defaults on a fresh EL 9 node"}
```

| Setting | Value |
| --- | --- |
| Port | 5432 |
| Data directory | `/var/lib/pgsql/18/data` |
| License | PostgreSQL License |
{caption="PostgreSQL defaults on a fresh EL 9 node"}

## Compatibility matrices {#matrix}

`{.matrix}` is for "what supports what" grids. The first column becomes a row
header (`th scope="row"`), and the header row and first column stay pinned while
the reader scrolls in either direction, so a cell deep in a large matrix still
shows its row and column. Cells are centered unless the delimiter row sets
another alignment. The ✅ and ❌ are ordinary characters you type; the theme
gives them no meaning.

```markdown {title="Source"}
| OS / PG | PG18 | PG17 | PG16 | PG15 | PG14 |
| --- | :---: | :---: | :---: | :---: | :---: |
| EL 9 | ✅ | ✅ | ✅ | ✅ | ✅ |
| EL 8 | ✅ | ✅ | ✅ | ✅ | ✅ |
| Debian 13 | ✅ | ✅ | ✅ | ❌ | ❌ |
| Ubuntu 24.04 | ✅ | ✅ | ✅ | ✅ | ❌ |
{.matrix}
```

| OS / PG | PG18 | PG17 | PG16 | PG15 | PG14 |
| --- | :---: | :---: | :---: | :---: | :---: |
| EL 9 | ✅ | ✅ | ✅ | ✅ | ✅ |
| EL 8 | ✅ | ✅ | ✅ | ✅ | ✅ |
| Debian 13 | ✅ | ✅ | ✅ | ❌ | ❌ |
| Ubuntu 24.04 | ✅ | ✅ | ✅ | ✅ | ❌ |
{.matrix .wide .expand}

## Using the whole canvas {#full-width}

`{.full-width}` lets the table leave the reading column and take the article's
full width. Use it for many short columns that would otherwise scroll.

```markdown {title="Source"}
| Language | Code | Sidebar | Search | TOC | Print | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 简体中文 | `zh` | ✅ | ✅ | ✅ | ✅ | Reviewed |
| English | `en` | ✅ | ✅ | ✅ | ✅ | Reviewed |
{.full-width}
```

| Language | Code | Sidebar | Search | TOC | Print | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 简体中文 | `zh` | ✅ | ✅ | ✅ | ✅ | Reviewed |
| English | `en` | ✅ | ✅ | ✅ | ✅ | Reviewed |
{.full-width .wide .expand}

## Technical wide tables {#wide}

Squeezed into the reading column, a table of configuration keys or environment
variables breaks identifiers in odd places and grows very tall rows. `.wide`
lets the table take its natural width (`width: max-content`) and scroll
sideways when that is wider than the page. Cells break only between words
(`overflow-wrap: break-word`, `word-break: normal`), and body cells have a soft
`max-width: 40ch`, so a long description wraps into a readable column instead
of one enormous line. A very long token can still wrap; the bound is not a
fixed column width.

```markdown {title="Source"}
| Variable | Required | Default | Configuration key | Description |
| --- | --- | --- | --- | --- |
| `HG_PD_GRPC_HOST` | Yes | None | `grpc.host` | Advertised gRPC hostname/IP; use container hostnames within a container network. |
| `HG_PD_INITIAL_STORE_COUNT` | No | `1` | `pd.initial-store-count` | Minimum Store count needed for cluster availability. |
| `HG_PD_ACTUATOR_EXPOSURE` | No | `health,metrics,prometheus` | `management.endpoints.web.exposure.include` | Public Actuator endpoint allowlist; `*` is forbidden. |
{.wide .expand}
```

| Variable | Required | Default | Configuration key | Description |
| --- | --- | --- | --- | --- |
| `HG_PD_GRPC_HOST` | Yes | None | `grpc.host` | Advertised gRPC hostname/IP; use container hostnames within a container network. |
| `HG_PD_INITIAL_STORE_COUNT` | No | `1` | `pd.initial-store-count` | Minimum Store count needed for cluster availability. |
| `HG_PD_ACTUATOR_EXPOSURE` | No | `health,metrics,prometheus` | `management.endpoints.web.exposure.include` | Public Actuator endpoint allowlist; `*` is forbidden. |
{.wide .expand}

`.wide` and `.full-width` solve different problems and combine as
`{.full-width .wide}`. `.full-width` widens the box the table sits in, which
suits many short columns; `.wide` changes how the table inside sizes its
columns, which suits long identifiers. `.wide` applies on screen only: print
and RSS keep the ordinary layout, and it has no effect on `.fields`. The older
`.td-table--wide` class still works as a synonym.

## Expand selected tables {#expand}

`.expand` puts a small expand icon at the table's top-right corner. It appears
on hover or keyboard focus on desktop and stays visible on touch screens. One
click opens the table in a dialog that fills the window, with the same
text size, links and text selection; Close or Escape puts it back at the same
reading position. On a narrow screen a wide table still scrolls sideways
inside the dialog. Most examples on this page carry `.expand`, so you can try
it on them.

```markdown {title="Source"}
| Package | Version | Role |
| --- | --- | --- |
| `pgvector` | `0.8.1` | Vector similarity search |
| `pg_stat_statements` | `1.11` | Statement statistics |
{.wide .expand}
```

| Package | Version | Role |
| --- | --- | --- |
| `pgvector` | `0.8.1` | Vector similarity search |
| `pg_stat_statements` | `1.11` | Statement statistics |
{.wide .expand caption="Example extension packages"}

Add it only to the few tables that need more room: there is no size threshold
and no site-wide switch, because an icon on every table is noise. `.expand`
works alone or with `.wide`, `.full-width`, `.matrix`, a caption, a number or
a tab. Several classes can be written either way, `{.wide .expand}` or
`{class="wide expand"}`.

Only pages with an `.expand` table load the small reader script. Without
JavaScript or native `<dialog>` support, the reader sees the complete table
inline and no dead button. Printing first returns an open table to the article.
A table whose `headers`, `aria-labelledby` or `aria-describedby` points at
something outside the table stays inline, because the dialog would cut those
references. If your site CSS styles tables through an article ancestor, check
how such a table looks inside the dialog.

## Field lists {#fields}

`{.fields}` renders the table as a definition list: the first column is the
name, the last is the description, and the columns between are metadata. It is
the form for configuration keys, command flags and API fields. See
[Fields](/docs/components/fields/) for everything it can do.

```markdown {title="Source"}
| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `offline_search` | boolean | `false` | Build the local search index |
| `page_width` | string | `normal` | Width of the reading column |
{.fields meta="type default"}
```

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `offline_search` | boolean | `false` | Build the local search index |
| `page_width` | string | `normal` | Width of the reading column |
{.fields meta="type default"}

## Numbered tables {#numbered}

Books and long manuals refer to tables by number. Add `num`, with an optional
`#id` and `caption`: the table is wrapped in a `<figure>` labeled "Table N." in
the page's language, `xref` can link to it, and it appears in the book's list
of tables. You choose the numbers; the theme does not count. The `id` defaults
to `tbl-<num>`.

```markdown {title="Source"}
| Isolation level | Dirty read | Non-repeatable read | Phantom read |
| --- | --- | --- | --- |
| Read committed | no | yes | yes |
| Repeatable read | no | no | yes |
| Serializable | no | no | no |
{#tbl-iso num="9-1" caption="Anomalies each PostgreSQL isolation level permits"}

See {{</* xref tbl="9-1" anchor="tbl-iso" */>}}.
```

| Isolation level | Dirty read | Non-repeatable read | Phantom read |
| --- | --- | --- | --- |
| Read committed | no | yes | yes |
| Repeatable read | no | no | yes |
| Serializable | no | no | no |
{#tbl-iso num="9-1" caption="Anomalies each PostgreSQL isolation level permits"}

See {{< xref tbl="9-1" anchor="tbl-iso" />}}.

## Tables as tabs {#tabs}

Adjacent tables with `{tab="…"}` become one tab set, by the same rules as
adjacent code fences. A `group` on the first table adds a shareable URL hash,
syncing and a remembered choice, and then every table needs a `value`. See
[Tabs](/docs/components/tabs/) for the full rules. Even two short columns fill the panel. A wide table scrolls within it.

```markdown {title="Source"}
| Directory | Contents |
| --- | --- |
| `content/` | Pages |
| `data/` | Landing and release data |
{tab="Content" group="repo-layout" value="content"}

| Directory | Contents |
| --- | --- |
| `assets/` | CSS and image resources |
| `static/` | Files copied verbatim |
{tab="Assets" value="assets"}
```

| Directory | Contents |
| --- | --- |
| `content/` | Pages |
| `data/` | Landing and release data |
{tab="Content" group="repo-layout" value="content"}

| Directory | Contents |
| --- | --- |
| `assets/` | CSS and image resources |
| `static/` | Files copied verbatim |
{tab="Assets" value="assets"}

## Output {#outputs}

In HTML each table sits in a focusable `<div class="td-table-scroll">`;
`.matrix` and `.full-width` add modifier classes to that wrapper, while your
own classes stay on the `<table>`. Ordinary tables load no script. Print and
RSS show the complete static table, with no reader and no tab bar, and the
Markdown output keeps the table and its attribute line as written.

## Parameter reference {#reference}

The attribute line on the row below the table:

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `.full-width` | marker | none | Leaves the reading column and uses the article's full width |
| `.wide` | marker | none | Sizes the inner table to `max-content`; for long technical identifiers |
| `.expand` | marker | none | Adds a corner action that opens the table in a larger dialog |
| `.matrix` | marker | none | First column becomes a row header; header row and first column are pinned; other cells are centered |
| `.fields` | marker | none | Renders a definition list; see [Fields](/docs/components/fields/) |
| `caption` | plain text | none | Visible table caption; on `.fields` it labels the list |
| `meta` | role list | none | Meaning of the middle `.fields` columns: `type` `required` `default` `-`; requires `.fields` |
| `#id` | identifier | `tbl-<num>` when `num` is set | `[A-Za-z][A-Za-z0-9_.:-]*`; lands on the `<table>`, or on the `<figure>` of a numbered table |
| `num` | string | none | `[0-9A-Za-z.-]+`; registers a Book table target and prefixes the caption with "Table N." |
| `tab` / `group` / `value` | see [Tabs](/docs/components/tabs/) | none | Adjacent tables become a tab set |
| `class` | class list | none | Kept on the `<table>` for site CSS |
| `data-*` / `aria-*` | string | none | Passed through |
{.fields meta="type default"}

Any other key, `style` included, is dropped with a build warning. Hugo strips
`on*` handlers before the theme sees them, so they are dropped silently.

## Limits {#limits}

- Some attributes exclude each other. `.fields` wins over `.matrix`,
  `.full-width`, `.expand` and `num`, and `num` wins over `tab`; the loser is
  dropped with a warning. `group` and `value` need `tab`, and `meta` needs
  `.fields`.
- The attribute line must touch the last row: after a blank line Goldmark
  drops it without a warning and the table renders plain. Without
  `markup.goldmark.parser.attribute.block: true`, one of the
  [site prerequisites](/docs/components/#prerequisites), the braces show up
  as text. Formatters such as Prettier move the line; wrap the table in
  `<!-- prettier-ignore-start -->` and `<!-- prettier-ignore-end -->`.
- No merged cells, sorting or filtering. Split a table with merged headers
  into two tables, or make it a matrix.
- Cells hold inline content only. For several paragraphs, a list or a code
  block, use the `fields`/`field` shortcodes.
- `.matrix` centers cells with CSS, so an alignment written in the delimiter
  row wins.

## Related {#related}

- [Fields](/docs/components/fields/) — everything `{.fields}` can do
- [Tabs](/docs/components/tabs/) — adjacent tables as a tab set
- [Publishing books](/docs/write/book/) — numbered tables, cross references, the list of tables
- [Code blocks](/docs/components/code/) — where attributes go on the info line instead of the next line
