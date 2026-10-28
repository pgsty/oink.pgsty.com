---
title: Shape the reading experience
linkTitle: Shape the experience
description: Turn a sound content structure into a recognizable, responsive, and bilingual publication.
book_kind: chapter
book_number: 4
weight: 40
---

Design begins after the content tree works. This chapter connects brand
identity, visual presets, home-page composition, navigation, and bilingual
alignment in your Starter checkout.

## Establish the visual hierarchy {#hierarchy}

Start with title, lead, body, headings, and local navigation. A reader should
understand which region owns the next action before color or ornament is added.
OINK provides the hierarchy; site variables provide the identity.

Open `hugo.yaml` in your Starter repository and update the site title,
canonical URL, visual preset, and brand accent color:

```yaml {title="hugo.yaml"}
title: &siteTitle Acme Docs
baseURL: https://docs.acme.example/

params:
  ui:
    preset: paper
    preset_menu: [paper, slate, ink, terminal]
    dark_mode: true
    theme_color: '#245f94'
    typography: system
```

Save the file and check `http://localhost:1313/`. The YAML anchor updates the
title across all enabled languages, and the Appearance menu in the top navbar
lets readers switch between `paper`, `slate`, `ink`, and `terminal` in both
light and dark modes.

## Compose the home page {#home}

The home page is driven by data files in `data/home/`. Its YAML section list
should tell a short story: what the project is, who it serves, and what readers
can do next.

Edit `data/home/en.yaml` to point the primary hero action to the page you wrote
in Chapters 2 and 3:

```yaml {title="data/home/en.yaml"}
sections:
  - hero
  - cards
  - cta

hero:
  eyebrow: Acme · Open Source Documentation
  title: Clear operational guides for Acme.
  lead: Install, configure, and run Acme in production with copy-ready examples.
  actions:
    - label: Verify Local Preview
      url: docs/preview-check/
      icon: fa-solid fa-rocket
      style: primary
    - label: Browse Docs
      url: docs/
      style: ghost
```

## Keep navigation predictable {#navigation}

Navbar entries, the shell root switcher, the sidebar, the outline, and the
pager answer different questions. Review them together on desktop and mobile,
and ensure the same content order remains visible in both languages:

- **Top navbar (`menus.main` on section roots)**: switches between top-level
  content areas (`Docs`, `Blog`, `Book`).
- **Left sidebar (directory tree + `weight`)**: shows where the current page
  sits in its section.
- **Right outline (page `##` and `###` headings)**: jumps within the current
  page.
- **Bottom pager**: moves sequentially to the previous or next page in the
  current tree.

## Design both languages at once {#languages}

Treat translations as full peers from the start. Mirror your home-page change in
`data/home/zh.yaml` so Chinese readers land on `/zh/docs/preview-check/` with
the same structure and actions:

```yaml {title="data/home/zh.yaml"}
hero:
  eyebrow: Acme · 开源工程文档
  title: 清晰可靠的 Acme 运维指南。
  lead: 通过可直接复制的示例，在生产环境中安装、配置并运行 Acme。
  actions:
    - label: 验证本地预览
      url: docs/preview-check/
      icon: fa-solid fa-rocket
      style: primary
    - label: 浏览文档
      url: docs/
      style: ghost
```

Notice that `url: docs/preview-check/` stays relative to the language root—OINK
resolves it to `/docs/preview-check/` in English and `/zh/docs/preview-check/`
in Chinese automatically. For the complete set of visual options and landing
sections, see [Brand and appearance](/docs/customize/brand/),
[Home and landing pages](/docs/customize/home/), and
[Languages](/docs/customize/i18n/).

