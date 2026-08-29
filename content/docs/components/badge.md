---
title: Badge
linkTitle: Badge
description: Put a semantic status label next to a feature name, a version or a table cell — five tones, no custom colours.
weight: 180
search_keywords: [Badge, status label, tone, Beta, deprecated, neutral, info, success, warning, danger]
---

A badge is an inline status label that sits right after a name: Beta,
deprecated, v0.5, needs a server. It suits a status of one or two words. The
author picks a semantic tone and the theme picks the colour, with contrast
guaranteed in light and dark. When the status needs an explanation, a procedure
or a deadline, use prose or a [callout](/docs/components/callout/).

## Shortest form {#minimal}

```markdown {title="Source"}
{{</* badge text="Beta" tone="warning" */>}}
```

{{< badge text="Beta" tone="warning" >}}

`text` is the only required parameter and must be a non-empty string.

## Five tones {#tones}

These five values, and no custom colours.

```markdown {title="Source"}
{{</* badge text="Default" */>}}
{{</* badge text="Info" tone="info" */>}}
{{</* badge text="Supported" tone="success" */>}}
{{</* badge text="Experimental" tone="warning" */>}}
{{</* badge text="Deprecated" tone="danger" */>}}
```

{{< badge text="Default" >}}
{{< badge text="Info" tone="info" >}}
{{< badge text="Supported" tone="success" >}}
{{< badge text="Experimental" tone="warning" >}}
{{< badge text="Deprecated" tone="danger" >}}

Without `tone` the badge is `neutral`. Any other value warns and uses `neutral`
in ordinary preview; the warning names the source location and fails a strict
publishing build.

## Inside a sentence {#inline}

A badge is an inline element that follows a name; it never takes its own line.

```markdown {title="Source"}
With `params.ui.image_zoom` {{</* badge text="off by default" tone="neutral" */>}} enabled,
block images that have alt text open full size. PlantUML {{</* badge text="needs a server" tone="warning" */>}}
and Draw.io {{</* badge text="needs a server" tone="warning" */>}} warn and remain off when no
endpoint is configured, rather than reaching for a public service.
```

With `params.ui.image_zoom` {{< badge text="off by default" tone="neutral" >}} enabled,
block images that have alt text open full size. PlantUML {{< badge text="needs a server" tone="warning" >}}
and Draw.io {{< badge text="needs a server" tone="warning" >}} warn and remain off when no
endpoint is configured, rather than reaching for a public service.

## Next to a heading {#in-headings}

**Never put a shortcode in a heading.** Hugo builds the table of contents before
it expands shortcodes, so the badge renders correctly on the heading while the
table of contents is left with an internal Hugo placeholder. Put the status in
the first paragraph under the heading instead:

```markdown {title="Source"}
### OpenAPI pages {#openapi-example}

{{</* badge text="new in 0.5" tone="success" */>}} This section covers…
```

### OpenAPI pages {#openapi-example}

{{< badge text="new in 0.5" tone="success" >}} The badge sits just under the
heading, the table of contents stays clean, and sharing the anchor link does not
drag the badge text along.

## In table cells {#in-tables}

Badges make a comparison table easier to scan than a column of "yes" and "no".

```markdown {title="Source"}
| Component | Form | Status |
| --- | --- | --- |
| Callouts | `> [!NOTE]` | {{</* badge text="stable" tone="success" */>}} |
| Galleries | ` ```gallery ` fence | {{</* badge text="stable" tone="success" */>}} |
| PlantUML | ` ```plantuml ` fence | {{</* badge text="needs a server" tone="warning" */>}} |
| The `image` shortcode | — | {{</* badge text="removed" tone="danger" */>}} |
```

| Component | Form | Status |
| --- | --- | --- |
| Callouts | `> [!NOTE]` | {{< badge text="stable" tone="success" >}} |
| Galleries | ` ```gallery ` fence | {{< badge text="stable" tone="success" >}} |
| PlantUML | ` ```plantuml ` fence | {{< badge text="needs a server" tone="warning" >}} |
| The `image` shortcode | — | {{< badge text="removed" tone="danger" >}} |

## In lists and steps {#in-lists}

