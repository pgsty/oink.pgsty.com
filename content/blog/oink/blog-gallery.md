---
title: A gallery view for blog posts
linkTitle: Blog gallery
date: 2026-10-25
lastmod: 2026-10-25
description: Turn a blog section into a wall of linked covers, with three arrangements and captions that work on phones and keyboards.
authors: [vonng]
tags: [Oink]
series: [building-oink]
series_weight: 40
featured_image: none
---

Sometimes the cover is the quickest way to recognize a post. A travel journal,
a collection of sketches, or a set of project notes can be easier to browse
as images than as a column of titles.

OINK's development theme now has a fourth blog view, `gallery`. Each post
becomes a linked cover. The default arrangement joins images into rows;
hovering or focusing a cover reveals its title and description. Clicking it
opens the article.

> [!NOTE] Development feature
> This feature is implemented in the development checkout and has not been
> released in a tagged version. OINK v1.3.2 does not include it.

## Four ways to browse the same posts {#four-views}

The existing views answer different browsing needs. A table is useful when
you know the date or title. Rows give summaries room to breathe. Cards put
the cover and article metadata together. Gallery gives most of the space
to the cover.

| Blog view | What the reader sees |
| --- | --- |
| `list` | Horizontal entries with a thumbnail, metadata, and summary |
| `cards` | A regular grid with 16:9 covers and article information |
| `table` | Compact date, title, and tag rows |
| `gallery` | Covers arranged by proportion, with titles and short descriptions |

With the view switch enabled, all four forms use the same page of posts.
Changing the view keeps the date order and current pagination slice. Readers
can scan the covers, then switch to a table without losing their place in
the archive. A standalone table still lists the whole section when switching
is disabled.

## Borrowing Expo's layout {#borrowing-expo}

[Expo](/docs/write/expo/) already arranges images into a wall. Blog gallery
reuses that row calculation and the same compact layout controls. The
content still comes from ordinary blog pages: the featured image is the
cover, the page title names it, and the description supplies the caption.
There is no second album manifest to keep in sync.

The destination matters. An Expo tile opens an image viewer; a blog tile
opens its article. A post with `manual_link` keeps that external destination.
This makes the gallery useful as an index of writing, including short visual
notes whose cover carries much of the story.

Inside Gallery, readers have three arrangements:

| Arrangement | Layout | Captions |
| --- | --- | --- |
| `wall` | Rows with 6px gaps | Revealed on hover or keyboard focus |
| `seamless` | The same rows with no gaps | Revealed on hover or keyboard focus |
| `cards` | Masonry, placing each entry in the shortest column | Always visible below the image |

The gallery's `cards` mode is the masonry arrangement, separate from the
blog's regular card view. A size slider changes the target tile size from
160 to 360 CSS pixels. Gallery remembers these choices separately from Expo,
so changing a blog index does not rearrange an album on the next page.

## Give captions room on a phone {#touch-and-focus}

A caption that only appears on hover is of little use on a touchscreen.
On devices without a fine pointer and hover, Wall and Seamless put the text
below the image. The layout reserves the tallest caption's height for each
row, so the following row cannot cover its links or text.

Very tall images need another adjustment. If their tiles preserve the exact
source proportions on a narrow screen, the caption can shrink to a few
characters per line. Below 500px of gallery width, we bound tile proportions
more tightly. The full image remains visible inside its tile, with some
empty space where necessary. That tradeoff keeps the text readable without
cropping the cover.

Keyboard focus reveals the same caption as hover and adds an inset focus
ring. The link has the article's title as its accessible name. A post with
no cover remains a clickable title tile; a failed image receives the same
fallback. Without JavaScript, the page shows a responsive grid with visible
captions and ordinary links.

## Enable it for a section {#enable-gallery}

Add these fields to a blog section's `_index.md` front matter:

```yaml {title="content/blog/_index.md"}
blog_index: gallery
blog_index_toggle: true
blog_index_size: 24
blog_gallery:
  mode: wall
  size: 240
```

`blog_index` chooses the initial view. `blog_index_toggle` lets readers cycle
through all four views; set it to `false` to publish only the gallery.
`blog_index_size` controls the number of posts per page, while
`blog_gallery.size` controls the target tile size. They are independent.

For site defaults, put the same keys under `params.ui`:

```yaml {title="hugo.yml"}
params:
  ui:
    blog_index: gallery
    blog_index_toggle: true
    blog_index_size: 24
    blog_gallery:
      mode: wall
      size: 240
```

A page or section cascade can override the site defaults. A `blog_gallery`
block replaces the whole site block, so repeat both fields when you want to
keep both settings. Existing bundled featured images and the `images` field
continue to supply covers.

This integration applies to the theme's native blog section indexes. Custom
homepages and term templates need to render the gallery explicitly; changing
the configuration cannot rewrite a site's own templates.

## Keeping the implementation small {#implementation}

The theme processes suitable large covers into previews within a 960 × 960
box, preserving their proportions. GIF covers use still previews. Images
load lazily, including when a hidden view first becomes visible. Local covers
require no remote image service or additional browser dependency.

Gallery has its own small runtime and reuses Expo's geometry helper. It
recalculates when a view becomes visible, the available width changes, fonts
settle, or an image reveals its dimensions. These events matter more than
the first screenshot: a layout can look correct initially and overlap after
the sidebar moves or the reader changes views.

The checks compare article order across all four forms and across page
boundaries. Browser coverage includes English and Chinese, desktop and touch,
light and dark, keyboard navigation, missing covers, blocked images, and
JavaScript being disabled. The parameter reference lives in the
[blog authoring guide](/docs/write/blog/#list-gallery), and the
[design decision](/docs/design/decisions/blog-gallery/) records the ownership
and content boundaries.
