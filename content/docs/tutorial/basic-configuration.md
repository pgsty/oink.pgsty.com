---
downstream_modified: true
title: Basic site configuration
date: 2021-12-08T09:22:27+01:00
weight: 40
icon: fa-solid fa-sliders
description: Configure the site, languages, navigation, and local features.
aliases: [/docs/get-started/basic-configuration/]
---

Hugo reads site-wide settings from `hugo.yaml`, `hugo.toml`, or `hugo.json`. The
The Oink project site uses YAML because multilingual menus and theme options
remain easy to scan and review.

## Minimum configuration

The following excerpt shows the important structure for the Hugo Module.

```yaml {filename="hugo.yaml" lineNos="inline" collapse=24}
title: Product Documentation
baseURL: https://docs.example.com/
defaultContentLanguage: en

languages:
  en:
    label: English
    locale: en-US
    weight: 1
    title: Product Documentation
    menus:
      main:
        - name: Docs
          pageRef: /docs
          weight: 10
        - name: Blog
          pageRef: /blog
          weight: 20
  zh:
    label: 简体中文
    locale: zh-CN
    weight: 2
    title: 产品文档
    menus:
      main:
        - name: 文档
          pageRef: /docs
          weight: 10
        - name: 博客
          pageRef: /blog
          weight: 20

markup:
  goldmark:
    renderer:
      unsafe: true
  highlight:
    noClasses: false

params:
  offlineSearch: true
  github_repo: https://github.com/example/product-docs
  github_branch: main
  copyright:
    authors: Example Authors
    from_year: 2026
  ui:
    showLightDarkModeMenu: true
    sidebar_menu_foldable: true
    breadcrumb_disable: false

module:
  imports:
    - path: github.com/pgsty/oink
  hugoVersion:
    extended: true
    min: {{% param hugoMinVersion %}}
```

English has weight 1 and is the default language; Simplified Chinese has weight
2; additional languages follow. The language selector uses this order when a
click cycles to the next language and when the full hover menu is rendered.

## Content translations

Put translations beside each other:

```text {title="Content tree" copy=false}
content/
├── _index.md
├── _index.zh.md
├── docs/
│   ├── _index.md
│   ├── _index.zh.md
│   ├── install.md
│   └── install.zh.md
└── blog/
    ├── release.md
    └── release.zh.md
```

Keep route-affecting metadata aligned. Translate titles, descriptions, menu
labels, summaries, tags, image alternatives, and visible shortcode strings. Use
the English rendered heading ID as an explicit ID on each translated heading so
that fragments remain stable across languages.

## Local search and browser resources

`offlineSearch: true` enables the theme's same-origin Lunr index and CJK
fallback. The index is generated per language. Do not configure a public search
service unless the site intentionally accepts that network dependency.

Mermaid, KaTeX, Markmap, Swagger UI, Redoc, Asciinema, ECharts, and Infographic
are provided locally and loaded per page. PlantUML and Draw.io are service-based
exceptions: configure an approved endpoint explicitly or keep them disabled.

## Branding and repository links

Set `title`, per-language titles, `params.logo`, repository URLs, copyright, and
menus at the site layer. OINK does not add an `oink.*` configuration tree; it
uses Hugo and compatible Docsy parameter locations.

Repository metadata enables edit, view, issue, and age information on content
pages. Keep `github_repo`, `github_project_repo`, `github_branch`, and
`github_subdir` consistent with the source layout.

## Production defaults

- Use a real production `baseURL`, including any subpath.
- Keep online analytics, comments, Google CSE, Algolia, and remote embeds off
  unless they are an explicit product choice.
- Pin Hugo Extended and the theme release in CI.
- Run `hugo --gc --minify` as the production command.
- Keep `LICENSE`, `NOTICE`, and the vendor manifest in redistributed archives.

See the project site's complete `hugo.yaml` for a buildable reference.
