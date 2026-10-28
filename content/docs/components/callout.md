---
title: Callouts
linkTitle: Callouts
description: Write notes, warnings, and collapsible asides with colors, icons, and titles. Use `> [!NOTE]` blockquotes without shortcodes.
weight: 10
search_keywords: [Callout, Alert, Admonition, note, tip, warning, caution, details, collapsible]
aliases:
  - /docs/components/layout/
---

A callout is a GitHub / Obsidian style blockquote. Put `> [!TYPE]` on the first line and the body below it.
Use callouts to separate prerequisites, warnings, and asides from prose. If a prose sentence is sufficient, a callout is unnecessary.

## Shortest form {#minimal}

```markdown {title="Source"}
> [!NOTE]
> Hugo Modules need Go on the machine; an offline archive does not.
```

> [!NOTE]
> Hugo Modules need Go on the machine; an offline archive does not.

If you omit the title, the callout uses the localized type name: "Note" in English or 「注意」 in Chinese.
GitHub displays the source as a GitHub callout. Other Markdown readers display a plain blockquote. All content remains available.

## Ten types {#types}

The first five types match GitHub. OINK adds five semantic types. Each type has a default icon and accent color.

```markdown {title="Source"}
> [!TIP]
> `hugo server -D` previews drafts.

> [!IMPORTANT]
> The floor is Hugo Extended 0.168.0; anything older fails the build outright.

> [!WARNING]
> `hugo --cleanDestinationDir` empties `public/`.

> [!CAUTION]
> The first build after deleting `resources/_gen` is much slower.

> [!SUCCESS]
> Build passed with reviewed warnings — ship it.

> [!DANGER]
> Never commit `go.work`.

> [!QUESTION]
> Should the site have comments? See [enabling comments](/docs/admin/comments/).

> [!EXAMPLE]
> `pgsty.com` is a documentation site built from callouts and tables alone.

> [!QUOTE]
> Documentation is a love letter that you write to your future self.
```

> [!TIP]
> `hugo server -D` previews drafts.

> [!IMPORTANT]
> The floor is Hugo Extended 0.168.0; anything older fails the build outright.

> [!WARNING]
> `hugo --cleanDestinationDir` empties `public/`.

> [!CAUTION]
> The first build after deleting `resources/_gen` is much slower.

> [!SUCCESS]
> Build passed with reviewed warnings — ship it.

> [!DANGER]
> Never commit `go.work`.

> [!QUESTION]
> Should the site have comments? See [enabling comments](/docs/admin/comments/).

> [!EXAMPLE]
> `pgsty.com` is a documentation site built from callouts and tables alone.

> [!QUOTE]
> Documentation is a love letter that you write to your future self.

Type names are case-insensitive.

## Custom title {#title}

Text after the marker on the same line becomes the title. It accepts inline Markdown, including code, bold text, and links.

```markdown {title="Source"}
> [!WARNING] Rewrites `public/`
> Check that `baseURL` points at the production domain before a production
> build, or every absolute link will be wrong.
```

> [!WARNING] Rewrites `public/`
> Check that `baseURL` points at the production domain before a production
> build, or every absolute link will be wrong.

## Body content {#body}

The body uses page-level Markdown. It can contain lists, fenced code, tables, images, and nested callouts.
Start every line with `>`, including fence lines.

````markdown {title="Source"}
> [!TIP] Three commands to a live preview
>
> 1. Clone: `git clone https://github.com/pgsty/oink-starter my-docs`
> 2. Enter the directory and preview:
>    ```bash
>    cd my-docs && hugo server
>    ```
> 3. Open <http://localhost:1313/>
>
> | Port | Purpose |
> | --- | --- |
> | 1313 | Hugo development server |
````

> [!TIP] Three commands to a live preview
>
> 1. Clone: `git clone https://github.com/pgsty/oink-starter my-docs`
> 2. Enter the directory and preview:
>    ```bash
>    cd my-docs && hugo server
>    ```
> 3. Open <http://localhost:1313/>
>
> | Port | Purpose |
> | --- | --- |
> | 1313 | Hugo development server |

## Collapsing {#collapsible}

A `-` after the type makes the callout initially closed. A `+` makes it initially open.
Both use native `<details>` and load no JavaScript. Use them for full command output, alternatives, or background information that can remain hidden initially.

```markdown {title="Source"}
> [!NOTE]- Why is Go needed?
> Hugo downloads themes through Go's module system (`hugo mod get`). A submodule
> or an offline archive works without Go installed.

> [!TIP]+ Open by default, but the reader can close it
> The closed state is not remembered; a reload returns to the default.
```

