# Gallery

> Arrange related images in a responsive static grid that can reuse Image Zoom.

---

LLMS index: [llms.txt](/llms.txt)

---

Gallery groups related images in a responsive grid. It is a Markdown image list
followed by the `{.gallery}` marker: images, alternative text, and descriptions
remain available without JavaScript, and on GitHub the source is simply a list
of images. When Image Zoom is enabled, Gallery reuses the same dialog instead of
loading another lightbox.

## When to use {#when-to-use}

Use Gallery to compare a small set of screenshots, states, or related visual
examples. Use a single image when sequence and comparison do not matter, and a
[figure with a caption](/docs/components/image-zoom/#figures) when one image
needs a formal caption.

## Quick start {#quick-start}

### Source {#source}

<!-- prettier-ignore-start -->

```markdown
- ![OINK documentation overview](images/content-primitives/oink.webp) — Documentation overview
- ![OINK feedback interface](/images/feedback.png) — Feedback controls
- ![OINK version banner interface](/images/version-banner.png) — Version banner
{.gallery}
```

<!-- prettier-ignore-end -->

### Rendered result {#rendered-result}

<!-- prettier-ignore-start -->

- ![OINK documentation overview](images/content-primitives/oink.webp) — A global image resource with known intrinsic dimensions.
- ![OINK feedback interface](/images/feedback.png) — A deliberately long caption demonstrates wrapping on desktop and mobile without covering an adjacent image or widening the document.
- ![OINK version banner interface](/images/version-banner.png) — The responsive grid reduces its effective column count on a narrow viewport.
{.gallery}

<!-- prettier-ignore-end -->

This page enables Image Zoom. Activate any image to inspect it in the shared
dialog. With JavaScript disabled, the same three figures remain visible in the
same reading order.

## Rules {#rules}

<!-- prettier-ignore-start -->

| Element                | Rule                                                                                                   |
| ---------------------- | ------------------------------------------------------------------------------------------------------ |
| `![alt](src)`          | One image per item; `alt` is required and must be meaningful (an empty alt is decorative and never zooms) |
| `src`                  | A page resource, a global asset, a static path, or a remote URL; local resources get intrinsic dimensions and lazy loading |
| ` — description`       | Optional text after the image, shown under it (a writing convention, not syntax)                     |
| `{.gallery}`           | The marker on the line right after the list                                                            |
{.fields caption="Gallery notation"}

<!-- prettier-ignore-end -->

The grid adapts to the viewport; there is no `columns` parameter and no `label`.
Remote images are never downloaded during the Hugo build, so their dimensions
remain unknown until the browser loads them.

## Semantics and fallback {#semantics-and-fallback}

HTML is the `ul` you wrote with the `gallery` class: each `li` holds the image
and its description. Images resolve through the theme's image render hook, so
page resources carry `width`/`height` and every image is lazy-loaded. Markdown
output is the source list; print and RSS render the same static list. Gallery
has no private JavaScript runtime: it only marks eligible images for Image Zoom
when that page-level feature is enabled.

## Deliberate limits {#deliberate-limits}

Gallery does not crop images to a forced aspect ratio, reorder them by
breakpoint, hide overflow, or provide slide navigation, and it has no
Gallery-specific lightbox. These constraints preserve document order and keep
the fallback complete. The `gallery`/`gallery/image` shortcodes were removed;
the migration toolkit rewrites them into the list form.
