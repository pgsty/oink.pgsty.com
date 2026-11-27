---
title: Blog posts
linkTitle: Blog posts
description: Write blog posts with dates, bylines, series and featured images, then choose how the blog index, RSS feed and share bar present them.
weight: 40
search_keywords: [blog, post, RSS, feed, featured image, author, date, pagination, layout, gallery]
---

A blog section gives dated writing the shell readers expect from a blog: a
newest-first index with a thumbnail on every row, an RSS feed, bylines, tags
and share links. The body of a post is ordinary Markdown, written exactly like
a documentation page; what changes is the front matter and the section around
it.

## Write a post {#front-matter}

Create one Markdown file per post anywhere in the blog section. The file path
becomes the URL, and the `date`, not the folder, decides where the post appears:

```yaml {title="content/blog/release/2.4.0.md"}
---
title: Release 2.4 — parallel restore and faster vacuum
linkTitle: v2.4.0             # short name in the sidebar and pager
date: 2026-08-14              # publication date; decides list order
lastmod: 2026-08-14
description: >-
  Version 2.4 restores large clusters in parallel, halves vacuum time on
  append-only tables, and adds a dry-run mode to every upgrade command.
author: The maintainers
categories: [Release]
tags: [Release, Backup]
---
```

Four keys matter more on a post than on a documentation page:

- `date` is required, because it sets the post's place in the index and its
  RSS timestamp. A post dated in the future stays out of the build until that
  day; preview it with `hugo server -F`.
- `description` appears above the body as the post's introduction and in
  search results, so write it as a sentence for the reader rather than a
  keyword list.
