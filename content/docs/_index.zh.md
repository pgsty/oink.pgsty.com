---
# LLMSFULL 为本栏目每种语言发布一份 llms-full.txt；front matter 的 outputs
# 整体覆盖站点列表，所以这里重复常规格式。
outputs: [HTML, RSS, print, markdown, LLMSFULL]
title: OINK 文档
linkTitle: 文档
description: 为文档、博客、书籍与 API 参考建立统一的技术内容站点，共用导航、多语言与搜索。
weight: 10
search_keywords: [OINK, Hugo 主题, 技术文档, 文档站, Hugo theme, documentation]
type: docs
icon: fa-solid fa-book
sidebar_expanded: true
sidebar_root_for: self
sidebar_root_link_self: true
# 栏目根页是一份目录而不是落点：反向链接属于它指向的那些页面，所以这一页
# 退出站点级默认。
backlinks: false
# 文档区固定顶栏：参考树是靠页面间跳转来读的，全局菜单必须停在指针离开时的位置。
navbar_autohide: false
# 分区身份：文档保持品牌蓝，但显式写出而不是隐式继承 —— 这样侧栏根切换器里
# 四个分区的图标都有自己的颜色，不会有一个空着。
cascade:
  theme_color: '#245f94'
  theme_color_dark: '#5da2dd'
  type: docs
  navbar_autohide: false
  footer_style: fat
  comments: true
  feedback: false
  search_boost: 1.35
---

OINK 是一款面向技术文档的 Hugo 主题，适合产品手册、项目官网、书籍与 API
参考，单语多语皆可。你只写 Markdown，执行一次 `hugo`，就得到一个静态站点：导航树、本地全文搜索、深浅色模式与打印视图一应俱全。主题用到的脚本、字体与样式都随主题分发，构建不需要 Node.js、npm，也不访问 CDN。

第一次用 OINK？[快速上手](/zh/docs/start/)带你两分钟在本地跑起文档站，并用一段提示词让 AI Agent 搭建自己的站点。已经在用？先读 [1.8.0 发布说明](/zh/release/1.8.0/)，再按[升级指南](/zh/docs/admin/upgrade/#preparing-1-8-0)操作。

## 从哪里开始 {#five-entries}

- [快速上手](/zh/docs/start/) — 克隆文档站本地跑起来、用 AI Agent 建站，或为开源项目加装文档。
- [组件总览](/zh/docs/components/) — 提示块、标签页、图表、卡片等组件，源码与效果并排展示。
- [OINK 上手教程](/zh/book/) — 用一句提示词建站，再用十章动手练习逐层掌握它。
- [案例](/zh/case/) — 看生产站点怎样解决导航、迁移与首页设计问题。
{.cards}

## 按任务查找 {#where-to-go}

| 我想……                         | 阅读                                   |
| ------------------------------ | -------------------------------------- |
| 判断 OINK 是否适合我的项目     | [OINK 是什么](/zh/docs/about/)         |
| 写一页文档                     | [编写页面](/zh/docs/write/pages/)      |
| 把目录树变成侧栏               | [组织内容](/zh/docs/write/organize/)   |
| 查组件写法                     | [组件总览](/zh/docs/components/)       |
| 发布博客、书籍或图片相册       | [博客与文章](/zh/docs/write/blog/) · [书籍出版](/zh/docs/write/book/) · [Expo 相册](/zh/docs/write/expo/) |
| 修改站名、Logo、配色与字体     | [品牌外观](/zh/docs/customize/brand/)  |
| 查某个配置键及其默认值         | [配置总览](/zh/docs/customize/config/) |
| 用两种以上语言发布             | [多语言](/zh/docs/customize/i18n/)     |
| 部署到 GitHub Pages、Cloudflare 或自己的服务器 | [发布上线](/zh/docs/admin/deploy/) |
| 升级 OINK 或从 Docsy 迁移      | [版本升级](/zh/docs/admin/upgrade/)    |
| 排查构建报错或功能不生效       | [排错与检查](/zh/docs/admin/troubleshooting/) |

侧栏底部的 **设计** 与 **CLI** 记录 OINK 自身如何构建与维护，搭建站点用不到它们。
