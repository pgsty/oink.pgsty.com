---
title: Image albums with Expo
linkTitle: Expo albums
description: Create an image album, add optional metadata, select a layout, and use the image viewer.
weight: 55
icon: fa-solid fa-images
search_keywords: [expo, album, gallery, images, GIF, wall, cards, seamless, zoom]
---

Expo displays image collections as albums. A sidebar groups the albums. The
main area shows the images in the selected album. Each image opens in a viewer.

> [!NOTE] Available in OINK 1.3.0
> Expo is included in OINK v1.3.0.

Open the [example albums](/expo/) to try the controls. Use the
[Gallery component](/docs/components/gallery/) for an image grid inside a text page.

## Create an album {#create-an-album}

Use one directory for each album. Put the images in that directory's `images/`
folder. One `index.md` describes the album. Filenames supply the default image titles.
Expo does not require a Markdown or YAML file for each image.

```text
content/photos/
├── _index.md
├── nature/
│   ├── _index.md
│   └── field-notes/
│       ├── index.md
│       └── images/
│           ├── 01-fern.jpg
│           └── 02-river.gif
└── buildings/
    ├── index.md
    └── images/
        └── arch.jpg
```

1. Create the section entry:

   ```yaml {title="content/photos/_index.md"}
   ---
   title: Photo albums
   type: expo
   cascade:
     type: expo
   ---
   ```

2. Create a topic entry for each group of albums:

   ```yaml {title="content/photos/nature/_index.md"}
   ---
   title: Nature
   weight: 10
   ---
   ```

3. Create the album page:

   ```markdown {title="content/photos/nature/field-notes/index.md"}
   ---
   title: Field notes
   description: Plants and water from a field visit.
   weight: 10
   ---

   Photographs from the north trail.
   ```

4. Put the images in the album's `images/` folder.

The section lists its child topics and albums. The sidebar follows the same
content tree. On narrow screens, open the navigation drawer to select an album.
The album body is optional. If supplied, it appears above the images.

Split large collections into separate albums. Expo has no automatic image
pagination. A section card uses the first sorted image as its cover. A topic
without images uses the first available image from its descendant albums.
The cover fills a 4:3 frame and can crop the preview.

## Add image metadata {#image-metadata}

Add a `resources` entry to the album front matter when an image needs a title,
description, credit, or fixed position. The `src` path is relative to the album
directory.

```yaml {title="Album front matter"}
resources:
  - src: images/01-fern.jpg
    title: Fern
    params:
      id: fern
      alt: A green fern frond seen from above
      caption: Branching leaves beside the north trail.
      byline: Alex Chen
      weight: 10
```

| Field | Use |
| --- | --- |
| `title` | Image title. If omitted, Expo derives a title from the filename |
| `params.alt` | Text that describes the image. If omitted or empty, it uses the title |
| `params.caption` | Plain-text description |
| `params.byline` | Plain-text credit |
| `params.weight` | Numeric image order. Lower values come first. The default is `0` |
| `params.id` | Stable image ID within the album |
| `params.original` | Optional path to another image in the same album bundle |

Images with equal weights keep the resource name order. To set a complete order,
give each image a weight. Images without a weight come before positive weights.

Use ASCII letters or digits for the first ID character. The remaining characters can
also include `_` and `-`. Keep IDs unique within an album. The example creates
`/photos/nature/field-notes/#img-fern`. This link stays valid after a filename
change if the album URL and explicit ID stay the same. Without an explicit ID,
Expo uses a filename hash. Renaming that file changes the link.

To use a separate original, put it in `originals/` and set
`params.original: originals/fern.jpg`. Keep the preview and original at the same
aspect ratio. Keep originals outside the `expo.images` pattern to avoid duplicate
entries. Expo reads bundled images; it does not fetch remote files for an album.

## Set the defaults {#defaults}

Set site defaults in `hugo.yml`:

```yaml {title="hugo.yml"}
params:
  ui:
    expo:
      images: images/*
      mode: wall
      size: 240
```

| Key | Allowed value | Built-in default |
| --- | --- | --- |
| `images` | A pattern for image resources in the album bundle | `images/*` |
| `mode` | `wall`, `cards`, or `seamless` | `wall` |
| `size` | An integer from `160` to `360`, in CSS pixels | `240` |

Use a top-level `expo` block in album front matter to replace the site block:

```yaml {title="Album front matter"}
expo:
  images: images/*
  mode: cards
  size: 280
```

This override replaces the whole block. Omitted fields use built-in defaults,
not values from the site block. A section can supply the block through `cascade`.
The size is a layout target, not a fixed width and height for every image.

The browser saves the reader's layout and size choices for the same site origin.
These choices take precedence over author defaults. They remain in use after
a reload, an album change, or an appearance change. If browser storage is
unavailable, Expo uses the author defaults when the page loads.

