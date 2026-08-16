# Gallery

> 用响应式静态网格排列相关图片，并复用图片缩放。

---

LLMS index: [llms.txt](/zh/llms.txt)

---

Gallery 把相关图片排成响应式网格。它是一个 Markdown 图片列表，后面跟着
`{.gallery}`
标记：图片、替代文字与说明在没有 JavaScript 时依然可用，在 GitHub 上源码就是一串图片列表。启用图片缩放时，Gallery 复用同一个对话框，而不是再加载一个灯箱。

## 适用场景 {#when-to-use}

用 Gallery 比较少量截图、状态或相关的视觉示例。顺序与对比都不重要时使用单张图片；某一张图片需要正式说明文字时使用[带标题的图](/zh/docs/components/image-zoom/#figures)。

## 快速开始 {#quick-start}

### 源码 {#source}

<!-- prettier-ignore-start -->

```markdown
- ![OINK 文档总览](images/content-primitives/oink.webp) — 文档总览
- ![OINK 反馈界面](/images/feedback.png) — 反馈控件
- ![OINK 版本横幅界面](/images/version-banner.png) — 版本横幅
{.gallery}
```

<!-- prettier-ignore-end -->

### 渲染结果 {#rendered-result}

<!-- prettier-ignore-start -->

- ![OINK 文档总览](images/content-primitives/oink.webp) — 具有已知固有尺寸的全局图片资源。
- ![OINK 反馈界面](/images/feedback.png) — 这条刻意加长的说明文字演示在桌面端与移动端换行时不会遮挡相邻图片，也不会撑宽文档。
- ![OINK 版本横幅界面](/images/version-banner.png) — 响应式网格会在窄视口中减少实际列数。
{.gallery}

<!-- prettier-ignore-end -->

本页启用了图片缩放。点击任意图片即可在共享对话框中查看。禁用 JavaScript 时，同样三张图按同样的阅读顺序保留可见。

## 规则 {#rules}

<!-- prettier-ignore-start -->

| 元素            | 规则                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------ |
| `![alt](src)`   | 每项一张图片；`alt` 必填且必须有意义（空 alt 视为装饰性图片，永远不会缩放）                             |
| `src`           | 页面资源、全局资源、静态路径或远程 URL；本地资源获得固有尺寸与懒加载                                   |
| ` — 说明`       | 图片之后可选的文字，显示在图片下方（书写约定，不是语法）                                               |
| `{.gallery}`    | 紧跟在列表下一行的标记                                                                                 |
{.fields caption="Gallery 记法"}

<!-- prettier-ignore-end -->

网格随视口自适应；没有 `columns` 参数，也没有
`label`。远程图片在 Hugo 构建期间绝不会被下载，因此在浏览器加载之前尺寸未知。

## 语义与回退 {#semantics-and-fallback}

HTML 就是你写的带 `gallery` class 的 `ul`：每个 `li`
包含图片及其说明。图片经主题的图片渲染钩子解析，因此页面资源带有
`width`/`height`，所有图片都懒加载。Markdown 输出就是源码列表；打印与 RSS 渲染同一份静态列表。Gallery 没有私有的 JavaScript 运行时：仅在页面级图片缩放启用时，才把符合条件的图片标记给缩放功能。

## 有意的限制 {#deliberate-limits}

Gallery 不会把图片裁成固定宽高比、按断点重排、隐藏溢出或提供幻灯片导航，也没有 Gallery 专用的灯箱。这些约束保留了文档顺序，并保持回退完整。`gallery`/`gallery/image`
短代码已移除；迁移工具会把它们改写成列表形态。
