---
title: 在 Blog 外壳上沉浸式阅读
linkTitle: 沉浸式阅读
date: 2026-08-19
lastmod: 2026-08-19
description: >-
  四个 front matter 键就能把普通 Blog 页面变成阅读优先的版式，
  以全幅 Hero 开场，再用随文的大纲栏承接正文。
summary: >-
  用四个 front matter 键为普通 Blog 文章增加全幅 Hero、随文大纲与无侧栏的
  沉浸式阅读外壳。
authors: [vonng]
featured_image: hero
toc_style: flow
toc_taxonomies: false
sidebar_enabled: false
tags: [Oink]
series: [building-oink]
series_weight: 30
---

本页仍然由普通 Blog 外壳渲染，背后没有特殊的内容类型。只需四个 front matter 键
就能改变呈现；一个分区也可以在 cascade 里一次写下同样的配方：

```yaml
featured_image: hero      # 题图成为全幅开场
toc_style: flow           # 更宽的大纲从正文起点开始
toc_taxonomies: false     # 右栏只保留大纲
sidebar_enabled: false
```

## Hero 开场 {#the-hero}

带有题图的页面可以用它开场。`hero` 会把图片变成横跨视口顶部的背景，
将标题向下移动以留出空间，并在正文开始前让画面逐渐隐去。由于图片由外壳绘制，
分区索引页也能使用同一种呈现。

页面卡片、社交预览与 Hero 共用同一套代表图片解析规则。`featured_image: banner`
保留带边框的选项；没有合适图片的页面则自然回退到普通开头。

## 随文大纲栏 {#the-rail}

`toc_style: flow` 用一条更宽的随文大纲取代钉在视口上的面板。它在 Hero 下方
与正文同时开始，滚动后才固定位置。这个开关与图片相互独立，因此即使有些页面没有题图，
整个分区仍能保持一致的大纲样式。

`toc_taxonomies: false` 会移除分类法云。如果页面既没有大纲也没有分类法内容，
空的右栏会被完全省略。

## 仍然保留的能力 {#what-stays-on}

开场之后仍然是一篇完整的 Blog 文章：日期与阅读时间、标签徽章、作者与档案、系列导航、
描述导语、分享、页面注记、顺序翻页与评论。Blog 外壳默认不显示面包屑；
需要强调页面在内容树中的位置时，可以用 `breadcrumb: true` 恢复它。
