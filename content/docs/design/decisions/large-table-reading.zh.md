---
title: 显式开启表格阅读
linkTitle: 表格阅读
description: 将技术表格布局与按需启用的角落展开入口分开，给少数宽表提供更大的阅读空间。
weight: 66
design_kind: decision
design_status: accepted
decision_date: 2026-10-26
aliases:
  - /zh/docs/design/proposals/large-table-reading/
---

> [!NOTE] 开发实现，尚未发布
> 本决策记录已接受的 `.expand` 方向，OINK v1.3.2 尚不包含此功能。

[组件契约](/zh/docs/design/components/#table-reading)定义行为，[表格指南](/zh/docs/components/table/#expand)说明作者语法，[日期研究](/zh/docs/design/research/2026-10-26-large-table-reading/)保留此前的方案比较。

## 背景 {#context}

大多数文档表格适合直接阅读，只有少数扩展包、参数或兼容性表格需要更大的空间。在每个表格上方添加工具栏，会为偶尔使用的功能增加视觉负担。此前原型比较了角落直接展开按钮和悬停显示的省略号菜单。

## 决策 {#decision}

作者通过 `.expand` 为单个 Markdown 表格启用原生阅读对话框。`.wide` 独立控制表格的自然宽度，`{.wide .expand}` 同时使用两者。不根据表格大小、列数或 `.wide` 自动启用，也不增加全站开关。

只有一个展开动作时，直接点击即可。在表格右上角放置小图标，桌面端悬停或键盘聚焦时显示，触屏设备常显。图标保持小巧，触屏点击区域至少为 44px。不增加表格上方工具栏或只有一个选项的省略号菜单。

将原表格及滚动容器移入一个模态对话框，保留字号、原生语义、链接、文字选择和作者顺序。关闭时还原同一个节点、表格内部滚动位置、页面位置和入口焦点。编号表格的标题用于命名对话框，不复制 ID。浏览器打印前同步还原表格；没有 JavaScript 或对话框支持时，保留原来的正文表格。

## 边界 {#boundaries}

本次不包含排序、筛选、TSV 导出、密度与换行开关、新的固定列控制、虚拟滚动、独立阅读路由或 Fullscreen API。保留现有 `.matrix` 语义。仅主题渲染的 Markdown 表格可显式启用；`.fields` 组合会告警并忽略 `.expand`。`headers` 或 ARIA 属性引用表格外节点时保持正文阅读，因为模态状态会使外部目标不可交互。依赖原有祖先元素的项目样式，需要检查表格移入对话框后的效果。

对话框继承现有预设和明暗模式 token。Paper 是入口设计的主要审阅对象，其他预设进行兼容性检查，不增加新的视觉变体。移动端数据超过视口宽度时仍需横向滚动。

## 归属与验证 {#validation}

主题负责表格渲染、按需加载的运行时、本地化和限定范围的 SCSS。`bin/check-content-primitives.py` 覆盖显式启用、无效组合、本地化和静态输出。文档站的 `tests/browser/table-reader.spec.mjs` 负责键盘、触屏、链接、选中文本、焦点与滚动恢复、打印、失败降级和无障碍检查。运行时检查与文档站的两个 Make 测试套件仍是交付门槛。

原草案退出活动提案，保留在 Git 历史中。研究记录描述当时的实验，包括本次明确排除的功能。本地验收与合入主干不代表模块发布或站点部署。
