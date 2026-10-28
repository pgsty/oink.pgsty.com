---
title: 在 Blog 布局中实现沉浸式阅读
linkTitle: 沉浸式阅读
date: 2026-08-19
lastmod: 2026-08-19
description: >-
  四个 front matter 键即可把普通 Blog 页面切换为阅读优先的版式：
  以全幅 Hero 开场，再用随文大纲栏承接正文。
summary: >-
  用四个 front matter 键为普通 Blog 文章开启全幅 Hero、随文大纲与无侧栏的
  沉浸式阅读版式。
authors: [vonng]
featured_image: hero
toc_style: flow
toc_taxonomies: false
sidebar_enabled: false
tags: [Oink]
series: [building-oink]
series_weight: 30
---

本页直接由标准 Blog 布局渲染，无需新增专门的内容类型。只需四个 front matter 键
就能切换版式；也可以在栏目 cascade 中统一配置：

```yaml
featured_image: hero      # 题图作为全幅开场背景
toc_style: flow           # 更宽的大纲栏从正文起点开始
toc_taxonomies: false     # 右栏只保留大纲
sidebar_enabled: false
```

## Hero 开场 {#the-hero}

带有题图的页面可以用它作为开场。`hero` 会把图片铺满视口顶部，
将标题下移留出空间，并在正文开始前渐隐收束。由于题图由页面外层布局绘制，
栏目索引页同样可以使用这一版式。

页面卡片、社交预览与 Hero 共用同一套代表图片解析规则。`featured_image: banner`
保留带边框的横幅模式；没有合适图片的页面则自动回退到普通页头。

## 随文大纲栏 {#the-rail}

`toc_style: flow` 用更宽的随文大纲栏取代固定在视口上的目录面板。它在 Hero 下方
与正文齐平展开，向下滚动后才吸附固定。这个开关与题图相互独立，因此即使部分文章没有配图，
整个栏目仍能保持统一的大纲版式。

`toc_taxonomies: false` 用于隐藏右侧的分类词云。如果页面既没有目录也没有词云，
右侧空栏会自动省略。

## 仍然保留的能力 {#what-stays-on}

开场下方依然是完整的标准 Blog 文章：日期与阅读时长、标签徽章、作者信息、系列导航条、
摘要导语、分享栏、来源标注、顺序翻页与评论。Blog 布局默认隐藏面包屑；
需要展示页面在内容树中所处位置时，可设置 `breadcrumb: true` 重新开启。
