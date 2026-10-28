---
title: Blog posts as a gallery
linkTitle: Blog gallery
description: Keep articles as the content model while reusing Expo geometry for a fourth blog index view.
weight: 65
icon: fa-solid fa-images
design_kind: decision
design_status: accepted
decision_date: 2026-10-25
---

> [!NOTE] Accepted in OINK 1.4.0
> This decision records the released gallery blog view and its compatibility
> boundaries.

The [shell contract](/docs/design/shell/#blog-gallery) defines the behavior.
The [design blog](/blog/oink/blog-gallery/) explains the reading experience,
and the [authoring guide](/docs/write/blog/#list-gallery) gives configuration.

## Context {#context}

Some blog sections are most easily scanned by their covers. The existing row,
card, and table views prioritize article information. Expo already supplies
image-wall geometry, but its album resources and image viewer have a different
content model and destination.

## Decisions {#decisions}

Gallery is a fourth `blog_index` form. It consumes the same paginator slice
and featured-image resolver as the other blog views. Articles retain their
URLs and metadata; authors do not duplicate them in an album manifest.

Share Expo's row geometry and control styling. Keep the blog runtime and
reader preferences separate, because a blog cover opens an article rather
than an image viewer. The `wall`, `cards`, and `seamless` arrangements are
choices within the gallery, while the outer view switch selects among the
four blog forms.

Contain each cover within bounded tile proportions. This preserves the image
at the cost of some blank space for extreme aspect ratios. Narrow layouts
use tighter bounds so captions retain a readable width. Touch captions stay
below the images and contribute to row height; keyboard focus reveals desktop
captions. Missing covers keep an article link, and a no-JavaScript grid keeps
titles and descriptions visible.

## Consequences {#consequences}

An enabled view switch publishes markup for all four forms. Hidden views use
lazy images, but preparing their thumbnails still costs build time. Authors
can disable switching to emit only their chosen form. This change adds no
remote image service or new browser library.

Native blog section indexes own the automatic integration. Custom home and
term templates must explicitly render the gallery and its controls. A site
configuration setting does not replace custom templates.

## Verification and ownership {#verification-and-ownership}

Theme checks in `bin/check-shell.py` compare article order, pagination,
external links, missing covers, and invalid configuration fallbacks. The
configuration schema follows the theme defaults and resolver. Runtime tests
verify the four-form cycle and saved preferences.

The documentation site's `tests/browser/blog-gallery.spec.mjs` owns browser
acceptance with synthetic, bilingual content. It covers layout changes,
resizing, independent preferences, keyboard navigation, touch captions,
failed images, no-JavaScript output, and gallery accessibility.
