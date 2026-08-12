---
title: OINK 项目与站点文档
linkTitle: 项目
description: OINK 主题与项目站的构建、维护和部署说明。
aliases: [site]
type: docs
icon: fa-solid fa-diagram-project
sidebar_root_for: self
sidebar_root_link_self: true
comments: false
cascade:
  type: docs
  params:
    hide_feedback: true
---

<span class="badge bg-warning text-bg-warning fs-6">
{{% _param FAS person-digging " pe-2" %}} 本节仍在建设中。 {{%
_param FAS person-digging " ps-2" %}}
</span>

## 规划内容 {#content}

当前规划的内容结构如下：

- [关于项目](about/)：项目目标、所有权和当前状态等概要信息。
- **设计**：架构、信息架构、布局、用户体验与主题设计决策。
- [实现](implementation/)：代码结构与约定、Hugo 模板、SCSS/JS 定制、补丁和内部兼容层。
- [构建](build/)：本地开发、CI/CD、部署环境和自动化工具。
- **质量**：链接检查、无障碍标准、测试与评审实践。
- **路线图**：里程碑、待办事项、优先级、技术债与设计决策。

## 站点构建信息 {#site-build-information}

OINK 版本：`{{% dev-version %}}`
