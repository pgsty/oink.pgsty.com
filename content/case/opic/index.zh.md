---
title: project-opic.github.io/opic-website
linkTitle: OPIC 算力平台
description: >-
  OPIC 开放智能算力平台中英双语官网与文档站，从 Docusaurus 3 完整迁移至零 Node 依赖的 Hugo 与 OINK 主题。
images: [featured.webp]
site_url: https://project-opic.github.io/opic-website/
case_group: community
weight: 260
date: 2026-11-13
search_keywords: [OPIC, 开放智能算力平台, Docusaurus 迁移, Paper 风格, 双语, 社区案例]
tags: [社区, 文档, 双语]
---

[project-opic.github.io/opic-website](https://project-opic.github.io/opic-website/) 是 **OPIC 开放智能算力平台** 的中英双语官网与技术文档站。仓库 [`Project-Opic/opic-website`](https://github.com/Project-Opic/opic-website) 将原 Docusaurus 3 站点（保留在 `legacy-docusaurus/` 归档）完整迁移至 Hugo 与 OINK `paper` 风格，彻底移除 Node.js、npm 与 Vite 依赖，实现单二进制构建、离线 BM25 中文搜索、KaTeX 公式与 `llms.txt` 输出。

## 它展示了什么 {#what-it-demonstrates}

- 从 Docusaurus 3 平滑迁移至 Hugo + OINK 的完整工程范例，将原有文档顺序、博客与双语路由无损承接。
- 在 `themes/oink/` 中完整 vendor 主题文件，实现零外部网络依赖的确定性单二进制构建。
- 用中英文数据驱动首页（`data/home/zh.yaml`、`data/home/en.yaml`）衔接架构与部署文档。

→ [首页与落地页](/zh/docs/customize/home/) · [离线与零依赖构建](/zh/docs/start/from-scratch/) · [全部 OINK 案例](/zh/case/)
