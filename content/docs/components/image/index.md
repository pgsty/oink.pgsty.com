---
title: Images
linkTitle: Images
description: Plain Markdown image syntax plus one attribute line gives you captions, sizing, zoom, links, numbering and Hugo image processing.
weight: 20
search_keywords: [Image, Figure, caption, zoom, image processing, imgproc, width, height, numbering]
image_zoom: true
aliases:
  - /docs/components/image-zoom/
  - /docs/content/media/
---

There is one way to write an image: Markdown's `![alt text](source "title")`. An
image standing alone as its own paragraph can be followed by a `{…}` attribute
line, making it a captioned figure, a zoom candidate, a numbered figure, or a
derivative processed by Hugo. The theme has no image shortcode.

## Shortest form {#minimal}

```markdown {title="Source"}
![The OINK documentation shell: sidebar, article and table of contents](oink-shell.webp)
```

![The OINK documentation shell: sidebar, article and table of contents](oink-shell.webp)

This image sits in the same directory as the page (a page bundle), so the theme
reads its intrinsic size and writes `width`/`height`, and the page does not
shift while loading; every image is lazy-loaded. Alternative text serves screen
readers and search engines and should always be written; an empty alt marks a
decorative image, which zoom skips.

## Where images come from {#sources}
Sources resolve in the following order, written the same way in each case:

| Placement | How it is written | Suited to |
| --- | --- | --- |
| Beside the page (a bundle: `index.md` plus the image) | `![…](oink-shell.webp)` | A screenshot only this page uses; it travels with the page and is shared by translations |
| Global resource `assets/images/…` | `![…](images/logo/oink.webp)` | Images several pages share, especially ones needing processing (resize / crop) |
| Static directory `static/images/…` | `![…](/images/hero-light.webp)` | Large images and downloads that need no processing; supply `width`/`height` where the theme cannot measure them |
| Remote URL | `![…](https://example.com/a.png)` | Rare: nothing is downloaded at build time and nothing can be processed |

A relative path is looked up first as a page resource and then as a global
resource; failing both, it is emitted as a static path. The theme does not check
whether a static path or a remote URL exists. When processing cannot resolve a
processable resource, ordinary preview warns and leaves the image unprocessed;
strict publishing rejects the warning.

## Inline versus block {#inline-vs-block}
An image inside a line of text is an inline image, rendered as one `<img>` and
unable to carry attributes; an image standing alone as its own paragraph is a
block image and can carry an attribute line.

```markdown {title="Source"}
This little one ![shell thumbnail](oink-mini.webp) sits inside a sentence — an inline image.

![shell thumbnail](oink-mini.webp)
{width="100" height="64"}
```

This little one ![shell thumbnail](oink-mini.webp) sits inside a sentence — an inline image.

![shell thumbnail](oink-mini.webp)
{width="100" height="64"}

An inline image displays at its own size (50×32 here). An SVG with no intrinsic
size stretches to the container width when inlined, so an SVG belongs as a block
image with explicit `width`/`height`.

> [!NOTE]
> Block images depend on the site setting
> `markup.goldmark.parser.wrapStandAloneImageWithinParagraph: false` (this site
> has it; see [Configuration](/docs/customize/config/)). Without it, Goldmark
> wraps a standalone image in `<p>` and the attribute line is treated as prose.

## Captions {#caption}

An attribute line with `caption="…"` renders the image as a `<figure>` plus a
`<figcaption>`. A caption is plain text and is not parsed as Markdown.

```markdown {title="Source"}
![Release card: version, publication date and asset buttons](release-note.webp)
{caption="The release card is generated from data/download and the page's release record"}
```

![Release card: version, publication date and asset buttons](release-note.webp)
{caption="The release card is generated from data/download and the page's release record"}

A Markdown `"title"` keeps its own meaning (a hover tooltip) and never becomes
the caption.

## Size {#size}

`width`/`height` are positive integers overriding the resource's own dimensions:
they give a static or remote image a placeholder box so the page does not shift,
or display a large image smaller (the browser scales it; the file is unchanged).

```markdown {title="Source"}
![The OINK home page illustration (light)](/images/hero-light.webp)
{width="450" height="300" caption="A 900×600 illustration from static/images/ shown at half size"}
```

![The OINK home page illustration (light)](/images/hero-light.webp)
{width="450" height="300" caption="A 900×600 illustration from static/images/ shown at half size"}

## Processed images {#processing}

Page resources and global resources can be processed by Hugo at build time:
`command` and `options` must both be given, the command is one of `Fit`,
`Resize`, `Fill` or `Crop`, and the options are Hugo's image processing string.
The rendered `src` is the derivative; with zoom enabled the dialog opens the
original.

```markdown {title="Source"}
![shell thumbnail](oink-shell.webp)
{command="Fit" options="300x150" caption="Fit 300x150: scaled to fit inside a 300×150 box"}

![the left half of the shell](oink-shell.webp)
{command="Fill" options="300x150 Left" caption="Fill 300x150 Left: fills the box, cropped from the left"}
```

![shell thumbnail](oink-shell.webp)
{command="Fit" options="300x150" caption="Fit 300x150: scaled to fit inside a 300×150 box"}

![the left half of the shell](oink-shell.webp)
{command="Fill" options="300x150 Left" caption="Fill 300x150 Left: fills the box, cropped from the left"}

