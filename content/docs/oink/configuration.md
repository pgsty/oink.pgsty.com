---
title: Configuration
weight: 50
description:
  Configure OINK with native Hugo settings and focused theme parameters
---

OINK follows a "native first" configuration model. Site identity, languages,
menus, outputs, taxonomies, markup, and modules stay in their Hugo-defined
locations. Existing Docsy parameters remain where their semantics are useful.
OINK adds only focused choices for behavior that cannot be inferred.

## Configuration rules

1. Prefer Hugo configuration over a theme-specific duplicate.
2. Prefer an established Docsy parameter over an OINK synonym.
3. Put brand, content, repository, and UI choices in their semantic locations.
4. Keep internal vendor paths and template composition out of the public API.
5. Fail early for invalid values or a missing required endpoint.

There is no `oink.enabled` flag and no `params.oink.*` tree. Adding either would
create a second theme mode and make every fix, test, and document ambiguous.

## A complete baseline

This example makes English primary and Simplified Chinese secondary:

```yaml
title: Product Documentation
baseURL: https://docs.example.com/
defaultContentLanguage: en
enableRobotsTXT: true

languages:
  en:
    label: English
    locale: en-US
    weight: 1
    title: Product Documentation
    menus:
      main:
        - { name: Docs, pageRef: /docs, weight: 10 }
        - { name: Blog, pageRef: /blog, weight: 20 }
  zh:
    label: 简体中文
    locale: zh-CN
    weight: 2
    title: 产品文档
    menus:
      main:
        - { name: 文档, pageRef: /docs, weight: 10 }
        - { name: 博客, pageRef: /blog, weight: 20 }

outputs:
  home: [HTML]
  section: [HTML, RSS, print]

markup:
  goldmark:
    renderer:
      unsafe: true
    extensions:
      passthrough:
        enable: true
        delimiters:
          block: [['\[', '\]'], ['$$', '$$']]
          inline: [['\(', '\)']]
  highlight:
    noClasses: false

params:
  logo: icons/logo.svg
  offlineSearch: true
  github_repo: https://github.com/example/product-docs
  github_branch: main
  footer_icp: ''
  footer_icp_url: https://beian.miit.gov.cn/
  copyright:
    authors: Example Authors
    from_year: 2026
  ui:
    showLightDarkModeMenu: true
    quick_links: [docs, blog]
    sidebar_menu_foldable: true
    sidebar_item_overflow: wrap
    breadcrumb_disable: false

module:
  imports:
    - path: github.com/pgsty/oink
  hugoVersion:
    extended: true
    min: 0.160.1
```

The module version is pinned in the site's `go.mod`. A conventional theme
checkout can instead use `theme: oink` with the repository under `themes/oink/`.

## Languages

`defaultContentLanguage` determines the unprefixed primary site. Language
`weight` controls the visible order. `label` is the language's self-name, and
`locale` supplies the full HTML and SEO locale. Add `languageDirection: rtl` to
an RTL language.

### File naming

For the colocated model used by this site:

```text
content/docs/guide.md
content/docs/guide.zh.md
```

Files with the same base name are translations. Keep their logical page identity
aligned. OINK reads Hugo's translation relationships; it does not guess from
arbitrary URL patterns.

### Selector states

The selector needs no mode parameter. It is hidden for one configured language.
With two or more, clicking the language icon advances to the next language by
weight; hovering for half a second or focusing it opens the complete menu.

If the current page lacks a target translation, the target-language home page is
used. Do not add dead page-shaped URLs merely to keep the selector on the same
path.

## Brand and repository

Set the site and per-language `title` and description. `params.logo` can point
to a Hugo Asset or a path under `static/`. Keep favicons and social images in
the documented asset locations.

Repository metadata drives "edit this page," issue, and last-modified links:

```yaml
params:
  github_repo: https://github.com/example/product-docs
  github_project_repo: https://github.com/example/product
  github_branch: main
  github_subdir: site
```

`github_project_repo` defaults to `github_repo` where supported. `github_subdir`
is the content site's path inside a monorepo. Keep `github_branch` resolvable; a
display version is not necessarily a Git ref.

## Navigation and layout

OINK retains Docsy menus and UI parameters and adds focused shell controls:

