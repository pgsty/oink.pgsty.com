---
title: Fields
linkTitle: Fields
description: Document configuration keys, command flags and API fields as a field list that stays readable on a phone and gives every entry its own link.
weight: 140
search_keywords: [Fields, field, configuration key, parameter, API field, meta, type, required, default, definition list, anchor]
---

A field list documents named settings: configuration keys, command-line flags,
API fields. Each name sits on its own line with small chips for its type,
whether it is required and its default, and the description runs underneath at
full width, so a long description never gets squeezed into a narrow table
column on a phone. Every entry also gets its own anchor, which you can paste
into an issue or a chat to point at one setting.

A field list suits reference material. When readers compare many rows across
the same columns, keep a plain table; when the content is a sequence of
actions, use [Steps](/docs/components/steps/).

## Shortest form {#minimal}

Write a pipe table with at least two columns and put `{.fields}` on the line
right after it. The first column is the name, the last column is the
description, and every column in between is metadata.

```markdown {title="Source"}
| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `offline_search` | boolean | `false` | Build the local search index and enable the command palette |
| `offline_search_max_results` | integer | `10` | Maximum number of search results |
| `page_width` | string | `normal` | Reading column width: `normal` `wide` `full` |
{.fields}
```

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `offline_search` | boolean | `false` | Build the local search index and enable the command palette |
| `offline_search_max_results` | integer | `10` | Maximum number of search results |
| `page_width` | string | `normal` | Reading column width: `normal` `wide` `full` |
{.fields}

Each metadata cell is shown as "Header: value". The theme does not read
meaning into header text, so `Type` here is only a label; to get the standard
chips, assign roles with `meta` as described in the next section. Cells accept
inline Markdown such as code, emphasis and links, and an empty metadata cell is
left out.

## Semantic columns with `meta=` {#meta}

`meta` gives each metadata column a role, in column order: `type`,
`required`, `default`, or `-` to keep the header as a plain label. With roles
assigned, the table renders the same chips as the shortcode form.

```markdown {title="Source"}
| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `baseURL` | string | yes | | Site address, subpath included |
| `title` | string | yes | | Site name, shown in the navbar and the tab |
| `defaultContentLanguage` | string | | `en` | Default language; decides which language unprefixed paths belong to |
{.fields meta="type required default"}
```

| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `baseURL` | string | yes | | Site address, subpath included |
| `title` | string | yes | | Site name, shown in the navbar and the tab |
| `defaultContentLanguage` | string | | `en` | Default language; decides which language unprefixed paths belong to |
{.fields meta="type required default"}

- Write exactly one role per metadata column, which is the column count minus
  two. With too many or too few, the build warns and the table renders as if
  `meta` were absent.
- Any non-empty `required` cell means required, and it shows the English
  `required` chip whether you wrote "yes", "是" or "✔". Leave optional rows
  empty, because "no" and "否" count as required too.
- `type` and `default` values without inline markup of their own are set as
  code, matching the shortcode form.
- The chips always appear in the order `type`, `required`, `default`,
  whatever the column order; `-` columns follow in their own order.

Mix `-` with roles to keep a column under its own label:

```markdown {title="Source"}
| Environment variable | Type | Read by | Description |
| --- | --- | --- | --- |
| `PGHOST` | string | libpq clients | Server host name, or the directory of a Unix socket |
| `PGDATA` | path | server tools | Data directory used by `initdb` and `pg_ctl` when `-D` is not given |
{.fields meta="type -"}
```

| Environment variable | Type | Read by | Description |
| --- | --- | --- | --- |
| `PGHOST` | string | libpq clients | Server host name, or the directory of a Unix socket |
| `PGDATA` | path | server tools | Data directory used by `initdb` and `pg_ctl` when `-D` is not given |
{.fields meta="type -"}

## Labels and container IDs {#caption-id}

`caption` puts a visible label above the list and also names it for screen
readers. `id` sets the ID of the outer container, so you can link to the whole
list or style it from site CSS.

```markdown {title="Source"}
| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `image_zoom` | boolean | `false` | Turn image zoom on |
| `featured_image` | string | `none` | Article image mode: `none`, `banner`, `wash` or `hero` |
{.fields caption="params.ui" id="zoom-params" meta="type default"}
```

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `image_zoom` | boolean | `false` | Turn image zoom on |
| `featured_image` | string | `none` | Article image mode: `none`, `banner`, `wash` or `hero` |
{.fields caption="params.ui" id="zoom-params" meta="type default"}

## Every entry is linkable {#anchors}

