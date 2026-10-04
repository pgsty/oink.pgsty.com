---
title: Blog posts
linkTitle: Blog posts
description: Setting up a blog section — directory conventions, a post's front matter, featured images, the date-ordered list page, and RSS.
weight: 40
search_keywords: [blog, post, RSS, feed, featured image, author, date, pagination]
---

A blog post's body is written exactly like a documentation page; the shell is
what differs. A post carries a date, an author, tags and a featured image, the
list is ordered by date newest first, and the section has an RSS feed. This page
covers creating the blog section, a post's front matter, featured images, list
pagination and feeds.

## The blog directory {#layout}
A blog is a section under `content/`, and `type: blog` gives it the blog shell.
Subdirectories divide it by publisher and audience, with posts sitting flat
inside. Year directories are unnecessary: the list orders posts by their
`date`.

```filetree {title="this site's content/blog/"}
- content/
  - blog/
    - _index.md                      # type: blog + cascade
    - _index.zh.md
    - oink/                          # engineering notes and announcements
      - _index.md                    # cascade: images: [/images/oink.webp]
      - oink-announcement.md
      - oink-announcement.zh.md
    - release/                       # versioned release notes
      - _index.md                    # cascade: images: [/images/releasenote.webp]
      - 0.4.0.md
      - 0.4.0.zh.md
```

The section root pushes the type down the whole subtree and sets the behaviour
that section shares:

```yaml {title="content/blog/_index.md"}
---
title: Blog
description: OINK engineering notes and release announcements
type: blog
icon: fa-solid fa-blog
sidebar_root_for: self      # the blog has its own sidebar tree
cascade:
  type: blog
  feedback: false           # posts do not ask "was this page helpful?"
  comments: true            # but they do take comments
---
```

`params.ui.blog_section` (default `blog`) names where the blog root is. Rename
the directory and either change that parameter or use `sidebar_root_for: self`
as above.

Blog sections are expanded by default in the sidebar and ordered by date, newest
first; giving one post a `weight` pins it to the top.

## A post's front matter {#front-matter}

```yaml {title="content/blog/release/0.4.0.md"}
---
title: Oink 0.4.0 — scenario components for a complete release workflow
linkTitle: Oink v0.4.0        # short name in the sidebar and pager
date: 2026-08-14              # publication date; decides list order
lastmod: 2026-08-14
description: >-
  Oink 0.4.0 delivers sequential reading and release surfaces, reusable landing
  pages, book publishing with stable references, and a keyboard-first site shell.
author: The OINK maintainers
categories: [Release]
tags: [Oink, Release]
---
```

Where it differs from a documentation page:

- `date` is required. It decides the post's place in the list and its RSS timestamp. A date in the future is not built by default; `hugo server -F` previews it.
- `description` is rendered as a standfirst above the body, not only as a search snippet, so write it as a sentence for the reader.
- `author` accepts inline Markdown, so `[Vonng](https://vonng.com)` works. For more than one author, a portrait, or a profile page, use the `authors` taxonomy below instead; the two do not interfere, and a post keeps rendering `author` wherever `authors` is absent.
- The date display format comes from `params.time_format_blog` and can be set per language (this site uses `Monday, January 02, 2006` in English and `2006年1月2日` in Chinese).

Bilingual posts are stored in pairs, keeping `date`, `author`, `weight` and
`aliases` identical across the two. Titles, descriptions and tags are
translated; commit IDs, version numbers, commands and URLs are not.

## Featured image {#featured-image}

Each row on a list page or a tag page has a thumbnail on the left, resolved in
this order, first match winning:

