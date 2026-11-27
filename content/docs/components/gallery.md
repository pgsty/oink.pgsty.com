---
title: Gallery
linkTitle: Gallery
description: Lay out a set of related screenshots as a responsive grid with a `gallery` fence, each with an optional description or link.
weight: 170
search_keywords: [Gallery, screenshot grid, fence, image zoom, link, class]
image_zoom: true
---

A gallery puts related images side by side so readers can compare them: the
screens of a setup wizard, the light and dark versions of a dashboard, the
same chart before and after a fix. You write one image per line inside a
`gallery` fence, and the theme lays them out as a grid that drops columns as
the screen narrows.

Use an [image](/docs/components/image/) for a single picture. Images without an
order or a comparison between them are better as separate figures in the text.

## Shortest form {#minimal}

Each line is a Markdown image, `![alt](src)`.

````markdown {title="Source"}
```gallery
![OINK's default documentation shell](/images/oink.webp)
![The classic Docsy layout upstream](/images/docsy.webp)
```
````

```gallery
![OINK's default documentation shell](/images/oink.webp)
![The classic Docsy layout upstream](/images/docsy.webp)
```

Always write the alt text. It is the item's title, the only text a screen
reader announces for it, and what makes the image eligible for zoom. There is
no column setting: the grid follows the width of its container.

## Descriptions {#description}

Put ` # ` after the image to add a description under it. Descriptions are
plain text, so Markdown in them shows literally; write `\#` for a literal hash.

````markdown {title="Source"}
```gallery
![The three-column layout of an OINK page](/images/oink.webp) # The default shell: sidebar, article, table of contents
![The classic Docsy documentation layout](/images/docsy.webp) # Docsy upstream — the content model is the same lineage
![A release notes page](/images/releasenote.webp) # Release cards use release_url and date; checksums blocks list download assets
```
````

```gallery
![The three-column layout of an OINK page](/images/oink.webp) # The default shell: sidebar, article, table of contents
![The classic Docsy documentation layout](/images/docsy.webp) # Docsy upstream — the content model is the same lineage
![A release notes page](/images/releasenote.webp) # Release cards use release_url and date; checksums blocks list download assets
```

Descriptions may differ in length: the items in a row line up with the tallest
one, and a description that wraps does not push its neighbors around. The
image is parsed before the description, so a `#` inside alt text or a path
needs no escaping.

## A link per item {#link}

Add `{link=…}` at the end of a line to make that item a link, for example to
the page that explains the screen. Site paths, relative paths and `http(s):`
URLs are accepted.

````markdown {title="Source"}
```gallery
![OINK's default documentation shell](/images/oink.webp) # Opens the Images component page {link=/docs/components/image/}
![A release notes page](/images/releasenote.webp) # Opens "Releases and downloads" {link=/docs/write/releases/}
```
````

```gallery
![OINK's default documentation shell](/images/oink.webp) # Opens the Images component page {link=/docs/components/image/}
![A release notes page](/images/releasenote.webp) # Opens "Releases and downloads" {link=/docs/write/releases/}
```

A click on a linked item follows the link, so that item does not zoom. One
gallery can mix both kinds: linked items open their page, the others open the
full image.

## Where images come from {#sources}

Each source is looked up like a plain image: a page resource in the page
bundle, then a global resource under `assets/`, then a static path such as
`/images/…`, then a remote URL. The theme reads the size of local resources
and writes it into the page, so the grid does not jump while images load.
Remote images are neither downloaded nor measured at build time.

````markdown {title="Source"}
```gallery
![OINK documentation overview (global resource)](images/content-primitives/oink.webp) # Under assets/images/…, eligible for build-time processing
![The light home page (static path)](/images/hero-light.webp) # Under static/images/…, published as is
```
````

```gallery
![OINK documentation overview (global resource)](images/content-primitives/oink.webp) # Under assets/images/…, eligible for build-time processing
![The light home page (static path)](/images/hero-light.webp) # Under static/images/…, published as is
```

A page or global resource that cannot be found is kept as a static path. The
theme does not check whether static paths or remote URLs exist, so a typo
there shows up as a broken image in the browser.

## Decorative images and zoom {#zoom}

