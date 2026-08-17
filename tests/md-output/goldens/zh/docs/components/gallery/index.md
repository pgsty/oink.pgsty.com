# Gallery

> 用响应式静态网格排列相关图片，并复用图片缩放。

---

LLMS index: [llms.txt](/zh/llms.txt)

---

Gallery 把相关图片排成响应式网格。它是一个 `gallery`
代码围栏，每行一张图片，行语法与 [FileTree](/zh/docs/components/filetree/)
一致：先是图片，然后 `#` 加说明，最后是可选的 `{key=value}` 属性。

围栏取代了原先"图片列表 + `{.gallery}` 标记"的形态。列表标记只能靠 CSS
实现 —— Markdown 列表没有渲染钩子 ——
所以主题看不见列表项，既给不了每项属性，更重要的是无法在不猜测周围标记的前提下给图片打上图片缩放的标记。代价是源码在
GitHub 上不再渲染成图片；换来的是网格、四态输出与缩放资格都由主题保证。

## 适用场景 {#when-to-use}

用 Gallery 比较少量截图、状态或相关的视觉示例。顺序与对比都不重要时使用单张图片；某一张图片需要正式说明文字时使用[带标题的图](/zh/docs/components/image-zoom/#figures)。

## 快速开始 {#quick-start}

### 源码 {#source}


````markdown
```gallery
![OINK 文档总览](images/content-primitives/oink.webp) # 文档总览
![OINK 反馈界面](/images/feedback.png) # 反馈控件
![OINK 版本横幅界面](/images/version-banner.png) # 版本横幅 {link=/zh/docs/}
```
````


### 渲染结果 {#rendered-result}


```gallery
![OINK 文档总览](images/content-primitives/oink.webp) # 具有已知固有尺寸的全局图片资源。
![OINK 反馈界面](/images/feedback.png) # 这条刻意加长的说明文字演示在桌面端与移动端换行时不会遮挡相邻图片，也不会撑宽文档。
![OINK 版本横幅界面](/images/version-banner.png) # 响应式网格会在窄视口中减少实际列数。
```


本页启用了图片缩放。点击任意图片即可在共享对话框中查看。禁用 JavaScript 时，同样三张图按同样的阅读顺序保留可见。

## 规则 {#rules}


| 元素 | 规则 |
| --- | --- |
| `![alt](src)` | 必须位于每行行首，因此 `alt` 是一等字段而不是容易漏写的属性。它同时充当该项标题；空 alt 视为装饰性图片，永远不会缩放 |
| `src` | 页面资源、全局资源、静态路径或远程 URL；本地资源获得固有尺寸与懒加载 |
| `# 说明` | 图片之后可选的文字，显示在图片下方，为纯文本。alt 或源地址中的 `#` 无需转义；说明中的字面井号写作 `\#` |
| `{link=…}` | 使该项成为链接，因而不可缩放 —— 运行时会跳过链接内的图片 |
| `{class=…}` | 给该项附加站点 CSS class |
{.fields caption="Gallery 记法"}

行首不是图片、`#` 之外的尾随文字、空说明，以及未知或畸形的属性，都会带着围栏行号导致构建失败。


网格随视口自适应；没有 `columns` 属性。远程图片在 Hugo
构建期间绝不会被下载，因此在浏览器加载之前尺寸未知。

## 语义与回退 {#semantics-and-fallback}

HTML 是 `ul.td-gallery`，每行对应一个
`li.td-gallery__item`。图片源经共享图片解析器处理，因此页面资源带有
`width`/`height`，所有图片都懒加载。由于网格由主题自己渲染，符合条件的图片在构建时就被打上缩放标记，而不是靠推断周围的标记 ——
Gallery 仍然没有私有的 JavaScript 运行时，只是复用页面级的对话框。Markdown
输出是围栏源码，与所有数据围栏一致；打印与 RSS 渲染同一个网格的堆叠形态。

## 有意的限制 {#deliberate-limits}

Gallery 不会把图片裁成固定宽高比、按断点重排、隐藏溢出或提供幻灯片导航，也没有 Gallery 专用的灯箱。这些约束保留了文档顺序，并保持回退完整。迁移工具会把 `gallery`/`gallery/image` 短代码和过渡期的 `{.gallery}`
列表都改写成围栏形态，并把列表形态的 ` — ` 分隔符转成 `#`。
