---
title: Image Zoom
description: 使用可选的原生对话框查看有意义的独立图片细节。
weight: 70
params:
  ui:
    image_zoom:
      enable: true
---

Image
Zoom 使用一个原生对话框渐进增强符合条件的内容图片。对于在正文宽度下难以看清细节的截图与架构图，它尤其有用。没有 JavaScript 或对话框支持时，原图片仍然完整可读。

## 适用场景 {#when-to-use}

当读者确实需要放大查看原图时再启用 Zoom。如果放大仍然不能解决可读性问题，应提供专门裁剪的图片或更清晰的图表。装饰图标、正文中的小型 Logo 与带链接缩略图应保留原有行为。

## 启用功能 {#enable-the-feature}

Image Zoom 默认关闭。在 Hugo 配置中为全站启用：

```yaml
params:
  ui:
    image_zoom:
      enable: true
```

页面可以在 front matter 中使用相同结构覆盖全站值。必须使用真正的布尔值：

```yaml
params:
  ui:
    image_zoom:
      enable: false
```

只有启用该功能并且存在合格图片的页面，Oink 才会加入 JavaScript 运行时与对话框。仅打开开关不会给纯文本页面增加运行时。

## 快速开始 {#quick-start}

### 源码 {#source}

普通的独立 Markdown 图片符合条件。如果希望 Oink 生成较小预览，同时打开原始图片，可以使用命名形式的
`imgproc`：

```go-html-template
{{</* imgproc
  src="images/content-primitives/oink.webp"
  command="Fit"
  options="640x320"
  alt="OINK 本地优先文档预览"
*/>}}
经过处理的预览，说明文字支持 **Markdown**。
{{</* /imgproc */>}}
```

### 渲染结果 {#rendered-result}

使用指针、Enter 或 Space 打开图片。按 Escape、可见关闭按钮或点击背景即可关闭对话框。

{{< imgproc src="images/content-primitives/oink.webp" command="Fit" options="640x320" alt="OINK 本地优先文档预览" >}}
文档中显示处理后的预览，Image Zoom 打开的是
**原始资源**，关闭后焦点会回到这个触发按钮。 {{< /imgproc >}}

链接中的图片会被有意跳过，并继续作为链接工作：

[![带链接的 OINK 图片仍然保持链接](/images/oink.webp)](/zh/docs/)

## 合格图片 {#eligible-images}

图片必须同时满足以下条件，Oink 才会增强：

- 图片独立位于段落或 figure 中，或者由 Gallery 显式标记。
- 图片具有非空 `alt` 值和可用来源。
- 图片不在链接、按钮或标记了 `data-no-zoom` 的元素中。
- 图片没有设置 `aria-hidden="true"`、`role="presentation"` 或 `role="none"`。

夹在文字中的行内图片与空 `alt`
装饰图片会被跳过。在受信任的 HTML 中，如果某张原本符合条件的图片不应打开，作者可以为图片或其祖先添加
`data-no-zoom`。

## 命名 imgproc 参数 {#named-imgproc-parameters}

<!-- prettier-ignore-start -->

{{< fields label="命名 imgproc 参数" >}}
  {{< field name="src" type="resource path" required=true >}}
  精确匹配的页面或全局图片资源。
  {{< /field >}}
  {{< field name="command" type="enum" required=true >}}
  可选值为 `Fit`、`Resize`、`Fill` 或 `Crop`。
  {{< /field >}}
  {{< field name="options" type="string" required=true >}}
  非空 Hugo 图片处理选项，例如 `640x320`。
  {{< /field >}}
  {{< field name="alt" type="string" >}}
  有意义的替代文字。内容图片必须提供；仅设置 `decorative=true` 时可以省略。
  {{< /field >}}
  {{< field name="decorative" type="boolean" default=false >}}
  为 true 时不能提供 `alt`，同时禁用 Image Zoom。
  {{< /field >}}
{{< /fields >}}

<!-- prettier-ignore-end -->

可选的短代码正文是 Markdown 说明文字。历史三值位置参数形式的 `imgproc`
继续兼容，但新内容应使用命名形式，以便在构建时强制检查替代文字。

## 交互与回退 {#interaction-and-fallback}

渐进增强会把合格图片包装在带有 `aria-haspopup="dialog"`
的真实按钮中。原生对话框把焦点移到关闭按钮，支持 Escape，复制图片的替代文字与直接说明文字，并在关闭后恢复焦点。没有 JavaScript 或
`HTMLDialogElement`
时，图片与说明仍是普通静态内容。Markdown、打印与 RSS 不包含对话框控件。

## 有意保留的边界 {#deliberate-limits}

第一版不实现拖拽、平移、滚轮缩放、编辑或上一张/下一张导航，也绝不会在构建期间下载远程图片。需要组织相关图片时，请使用 Gallery，并复用同一个对话框。
