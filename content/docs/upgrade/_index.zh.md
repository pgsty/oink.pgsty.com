---
title: 升级与迁移
linkTitle: 升级迁移
weight: 80
icon: fa-solid fa-arrow-up-right-dots
description: 升级 OINK 版本，或从 Docsy 迁移过来。
cascade:
  categories: [升级]
---

## 本章内容 {#in-this-chapter}

- [升级到 0.4.0](v0-4/)：场景组件迁移与行为变化检查
- [升级 OINK](upgrade/)：跨版本升级步骤与破坏性变更清单
- [从 Docsy 迁移](from-docsy/)：把既有 Docsy 站点切换到 OINK

## 升级原则 {#principles}

- 生产站点固定版本标签，不跟随 `main`
- 升级前先读目标版本的破坏性变更
- 在分支上升级并完整验证，再合并
- 本地构建通过不等于可以发布——预览部署和线上冒烟是独立的门禁
