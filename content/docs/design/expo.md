---
title: Expo layout contract
linkTitle: Expo
description: Define album resources, display modes, image viewing, shared appearance, and static outputs.
weight: 45
icon: fa-solid fa-images
contract_status: v1.3.2
---

> [!NOTE] OINK 1.3.2 contract
> This contract describes OINK v1.3.2. Theme development uses the sibling
> checkout; release acceptance verifies the published module with replacements
> and workspaces disabled. Consumer adoption and deployment have their own checks.

This page defines required behavior. Use [Expo albums](/docs/write/expo/) to
create content. Read the [design decision](/docs/design/decisions/expo/) for
the reasons behind this model.

## Content and navigation {#content-and-navigation}

`type: expo` selects the album layout. A section can apply it to descendants
through `cascade`. One album is a Hugo leaf bundle with `index.md` and an
`images/` directory. Image metadata belongs in the album's `resources` front
matter. Separate content files for each image are not required.

Section pages list child topics and albums. The shared navigation tree supports
nested sections, the current language, and the mobile drawer. Expo uses the full
available page width and has no right-hand outline. An explicit page-level
`page_width` overrides the width. The top navbar follows the shared site and
page settings. Expo does not disable it by default.
As with Book, an album without a `sidebar_root_for` ancestor uses its top-level
section, not the home tree, as the sidebar and root-switcher root.

### Configuration {#configuration}

`expo/config.html` resolves the configuration in this order:

1. Use the page's `expo` block, including a block supplied by Hugo cascade.
2. If the page has no block, use `params.ui.expo` from the site.
3. Validate each field. Use its built-in default when the field is absent or invalid.

A page block replaces the whole site block. The resolver does not merge fields
from those two blocks.

| Field | Allowed value | Built-in default |
| --- | --- | --- |
| `images` | A string pattern for bundled image resources | `images/*` |
| `mode` | `wall`, `cards`, or `seamless` | `wall` |
| `size` | Integer from 160 to 360, in CSS pixels | `240` |

Invalid configuration produces a warning and uses a fallback. The size is a layout target; it does
not set both dimensions of each tile.

### Image resources {#image-resources}

`expo/items.html` selects images and resolves metadata for all outputs. It uses
Hugo resource metadata and the shared media resolver. Non-image resources are
excluded. An optional `params.original` must name an image in the same bundle.
The build does not fetch remote album images.

| Value | Rule |
| --- | --- |
| Title | Use the resource title; otherwise derive it from the filename |
| Alternative text | Use `params.alt`; fall back to the title when it is empty or absent |
| Caption and credit | Read `params.caption` and `params.byline` as plain text |
| Image order | Sort by numeric `params.weight`, lowest first; the default is zero |
| Equal weights | Keep the resource collection's name order |
| Explicit ID | Start with an ASCII letter or digit; subsequent characters can also be `_` or `-` |
| Image anchor | Prefix the ID with `img-`; without an ID, use a hash of the resource name |

IDs must be unique within the album. Invalid or duplicate IDs produce a warning
and use a filename hash. Renaming a file changes its fallback anchor. Keep an
explicit ID and the album URL unchanged when a citation must remain valid.
An ID may be a string or a YAML integer. If a fallback hash is also occupied, append the first unused numeric suffix so development output still has unique anchors. Review the warning and generated fallback anchors before publication.

Processable images larger than 960 pixels receive previews within a 960 × 960
pixel box. GIFs also receive still previews for pause and reduced motion.
The animated source remains available. Original files remain unchanged.

Album cards use the first sorted image as the cover. A section without its own
images uses the first available image from its descendant albums. Cover frames
use a 4:3 ratio and can crop the preview. Authors divide large collections into
albums; Expo does not paginate image resources automatically.

Explicit image IDs accept strings or YAML integers. Invalid or duplicate IDs
warn; if the filename hash is occupied too, the fallback uses its first unused
numeric suffix. `expo.images` must be a nonempty resource glob, and
`params.original` must name a bundled image even when its value is false or empty.
Strict publication rejects these diagnostics.

## Layout and controls {#layout-and-controls}

| Mode | Geometry and captions |
| --- | --- |
| Wall | Rows of tiles with 6 CSS pixel gaps; captions appear on hover or focus on devices that support hover |
| Cards | Columns filled from the shortest column; captions stay visible |
| Seamless | The Wall calculation with zero tile gaps; the same caption behavior |

Tile proportions are bounded for very wide or tall images. Each tile contains
the complete image, which can leave space inside the tile. On devices without
hover, captions remain visible below the images.

The toolbar has a three-cell radio group on one background. A play/pause button
and a horizontal size slider follow it. Small and large image icons mark the
slider ends. All controls share a vertical center. Albums without GIFs retain
a disabled play button. Each icon control has a localized name, a tooltip where
applicable, and visible keyboard focus. Cards and album covers use the preset's
radius token; Wall and Seamless tiles stay square. A focused tile shows a
two-tone inset ring above its caption.

Appearance controls stay in the shared navigation. The album body has no
appearance picker or article action menu. Without JavaScript, image links and
captions remain visible.

### Reader preferences and appearance {#reader-preferences-and-appearance}

The browser stores the selected mode and size in `td-expo-mode` and
`td-expo-size`. Only valid values take effect. A valid stored choice overrides
the author default. It applies across albums and reloads on the same origin.
Invalid or unavailable storage leaves the author defaults in effect.

Display mode and size are independent of appearance. Paper, Slate, Ink, and
Terminal use the shared colors, type styles, and corner settings in light and
dark mode. A preset change recalculates the grid after typography changes.
It preserves the reader's display mode and size.

