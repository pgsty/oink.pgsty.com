---
title: Cards
linkTitle: Cards
description: Add `{.cards}` to a link list to create navigation cards. Use the shortcode for icons, badges, or images.
weight: 80
search_keywords: [Cards, card, link card, navigation card, section index, icon, badge]
---

Cards provide related links. Each card has a linked title and a sentence. The grid adapts to the container width.
Use cards for section landing pages, reading recommendations, or a few related entry points.
Use paragraphs for prose and a [gallery](/docs/components/gallery/) for image collections.

## Shortest form {#minimal}

Add `{.cards}` to a link list to make a card grid. The link becomes the title.
Text after ` — ` becomes the description.

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

The whole card is clickable. There is no `columns` parameter.
The number of columns follows the container width and decreases to one on narrow screens.

## Title-only cards {#title-only}

The description is optional. Put one link on each line and `{.cards}` after the list.

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

If a sentence is insufficient, use a loose list. Put the link and description in separate paragraphs, with blank lines between items.
The title appears above the description. `{.cards}` must immediately follow the last paragraph, with **no blank line** between them.

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

## Icons and badges {#icon-badge}

Link lists do not support icons, badges, images, or descriptions with multiple paragraphs. Use the `cards` / `card` shortcode for these features.
`icon` takes exactly one Font Awesome class pair. `badge` is plain text.

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

An invalid Font Awesome class pair warns and is removed in ordinary previews. Review the warning and rendered fallback before publication.

## Markdown bodies {#markdown-body}

A `card` body uses page-level Markdown, including inline code, emphasis, links, and lists.
Parameters such as `title` and `badge` are plain text. They are not parsed as Markdown.

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

A card without `link` renders as a bold title and produces no link.

## Cards with images {#image}

`image` uses the same resolution order as `![alt](src)`: page resource → current section resource → global resource in `assets/` → static path `/images/…` → remote URL.
Local resources include their intrinsic size, which prevents layout changes during loading.

With `image`, provide exactly one alternative-text source. Use `image_alt="…"` for informative images or `decorative=true` for decorative images.
If you provide both, the theme warns and keeps the alt text. If you provide neither, it warns and makes the image decorative.
Review the warning and rendered fallback before publication.

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

Card images do not take part in [image zoom](/docs/components/image/#zoom) — the
whole card is already a link.

## Automatic cards on section pages {#section-index}

A section landing page (`_index.md`) needs no manual card list. The theme generates cards from each child page's `title`, `description`, and `icon`.
This site enables section cards globally in `hugo.yml`:

```yaml {title="hugo.yml"}
params:
  ui:
    section_index: cards # list | cards
```

A section can override this setting in its front matter. Use `cascade` to apply the setting to the whole subtree:

```yaml {title="content/docs/customize/_index.md"}
section_index: list
```

Automatic and manual cards share the `td-content-card` styles. Only their data source differs.
Do not manually list child pages on a section page. The list can become inconsistent with the sidebar.
Use manual cards for other sets, such as external links or recommendations from other sections.
[Configuration](/docs/customize/config/) defines these keys.

## Which form to use {#forms}

| What you want | Which form |
| --- | --- |
| A grid of links with one-sentence descriptions | `{.cards}` link list |
| Icons, badges, images | `cards` / `card` shortcode |
| Lists, code or several paragraphs in the description | `cards` / `card` shortcode |
| A card with no link | `cards` / `card` shortcode |
| This section's child pages | nothing at all — `section_index: cards` |

The native form stays readable as a link list on GitHub. Shortcodes do not. Use the native form when it supports your content.

## Output {#outputs}

| Output | Shape |
| --- | --- |
| HTML | Native form: `<ul class="cards">`. Shortcode form: `<div class="td-content-cards">` with one `<article class="td-content-card">` each. Both are pure CSS grids and load no script |
| Print | The native form stacks; the shortcode form collapses to two columns; in both, a card avoids breaking across pages |
| Markdown | The native form keeps the link list; the shortcode form emits `- [Title](link) (badge) — description` |
| RSS | The same markup as HTML — a readable list of links without site CSS |

## Parameter reference {#reference}

The native form:

| Element | Type | Default | Description |
| --- | --- | --- | --- |
| `{.cards}` | list attribute line | — | On the line **after** an unordered list; unordered lists only |
| First link in an item | Markdown link | — | The card title and the whole card's click target |
| Everything else | Markdown | — | The description: after ` — ` in a tight list, its own paragraph in a loose one |
{.fields meta="type default"}

`card` parameters (`cards` itself takes none):

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

There is no `cols`, `columns`, `accent`, `desc`, or `color` parameter.
Unknown parameters warn and are ignored in ordinary previews. Review the warning and rendered fallback before publication.

## Limits {#limits}

- `{.cards}` supports only unordered lists. It has no effect on ordered lists.
- `{.cards}` must immediately follow the list. A blank line or indentation inside a list item silently removes the marker.
  The build succeeds, but the result stays a list. Check this line first if no card grid appears.
- A `card` must be inside `cards`. Alone or inside another shortcode, it warns and is skipped. Review the warning and rendered fallback before publication.
- The grid adapts to its container. Its column count cannot be configured.
  Only automatic section cards accept a count, through `params.ui.section_index_columns`.
- If a description exceeds two lines, use a paragraph or a [callout](/docs/components/callout/).

## Related {#related}

- [Fields](/docs/components/fields/) — also has a native form and a shortcode form
- [Galleries](/docs/components/gallery/) — a grid of images
- [Badges](/docs/components/badge/) — inline status labels
- [Organizing content](/docs/write/organize/) — sections, weights and landing pages
- [Configuration](/docs/customize/config/) — `section_index` and friends
