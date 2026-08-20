---
title: SILO
description: 大型双语迁移站，用生成式导航保留数百页上游文档的信息结构。
weight: 80
search_keywords: [silo.pgsty.com, SILO, 文档迁移, 生成导航, S3]
tags: [文档, 双语, 迁移]
---

[silo.pgsty.com](https://silo.pgsty.com/) 是 S3 兼容对象存储 SILO 的文档站。
本案例快照中每种语言各有四百一十一页。覆盖 387 个上游页面的迁移清单生成
`data/docs_nav.json`，再由它驱动文档侧栏；站点还提供模块分类法与下载页。

## 它展示了什么 {#what-it-demonstrates}

- 迁移大型上游手册，同时保留原有信息结构。
- 从受检查的清单生成导航，避免手工维护整棵目录树。
- 在导入文档外叠加本地双语内容、分类与下载界面。

当上游语料仍是权威来源，而本地站需要自己的导航、语言对等页和产品界面时，
可以采用这一模式。

→ [导航定制](/zh/docs/customize/navigation/) · [全部 OINK 案例](/zh/case/)
