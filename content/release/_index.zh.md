---
title: OINK 发布注记
linkTitle: 发布
description: Oink 发布说明、仅依赖 Hugo 的构建要求与历次升级记录
search_keywords: [OINK 发布, 发布注记, 更新日志, 版本历史, 版本升级]
weight: 60
type: blog
icon: fa-solid fa-tags
aliases: [/blog/release/]
sidebar_root_for: self
sidebar_root_link_self: true
footer_style: fat
comments: true
backlinks: false
navbar_autohide: false
blog_index: table
blog_index_toggle: true
# 整节按沉浸式呈现:小节题图作 hero 开场,无侧栏和面包屑,
# 右栏是去掉分类法云的随文目录。索引页自己带一份键(cascade 不
# 作用于声明它的页面),再把同一配方传给下面的每篇发布注记。
images: [/images/releasenote.webp]
featured_image: hero
sidebar_enabled: false
toc_taxonomies: false
# 分区身份：发布注记用翠绿色。
cascade:
  theme_color: '#047857'
  theme_color_dark: '#34d399'
  type: blog
  navbar_autohide: false
  images: [/images/releasenote.webp]
  featured_image: hero
  toc_style: flow
  toc_taxonomies: false
  sidebar_enabled: false
  footer_style: fat
  comments: true
  reading_time: true
  share: [x, bluesky, mastodon, reddit, hackernews, email, copy]
  feedback: false
  search_boost: 0.9
---

> [!NOTE] 按版本保留的历史记录
> 每篇发布说明记录对应版本发布时的要求与验收结果。OINK 1.6.0+ 使用任意 edition 的 Hugo 0.169.0+ 与 Go 1.27.4 构建，详见[工具链契约](/zh/docs/design/architecture/#hugo-toolchain)。

当前版本为 [OINK 1.6.0](/zh/release/1.6.0/)：以纯 CSS 适配 Hugo 0.170+、移除 Bootstrap JS 与 Lunr、
引入支持大索引拆分与参数锚点的扫描式 BM25 本地搜索、升级 Markmap 1.1.0 与 ReDoc 3.1.0、
新增按需接近加载与单行顶栏溢出菜单，并校对全部 32 份原生语言包。保持构建告警可见，
禁止启用 `--panicOnWarning` 或 `HUGO_PANICONWARNING`，无需任何 Sass 编译器。

1.3.1 引入的改动及其作者见[阅读修复与贡献者致谢](/zh/release/1.3.1/#thanks)。
