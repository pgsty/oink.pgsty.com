---
title: Tables
linkTitle: Tables
description: A plain GFM table plus one attribute line becomes a captioned table, a compatibility matrix, a field list, a numbered table or a tab set; wide tables scroll on their own.
weight: 50
search_keywords: [Table, matrix, full-width, td-table--wide, technical tables, caption, numbered table, horizontal scroll, GFM]
aliases:
  - /docs/components/tables/
---

A table is an ordinary GFM pipe table. The theme's table render hook wraps every
one in a horizontally scrollable region, and the `{…}` attribute line underneath
decides which kind of table it is: captioned, a compatibility matrix, a field
list, a numbered table, or a tab set. Merged cells, sorting and filtering are
out of scope; when you need them, change how the data is presented.

## Shortest form {#minimal}

Without an attribute line it is just a table. Alignment still comes from the
delimiter row, and header cells are `th scope="col"`.

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

A table with too many columns never widens the page; it scrolls inside its own
region. That region is focusable: Tab into it and the arrow keys scroll, and its
accessible name is the localized "Scrollable table".

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

## Captions {#caption}

`{caption="…"}` adds a visible `<caption>`. It is plain text and it does not
number the table.

```markdown {title="Source"}
| Item | Value |
| --- | --- |
| Theme version | v0.8.1 |
| Hugo floor | 0.166.0 Extended |
| Licence | Apache-2.0 |
{caption="Theme facts this site currently builds against"}
```

| Item | Value |
| --- | --- |
| Theme version | v0.8.1 |
| Hugo floor | 0.166.0 Extended |
| Licence | Apache-2.0 |
{caption="Theme facts this site currently builds against"}

## Compatibility matrices {#matrix}

`{.matrix}` is for "row × column = supported or not" tables: the first column
becomes a row header (`th scope="row"`), the header row and the first column
stay pinned while scrolling, and the remaining cells are centred unless the
delimiter row says otherwise. ✅ and ❌ are characters the author writes; the
theme does not interpret them.

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
{.matrix}

## Using the whole canvas {#full-width}

`{.full-width}` lets a table exceed the reading column and take the full width
the article has. It suits tables with many short columns.

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
{.full-width}

## Technical wide tables {#wide}

Technical tables containing long configuration keys, environment variables, or
identifiers can produce awkward token breaks and very tall rows when forced into
the reading column. Adding `{.td-table--wide}` to the attribute line opts the
inner table into natural intrinsic sizing (`width: max-content`), scrolling
horizontally within its wrapper when it exceeds the available space. (Added in OINK 1.3.1.)

```markdown {title="Source"}
| Variable | Required | Default | Configuration key | Description |
| --- | --- | --- | --- | --- |
| `HG_PD_GRPC_HOST` | Yes | None | `grpc.host` | Advertised gRPC hostname/IP; use container hostnames within a container network. |
| `HG_PD_INITIAL_STORE_COUNT` | No | `1` | `pd.initial-store-count` | Minimum Store count needed for cluster availability. |
| `HG_PD_ACTUATOR_EXPOSURE` | No | `health,metrics,prometheus` | `management.endpoints.web.exposure.include` | Public Actuator endpoint allowlist; `*` is forbidden. |
{.td-table--wide}
```

| Variable | Required | Default | Configuration key | Description |
| --- | --- | --- | --- | --- |
| `HG_PD_GRPC_HOST` | Yes | None | `grpc.host` | Advertised gRPC hostname/IP; use container hostnames within a container network. |
| `HG_PD_INITIAL_STORE_COUNT` | No | `1` | `pd.initial-store-count` | Minimum Store count needed for cluster availability. |
| `HG_PD_ACTUATOR_EXPOSURE` | No | `health,metrics,prometheus` | `management.endpoints.web.exposure.include` | Public Actuator endpoint allowlist; `*` is forbidden. |
{.td-table--wide}

### Difference from .full-width {#wide-vs-full-width}

- `.full-width` controls the **outer canvas**: it expands the table container to
  break out of the reading column into the full width of the article layout.
  It suits tables with many short columns.
- `.td-table--wide` controls the **inner table sizing**: it sets the table to its
  natural intrinsic width (`width: max-content`), using horizontal scrolling to
  accommodate wide content. It suits tables with long technical identifiers.
- Both can be combined: `{.full-width .td-table--wide}` expands the container to
  the full canvas while allowing the inner table to keep its natural wide measure.

### Applicability boundaries {#wide-boundaries}

