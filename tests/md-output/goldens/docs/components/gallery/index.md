# Gallery

> Arrange related images in a responsive static grid that can reuse Image Zoom.

---

LLMS index: [llms.txt](/llms.txt)

---

Gallery groups related images in a responsive grid. It is a `gallery` code
fence with one image per line, sharing the line grammar of
[FileTree](/docs/components/filetree/): the image, then `#` and a description,
then optional `{key=value}` attributes.

The fence replaced an image list with a `{.gallery}` marker. A list marker is
CSS-only — Markdown lists have no render hook — so the theme could not see the
items, which meant no per-item attributes and, more importantly, no way to mark
the images for Image Zoom without guessing at the surrounding markup. The cost
is that the source no longer renders as images on GitHub; the gain is that the
grid, all four outputs, and Zoom eligibility are the theme's to guarantee.

## When to use {#when-to-use}

Use Gallery to compare a small set of screenshots, states, or related visual
examples. Use a single image when sequence and comparison do not matter, and a
[figure with a caption](/docs/components/image-zoom/#figures) when one image
needs a formal caption.

## Quick start {#quick-start}

### Source {#source}

````markdown
```gallery
![OINK documentation overview](images/content-primitives/oink.webp) # Documentation overview
![OINK feedback interface](/images/feedback.png) # Feedback controls
![OINK version banner interface](/images/version-banner.png) # Version banner {link=/docs/}
```
````

### Rendered result {#rendered-result}

```gallery
![OINK documentation overview](images/content-primitives/oink.webp) # A global image resource with known intrinsic dimensions.
![OINK feedback interface](/images/feedback.png) # A deliberately long caption demonstrates wrapping on desktop and mobile without covering an adjacent image or widening the document.
![OINK version banner interface](/images/version-banner.png) # The responsive grid reduces its effective column count on a narrow viewport.
```

This page enables Image Zoom. Activate any image to inspect it in the shared
dialog. With JavaScript disabled, the same three figures remain visible in the
same reading order.

## Rules {#rules}

| Element | Rule |
| --- | --- |
| `![alt](src)` | Required at the start of each line, so `alt` stays a first-class field rather than an attribute you can forget. It doubles as the item title; an empty alt is decorative and never zooms |
| `src` | A page resource, a global asset, a static path, or a remote URL; local resources get intrinsic dimensions and lazy loading |
| `# description` | Optional text after the image, shown under it. Plain text. A `#` inside the alt or the source needs no escaping; `\#` is a literal hash inside the description |
| `{link=…}` | Makes the item a link — and therefore not zoomable, because the runtime skips images inside anchors |
| `{class=…}` | Site CSS tokens on that item |
{.fields caption="Gallery notation"}

A line that is not an image, trailing text without the `#` marker, an empty
description, and unknown or malformed attributes all fail the build with the
fence line number.

The grid adapts to the viewport; there is no `columns` parameter and no `label`.
Remote images are never downloaded during the Hugo build, so their dimensions
remain unknown until the browser loads them.

## Semantics and fallback {#semantics-and-fallback}

HTML is `ul.td-gallery`, one `li.td-gallery__item` per line. Sources resolve
through the shared image resolver, so page resources carry `width`/`height` and
every image is lazy-loaded. Because the theme renders the grid itself, it marks
each eligible image for Image Zoom at build time rather than inferring
eligibility from the markup — Gallery still has no runtime of its own and only
reuses the page-level dialog. Markdown output is the fence source, as it is for
every data fence; print and RSS render the same grid stacked.

## Deliberate limits {#deliberate-limits}

Gallery does not crop images to a forced aspect ratio, reorder them by
breakpoint, hide overflow, or provide slide navigation, and it has no
Gallery-specific lightbox. There is no `columns` attribute: the grid is
responsive. These constraints preserve document order and keep the fallback
complete. The migration toolkit rewrites both the `gallery`/`gallery/image`
shortcodes and the interim `{.gallery}` list into the fence, turning the list
form's ` — ` separator into `#`.
