---
title: 图片与图片缩放
linkTitle: 图片
description:
  用普通 Markdown 写图片，添加图注与处理型预览，并让读者在原生对话框中查看大图。
weight: 70
params:
  ui:
    image_zoom:
      enable: true
---

OINK 站点上的每张 Markdown 图片都会经过主题的图片渲染钩子：解析来源（页面资源、全局资源、静态路径或远程 URL），本地资源获得固有尺寸，所有图片都懒加载。独立成段的图片可以带一行属性，变成带图注的 figure。`image`
短代码增加 Hugo 图片处理能力，而图片缩放则为符合条件的图片渐进增强出一个原生对话框。

## Markdown 图片 {#markdown-images}

```markdown
![OINK 文档总览](images/content-primitives/oink.webp '提示性标题')
```

![OINK 文档总览](images/content-primitives/oink.webp '提示性标题')

`title`
保持 Markdown 原本的语义（悬停提示），永远不会变成图注。段落文字中间的图片是行内图片；单独占一行的图片是块级图片，可以带属性行。

### 图注 {#figures}

在独立图片的下一行写 `{caption="…"}`，即可渲染带 `figcaption` 的
`figure`。`width` 与 `height` 为静态或远程图片提供占位尺寸；`class`
会透传给站点 CSS。

<!-- prettier-ignore-start -->

```markdown
![OINK 反馈界面](/images/feedback.png)
{caption="文章末尾的反馈控件" width="1200" height="600"}
```

![OINK 反馈界面](/images/feedback.png)
{caption="文章末尾的反馈控件" width="1200" height="600"}

<!-- prettier-ignore-end -->

带编号的 Book 图使用同一行属性加 `num`（以及可选的 `id`）；见
[Book 出版](/zh/docs/scenarios/book/)。未知属性、`style`
与事件处理器会导致构建失败。

块级图片需要站点设置
`markup.goldmark.parser.wrapStandAloneImageWithinParagraph: false`；否则 Goldmark 会把图片包进段落，属性行也会被忽略。

## 处理型图片 {#processed-images}

<a id="named-imgproc-parameters"></a>

`image`
短代码用 Hugo 图片处理对页面或全局图片资源做缩放、适配、填充或裁切。正文是 Markdown 图注：

```go-html-template
{{</* image src="images/content-primitives/oink.webp" command="Fit" options="640x320" alt="OINK 本地优先文档预览" */>}}
带 **Markdown 图注** 的处理型预览。
{{</* /image */>}}
```

{{< image src="images/content-primitives/oink.webp" command="Fit" options="640x320" alt="OINK 本地优先文档预览" >}}
文档中显示的是处理后的预览。图片缩放会打开
**原始资源**，关闭对话框后焦点回到这个触发元素。 {{< /image >}}

<!-- prettier-ignore-start -->

{{< fields label="image 参数" >}}
  {{< field name="src" type="资源路径" required=true >}}
  精确的页面或全局图片资源。静态路径与远程 URL 无法处理；它们请使用普通 Markdown 图片。
  {{< /field >}}
  {{< field name="command" type="enum" required=true >}}
  `Fit`、`Resize`、`Fill` 或 `Crop` 之一。
  {{< /field >}}
  {{< field name="options" type="string" required=true >}}
  非空的 Hugo 图片处理选项，例如 `640x320`。
  {{< /field >}}
  {{< field name="alt" type="string" >}}
  有意义的替代文字。内容图片必须提供（资源自带 `params.alt` 时除外），只有 `decorative=true` 时才可省略。
  {{< /field >}}
  {{< field name="decorative" type="boolean" default=false >}}
  为 true 时不得设置 `alt`，并禁用图片缩放。
  {{< /field >}}
{{< /fields >}}

<!-- prettier-ignore-end -->

只接受具名参数；位置参数形式的 `imgproc` 已经移除。

## 启用图片缩放 {#enable-the-feature}

图片缩放默认关闭。在 Hugo 配置中为整站启用：

```yaml
params:
  ui:
    image_zoom:
      enable: true
```

页面可以在 front matter 中用同样的结构覆盖站点值。请使用真正的布尔值：

```yaml
params:
  ui:
    image_zoom:
      enable: false
```

OINK 只会在已启用且含有符合条件图片的页面上加载 JavaScript 运行时和对话框。仅打开开关不会给纯文本页面增加任何运行时。

## 符合条件的图片 {#eligible-images}

满足以下全部条件时，OINK 才会增强一张有意义的图片：

- 图片在段落或 figure 中独立成段，是处理型 `image`，或位于
  [Gallery](/zh/docs/components/gallery/) 列表中。
- 图片有非空的 `alt` 值和可用的来源。
- 图片不在链接、按钮或标记了 `data-no-zoom` 的元素内。
- 图片没有标记 `aria-hidden="true"`、`role="presentation"` 或 `role="none"`。

文字中间的行内图片和空 alt 的装饰性图片会被跳过。链接内的图片会被有意跳过并保持为链接：

[![带链接的 OINK 图片仍然保持链接](/images/oink.webp)](/zh/docs/)

## 交互与回退 {#interaction-and-fallback}

渐进增强会把符合条件的图片包进一个真正的按钮，并带有
`aria-haspopup="dialog"`。原生对话框把焦点移到关闭按钮，支持 Escape，复制图片的替代文字与直接图注，关闭后恢复焦点。没有 JavaScript 或
`HTMLDialogElement`
时，图片与图注仍是普通静态内容。Markdown、打印和 RSS 不包含对话框控件；RSS 使用绝对图片 URL。

## 有意的限制 {#deliberate-limits}

第一版不实现拖拽、平移、滚轮缩放、编辑，或上一张/下一张导航，也绝不会在构建期下载远程图片。需要把相关图片分组并复用同一个对话框时使用Gallery。
