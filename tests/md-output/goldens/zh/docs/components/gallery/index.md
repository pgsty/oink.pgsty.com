# 画廊

> 用 `gallery` 围栏把一组相关截图排成响应式网格，每张图可以带说明或链接。

---

LLMS 索引： [llms.txt](/zh/llms.txt)

---

画廊（Gallery）把一组相关的图片并排摆在一起，方便读者对照：安装向导的几个界面、同一块仪表盘的浅色与深色版本、修复前后的同一张图表。在 `gallery` 围栏里每行写一张图，主题会把它们排成网格，屏幕变窄时自动减少列数。

单张图请用[图片](/zh/docs/components/image/)。彼此之间没有先后、也不构成对比的图片，更适合作为独立的图分散在正文里。

## 最简例子 {#minimal}

每行是一张 Markdown 图片：`![替代文字](来源)`。

````markdown {title="源码"}
```gallery
![OINK 文档站的浅色首页](/images/hero-light.webp)
![OINK 文档站的深色首页](/images/hero-dark.webp)
```
````

```gallery
![OINK 文档站的浅色首页](/images/hero-light.webp)
![OINK 文档站的深色首页](/images/hero-dark.webp)
```

替代文字一定要写：它是这一项的标题，是读屏器能读到的唯一文字，也决定这张图能否缩放。列数没有参数，网格跟随容器宽度变化。

## 加说明 {#description}

在图片后面写 ` # `，再写说明，说明显示在图片下方。说明是纯文本，其中的 Markdown 按字面显示；需要字面井号时写 `\#`。

````markdown {title="源码"}
```gallery
![OINK 文档页面的三栏布局](/images/oink.webp) # 默认外壳：侧栏、正文、目录
![Docsy 的经典文档布局](/images/docsy.webp) # OINK 的上游 Docsy，内容模型一脉相承
![发布说明页面](/images/releasenote.webp) # 发布卡片使用 release_url 与 date，checksums 块列出下载资产
```
````

```gallery
![OINK 文档页面的三栏布局](/images/oink.webp) # 默认外壳：侧栏、正文、目录
![Docsy 的经典文档布局](/images/docsy.webp) # OINK 的上游 Docsy，内容模型一脉相承
![发布说明页面](/images/releasenote.webp) # 发布卡片使用 release_url 与 date，checksums 块列出下载资产
```

说明可以长短不一：同一行的各项按最高的一项对齐，某条说明换行也不会挤动相邻的图。图片部分先于说明解析，所以替代文字和路径里的 `#` 不需要转义。

## 每项一个链接 {#link}

在行尾加 `{link=…}`，这一项就成为链接，例如指向讲解这个界面的页面。站内路径、相对路径、`http(s):` 都可以。

````markdown {title="源码"}
```gallery
![OINK 的默认文档外壳](/images/oink.webp) # 点击进入「图片」组件页 {link=/zh/docs/components/image/}
![发布说明页面](/images/releasenote.webp) # 点击进入「发布与下载页」 {link=/zh/docs/write/releases/}
```
````

```gallery
![OINK 的默认文档外壳](/images/oink.webp) # 点击进入「图片」组件页 {link=/zh/docs/components/image/}
![发布说明页面](/images/releasenote.webp) # 点击进入「发布与下载页」 {link=/zh/docs/write/releases/}
```

点击带链接的项会跳转，所以它不参与缩放。同一个画廊可以两种项混排：带链接的打开页面，其余的打开大图。

## 图片来源 {#sources}

每张图的来源按普通图片的顺序查找：页面包里的页面资源、`assets/` 下的全局资源、`/images/…` 这样的静态路径、远程 URL。本地资源的尺寸由主题读出并写进页面，图片加载时网格不会跳动；远程图片在构建期既不下载，也不测量尺寸。

````markdown {title="源码"}
```gallery
![OINK 文档总览（全局资源）](images/content-primitives/oink.webp) # assets/images/… 下的图，可以做构建期处理
![浅色首页（静态路径）](/images/hero-light.webp) # static/images/… 下的图，原样发布
```
````

```gallery
![OINK 文档总览（全局资源）](images/content-primitives/oink.webp) # assets/images/… 下的图，可以做构建期处理
![浅色首页（静态路径）](/images/hero-light.webp) # static/images/… 下的图，原样发布
```

找不到的页面资源或全局资源按静态路径保留。主题不检查静态路径和远程 URL 是否存在，路径写错时，浏览器里会出现一张破图。

## 装饰图与缩放 {#zoom}

替代文字留空表示装饰性图片：它没有标题，读屏器会跳过，也永远不参与缩放。

