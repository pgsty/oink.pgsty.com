---
title: Red Hat CAI 手册库
linkTitle: CAI 手册库
description: >-
  Red Hat CAI 手册库将多部 OpenShift AI 实战手册仓库通过子模块挂载为统一书架站点，并复用基于 OINK 封装的共享外壳模块。
images: [featured.webp]
site_url: https://rh-aiservices-bu.github.io/CAI-Field-Manual-Library/
case_group: community
weight: 250
date: 2026-11-13
search_keywords: [Red Hat, OpenShift AI, 实战手册库, Hugo 模块, 书架, 社区案例]
tags: [社区, 书籍, 企业级]
---

[rh-aiservices-bu.github.io/CAI-Field-Manual-Library](https://rh-aiservices-bu.github.io/CAI-Field-Manual-Library/) 是 Red Hat Customer Adoption and Innovation（CAI）团队打造的 OpenShift AI 实战手册聚合书架。仓库 [`rh-aiservices-bu/CAI-Field-Manual-Library`](https://github.com/rh-aiservices-bu/CAI-Field-Manual-Library) 本身只保留内容编排，通过 Git submodule 挂载多部独立手册，并复用团队基于 OINK 二次封装的共享模块 [`CAI-Field-Manual-Shell`](https://github.com/rh-aiservices-bu/CAI-Field-Manual-Shell)。

## 它展示了什么 {#what-it-demonstrates}

- 在 OINK 之上封装企业级共享 Hugo 模块，让多套手册仓库统一继承外壳、脚本与品牌规则，避免重复复制模板。
- 利用 Hugo `module.mounts` 与 Git submodule 把分散在多个仓库的技术手册汇聚到同一座书架式落地页中。
- 将自定义五维部署变体选择器与 OINK 原生的 `llms.txt`、`llms-full.txt` 机器可读输出结合使用。

→ [撰写书籍](/zh/docs/write/book/) · [面向 AI Agent 输出](/zh/docs/customize/agents/) · [全部 OINK 案例](/zh/case/)