```yaml
params:
  page_width: normal
  ui:
    quick_links: [docs, blog]
    sidebar_width_min: 220
    sidebar_width_max: 480
    sidebar_item_overflow: wrap
    sidebar_menu_compact: true
    sidebar_menu_foldable: true
    sidebar_root_enabled: true
    sidebar_root_menu: true
    sidebar_search_disable: false
    breadcrumb_disable: false
    showLightDarkModeMenu: true
    readingtime:
      enable: true
```

`page_width` accepts `normal`, `wide`, or `full` and can be overridden in page
front matter. Sidebar minimum and maximum values are pixels used to clamp the
desktop drag resizer. `sidebar_item_overflow: wrap` wraps long labels; other
values retain the compact ellipsis behavior.

`quick_links` names top-level page references shown by the shell. Define their
translated names in each language's main menu.

## Homepage and footer

Homepage content lives in `data/home/<language>.yaml`, with English used as the
fallback. The supported top-level blocks are `hero`, `metrics`, `capabilities`,
`principles`, `cta`, and `footer`. Each block is optional, so a site can keep a
short landing page without copying the layout. For example:

```yaml
hero:
  eyebrow: Local-first documentation
  title_lines:
    - words:
        - { mark: P, text: roduct, color: red }
        - { mark: D, text: ocs, color: blue }
  lead: Documentation built and served with Hugo.
  actions:
    - {
        label: Read the docs,
        url: docs/,
        icon: fa-solid fa-book,
        style: primary,
      }

footer:
  brand:
    name: Product Docs
    tagline: A short **Markdown-enabled** description.
    slogan: Clear answers, close to the product.
  columns:
    - title: Product
      links:
        - { label: Overview, url: docs/ }
```

The homepage renders the large brand-and-navigation footer above the common
footline. The footline uses `params.copyright` on the left, optional
`params.footer_icp` and `params.footer_icp_url` in the center, and every
configured language on the right. Markdown in the copyright author and footer
brand text is rendered as links and inline markup.

## Search

Local search is the starter default:

```yaml
params:
  offlineSearch: true
  offlineSearchSummaryLength: 70
  offlineSearchMaxResults: 10
```

Each language receives a distinct index. Hosted alternatives remain supported
through their established Docsy settings, but enabling them intentionally adds
an external service boundary. Do not configure several competing search
providers without also deciding which UI should be visible.

## Content runtimes

### Browser-only runtimes

Mermaid and KaTeX are detected from content. Enable Markmap at the site level:

```yaml
params:
  markmap:
    enable: true
  mermaid:
    theme: default
```

Swagger UI, Redoc, Asciinema, ECharts, Infographic, and carousel assets load
when their shortcodes appear. Their local runtime paths are internal and should
not be configured.

### Service endpoints

PlantUML and Diagrams.net require explicit endpoints:

```yaml
params:
  plantuml:
    enable: true
    svg: true
    svg_image_url: https://diagrams.internal.example/plantuml/svg/
  drawio:
    enable: true
    drawio_server: https://diagrams.internal.example/
```

Leave the features disabled in an air-gap site unless those URLs are reachable
inside the isolated network.

### ECharts migration switch

Structured ECharts input is safe by default:

```yaml
params:
  content:
    echarts_unsafe: false
```

Set it to `true` only while migrating reviewed legacy pages that contain
JavaScript. Prefer `unsafe=true` on the smallest necessary shortcode instance,
then rewrite the chart and remove the exception.

## Page-level overrides

Hugo's `.Param` lookup allows many site parameters to be overridden in front
matter:

```yaml
---
title: Wide reference
page_width: wide
hide_feedback: true
hide_readingtime: true
ui:
  no_left_sidebar: false
  scrollSpy:
    disable: false
---
```

Use overrides for real content differences, not to reconstruct a separate visual
system page by page.

## Avoid false configuration

Do not expose:

- a switch between "Docsy" and "OINK" shells;
- paths to vendored JavaScript, CSS, fonts, or internal partials;
- duplicated language or repository values under a brand namespace;
- toggles that merely select one of two copied implementations.

If a site needs a custom product matrix or portal, keep that component in the
site and use a narrow hook or shortcode. A local business feature is clearer
than a misleading global theme option.

## Validate changes

After changing configuration:

1. build with the minimum supported Hugo Extended version and the current
   validation version;
2. test every configured language and one page without a translation;
3. verify root and subpath `baseURL` output if both are supported;
4. inspect local search and optional runtime requests;
5. check the desktop and mobile shell, dark and light themes, and print output.

An accepted configuration is one that builds and behaves correctly, not merely
one that parses as YAML.
