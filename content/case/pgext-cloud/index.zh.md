---
title: pgext.cloud
description: PostgreSQL 扩展目录——这一家子里唯一不用 OINK、而是专门定制的数据应用。
weight: 150
date: 2026-08-01
manual_link: https://pgext.cloud/
search_keywords: [pgext.cloud, PostgreSQL 扩展目录, 数据应用, 边界案例]
tags: [目录, 数据驱动, 非 OINK]
---

[pgext.cloud](https://pgext.cloud/) 是 PostgreSQL 扩展目录：可以检索扩展、
包家族、依赖关系，以及每个扩展在哪些 PostgreSQL 版本与操作系统组合上可用。
它是本案例库的边界案例——因为它并不使用 OINK。这份目录是手写的单页应用，
以静态文件分发，在扩展数据集之上自带查询界面。

## 它展示了什么 {#what-it-demonstrates}

- 文档主题的适用边界在哪里。这里的主体是一个可查询的数据集，而不是页面树；
  逐页导航、侧边栏与阅读外壳只会碍事。
- 与 [PG Exporter](/zh/case/pg-exporter/) 和 [pigsty.io](/zh/case/pigsty-io/)
  正好相反：那两个站点的结构化目录之所以留在 OINK 站内，是因为周围有大量
  叙述性正文。

读者是来阅读的，就用 OINK；读者是来查询的，就该做一个专门的应用。两者可以
在同一个项目里并存并互相链接——这里正是如此。

→ [PG Exporter 案例](/zh/case/pg-exporter/) · [pigsty.io 案例](/zh/case/pigsty-io/) · [全部 OINK 案例](/zh/case/)
