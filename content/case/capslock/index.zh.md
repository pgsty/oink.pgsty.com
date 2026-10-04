---
title: caps.vonng.com
description: >-
  Capslock 把 Caps Lock 变成第五个修饰键。这个每种语言仅两页的小站，将项目介绍与数据驱动的交互配置器放在一起。
images: [featured.webp]
weight: 60
date: 2026-08-10
search_keywords: [caps.vonng.com, Capslock, 配置器, 小型站点]
tags: [工具, 双语, 小型站点]
---

[caps.vonng.com](https://caps.vonng.com/) 是 Capslock 键盘增强方案的
小站，每种语言只有两个页面：首页与交互式配置生成器。生成器读取
`data/capslock-v3.json`，并在常规文档外壳之外使用自定义 `customizer` 外壳。

## 它展示了什么 {#what-it-demonstrates}

- OINK 站点的实用规模下限：小项目无需为一个工具和简介搭建前端应用。
- 为单个专用交互页面扩展外壳注册表。
- 把生成器数据与界面、双语说明分开维护。

当文档很少，但一个交互工具仍需要与全站共享导航、主题与语言控制时，可以
采用这一模式。

## 把应用留在站点层 {#implementation}

站点的 [`hugo.yaml`](https://github.com/Vonng/caps.vonng.com/blob/25f5a2940208cad12df56ea9993e7b6d27860577/hugo.yaml)
把 `customizer` 加入 `params.ui.shell_types`。
[`content/customizer.md`](https://github.com/Vonng/caps.vonng.com/blob/25f5a2940208cad12df56ea9993e7b6d27860577/content/customizer.md)
选择 `type: customizer` 与 `layout: customizer`，再调用站点自有的
[`capslock-configurator` 短代码](https://github.com/Vonng/caps.vonng.com/blob/25f5a2940208cad12df56ea9993e7b6d27860577/layouts/_shortcodes/capslock-configurator.html)。
配置器、JavaScript 与键盘数据都属于站点代码，OINK 不内置这个应用。

小型自定义工具需要文档外壳时，可以复用这条职责边界。交互代码仍需自己维护；
只有两页内容，并不意味着应用本身没有维护成本。

→ [布局配置](/zh/docs/customize/layout/) · [全部 OINK 案例](/zh/case/)
