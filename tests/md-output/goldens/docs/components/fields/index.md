# Fields

> Add `{.fields}` to a table to document configuration keys, command flags, and API fields. Entries adapt to narrow screens and have individual anchors.

---

LLMS index: [llms.txt](/llms.txt)

---

Fields display named values, metadata, and descriptions as a responsive definition list.
Each name has its own line. Small chips beside it show type, required status, and default value.
The description starts on the next line. Each entry has an anchor.
Use fields for configuration keys, command flags, and API fields.
Use a plain table to compare many rows across the same columns. Use steps for sequences of actions.

There are two forms. Use a plain table with `{.fields}` by default.
Use `fields`/`field` shortcodes for descriptions with multiple paragraphs, lists, or code blocks. Both forms display the same entries.

## Shortest form {#minimal}

Write a pipe table with at least two columns, then put `{.fields}` on the next line.
The first column is the name. The last is the description. Middle columns are metadata labeled with their header text.

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

Metadata appears as "Header: value". The theme does not infer meaning from headers. `Type` is only a label.
The next section explains standard chips. Cells accept inline Markdown, including code, emphasis, and links. Empty middle cells are omitted.

## Semantic columns with `meta=` {#meta}

`meta` assigns a role to each middle column, in order: `type`, `required`, `default`, or `-` for a plain header label.
With this attribute, tables display the same chips as shortcodes.

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

The rules:

- `meta` should specify one role per middle column: the total column count minus two.
  Too many or too few roles warns and ignores `meta`. Review the warning and rendered fallback before publication.
- Every nonempty `required` cell means true. "yes", "是", and "✔" all display the untranslated `required` chip.
  Empty cells display nothing. Leave optional fields empty, because `no` and `否` also mean true.
- `type` and `default` cells without their own inline markup receive code formatting, as in the shortcode form.
- Semantic chips always appear in this order: `type`, `required`, `default`, regardless of column order.
  `-` columns follow in their original order.

Combine `-` with semantic roles to keep a custom label:

```markdown {title="Source"}
| Environment variable | Type | Scope | Description |
| --- | --- | --- | --- |
| `HUGO_MODULE_WORKSPACE` | string | build | Points at `go.work` so the theme resolves from a local checkout |
| `HUGO_ENV` | string | build | Selects production mode; OINK fingerprints CSS/JS assets. Use `--minify` to minify HTML |
{.fields meta="type -"}
```

| Environment variable | Type | Scope | Description |
| --- | --- | --- | --- |
| `HUGO_MODULE_WORKSPACE` | string | build | Points at `go.work` so the theme resolves from a local checkout |
| `HUGO_ENV` | string | build | Selects production mode; OINK fingerprints CSS/JS assets. Use `--minify` to minify HTML |
{.fields meta="type -"}

## Labels and container IDs {#caption-id}

`caption` sets the list's visible label and accessible name. `id` identifies the outer container for links or styles.

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

Each entry has a `field-<name>` anchor. A self-link icon appears beside the name on hover.
For example, `page_width` in the first table has [#field-page_width](#field-page_width). Share this link to refer to that entry.

Duplicate names on a page receive `-2` and `-3` suffixes, as Goldmark does for duplicate headings.
Only HTML generates these anchors. Print and RSS combine pages into one document, where these anchors would collide.

## The shortcode form {#shortcode}

If a description needs multiple paragraphs, a list, or a code block, use `fields`/`field`. A table cell cannot contain these blocks.

````markdown {title="Source"}
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
````

**Common pig flags**

- `--config` — `path`; required

  Path to the configuration file. Relative paths resolve against the working
  directory.

  When `PIG_CONFIG` is also set, the command-line flag takes precedence.

- `--log-level` — `string`; default: `info`

  Log level, from low to high:

  - `debug`: print every remote call
  - `info`: the default
  - `error`: output only on failure

- `--dry-run` — `boolean`; default: `false`

  Print what would happen and change nothing:

  ```bash
  pig ext install pg_duckdb --dry-run
  ```

`required=true` and `default=false` are booleans. Do not quote them.
`default` accepts any scalar. Both `default=0` and `default=""` display their values; the empty string appears as `""`.
If you omit `default`, the chip is omitted. Every `field` needs a nonempty body and must be a direct child of `fields`.

## Which form to use {#which}

| Situation | Use |
| --- | --- |
| One-sentence descriptions that fit in a table cell | table + `{.fields}` |
| Descriptions with paragraphs, lists or code blocks | the `fields`/`field` shortcode |
| Readers comparing many rows across the same columns | a plain table, not a field list |
| Content that is a sequence of actions | [Steps](/docs/components/steps/) |

The table form stays readable on GitHub and remains a table in OINK's Markdown output. It is therefore the default.

## Output {#outputs}

| Output | Shape |
| --- | --- |
| HTML | `<div class="td-fields">` around a semantic `<dl>`; entries carry `#field-<name>` anchors and self-links |
| Print | The complete definition list, without entry anchors |
| Markdown | The table form keeps the source table; the shortcode form emits a bulleted list of "`name` — type; required; default: value" plus the indented description |
| RSS | The complete static `<dl>`, without entry anchors |

No script is loaded.

## Parameter reference {#reference}

The table attribute line, on the row below the table:

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
| `type` | non-empty string | | Type label such as `boolean`, `string[]`, `duration` |
| `required` | boolean | | `true` shows the untranslated `required` chip; defaults to `false` |
| `default` | scalar | | String / boolean / integer / float; `false`, `0` and `""` all display |
{.fields meta="type required"}

## Limits {#limits}

- The first column must be nonempty and unique within each table.
  Empty or duplicate names warn and skip the row.
- `.fields` cannot be combined with `.matrix`, `.full-width`, or `num`. `meta` requires a table with `.fields`.
- Table cells cannot contain block content. Use shortcodes for paragraphs, lists, and fences.
- `required` and `default` remain untranslated English API terms in every language. They are contract terms, not interface text.
- Fields do not support `kind`, `since`, `deprecated`, `location`, per-field links, or nested structures.
  They do not parse TypeScript or OpenAPI schemas at build time.

## Related {#related}

- [Tables](/docs/components/table/) — the rest of the attribute line and the exclusion rules
- [Configuration](/docs/customize/config/) — the full site parameter table, itself a field list
- [Front matter](/docs/write/frontmatter/) — the full front matter table
- [Steps](/docs/components/steps/) — ordered actions do not belong in a field list

---

Backlinks:

- [Cards](/docs/components/cards/)
- [Tables](/docs/components/table/)
- [AI-agent support](/docs/customize/agents/)
- [Print](/docs/customize/print/)
- [Writing pages](/docs/write/pages/)
