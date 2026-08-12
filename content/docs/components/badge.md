---
title: Badge
description:
  Add compact, semantic status labels without custom colors or JavaScript.
weight: 20
---

Use Badge to place a short status beside a feature, option, or release name. The
author chooses a semantic tone; Oink maps it to theme tokens that retain
contrast in light and dark modes.

## When to use {#when-to-use}

Badge works well for lifecycle states such as Beta, New, Experimental, and
Deprecated. Keep the text explicit: color supplements the label and never
replaces it. Use ordinary prose or an alert when the status needs explanation,
instructions, or a deadline.

## Quick start {#quick-start}

### Source {#source}

```go-html-template
{{</* badge text="Beta" tone="warning" */>}}
{{</* badge text="Deprecated" tone="danger" outline=false */>}}
{{</* badge text="v0.3" tone="info" link="/blog/release/" */>}}
```

### Rendered result {#rendered-result}

{{< badge text="Neutral" >}} {{< badge text="Info" tone="info" >}}
{{< badge text="Supported" tone="success" >}}
{{< badge text="Beta" tone="warning" >}}
{{< badge text="Deprecated" tone="danger" outline=false >}}
{{< badge text="v0.3" tone="info" link="/blog/release/" >}}

The final badge is a link. The others are static inline labels.

## Parameters {#parameters}

<!-- prettier-ignore-start -->

{{< fields label="Badge parameters" >}}
  {{< field name="text" type="string" required=true >}}
  A nonempty string shown to the reader.
  {{< /field >}}
  {{< field name="tone" type="enum" default="neutral" >}}
  One of `neutral`, `info`, `success`, `warning`, or `danger`.
  {{< /field >}}
  {{< field name="link" type="URL" >}}
  A validated internal, relative, HTTP(S), or `mailto:` destination. When set, the Badge becomes a link.
  {{< /field >}}
  {{< field name="outline" type="boolean" default=true >}}
  Set to `false` to select the filled treatment.
  {{< /field >}}
{{< /fields >}}

<!-- prettier-ignore-end -->

Pass booleans without quotes. For example, use `outline=false`, not
`outline="false"`. Unknown parameters and invalid tone or link values stop the
Hugo build and report the source position.

## Semantics and fallback {#semantics-and-fallback}

A static badge renders as a `span`; a linked badge renders as an `a`. Oink does
not make it a live status region, so adding a badge does not create unexpected
screen-reader announcements. Its visible text remains present in every output:
Markdown uses emphasized text (and preserves the link), while print and RSS use
static inline content. Badge loads no JavaScript.

## Deliberate limits {#deliberate-limits}

Badge does not accept arbitrary colors, CSS classes, styles, or event handlers.
Version one also has no `icon` parameter. Use a concise textual label now;
content icons can receive a separate public API after their naming, licensing,
accessibility, and Markdown fallback contracts are settled.
