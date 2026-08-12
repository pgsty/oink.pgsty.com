---
title: Image Zoom
description:
  Let readers inspect meaningful standalone images with an optional native
  dialog.
weight: 50
icon: fa-solid fa-magnifying-glass-plus
params:
  ui:
    image_zoom:
      enable: true
---

Image Zoom progressively enhances eligible content images with one native
dialog. It is useful for screenshots and architecture diagrams whose details may
be hard to read at the document width. The original image remains complete when
JavaScript or dialog support is unavailable.

## When to use {#when-to-use}

Enable zoom when a reader benefits from seeing the source image at a larger
size. Prefer a purpose-built crop or a clearer diagram when enlargement does not
solve the readability problem. Decorative icons, logos embedded in prose, and
linked thumbnails should retain their existing behavior.

## Enable the feature {#enable-the-feature}

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

Oink only includes the JavaScript runtime and dialog on an enabled page that has
an eligible image. Enabling the switch alone adds no runtime to a text-only
page.

## Quick start {#quick-start}

### Source {#source}

Ordinary standalone Markdown images are eligible. The named `imgproc` form is
useful when Oink should generate a smaller preview but open the original:

```go-html-template
{{</* imgproc
  src="images/content-primitives/oink.webp"
  command="Fit"
  options="640x320"
  alt="OINK local-first documentation preview"
*/>}}
A processed preview with a **Markdown caption**.
{{</* /imgproc */>}}
```

### Rendered result {#rendered-result}

Activate the image with a pointer, Enter, or Space. Close the dialog with
Escape, the visible close button, or the backdrop.

{{< imgproc src="images/content-primitives/oink.webp" command="Fit" options="640x320" alt="OINK local-first documentation preview" >}}
The document displays a processed preview. Image Zoom opens the **original
resource**, and closing the dialog restores focus to this trigger.
{{< /imgproc >}}

An image inside a link is deliberately skipped and remains a link:

[![Linked OINK image remains a link](/images/oink.webp)](/docs/)

## Eligible images {#eligible-images}

Oink enhances a meaningful image when all of these conditions hold:

- The image is standalone in a paragraph or figure, or Gallery marks it
  explicitly.
- It has a nonempty `alt` value and usable source.
- It is not inside a link, button, or element marked `data-no-zoom`.
- It is not marked `aria-hidden="true"`, `role="presentation"`, or
  `role="none"`.

Inline images among text and empty-alt decorative images are skipped. Authors
can add `data-no-zoom` to an image or ancestor in trusted HTML when an otherwise
eligible image should not open.

## Named imgproc parameters {#named-imgproc-parameters}

<!-- prettier-ignore-start -->

{{< fields label="Named imgproc parameters" >}}
  {{< field name="src" type="resource path" required=true >}}
  An exact page or global image resource.
  {{< /field >}}
  {{< field name="command" type="enum" required=true >}}
  One of `Fit`, `Resize`, `Fill`, or `Crop`.
  {{< /field >}}
  {{< field name="options" type="string" required=true >}}
  Nonempty Hugo image-processing options, such as `640x320`.
  {{< /field >}}
  {{< field name="alt" type="string" >}}
  Meaningful alternative text. It is required for content images and omitted only with `decorative=true`.
  {{< /field >}}
  {{< field name="decorative" type="boolean" default=false >}}
  When true, `alt` must be absent and Image Zoom is suppressed.
  {{< /field >}}
{{< /fields >}}

<!-- prettier-ignore-end -->

The optional shortcode body is a Markdown caption. The historical three-value
positional `imgproc` form remains compatible, but new content should use the
named form so alternative text is enforced at build time.

## Interaction and fallback {#interaction-and-fallback}

Progressive enhancement wraps an eligible image in a real button with
`aria-haspopup="dialog"`. The native dialog moves focus to its close button,
supports Escape, copies the image's alternative text and direct caption, and
restores focus after closing. Without JavaScript or `HTMLDialogElement`, the
image and caption remain ordinary static content. Markdown, print, and RSS do
not include dialog controls.

## Deliberate limits {#deliberate-limits}

Version one does not implement dragging, panning, wheel zoom, editing, or
previous and next image navigation. It also never downloads a remote image at
build time. Use Gallery to group related images while reusing this same dialog.