> [!NOTE]- Why is Go needed?
> Hugo downloads themes through Go's module system (`hugo mod get`). A submodule
> or an offline archive works without Go installed.

> [!TIP]+ Open by default, but the reader can close it
> The closed state is not remembered; a reload returns to the default.

## The neutral disclosure, DETAILS {#details}

`[!DETAILS]` is a disclosure without a semantic color. It is closed by default; `[!DETAILS]+` is open.
Use it for long output, complete configuration files, or other content that must be collapsible.

````markdown {title="Source"}
> [!DETAILS] Full `hugo version` output
> ```text
> hugo v0.168.0+extended+withdeploy darwin/arm64
> ```
````

> [!DETAILS] Full `hugo version` output
> ```text
> hugo v0.168.0+extended+withdeploy darwin/arm64
> ```

## Custom icon {#icon}

To replace the default icon, put `{icon="fa-solid fa-xxx"}` after the blockquote. Use one Font Awesome class pair.
The attribute line must immediately follow the blockquote, with no blank line between them.

```markdown {title="Source"}
> [!TIP] PostgreSQL 18 is supported
> Pigsty v4 installs PostgreSQL 18 by default.
{icon="fa-solid fa-database"}
```

> [!TIP] PostgreSQL 18 is supported
> Pigsty v4 installs PostgreSQL 18 by default.
{icon="fa-solid fa-database"}

## Nesting {#nesting}

To nest callouts, add one `>` per level. Callouts can also appear inside list items or steps.
One nesting level is sufficient.

```markdown {title="Source"}
> [!WARNING] Back up before upgrading
> A theme version bump can change how a page renders.
>
> > [!TIP]- How to back up
> > `git tag pre-upgrade` is enough — rolling back is `git checkout pre-upgrade`.
```

> [!WARNING] Back up before upgrading
> A theme version bump can change how a page renders.
>
> > [!TIP]- How to back up
> > `git tag pre-upgrade` is enough — rolling back is `git checkout pre-upgrade`.

## Unknown types and common slips {#pitfalls}

Unknown type names do not fail the build or remove content. The block renders as an ordinary blockquote with its `[!TYPE]` marker visible.

```markdown {title="Source"}
> [!NOTICE] Not a valid type
> The marker stays on the page to tell you so.
```

> [!NOTICE] Not a valid type
> The marker stays on the page to tell you so.

Other common problems:

- Formatters such as Prettier can merge titles into the body. Keep an empty `>` line below the title to prevent this.
- Formatters can move attribute lines. Wrap marker lines such as `{icon=…}` in `<!-- prettier-ignore-start -->` / `<!-- prettier-ignore-end -->`.
- `style`, `onclick`, and unsupported attributes warn and are ignored. The attribute line accepts only `icon` and `class`.
  See the table below.

## Output {#outputs}

| Output | Shape |
| --- | --- |
| HTML | Static types are `<div class="td-callout" role="note">`; collapsible types are a native `<details>` + `<summary>` |
| Print | All static and expanded; disclosures carry a `data-td-callout-collapsible` marker |
| Markdown | The source blockquote is preserved, `[!TYPE]` marker and title included |
| RSS | Same as print — static and expanded |

Callouts load no script.

## Parameter reference {#reference}

The marker line `> [!TYPE]±  Title`:

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `TYPE` | enum | — | `NOTE` `TIP` `IMPORTANT` `WARNING` `CAUTION` `SUCCESS` `DANGER` `QUESTION` `EXAMPLE` `QUOTE` `DETAILS`; case-insensitive; an unknown value renders as a plain blockquote |
| `±` | `-` / `+` / none | none | `-` collapses closed, `+` collapses open; bare `DETAILS` is closed |
| Title | inline Markdown | the localized type name | On the same line as the marker |
{.fields meta="type default"}

The attribute line `{…}`, immediately after the blockquote:

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `icon` | Font Awesome class pair | the type's icon | For example `fa-solid fa-database`; `DETAILS` has no default icon |
| `class` | space-separated classes | — | Passed through verbatim for site CSS |
{.fields meta="type default"}

`style`, `on*`, and other keys warn and are ignored.

## Limits {#limits}

- Colors cannot be customized. The type sets the color. If you need a new meaning, choose the nearest type and write a title.
- The collapsed state is not saved.
- Callouts work inside `{.steps}` list items and `{{%/* steps */%}}` steps. See [Steps](/docs/components/steps/).
  Start every blockquote line with `>` and align it with the list item's indentation.

## Related {#related}

- [Steps](/docs/components/steps/) — callouts inside a procedure
- [Tabs](/docs/components/tabs/) — the same note split per platform
- [Writing pages](/docs/write/pages/) — when to use a callout and when to use prose
