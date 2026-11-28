---
title: Badge
linkTitle: Badge
description: Mark a feature, version or table cell with a short status label such as Beta or deprecated, in one of five semantic tones.
weight: 150
search_keywords: [Badge, status label, tone, Beta, deprecated, neutral, info, success, warning, danger]
---

A badge is a small inline label that sits after a name and states its status
in a word or two: Beta, deprecated, v0.5, needs a server. You choose what the
status means, one of five tones, and the theme picks colors that keep their
contrast in light and dark mode. When the status needs a reason, a procedure
or a deadline, write a sentence or a [callout](/docs/components/callout/)
instead.

## Shortest form {#minimal}

```markdown {title="Source"}
{{</* badge text="Beta" tone="warning" */>}}
```

{{< badge text="Beta" tone="warning" >}}

`text` is the only required parameter, and it must not be empty.

## Five tones {#tones}

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

Without `tone` a badge is `neutral`. Any value other than these five warns
and falls back to `neutral`, and there is no way to set a custom color.

## Inside a sentence {#inline}

A badge follows the name it describes, on the same line:

```markdown {title="Source"}
Logical replication {{</* badge text="off by default" tone="neutral" */>}} needs
`wal_level = logical`. The `pg_duckdb` extension {{</* badge text="opt-in" tone="info" */>}}
is installed separately, and the backup repository {{</* badge text="needs a server" tone="warning" */>}}
must point at an object store before the first backup runs.
```

Logical replication {{< badge text="off by default" tone="neutral" >}} needs
`wal_level = logical`. The `pg_duckdb` extension {{< badge text="opt-in" tone="info" >}}
is installed separately, and the backup repository {{< badge text="needs a server" tone="warning" >}}
must point at an object store before the first backup runs.

## Next to a heading {#in-headings}

Do not put a badge, or any other shortcode, in a heading. Hugo builds the
table of contents before it expands shortcodes, so the heading looks right
but its table-of-contents entry shows an internal Hugo placeholder. Put the
badge at the start of the first paragraph instead:

```markdown {title="Source"}
### OpenAPI pages {#openapi-example}

{{</* badge text="new in 0.5" tone="success" */>}} This section covers…
```

### OpenAPI pages {#openapi-example}

{{< badge text="new in 0.5" tone="success" >}} The badge sits right under the
heading, the table of contents stays clean, and a shared link to the heading
does not carry the badge text.

## In table cells {#in-tables}

In a comparison table, a column of badges is quicker to scan than a column of
"yes" and "no":

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
1. Install Hugo {{</* badge text="≥ 0.169.0" tone="info" */>}}
1. Create a site from OINK Starter and change `baseURL` in `hugo.yaml`
1. `hugo server` to preview {{</* badge text="port 1313" tone="neutral" */>}}
{.steps}
```

1. Install Hugo {{< badge text="≥ 0.169.0" tone="info" >}}
1. Create a site from OINK Starter and change `baseURL` in `hugo.yaml`
1. `hugo server` to preview {{< badge text="port 1313" tone="neutral" >}}
{.steps}

## On cards {#in-cards}

A card has a `badge` parameter of its own, plain text shown beside the title,
and its body can hold badge shortcodes as well:

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

`link` turns the badge into a link. It accepts a site path, a relative path,
an `http(s):` URL or a `mailto:` address:

```markdown {title="Source"}
Current version {{</* badge text="v0.5" tone="info" link="/blog/" */>}};
for the upgrade steps see {{</* badge text="Upgrading" tone="neutral" link="/docs/admin/upgrade/" */>}}.
```

Current version {{< badge text="v0.5" tone="info" link="/blog/" >}};
for the upgrade steps see {{< badge text="Upgrading" tone="neutral" link="/docs/admin/upgrade/" >}}.

An invalid link warns and is dropped, leaving a plain badge.

## Output {#outputs}

Badges load no script, and print and RSS show them as they appear on the
page. A badge exists only as a shortcode, with no native Markdown form, so the
page's Markdown output turns it into bold text: `**Beta**`, or `[**Beta**](/…)`
when it has a link.

## Parameter reference {#reference}

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `text` | plain text | — | Required, non-empty. What the reader sees |
| `tone` | enum | `neutral` | `neutral` `info` `success` `warning` `danger` |
| `link` | URL | — | Turns the badge into a link |
{.fields meta="type default"}

Badges take named parameters only; there is no `icon`, `class`, `color`,
`outline` or `size`. Mistakes warn and fall back: an unknown parameter is
ignored, a missing or empty `text` renders nothing, an unknown `tone` becomes
`neutral`, and an unsafe link is dropped.

## Limits {#limits}

- The color only reinforces the text, so the text must state the status on
  its own. `{{</* badge text="🔴" */>}}` tells a screen reader nothing.
- There is no icon parameter. For an icon, use [cards](/docs/components/cards/)
  or a [callout](/docs/components/callout/).
- Keep the text to a few words. A badge does not wrap, so longer text belongs
  in the sentence.
- Use at most three badges in one place; a row of them buries the name they
  describe.

## Related {#related}

- [Cards](/docs/components/cards/) — `card` has a `badge` parameter of its own
- [File trees](/docs/components/filetree/) — `tone` uses the same vocabulary
- [Keys](/docs/components/kbd/) — the other inline shortcode
- [Callouts](/docs/components/callout/) — when the status needs explaining
