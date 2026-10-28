---
title: OINK Release Notes
linkTitle: Releases
description:
  OINK 1.4.0 release notes, Hugo-only build requirements, and versioned upgrade history
weight: 10
icon: fa-solid fa-clipboard-list
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
cascade:
  images: [/images/releasenote.webp]
  featured_image: hero
  toc_style: flow
  toc_taxonomies: false
  sidebar_enabled: false
---

> [!NOTE] Versioned history
> Each release note records the requirements and validation of that version at release time. Current development, CI, and release tests use Hugo Extended 0.168.0; see the [toolchain contract](/docs/design/architecture/#hugo-toolchain).

The current release is [OINK 1.4.0](/blog/release/1.4.0/): richer local search,
local PlantUML, shared diagram reading, an opt-in table reader, the blog gallery,
and component refinements. Use Hugo Extended **0.168.0**, keep warnings visible,
and never enable `--panicOnWarning` or `HUGO_PANICONWARNING`. No external Sass
compiler is required.

For the changes contributed in 1.3.1, see its
[reading repairs and contributor credits](/blog/release/1.3.1/#thanks).
