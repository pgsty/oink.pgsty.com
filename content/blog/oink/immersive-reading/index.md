---
title: Immersive reading on the Blog shell
linkTitle: Immersive reading
date: 2026-08-19
lastmod: 2026-08-19
description: >-
  Four front matter keys turn an ordinary Blog page into a reading-first
  layout with a full-bleed hero and an in-flow outline rail.
summary: >-
  Use four front matter keys to give an ordinary Blog article a full-bleed
  Hero, an in-flow outline, and a distraction-free reading shell.
authors: [vonng]
featured_image: hero
toc_style: flow
toc_taxonomies: false
sidebar_enabled: false
tags: [Oink]
series: [building-oink]
series_weight: 30
---

This page is rendered by the ordinary Blog shell. There is no special content
type behind it. Four front matter keys change the presentation, and a section
can set the same recipe once in a cascade:

```yaml
featured_image: hero      # the image becomes a full-bleed opening
toc_style: flow           # a wider outline starts with the article
toc_taxonomies: false     # the rail carries the outline alone
sidebar_enabled: false
```

## The hero {#the-hero}

A page with a featured image can open with it. `hero` turns that image into a
full-bleed backdrop across the top of the viewport, moves the title down to
give it room, and masks the artwork away before the body begins. Because the
shell paints it, the same presentation also works on a section index.

The page card, social preview, and Hero all use the same representative-image
resolver. `featured_image: banner` keeps the framed alternative, while a page
without a suitable image simply falls back to the normal opening.

## The outline rail {#the-rail}

`toc_style: flow` replaces the viewport-pinned outline with a wider rail in the
content flow. It starts beside the article below the Hero and becomes sticky
only after scrolling. The switch is independent of the image, so one section
can keep a consistent outline even when some pages have no artwork.

`toc_taxonomies: false` removes the taxonomy clouds. If a page has neither an
outline nor clouds, the empty rail is omitted completely.

## What remains available {#what-stays-on}

Everything below the opening is still a normal Blog article: date and reading
time, tag badges, authors and profiles, the series strip, the description lead,
sharing, annotation, sequential navigation, and comments. The Blog shell omits
breadcrumbs by default; `breadcrumb: true` restores one for a page that needs
its position in the tree to remain visible.
