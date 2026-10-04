---
title: silo.pgsty.com
description: >-
  SILO 是社区维护的 MinIO 分支，提供兼容 S3 的对象存储。这个大型双语迁移案例从经过检查的清单生成文档导航。
images: [featured.webp]
weight: 40
date: 2026-08-12
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

## 沿导航数据划分职责 {#implementation}

已提交的 [`data/docs_nav.json`](https://github.com/pgsty/silo.pgsty.com/blob/6acbbe552a0dde62b08f64d7c231a0dbdfed9df8/data/docs_nav.json)
通过 `meta.generated_from`（`migration/reports/navigation.csv`）与
`meta.manifest`（`migration/minio-docs-manifest.csv`）记录输入来源。迁移流程负责这些输入
和生成导航，OINK 读取结果树。这些路径说明数据来历，不代表 OINK 内置了对应生成器。

这一做法以额外维护一份导航产物为代价，保留导入手册的顺序。小型原创手册先用普通内容树；
只有能够同时维护导航源与重新生成流程时，再采用生成导航。

→ [导航定制](/zh/docs/customize/navigation/) · [全部 OINK 案例](/zh/case/)
