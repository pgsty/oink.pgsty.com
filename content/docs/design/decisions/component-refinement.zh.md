---
title: 四种视觉预设的组件精修
linkTitle: 组件精修
description: 统一组件表面与控件细节，提供三个可选的 Markdown 呈现变体。
weight: 50
icon: fa-solid fa-sliders
search_keywords: [组件精修, Paper, Slate, Ink, Terminal, Markdown]
design_kind: decision
design_status: accepted
decision_date: 2026-10-26
aliases:
  - /docs/design/proposals/component-refinement/
---

> [!NOTE] OINK 1.4.0 已接受
> 共用组件样式与三个可选呈现变体随 1.4.0 发布。
> 行为归属[组件契约](/zh/docs/design/components/#component-refinement)，
> [对照指南](/zh/docs/components/presentation/)集中展示这些变体。

## 背景 {#context}

Cards、折叠区、Tabs 和代码控件逐渐积累了不同的间距、边框与反馈方式。
这次精修保留熟悉的创作语法，让相关组件的呈现更加一致。
[带日期的评审](/zh/docs/design/research/2026-10-25-component-refinement/)记录了
实现与验收证据，包括最初的分阶段计划。

## 已接受的样式规则 {#style-rules}

沿用现有的页面、内容与浮动表面 token。独立卡片拥有自己的边界，分组列表共用
外框和内部分隔线。嵌套代码块与表格避免叠加多余边框。

按下反馈保持文字与点击区域不动。为本地化复制反馈预留空间，只有复制成功才显示
成功状态，失败时保留明确提示。键盘焦点立即可见，触屏控件具有足够的点击区域。
减少动态效果时仍保持清晰的状态变化。

Paper 与 Slate 保留圆角表面，Ink 保持方正扁平，Terminal 保持紧凑扁平。
Paper 去掉标题右侧的装饰尾线。Ink 与 Terminal 仍是显式启用的实验性预设；
组件精修没有把它们升级为稳定预设。

## 可选创作变体 {#variants}

默认网格、步骤与代码块继续可用。作者根据内容选择需要的变体。

### 分隔式卡片列表 {#card-list}

```markdown
- [安装](/zh/docs/start/) — 搭建本地站点。
- [配置](/zh/docs/customize/config/) — 配置站点。
{.cards .td-cards-list}
```

呈现为带内部分隔线的单列分组。完整短代码支持 `cards variant="list"`，
保留条目顺序、链接与描述。

### 紧凑命令条 {#command-block}

````markdown
```bash {class="td-code-command"}
hugo server
```
````

显式标记的单行命令显示为紧凑条，复制控件独占空间。多行、带行号或可折叠的
代码块会发出警告并保留普通呈现。源码与复制文本保持完整。

### 紧凑步骤 {#compact-steps}

```markdown
1. 准备配置。
1. 启动本地预览。
1. 检查生成的页面。
{.steps .td-steps-compact}
```

完整短代码支持 `steps variant="compact"`。较小的标记与间距适合短流程，
保留编号、嵌套与锚点。不支持的短代码变体会发出警告并回退到默认呈现。

## 范围与兼容性 {#implementation}

同一套规则也用于表格、Fields、徽章、Landing 操作与外壳列表行。
继续由现有渲染器、剪贴板逻辑与 token 负责，不增加 JavaScript 依赖、字体下载、
全局密度选项或外部 Sass 可执行文件。原生 Markdown、无 JavaScript 阅读、
打印与机器可读输出保留完整内容。

移动选择背景经过评估后暂缓，OINK 1.4.0 保持静态选中反馈。后续动效试验
需要单独验收。

## 验证与交付 {#acceptance}

主题专项检查覆盖组件、内容原语、代码块、阅读、外壳、预设与命名边界。
真实站点的组件对照与外观测试覆盖中英文、深浅色、桌面与移动端、键盘、触控、
减少动态效果与打印。三个变体和共用样式均随 1.4.0 发布；下游版本固定与部署
属于各消费站自己的操作。
