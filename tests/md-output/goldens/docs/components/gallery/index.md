# Gallery

> Use a `gallery` fence for a responsive image grid with optional descriptions and links. Images share the page zoom dialog.

---

LLMS index: [llms.txt](/llms.txt)

---

A gallery displays related images in a responsive grid. Put one image per line inside the fence.
Use it for multiple views of the same subject, such as screenshots, states, or color schemes.
Use an [image](/docs/components/image/) for a single picture. Gallery images should have an order or support a comparison.

## Shortest form {#minimal}

Write one image per line with Markdown's `![alt](src)` syntax.

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

Alternative text is mandatory. It sets the item's title, supplies its only screen reader text, and determines zoom eligibility.
There is no column parameter. The grid follows the container width and reduces columns on narrow screens.

## Descriptions {#description}

Add ` # ` after the image to start a description below it.
Descriptions are plain text. Markdown appears literally. Use `\#` for a literal hash.

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

Descriptions can have different lengths. The grid aligns to the tallest item, and wrapped descriptions do not affect neighboring items.
The image is parsed first. A `#` in alternative text or a path needs no escaping.

## A link per item {#link}

Put `{link=…}` at the end of a line to make that item a link. Site paths, relative paths, and `http(s):` are supported.

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

Linked items do not zoom because clicking opens their link. A gallery can contain both linked and unlinked items.
Linked items open pages. Unlinked items open full images.

## Where images come from {#sources}

Sources use the plain-image resolution order: page resource in the page bundle → global resource in `assets/` → static path `/images/…` → remote URL.
Local resources include intrinsic dimensions to prevent layout changes while loading.
Remote images are not downloaded or measured at build time.

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

Unresolved page or global resources are kept as static paths. The theme does not check whether static or remote images exist.

## Decorative images and zoom {#zoom}

Empty alternative text marks decorative images. They have no title, are skipped by screen readers, and never qualify for zoom.

Image zoom is a site-level switch and is off by default. This page enables it in front matter.
Images above with alternative text and no link open at full size. <kbd>Esc</kbd> closes the dialog and restores the previous focus.

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

Galleries share the page's image zoom dialog and have no separate zoom runtime.
If no image on the page qualifies for zoom, this runtime does not load. See [Images · Zoom](/docs/components/image/#zoom).

## Classes and tabs {#class-and-tabs}

Put `class` on the fence after the language, or on an item at the end of its line.
The theme passes it through for site CSS without interpreting it.
A fence with `tab=` and `group=` / `value=` becomes a [tab set](/docs/components/tabs/) panel.

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

| Output | Shape |
| --- | --- |
| HTML | `<ul class="td-gallery">` with one `<li>` per item; eligible images carry `data-td-image-zoom`; everything is lazy-loaded |
| Print | The same images stacked, without zoom markers |
| Markdown | The `gallery` fence, emitted as written |
| RSS | The same static stack as print |

Galleries load no JavaScript of their own.

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

There is no `columns`, `caption`, or `title` attribute.
Malformed lines or attributes warn and remove only the invalid part or line. The warning identifies the line inside the fence.

## Limits {#limits}

- Fences are the only form. There is no `{.gallery}` list marker or shortcode.
  GitHub does not display the source as images. The theme guarantees behavior across four outputs and applies zoom eligibility rules.
- Column counts cannot be set. The grid follows the viewport, and images keep their proportions without aspect-ratio cropping.
- There is no slideshow, carousel, or previous / next control. The zoom dialog displays one image at a time.
- Remote images are not downloaded at build time. Their dimensions remain unknown until the browser loads them, so layout can change.
- Descriptions do not support Markdown. Put rich text in a paragraph below the gallery.

For album navigation, image sequencing, and drag-to-pan viewing, use the
[Expo layout](/docs/write/expo/) introduced in OINK 1.3.0. The `gallery` fence
is for image groups inside text pages.

## Related {#related}

- [Images](/docs/components/image/) — single images, captions, numbering, the zoom switch
- [Cards](/docs/components/cards/) — a grid of links with images
- [Tabs](/docs/components/tabs/) — one gallery per platform or theme
- [File trees](/docs/components/filetree/) — the same line syntax family

---

Backlinks:

- [OINK v1.3.0](/blog/release/1.3.0/)
- [Cards](/docs/components/cards/)
- [FileTree](/docs/components/filetree/)
- [Images](/docs/components/image/)
- [Print](/docs/customize/print/)
- [Expo albums](/docs/write/expo/)
