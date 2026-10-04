---
title: caps.vonng.com
description: >-
  CapsLock: turn the most useless key on the keyboard into a fifth modifier. A two-page project site whose second page is a data-driven interactive configurator.
images: [featured.webp]
weight: 60
date: 2026-08-10
search_keywords: [caps.vonng.com, Capslock, configurator, small site]
tags: [Tool, Bilingual, Small site]
---

[caps.vonng.com](https://caps.vonng.com/) is a two-page-per-language
site for the Capslock keyboard enhancement: a home page and an interactive
configuration generator. The generator reads `data/capslock-v3.json` and uses
a custom `customizer` shell type alongside the regular documentation shell.

## What it demonstrates {#what-it-demonstrates}

- The practical lower bound of an OINK site: a tiny project needs no front-end
  application just to publish a tool and its introduction.
- Extending the shell registry for one purpose-built interactive page.
- Keeping generator data separate from its presentation and bilingual prose.

Use this pattern when documentation is small but one interactive tool deserves
the same navigation, theme, and language controls as the rest of the site.

## Keep the application at the site layer {#implementation}

The site's [`hugo.yaml`](https://github.com/Vonng/caps.vonng.com/blob/25f5a2940208cad12df56ea9993e7b6d27860577/hugo.yaml)
includes `customizer` in `params.ui.shell_types`.
[`content/customizer.md`](https://github.com/Vonng/caps.vonng.com/blob/25f5a2940208cad12df56ea9993e7b6d27860577/content/customizer.md)
selects `type: customizer` and `layout: customizer`, then invokes the site's
[`capslock-configurator` shortcode](https://github.com/Vonng/caps.vonng.com/blob/25f5a2940208cad12df56ea9993e7b6d27860577/layouts/_shortcodes/capslock-configurator.html).
The configurator, JavaScript, and keyboard data are site code; OINK does not
include this application.

Reuse this boundary when a small custom tool needs the documentation shell.
You must maintain its interaction code yourself; a two-page site does not make
that application maintenance disappear.

→ [Layout configuration](/docs/customize/layout/) · [All OINK cases](/case/)