Each entry gets a `field-<name>` anchor, and a link icon appears beside the
name on hover. `page_width` in the first list on this page, for example, is
[#field-page_width](#field-page_width). When a name occurs twice on one page,
the second anchor gets `-2`, the third `-3` (unlike headings, which Goldmark
suffixes `-1`, `-2`).

To keep an anchor that other pages already link to, give the `field`
shortcode an explicit `id`, such as `id="guc-work-mem"`; an empty, duplicate
or unsafe value warns and falls back to the generated anchor.
[Local search](/docs/customize/search/) indexes each anchored entry, so
searching for a parameter name opens the page at that entry.

## The shortcode form {#shortcode}

A table cell cannot hold paragraphs, lists or code blocks. When a description
needs them, write the list with the `fields` and `field` shortcodes instead.

````markdown {title="Source"}
{{</* fields label="Common pig flags" */>}}
{{</* field name="--config" type="path" required=true */>}}
Path to the configuration file. Relative paths resolve against the working
directory.

When `PIG_CONFIG` is also set, the command-line flag wins.
{{</* /field */>}}
{{</* field name="--log-level" type="string" default="info" */>}}
Log level, from low to high:

- `debug`: print every remote call
- `info`: the default
- `error`: output only on failure
{{</* /field */>}}
{{</* field name="--dry-run" type="boolean" default=false */>}}
Print what would happen and change nothing:

```bash
pig ext install pg_duckdb --dry-run
```
{{</* /field */>}}
{{</* /fields */>}}
````

{{< fields label="Common pig flags" >}}
{{< field name="--config" type="path" required=true >}}
Path to the configuration file. Relative paths resolve against the working
directory.

When `PIG_CONFIG` is also set, the command-line flag wins.
{{< /field >}}
{{< field name="--log-level" type="string" default="info" >}}
Log level, from low to high:

- `debug`: print every remote call
- `info`: the default
- `error`: output only on failure
{{< /field >}}
{{< field name="--dry-run" type="boolean" default=false >}}
Print what would happen and change nothing:

```bash
pig ext install pg_duckdb --dry-run
```
{{< /field >}}
{{< /fields >}}

Write `required=true` and `default=false` without quotes, because quoted they
are strings rather than booleans. `default` accepts any scalar and shows
`default=0` and `default=""` as written, the empty string as `""`; without
`default`, no default chip appears. Every `field` needs a non-empty body and
must sit directly inside `fields`.

## Which form to use {#which}

| Situation | Use |
| --- | --- |
| One-sentence descriptions that fit in a table cell | table + `{.fields}` |
| Descriptions with paragraphs, lists or code blocks | the `fields`/`field` shortcode |
| Readers comparing many rows across the same columns | a plain table, not a field list |
| Content that is a sequence of actions | [Steps](/docs/components/steps/) |

Prefer the table form whenever it fits: GitHub still shows it as a readable
table, and the page's Markdown output keeps it as one.

## Output {#outputs}

Field lists load no script. Print and RSS show the complete list without entry
anchors, because a print view joins many pages into one document where the
anchors would collide. In the page's Markdown output the table form stays the
source table, while the shortcode form becomes a bulleted list,
"`name` — type; required; default: value", with each description indented
beneath its entry.

## Parameter reference {#reference}

The table attribute line, on the line right after the table:

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `.fields` | marker | none | Required; renders the table as a field list |
| `meta` | role list | none | Space-separated `type` `required` `default` `-`; one per middle column; semantic roles cannot repeat |
| `caption` | plain text | none | Visible label and the list's accessible name |
| `id` | identifier | none | ID of the outer container |
| `class` | class list | none | Passed through for site CSS |
| `data-*` / `aria-*` | string | none | Passed through |
{.fields meta="type default"}

The `fields` shortcode:

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `label` | non-empty string | | Visible label; the same thing the table's `caption` does |
| `id` | identifier | | Container ID; no whitespace, quotes, `<`, `>` or `&` |
| `class` / `data-*` / `aria-*` | string | | The same policy as the table attribute line |
{.fields meta="type required"}

The `field` shortcode:

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | non-empty string | yes | The field name |
| `id` | identifier | | Replaces the generated `field-<name>` anchor; no whitespace, quotes, `<`, `>` or `&`, and unique among the fields on the page |
| `type` | non-empty string | | Type label such as `boolean`, `string[]`, `duration` |
| `required` | boolean | | `true` shows the untranslated `required` chip; defaults to `false` |
| `default` | scalar | | String / boolean / integer / float; `false`, `0` and `""` all display |
{.fields meta="type required"}

## Limits {#limits}

- The first column must be non-empty and unique within the table; a row with
  an empty or duplicate name warns and is skipped.
- `.fields` cannot be combined with `.matrix`, `.full-width`, `.expand` or
  `num`, and `meta` works only on a table that has `.fields`.
- Table cells cannot hold block content; switch to the shortcode form for
  paragraphs, lists and code blocks.
- `required` and `default` stay in English in every language, because they
  are API vocabulary rather than interface text.
- There is no `kind`, `since`, `deprecated` or `location` metadata, no
  per-field link and no nesting, and nothing is generated from TypeScript or
  OpenAPI schemas.

## Related {#related}

- [Tables](/docs/components/table/) — the rest of the attribute line and the exclusion rules
- [Configuration](/docs/customize/config/) — the full site parameter table, itself a field list
- [Front matter](/docs/write/frontmatter/) — the full front matter table
- [Steps](/docs/components/steps/) — ordered actions do not belong in a field list
