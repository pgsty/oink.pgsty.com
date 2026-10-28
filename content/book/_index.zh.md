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
  footer_style: fat
  comments: false
  feedback: false
  book_draft_banner: true
---

《使用 Oink 创作优美的内容》是与 OINK 参考文档配套的实战教程。参考文档说明每个参数和组件的用法；
本书则围绕同一个 Starter 站点，从首次本地预览一步步讲到审阅与发布。

前三章已提供可动手的练习；后续章节在完整教程编写期间保持草稿状态，同时用来演示 Book 的草稿横幅效果。

## 阅读方式 {#reading-path}

从[第 1 章：跑起第一个站点](/zh/book/01-start/)开始。第 1–3 章沿用同一个 Starter，
依次完成预览、新建双语页面和完善正文。第 4–6 章与附录仍为提纲草稿；需要现在完成
定制与部署时，请继续[Starter 教程](/zh/docs/start/starter/)，再按[发布上线](/zh/docs/admin/deploy/)操作。
下方对象索引同时演示 Book 的出版能力，可在需要查图表和示例时使用。

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
