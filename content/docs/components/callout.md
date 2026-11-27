---
title: Callouts
linkTitle: Callouts
description: Write notes, warnings, and collapsible asides with colors, icons, and titles. Use `> [!NOTE]` blockquotes without shortcodes.
weight: 10
search_keywords: [Callout, Alert, Admonition, note, tip, warning, caution, details, collapsible]
aliases:
  - /docs/components/layout/
---

A callout lifts out the one thing a reader must not miss: a prerequisite, a
destructive command, a version limit. It is an ordinary blockquote whose first
line is a `[!TYPE]` marker, the syntax GitHub and Obsidian use, so the same
source renders as an alert on GitHub and as a plain quote in any other Markdown
reader.

Use them sparingly. When every other paragraph sits in a box, readers stop
seeing the boxes, so if a sentence of prose does the job, write the sentence.

## Shortest form {#minimal}

```markdown {title="Source"}
> [!NOTE]
> Hugo Modules need Go on the machine; an offline archive does not.
```

> [!NOTE]
> Hugo Modules need Go on the machine; an offline archive does not.

Without a title, the callout shows its type name in the page's language:
"Note" in English, 「注意」 in Chinese.

## Ten types {#types}

GitHub defines the first five types and OINK adds five more; each has its own
icon and color, and type names are case-insensitive. Choose the type by what
happens when the reader skips the box: `NOTE` and `TIP` are safe to skip,
`IMPORTANT` means the task fails without it, `WARNING` and `CAUTION` mean
something breaks or slows down, and `DANGER` marks what cannot be undone.

```markdown {title="Source"}
> [!TIP]
> `hugo server -D` previews drafts.

> [!IMPORTANT]
> The floor is Hugo 0.169.0; anything older fails the build outright.

> [!WARNING]
> `hugo --cleanDestinationDir` empties `public/`.

> [!CAUTION]
> The first build after deleting `resources/_gen` is much slower.

> [!SUCCESS]
> All 312 pages built; the site is ready to deploy.

> [!DANGER]
> `rm -rf public/` before a deploy also deletes files you placed there by hand.

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
> The floor is Hugo 0.169.0; anything older fails the build outright.

> [!WARNING]
> `hugo --cleanDestinationDir` empties `public/`.

> [!CAUTION]
> The first build after deleting `resources/_gen` is much slower.

> [!SUCCESS]
> All 312 pages built; the site is ready to deploy.

> [!DANGER]
> `rm -rf public/` before a deploy also deletes files you placed there by hand.

> [!QUESTION]
> Should the site have comments? See [enabling comments](/docs/admin/comments/).

> [!EXAMPLE]
> `pgsty.com` is a documentation site built from callouts and tables alone.

> [!QUOTE]
> Documentation is a love letter that you write to your future self.

## Custom title {#title}

Text after the marker on the same line becomes the title, and it may contain
inline code, bold text and links.

```markdown {title="Source"}
> [!WARNING] Rewrites `public/`
> Check that `baseURL` points at the production domain before a production
> build, or every absolute link will be wrong.
```

> [!WARNING] Rewrites `public/`
> Check that `baseURL` points at the production domain before a production
> build, or every absolute link will be wrong.

## Body content {#body}

The body is ordinary Markdown: lists, fenced code, tables, images, even
another callout. Every line starts with `>`, fence lines included.

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

Put `-` after the type to render the callout closed, or `+` to render it open
with a toggle. Either way it is a native `<details>` element that works
without JavaScript. Fold what most readers can skip: full command output, an
alternative procedure, background reading.

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

`[!DETAILS]` is a disclosure with no color and no icon, closed unless you
write `[!DETAILS]+`. Use it when the content is neither a note nor a warning,
just long: a complete configuration file, a full log.

````markdown {title="Source"}
> [!DETAILS] Full `hugo version` output
> ```text
> hugo v0.169.0+extended+withdeploy darwin/arm64
> ```
````

> [!DETAILS] Full `hugo version` output
> ```text
> hugo v0.169.0+extended+withdeploy darwin/arm64
> ```

## Custom icon {#icon}

To replace the type's icon, put `{icon="fa-solid fa-…"}` (one Font Awesome
class pair) on the line right after the blockquote, with no blank line between
them.

```markdown {title="Source"}
> [!TIP] PostgreSQL 18 is supported
> Pigsty v4 installs PostgreSQL 18 by default.
{icon="fa-solid fa-database"}
```

> [!TIP] PostgreSQL 18 is supported
> Pigsty v4 installs PostgreSQL 18 by default.
{icon="fa-solid fa-database"}

## Nesting {#nesting}

Add one `>` per level. One level is usually enough; deeper nesting is hard to
read.

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

A misspelled type does not break the build or lose content. The block renders
as a plain blockquote with the marker still visible, so the typo is easy to
spot.

```markdown {title="Source"}
> [!NOTICE] Not a valid type
> The marker stays on the page to tell you so.
```

> [!NOTICE] Not a valid type
> The marker stays on the page to tell you so.

Formatters such as Prettier cause the other two common slips:

- They join the title line and the body. Keep an empty `>` line under the
  title.
- They move attribute lines such as `{icon=…}`. Wrap the callout in
  `<!-- prettier-ignore-start -->` and `<!-- prettier-ignore-end -->`.

## Output {#outputs}

Callouts load no script. Print and RSS show every callout expanded, and the
page's Markdown output keeps the original blockquote, marker and title
included.

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

Any other key, `style` and `on*` handlers included, is dropped with a build
warning.

## Limits {#limits}

- The type sets the color; there is no color parameter. When no type fits,
  take the closest one and let the title carry the meaning.
- A reader's open or closed choice is not remembered after a reload.
- Inside a `{.steps}` list item or a `{{%/* steps */%}}` step, indent every
  `>` line to the list item's text. See [Steps](/docs/components/steps/).

## Related {#related}

- [Steps](/docs/components/steps/) — callouts inside a procedure
- [Tabs](/docs/components/tabs/) — the same note split per platform
- [Writing pages](/docs/write/pages/) — when to use a callout and when to use prose
