---
title: PG Exporter
description: 把生成导航、结构化指标目录与系统字体结合起来的双语文档站。
weight: 70
search_keywords: [exp.pgsty.com, PG Exporter, 指标目录, 系统字体]
tags: [文档, 双语, 数据驱动]
---

[exp.pgsty.com](https://exp.pgsty.com/) 是 PostgreSQL Prometheus 指标采集器
PG Exporter 的文档站。本案例快照中每种语言各十五页，另有三十七篇双语博客；
生成导航、首页数据与结构化指标目录承担了主要的信息组织工作。

## 它展示了什么 {#what-it-demonstrates}

- 在规模不大但顺序明确的手册中使用 `data/docs_nav.json`。
- 从结构化数据渲染领域目录，避免在正文中反复复制。
- 需要避免请求品牌字体时，选择 `typography: system`。

当技术产品的参考数据与叙述型文档同样重要，尤其希望字体栈更轻量时，可以
采用这一模式。

→ [字体与品牌](/zh/docs/customize/brand/) · [全部 OINK 案例](/zh/case/)