Static paths, remote URLs and SVG cannot be processed. Writing `command` for
one warns and leaves it unprocessed; strict publishing rejects the warning. The
options syntax (anchors, quality, format conversion, as
in `300x150 webp q80`) is in
[Hugo image processing](https://gohugo.io/content-management/image-processing/).

## Linked images {#link}
Two forms, for different purposes:

- No caption, and the image itself is the link: wrap it in a Markdown link, `[![alt](src)](href)`.
- A captioned figure that is clickable as a whole: add `link="…"` to the attribute line (which requires `caption` or `num`).

```markdown {title="Source"}
[![Go to the highlights page](oink-shell.webp)](/docs/about/features/)

![Release card](release-note.webp)
{caption="Click the image for the releases and downloads guide" link="/docs/write/releases/"}
```

[![Go to the highlights page](oink-shell.webp)](/docs/about/features/)

![Release card](release-note.webp)
{caption="Click the image for the releases and downloads guide" link="/docs/write/releases/"}

A linked image never zooms. Writing `link=` with no caption warns and drops the
link, pointing at `[![…](…)](…)` instead; strict publishing rejects the warning.

## Numbered figures {#numbered}

Numbered figures are for books and long manuals: add `num` to the attribute
line, with an optional `#id`. The number is a string the author writes (`2-1`,
`3.4`) and the theme never counts automatically; the caption gains a localized
"Figure 2-1" prefix, and `#id` defaults to `fig-<num>`. Reference it from the
prose with an ordinary link `[Figure 2-1](#fig-2-1)` or the `xref` shortcode; a
whole-book list of figures is in [Books](/docs/write/book/).

```markdown {title="Source"}
![Release card](release-note.webp)
{#fig-release num="2-1" caption="The release card: version, date and assets"}

See [Figure 2-1](#fig-release).
```

![Release card](release-note.webp)
{#fig-release num="2-1" caption="The release card: version, date and assets"}

See [Figure 2-1](#fig-release).

A numbered figure can be a processed image at the same time (`num` plus
`command`), and can carry a `link`.

## Zoom {#zoom}

Image zoom is off by default. Once the site enables it, block images, figures
and gallery images that have alt text become clickable buttons that open the
full image in a native `<dialog>` (Esc closes it, focus returns where it was).
This page turns it on in its front matter, so every image above is clickable.

```yaml {title="hugo.yml"}
params:
  ui:
    image_zoom: true
```

```yaml {title="One page's front matter: off for this page only"}
image_zoom: false
```

Images that never zoom: inline images, decorative images with an empty alt,
linked images, and images marked `data-no-zoom`. The runtime loads only when the
page really has a candidate; print, Markdown and RSS have no dialog.

```markdown {title="Source: a decorative image does not zoom"}
![](oink-shell.webp)
{width="150" height="75"}
```

![](oink-shell.webp)
{width="150" height="75"}

## Light and dark images {#dark-mode}
The theme has no parameter for swapping an image by colour scheme. Where two
images are needed, give each a `class` and show one per scheme with
`[data-bs-theme="dark"]` in the site's CSS:

```markdown {title="Source"}
![Sidebar (light)](oink-shell.webp)
{class="only-light"}

![Sidebar (dark)](oink-shell.webp)
{class="only-dark"}
```

```scss {title="assets/scss/_styles_project.scss"}
[data-bs-theme="dark"] .only-light,
:not([data-bs-theme="dark"]) .only-dark { display: none; }
```

`class` is passed through by the theme untouched, for the site's CSS to use.

## Output {#outputs}

| Output | What appears |
| --- | --- |
| HTML | Inline `<img>`; block `<img class="td-image">`; with a caption or number, `<figure class="td-figure">` plus `<figcaption>`; a zoom candidate carries `data-td-image-zoom` |
| Print | As HTML, with the zoom controls removed |
| Markdown | `![alt](src)` and the attribute line as they stand |
| RSS | The image `src` becomes absolute; no zoom |

## Parameter reference {#reference}

The attribute line `{…}` (the line immediately after a block image):

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `caption` | plain text | — | Its presence makes a figure; not parsed as Markdown |
| `#id` | identifier | `fig-<num>` when `num` is set | `[A-Za-z][A-Za-z0-9_.:-]*`; the anchor and the Book target ID |
| `num` | string | — | `[0-9A-Za-z.-]+`; registers a Book figure target and prefixes the caption with "Figure N." |
| `width` / `height` | positive integer | the resource's intrinsic size | Overrides the size; static and remote images use it to avoid layout shift |
| `command` | enum | — | `Fit`, `Resize`, `Fill`, `Crop`; must accompany `options`; page and global resources only |
| `options` | string | — | Hugo image processing options such as `600x300`, `300x150 Left`, `800x webp q80` |
| `link` | URL | — | Wraps the figure in a link; requires `caption` or `num`; a linked image does not zoom |
| `class` | class list | — | Passed through for the site's CSS |
| `data-*` / `aria-*` | string | — | Passed through |
{.fields meta="type default"}

`style`, `on*`, `alt`, `title`, `src`, and unsupported keys on the attribute
line warn and are ignored; strict publishing rejects the warning. Alt, title,
and src belong to the Markdown image itself.

## Limits {#limits}

- A caption holds no Markdown: every public string parameter is plain text, so rich explanation goes in a paragraph below the image.
- `title` is not a caption: the `c` in `![a](b "c")` is a hover tooltip.
- Processing applies to resources only: an image in `static/` that needs processing moves to the page bundle or `assets/`.
- Remote images are never downloaded at build time.
- Zoom has no drag, pan or previous / next; a set of related images uses a [gallery](/docs/components/gallery/).

## Related {#related}

- [Gallery](/docs/components/gallery/) — a set of images sharing one zoom dialog
- [Books](/docs/write/book/) — the list of figures and `xref` cross-references
- [Brand and appearance](/docs/customize/brand/) — where the site logo and favicon go
- [Cards](/docs/components/cards/) — images on cards
