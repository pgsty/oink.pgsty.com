# Fields and Field

> Describe configuration, parameters, properties, and response fields with responsive semantic HTML.

---

LLMS index: [llms.txt](/llms.txt)

---

Fields documents named values and their metadata as a responsive definition
list, so long names and descriptions remain usable on narrow screens. It has two
forms: an ordinary Markdown table followed by `{.fields}`, and the `fields` /
`field` shortcode pair for typed metadata and multi-paragraph descriptions.

## When to use {#when-to-use}

Fields works for configuration keys, command or API parameters, object
properties, and response members. Use a regular Markdown table when readers must
compare many rows across the same columns. Use prose when the entries are steps
rather than definitions.

## Table form {#table-form}

Write a pipe table and put `{.fields}` on the line after it. The **first
column** is the field name, the **last column** is the description, and every
column in between is metadata labelled by its header — in any language, no fixed
vocabulary:

```markdown
| Parameter                                | Type    | Default | Description                              |
| ---------------------------------------- | ------- | ------- | ---------------------------------------- |
| `offlineSearch`                          | boolean | `false` | Builds a **local** search index          |
| `offlineSearchMaxResults`                | integer | `10`    | Limits the number of visible results     |
| `searchPlaceholder`                      | string  |         | Optional placeholder; empty cells vanish |
{.fields caption="Search configuration"}
```

| Parameter                  | Type    | Default | Description                              |
| -------------------------- | ------- | ------- | ---------------------------------------- |
| `offlineSearch`            | boolean | `false` | Builds a **local** search index          |
| `offlineSearchMaxResults`  | integer | `10`    | Limits the number of visible results     |
| `searchPlaceholder`        | string  |         | Optional placeholder; empty cells vanish |
{.fields caption="Search configuration"}

Cells accept inline Markdown (links, code, emphasis); the first cell must be
non-empty and unique. `caption` becomes the visible label. On GitHub the source
is still a readable table, and OINK's Markdown output keeps it as one. Use the
shortcode form when a description needs several paragraphs, lists, or fences.

## Shortcode form {#quick-start}

### Source {#source}

```go-html-template
{{< fields label="Search configuration" >}}
  {{< field name="offlineSearch" type="boolean" required=true default=true >}}
  Builds a **local** search index and command palette.
  {{< /field >}}

  {{< field name="offlineSearchMaxResults" type="integer" default=10 >}}
  Limits the number of visible results.
  {{< /field >}}
{{< /fields >}}
```

### Rendered result {#rendered-result}

**Search configuration**

- `offlineSearch` — `boolean`; required; default: `true`

  Builds a **local** search index and command palette.

- `offlineSearchMaxResults` — `integer`; default: `10`

  Limits the number of visible results while retaining keyboard navigation.

- `searchPlaceholder` — `string`; default: `""`

  Sets optional placeholder text. The empty-string default remains visible.

- `theme.components.media.previewMaximumWidthInCharacters` — `string`; default: `auto`

  This deliberately long field name demonstrates wrapping without widening the page.

Descriptions accept Markdown, including links, emphasis, inline code, and lists.
Keep each description self-contained because Markdown output presents each one
beneath its metadata.

## Fields parameters {#fields-parameters}

**fields parameters**

- `label` — `string`

  A nonempty visible label associated with the complete definition list.

The container must have at least one direct `field` child. Text or another
shortcode directly inside `fields` stops the build.

## Field parameters {#field-parameters}

**field parameters**

- `name` — `string`; required

  A nonempty string identifying the field.

- `type` — `string`

  A nonempty type label such as `boolean`, `string[]`, or `duration`.

- `required` — `boolean`; default: `false`

  When true, adds the literal `required` marker. The marker is untranslated API vocabulary.

- `default` — `scalar`

  A string, boolean, integer, or floating-point value. `false`, `0`, and `""` are preserved.

Every `field` also requires a nonempty body. It must be a direct child of
`fields`. Parameter names and types are validated at build time, and unknown
parameters are errors.

## Semantics and fallback {#semantics-and-fallback}

Both forms render the same `dl`, `dt`, and `dd` structure. Each entry stacks a
header row — the field name followed by its metadata chips — above the
description, and hairline dividers separate entries. In the shortcode form the
chips are `type`, `required`, and `default` (labels that stay in English in
every locale); in the table form each chip is `header: value`. The optional
label names the definition list for assistive technology. Markdown output keeps
the source table, or emits an indented bullet list with code-formatted names,
types, and defaults for the shortcode form; print and RSS retain every
definition. No JavaScript is loaded.

## Deliberate limits {#deliberate-limits}

Version one does not implement `kind`, `deprecated`, `since`, `location`, or
per-field links. It also does not parse TypeScript or an API schema inside Hugo.
An external generator may emit these shortcodes later, keeping compiler and
schema runtimes outside the theme while preserving this output contract.