- `author` accepts inline Markdown, so `[Alice Chen](https://example.com/alice)`
  works. For several authors, portraits or profile pages, use
  [`authors`](#authors) instead; a post that has `authors` ignores `author`.
- The date is shown in the format of `params.time_format_blog`, ISO
  `2006-01-02` by default. Set it per language for a localized form:

  ```yaml {title="hugo.yml"}
  languages:
    en:
      params:
        time_format_blog: January 2, 2006
    zh:
      params:
        time_format_blog: 2006年1月2日
  ```

The body takes every [component](/docs/components/) a documentation page does,
and headings take explicit English `{#id}` anchors here too. `tags` and
`categories` appear as chips under the title, a cloud in the right rail and a
filter menu in the navbar; [Taxonomies](/docs/customize/taxonomy/) covers
enabling them and translating their labels. The page end (feedback, last
modified, pager, comments) works as described in
[Writing pages](/docs/write/pages/#page-end); a blog usually turns feedback off
and keeps comments.

A bilingual post is a pair of files, `2.4.0.md` and `2.4.0.zh.md`, with the
same `date`, `author`, `weight` and `aliases`. Translate the title, description
and tags, but not commit IDs, version numbers, commands or URLs.

## Featured image {#featured-image}

The featured image is the thumbnail on the post's index row and the picture on
its social share card. OINK uses the first of these it finds:

1. the first entry of `images` in the post's front matter;
2. an image in the post's page bundle whose filename contains `featured` or
   `feature`, then `cover` or `thumbnail`; it is cropped to fit, and the
   resource's own `byline` becomes its caption;
3. `images` inherited from an ancestor section's `cascade`, nearest first.

The third source gives a whole section a default image, so posts without art of
their own still get a thumbnail:

```yaml {title="content/blog/release/_index.md"}
cascade:
  images: [/images/release.webp]
```

To drop an inherited image from one post, write `images: []` in its front
matter; to drop it from a whole subsection, put that in the subsection's
`cascade`. Neither hides an image the page bundle supplies. The site-level
`params.images` is used for share cards only, never as an index thumbnail.

### On the article itself {#featured-image-article}

By default the featured image appears only on index rows and share cards. Set
`params.ui.featured_image` to show it on the article as well:

| Mode | What the article shows |
| --- | --- |
| `none` | No image on the article. The default |
| `banner` | The image above the title in a fixed 16:9 frame, so a run of posts reads with the same rhythm |
| `wash` | A faint copy of the image behind the article header, fading out before the body |
| `hero` | A full-width image header |

```yaml {title="hugo.yml"}
params:
  ui:
    featured_image: banner
```

The page key is `featured_image`, so a subsection's `cascade` can switch it on
for that tree alone and a single post can opt out. A post without an image
shows none in any mode, which makes it safe to enable for a section where only
some posts have art. The modes load no script. A bundled or asset raster image
is re-encoded as WebP and requested ahead of the page's other images; an
animated image keeps its frames.

```yaml {title="content/blog/release/_index.md"}
cascade:
  featured_image: wash
```

## Authors and bylines {#authors}

Use the `authors` taxonomy when a blog has more than one writer, or when
readers should be able to see everything one person wrote. Declaring the
taxonomy is the only switch; the theme adds no parameter for it:

```yaml {title="hugo.yml"}
taxonomies:
  category: categories
  tag: tags
  author: authors
```

A post then names its authors in byline order:

```yaml
authors: [alice-chen, raj-patel]
```

The article header shows their portraits and linked names in that order, index
rows show the names, and the blog feed lists each author alongside the
site-level `managingEditor`.

An author's profile is the taxonomy term page, so no `data/authors` file is
involved:

```markdown {title="content/authors/alice-chen/_index.md"}
---
title: Alice Chen
linkTitle: Alice
description: Maintains the backup and restore tooling.
images: [portrait.webp]
---

The long introduction, rendered on the profile page under the name.
```

Bylines use the term page's `linkTitle`, or `title` when there is none, so a
profile can carry a full name while bylines show a short one. `description` is
the one-line introduction and the body the long one. The portrait is chosen by
the same rules as a post's [featured image](#featured-image), so `images:` and a
bundled `portrait.webp` both work. A Chinese profile is an `_index.zh.md` beside
it. An author named in a post but without a profile page still gets a byline:
the name, an initial in place of a portrait, and a link to their post archive.

## Series {#series}

A series is a reading path through posts that each stand on their own, such as
a five-part deep dive into backup internals. It is lighter than a
[book](/docs/write/book/), which adds chapter numbers, cross-references and a
combined print view. Declaring the taxonomy enables it:

```yaml {title="hugo.yml"}
taxonomies:
  series: series
```

A post names its series and may give itself a position:

```yaml
series: [backup-internals]
series_weight: 20
```

The post then shows a strip above its body with the series name, the post's
position, a link to the next part, and the full list inside a `<details>`, with
no JavaScript. The term page `content/series/<name>/_index.md` is the series
introduction; an `_index.zh.md` beside it makes it bilingual.

Members with a `series_weight` come first in ascending order; the others follow
from oldest to newest, and the content path breaks ties. The strip and the term
page use the same order. A post in several series shows one strip, for the
first series it names, and a series with only one post shows none.

Neither `authors` nor `series` appears in the taxonomy chip row on a post,
since each has its own place on the page. To show one there as well, name it in
`params.taxonomy.page_header`.

## Release notes {#release-notes}

A version announcement is an ordinary post, conventionally under
`blog/release/`, with the version in `linkTitle` (`v2.4.0`). To add a card
linking the GitHub release and source archives, an asset table with checksums,
or a chronological release index, see
[Releases and downloads](/docs/write/releases/).

## Set up the blog section {#layout}

The Starter already has a blog. To create one, make a section under `content/`
and give it `type: blog`. Split it into subsections by audience or purpose if
you like, but not by year: the index orders posts by `date` on its own.

```filetree {title="content/blog/"}
- content/
  - blog/
    - _index.md                      # type: blog + cascade
    - _index.zh.md
    - engineering/                   # design notes and benchmarks
      - _index.md                    # cascade: images: [/images/engineering.webp]
      - parallel-restore.md
      - parallel-restore.zh.md
    - release/                       # one post per version
      - _index.md                    # cascade: images: [/images/release.webp]
      - 2.4.0.md
      - 2.4.0.zh.md
```

The section root sets the type for the whole subtree, along with anything every
post should share:

```yaml {title="content/blog/_index.md"}
---
title: Blog
description: Engineering notes and release announcements
type: blog
icon: fa-solid fa-blog
sidebar_root_for: self      # the blog has its own sidebar tree
cascade:
  type: blog
  feedback: false           # posts do not ask "was this page helpful?"
  comments: true            # but they do take comments
---
```

`params.ui.blog_section` (default `blog`) tells the theme where the blog root
is. If you name the directory something else, change that parameter or keep
`sidebar_root_for: self` as above.

In the sidebar, blog sections start expanded and list posts newest first. A
post with a `weight` is pinned above the dated ones there; the post index
ignores `weight` and stays in date order.

## List layouts and pagination {#list}

Below the section's own `_index.md` text, OINK appends the post index: every
post in the section and its subsections, newest first, without year groups.
`blog_index` chooses how it looks:

| Value | Layout | What the reader sees |
| --- | --- | --- |
| `list` | Horizontal rows (default) | Thumbnail, title, date, subsection, tags and summary |
| `cards` | Card grid | A cropped 16:9 cover above the title, metadata and summary |
| `table` | Compact table | Date, title and tags, one row per post |
| `gallery` | Image gallery | Covers at their own proportions with titles and descriptions; click to open the post |

Set the site default with `params.ui.blog_index` in `hugo.yml`, or set
`blog_index` in a blog section's `_index.md` to override it there; a section's
`cascade` passes it to the sections below. These settings shape blog section
indexes only. Tag and category pages keep their own layout, and a custom home
page needs its own template to show posts.

`list`, `cards` and `gallery` show 12 posts per page. Change that with
`blog_index_size`, in `hugo.yml` for the site or in a section's front matter
for one blog:

```yaml {title="hugo.yml"}
params:
  ui:
    blog_index_size: 20
```

Hugo's `pagination.pagerSize` has no effect on these lists, because the theme
passes `blog_index_size` to the paginator itself.

### The card form {#list-cards}

`cards` turns the rows into a grid of content cards, each with a 16:9 crop of
the featured image above the title, a date and subsection line, and a
three-line summary:

```yaml {title="hugo.yml"}
params:
  ui:
    blog_index: cards
    blog_index_columns: 3
```

`blog_index_columns` applies above the xl breakpoint; between md and xl the grid
has two columns, and below md one. When the image can be processed, Hugo crops
it with `.Fill`, so readers download a small preview instead of the original.

### Table and layout switching {#list-switching}

`table` is an archive view: it always lists every post in the section on one
page, without pagination. Set `blog_index_toggle: true` to let readers choose
for themselves. A switch appears beside the title (and on
{{< kbd "L" >}} when keyboard navigation is on), cycling `list` → `cards` →
`table` → `gallery` → `list`:

```yaml {title="content/blog/_index.md"}
blog_index: cards
blog_index_toggle: true
```

The switch remembers the reader's choice. With it on, `list`, `cards` and
`gallery` share the same `blog_index_size` pages and pager, while `table` still
shows every post at once. Every layout keeps date order and `manual_link`
destinations. Hidden layouts load their images lazily, but their markup and
thumbnails still add build time. With `blog_index_toggle: false`, only the
configured layout is published and any saved reader choice is ignored.

### Gallery form {#list-gallery}

`gallery` suits a blog whose posts are mostly visual. Each post becomes a
linked cover, taken from its featured image; the default wall joins covers into
rows while keeping their proportions. Titles and descriptions appear on hover or
keyboard focus, and below the image on touch screens. A post without a cover
keeps a title tile.

```yaml {title="content/blog/_index.md"}
blog_index: gallery
blog_index_toggle: true
blog_gallery:
  mode: wall
  size: 240
```

The gallery toolbar offers three arrangements:

| `blog_gallery.mode` | Arrangement | Captions |
| --- | --- | --- |
| `wall` (default) | Justified rows with 6px gaps | On hover or keyboard focus; below images on touch screens |
| `seamless` | The same rows without gaps | On hover or keyboard focus; below images on touch screens |
| `cards` | Masonry columns | Always visible below images |

`blog_index: cards` is the regular card grid; masonry inside the gallery is
`blog_index: gallery` with `blog_gallery.mode: cards`. `blog_gallery.size` is
the target tile size, from 160 to 360 CSS pixels with a default of 240, and has
nothing to do with `blog_index_size`, the number of posts per page.

Readers can change the arrangement and size, and their choice is remembered
separately from Expo albums. With keyboard navigation on and the gallery in
view, {{< kbd ";" >}} cycles `wall` → `cards` → `seamless`, and
{{< kbd "," >}} / {{< kbd "<" >}} or {{< kbd "." >}} / {{< kbd ">" >}} shrinks
or enlarges tiles by `20 px`.

The site default is a `blog_gallery` block under `params.ui`. A block in a
page or `cascade` replaces it whole, and any field it omits falls back to
`wall` and `240`. The reference tables are in
[site parameters](/docs/customize/config/#blog) and
[page parameters](/docs/write/frontmatter/#blog).

## RSS {#rss}

Which pages publish a feed is decided by `outputs`. Adding `RSS` to `section`
gives every section its own feed:

```yaml {title="hugo.yml"}
outputs:
  home: [HTML, markdown, LLMS]
  page: [HTML, markdown]
  section: [HTML, RSS, print, markdown]
```

Writing `outputs` replaces all of Hugo's defaults, so list `RSS` explicitly. A
page kind without it has no feed, and the build does not warn you.

With the tree above, `/blog/index.xml` carries every post, subsections
included, and `/blog/release/index.xml` only the release posts. Individual
posts have no feed of their own. Each
language has its own feed at that language's path plus `index.xml`, and Hugo's
`services.rss.limit` caps the number of items. On the blog root and its
first-level subsections, the first button on the title row is the RSS link, so
readers never have to guess the address.

To publish no feeds at all, turn the kind off. That is more thorough than
removing `RSS` from each page kind:

```yaml {title="hugo.yml"}
disableKinds: [RSS]
```

In a feed, components take their static form: disclosures are expanded and
interactive controls removed.

## Share {#share}

`params.ui.share` adds a row of share links at the top of the page end. It is
empty by default, so nothing appears until you list the targets you want, in
the order you want them:

```yaml {title="hugo.yml"}
params:
  ui:
    share: [x, bluesky, mastodon, reddit, hackernews, email, copy]
```

Sixteen targets are available: `x`, `bluesky`, `mastodon`, `facebook`,
`linkedin`, `reddit`, `hackernews`, `telegram`, `whatsapp`, `line`,
`pinterest`, `weibo`, `chatgpt`, `claude`, `email` and `copy`. An unknown name
warns and is dropped. There is no `discord`, because Discord offers no public
share link to build one from; `copy` covers it.

The page key is also `share`, so a `cascade` limits the bar to one tree, a
page's own list replaces the inherited one, and `share: false` removes it from
a single page:

```yaml {title="content/blog/_index.md"}
cascade:
  share: [x, bluesky, email, copy]
```

Only regular pages show the bar; lists, term pages and the home page have no
single item to share, and print, Markdown and RSS output leave it out. Each
target is a plain link carrying the page's permalink and title, plus a local
copy button. The bar loads no third-party scripts or stylesheets, and a
service hears about the page only when a reader clicks its link.

`chatgpt` and `claude` hand that same permalink to an assistant with a prompt
asking it to read the page. They are separate from the "Open in ChatGPT" and
"Open in Claude" items of the page action menu, which send the live browser URL
when clicked and therefore stay behind `page_context_menu.assistant_links`.

The copy button is the built-in `copy_link` action, which the Command Palette
offers on every page whether or not a share bar is configured.

## Verify {#verify}

```bash
hugo --printPathWarnings
```

The build should end with `Total in …` and no ERROR. Then check that:

1. the post appears at `/blog/` in the right date order, with the date in the
   format you expect;
2. `public/blog/index.xml` exists, contains the post, and uses complete
   absolute links;
3. the post has a thumbnail in the index (if not, none of the three
   featured-image sources matched);
4. each tag chip leads to its tag page.

## Related {#related}

- [Writing pages](/docs/write/pages/) — how to write the body
- [Page parameters](/docs/write/frontmatter/#blog) — every blog key with its type and default
- [Organizing content](/docs/write/organize/) — directories and the sidebar
- [Taxonomies](/docs/customize/taxonomy/) — tags and categories
- [Releases and downloads](/docs/write/releases/) — version cards and asset tables
