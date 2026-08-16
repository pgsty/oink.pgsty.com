---
title: 分类法支持
tags: [标签, 内容结构, 标注]
categories: [分类法]
weight: 110
description: 使用标签、类别与自定义分类法组织内容。
cSpell:ignore: taxo
---

OINK 在文档与博客分区中支持 Hugo
[分类法][]。本页既展示默认布局，也可以用来测试生成链接的行为。

## 术语 {#terminology}

使用分类法前，需要理解以下术语：

- **分类法（Taxonomy）**：用于对内容进行分类的体系，例如标签、类别、项目、人物。

- **术语（Term）**：分类法中的一个键。例如，在“项目”分类法中可以有“项目 A”和“项目 B”。

- **值（Value）**：分配给某个术语的一项内容，例如属于特定项目的站点页面。

Hugo 文档提供了一个[电影网站分类法示例][]。

[电影网站分类法示例]:
  https://gohugo.io/content-management/taxonomies/#example-taxonomy-movie-website

## 参数 {#parameters}

项目[配置文件][]中有多项参数可以控制分类法功能。Hugo 默认启用 `tags` 与
`categories` 分类法。要 **禁用** 分类法，请在项目配置中添加：

<!-- markdownlint-disable no-shortcut-ref-link -->
<!-- prettier-ignore-start -->
```toml {tab="hugo.toml" group="hugotoml-hugoyaml-hugojson" value="hugotoml"}
disableKinds = ["taxonomy"]
```

```yaml {tab="hugo.yaml" value="hugoyaml"}
disableKinds: [taxonomy]
```

```json {tab="hugo.json" value="hugojson"}
{
  "disableKinds": [ "taxonomy" ]
}
```
<!-- prettier-ignore-end -->
<!-- markdownlint-enable no-shortcut-ref-link -->

保持默认设置时，Hugo 会生成 `tags` 与 `categories`
的分类法页面。如果要使用其他分类法，需要在[配置文件][]中定义。如果希望自定义分类法与默认的
`tags`、`categories`
并存，也必须把默认分类法一并写入配置。每种分类法都需要提供单数与复数标签。

下面的示例在默认 `tags` 和 `categories` 之外，又定义了 `projects` 分类法：

<!-- markdownlint-disable no-shortcut-ref-link -->
<!-- prettier-ignore-start -->
```toml {tab="hugo.toml" group="hugotoml-hugoyaml-hugojson" value="hugotoml"}
[taxonomies]
tag = "tags"
category = "categories"
project = "projects"
```

```yaml {tab="hugo.yaml" value="hugoyaml"}
taxonomies:
  tag: tags
  category: categories
  project: projects
```

```json {tab="hugo.json" value="hugojson"}
{
  "taxonomies": {
    "tag": "tags",
    "category": "categories",
    "project": "projects"
  }
}
```
<!-- prettier-ignore-end -->
<!-- markdownlint-enable no-shortcut-ref-link -->

项目配置中的以下参数可控制两类输出：文档和博客文章页显示的分类法术语，以及 OINK 右侧栏显示的“标签云”：

<!-- markdownlint-disable no-shortcut-ref-link -->
<!-- prettier-ignore-start -->
```toml {tab="hugo.toml" group="hugotoml-hugoyaml-hugojson" value="hugotoml"}
[params.taxonomy]
taxonomyCloud = ["projects", "tags"] # set taxonomyCloud = [] to hide taxonomy clouds
taxonomyCloudTitle = ["Our Projects", "Tag Cloud"] # if used, must have same length as taxonomyCloud
taxonomyPageHeader = ["tags", "categories"] # set taxonomyPageHeader = [] to hide taxonomies on the page headers
```

```yaml {tab="hugo.yaml" value="hugoyaml"}
params:
  taxonomy:
    taxonomyCloud:
      - projects    # remove all entries
      - tags        # to hide taxonomy clouds
    taxonomyCloudTitle:   # if used, must have the same
      - Our Projects      # number of entries as taxonomyCloud
      - Tag Cloud
    taxonomyPageHeader:
      - tags        # remove all entries
      - categories  # to hide taxonomy clouds
```