```markdown {title="Source"}
1. Install Hugo Extended {{</* badge text="≥ 0.160.1" tone="info" */>}}
1. Create a site from OINK Starter and change `baseURL` in `hugo.yaml`
1. `hugo server` to preview {{</* badge text="port 1313" tone="neutral" */>}}
{.steps}
```

1. Install Hugo Extended {{< badge text="≥ 0.160.1" tone="info" >}}
1. Create a site from OINK Starter and change `baseURL` in `hugo.yaml`
1. `hugo server` to preview {{< badge text="port 1313" tone="neutral" >}}
{.steps}

## On cards {#in-cards}

A card has its own `badge` parameter — plain text, fixed to the right of the
title — and the card body can hold badge shortcodes.

```markdown {title="Source"}
{{</* cards */>}}
{{</* card title="Hugo Module" icon="fa-brands fa-golang" badge="recommended" */>}}
One `hugo mod get` and you are done {{</* badge text="needs Go" tone="info" */>}}
{{</* /card */>}}
{{</* card title="Offline archive" icon="fa-solid fa-box-archive" */>}}
Builds on a machine with no network {{</* badge text="manual upgrades" tone="warning" */>}}
{{</* /card */>}}
{{</* /cards */>}}
```

{{< cards >}}
{{< card title="Hugo Module" icon="fa-brands fa-golang" badge="recommended" >}}
One `hugo mod get` and you are done {{< badge text="needs Go" tone="info" >}}
{{< /card >}}
{{< card title="Offline archive" icon="fa-solid fa-box-archive" >}}
Builds on a machine with no network {{< badge text="manual upgrades" tone="warning" >}}
{{< /card >}}
{{< /cards >}}

## Clickable badges {#link}

With `link` the badge becomes an `<a>`: site paths, relative paths, `http(s):`
and `mailto:` all work.

```markdown {title="Source"}
Current version {{</* badge text="v0.5" tone="info" link="/blog/" */>}};
for the upgrade steps see {{</* badge text="Upgrading" tone="neutral" link="/docs/admin/upgrade/" */>}}.
```

Current version {{< badge text="v0.5" tone="info" link="/blog/" >}};
for the upgrade steps see {{< badge text="Upgrading" tone="neutral" link="/docs/admin/upgrade/" >}}.

An illegal link warns and is dropped, leaving a plain badge in ordinary
preview; strict publishing rejects the warning.

## Output {#outputs}

| Output | Shape |
| --- | --- |
| HTML | `<span class="td-badge td-badge--<tone>">`, or `<a class="td-badge …">` when linked |
| Print | Same as HTML, a static inline element |
| Markdown | `**Beta**`, or `[**Beta**](/…)` when linked |
| RSS | Same as print |

No JavaScript. A badge is not a live region, so adding one does not announce
anything to a screen reader.

## Parameter reference {#reference}

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `text` | plain text | — | Required, non-empty. What the reader sees |
| `tone` | enum | `neutral` | `neutral` `info` `success` `warning` `danger` |
| `link` | URL | — | Turns the badge into a link |
{.fields meta="type default"}

Named parameters only. There is no `icon`, `class`, `color`, `outline` or `size`
parameter. Invalid input warns and takes the safe result: unknown parameters
are ignored, empty `text` renders nothing, bad `tone` becomes `neutral`, and an
unsafe link is dropped. Strict publishing rejects every such warning.

## Limits {#limits}

- Colour is not the meaning: tone supplements the text, which has to say it.
  `{{</* badge text="🔴" */>}}` tells a screen reader nothing.
- No icon parameter: when you need an icon, use [cards](/docs/components/cards/)
  or a [callout](/docs/components/callout/).
- Keep the text short: a badge follows a name without wrapping, so anything
  longer than a few words belongs in the prose.
- No more than three in one place: a row of badges drowns out the name it
  qualifies.
- Badges exist only as a shortcode — there is no native Markdown form — and in a
  plain Markdown reader they degrade to bold text.

## Related {#related}

- [Cards](/docs/components/cards/) — `card` has a `badge` parameter of its own
- [File trees](/docs/components/filetree/) — `tone` uses the same vocabulary
- [Keys](/docs/components/kbd/) — the other inline shortcode
- [Callouts](/docs/components/callout/) — when the status needs explaining
