# Gallery

> 使用响应式静态网格组织相关图片，并可复用 Image Zoom。

---

LLMS index: [llms.txt](/llms.txt)

---

Gallery 使用响应式网格组织相关图片。它以静态内容为基础：没有 JavaScript 时，图片、替代文字与说明文字仍然完整。启用 Image
Zoom 后，Gallery 会复用同一个对话框，而不会加载另一套灯箱。

## 适用场景 {#when-to-use}

Gallery 适合比较少量截图、状态或相关视觉示例。如果顺序和对比不重要，请使用单张图片。如果内容确实需要幻灯片导航，而且隐藏非当前条目可以接受，请使用 Carousel。

## 快速开始 {#quick-start}

### 源码 {#source}

```go-html-template
{{< gallery columns=3 label="OINK 截图" >}}
  {{< gallery/image
    src="images/content-primitives/oink.webp"
    alt="OINK 文档概览"
    caption="文档概览"
  >}}
  {{< gallery/image
    src="/images/feedback.png"
    alt="OINK 反馈界面"
    caption="反馈控件"
  >}}
{{< /gallery >}}
```

### 渲染结果 {#rendered-result}

<!-- prettier-ignore-start -->

**OINK 截图与布局示例**

![OINK 文档概览](/images/content-primitives/oink.webp)

_具有已知固有尺寸的全局图片资源。_

![OINK 反馈界面](/images/feedback.png)

_这段刻意加长的说明文字用于演示桌面端和移动端都能正常换行，不会遮挡相邻图片或撑宽文档。_

![OINK 版本横幅界面](/images/version-banner.png)

_窄视口会自动减少响应式网格的实际列数。_

<!-- prettier-ignore-end -->

本页启用了 Image
Zoom。操作任意图片即可在共享对话框中查看。禁用 JavaScript 时，同样三张 figure 仍会按照相同阅读顺序显示。

## Gallery 参数 {#gallery-parameters}

<!-- prettier-ignore-start -->

**gallery 参数**

- `columns` — `integer`; 默认值: `2`

  从 `1` 到 `4` 的无引号整数；这是桌面端最大列数。

- `label` — `string`

  与 Gallery 列表关联的非空可见标签。

<!-- prettier-ignore-end -->

容器至少需要一个直接 `gallery/image`
子项，不能包含普通正文。小视口会减少实际列数，但不会改变作者要求的桌面端最大值。

## Image 参数 {#image-parameters}

<!-- prettier-ignore-start -->

**gallery\/image 参数**

- `src` — `image URL`; 必填

  经过校验的页面、全局、静态或远程图片 URL。

- `alt` — `string`; 必填

  描述图片的有意义非空纯文本。

- `caption` — `string`

  显示在图片下方的非空纯文本。

<!-- prettier-ignore-end -->

对于本地 Hugo 资源，Gallery 会在能够确定时记录固有宽高，并添加 lazy
loading。它接受远程来源 URL，但绝不会在 Hugo 构建期间下载该图片，因此无法获得远程尺寸。Caption 不渲染 Markdown；请保持简短，把复杂说明放在相邻正文中。

## 语义与回退 {#semantics-and-fallback}

HTML 使用带标签的 `ul`，其中包含 `figure`、`img` 与可选
`figcaption`。每张图片保留自己的替代文字，Gallery 标签为整个集合命名。Markdown 输出普通图片，后面接斜体说明；打印与 RSS 输出连续的静态 figure。Gallery 没有私有 JavaScript 运行时，只会在页面级 Image
Zoom 启用时标记图片。

## 有意保留的边界 {#deliberate-limits}

Gallery 不会把图片裁剪为强制宽高比，不会按断点重新排序，也不会隐藏溢出或提供幻灯片导航。它没有 Gallery 专用灯箱。这些约束保留了文档顺序，并确保回退内容完整。
