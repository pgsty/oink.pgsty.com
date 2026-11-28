---
title: 卡片
linkTitle: 卡片
description: 把 Markdown 链接列表变成导航卡片网格；卡片需要图标、徽章或图片时改用 shortcode。
weight: 370
search_keywords: [卡片, Cards, card, 链接卡片, 导航卡片, 栏目首页, section-index, 图标, 徽章]
---

卡片（Cards）把几个并列的去处排在一起，让读者一眼选出要去的那个：从哪里开始、接下来读什么、三条路径里哪条适合自己。每张卡片是一个链接标题加一句描述，网格随页面宽度自适应。写法只是一个普通的 Markdown 链接列表，下一行加 `{.cards}`，所以源码在 GitHub 上仍是一个普通列表。正文段落不要做成卡片，写成段落更好读；图片集请用[画廊](/zh/docs/components/gallery/)。栏目自己的首页通常不必手写卡片，主题可以根据子页面自动生成（见[自动卡片](#section-index)）。

## 最简例子 {#minimal}

在链接列表的下一行写 `{.cards}`。每个链接成为卡片标题，` — ` 之后的文字成为描述：

```markdown {title="源码"}
- [快速上手](/zh/docs/start/) — 从 OINK Starter 开始，先在本地预览，再替换为自己的站点信息。
- [创作内容](/zh/docs/write/) — 页面怎么组织、front matter 有哪些键。
- [定制站点](/zh/docs/customize/) — 导航、搜索、品牌、多语言。
{.cards}
```

- [快速上手](/zh/docs/start/) — 从 OINK Starter 开始，先在本地预览，再替换为自己的站点信息。
- [创作内容](/zh/docs/write/) — 页面怎么组织、front matter 有哪些键。
- [定制站点](/zh/docs/customize/) — 导航、搜索、品牌、多语言。
{.cards}

整张卡片都可以点击，不只是标题文字。列数随可用宽度变化，手机上收成一列，所以没有 `columns` 参数。

## 只有标题的卡片 {#title-only}

描述可以省略，每项一个链接就够了。

```markdown {title="源码"}
- [提示块](/zh/docs/components/callout/)
- [标签页](/zh/docs/components/tabs/)
- [步骤](/zh/docs/components/steps/)
- [参数表](/zh/docs/components/fields/)
{.cards}
```

- [提示块](/zh/docs/components/callout/)
- [标签页](/zh/docs/components/tabs/)
- [步骤](/zh/docs/components/steps/)
- [参数表](/zh/docs/components/fields/)
{.cards}

## 松散列表与多段描述 {#loose}

一句话写不下时改用松散列表：链接单独一段，描述另起一段，列表项之间空一行。这样标题独占一行，描述在它下方。`{.cards}` 仍然紧贴最后一段，中间 **不能有空行**。

```markdown {title="源码"}
- [页面参数](/zh/docs/write/frontmatter/)

  每个页面参数在这里有唯一定义：类型、默认值、取值范围，以及讲它的那一页。

- [配置总览](/zh/docs/customize/config/)

  站点参数按功能分组，同样每行反向链接到讲它的指南页。
{.cards}
```

- [页面参数](/zh/docs/write/frontmatter/)

  每个页面参数在这里有唯一定义：类型、默认值、取值范围，以及讲它的那一页。

- [配置总览](/zh/docs/customize/config/)

  站点参数按功能分组，同样每行反向链接到讲它的指南页。
{.cards}

## 单列列表 {#presentation}

资源目录这类内容，读者是自上而下扫读而不是左右比较，这时把 `{.cards}` 换成 `{.cards .td-cards-list}`。卡片会排成一列，装在同一个外框里，以分隔线隔开，每一行随描述长短自然增高。shortcode 形态写 `cards variant="list"` 得到同样的效果；`variant` 取其它值时告警并保持网格。[组件呈现](/zh/docs/components/presentation/#cards)一页先后展示了网格与列表两种样子。

## 图标与徽章 {#icon-badge}

链接列表放不下图标、徽章、图片或多段描述，这些要用 `cards` 与 `card` shortcode。`icon` 是恰好一对 Font Awesome class，`badge` 是显示在标题旁的一小段纯文本。

```markdown {title="源码"}
{{</* cards */>}}
{{</* card title="快速上手" link="/zh/docs/start/" icon="fa-solid fa-rocket" badge="从这里开始" */>}}
使用 OINK Starter，在定制前建立本地预览基线。
{{</* /card */>}}
{{</* card title="发布与下载页" link="/zh/docs/write/releases/" icon="fa-solid fa-box-open" badge="v0.5" */>}}
用 `release_url` 与 `date` 生成发布卡片，再用 `checksums` 块列出下载资产。
{{</* /card */>}}
{{</* card title="键盘导航" link="/zh/docs/customize/keyboard/" icon="fa-solid fa-keyboard" */>}}
全站快捷键与焦点顺序。
{{</* /card */>}}
{{</* /cards */>}}
```

{{< cards >}}
{{< card title="快速上手" link="/zh/docs/start/" icon="fa-solid fa-rocket" badge="从这里开始" >}}
使用 OINK Starter，在定制前建立本地预览基线。
{{< /card >}}
{{< card title="发布与下载页" link="/zh/docs/write/releases/" icon="fa-solid fa-box-open" badge="v0.5" >}}
用 `release_url` 与 `date` 生成发布卡片，再用 `checksums` 块列出下载资产。
{{< /card >}}
{{< card title="键盘导航" link="/zh/docs/customize/keyboard/" icon="fa-solid fa-keyboard" >}}
全站快捷键与焦点顺序。
{{< /card >}}
{{< /cards >}}

`icon` 不是 `fa-solid fa-rocket` 这样的一对 class 时会告警，卡片照常渲染，只是没有图标。

## Markdown 正文 {#markdown-body}

`card` 的正文是普通 Markdown，可以写行内代码、强调、链接和列表。`title`、`badge` 这些参数是纯文本。

```markdown {title="源码"}
{{</* cards */>}}
{{</* card title="Hugo Module" icon="fa-brands fa-golang" */>}}
`hugo mod get github.com/pgsty/oink`。推荐方式，升级只需改一行版本号。
{{</* /card */>}}
{{</* card title="Git Submodule" icon="fa-solid fa-code-branch" */>}}
无需安装 Go：

- `git submodule add`
- 主题落在 `themes/oink`
{{</* /card */>}}
{{</* /cards */>}}
```

{{< cards >}}
{{< card title="Hugo Module" icon="fa-brands fa-golang" >}}
`hugo mod get github.com/pgsty/oink`。推荐方式，升级只需改一行版本号。
{{< /card >}}
{{< card title="Git Submodule" icon="fa-solid fa-code-branch" >}}
无需安装 Go：

- `git submodule add`
- 主题落在 `themes/oink`
{{< /card >}}
{{< /cards >}}

像这两张一样不写 `link` 的卡片，标题显示为粗体，不链接到任何地方。

## 带图片的卡片 {#image}

`image` 在卡片顶部放一张图，查找顺序与 `![alt](src)` 相同：页面资源、当前分区的资源、`assets/` 中的全局资源、`/images/…` 这样的静态路径，最后是远程 URL。本地图片会带上宽高，加载时页面不会跳动。

每张图都要在 `image_alt="…"`（有信息量的图）与 `decorative=true`（纯装饰）之中恰好选一个。两个都写时告警并保留替代文字；两个都不写时告警并按装饰图处理。

```markdown {title="源码"}
{{</* cards */>}}
{{</* card title="OINK 文档外壳" link="/zh/docs/about/features/" image="images/content-primitives/oink.webp" image_alt="OINK 文档页面：侧栏、正文与目录三栏" */>}}
侧栏、正文、目录，三栏可以单独关闭。
{{</* /card */>}}
{{</* card title="发布说明" link="/zh/docs/write/releases/" image="/images/releasenote.webp" decorative=true */>}}
装饰性封面：`decorative=true` 输出空 alt，读屏器会跳过它。
{{</* /card */>}}
{{</* /cards */>}}
```

{{< cards >}}
{{< card title="OINK 文档外壳" link="/zh/docs/about/features/" image="images/content-primitives/oink.webp" image_alt="OINK 文档页面：侧栏、正文与目录三栏" >}}
侧栏、正文、目录，三栏可以单独关闭。
{{< /card >}}
{{< card title="发布说明" link="/zh/docs/write/releases/" image="/images/releasenote.webp" decorative=true >}}
装饰性封面：`decorative=true` 输出空 alt，读屏器会跳过它。
{{< /card >}}
{{< /cards >}}

卡片图片不会在[图片缩放](/zh/docs/components/image/#zoom)对话框中打开，因为点击卡片的任何位置都会跳转到它的链接。

## 栏目首页的自动卡片 {#section-index}

栏目首页（`_index.md`）不写任何列表，也能把子页面列成卡片：主题根据每个子页面的 `title`、`description` 与 `icon` 各生成一张。本站对所有栏目启用了这一功能：

```yaml {title="hugo.yml"}
params:
  ui:
    section_index: cards # list | cards
```

单个栏目可以在自己的 front matter 里另作选择，`cascade` 则把这个选择传给整棵子树：

```yaml {title="content/docs/customize/_index.zh.md"}
section_index: list
```

自动生成的卡片与手写卡片样式相同，区别只在数据来源。栏目的子页面交给主题列出，因为手写的清单会随着页面增加、改名而与侧栏对不上。其它内容才手写卡片，例如站外链接、来自其它栏目的推荐。这些键的定义见[配置总览](/zh/docs/customize/config/)。

## 两种形态的选择 {#forms}

| 你要的 | 用哪种 |
| --- | --- |
| 一句话描述的链接网格 | `{.cards}` 链接列表 |
| 图标、徽章、图片 | `cards` / `card` shortcode |
| 描述里要列表、代码、多段 | `cards` / `card` shortcode |
| 没有链接的卡片 | `cards` / `card` shortcode |
| 本栏目的子页 | 什么都不写，靠 `section_index: cards` |

链接列表能装下内容时就用链接列表：它在 GitHub 上仍是一个链接列表，shortcode 则不是。

## 输出形态 {#outputs}

卡片纯靠 CSS，不加载脚本。打印时，链接列表卡片排成一列，shortcode 卡片收成两列，单张卡片不会被分页截断。页面的 Markdown 输出里，链接列表原样保留，每张 shortcode 卡片变成一行 `- [标题](链接) (徽章) — 描述`。

## 参数参考 {#reference}

原生形态：

| 元素 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `{.cards}` | 列表属性行 | — | 写在无序列表 **之后** 的一行；只对无序列表生效。加上 `.td-cards-list` 变成单列列表 |
| 列表项首个链接 | Markdown 链接 | — | 卡片标题，同时是整张卡片的点击目标 |
| 其余内容 | Markdown | — | 描述。紧凑列表里跟在 ` — ` 后面，松散列表里另起一段 |
{.fields meta="type default"}

`card` 的参数（`cards` 本身只接受可选的 `variant="list"`）：

| 参数 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `title` | 纯文本 | — | 必填，非空。卡片标题 |
| `link` | URL | — | 站内路径、相对路径、`http(s):`、`mailto:`；外链自动加 `rel="noopener"` |
| `icon` | Font Awesome class 对 | — | 例如 `fa-solid fa-rocket`；格式不符时告警并丢弃 |
| `badge` | 纯文本 | — | 标题旁的小标签 |
| `image` | 图片来源 | — | 页面资源 / 全局资源 / 静态路径 / 远程 URL |
| `image_alt` | 纯文本 | — | 有 `image` 时与 `decorative` 二选一 |
| `decorative` | 布尔 | `false` | `true` 表示装饰图，输出空 alt |
| 正文 | Markdown | — | 卡片描述 |
{.fields meta="type default"}

没有 `cols`、`columns`、`accent`、`desc`、`color` 参数。未知参数会告警并忽略。

## 限制与常见问题 {#limits}

- `{.cards}` 只对无序列表生效，加在有序列表上没有任何效果。
- `{.cards}` 必须紧贴在列表下方。前面多一个空行，或者缩进后落进了最后一个列表项，这个标记就会无声无息地失效：构建照常成功，列表仍然是列表。看不到卡片网格时，先检查这一行。
- `card` 写在 `cards` 之外，无论单独使用还是放进别的 shortcode，都会告警并被跳过。
- 只有栏目首页的自动卡片可以通过 `params.ui.section_index_columns` 指定列数，手写的网格始终随宽度变化。
- 超过两行的描述应写成正文段落或[提示块](/zh/docs/components/callout/)。

## 相关 {#related}

- [参数表](/zh/docs/components/fields/) — 同样有原生与 shortcode 两种形态
- [画廊](/zh/docs/components/gallery/) — 一组图片的网格
- [徽章](/zh/docs/components/badge/) — 行内状态标签
- [组织内容](/zh/docs/write/organize/) — 栏目、权重与首页
- [配置总览](/zh/docs/customize/config/) — `section_index` 等站点参数
