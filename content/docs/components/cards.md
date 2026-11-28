---
title: Cards
linkTitle: Cards
description: Turn a Markdown link list into a grid of navigation cards, and use the shortcode when cards need icons, badges or images.
weight: 250
search_keywords: [Cards, card, link card, navigation card, section index, icon, badge]
---

Cards lay out a few parallel destinations so the reader can pick one at a
glance: where to start, what to read next, which of three paths fits. Each card
is a linked title with a sentence under it, and the grid adapts to the width
of the page. A plain Markdown link list with `{.cards}` under it is all it
takes, so the source stays an ordinary list on GitHub. Do not use cards for
prose, which reads better as paragraphs, or for image collections, which
belong in a [gallery](/docs/components/gallery/). A section's own landing page
usually needs no hand-written cards at all, because the theme can generate
them from the child pages ([automatic cards](#section-index)).

## Shortest form {#minimal}

Put `{.cards}` on the line after a link list. Each link becomes a card title,
and the text after ` — ` becomes its description:

```markdown {title="Source"}
- [Get started](/docs/start/) — Start with OINK Starter, preview locally, then replace the site details with your own.
- [Authoring](/docs/write/) — How pages are organized and which front matter keys exist.
- [Customization](/docs/customize/) — Navigation, search, branding, languages.
{.cards}
```

- [Get started](/docs/start/) — Start with OINK Starter, preview locally, then replace the site details with your own.
- [Authoring](/docs/write/) — How pages are organized and which front matter keys exist.
- [Customization](/docs/customize/) — Navigation, search, branding, languages.
{.cards}

The whole card is the click target, not just the title. The number of columns
follows the available width, down to one on a phone, so there is no
`columns` parameter.

## Title-only cards {#title-only}

The description is optional: one link per item is enough.

```markdown {title="Source"}
- [Callouts](/docs/components/callout/)
- [Tabs](/docs/components/tabs/)
- [Steps](/docs/components/steps/)
- [Fields](/docs/components/fields/)
{.cards}
```

- [Callouts](/docs/components/callout/)
- [Tabs](/docs/components/tabs/)
- [Steps](/docs/components/steps/)
- [Fields](/docs/components/fields/)
{.cards}

## Loose lists and longer descriptions {#loose}

When a description needs more than a sentence, write a loose list: the link in
one paragraph, the description in the next, and a blank line between items.
The title then sits on its own line above the description. `{.cards}` still
goes directly under the last paragraph, with **no blank line** in between.

```markdown {title="Source"}
- [Front matter](/docs/write/frontmatter/)

  Every page parameter is defined here exactly once: type, default, accepted
  values, and the page that explains it.

- [Configuration](/docs/customize/config/)

  Site parameters grouped by feature, each row linking back to the guide that
  explains it.
{.cards}
```

- [Front matter](/docs/write/frontmatter/)

  Every page parameter is defined here exactly once: type, default, accepted
  values, and the page that explains it.

- [Configuration](/docs/customize/config/)

  Site parameters grouped by feature, each row linking back to the guide that
  explains it.
{.cards}

## Single-column list {#presentation}

For a directory of resources, where readers scan down rather than across,
write `{.cards .td-cards-list}` instead of `{.cards}`. The cards become one
column inside a single frame, separated by dividers, and each row grows with
its description. The shortcode form takes `cards variant="list"` for the same
result; any other `variant` warns and keeps the grid.
[Component presentation](/docs/components/presentation/#cards) shows the grid
and the list one after the other.

## Icons and badges {#icon-badge}

A link list cannot carry icons, badges, images or a description with several
paragraphs; the `cards` and `card` shortcodes can. `icon` is exactly one Font
Awesome class pair, and `badge` is a short plain-text label beside the title.

```markdown {title="Source"}
{{</* cards */>}}
{{</* card title="Get started" link="/docs/start/" icon="fa-solid fa-rocket" badge="start here" */>}}
Use OINK Starter and establish a local preview before customizing.
{{</* /card */>}}
{{</* card title="Release and download pages" link="/docs/write/releases/" icon="fa-solid fa-box-open" badge="v0.5" */>}}
A release card from `release_url` and `date`, plus a `checksums` block for download assets.
{{</* /card */>}}
{{</* card title="Keyboard navigation" link="/docs/customize/keyboard/" icon="fa-solid fa-keyboard" */>}}
Site-wide shortcuts and focus order.
{{</* /card */>}}
{{</* /cards */>}}
```

{{< cards >}}
{{< card title="Get started" link="/docs/start/" icon="fa-solid fa-rocket" badge="start here" >}}
Use OINK Starter and establish a local preview before customizing.
{{< /card >}}
{{< card title="Release and download pages" link="/docs/write/releases/" icon="fa-solid fa-box-open" badge="v0.5" >}}
A release card from `release_url` and `date`, plus a `checksums` block for download assets.
{{< /card >}}
{{< card title="Keyboard navigation" link="/docs/customize/keyboard/" icon="fa-solid fa-keyboard" >}}
Site-wide shortcuts and focus order.
{{< /card >}}
{{< /cards >}}

An `icon` that is not a single class pair such as `fa-solid fa-rocket` warns,
and the card renders without it.

## Markdown bodies {#markdown-body}

The body of a `card` is ordinary Markdown, so it can hold inline code,
emphasis, links and lists. Parameters such as `title` and `badge` are plain
text.

```markdown {title="Source"}
{{</* cards */>}}
{{</* card title="Hugo Module" icon="fa-brands fa-golang" */>}}
`hugo mod get github.com/pgsty/oink`. The recommended way; upgrading is one
version line.
{{</* /card */>}}
{{</* card title="Git submodule" icon="fa-solid fa-code-branch" */>}}
No Go installation needed:

- `git submodule add`
- the theme lands in `themes/oink`
{{</* /card */>}}
{{</* /cards */>}}
```

{{< cards >}}
{{< card title="Hugo Module" icon="fa-brands fa-golang" >}}
`hugo mod get github.com/pgsty/oink`. The recommended way; upgrading is one
version line.
{{< /card >}}
{{< card title="Git submodule" icon="fa-solid fa-code-branch" >}}
No Go installation needed:

- `git submodule add`
- the theme lands in `themes/oink`
{{< /card >}}
{{< /cards >}}

A card without `link`, like these two, shows its title in bold and links
nowhere.

## Cards with images {#image}

`image` puts a picture at the top of the card. It is looked up like
`![alt](src)`: page resource, then the current section's resources, then a
global resource in `assets/`, then a static path such as `/images/…`, then a
remote URL. Local images carry their width and height, so the page does not
jump while they load.

Every image needs exactly one of `image_alt="…"`, for an image that carries
information, or `decorative=true`, for one that is only ornament. With both,
the build warns and keeps the alt text; with neither, it warns and treats the
image as decorative.

```markdown {title="Source"}
{{</* cards */>}}
{{</* card title="The OINK shell" link="/docs/about/features/" image="/images/oink.webp" image_alt="An OINK documentation page: sidebar, article and table of contents" */>}}
Sidebar, article, table of contents — each can be turned off on its own.
{{</* /card */>}}
{{</* card title="Release notes" link="/docs/write/releases/" image="/images/releasenote.webp" decorative=true */>}}
A decorative cover: `decorative=true` emits an empty alt and screen readers skip it.
{{</* /card */>}}
{{</* /cards */>}}
```

{{< cards >}}
{{< card title="The OINK shell" link="/docs/about/features/" image="/images/oink.webp" image_alt="An OINK documentation page: sidebar, article and table of contents" >}}
Sidebar, article, table of contents — each can be turned off on its own.
{{< /card >}}
{{< card title="Release notes" link="/docs/write/releases/" image="/images/releasenote.webp" decorative=true >}}
A decorative cover: `decorative=true` emits an empty alt and screen readers skip it.
{{< /card >}}
{{< /cards >}}

Card images do not open in the [image zoom](/docs/components/image/#zoom)
dialog, because clicking anywhere on the card already follows its link.

## Automatic cards on section pages {#section-index}

A section's landing page (`_index.md`) can list its child pages as cards with
no list in the source: the theme builds one card per child from its `title`,
`description` and `icon`. This site turns that on for every section:

```yaml {title="hugo.yml"}
params:
  ui:
    section_index: cards # list | cards
```

A section can choose differently in its own front matter, and `cascade` passes
the choice down to its whole subtree:

```yaml {title="content/docs/customize/_index.md"}
section_index: list
```

Generated and hand-written cards share the same styles; only the source of
the data differs. Let the theme list a section's child pages, because a
hand-written list drifts out of step with the sidebar as pages are added or
renamed. Write cards by hand for anything else, such as external links or
recommendations from other sections. [Configuration](/docs/customize/config/)
defines these keys.

## Which form to use {#forms}

| What you want | Which form |
| --- | --- |
| A grid of links with one-sentence descriptions | `{.cards}` link list |
| Icons, badges, images | `cards` / `card` shortcode |
| Lists, code or several paragraphs in the description | `cards` / `card` shortcode |
| A card with no link | `cards` / `card` shortcode |
| This section's child pages | nothing at all — `section_index: cards` |

Use the link list whenever it can hold your content: it still reads as a list
of links on GitHub, while shortcodes do not.

## Output {#outputs}

Cards are pure CSS and load no script. In print, link-list cards stack in one
column, shortcode cards fall back to two columns, and no card breaks across a
page. In the page's Markdown output, a link list stays as written and each
shortcode card becomes a line `- [Title](link) (badge) — description`.

## Parameter reference {#reference}

The native form:

| Element | Type | Default | Description |
| --- | --- | --- | --- |
| `{.cards}` | list attribute line | — | On the line **after** an unordered list; unordered lists only. Add `.td-cards-list` for the single-column list |
| First link in an item | Markdown link | — | The card title and the whole card's click target |
| Everything else | Markdown | — | The description: after ` — ` in a tight list, its own paragraph in a loose one |
{.fields meta="type default"}

`card` parameters (`cards` itself takes only an optional `variant="list"`):

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | plain text | — | Required, non-empty. The card title |
| `link` | URL | — | Site path, relative path, `http(s):`, `mailto:`; external links get `rel="noopener"` |
| `icon` | Font Awesome class pair | — | For example `fa-solid fa-rocket`; a malformed value warns and is dropped |
| `badge` | plain text | — | A small label beside the title |
| `image` | image source | — | Page resource / global resource / static path / remote URL |
| `image_alt` | plain text | — | With `image`, exactly one of this and `decorative` |
| `decorative` | boolean | `false` | `true` marks a decorative image and emits an empty alt |
| Body | Markdown | — | The card description |
{.fields meta="type default"}

There is no `cols`, `columns`, `accent`, `desc` or `color` parameter. Unknown
parameters warn and are ignored.

## Limits {#limits}

- `{.cards}` works on unordered lists only; on a numbered list it does
  nothing.
- `{.cards}` must sit directly under the list. A blank line before it, or
  indentation that puts it inside the last item, loses the marker without a
  warning: the build succeeds and the list stays a list. When no grid
  appears, check that line first.
- A `card` outside `cards`, alone or inside another shortcode, warns and is
  skipped.
- Only automatic section cards take a column count, through
  `params.ui.section_index_columns`; hand-written grids always follow the
  width.
- A description longer than two lines belongs in a paragraph or a
  [callout](/docs/components/callout/).

## Related {#related}

- [Fields](/docs/components/fields/) — also has a native form and a shortcode form
- [Galleries](/docs/components/gallery/) — a grid of images
- [Badges](/docs/components/badge/) — inline status labels
- [Organizing content](/docs/write/organize/) — sections, weights and landing pages
- [Configuration](/docs/customize/config/) — `section_index` and friends
