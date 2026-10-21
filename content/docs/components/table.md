---
title: Tables
linkTitle: Tables
description: Add attributes to a GFM table for captions, compatibility matrices, field lists, numbering, or tabs. Wide tables scroll within their own regions.
weight: 50
search_keywords: [Table, matrix, full-width, td-table--wide, technical tables, caption, numbered table, horizontal scroll, GFM]
aliases:
  - /docs/components/tables/
---

Tables use ordinary GFM pipe syntax. The table render hook wraps each table in a horizontally scrollable region.
The `{…}` attribute line below selects captions, compatibility matrices, field lists, numbering, or tabs.
Merged cells, sorting, and filtering are unsupported. If you need these features, change the presentation of the data.

## Shortest form {#minimal}

Without an attribute line, the result is an ordinary table. The delimiter row controls alignment.
Header cells use `th scope="col"`.

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

Wide tables scroll within their own region instead of widening the page.
Press Tab to focus the region, then use arrow keys to scroll.
Its accessible name is the localized "Scrollable table".

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

`{caption="…"}` adds a visible `<caption>`. The caption is plain text and does not number the table.

```markdown {title="Source"}
| Item | Value |
| --- | --- |
| Theme version | v0.8.1 |
| Hugo floor | 0.168.0 Extended |
| Licence | Apache-2.0 |
{caption="Theme facts this site currently builds against"}
```

| Item | Value |
| --- | --- |
| Theme version | v0.8.1 |
| Hugo floor | 0.168.0 Extended |
| Licence | Apache-2.0 |
{caption="Theme facts this site currently builds against"}

## Compatibility matrices {#matrix}

Use `{.matrix}` for support matrices. The first column becomes a row header with `th scope="row"`.
The header row and first column stay fixed while scrolling. Other cells are centered unless the delimiter row specifies another alignment.
Authors write ✅ and ❌ characters. The theme does not interpret them.

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

`{.full-width}` removes the reading-column limit and uses the article's full width. Use it for many short columns.

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

`{.fields}` converts a table to a definition list. The first column is the name, the last is the description, and middle columns are metadata.
Use it for configuration keys, command flags, and API fields. See [Fields](/docs/components/fields/) for the complete syntax.

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

For books or long manuals, add `num`, with optional `#id` and `caption`.
The theme wraps the table in a `<figure>` with a localized "Table N." label and registers it as a Book target.
`xref` can reference it, and it appears in the book-wide table list.
Authors provide numbers. The theme never counts. `id` defaults to `tbl-<num>`.

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

Adjacent tables with `{tab="…"}` form a tab set, using the same rules as adjacent fences.
`group` on the first table enables URL hashes, synchronization, and saved selections. Each later table needs `value`.
See [Tabs](/docs/components/tabs/) for the complete rules.

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

`style`, `on*`, and other keys warn and are ignored. Review the warning and rendered fallback before publication.

## Limits {#limits}

- `.fields` cannot be combined with `.matrix`, `.full-width`, or `num`.
  `num` and `tab` are mutually exclusive. `group`/`value` require `tab`, and `meta` requires `.fields`.
- The attribute line must immediately follow the table. A blank line makes the braces appear as text.
  To prevent formatters moving the line, wrap it in `<!-- prettier-ignore-start -->` / `<!-- prettier-ignore-end -->`.
- GFM tables do not support merged cells, sorting, or filtering. Split complex tables with merged headers into two tables or use a matrix.
- Cells cannot contain block content. Use `fields`/`field` shortcodes for multiple paragraphs, lists, or fences.
- `.matrix` centering uses CSS. Explicit delimiter-row alignment takes precedence.

## Related {#related}

- [Fields](/docs/components/fields/) — everything `{.fields}` can do
- [Tabs](/docs/components/tabs/) — adjacent tables as a tab set
- [Publishing books](/docs/write/book/) — numbered tables, cross references, the list of tables
- [Code blocks](/docs/components/code/) — where attributes go on the info line instead of the next line
