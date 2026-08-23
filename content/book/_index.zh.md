---
title: 使用 Oink 创作优美的内容
linkTitle: 教程
description: 一本实战教程：用 OINK 创作清晰、优美且易于维护的技术内容。
type: book
icon: fa-solid fa-book-open
weight: 30
book_kind: book
sidebar_root_for: self
sidebar_root_link_self: true
outputs: [HTML, print, markdown]
# The Book/Blog reading shells keep the title bar pinned: long-form reading
# should not make the navbar appear and disappear under the pointer.
navbar_autohide: false
# 分区身份：教程用橙色。亮色在交互徽章把它同时用作文字与淡铺时仍可读；暗色显式
# 指定，避免派生结果偏离期望的橙色色相。
cascade:
  theme_color: '#9a3412'
  theme_color_dark: '#fb923c'
  type: book
  navbar_autohide: false
  footer_style: slim
  comments: false
  feedback: false
  sidebar_headings: 3
  book_draft_banner: true
---

《使用 Oink 创作优美的内容》是 OINK 参考文档的教程伴侣。参考文档解释每个参数和组件的作用；
本书则沿着一个真实站点的轨迹，从第一次本地预览走到评审与发布。

前三章已放入可直接操作的内容。后续章节在完整演练写作期间，会刻意展示 Book 的草稿状态。

## 目录 {#contents}

{{< book-toc depth=3 >}}

## 图目录 {#figures}

{{< book-figures >}}

## 表目录 {#tables}

{{< book-tables >}}

## 公式目录 {#equations}

{{< book-equations >}}

## 示例目录 {#examples}

{{< book-examples >}}

## 阅读方式 {#reading-path}

第一次建站时，请按顺序阅读第 1–3 章；开始打磨对外呈现与发布流程后，
再回到第 4–6 章。附录则汇总全书使用的 front matter 模式，便于直接复用。
