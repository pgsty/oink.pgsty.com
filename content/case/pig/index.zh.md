---
title: pig.pgsty.com
description: >-
  PIG 是 PostgreSQL 扩展包管理器。这个案例将精简的双语产品手册与数据驱动首页、持续更新的博客配合使用。
images: [featured.webp]
weight: 70
date: 2026-08-09
search_keywords: [pig.pgsty.com, PIG, 包管理器, 小型文档]
tags: [文档, 双语, 产品]
---

[pig.pgsty.com](https://pig.pgsty.com/) 是 PostgreSQL 扩展包管理器 PIG 的
文档站。核心手册刻意保持紧凑——本案例快照中每种语言十八页——同时用五十篇
双语博客承载动态、教程与深入说明，首页则由 `data/home` 组装。

## 它展示了什么 {#what-it-demonstrates}

- 为聚焦型命令行产品设计浅层、以单文件为主的文档树。
- 在不重复设计导航的前提下维护中英文对等页面。
- 让数据驱动首页与体量更大的博客内容流配合使用。

当参考手册小而稳定，但产品动态、教程与版本背景需要持续增长时，可以采用
这一模式。

## 复用分工，不复制产品数据 {#implementation}

[Docs 根页](https://github.com/pgsty/pig.pgsty.com/blob/d9065c0b4b04285f230f7af7e24d7f3bc12c4cde/content/docs/_index.md)
选择文档类型；独立的
[`data/home/metrics.yaml`](https://github.com/pgsty/pig.pgsty.com/blob/d9065c0b4b04285f230f7af7e24d7f3bc12c4cde/data/home/metrics.yaml)
把产品计数从正文中分离。站点维护这些事实与消费数据的模板，OINK 提供阅读外壳。

小型产品可以先用普通 Docs 文件，只有多处复用的事实才放入结构化首页数据。
复用这一组织方式，不要复制 PIG 的软件包数量或产品专属首页实现。

→ [文档仓库结构](/zh/docs/start/anatomy/) · [全部 OINK 案例](/zh/case/)