## Select a layout {#layouts}

| Mode | Display |
| --- | --- |
| `wall` | Rows of image tiles with 6 CSS pixels between them |
| `cards` | Columns of cards with visible titles, descriptions, and credits |
| `seamless` | Rows of image tiles with no gaps between them |

The toolbar has three layout icons, a play/pause button, and an image-size slider.
On devices with a mouse, Wall and Seamless show captions on hover or keyboard
focus. Images with extreme proportions can have space inside their tiles.
The album tiles contain the whole image.

GIFs play by default. Select Pause to show still previews. If the system requests
reduced motion, Expo starts with still previews. Select Play to start them.
The play button is disabled when the album has no GIFs. Images load as they
approach the visible area; large GIF files still require their full transfer size.

## Use the image viewer {#viewer}

Select an image to open the viewer. A small image starts at its original size.
A large image shrinks until both dimensions fit the available image area.

| Control | Action |
| --- | --- |
| Reset | Restore the initial size and center the image |
| Expand to fit | Enlarge or shrink the image until its limiting edge fits the image area |
| Zoom out / Zoom in | Divide or multiply the current scale by `1.25` |
| Open original | Open the original image file in a new tab |
| Locate in album | Close the viewer and move to this image in the album |
| Previous / Next | Show the adjacent image in the same album |
| Close | Close the viewer and restore focus to an image link |

Expand to fit keeps the whole image visible. It does not switch the browser to
fullscreen. Manual zoom can make the image larger than the viewing area. Hold
the left mouse button and drag to move the enlarged image. Movement stops at
the image bounds. On a touch screen, an enlarged image uses native scrolling.
When the image fits, swipe horizontally with one finger to change images;
pinching keeps native browser behavior. Double-click alternates between the
initial fit and a closer view: a reduced image opens at 100% under the pointer,
while an image already at its original size expands to fit.

Changing images resets the scale and position. Previous and Next stop at the
ends of the album. The percentage uses CSS pixels: at 100%, one source pixel
occupies one CSS pixel.

## Use keyboard shortcuts {#shortcuts}

These shortcuts work while the viewer is open. They take precedence over the
page's single-key navigation. They do not handle text input, input method
composition, or Ctrl/Command/Alt combinations.

| Key | Action |
| --- | --- |
| W / A / S / D | Move the enlarged image up / left / down / right |
| Q or H | Previous image |
| E or L | Next image |
| J or − | Zoom out |
| K or + | Zoom in |
| R or 0 | Reset the size and position |
| F | Expand to fit |
| Escape | Close the viewer |

WASD moves the image by 80 CSS pixels per press, only along an axis that
overflows. Left and Right arrow keys change images when horizontal scrolling
is unnecessary. When the image is wider than the viewing area, the arrows
retain native scrolling. The `keyboard_nav` setting controls page shortcuts;
it does not disable the viewer controls.

## Use the site appearance {#appearance}

Expo uses Paper, Slate, Ink, and Terminal with the site's light or dark mode.
Select these options in the shared navigation. The album body has its image
toolbar and no article action menu.

To expose all four presets and keep the top navbar visible, use:

```yaml {title="hugo.yml"}
params:
  ui:
    preset: paper
    preset_menu: [paper, slate, ink, terminal]
    navbar_enabled: true
    navbar_autohide: false
```

Expo uses the full available page width by default and has no right-hand outline.
Set `page_width` in page front matter if the album needs a narrower body. If your
site overrides `params.ui.shell_types`, include `expo` to retain its sidebar.

## Translate and export an album {#translations-and-outputs}

Add `index.zh.md` beside `index.md` for a Chinese album. Add `_index.zh.md` for
each translated section. Both languages can share the image files. Translate
the title, description, and resource metadata in each page. Keep image IDs the
same when they refer to the same image.

HTML works without JavaScript: image links open the original files, and captions
remain visible. When enabled, Print uses still previews. Markdown and LLMSFULL
include image links and metadata. RSS includes static image descriptions.
See [Print](/docs/customize/print/) and [Agent outputs](/docs/customize/agents/)
for output configuration.

## Check an album {#check-an-album}

1. Run `hugo --printPathWarnings` with a theme version that includes Expo.
2. Open each album and confirm its image order, titles, and descriptions.
3. Test a small image, a wide image, a long image, and a GIF if the album has one.
4. Test Reset, Expand to fit, zoom, dragging, keyboard navigation, and Locate in album.
5. Check both languages, narrow screens, the four presets, and light/dark mode.

If an album is empty, check its `type`, bundle structure, and `expo.images` pattern.
If a default seems to have no effect, check the stored reader choice and the
whole-block override rule. For required behavior and maintainer checks, see the
[Expo contract](/docs/design/expo/) and [design decision](/docs/design/decisions/expo/).
