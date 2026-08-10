---
title: 信息图布局、漏斗与主题
linkTitle: 布局与主题
description: 无需自定义 JavaScript，即可展示分组、收窄与风格化信息。
weight: 20
icon: fa-solid fa-table-cells-large
---

AntV 模板由结构、数据项与标题样式组成。切换模板也会改变隐含关系，因此应先审查含义，再考虑外观。下面的示例只使用扁平
`items` 数据，不包含远程图标。

## 分组事实网格 {#grid-of-grouped-facts}

多项事实围绕同一主题，但没有固定顺序时，可以使用 `list-grid-badge-card`。

```go-html-template
{{</* infographic */>}}
infographic list-grid-badge-card
data
  title 文档质量门槛
  items
    - label 准确性
      desc 命令与版本符合产品事实
    - label 覆盖度
      desc 包含必要概念与任务
    - label 语言
      desc 中英文保持等价
    - label 交付
      desc 线上路由与评审源码一致
{{</* /infographic */>}}
```

这四项门槛彼此并列，不应把其中一项画成另一项的前提。

<!-- prettier-ignore-start -->

{{< infographic >}}
infographic list-grid-badge-card
data
  title 文档质量门槛
  items
    - label 准确性
      desc 命令与版本符合产品事实
    - label 覆盖度
      desc 包含必要概念与任务
    - label 语言
      desc 中英文保持等价
    - label 交付
      desc 线上路由与评审源码一致
{{< /infographic >}}

<!-- prettier-ignore-end -->

## 逐步收窄的漏斗 {#narrowing-funnel}

每个阶段都会有意减少总体数量时，使用 `sequence-funnel-simple`。请加入 `value`
字段，并在正文中重复这些数字。

```go-html-template
{{</* infographic height="460px" */>}}
infographic sequence-funnel-simple
data
  title 文档评审漏斗
  items
    - label 完成草稿
      value 40
      desc 提交评审的页面
    - label 事实核对
      value 34
      desc 验证命令与论断
    - label 语言评审
      value 31
      desc 对齐中英文内容
    - label 完成发布
      value 28
      desc 验证线上页面
{{</* /infographic */>}}
```

40 页草稿经过评审后，得到 34 页已核对事实的页面、31 页已完成语言评审的页面，以及 28 页经过验证的线上页面。

<!-- prettier-ignore-start -->

{{< infographic height="460px" >}}
infographic sequence-funnel-simple
data
  title 文档评审漏斗
  items
    - label 完成草稿
      value 40
      desc 提交评审的页面
    - label 事实核对
      value 34
      desc 验证命令与论断
    - label 语言评审
      value 31
      desc 对齐中英文内容
    - label 完成发布
      value 28
      desc 验证线上页面
{{< /infographic >}}

<!-- prettier-ignore-end -->

## 内置手绘主题 {#built-in-hand-drawn-theme}

主题只改变样式，不改变数据含义。`hand-drawn`
适合非正式规划材料，也可以使用自定义主色与站点视觉保持一致。

```go-html-template
{{</* infographic */>}}
infographic sequence-stairs-front-simple
data
  title 从笔记到可维护文档
  items
    - label 记录
      desc 写下观察到的行为
    - label 解释
      desc 补充上下文与读者目标
    - label 验证
      desc 测试示例与链接
    - label 维护
      desc 指定负责人和更新路径
theme hand-drawn
  colorPrimary #2563eb
{{</* /infographic */>}}
```

<!-- prettier-ignore-start -->

{{< infographic >}}
infographic sequence-stairs-front-simple
data
  title 从笔记到可维护文档
  items
    - label 记录
      desc 写下观察到的行为
    - label 解释
      desc 补充上下文与读者目标
    - label 验证
      desc 测试示例与链接
    - label 维护
      desc 指定负责人和更新路径
theme hand-drawn
  colorPrimary #2563eb
{{< /infographic >}}

<!-- prettier-ignore-end -->

## 选择模板家族 {#choose-a-template-family}

| 关系         | 推荐起点                                                          |
| ------------ | ----------------------------------------------------------------- |
| 有序交接     | `list-row-simple-horizontal-arrow`、`sequence-steps-simple`       |
| 时间或路线图 | `sequence-timeline-simple`、`sequence-roadmap-vertical-simple`    |
| 重复循环     | `sequence-circular-simple`、`sequence-circle-arrows-indexed-card` |
| 并列事实     | `list-grid-badge-card`、`list-grid-compact-card`                  |
| 逐步减少     | `sequence-funnel-simple`、`sequence-pyramid-simple`               |
| 层级         | `hierarchy-tree-*`、`hierarchy-mindmap-*`                         |

模板可用性取决于随附 AntV 版本。采用较少见的模板前，请使用真实中英文内容渲染，并固定其
`VENDOR.json` 已包含该模板的 Oink 发行版。

## 布局检查清单 {#layout-checklist}

- 并列标签应保持语法一致；
- 只有数值单位或含义明确时才使用 `value`；
- 避免固定高度裁掉译文；
- 只有周围页面与打印布局确有需要时才设置 `full=true`；
- 分别检查模板含义、对比度、溢出与阅读顺序；
- 网络隔离文档不得引用远程图标或图片。