```json {tab="hugo.json" value="hugojson"}
{
  "params": {
    "taxonomy": {
      "taxonomyCloud": [
        "projects",
        "tags"
      ],
      "taxonomyCloudTitle": [
        "Our Projects",
        "Tag Cloud"
      ],
      "taxonomyPageHeader": [
        "tags",
        "categories"
      ]
    }
  }
}
```
<!-- prettier-ignore-end -->
<!-- markdownlint-enable no-shortcut-ref-link -->

以上设置只会在 OINK 右侧栏中显示 `projects` 和 `tags` 的分类云（标题分别为“Our
Projects”和“Tag Cloud”），并在每个页面显示 `tags` 和 `categories`
分类法中已经分配的术语。

要禁用所有分类云，请设置 `taxonomyCloud = []`；如果不想显示已分配术语，请设置
`taxonomyPageHeader = []`。

默认情况下，分类法的复数标签会用作分类云标题。可以通过 `taxonomyCloudTitle`
覆盖默认标题，但这样做时，必须为每个启用的分类云手工定义一个标题；`taxonomyCloud`
与 `taxonomyCloudTitle` 的长度必须相同。

如果没有设置 `taxonomyCloud` 或
`taxonomyPageHeader`，系统会为所有已定义分类法生成相应的分类云或已分配术语。

## 侧边栏与右栏 {#sidebar-and-rail}

**标签云的范围限定在读者当前所在的顶层分区之内**：文档页面上，每个术语只统计属于文档的成员；博客页面上只统计属于博客的成员。因此计数描述的是读者正在浏览的分区，而不是整个站点。

分类术语页在内容树中没有位置，于是它会借用一个。如果带有该术语的页面全部位于同一个顶层分区之下，术语页就采用该分区来渲染侧边栏树、根链接和自己的标签云——点进文档标签后仍然停留在文档导航中。当术语的成员横跨多个分区时，术语页回退到站点级的树，并且不显示根节点行。

每个标签云都渲染为右栏中的一个分组，标题行样式与页面大纲一致，图标可以按分类复数名设置：

```yaml {title="hugo.yaml"}
params:
  ui:
    taxonomy_icons:
      categories: fa-solid fa-folder
      tags: fa-solid fa-tags
      projects: fa-solid fa-diagram-project
```

