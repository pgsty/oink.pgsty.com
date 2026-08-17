---
title: Images and Image Zoom
linkTitle: Images
description:
  Write ordinary Markdown images, add figure captions and processed previews,
  and let readers inspect them in a native dialog.
weight: 70
params:
  ui:
    image_zoom:
      enable: true
---

Every Markdown image on an OINK site goes through the theme's image render hook:
the source is resolved (page resource, global asset, static path, or remote
URL), local resources get their intrinsic dimensions, and every image is
lazy-loaded. A standalone image can carry an attribute line that turns it into a
captioned figure. The `image` shortcode adds Hugo image processing, and Image
Zoom progressively enhances eligible images with one native dialog.

## Markdown images {#markdown-images}

```markdown
![OINK documentation overview](images/content-primitives/oink.webp 'Advisory title')
```

![OINK documentation overview](images/content-primitives/oink.webp 'Advisory title')

The `title` keeps its Markdown meaning (a tooltip); it never becomes a caption.
An image inside a paragraph of text stays inline; an image on its own line is a
block image and can take an attribute line.

### Figures {#figures}

Add `{caption="…"}` on the line after a standalone image to render a `figure`
with a `figcaption`. `width` and `height` give static or remote images their
box; `class` passes through to site CSS.

```markdown
![OINK feedback interface](/images/feedback.png)
{caption="The feedback controls under an article" width="1200" height="600"}
```

![OINK feedback interface](/images/feedback.png)
{caption="The feedback controls under an article" width="1200" height="600"}

Numbered Book figures use the same attribute line with `num` (and an optional
`id`); see [Book publishing](/docs/scenarios/book/). Unknown attributes,
`style`, and event handlers fail the build.

Block images need the site setting
`markup.goldmark.parser.wrapStandAloneImageWithinParagraph: false`; without it
Goldmark wraps the image in a paragraph and the attribute line is ignored.

## Processed images {#processed-images}

<a id="named-imgproc-parameters"></a>

Add `command` and `options` to the attribute line to resize, fit, fill, or crop
a page or global image resource with Hugo's image processing:

```markdown
![OINK local-first documentation preview](images/content-primitives/oink.webp)
{command="Fit" options="640x320" caption="A processed preview."}
```

![OINK local-first documentation preview](images/content-primitives/oink.webp)
{command="Fit" options="640x320" caption="The document displays a processed preview. Image Zoom opens the original resource, and closing the dialog restores focus to this trigger."}

| Attribute | Type | Rule |
| --- | --- | --- |
| `command` | enum | One of `Fit`, `Resize`, `Fill`, or `Crop`. Required together with `options`. |
| `options` | string | Nonempty Hugo image-processing options, such as `640x320`. |
{.fields caption="image-processing attributes"}

The rendered `src` is the derivative and its dimensions become the defaults;
explicit `width` and `height` still win. Image Zoom opens the **original**,
because the marker carries the full-size URL. Alt text comes from the Markdown
image itself, so there is no `alt` or `decorative` attribute — an empty alt
marks the image decorative, and a decorative image is never zoomed.

A static path, a remote URL, or an SVG cannot be processed and fails the build;
use a plain Markdown image for those.

The `image` shortcode that used to own this is gone: the attribute line covers
processing, captions, numbering, and links, and keeping a second form alive for
a Markdown caption was the only thing it still did. Captions are plain text,
like every other public string parameter. Run
`python3 scripts/migrations/oink06.py migrate --site <dir>` to convert existing
content; a caption containing Markdown is reported for a manual rewrite rather
than flattened.

## Enable Image Zoom {#enable-the-feature}

Image Zoom is disabled by default. Enable it for the whole site in Hugo
configuration:

```yaml
params:
  ui:
    image_zoom:
      enable: true
```

A page can override the site value in its front matter with the same structure.
Use a real boolean:

```yaml
params:
  ui:
    image_zoom:
      enable: false
```

OINK only includes the JavaScript runtime and dialog on an enabled page that has
an eligible image. Enabling the switch alone adds no runtime to a text-only
page.

## Eligible images {#eligible-images}

OINK enhances a meaningful image when all of these conditions hold:

- The image is standalone in a paragraph or figure, is a processed `image`, or
  sits in a [Gallery](/docs/components/gallery/) list.
- It has a nonempty `alt` value and usable source.
- It is not inside a link, button, or element marked `data-no-zoom`.
- It is not marked `aria-hidden="true"`, `role="presentation"`, or
  `role="none"`.

Inline images among text and empty-alt decorative images are skipped. An image
inside a link is deliberately skipped and remains a link:

[![Linked OINK image remains a link](/images/oink.webp)](/docs/)

## Interaction and fallback {#interaction-and-fallback}

Progressive enhancement wraps an eligible image in a real button with
`aria-haspopup="dialog"`. The native dialog moves focus to its close button,
supports Escape, copies the image's alternative text and direct caption, and
restores focus after closing. Without JavaScript or `HTMLDialogElement`, the
image and caption remain ordinary static content. Markdown, print, and RSS do
not include dialog controls; RSS uses absolute image URLs.

## Deliberate limits {#deliberate-limits}

Version one does not implement dragging, panning, wheel zoom, editing, or
previous and next image navigation. It also never downloads a remote image at
build time. Use Gallery to group related images while reusing this same dialog.