Empty alt text marks an image as decorative: it gets no title, screen readers
skip it, and it never zooms.

Image zoom is off by default and turned on with `params.ui.image_zoom` for the
whole site or with `image_zoom` in a page's front matter; this page does the
latter. Every image above that has alt text and no link opens at full size,
and <kbd>Esc</kbd> closes it and returns focus to the image.

```yaml {title="this page's front matter"}
image_zoom: true
```

````markdown {title="Source: one decorative image, one ordinary one"}
```gallery
![](/images/docsy.webp) # Decorative, never zooms
![The Pigsty release notes page](/images/releasenote.webp) # Has alt text, so it opens
```
````

```gallery
![](/images/docsy.webp) # Decorative, never zooms
![The Pigsty release notes page](/images/releasenote.webp) # Has alt text, so it opens
```

Galleries reuse the page's single zoom dialog instead of bringing their own,
and the zoom script loads only when the page has at least one image that can
zoom. [Images · Zoom](/docs/components/image/#zoom) lists the full rules.

## Classes and tabs {#class-and-tabs}

`class` adds a CSS class for your own styles, either to the whole fence (after
the language) or to one item (at the end of its line); the theme passes it
through without interpreting it. A fence with `tab=` (and `group=` /
`value=`) becomes one panel of a [tab set](/docs/components/tabs/), which
suits one gallery per platform or per color scheme.

````markdown {title="Source"}
```gallery {tab="OINK" group="shell" value="oink"}
![OINK's default documentation shell](/images/oink.webp) # Sidebar, article, table of contents
```
```gallery {tab="Docsy" value="docsy"}
![The classic Docsy layout upstream](/images/docsy.webp) # The same content-model lineage
```
````

```gallery {tab="OINK" group="shell" value="oink"}
![OINK's default documentation shell](/images/oink.webp) # Sidebar, article, table of contents
```
```gallery {tab="Docsy" value="docsy"}
![The classic Docsy layout upstream](/images/docsy.webp) # The same content-model lineage
```

## Output {#outputs}

Galleries load no script of their own, and every image is lazy-loaded. Print
and RSS stack the images without zoom, and the page's Markdown output keeps
the `gallery` fence as you wrote it.

## Parameter reference {#reference}

The line syntax `![alt](src) [# description] [{key=value …}]`:

| Element | Required | Description |
| --- | --- | --- |
| `![alt](src)` | yes | Must start the line. `alt` is the item's title; empty means decorative |
| `src` | yes | Page resource / global resource / static path / remote URL |
| `# description` | no | Plain text under the image; `\#` is a literal hash; must not be empty |
| `{link=…}` | no | Makes the item a link, and therefore not zoomable |
| `{class=…}` | no | Adds a site CSS class to that item |
{.fields}

Fence attributes:

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `tab` | plain text | — | Makes this gallery one panel of a tab set |
| `group` / `value` | string | — | Tab group and sync value; must appear with `tab` |
| `class` | class list | — | Passed through for site CSS |
{.fields meta="type default"}

There is no `columns`, `caption` or `title` attribute. A malformed line or
attribute warns with its line number in the fence, and only the broken part or
line is dropped.

## Limits {#limits}

- The fence is the only form; there is no `{.gallery}` list marker and no
  shortcode. GitHub therefore shows the source rather than the images.
- You cannot set the number of columns, and images keep their own proportions
  instead of being cropped to a common shape.
- There is no slideshow, carousel or previous / next control; the zoom dialog
  shows one image at a time.
- Remote images are not downloaded at build time, so their size is unknown
  until the browser loads them and the layout can shift.
- Descriptions do not render Markdown; put rich text in a paragraph below the
  gallery.

For a whole album with a sidebar, page-by-page browsing and drag-to-pan
viewing, use the [Expo layout](/docs/write/expo/); a `gallery` fence is for a
group of images inside a text page.

## Related {#related}

- [Images](/docs/components/image/) — single images, captions, numbering, the zoom switch
- [Cards](/docs/components/cards/) — a grid of links with images
- [Tabs](/docs/components/tabs/) — one gallery per platform or theme
- [File trees](/docs/components/filetree/) — the same line syntax family
