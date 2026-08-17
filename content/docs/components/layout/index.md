---
downstream_modified: true
title: Callouts, tabs, steps, and cards
linkTitle: Layout
weight: 80
description:
  Structure a page with Markdown-native callouts, tabs, steps, cards, and the
  small set of remaining shortcodes.
---

Most OINK components have a **native form**: one ordinary Markdown block plus a
marker such as `{.steps}` or an attribute line such as `{tab="npm"}`. The source
reads the same on GitHub, in any Markdown editor, and in OINK's own Markdown
output. A shortcode (the **full form**) exists only where a plain block cannot
express the content: arbitrary Markdown bodies inside tabs and cards, processed
images, included files, and the Book pack.

This page covers the structural components. Code fences, tables, images, and the
smaller primitives have their own pages; the
[authoring guide](https://github.com/pgsty/oink/blob/main/docs/components.md) in
the theme repository is the normative API summary.

## Delimiters and markers {#shortcode-delimiters}

Hugo has two shortcode delimiters, and OINK uses them deliberately:

- `{{%/* steps */%}}` is the **only** `{{%/* */%}}` shortcode. Its body is
  top-level page Markdown, so headings inside it enter the table of contents.
- Every other shortcode uses `{{</* name */>}}`. Containers such as `tabs`,
  `cards`, `fields`, and `image` render their Markdown bodies themselves.

Markers are Goldmark block attributes written on the line right after a list or
table: `{.steps}`, `{.cards}`, `{.gallery}`, `{.fields}`, `{.matrix}`, and
`{.full-width}`. Keep the marker directly under the block; a
blank line in between silently detaches it. In the examples below, the
`/* ... */` escape prevents Hugo from executing the displayed shortcode.

Two site settings make the native forms work and are part of the OINK preflight:
`markup.goldmark.renderer.unsafe: true` and
`markup.goldmark.parser.attribute.block: true`.

## Callouts {#callouts}

<a id="alert"></a><a id="pageinfo"></a><a id="helpers-shortcodes"></a>

Callouts are GitHub-style blockquotes with an optional Obsidian-style title and
fold sign. They need no shortcode and no JavaScript.

### Source {#callouts-source}

```markdown
> [!TIP] Titles are inline Markdown
>
> The body is page-level Markdown: lists, fences, tables, nested callouts.

> [!NOTE]- Collapsed by default
>
> A `-` sign folds the callout; `+` folds it but starts open.

> [!DETAILS] Neutral disclosure block
>
> Collapsed by default, no semantic color.
{icon="fa-solid fa-rocket"}
```

### Rendered result {#callouts-rendered-result}

> [!TIP] Titles are inline Markdown
>
> The body is page-level Markdown: lists, fences, tables, nested callouts.

> [!NOTE]- Collapsed by default
>
> A `-` sign folds the callout; `+` folds it but starts open.

> [!DETAILS] Neutral disclosure block
>
> Collapsed by default, no semantic color.
{icon="fa-solid fa-rocket"}

### Types and rules {#callout-types}

| Type                                            | Behaviour                                                           |
| ----------------------------------------------- | ------------------------------------------------------------------- |
| `NOTE` `TIP` `IMPORTANT` `WARNING` `CAUTION`    | The five GitHub types; they render natively on GitHub too           |
| `SUCCESS` `DANGER` `QUESTION` `EXAMPLE` `QUOTE` | Additional semantic types with their own icon and accent            |
| `DETAILS`                                       | Neutral disclosure block, collapsed unless written as `[!DETAILS]+` |
| `[!TYPE]-` / `[!TYPE]+`                         | Fold any type: closed or open by default, native `<details>`        |

- The title after the marker is inline Markdown; when omitted, the localized
  type name is used.
- The attribute line accepts `icon` (exactly one Font Awesome class pair) and
  `class`; `style`, event handlers, and unknown keys fail the build.
- An unknown type is rendered as a plain blockquote with its `[!TYPE]` marker
  left visible, so nothing is lost silently.
- Print and RSS render every callout expanded and static; Markdown output keeps
  the source blockquote.
- If a Markdown formatter such as Prettier runs over your content, keep an empty
  `>` line after the title line (as above) and wrap marker lines such as
  `{icon=…}` or `{.steps}` in `<!-- prettier-ignore-start -->` /
  `<!-- prettier-ignore-end -->`; a formatter would otherwise reflow the title
  into the body or pull the marker into the previous block.

## Tabs {#tabs}

<a id="tabbed-panes"></a><a id="code-groups"></a>

Tabs group equivalent representations — package managers, YAML/TOML/JSON, an
environment variable and its configuration setting. They must not hide
sequential steps or unrelated choices.

### Adjacent fences {#adjacent-fences}

Give consecutive fences a `tab` attribute and they become one tab set. Add a
`group` on the first fence to enable the URL hash, synchronization with other
sets on the page, and browser persistence; every fence of a grouped run then
needs a stable `value`.

**Authoring**

````markdown
```bash {tab="Homebrew" group="install" value="brew"}
brew install pigsty
```

```bash {tab="APT" value="apt"}
sudo apt install pigsty
```
````

**Rendered result**

```bash {tab="Homebrew" group="install" value="brew"}
brew install pigsty
```

```bash {tab="APT" value="apt"}
sudo apt install pigsty
```

Without JavaScript, on GitHub, and in print the reader sees consecutive titled
code blocks; nothing is hidden before the runtime enhances the page. A fence
`tab` coexists with `title` (the filename header stays inside the panel).
[Code blocks](/docs/components/code-blocks/#tabs) documents the complete
attribute contract.

### Adjacent tables {#adjacent-tables}

The same attribute works on tables: consecutive tables with `{tab="…"}` become
one tab set.

| Parameter         | Value |
| ----------------- | ----- |
| `max_connections` | 100   |
{tab="PG 17" group="pgver" value="pg17"}

| Parameter         | Value |
| ----------------- | ----- |
| `max_connections` | 200   |
{tab="PG 16" value="pg16"}

### The `tabs` shortcode {#tabs-shortcode}

Use the shortcode when a tab holds prose, headings, lists, or several blocks:

```go-html-template
{{</* tabs group="setting" default="conf" label="MinIO settings" */>}}
{{</* tab label="Environment Variable" value="env" */>}}
Set `MINIO_LOGGER_WEBHOOK_QUEUE_DIR` in the environment.
{{</* /tab */>}}
{{</* tab label="Configuration Setting" value="conf" */>}}
Set `logger_webhook queue_dir` with `mc admin config set`.

> [!TIP]
> Any block works inside a tab.
{{</* /tab */>}}
{{</* /tabs */>}}
```

{{< tabs group="setting" default="conf" label="MinIO settings" >}}
{{< tab label="Environment Variable" value="env" >}}
Set `MINIO_LOGGER_WEBHOOK_QUEUE_DIR` in the environment.
{{< /tab >}}
{{< tab label="Configuration Setting" value="conf" >}}
Set `logger_webhook queue_dir` with `mc admin config set`.

> [!TIP]
> Any block works inside a tab.
{{< /tab >}}
{{< /tabs >}}

`tabs` accepts `group` (opt-in hash, sync, and persistence), `default` (a child
value, requires `group`), and `label` (accessible tablist name). `tab` requires
`label`; `value` is required with a group and forbidden without one. Duplicate
values, an empty `tabs`, or stray content between children fail the build.

### Behaviour {#tabs-behaviour}

- Grouped sets share `#<group>-<value>` hashes, synchronize on the page, and
  remember the reader's choice in `localStorage` (`td-tabs:v1:<group>`).
  Ungrouped sets switch locally.
- Keyboard: Left/Right (RTL aware) and Home/End move and activate; focus stays
  on the tab.
- Print and RSS render titled static sections; Markdown output renders one
  `**Label**` section per tab.

## Steps {#steps}

Steps number a sequence automatically. The native form is an ordered list with
`{.steps}`; the full form wraps headings.

### Native form {#steps-native}

```markdown
1. Install the dependencies

   Any block can live in a step: paragraphs, fences, callouts, nested lists.

1. ### Initialise the workspace {#init}

   A heading inside a step enters the table of contents.

1. Verify the installation
{.steps}
```

1. Install the dependencies

   Any block can live in a step: paragraphs, fences, callouts, nested lists.

   ```bash
   brew install pigsty
   ```

1. Initialise the workspace

   > [!NOTE]
   > Callouts work inside steps.

1. Verify the installation
{.steps}

Write every item as `1.` so the content indent stays a constant three spaces and
reordering never renumbers by hand. Items may contain any block and any
`{{</* */>}}` shortcode, but not a `{{%/* */%}}` container.

### Full form {#steps-full}

Use `{{%/* steps */%}}` when the steps are long or contain container shortcodes
such as `tabs` or `cards`. Every direct child heading becomes a step; the body
needs no indentation:

{{% steps %}}

#### Create the content {#steps-create-content}

Write one direct child heading for each step, followed by any Markdown content
that belongs to it.

#### Check the sequence {#steps-check-sequence}

Move, add, or remove whole steps. The displayed numbers update automatically.

#### Publish the result {#steps-publish-result}

Verify the sequence on narrow screens and in both color themes.

{{% /steps %}}

```markdown
{{%/* steps */%}}

### Create the content

Add the first instruction.

### Check the sequence

Add the next instruction. The number is generated automatically.

{{%/* /steps */%}}
```

Keep the same heading level for peer steps and do not nest one `steps` block
inside another.

## Cards {#cards}

<a id="doc-cards-and-nav-cards"></a><a id="card-panes"></a><a id="shortcode-card-programming-code"></a><a id="shortcode-card-textual-content"></a>

### Native form {#cards-native}

A link list with `{.cards}` becomes a card grid. The link is the card title;
everything after it is the description.

```markdown
- [Install](/docs/tutorial/) — Deploy from scratch.
- [Configure](/docs/configure/) — Tune the runtime.
{.cards}
```

- [Install](/docs/tutorial/) — Deploy from scratch.
- [Configure](/docs/configure/) — Tune the runtime.
- [Components](/docs/components/) — Everything on this page and more.
{.cards}

### The `cards` shortcode {#cards-shortcode}

Use the shortcode for icons, badges, images, and Markdown bodies:

```go-html-template
{{</* cards */>}}
{{</* card title="Get started" link="/docs/tutorial/" icon="fa-solid fa-rocket" badge="New" */>}}
Build with Hugo, *with Markdown* in the description.
{{</* /card */>}}
{{</* card title="Architecture" link="/docs/about/architecture/" icon="fa-solid fa-diagram-project" */>}}
How the theme fits together.
{{</* /card */>}}
{{</* /cards */>}}
```

{{< cards >}}
{{< card title="Get started" link="/docs/tutorial/" icon="fa-solid fa-rocket" badge="New" >}}
Build with Hugo, *with Markdown* in the description.
{{< /card >}}
{{< card title="Architecture" link="/docs/about/architecture/" icon="fa-solid fa-diagram-project" >}}
How the theme fits together.
{{< /card >}}
{{< card title="Components" link="/docs/components/" image="images/content-primitives/oink.webp" image_alt="OINK documentation overview" >}}
Image cards resolve through the shared image resolver.
{{< /card >}}
{{< /cards >}}

`cards` takes no parameters. `card` accepts `title` (required), `link`, `icon`
(one Font Awesome class pair), `badge` (plain text), and `image` with either
`image_alt` or `decorative=true`. There is no `cols`, `accent`, or `desc`
parameter: the grid adapts to the width and the description is the body.

## Tables {#tables}

Tables have a family of markers and attributes — `{.full-width}`, `{.fields}`,
`{.matrix}`, `{caption="…"}`, numbered Book tables, and `{tab="…"}` — described
on [Tables](/docs/components/tables/).

## Include, param, and comment {#include-external-files}

### Include files {#reuse-documentation}

`include` inlines a page resource, a global asset, or a file under `content/` (a
leading `/` is the content root; otherwise the path is relative to the page's
directory). Without `code=true` the file is Markdown rendered in the page
context; with it, the file becomes a code block:

```go-html-template
{{</* include file="includes/installation.md" */>}}
{{</* include file="includes/config.yaml" code=true lang="yaml" */>}}
```

{{< include file="includes/installation.md" >}}

{{< include file="includes/config.yaml" code=true lang="yaml" >}}

A missing file, `..` in the path, or an unknown parameter fails the build; there
is no draft placeholder. Included Markdown is not an independent published page
and is exempt from the page-pair audit; keep language-specific include files
side by side.

### Print a parameter {#param}

`param` prints a page parameter, falling back through Hugo's `Page.Param` rules
to site configuration:

```go-html-template
OINK requires Hugo {{</* param hugoMinVersion */>}} or later.
```

OINK requires Hugo {{< param hugoMinVersion >}} or later.

A missing parameter fails the build; only scalar values (strings, numbers,
booleans) are printed, HTML-escaped. `param` never injects raw HTML.

### Comments {#comment}

`{{</* comment */>}}…{{</* /comment */>}}` drops its content in every output —
HTML, print, Markdown, and RSS. Use it for editorial notes that must not leak
into `llms.txt`.

## Terminal recordings {#asciinema}

`asciinema` plays a `.cast` recording with the locally vendored player:

```go-html-template
{{</* asciinema file="images/install.cast" speed="1.5" markers="0:Start,1:Done" */>}}
```

{{< asciinema file="images/install.cast" speed="1.5" markers="0:Start,1:Done" >}}

The window title uses `title` when supplied and otherwise displays `file`. Other
parameters include `theme`, `autoplay`, `loop`, `preload`, `speed`, `startAt`,
`poster`, `cols`, `rows`, `idleTimeLimit`, `pauseOnMarkers`, `markers`, and
`fit` (`width`, `height`, `both`, or `none`). Avoid autoplay, remove secrets
from terminal history, and provide nearby text for essential steps.

## OpenAPI {#openapi}

### `swaggerui` {#swaggerui}

Embeds the locally vendored Swagger UI runtime with a specification:

```go-html-template
{{</* swaggerui src="/openapi.yaml" */>}}
```

### `redoc` {#redoc}

Embeds the locally vendored Redoc runtime:

```go-html-template
{{</* redoc "openapi.yaml" */>}}
```

Point both at a page-relative, site-relative, or explicit `http(s)`
specification. A remote specification is a network dependency and can expose
reader metadata to that host; use a same-origin specification for offline and
CSP-safe deployments, and place only one Swagger UI instance on a page.

## Landing pages {#blocks}

<a id="shortcode-blocks"></a><a id="blocks-cover"></a><a id="blocks-lead"></a><a id="blocks-section"></a><a id="blocks-feature"></a><a id="blocks-link-down"></a><a id="td-below-navbar"></a>

The Docsy `blocks/*` shortcodes (`cover`, `lead`, `section`, `feature`,
`link-down`) are gone. Landing pages are built with `layout: landing` and local
data instead — see [Landing pages](/docs/scenarios/landing/) for the section
catalogue and configuration.

## Migrated from 0.4 {#migration}

The following shortcodes were removed in favour of the forms above. The
[migration toolkit](https://github.com/pgsty/oink/blob/main/scripts/migrations/oink06.py)
in the theme repository rewrites existing content (`report`, `migrate`, `check`)
and lists everything it cannot convert automatically.

| Removed                                                                           | Use instead                                               |
| --------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `alert`, `details`, `pageinfo`, raw `<details><summary>`                          | `> [!TYPE] title`, `> [!DETAILS]-`                        |
| `tabpane`/`tab`, `code-group`/`code-tab`                                          | adjacent fences with `{tab=}` or `tabs`/`tab`             |
| `doc-cards`/`doc-card`, `nav-cards`/`nav-card`, `cardpane`/`card`, `doc-carousel` | `{.cards}` list or `cards`/`card`                         |
| `filetree`, `filetree/folder`, `filetree/file`, `{.filetree}` lists               | ` ```filetree ` fence                                     |
| `gallery`, `gallery/image`                                                        | image list + `{.gallery}`                                 |
| `imgproc`                                                                         | `image` (named parameters)                                |
| `readfile`                                                                        | `include`                                                 |
| `echarts`, `infographic` shortcodes                                               | fences of the same name                                   |
| `iframe`, `conditional-text`, `_param`, `blocks/*`                                | raw HTML, separate pages, badges/icons, `layout: landing` |
