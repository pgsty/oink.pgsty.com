---
title: Fields and Field
linkTitle: Fields
description:
  Describe configuration, parameters, properties, and response fields with
  responsive semantic HTML.
weight: 40
---

Use `fields` with `field` children to document named values and their metadata.
The component favors a responsive definition list over a wide fixed table, so
long names and descriptions remain usable on narrow screens.

## When to use {#when-to-use}

Fields works for configuration keys, command or API parameters, object
properties, and response members. Use a regular Markdown table when readers must
compare many rows across the same columns. Use prose when the entries are steps
rather than definitions.

## Quick start {#quick-start}

### Source {#source}

```go-html-template
{{</* fields label="Search configuration" */>}}
  {{</* field name="offlineSearch" type="boolean" required=true default=true */>}}
  Builds a **local** search index and command palette.
  {{</* /field */>}}

  {{</* field name="offlineSearchMaxResults" type="integer" default=10 */>}}
  Limits the number of visible results.
  {{</* /field */>}}
{{</* /fields */>}}
```

### Rendered result {#rendered-result}

<!-- prettier-ignore-start -->

{{< fields label="Search configuration" >}}
  {{< field name="offlineSearch" type="boolean" required=true default=true >}}
  Builds a **local** search index and command palette.
  {{< /field >}}
  {{< field name="offlineSearchMaxResults" type="integer" default=10 >}}
  Limits the number of visible results while retaining keyboard navigation.
  {{< /field >}}
  {{< field name="searchPlaceholder" type="string" default="" >}}
  Sets optional placeholder text. The empty-string default remains visible.
  {{< /field >}}
  {{< field name="theme.components.media.previewMaximumWidthInCharacters" type="string" default="auto" >}}
  This deliberately long field name demonstrates wrapping without widening the page.
  {{< /field >}}
{{< /fields >}}

<!-- prettier-ignore-end -->

Descriptions accept Markdown, including links, emphasis, inline code, and lists.
Keep each description self-contained because Markdown output presents each one
beneath its metadata.

## Fields parameters {#fields-parameters}

<!-- prettier-ignore-start -->

{{< fields label="fields parameters" >}}
  {{< field name="label" type="string" >}}
  A nonempty visible label associated with the complete definition list.
  {{< /field >}}
{{< /fields >}}

<!-- prettier-ignore-end -->

The container must have at least one direct `field` child. Text or another
shortcode directly inside `fields` stops the build.

## Field parameters {#field-parameters}

<!-- prettier-ignore-start -->

{{< fields label="field parameters" >}}
  {{< field name="name" type="string" required=true >}}
  A nonempty string identifying the field.
  {{< /field >}}
  {{< field name="type" type="string" >}}
  A nonempty type label such as `boolean`, `string[]`, or `duration`.
  {{< /field >}}
  {{< field name="required" type="boolean" default=false >}}
  When true, adds the literal `required` marker. The marker is untranslated API vocabulary.
  {{< /field >}}
  {{< field name="default" type="scalar" >}}
  A string, boolean, integer, or floating-point value. `false`, `0`, and `""` are preserved.
  {{< /field >}}
{{< /fields >}}

<!-- prettier-ignore-end -->

Every `field` also requires a nonempty body. It must be a direct child of
`fields`. Parameter names and types are validated at build time, and unknown
parameters are errors.

## Semantics and fallback {#semantics-and-fallback}

HTML uses `dl`, `dt`, and `dd`. Each entry stacks a header row — the field name
followed by its `type`, `required`, and `default` markers — above the
description, and hairline dividers separate entries. The `required` and
`default` labels stay in English in every locale. The optional label names the
definition list for assistive technology. Markdown emits an indented bullet list
with code-formatted names, types, and defaults; print and RSS retain every
definition. No JavaScript is loaded.

## Deliberate limits {#deliberate-limits}

Version one does not implement `kind`, `deprecated`, `since`, `location`, or
per-field links. It also does not parse TypeScript or an API schema inside Hugo.
An external generator may emit these shortcodes later, keeping compiler and
schema runtimes outside the theme while preserving this output contract.
