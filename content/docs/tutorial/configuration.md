---
title: Basic configuration
linkTitle: Basic configuration
weight: 40
description:
  Site identity, languages, search, repository links, and production build
  flags.
---

Hugo reads site-level settings from `hugo.yaml`, `hugo.toml`, or `hugo.json`.
The OINK project site uses YAML because multilingual menus and theme options are
easier to read and review in that form.

This page covers **the configuration a site needs to run**. Navigation menus,
multilingual details, and version management are in
[Site configuration](/docs/configure/).

## Complete minimum configuration {#minimum-configuration}

```yaml {filename="hugo.yaml" lineNos="table" collapse=28}
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

markup:
  goldmark:
    renderer:
      unsafe: true

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

module:
  imports:
    - path: github.com/pgsty/oink
  hugoVersion:
    extended: true
    min: {{% param hugoMinVersion %}}
```

## Key parameters {#key-parameters}

{{< fields >}} {{% field name="baseURL" type="string" required=true %}} The real
production address, **including any subpath**. Deploying to `example.com/docs/`
requires `https://example.com/docs/`, or every asset link points at the wrong
location. {{% /field %}}
{{% field name="defaultContentLanguage" type="string" default="en" %}} The
default language. It decides which language the unprefixed URLs serve.
{{% /field %}} {{% field name="languages.<lang>.weight" type="integer" %}}
Language order. The lowest weight comes first, and the language button cycles in
that order. {{% /field %}}
{{% field name="params.offlineSearch" type="boolean" default="false" %}} Enables
the theme's same-origin Lunr index and CJK substring fallback. Indexes are
generated per language and queries never leave the site. {{% /field %}}
{{% field name="params.github_repo" type="string" %}} The content repository.
Edit this page, View edit history, and Report an issue are all derived from it.
{{% /field %}}
{{% field name="params.github_branch" type="string" default="main" %}} The
branch that edit and history links point at. {{% /field %}}
{{% field name="params.ui.showLightDarkModeMenu" type="boolean" default="false" %}}
Shows the light/dark control. OINK's interactive features are opt-in; the theme
does not set site policy on a site's behalf. {{% /field %}} {{< /fields >}}

## Output formats {#output-formats}

OINK forces no optional output format. A site declares what it wants:

```yaml {filename="hugo.yaml"}
outputs:
  home: [HTML, RSS, markdown, LLMS]
  page: [HTML, markdown]
  section: [HTML, RSS, print, markdown]
```

| Format     | Effect                                                   |
| ---------- | -------------------------------------------------------- |
| `markdown` | Enables the Copy Markdown and View markdown page actions |
| `LLMS`     | Emits `llms.txt` so AI tooling can index the site        |
| `print`    | Enables the whole-section print view                     |

## Local runtimes {#local-runtimes}

Mermaid, KaTeX, Markmap, Swagger UI, Redoc, Asciinema, ECharts, and Infographic
all ship with the theme and **load according to what each page actually uses**.
A page that uses none of them receives none of their runtimes.

PlantUML and Draw.io are the exception: their normal workflow depends on a
rendering service, so OINK provides **no default endpoint**. Enabling one
without configuring an endpoint fails the build:

```yaml {filename="hugo.yaml"}
params:
  plantuml:
    enable: true
    svg_image_url: https://diagrams.internal.example/plantuml/svg/
```

This is deliberate: a failed build is better than silently sending content to a
public service you never chose.

## Production checklist {#production-checklist}

- Use the real production `baseURL`, including any subpath.
- Disable hosted analytics, comments, Google CSE, Algolia, and remote embeds
  unless each is an explicit product decision.
- Pin the Hugo Extended version and the theme version in CI.
- Use `hugo --gc --minify` as the production build command.
- Keep `LICENSE`, `NOTICE`, and `VENDOR.json` when redistributing an archive.

For a complete buildable reference, read the project site's own `hugo.yml`.

## Next steps {#next-steps}

- [Site configuration](/docs/configure/): menus, languages, versions
- [Authoring](/docs/content/): start writing documentation
