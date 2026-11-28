---
title: Image albums with Expo
linkTitle: Expo albums
description: Create an image album, add optional metadata, select a layout, and use the image viewer.
weight: 55
icon: fa-solid fa-images
search_keywords: [expo, album, gallery, images, GIF, wall, cards, seamless, zoom]
---

Expo turns folders of images into a collection readers browse rather than
read: albums grouped in the sidebar, a grid of the selected album's images,
and a viewer for zooming and stepping through them. Use it when the images are
the content, such as a photo archive, a screenshot library or a set of posters
and diagrams. For a few images inside an article, the
[Gallery component](/docs/components/gallery/) fits better. The
[example albums](/expo/) show every control described here.

## Create an album {#create-an-album}

An album is a folder holding an `index.md` that describes it and an `images/`
subfolder with the pictures. Filenames supply the default image titles, so an
album needs no file per image; you add metadata only where you want more.

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

1. Create the section entry, which makes everything below it an Expo page:

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

A section page lists its child topics and albums, and the sidebar follows the
same tree; on narrow screens it opens as a navigation drawer. The album's body
text is optional and appears above the images.

Expo does not paginate, so split a large collection into several albums. On a
section page, each album card uses the album's first image in sort order as its
cover, and a topic without images of its own borrows the first one from its
albums. Covers fill a 4:3 frame, so they may be cropped.

## Image metadata {#image-metadata}

To give an image a title, description, credit or fixed position, add a
`resources` entry to the album's front matter. The `src` path is relative to
the album folder.

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

Images with equal weights keep the order of their resource names. Because the
default weight is `0`, images without a weight come before any image with a
positive weight; to fix the complete order, weight every image.

An `id` gives the image a permanent link, here
`/photos/nature/field-notes/#img-fern`, which survives renaming the file as long
as the album URL stays the same. Without one, Expo derives the ID from a hash
of the filename, so renaming the file breaks links to the image. An ID starts
with an ASCII letter or digit, may continue with `_` and `-`, and must be
unique within its album.

To link a larger original from a lighter preview, put the original in
`originals/` and set `params.original: originals/fern.jpg`. Keep both at the
same aspect ratio, and keep `originals/` outside the `expo.images` pattern, or
every original also appears in the album as an image of its own. Expo reads
only images in the album bundle; it never fetches remote files.

## Defaults {#defaults}

Choose the site-wide layout and tile size in `hugo.yml`:

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

An album, or a section through `cascade`, can set its own top-level `expo`
block:

```yaml {title="Album front matter"}
expo:
  images: images/*
  mode: cards
  size: 280
```

A page block replaces the site block as a whole: a field it omits takes the
built-in default, not the site's value. `size` is the tile size the layout aims
for, not a fixed width and height for every image.

A reader's own choice wins over both. The layout and size a reader picks are
saved in the browser for the whole site and persist through reloads, album
changes and appearance changes. When browser storage is unavailable, each page
starts from your defaults.

## Layouts {#layouts}

| Mode | Display |
| --- | --- |
| `wall` | Rows of image tiles with 6 CSS pixels between them |
| `cards` | Columns of cards with visible titles, descriptions, and credits |
| `seamless` | Rows of image tiles with no gaps between them |

Readers switch layouts with the three icons in the album toolbar, which also
holds a play/pause button and an image-size slider. On devices with a mouse,
`wall` and `seamless` show captions on hover or keyboard focus. Album tiles
always show the whole image, so an image with extreme proportions leaves empty
space inside its tile.

GIFs play by default, and Pause switches them to still previews. When the
system asks for reduced motion, Expo starts with still previews and Play starts
them. The button is disabled in an album without GIFs. Images load as they
approach the visible area, but a large GIF still costs its full file size once
it loads.

## The image viewer {#viewer}

Selecting an image opens the viewer. A small image starts at its original
size; a large one shrinks until it fits the image area in both directions.

