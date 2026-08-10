---
downstream_modified: true
title: Create a new site
date: 2021-12-08T09:21:54+01:00
weight: 30
icon: fa-solid fa-file-circle-plus
description: Create a minimal bilingual OINK site without a frontend toolchain.
aliases: [/docs/get-started/docsy-as-module/start-from-scratch/]
---

The independent [bilingual project site](project-site/) is a useful reference.
Use this procedure to create a smaller site with its own content structure.

## Create the site skeleton

Run:

```sh
hugo new site --format yaml my-new-site
cd my-new-site
```

Initialize the site module and pin Oink:

```sh
hugo mod init github.com/example/my-new-site
hugo mod get github.com/pgsty/oink@THEME_REF
```

## Add minimum configuration

Use this as `hugo.yaml`:

```yaml
title: Product Docs
baseURL: https://docs.example.com/
defaultContentLanguage: en

languages:
  en:
    label: English
    locale: en-US
    weight: 1
    menus:
      main:
        - { name: Docs, pageRef: /docs, weight: 10 }
        - { name: Blog, pageRef: /blog, weight: 20 }
  zh:
    label: 简体中文
    locale: zh-CN
    weight: 2
    menus:
      main:
        - { name: 文档, pageRef: /docs, weight: 10 }
        - { name: 博客, pageRef: /blog, weight: 20 }

markup:
  goldmark:
    renderer:
      unsafe: true
  highlight:
    noClasses: false

params:
  offlineSearch: true
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

Commit `go.mod` and `go.sum`. Do not add npm mounts or a PostCSS pipeline.

## Add bilingual content

Create these files:

```text
content/
├── _index.md
├── _index.zh.md
├── docs/
│   ├── _index.md
│   ├── _index.zh.md
│   ├── getting-started.md
│   └── getting-started.zh.md
└── blog/
    ├── _index.md
    └── _index.zh.md
```

Every page needs front matter. For example, `content/docs/getting-started.md`:

```markdown
---
title: Getting started
weight: 10
---

## Install {#install}

Install the product.
```

Its `getting-started.zh.md` translation keeps the explicit heading ID:

```markdown
---
title: 开始使用
weight: 10
---

## 安装 {#install}

安装产品。
```

Using the same explicit ID in both examples is harmless and makes the intended
cross-language contract visible. In a translated existing page, copy the ID from
the English rendered HTML.

## Preview and build

Run the development server:

```sh
hugo server --disableFastRender
```

Then verify the production build separately:

```sh
hugo --gc --minify
```

Check `/docs/`, `/zh/docs/`, the language selector, local search indexes, and
the browser console before adding custom layouts.

## Add features incrementally

Copy logo and brand assets first, then add repository links and menus. Add
diagrams, API documentation, and content components only on pages that need
them; OINK will publish their local runtimes on demand.

If a site needs a business-specific shortcode, keep it under the site's own
`layouts/_shortcodes/`. Move it into the theme only after its interface is free
of site assumptions and multiple sites can reuse it.

## What's next?

- Expand the [basic configuration](/docs/tutorial/basic-configuration/).
- Learn how to [add content](/docs/content/adding-content/).
- Review the [OINK architecture](/docs/about/architecture/).
- Select a [deployment target](/docs/deploy/).