图片缩放默认关闭，可以用 `params.ui.image_zoom` 为整个站点开启，也可以在某一页的 front matter 里写 `image_zoom`，本页用的是后者。上面每张有替代文字、没有链接的图都能点开看大图，按 <kbd>Esc</kbd> 关闭，焦点回到原来的图片上。

```yaml {title="这一页的 front matter"}
image_zoom: true
```

````markdown {title="源码：一张装饰图配一张正常图"}
```gallery
![](/images/docsy.webp) # 装饰性配图，不参与缩放
![Pigsty 发布说明页面](/images/releasenote.webp) # 有替代文字，可以点开
```
````

```gallery
![](/images/docsy.webp) # 装饰性配图，不参与缩放
![Pigsty 发布说明页面](/images/releasenote.webp) # 有替代文字，可以点开
```

画廊没有自己的缩放对话框，而是复用整页共用的那一个；页面上至少有一张可缩放的图时，缩放脚本才会加载。完整规则见[图片 · 缩放](/zh/docs/components/image/#zoom)。

## 加 class 与分标签页 {#class-and-tabs}

`class` 用来挂站点自己的样式，可以加在整个围栏上（写在语言后面），也可以加在某一项上（写在行尾），主题不解释它，原样透传。围栏带 `tab=`（以及 `group=`、`value=`）时成为一组[标签页](/zh/docs/components/tabs/)中的一页，适合按平台或配色各放一组图。

````markdown {title="源码"}
```gallery {tab="浅色" group="theme" value="light"}
![浅色模式的首页](/images/hero-light.webp) # 默认配色
```
```gallery {tab="深色" value="dark"}
![深色模式的首页](/images/hero-dark.webp) # 跟随系统或手动切换
```
````

```gallery {tab="浅色" group="theme" value="light"}
![浅色模式的首页](/images/hero-light.webp) # 默认配色
```
```gallery {tab="深色" value="dark"}
![深色模式的首页](/images/hero-dark.webp) # 跟随系统或手动切换
```

## 输出形态 {#outputs}

画廊本身不加载脚本，所有图片都懒加载。打印与 RSS 把图片依次堆叠，没有缩放；页面的 Markdown 输出原样保留 `gallery` 围栏。

## 参数参考 {#reference}

行语法 `![alt](src) [# 说明] [{key=value …}]`：

| 元素 | 必填 | 说明 |
| --- | --- | --- |
| `![alt](src)` | 是 | 必须顶在行首。`alt` 是这一项的标题；留空表示装饰图 |
| `src` | 是 | 页面资源 / 全局资源 / 静态路径 / 远程 URL |
| `# 说明` | 否 | 纯文本，显示在图下方；`\#` 是字面井号；不能为空 |
| `{link=…}` | 否 | 让这一项成为链接，因而不可缩放 |
| `{class=…}` | 否 | 给这一项加站点 CSS class |
{.fields}

围栏属性：

| 属性 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `tab` | 纯文本 | — | 让这个画廊成为一个标签页 |
| `group` / `value` | 字符串 | — | 标签页分组与同步值；必须与 `tab` 同时出现 |
| `class` | class 列表 | — | 透传给站点 CSS |
{.fields meta="type default"}

没有 `columns`、`caption`、`title` 属性。格式有误的行或属性会告警并给出围栏内的行号，只丢弃出错的部分或该行。

## 限制与常见问题 {#limits}

- 只有围栏这一种写法，没有 `{.gallery}` 列表标记，也没有 shortcode，因此 GitHub 上显示的是源码而不是图片。
- 不能指定列数，图片保持各自的比例，不会被裁成统一形状。
- 没有幻灯片、轮播或上一张 / 下一张；缩放对话框一次显示一张。
- 构建期不下载远程图片，浏览器加载之前不知道它们的尺寸，版面可能跳动。
- 说明不渲染 Markdown，需要富文本时写在画廊下方的段落里。

需要带侧栏的完整相册、逐张翻页和拖动查看大图时，用 [Expo 布局](/zh/docs/write/expo/)；`gallery` 围栏用于文字页面里的一组图片。

## 相关 {#related}

- [图片](/zh/docs/components/image/) — 单张图、图注、编号、缩放开关
- [卡片](/zh/docs/components/cards/) — 带图片的链接网格
- [标签页](/zh/docs/components/tabs/) — 按平台 / 主题并列多组图
- [文件树](/zh/docs/components/filetree/) — 行语法与画廊同源

---

反链：

- [卡片](/zh/docs/components/cards/)
- [文件树](/zh/docs/components/filetree/)
- [图片](/zh/docs/components/image/)
- [地图](/zh/docs/components/map/)
- [社交帖子](/zh/docs/components/social/)
- [打印支持](/zh/docs/customize/print/)
- [Expo 相册](/zh/docs/write/expo/)
- [OINK v1.3.0](/zh/release/1.3.0/)
