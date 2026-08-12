---
title: Badge
description: 使用紧凑的语义状态标签，无需自定义颜色或 JavaScript。
weight: 20
---

Badge 用于在功能、选项或版本名称旁边放置简短状态。作者选择语义 tone，Oink 再把它映射到主题 token，确保浅色与深色模式下都有足够的对比度。

## 适用场景 {#when-to-use}

Badge 适合 Beta、New、Experimental 与 Deprecated 等生命周期状态。标签文字必须明确：颜色只能补充含义，不能代替文字。如果状态需要解释、操作说明或截止日期，请改用普通正文或提示框。

## 快速开始 {#quick-start}

### 源码 {#source}

```go-html-template
{{</* badge text="Beta" tone="warning" */>}}
{{</* badge text="已弃用" tone="danger" outline=false */>}}
{{</* badge text="v0.3" tone="info" link="/zh/blog/release/" */>}}
```

### 渲染结果 {#rendered-result}

{{< badge text="默认" >}} {{< badge text="信息" tone="info" >}}
{{< badge text="已支持" tone="success" >}}
{{< badge text="Beta" tone="warning" >}}
{{< badge text="已弃用" tone="danger" outline=false >}}
{{< badge text="v0.3" tone="info" link="/zh/blog/release/" >}}

最后一个 Badge 是链接，其余都是静态行内标签。

## 参数 {#parameters}

<!-- prettier-ignore-start -->

{{< fields label="Badge 参数" >}}
  {{< field name="text" type="string" required=true >}}
  向读者显示的非空字符串。
  {{< /field >}}
  {{< field name="tone" type="enum" default="neutral" >}}
  可选值为 `neutral`、`info`、`success`、`warning` 或 `danger`。
  {{< /field >}}
  {{< field name="link" type="URL" >}}
  经过校验的站内、相对、HTTP(S) 或 `mailto:` 目标。设置后 Badge 会成为链接。
  {{< /field >}}
  {{< field name="outline" type="boolean" default=true >}}
  设置为 `false` 时使用实心样式。
  {{< /field >}}
{{< /fields >}}

<!-- prettier-ignore-end -->

布尔值不能加引号。例如应写作 `outline=false`，而不是
`outline="false"`。未知参数、非法 tone 或非法链接都会让 Hugo 构建停止，并报告源文件位置。

## 语义与回退 {#semantics-and-fallback}

静态 Badge 输出为 `span`，带链接的 Badge 输出为
`a`。Oink 不会把它变成实时状态区域，因此新增 Badge 不会触发意外的屏幕阅读器播报。所有输出都保留可见文字：Markdown 使用强调文本并保留链接，打印与 RSS 使用静态行内内容。Badge 不加载 JavaScript。

## 有意保留的边界 {#deliberate-limits}

Badge 不接受任意颜色、CSS class、样式或事件处理器。第一版也不提供 `icon`
参数。目前请使用简短而明确的文字；内容图标应在名称、许可证、无障碍与 Markdown 回退契约确定后，再单独提供公共接口。
