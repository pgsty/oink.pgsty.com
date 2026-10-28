---
title: Badge
linkTitle: Badge
description: Add a semantic status label beside a feature name, version, or table cell. Choose from five tones; custom colors are not supported.
weight: 180
search_keywords: [Badge, status label, tone, Beta, deprecated, neutral, info, success, warning, danger]
---

A badge is an inline status label after a name, such as Beta, deprecated, v0.5, or needs a server.
Use it for a status of one or two words. Choose a semantic tone. The theme selects colors with contrast in light and dark modes.
If the status needs an explanation, procedure, or deadline, use prose or a [callout](/docs/components/callout/).

## Shortest form {#minimal}

```markdown {title="Source"}
{{</* badge text="Beta" tone="warning" */>}}
```

{{< badge text="Beta" tone="warning" >}}

`text` is the only required parameter and must be a non-empty string.

## Five tones {#tones}

Use one of these five values. Custom colors are not supported.

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

If you omit `tone`, the badge uses `neutral`. Other values warn and use `neutral` in ordinary previews.
The warning identifies the source location and should be reviewed with the rendered fallback before publication.

## Inside a sentence {#inline}

A badge is an inline element after a name. It never occupies a separate line.

```markdown {title="Source"}
With `params.ui.image_zoom` {{</* badge text="off by default" tone="neutral" */>}} enabled,
block images that have alt text open full size. PlantUML {{</* badge text="opt-in" tone="info" */>}}
uses its own site switch. Draw.io {{</* badge text="needs a server" tone="warning" */>}}
warns and remains off when no endpoint is configured.
```

With `params.ui.image_zoom` {{< badge text="off by default" tone="neutral" >}} enabled,
block images that have alt text open full size. PlantUML {{< badge text="opt-in" tone="info" >}}
uses its own site switch. Draw.io {{< badge text="needs a server" tone="warning" >}}
warns and remains off when no endpoint is configured.

## Next to a heading {#in-headings}

**Never put a shortcode in a heading.** Hugo builds the table of contents before it expands shortcodes.
The badge displays in the heading, but an internal Hugo placeholder remains in the table of contents.
Put the status in the first paragraph below the heading:

```markdown {title="Source"}
### OpenAPI pages {#openapi-example}

{{</* badge text="new in 0.5" tone="success" */>}} This section covers…
```

### OpenAPI pages {#openapi-example}

{{< badge text="new in 0.5" tone="success" >}} The badge appears below the heading. The table of contents stays readable.
The shared anchor link does not include the badge text.

## In table cells {#in-tables}

Badges make a comparison table easier to scan than a column of "yes" and "no".

```markdown {title="Source"}
| Component | Form | Status |
| --- | --- | --- |
| Callouts | `> [!NOTE]` | {{</* badge text="stable" tone="success" */>}} |
| Galleries | ` ```gallery ` fence | {{</* badge text="stable" tone="success" */>}} |
| PlantUML | ` ```plantuml ` fence | {{</* badge text="opt-in" tone="info" */>}} |
| The `image` shortcode | — | {{</* badge text="removed" tone="danger" */>}} |
```

| Component | Form | Status |
| --- | --- | --- |
| Callouts | `> [!NOTE]` | {{< badge text="stable" tone="success" >}} |
| Galleries | ` ```gallery ` fence | {{< badge text="stable" tone="success" >}} |
| PlantUML | ` ```plantuml ` fence | {{< badge text="opt-in" tone="info" >}} |
| The `image` shortcode | — | {{< badge text="removed" tone="danger" >}} |

## In lists and steps {#in-lists}

```markdown {title="Source"}
1. Install Hugo Extended {{</* badge text="≥ 0.168.0" tone="info" */>}}
1. Create a site from OINK Starter and change `baseURL` in `hugo.yaml`
1. `hugo server` to preview {{</* badge text="port 1313" tone="neutral" */>}}
{.steps}
```

1. Install Hugo Extended {{< badge text="≥ 0.168.0" tone="info" >}}
1. Create a site from OINK Starter and change `baseURL` in `hugo.yaml`
1. `hugo server` to preview {{< badge text="port 1313" tone="neutral" >}}
{.steps}

## On cards {#in-cards}

A card has its own `badge` parameter. This plain text appears to the right of the title.
The card body can also contain badge shortcodes.

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

With `link`, the badge becomes an `<a>` element. Site paths, relative paths, `http(s):`, and `mailto:` are supported.

```markdown {title="Source"}
Current version {{</* badge text="v0.5" tone="info" link="/blog/" */>}};
for the upgrade steps see {{</* badge text="Upgrading" tone="neutral" link="/docs/admin/upgrade/" */>}}.
```

Current version {{< badge text="v0.5" tone="info" link="/blog/" >}};
for the upgrade steps see {{< badge text="Upgrading" tone="neutral" link="/docs/admin/upgrade/" >}}.

An invalid link warns and is removed, rendering a plain badge.

## Output {#outputs}

| Output | Shape |
| --- | --- |
| HTML | `<span class="td-badge td-badge--<tone>">`, or `<a class="td-badge …">` when linked |
| Print | Same as HTML, a static inline element |
| Markdown | `**Beta**`, or `[**Beta**](/…)` when linked |
| RSS | Same as print |

Badges load no JavaScript. A badge is not a live region, so adding one does not produce a screen reader announcement.

## Parameter reference {#reference}

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `text` | plain text | — | Required, non-empty. What the reader sees |
| `tone` | enum | `neutral` | `neutral` `info` `success` `warning` `danger` |
| `link` | URL | — | Turns the badge into a link |
{.fields meta="type default"}

Use named parameters only. There is no `icon`, `class`, `color`, `outline`, or `size` parameter.
Invalid input warns and uses a safe fallback: unknown parameters are ignored, empty `text` renders nothing,
invalid `tone` uses `neutral`, and unsafe links are removed.

## Limits {#limits}

- Tone supplements the text. The text must state the status. `{{</* badge text="🔴" */>}}` gives a screen reader no meaning.
- There is no icon parameter. If you need an icon, use [cards](/docs/components/cards/) or a [callout](/docs/components/callout/).
- Keep text short. Badges follow names without wrapping. Put text longer than a few words in the prose.
- Use no more than three badges in one place. More badges make the associated name difficult to find.
- Badges use only shortcodes. There is no native Markdown form. Plain Markdown readers show them as bold text.

## Related {#related}

- [Cards](/docs/components/cards/) — `card` has a `badge` parameter of its own
- [File trees](/docs/components/filetree/) — `tone` uses the same vocabulary
- [Keys](/docs/components/kbd/) — the other inline shortcode
- [Callouts](/docs/components/callout/) — when the status needs explaining
