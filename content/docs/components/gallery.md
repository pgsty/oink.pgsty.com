---
title: Gallery
description:
  Arrange related images in a responsive static grid that can reuse Image Zoom.
weight: 60
icon: fa-solid fa-images
params:
  ui:
    image_zoom:
      enable: true
---

Gallery groups related images in a responsive grid. It is static-first: images,
alternative text, and captions remain available without JavaScript. When Image
Zoom is enabled, Gallery reuses the same dialog instead of loading another
lightbox.

## When to use {#when-to-use}

Use Gallery to compare a small set of screenshots, states, or related visual
examples. Use a single image when sequence and comparison do not matter. Use
Carousel when the content intentionally needs slide navigation and hiding
noncurrent items is acceptable.

## Quick start {#quick-start}

### Source {#source}

```go-html-template
{{</* gallery columns=3 label="OINK screenshots" */>}}
  {{</* gallery/image
    src="images/content-primitives/oink.webp"
    alt="OINK documentation overview"
    caption="Documentation overview"
  */>}}
  {{</* gallery/image
    src="/images/feedback.png"
    alt="OINK feedback interface"
    caption="Feedback controls"
  */>}}
{{</* /gallery */>}}
```

### Rendered result {#rendered-result}

<!-- prettier-ignore-start -->

{{< gallery columns=3 label="OINK screenshots and layout examples" >}}
  {{< gallery/image src="images/content-primitives/oink.webp" alt="OINK documentation overview" caption="A global image resource with known intrinsic dimensions." >}}
  {{< gallery/image src="/images/feedback.png" alt="OINK feedback interface" caption="A deliberately long caption demonstrates wrapping on desktop and mobile without covering an adjacent image or widening the document." >}}
  {{< gallery/image src="/images/version-banner.png" alt="OINK version banner interface" caption="The responsive grid reduces its effective column count on a narrow viewport." >}}
{{< /gallery >}}

<!-- prettier-ignore-end -->

This page enables Image Zoom. Activate any image to inspect it in the shared
dialog. With JavaScript disabled, the same three figures remain visible in the
same reading order.

## Gallery parameters {#gallery-parameters}

<!-- prettier-ignore-start -->

{{< fields label="gallery parameters" >}}
  {{< field name="columns" type="integer" default=2 >}}
  An unquoted value from `1` through `4`; this is the desktop maximum.
  {{< /field >}}
  {{< field name="label" type="string" >}}
  A nonempty visible label associated with the gallery list.
  {{< /field >}}
{{< /fields >}}

<!-- prettier-ignore-end -->

The container requires at least one direct `gallery/image` child and accepts no
ordinary body text. Small viewports reduce the effective column count without
changing the requested desktop maximum.

## Image parameters {#image-parameters}

<!-- prettier-ignore-start -->

{{< fields label="gallery/image parameters" >}}
  {{< field name="src" type="image URL" required=true >}}
  A validated page, global, static, or remote image URL.
  {{< /field >}}
  {{< field name="alt" type="string" required=true >}}
  Meaningful nonempty plain text describing the image.
  {{< /field >}}
  {{< field name="caption" type="string" >}}
  Nonempty plain text shown below the image.
  {{< /field >}}
{{< /fields >}}

<!-- prettier-ignore-end -->

Gallery records intrinsic width and height for local Hugo resources when
available and adds lazy loading. It accepts a remote source URL but never
downloads that image during the Hugo build, so remote dimensions remain unknown.
Captions do not render Markdown; keep them concise and move rich explanation
into nearby prose.

## Semantics and fallback {#semantics-and-fallback}

HTML uses a labeled `ul` of `figure`, `img`, and optional `figcaption` elements.
Each image retains its own alternative text; the gallery label names the
collection. Markdown emits ordinary images followed by italic captions. Print
and RSS render sequential static figures. Gallery has no private JavaScript
runtime: it only marks its images for Image Zoom when that page-level feature is
enabled.

## Deliberate limits {#deliberate-limits}

Gallery does not crop images to a forced aspect ratio, reorder them by
breakpoint, hide overflow, or provide slide navigation. It has no
Gallery-specific lightbox. These constraints preserve document order and keep
the fallback complete.
