---
title: Publish posts and release notes
linkTitle: Blog
description: Write dated posts with authors, series and featured images, choose how the index looks, open articles on a full-width image the way vonng.com does, and announce each release.
book_kind: chapter
book_number: 6
weight: 60
aliases:
  - /book/05-publishing/
---

Documentation answers "how", and it stays current. A blog answers "what
changed, and why", and it is dated. OINK gives the blog its own shell: posts
ordered by date, authors with profile pages, series that read in order, a feed
per section and share links at the end. The Starter already has a blog under
`content/blog/`; this chapter writes Acme DB's first real post and its 3.0
release notes.

## Write a post {#post}

A post with its own image is a page bundle: a directory holding `index.md` and
the image. Put it in the Starter's `post/` subsection:

```filetree {title="content/blog/post/"}
- why-monthly-partitions/
  - index.md
  - index.zh.md
  - featured.webp   # the post's thumbnail and share image, found by its name
```

````markdown {title="content/blog/post/why-monthly-partitions/index.md" num="6-1" caption="A blog post with authors, a series and tags." #eg-blog-post}
---
title: Why Acme DB partitions by month
date: 2026-11-02
description: Monthly partitions make retention a file deletion and keep most queries inside one directory.
authors: [mei-lin]
series: [storage-internals]
series_weight: 10
tags: [storage, design]
---

Retention used to mean deleting billions of rows. Since 2.0 it means deleting
one directory.

## One directory per month {#layout}

```filetree
- tables/cpu/
  - 2026-10/
  - 2026-11/
```
````

Three keys matter more on a post than on a documentation page. `date` decides
the post's place in the index and its feed timestamp, and a post dated in the
future stays out of the build until that day (preview it with
`hugo server -F`). `description` appears above the body as the post's lead, so
write it as a sentence. And the image named `featured.webp` becomes the
thumbnail on the index and the picture on social cards without any front
matter; `images: [cover.png]` names a different file.

## Authors and series {#authors}

`authors` and `series` are Hugo taxonomies, so the site declares them. Writing
`taxonomies` replaces Hugo's defaults, so list tags and categories again:

```yaml {title="hugo.yaml"}
taxonomies:
  tag: tags
  category: categories
  author: authors
  series: series
```

The post now shows Mei Lin's byline, linked to a page listing everything she
wrote. That page is the taxonomy term page, and you give it a profile by
writing its `_index.md`:

```markdown {title="content/authors/mei-lin/_index.md"}
---
title: Mei Lin
description: Maintains the Acme DB storage engine.
images: [portrait.webp]
---

Mei has worked on time-series storage since 2018 and wrote the partition layer.
```

Bylines use the profile's `title`, or its `linkTitle` when you want a shorter
name. A series works the same way: posts that name `storage-internals` show a
strip above the body with their position and a link to the next part, ordered
by `series_weight`, and `content/series/storage-internals/_index.md` introduces
the series.

## Choose the index {#index}

The blog's front page lists every post, newest first. `blog_index` sets the
layout and `blog_index_toggle` lets readers switch it themselves:

```yaml {title="content/blog/_index.md"}
blog_index: cards
blog_index_toggle: true
```

| Value | What readers see |
| --- | --- |
| `list` | Rows with a thumbnail, date, tags and summary. The default |
| `cards` | A grid of cards with a cropped cover above each title |
| `table` | One compact row per post: an archive of everything on one page |
| `gallery` | Covers at their own proportions, for blogs that are mostly pictures |
{#tbl-blog-index num="6-1" caption="The four blog index layouts."}

With the toggle on, a switch appears beside the title, and
{{< kbd "L" >}} cycles the layouts when keyboard navigation is on. Try it on
this site's [blog](/blog/).

## An article that opens on an image {#immersive}

vonng.com opens each article on a full-width image, runs the outline through
the text column and drops the sidebar, so the page reads like a magazine. Its
home page sets the tone with the same kind of image:

![The vonng.com home page: an author hero over a lake, then the list of columns](/case/vonng-com/featured.webp)
{#fig-vonng-home num="6-1" caption="vonng.com: an author hero over a landscape, then six columns, each with its own feed." width=900 height=506}

The article layout is four ordinary keys.
A section's `cascade` applies them to one column without touching the rest of
the blog:

```yaml {title="content/blog/post/_index.md"}
cascade:
  featured_image: hero
  toc_style: flow
  toc_taxonomies: false
  sidebar_enabled: false
```

`featured_image` takes `none`, `banner`, `wash` or `hero`; a post without an
image simply shows none. The post is still an ordinary blog post, with the same
feed, byline and series strip. This site's
[Immersive reading](/blog/immersive-reading/) post uses exactly these keys.

## Announce a release {#releases}

A version announcement is an ordinary post in `blog/release/`, with the version
as its short title. One front matter key links the GitHub release, and the
`release-card` shortcode draws a card with the tag, the date and the source
archives from it:

```markdown {title="content/blog/release/3.0.0.md"}
---
title: Acme DB 3.0 — tiered storage and a faster ingest path
linkTitle: v3.0.0
date: 2026-10-20
description: Tiered storage moves old partitions to object storage, and the ingest path is three times faster.
release_url: https://github.com/acme/acme-db/releases/tag/v3.0.0
tags: [release]
---

{{</* release-card */>}}

## Highlights {#highlights}

- Tiered storage moves partitions older than `retention.hot` to S3.
- Ingest throughput is up from 1.2 to 3.4 million points per second.
```

The release post says when and why something shipped; the docs pages stay the
reference for how to use it. Link from one to the other instead of copying.
[Releases and downloads](/docs/write/releases/) adds asset tables with
checksums and a download page fed from `data/download/`.

## Feeds and sharing {#feeds}

Every section with the `RSS` output gets a feed, and the Starter already lists
it, so `/blog/index.xml` carries every post and `/blog/release/index.xml` only
the releases; the RSS button sits on the title row. Share links are off until
you name the targets:

```yaml {title="hugo.yaml"}
params:
  ui:
    share: [x, linkedin, hackernews, email, copy]
```

Each is a plain link or a copy button, and none loads a third-party script.
Comments use Giscus once fully configured; see
[Comments](/docs/admin/comments/).

## Check your work {#checkpoint}

- The post appears first on `/blog/` with its featured image, and the index switches between four layouts with {{< kbd "L" >}}.
- Mei Lin's name on the post opens her profile, and the series strip shows part 1 of Storage internals.
- With the cascade in place, posts under `post/` open on a full-width image with the outline in the text column.
- `/blog/release/index.xml` lists the 3.0 release notes.

## Ask your agent {#agent}

```text {num="6-2" caption="Prompt: set up the blog the way vonng.com does." #eg-agent-blog}
Set up the blog following https://oink.pgsty.com/docs/write/blog/. Enable the
authors and series taxonomies (keep tags and categories), create my author
profile from <bio>, and turn each post with an image into a page bundle with
featured.webp. Give the post/ column the immersive cascade: featured_image
hero, toc_style flow, toc_taxonomies false, sidebar_enabled false. Use a card
index with the layout toggle on. Write release notes for <version> from
CHANGELOG.md with release_url and a release-card. Check the index layouts,
an author page and the feed in the browser.
```
