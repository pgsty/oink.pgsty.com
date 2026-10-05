---
title: Paper 与 Slate 视觉预设
linkTitle: 视觉预设
description: 第一阶段已接受的视觉身份与外观控件，分别维护读者的风格和明暗状态。
weight: 50
icon: fa-solid fa-palette
design_kind: decision
design_status: accepted
decision_date: 2026-10-05
---

> [!NOTE] OINK 1.2.0
> Paper 与 Slate 已随 1.2.0 发布。Ink 与 Terminal 作为显式启用的风格一同提供，
> 后续设计工作见下文记录。

## 决策 {#decision}

Paper 成为默认，使用暖纸色与墨色、蓝色链接、IBM Plex Sans、标题细线和外框
表格。Slate 保留 v1.1.0 色板、Inter/Chakra/Plex Mono 字体角色与 Landing 网格、
光晕。这样为阅读站点提供更安静的默认外观，同时保留明确的兼容选项。代价是默认
外观发生可见变化：原站点可设置 `params.ui.preset: slate`。1.2.0 发布注记与升级指南已醒目说明此变化。

读者菜单默认关闭（`preset_menu: false`），文档站开启。一个外观入口包含原生
风格与明暗单选组，手机通过浏览器顶层模态 dialog 显示底部表单。触屏和键盘无需
悬停即可使用。代价是原来单击即切明暗变成选择面板；`t` 快捷键仍可直接切换明暗。

风格与明暗使用不同的属性和存储键。选择站点默认预设清除风格键。Hugo 在无
JavaScript 时输出默认值，白名单内联脚本在 CSS 前恢复读者选择，避免初始预设
不一致；禁用存储时仍可操作。预设共用一个样式表，代价是增加少量 CSS。

`brand` 将字标与展示标题分开。Paper 新增本地 OFL IBM Plex Sans 可变字体，包含
正体、斜体和六个小型文字系统子集，按实际使用下载。系统排版与显式字体角色覆盖
仍优先，中文使用系统栈。第一阶段不加入衬线字体，不新增外部字体请求。

密度由页面任务决定：首页保留展示尺度，长文保留阅读行宽，导航与参数表保持紧凑。
不统一扩大间距，不引入第二套外壳或几何抽象。Giscus 和打印跟随预设，API 供应商
组件与图表保持现有的明暗行为，以此约束第一阶段范围。

## 后续工作 {#later-work}

10 月 5 日随后开展的实验在显式配置后提供 Ink 与 Terminal，见
[实验记录](/zh/docs/design/research/2026-10-05-ink-terminal-experiment/)。两者尚未成为
稳定默认选项。`preset_menu: true` 提供 Paper/Slate 与站点默认值；显式列表可以
展示实验。四种风格共用简洁的图标与名称按钮，不另加实验标记。这样可用真实主题
输出评审，同时保留普通菜单的
选项范围，代价是额外的局部 CSS，以及开启实验后更大的菜单。

实验以主题自有组件规则实现直角/2 px 圆角与紧凑桌面导航，不引入全局密度框架。
复用现有本地字体、状态管理与无障碍控件。图表和 API 供应商组件仍只随明暗变化，
评论色板与打印跟随实验预设。剩余工作是视觉定稿、更广设备评审，以及是否晋升为
稳定选项的决定。

## 依据 {#evidence}

[架构契约](/zh/docs/design/architecture/#visual-presets)与
[外壳契约](/zh/docs/design/shell/#appearance-control)管理当前行为。
`check-presets.py` 管理 token 对称、AA 色板、冻结的 Slate v1.1.0 色板及严格配置
输出。字体、参数、vendor、命名空间、动作与运行时检查继续沿用原归属。文档站的
`appearance.spec.mjs` 检查真实输出；[带日期验收记录](/zh/docs/design/research/2026-10-05-visual-presets-acceptance/)
区分已执行检查与后续实验。
