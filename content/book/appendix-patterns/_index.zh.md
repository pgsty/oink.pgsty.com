---
title: Front Matter 模式
linkTitle: 附录：模式
description: 可复制调整的 Book 根页、章节、沉浸式 Blog 文章与整书输出契约。
book_kind: appendix
book_number: A
book_status: draft
weight: 70
---

这些模式刻意保持精简。先复制建立内容契约所需的字段；只有在真实的读者需求出现时，
才加入额外的展示选项。

## Book 栏目根页 {#section-root}

```yaml
type: book
book_kind: book
outputs: [HTML, print, markdown]
cascade:
  type: book
  book_draft_banner: true
```

根页声明 Book 外壳与生成输出。它不需要章节编号；编号属于阅读顺序中真正出现的内容。

## Book 章节 {#chapter-pattern}

```yaml
book_kind: chapter
book_number: 1
book_status: draft
weight: 10
```

使用 `book_status: draft` 表达可见的编辑状态。它与 Hugo 的 `draft: true` 不同：
页面会保留在普通构建中，审阅者仍然可以阅读尚未完成的章节。

## 沉浸式 Blog 文章 {#article-pattern}

```yaml
type: blog
authors: [oink, vonng]
featured_image: hero
toc_style: flow
toc_taxonomies: false
sidebar_enabled: false
```

文章仍然属于 Blog 家族，Feed、作者、系列与分享能力都会保留；以上字段只改变阅读呈现。

## 生成输出矩阵 {#output-matrix}

| 输出 | 范围 | 典型用途 |
| --- | --- | --- |
| HTML | 单个根页或章节 | 阅读、导航与搜索 |
| print | 完整的 Book | 审阅、打印与 PDF 转换 |
| markdown | 保留源码结构的 Book | 导出与下游处理 |
{#tbl-output-matrix num="A-1" caption="同一棵内容树可以生成多种面向不同用途的 Book 输出。"}

Book 根页生成的目录、插图、表格、公式与示例索引会一起证明这些契约。中英文页面必须对齐
显式标题 ID 与对象 ID，确保每种格式都保留相同的引用关系。
