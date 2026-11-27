---
title: 定制站点
linkTitle: 定制站点
description: 站点级配置：品牌、导航、布局、搜索、多语言、多版本、打印与 Agent 输出。
weight: 50
icon: fa-solid fa-sliders
cascade:
  categories: [定制站点]
aliases:
  - /docs/configure/
  - /docs/advanced/
# The body's task map links every child page; the generated card list
# would repeat it. The Markdown output still lists the children.
no_list: true
---

「定制站点」管的是对整个站点生效、而不是只对某一页生效的东西：站点长什么样，读者怎么找到要看的内容，除了 HTML 还发布什么，以及提供哪些语言和版本。其中大部分是 `hugo.yml` 里的一个键，其余是 `data/` 下的数据文件和 `assets/` 下你自己的样式表。写单个页面、设置它的 front matter，见[创作内容](/zh/docs/write/)。

## 按改动目标查找 {#what-to-change}

| 想改什么 | 去看 |
| --- | --- |
| 站名、Logo、favicon | [品牌外观](/zh/docs/customize/brand/#logo) |
| 配色、深浅色模式、字体 | [品牌外观](/zh/docs/customize/brand/#theme-color) |
| 顶栏菜单与下拉 | [导航与菜单](/zh/docs/customize/navigation/#main-menu) |
| 侧栏宽度、图标密度、大纲深度 | [布局与页面类型](/zh/docs/customize/layout/#sidebar) |
| 首页与落地页 | [首页与落地页](/zh/docs/customize/home/) |
| 全文检索及其索引范围 | [全文检索](/zh/docs/customize/search/) |
| 命令面板里提供什么 | [命令面板](/zh/docs/customize/panel/) |
| 快捷键 | [键盘导航](/zh/docs/customize/keyboard/) |
| 站点发布哪些语言 | [多语言](/zh/docs/customize/i18n/) |
| 同时维护多个版本的文档，或归档横幅 | [多版本](/zh/docs/customize/versions/) |
| 标签与分类 | [分类体系](/zh/docs/customize/taxonomy/) |
| 「编辑当前页面」、最后修改时间与贡献者 | [仓库与页面信息](/zh/docs/customize/repository/) |
| 打印单页或整章 | [打印支持](/zh/docs/customize/print/) |
| AI agent 读到的内容：`llms.txt` 与每页的 `.md` | [Agent 支持](/zh/docs/customize/agents/) |
| 任一参数的类型与默认值 | [配置总览](/zh/docs/customize/config/) |
| 评论、访问分析或部署目标，这些需要接入外部服务 | [维护管理](/zh/docs/admin/) |
