---
title: OINK 发布注记
linkTitle: 发布
description: OINK 1.4.0 发布说明、仅依赖 Hugo 的构建要求与历次升级记录
weight: 10
icon: fa-solid fa-clipboard-list
blog_index: table
# 整节按沉浸式呈现:小节题图作 hero 开场,无侧栏和面包屑,
# 右栏是去掉分类法云的随文目录。索引页自己带一份键(cascade 不
# 作用于声明它的页面),再把同一配方传给下面的每篇发布注记。
images: [/images/releasenote.webp]
featured_image: hero
sidebar_enabled: false
toc_taxonomies: false
cascade:
  images: [/images/releasenote.webp]
  featured_image: hero
  toc_style: flow
  toc_taxonomies: false
  sidebar_enabled: false
---

> [!NOTE] 按版本保留的历史记录
> 每篇发布说明记录对应版本当时的要求与验收结果。当前开发、CI 与发布测试统一使用
> Hugo Extended 0.168.0，默认基线保持固定。旧发布说明不构成当前支持要求，
> 请遵循[工具链契约](/zh/docs/design/architecture/#hugo-toolchain)。

当前版本为 [OINK 1.4.0](/zh/blog/release/1.4.0/)：加入更强的本地搜索、本地
PlantUML、统一图表阅读、按需开启的表格阅读、博客画廊和组件精修。统一使用
**Hugo Extended 0.168.0**，保留可见告警，禁止启用 `--panicOnWarning` 或
`HUGO_PANICONWARNING`，无需额外安装 Sass 编译器。

1.3.1 引入的改动及其作者见[阅读修复与贡献者致谢](/zh/blog/release/1.3.1/#thanks)。
