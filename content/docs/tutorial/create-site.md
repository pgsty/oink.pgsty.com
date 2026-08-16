---
title: Create a site
linkTitle: Create a site
weight: 30
description: From an empty directory to a first previewable bilingual page.
---

This page builds a minimal bilingual site from scratch. For a reference that is
already fully configured, see the [project site](../project-site/) instead.

## Create the skeleton {#create-the-skeleton}

```sh
hugo new site --format yaml my-docs
cd my-docs
hugo mod init github.com/example/my-docs
hugo mod get github.com/pgsty/oink@{{% param tdVersion.latest %}}
```

## Minimum configuration {#minimum-configuration}

Save the following as `hugo.yaml`. This is the smallest set that runs; each
entry is explained in [Basic configuration](../configuration/):

```yaml {title="hugo.yaml" collapse=34}
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

Commit `go.mod` and `go.sum`. Do **not** add npm mounts or a PostCSS pipeline.

> [!NOTE] `markup.goldmark.renderer.unsafe: true` permits inline HTML in
> Markdown. It exists for trusted project authors and is **not** a sanitizer for
> untrusted submissions.

## Organize bilingual content {#organize-bilingual-content}

OINK distinguishes languages by filename suffix, and a translation sits **beside
its source in the same directory**:

- content/
  - _index.md
  - _index.zh.md
  - docs/
    - _index.md
    - _index.zh.md
    - getting-started.md
    - getting-started.zh.md
  - blog/
    - _index.md
    - _index.zh.md
{.filetree}

## Stable heading IDs {#stable-heading-ids}

This is the most common bilingual pitfall: **Hugo derives heading IDs from
heading text**, so a Chinese heading produces a Chinese ID, and
`/docs/page/#install` and `/zh/docs/page/#安装` become two anchors for the same
semantic location.

The fix is to write the source language's ID explicitly in the translation:

```markdown {title="getting-started.md"}
---
title: Getting started
weight: 10
---

## Install {#install}

Install the product.
```

```markdown {title="getting-started.zh.md"}
---
title: 开始使用
weight: 10
---

## 安装 {#install}

安装产品。
```

Both languages now answer to `#install`, so in-site deep links survive a
language switch.

When translating an existing page, copy the ID from the **rendered English
HTML** rather than guessing from the heading text.

## Preview and build {#preview-and-build}

```sh
hugo server --disableFastRender
```

Then verify a production build separately, because the development server and
the production build do not use an identical asset pipeline:

```sh
hugo --gc --minify
```

Before adding custom layouts, confirm that:

- `/docs/` and `/zh/docs/` both open;
- the language selector switches;
- local search returns results;
- the browser console is clean.

## Add features incrementally {#add-features-incrementally}

Start with the logo and brand assets, then repository links and menus. Add
diagrams, API documentation, and content components **only on pages that need
them** — OINK decides which local runtimes to publish from what each page
actually uses, and ships nothing for unused features.

If the site needs shortcodes carrying business semantics, keep them in the
site's own `layouts/_shortcodes/`. Move one into the theme only once its
interface carries no site assumptions and several sites genuinely reuse it.

## Next steps {#next-steps}

- [Basic configuration](../configuration/): complete the configuration
- [Authoring](/docs/content/): content organization and writing conventions
- [Deployment](/docs/deploy/): choose a hosting target