| Control | Action |
| --- | --- |
| Reset | Restore the initial size and center the image |
| Expand to fit | Enlarge or shrink the image until its limiting edge fits the image area |
| Zoom out / Zoom in | Divide or multiply the current scale by `1.25` |
| Open original | Open the original image file in a new tab |
| Locate in album | Close the viewer and move to this image in the album |
| Previous / Next | Show the adjacent image in the same album |
| Close | Close the viewer and restore focus to an image link |

Expand to fit keeps the whole image visible; it does not put the browser into
fullscreen. Zooming in can make the image larger than the viewing area: drag
it with the left mouse button, and it stops at the image's edges. On a touch
screen, an enlarged image scrolls natively, a fitted image changes with a
one-finger horizontal swipe, and pinching keeps the browser's own behavior.
Double-click alternates between the initial fit and a closer view: a reduced
image opens at 100% under the pointer, and an image already at its original
size expands to fit.

Changing images resets the scale and position, and Previous and Next stop at
the ends of the album. Percentages are in CSS pixels: at 100%, one source pixel
occupies one CSS pixel.

## Keyboard shortcuts {#shortcuts}

On an album page (not a section page listing albums), with `keyboard_nav`
enabled, {{< kbd ";" >}} cycles through `wall`, `cards` and `seamless`,
{{< kbd "," >}} / {{< kbd "<" >}} shrinks the tiles by one step (`−20 px`), and
{{< kbd "." >}} / {{< kbd ">" >}} enlarges them by one step (`+20 px`).

The viewer has its own keys. They work whenever the viewer is open, whatever
`keyboard_nav` says, and take precedence over the page's single-key
navigation. They stay out of the way of text input, input-method composition
and any Ctrl, Command or Alt combination.

| Key | Action |
| --- | --- |
| W / A / S / D | Move the enlarged image up / left / down / right |
| Q or H | Previous image |
| E or L | Next image |
| J or − | Zoom out |
| K, + or = | Zoom in |
| R or 0 | Reset the size and position |
| F | Expand to fit |
| Escape | Close the viewer |

W, A, S and D move the image 80 CSS pixels per press, and only along an axis
where it overflows. The Left and Right arrow keys change images while the image
fits horizontally; once it is wider than the viewing area, they scroll it
instead. In right-to-left languages the arrows follow the reading direction.

## Appearance and page width {#appearance}

Expo has no appearance settings of its own. Albums use the site's visual
preset (Paper, Slate, GitHub, Ink, News or Terminal) and its light or
dark mode, readers switch them from the shared navigation as on any other
page, and the grid re-lays itself out after a preset change. To offer every
preset, set
`params.ui.preset_menu: [paper, slate, github, ink, news, terminal]`; see
[Visual presets](/docs/customize/brand/#visual-presets). The top navbar follows
the site's navbar settings, and the album page shows its image toolbar instead
of the article action menu.

An album uses the full available page width and has no outline on the right.
Set `page_width` in its front matter for a narrower body. If your site sets
`params.ui.shell_types`, keep `expo` in the list, or albums lose their sidebar.

## Translations and other outputs {#translations-and-outputs}

For a Chinese album, add `index.zh.md` beside `index.md`, and `_index.zh.md` to
each translated section. Both languages share the image files; translate the
title, description and resource metadata in each page, and keep the same image
`id` for the same image so links match across languages.

Albums work without JavaScript: image links open the original files and
captions stay visible. Where you enable them, Print shows still previews,
Markdown and LLMSFULL list image links with their metadata, and RSS carries
static image descriptions. See [Print](/docs/customize/print/) and
[Agent outputs](/docs/customize/agents/) to turn those outputs on.

## Check an album {#check-an-album}

1. Run `hugo --printPathWarnings` and read the warnings.
2. Open each album and confirm the image order, titles and descriptions.
3. Open a small image, a wide image, a tall image and, if the album has one, a GIF.
4. Try Reset, Expand to fit, zoom, dragging, the keyboard shortcuts and Locate in album.
5. Check both languages, a narrow screen, each preset you offer, and light and dark mode.

An empty album usually means a wrong `type`, a folder that is not a page bundle
(no `index.md`), or an `expo.images` pattern that matches nothing. A default
that seems to have no effect is usually overridden by a choice saved in your
browser, or by a page `expo` block that replaced the whole site block.