GIFs play by default in the grid and viewer. The play/pause control changes
animation for the current album and its viewer. The setting is not stored
across page loads. `prefers-reduced-motion: reduce` starts with still previews.
The reader can select Play. A change to the system preference updates playback.
The first four tiles load eagerly; later grid images use lazy loading.

### Layout stability {#layout-stability}

Expo reserves document scrollbar space when scrollbars consume layout width.
An album near the viewport height must reach a stable layout. A scrollbar must
not repeatedly appear and disappear as the grid recalculates its height.
Opening or closing the viewer must preserve the underlying grid's usable width.

## Viewer behavior {#viewer-behavior}

The viewer uses a native modal dialog. Its image area excludes the toolbar and
caption area. Let `W` and `H` be the original image dimensions. Let `A` and `B`
be the available image-area width and height, in CSS pixels.

| Action | Scale |
| --- | --- |
| Open or reset | `min(1, A/W, B/H)` |
| Expand to fit | `min(A/W, B/H)` |
| Zoom in | Current scale multiplied by `1.25`, within the zoom limit |
| Zoom out | Current scale divided by `1.25`, within the zoom limit |

The smaller ratio is the limiting edge. Both automatic sizing actions contain
the whole image and have no image-area scrollbars. Reset keeps a small image at
100%. Expand can enlarge it. Expand does not use the browser Fullscreen API.
Only manual zoom can exceed the image area and enable scrolling.

The percentage uses source pixels as CSS pixels. Zoom preserves the viewed
center. Reset centers the image. Changing images resets size and position.
Previous and Next stop at the album boundaries. A boundary key leaves the
current scale and position unchanged.

### Pointer and keyboard input {#pointer-and-keyboard-input}

Hold the primary mouse button and drag to move an enlarged image. The image
follows the pointer and stops at its bounds. Only overflowing axes can move.
Touch input on an enlarged image retains native scrolling. Releasing or
canceling the pointer, changing images, resetting, or leaving the window ends
the drag. When the image fits the image area, a horizontal swipe of at least
48 CSS pixels changes images; pinches and a zoomed page do not.

Double-click or double-tap alternates between the initial size and a closer
look. A shrunk original opens at 100% with the point under the pointer kept in
place; an original already at 100% expands to fit. From any other size it
returns to the initial size.

Viewer shortcuts apply inside the open dialog. They ignore text input, input
method composition, and Ctrl/Command/Alt combinations. Page-level single-key
navigation pauses while the dialog is open. `keyboard_nav` controls that page
runtime; it does not disable Expo's viewer runtime.

| Key | Action |
| --- | --- |
| W / A / S / D | Move the enlarged image up / left / down / right, 80 CSS pixels per press |
| Q or H | Previous image |
| E or L | Next image |
| J or − | Zoom out |
| K or + | Zoom in |
| R or 0 | Reset size and position |
| F | Expand to fit and center |
| Escape | Close the viewer |

Left and Right arrow keys change images when no horizontal scrolling is needed.
Otherwise, they retain native scrolling. Button tooltips show the applicable keys.
In right-to-left languages the album order mirrors: the arrow key toward the
start opens the previous image, swipes follow the same direction, and the
previous and next icons mirror.

### Links, focus, and loading {#links-focus-and-loading}

Open original links to the original file in a new tab. Locate in album closes
the viewer, updates the URL fragment, scrolls to the current image, and focuses
its trigger. Closing normally returns focus to the link that opened the viewer.
The native dialog contains focus and prevents underlying page interaction.
The underlying page cannot scroll while the viewer is open.
The viewer registers with `OinkSurfaceCoordinator`: opening it closes other
floating surfaces, and `closeOthers()` or `closeAll()` can close it. A handoff
keeps focus in the newly opened surface.

While an original loads, the viewer shows the grid preview at the final size;
a failed original keeps that preview. After an image loads, the viewer requests
one neighbouring image on each side.

Expo loads its viewer and layout runtime only on HTML albums with images.
Ordinary Image Zoom retains its single-image behavior and does not wrap Expo
links again. Without JavaScript or dialog support, those links open the originals.

When changing images, clear the previous decoded image while the next original
loads, and show the new grid preview at the final size. A failed original keeps
that preview. Album prose and image headings remain separate Markdown blocks.

## Other outputs {#other-outputs}

All outputs use the same image resolver. Enable each format through the normal
OINK output configuration.

| Output | Image content |
| --- | --- |
| Print | Still previews, titles, captions, credits, and original links; no Expo runtime |
| Markdown and LLMSFULL | Original-image links and metadata |
| LLMS | Album pages in the existing index |
| RSS | Static image descriptions |
| Browser print | Expanded album content with controls hidden |

Authors translate album content and resource metadata. Image controls use the
shared interface catalogs. The existing `gallery` fence remains an inline
component with its own contract.

## Acceptance and release boundary {#acceptance-and-release-boundary}

Run the focused theme checks from the theme checkout:

```sh
python3 bin/check-expo.py
node --test tests/js/expo-geometry.test.js
python3 bin/generate-config-schema.py --check
```

Run site acceptance from the sibling documentation checkout:

```sh
make check
make browser
```

The [bilingual examples](/expo/) are the integration and visual review surface.
`tests/browser/expo.spec.mjs` checks interaction and accessibility.
`expo-stability.spec.mjs` samples consecutive frames near the viewport-height
boundary. It forces width-consuming scrollbars independently of host settings.

For the additional Chromium, Firefox, and WebKit checks, install the matching
Playwright browsers and run from the documentation checkout:

```sh
HUGO_MODULE_REPLACEMENTS="github.com/pgsty/oink -> $(cd ../oink && pwd)" \
  npm run test:expo:engines
```

The separate Graph copy supplies additional large-collection evidence.
It does not replace the documentation site's acceptance tests. Local acceptance,
a theme release, downstream upgrades, and deployment are separate steps.
