---
title: OINK Release Notes
linkTitle: Release
description: Oink release notes, Hugo-only build requirements, and versioned upgrade history
search_keywords: [OINK release, release notes, changelog, version history, upgrade]
weight: 60
type: blog
icon: fa-solid fa-tags
aliases: [/blog/release/]
sidebar_root_for: self
sidebar_root_link_self: true
footer_style: fat
comments: true
backlinks: false
navbar_autohide: false
blog_index: table
blog_index_toggle: true
# The whole section reads immersively: a hero opening drawn from the section
# image, no sidebar or breadcrumb, and a clouds-free flow rail. The index
# carries the keys itself (a cascade never applies to the page declaring it)
# and passes the same recipe to every note below.
images: [/images/releasenote.webp]
featured_image: hero
sidebar_enabled: false
toc_taxonomies: false
# Section identity: Release notes read in emerald green.
cascade:
  theme_color: '#047857'
  theme_color_dark: '#34d399'
  type: blog
  navbar_autohide: false
  images: [/images/releasenote.webp]
  featured_image: hero
  toc_style: flow
  toc_taxonomies: false
  sidebar_enabled: false
  footer_style: fat
  comments: true
  reading_time: true
  share: [x, bluesky, mastodon, reddit, hackernews, email, copy]
  feedback: false
  search_boost: 0.9
---

> [!NOTE] Versioned history
> Each release note records the requirements and validation of that version at release time. OINK 1.6.0+ builds with Hugo 0.169.0+ in any edition and Go 1.27.4; see the [toolchain contract](/docs/design/architecture/#hugo-toolchain).

The current release is [OINK 1.6.0](/release/1.6.0/): plain CSS assembled
by Hugo for Hugo 0.170+ compatibility, Bootstrap JS and Lunr removal, scanning
BM25 local search with split indexes and field anchors, Markmap 1.1.0, ReDoc
3.1.0, on-approach component loading, single-line navbar overflow, and 32
tightened locale catalogs. Keep warnings visible, and never enable
`--panicOnWarning` or `HUGO_PANICONWARNING`. No Sass compiler is required.

For the changes contributed in 1.3.1, see its
[reading repairs and contributor credits](/release/1.3.1/#thanks).