- **Explicit opt-in**: Ordinary tables keep their existing layout. Only tables
  marked `.td-table--wide` use `overflow-wrap: break-word`, `word-break: normal`,
  and a soft `max-width: 40ch` body-cell bound. Very long tokens may still wrap;
  the bound is not a fixed column width.
- **Static outputs**: This policy applies only on screen. Print and RSS use
  static wrappers and retain their existing layout; Markdown preserves the authored
  GFM table and attribute line. The marker has no effect on `.fields` definition lists.

## Field lists {#fields}

`{.fields}` turns a table into a definition list: the first column is the name,
the last is the description, and the columns in between are metadata. It is the
shape for configuration keys, command flags and API fields; the full syntax is
on the [Fields](/docs/components/fields/) page.

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

In a book or a long manual, number the tables: `num` plus an optional `#id` and
`caption`. The table is wrapped in a `<figure>` labelled with a localized
"Table N." and registered as a Book target, so `xref` can reference it and it
appears in the book-wide list of tables. The number is written by the author —
the theme never counts — and `id` defaults to `tbl-<num>`.

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

Adjacent tables carrying `{tab="…"}` form a tab set under the same rules as
adjacent fences: `group` on the first table enables hash, sync and persistence,
and every table after it needs `value`. The complete rules are on the
[Tabs](/docs/components/tabs/) page.

```markdown {title="Source"}
| Directory | Contents |
| --- | --- |
| `content/` | Pages |
| `data/` | Landing and release data |
{tab="Content" group="repo-layout" value="content"}

| Directory | Contents |
| --- | --- |
| `assets/` | SCSS and image resources |
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
| `assets/` | SCSS and image resources |
| `static/` | Files copied verbatim |
{tab="Assets" value="assets"}

## Output {#outputs}

| Output | Shape |
| --- | --- |
| HTML | A focusable `<div class="td-table-scroll">` around the `<table>`; matrix and full-width are modifier classes on that wrapper |
| Print | Complete static content with a keyboard-scrollable region in the browser preview; print-media CSS expands the region for paper output |
| Markdown | The source table and its attribute line, emitted as written |
| RSS | The complete static table |

Tables load no script.

## Parameter reference {#reference}

The attribute line on the row below the table:

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `.full-width` | marker | none | Exceed the reading column and use the article canvas |
| `.td-table--wide` | marker | none | Sizes the inner table to max-content; suits technical tables with long identifiers |
| `.matrix` | marker | none | First column as row header, header and first column pinned, other cells centred |
| `.fields` | marker | none | Render as a definition list, see [Fields](/docs/components/fields/) |
| `caption` | plain text | none | Visible table caption; on `.fields` it labels the list |
| `meta` | role list | none | Names the meaning of the middle `.fields` columns: `type` `required` `default` `-`; requires `.fields` |
| `#id` | identifier | `tbl-<num>` when `num` is set | `[A-Za-z][A-Za-z0-9_.:-]*`; lands on the `<table>`, or on the `<figure>` for a numbered table |
| `num` | string | none | `[0-9A-Za-z.-]+`; registers a Book table target and prefixes the caption with "Table N." |
| `tab` / `group` / `value` | see [Tabs](/docs/components/tabs/) | none | Adjacent tables become a tab set |
| `class` | class list | none | Left on the `<table>` for site CSS |
| `data-*` / `aria-*` | string | none | Passed through |
{.fields meta="type default"}

`style`, `on*`, and other keys warn and are ignored; strict publishing rejects
the warning.

## Limits {#limits}

- Mutual exclusions: `.fields` cannot combine with `.matrix`, `.full-width` or `num`; `num` and `tab` are exclusive; `group`/`value` require
  `tab`; `meta` requires `.fields`.
- The attribute line must touch the table: leave a blank line and it becomes a
  visible line of braces. Markdown formatters like to move it — wrap it in
  `<!-- prettier-ignore-start -->` / `<!-- prettier-ignore-end -->`.
- No merged cells, no sorting, no filtering: what a GFM pipe table can express
  is all there is. Split a complex table with a merged header into two tables,
  or turn it into a matrix.
- Block content does not fit in a cell: multi-paragraph descriptions, lists and
  fences need the `fields`/`field` shortcode.
- `.matrix` centring is CSS: an explicit alignment in the delimiter row wins.

## Related {#related}

- [Fields](/docs/components/fields/) — everything `{.fields}` can do
- [Tabs](/docs/components/tabs/) — adjacent tables as a tab set
- [Publishing books](/docs/write/book/) — numbered tables, cross references, the list of tables
- [Code blocks](/docs/components/code/) — where attributes go on the info line instead of the next line