1. `images` in the post's front matter, first entry;
2. An image resource in the page bundle whose filename matches `featured` or `feature`, then `cover` or `thumbnail` (it is cropped to a thumbnail, and the resource's own `byline` becomes its caption);
3. An `images` value inherited from an ancestor section's `cascade`, nearest first.

A section-wide default uses Hugo's native `cascade` over the whole subtree; this
site sets one for each of its two subsections:

```yaml {title="content/blog/release/_index.md"}
cascade:
  images: [/images/releasenote.webp]
```

To clear an inherited image on one post, write `images: []` in its front matter;
for a whole subsection, put it in that level's `cascade`. This does not suppress
an image supplied by the page bundle. To hide the image on the article itself,
use `featured_image: none`; list thumbnails and share cards are separate uses.
The site-level `params.images` feeds the share card only and is never rendered
as a list thumbnail.

### On the article itself {#featured-image-article}

By default the resolved image appears on list rows and in the social card. Set
`params.ui.featured_image` to use the same image on the article itself:

| Mode | What the article shows |
| --- | --- |
| `none` | No article image; the theme default |
| `banner` | The image above the title in a fixed 16:9 figure, so a run of articles keeps one rhythm |
| `wash` | A faint image behind the article header, fading before the body |
| `hero` | An immersive full-bleed image header |

```yaml {title="hugo.yml"}
params:
  ui:
    featured_image: banner
```

The page key is `featured_image`, so a `cascade` on one subsection turns it on
for that tree and a single post can opt out. A post with no image renders
no image in any mode, so a section can enable it even when only some posts have
art. These modes need no additional script.

```yaml {title="content/blog/release/_index.md"}
cascade:
  featured_image: wash
```

## List pages and pagination {#list}

After the body of the section `_index.md`, the theme appends the post list:
ordered by date, newest first, with no year groups. Each row shows the
title, date, subsection, tags, thumbnail and the first 250 characters of the
body as a summary.

List and card views show 12 posts per page by default. Set the theme's
`blog_index_size` in `hugo.yml` to change it:

```yaml {title="hugo.yml"}
params:
  ui:
    blog_index_size: 20
```

The same key in a blog section's front matter overrides the site value. The
theme passes this size to Hugo's paginator explicitly, so `pagination.pagerSize`
does not control these lists.

### The card form {#list-cards}

`params.ui.blog_index: cards` renders the same list as a grid of content cards
instead of rows: a 16:9 crop of the post's image above the title, the date and
subsection line, and a three-line summary.

```yaml {title="hugo.yml"}
params:
  ui:
    blog_index: cards
    blog_index_columns: 3
```

List and card views share date ordering, pagination and `manual_link` behavior.
The column count applies above the xl breakpoint; between md and xl the grid is
two columns and below md it is one. Front matter `blog_index` on a blog root,
or its `cascade`, sets the view per section. Term and taxonomy pages keep the
row list.

A standalone `blog_index: table` with `blog_index_toggle: false` lists the
entire section without pagination. Set `blog_index_toggle: true` to let readers
switch among list, cards and table:

```yaml {title="content/blog/_index.md"}
blog_index: cards
blog_index_toggle: true
```

With switching enabled, all three views show the same current page of posts,
using `blog_index_size`. Only the standalone table with
`blog_index_toggle: false` shows the entire section. Hidden views do not load
their images.

Card images go through Hugo's `.Fill` whenever the resource can be processed, so
a grid of posts does not download a full-size original per card.

## RSS {#rss}

Which pages produce a feed is decided by `outputs`. Adding `RSS` to `section`
gives every section its own feed:

```yaml {title="hugo.yml"}
outputs:
  home: [HTML, markdown, LLMS]
  page: [HTML, markdown]
  section: [HTML, RSS, print, markdown]
```

Writing `outputs` at all replaces Hugo's defaults wholesale, so `RSS` has to be
written back explicitly. Omitting it turns off the feed for that page kind, and
the build does not complain.

This site therefore has `/blog/index.xml` (the whole blog) and
`/blog/release/index.xml` (release notes only). A section feed recursively
includes every subsection's posts, so subscribing to `/blog/` covers
everything. An individual post has no `.xml` of its own.

Each language has its own feed at that language's route plus `index.xml`. The
item limit is Hugo's `services.rss.limit`. On the blog root and its first-level
subsection pages, the first action button beside the title row is the RSS link,
so a reader need not assemble the address by hand.

To drop feeds site-wide, turn the kind off with `disableKinds`, which is more
thorough than removing `RSS` from each page kind:

```yaml {title="hugo.yml"}
disableKinds: [RSS]
```

Components degrade to their static shape in a feed: disclosures are expanded and
interactive controls are removed. The four-output rules are the same for blog
posts as for documentation.

## Categories and tags {#taxonomy}

`tags` and `categories` are Hugo's taxonomies, and the theme renders them as
chips in the post header, a tag cloud in the right column, and a filter menu in
the navbar. Enabling them, bilingual term labels, and switching them per content
type are covered in [Taxonomies](/docs/customize/taxonomy/).

## Release notes {#release-notes}

A versioned release announcement is an ordinary post, conventionally under
`blog/release/`, with the version in `linkTitle` (`Oink v0.4.0`). For a download
page with release cards, asset tables and checksums, see
[Releases and downloads](/docs/write/releases/).

## Components in a post {#components}

Callouts, tabs, code blocks, images and tables work exactly as on a
documentation page; the syntax is in [Components](/docs/components/). Headings
in a post body take explicit English `{#id}` anchors too.

The four blocks at the end of a post — feedback, last modified, pager, comments
— behave as on a documentation page; see
[Writing pages](/docs/write/pages/#page-end). A blog usually turns feedback off
and keeps comments.

## Authors and bylines {#authors}

Declaring the taxonomy is the entire switch; the theme adds no parameter:

```yaml {title="hugo.yml"}
taxonomies:
  category: categories
  tag: tags
  author: authors
```

A post then names its authors in order:

```yaml
authors: [vonng, ada-example]
```

The article head renders portraits and linked names in that order; list rows
show the names. The blog feed includes each author alongside the site-level
`managingEditor`.

An author's profile is the taxonomy term page; no `data/authors` file is needed:

```markdown {title="content/authors/vonng/_index.md"}
---
title: Vonng
description: Maintainer of OINK and Pigsty.
images: [portrait.webp]
---

The long introduction, rendered on the profile page under the name.
```

The display name is the term page's **link title** — `linkTitle` when it has
one, `title` otherwise — so a profile can carry a full name and byline a short
handle. `description` is the one-line introduction, the body the long one, and
the avatar is whatever the featured-image resolver selects for that page — so `images:` and a bundled portrait follow the same rules an
article's own image follows. A bilingual profile is an `_index.zh.md` beside it.
A name a post uses but nobody gave a profile page still bylines: the link title,
an initial, and a link to its archive.

The 0.4 `author:` string is untouched wherever `authors` is absent, and neither
form warns about the other.

## Series {#series}

A series is a reading path through articles that each stand alone. Numbering,
cross-references and aggregate output belong to [Book](/docs/write/book/); this
is the lighter thing. Declaring the taxonomy is again the whole switch:

```yaml {title="hugo.yml"}
taxonomies:
  series: series
```

An article names the series and may place itself in it:

```yaml
series: [shell-internals]
series_weight: 20
```

It then carries a strip above its body naming the series, its position, the next
part, and the whole list behind a `<details>` — no JavaScript, no bundle member.
The term page `content/series/<name>/_index.md` is the introduction, and an
`_index.zh.md` beside it makes the pair bilingual.

Members with `series_weight` come first in ascending order; the rest follow
from oldest to newest, with the content path breaking ties. The series strip
and term page use this same reading order. For implementation details, see
[Authors and series](/docs/design/shell/#authors-and-series).

A member of several series shows one strip, for the first term it names. A
series of one shows none.

Neither `authors` nor `series` appears in the generic taxonomy chip row on an
article, because each has a surface of its own. Name one in
`params.taxonomy.page_header` to put it back.

## Share {#share}

`params.ui.share` puts a share bar at the top of the page end. It is empty by
default, so nothing renders until a site names its targets, in the order it
wants them:

```yaml {title="hugo.yml"}
params:
  ui:
    share: [x, bluesky, mastodon, reddit, hackernews, email, copy]
```

Sixteen targets are available: `x`, `bluesky`, `mastodon`, `facebook`,
`linkedin`, `reddit`, `hackernews`, `telegram`, `whatsapp`, `line`,
`pinterest`, `weibo`, `chatgpt`, `claude`, `email`, and `copy`. An unknown name
warns and is dropped. Discord is absent on purpose: it publishes no share-intent
URL at all, so `copy` stands in for it rather than the theme guessing at a
private scheme.

The page key is `share`, so a `cascade` scopes the bar to one tree, a page's own
list replaces the inherited one, and `share: false` opts a single page out:

```yaml {title="content/blog/_index.md"}
cascade:
  share: [x, bluesky, email, copy]
```

Only a regular page renders the bar — a list, a term page and the home page have
no single thing being shared — and print, Markdown and RSS carry none of it.

Share targets are links carrying the page's permalink and title, plus a local
copy button. The bar loads no third-party scripts or stylesheets; a target is
contacted only when the reader clicks its link. See the
[Share contract](/docs/design/shell/#share) for the implementation rules.

`chatgpt` and `claude` hand that same build-time permalink to an assistant with
a prompt asking it to read the page. They are not the "open in ChatGPT" /
"open in Claude" entries of the page action menu, which the runtime rewrites at
activation time to the live browser URL and which therefore stay behind
`page_context_menu.assistant_links`.

The copy button is the built-in `copy_link` action, which means the Command
Palette carries it on every page of every site whether or not a bar is
configured.

## Verify {#verify}

```bash
hugo --printPathWarnings --panicOnWarning
```

It must reach `Total in …` with no ERROR and no WARN. Then confirm:

1. The post appears in the right date order at `/blog/`, with the date in the expected format;
2. `public/blog/index.xml` exists, contains the post, and its links are complete absolute addresses;
3. The thumbnail shows in the list (a missing one means none of the three featured-image sources matched);
4. Tag chips lead to the corresponding tag page.

## Related {#related}

- [Writing pages](/docs/write/pages/) — how to write the body
- [Page parameters](/docs/write/frontmatter/) — the full definition of `author`, `images` and the rest
- [Organizing content](/docs/write/organize/) — directories and the sidebar
- [Taxonomies](/docs/customize/taxonomy/) — tags and categories
- [Releases and downloads](/docs/write/releases/) — version cards and asset tables