`categories` 与 `tags`
的默认值就是上面这两个；未在此列出的分类使用通用的形状图标。详见[右栏分组](/zh/docs/configure/navigation/#rail-groups)。

## Partial {#partials}

显示分类法时默认使用的 partial 经过专门设计，可以方便地在自定义布局中复用。

### `taxonomy_terms_article` {#taxonomy_terms_article}

`taxonomy_terms_article` partial 会显示一篇文章或页面（partial 参数
`context`，通常是当前页面或上下文 `.`）在指定分类法（partial 参数
`taxo`）中分配到的全部术语。

下面是在 `layouts/docs/list.html` 中为文档分区每个页面的 header 使用它的示例：

```go-html-template
{{ $context := . }}
{{ range $taxo, $taxo_map := .Site.Taxonomies }}
  {{ partial "taxonomy_terms_article.html" (dict "context" $context "taxo" $taxo ) }}
{{ end }}
```

它会针对当前页面（或上下文）中的每个已定义分类法，输出一份包含全部已分配术语的列表：

```html
<div class="taxonomy taxonomy-terms-article taxo-categories">
  <h5 class="taxonomy-title">Categories:</h5>
  <ul class="taxonomy-terms">
    <li>
      <a
        class="taxonomy-term"
        href="//localhost:1313/categories/taxonomies/"
        data-taxonomy-term="taxonomies"
        ><span class="taxonomy-label">Taxonomies</span></a
      >
    </li>
  </ul>
</div>
<div class="taxonomy taxonomy-terms-article taxo-tags">
  <h5 class="taxonomy-title">Tags:</h5>
  <ul class="taxonomy-terms">
    <li>
      <a
        class="taxonomy-term"
        href="//localhost:1313/tags/tagging/"
        data-taxonomy-term="tagging"
        ><span class="taxonomy-label">Tagging</span></a
      >
    </li>
    <li>
      <a
        class="taxonomy-term"
        href="//localhost:1313/tags/structuring-content/"
        data-taxonomy-term="structuring-content"
        ><span class="taxonomy-label">Structuring Content</span></a
      >
    </li>
    <li>
      <a
        class="taxonomy-term"
        href="//localhost:1313/tags/labelling/"
        data-taxonomy-term="labelling"
        ><span class="taxonomy-label">Labelling</span></a
      >
    </li>
  </ul>
</div>
```

### `taxonomy_terms_article_wrapper` {#taxonomy_terms_article_wrapper}

`taxonomy_terms_article_wrapper` 是 `taxonomy_terms_article`
的包装 partial，只有一个 `context` 参数（通常是当前页面或上下文
`.`）。它会检查项目 `hugo.toml`、`hugo.yaml` 或 `hugo.json` 中的分类法参数，遍历
`taxonomyPageHeader` 中列出的全部分类法；如果没有设置
`taxonomyPageHeader`，则遍历页面定义的全部分类法。

### `taxonomy_terms_cloud` {#taxonomy_terms_cloud}

`taxonomy_terms_cloud` partial 会显示站点（partial 参数
`context`，通常是当前页面或上下文 `.`）在指定分类法（partial 参数
`taxo`）中使用的全部术语，并使用 `title` 参数作为标题。

下面是在 `taxonomy_terms_clouds` partial 中显示所有已定义分类法及其术语的示例：

```go-html-template
{{ $context := . }}
{{ range $taxo, $taxo_map := .Site.Taxonomies }}
  {{ partial "taxonomy_terms_cloud.html" (dict "context" $context "taxo" $taxo "title" ( humanize $taxo ) ) }}
{{ end }}
```

对于 `categories` 分类法，它会生成以下 HTML 标记：

```html
<div class="taxonomy taxonomy-terms-cloud taxo-categories">
  <h5 class="taxonomy-title">Cloud of Categories</h5>
  <ul class="taxonomy-terms">
    <li>
      <a
        class="taxonomy-term"
        href="//localhost:1313/categories/category-1/"
        data-taxonomy-term="category-1"
        ><span class="taxonomy-label">category 1</span
        ><span class="taxonomy-count">3</span></a
      >
    </li>
    <li>
      <a
        class="taxonomy-term"
        href="//localhost:1313/categories/category-2/"
        data-taxonomy-term="category-2"
        ><span class="taxonomy-label">category 2</span
        ><span class="taxonomy-count">1</span></a
      >
    </li>
    <li>
      <a
        class="taxonomy-term"
        href="//localhost:1313/categories/category-3/"
        data-taxonomy-term="category-3"
        ><span class="taxonomy-label">category 3</span
        ><span class="taxonomy-count">2</span></a
      >
    </li>
    <li>
      <a
        class="taxonomy-term"
        href="//localhost:1313/categories/category-4/"
        data-taxonomy-term="category-4"
        ><span class="taxonomy-label">category 4</span
        ><span class="taxonomy-count">6</span></a
      >
    </li>
  </ul>
</div>
```

### `taxonomy_terms_clouds` {#taxonomy_terms_clouds}

`taxonomy_terms_clouds` 是 `taxonomy_terms_cloud` 的包装 partial，只有一个
`context` 参数（通常是当前页面或上下文
`.`）。它会检查项目配置中的分类法参数，遍历 `taxonomyCloud`
列出的全部分类法；如果没有设置 `taxonomyCloud`，则遍历页面定义的全部分类法。

## 分类法的多语言支持 {#multi-language-support-for-taxonomies}

对于[多语言站点][]，分类法术语只会在各自语言站点内计数和链接。分类法配置参数也可以按语言分别调整。

[配置文件]: https://gohugo.io/configuration/introduction/#configuration-file
[多语言站点]: https://gohugo.io/configuration/params/#multilingual-projects
[分类法]: https://gohugo.io/content-management/taxonomies/
