---
title: Blog
description: Oink engineering notes, design stories, and reading shell guides
search_keywords: [OINK blog, engineering, immersive reading, gallery, design]
weight: 50
type: blog
icon: fa-solid fa-blog
aliases: [/blog/oink/]
sidebar_root_for: self
sidebar_root_link_self: true
footer_style: fat
comments: true
blog_index: cards
blog_index_toggle: true
# The section root is a feed index, not a destination: backlinks belong on
# the posts it lists, so it opts out of the site-wide default.
backlinks: false
# The Book/Blog reading shells keep the title bar pinned: long-form reading
# should not make the navbar appear and disappear under the pointer.
navbar_autohide: false
images: [/images/oink.webp]
# Section identity: the Blog reads in violet. The dark half is named so the
# section keeps the intended violet instead of relying on a derived tint.
cascade:
  theme_color: '#6d28d9'
  theme_color_dark: '#a78bfa'
  type: blog
  navbar_autohide: false
  images: [/images/oink.webp]
  # The other featured-image mode: a framed 16:9 banner above the title.
  featured_image: banner
  footer_style: fat
  comments: true
  reading_time: true
  # The page-end share bar, scoped to the blog. Every entry is a plain intent
  # link carrying only this page's permalink and title -- no SDK, no iframe, no
  # third-party script, no share counts -- plus one local copy button.
  share: [x, bluesky, mastodon, reddit, hackernews, email, copy]
  feedback: false
  search_boost: 0.9
  sidebar_menu_compact: false
  sidebar_expand_levels: 3
---
