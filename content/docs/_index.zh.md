---
title: OINK 文档
linkTitle: 文档
description: OINK 是一款只需 Hugo Extended 的技术文档主题：组件写在 Markdown 里，资源随主题分发，双语开箱可用，一份内容产出四种输出。
search_keywords: [OINK, Hugo 主题, 技术文档, 文档站, Hugo theme, documentation]
type: docs
icon: fa-solid fa-book
sidebar_expanded: true
sidebar_root_for: self
sidebar_root_link_self: true
cascade:
  type: docs
  footer_style: slim
  comments: true
  feedback: false
  search_boost: 1.35
---

OINK 是一款技术文档 Hugo 主题。组件是 Markdown 语法的一部分，不是另一套模板语言；浏览器需要的字体、图标、搜索与图表运行时随主题分发；构建依赖只有一个 Hugo Extended 二进制，不需要 Node.js，不请求 CDN。当前发布版本 {{% param version %}}。

## 五条入口 {#five-entries}

- [十分钟上手](/zh/docs/start/) — 安装 Hugo、克隆本站、替换站点信息、部署。
- [组件总览](/zh/docs/components/) — 每个组件一页，先给源码再给渲染效果。
- [使用 OINK 创作优美的内容](/zh/book/) — 从第一次预览到持续维护发布物的实战教程。
- [案例](/zh/case/) — 把生产站点拆解成可复用的设计与迁移模式。
- [设计与开发](/zh/docs/design/) — 面向 OINK 维护者的契约、已接受决策、研究证据与候选提案。
  {.cards}

## 按任务导航 {#where-to-go}

| 你要做的事                   | 去哪                                   |
| ---------------------------- | -------------------------------------- |
| 判断是否适用                 | [OINK 是什么](/zh/docs/about/)         |
| 安装并预览                   | [十分钟上手](/zh/docs/start/)          |
| 写一页文档                   | [编写页面](/zh/docs/write/pages/)      |
| 把目录树变成侧栏             | [组织内容](/zh/docs/write/organize/)   |
| 查组件写法                   | [组件总览](/zh/docs/components/)       |
| 改站名、Logo、配色与字体     | [品牌外观](/zh/docs/customize/brand/)  |
| 查某个配置键的默认值         | [配置总览](/zh/docs/customize/config/) |
| 做双语或多语言站             | [多语言](/zh/docs/customize/i18n/)     |
| 从头到尾掌握 OINK            | [使用 OINK 创作优美的内容](/zh/book/)  |
| 研究生产环境实现             | [案例](/zh/case/)                      |
| 部署到线上                   | [发布上线](/zh/docs/admin/deploy/)     |
| 升级版本或从 Docsy 迁移      | [版本升级](/zh/docs/admin/upgrade/)    |
| 维护主题、审查契约或编写 PRD | [设计与开发](/zh/docs/design/)         |

Docs 的七个栏目按阅读顺序排列：了解、上手、写内容、查组件、改站点、管发布，最后理解并维护其背后的契约与设计记录。
