---
title: 配置总览
linkTitle: 配置总览
description: 主题真正会读的每一个站点参数：类型、默认值、去哪一页改。查参数从这里开始。
weight: 10
search_keywords:
  [配置, 参数, 站点配置, hugo.yml, params, params.ui, configuration, config, 默认值, default]
search_boost: 1.6
aliases:
  - /docs/configure/overview/
---

OINK 读取的站点级设置都写在 `hugo.yml` 里，每一个键都在本页某张表中占一行，列出类型、默认值，并链接到演示用法的指南页。主题的默认值偏保守：本地搜索、图片缩放、评论、页面反馈和深浅色菜单都要你显式打开，所以站点配置里只需写要改的那几个键。主题没有总开关，也没有 `params.oink.*` 命名空间：本页查不到的键，写了也不起作用。单个页面的设置见[页面参数](/zh/docs/write/frontmatter/)。

默认值一栏为空，表示主题没有默认值：不写这个键，对应功能就不启用。每个分组都有自己的锚点，例如 `/zh/docs/customize/config/#sidebar`。

## hugo.yml 的分层 {#layers}

配置键分四层，键属于哪一层，就决定了它的行为该去哪里查：

| 层 | 例子 | 谁定义的 |
| --- | --- | --- |
| Hugo 原生顶层键 | `baseURL` `title` `languages` `markup` `outputs` `taxonomies` `module` | Hugo 本身，行为见 [gohugo.io](https://gohugo.io/configuration/) |
| `params` 顶层 | `logo` `offline_search` `github_repo` `version` `page_width` `comments` | 主题读取的站点级选项 |
| `params.ui.*` | `navbar_enabled` `sidebar_width_min` `typography` `pager_types` | 外壳、导航与阅读界面 |
| `params.<运行时>` | `mermaid` `plantuml` `drawio` `markmap` | 各内容运行时自己的开关与端点 |

一个能用的站点只需要前两层，其中包括 OINK 的 Markdown 组件所依赖的 Goldmark 设置：

```yaml {title="hugo.yml"}
title: 产品文档
baseURL: https://docs.example.com/
defaultContentLanguage: zh
enableGitInfo: true

markup:
  goldmark:
    renderer:
      unsafe: true
    parser:
      attribute:
        block: true
      wrapStandAloneImageWithinParagraph: false
  highlight:
    noClasses: false

module:
  imports:
    - path: github.com/pgsty/oink

params:
  offline_search: true
  github_repo: https://github.com/example/product-docs
```

## 取值写错时 {#principles}

OINK 会校验它读取的每一个值。遇到用不了的值，比如拼错的枚举、该写布尔却写成字符串、不是十六进制的颜色，它会打印一条告警，写明键名、错误的值和回退值，然后按文档里的默认值继续构建：

```text
WARN invalid params.ui.typography "solarized" (allowed: technical | system) -- using "technical"
```

站点照常构建，所以 `hugo server` 下的一个笔误只会让一项设置退回默认，而不会让所有页面一起报错。front matter 里的覆盖值同样如此，告警还会指出是哪个页面。每次改完配置都读一遍告警：一条告警通常意味着你以为已经生效的功能其实在用默认值，或者根本没打开。常见告警见[验证配置变更](#verify)。也正因为如此，不要打开 Hugo 的 `--panicOnWarning`：OINK 有意用告警报告回退，这个开关会把每一次回退都变成构建失败。

依赖外部服务的功能，配置不完整就保持关闭。Draw.io 没有 `drawio_server`、地图缺 `tiles` 或 `attribution`、Algolia 三个键不全、giscus 缺四个必填值中的任何一个，都会告警并且什么也不渲染；主题绝不会自作主张换用某个公共服务。上游署名缺少必填字段时同样告警，并略去整条署名，因为半条署名读起来和完整的一模一样。

只有一项检查会保留你写的值。`theme_color` 在主题画布上的对比度低于正文 AA 标准 4.5:1 时，颜色照常生效，因为自定义画布或品牌规范可能正需要它；告警里附带一个 id，加进 `ignoreLogs` 即可静音。只有不是十六进制颜色的值才会被丢弃，回到默认配色。

真正还会中断构建的是 Hugo 本身：内容引用解析不到目标页面时，构建会失败。

## 页面级覆盖优先级 {#overrides}

大部分参数都可以针对单个页面或整个分区覆盖。Hugo 的 `.Param` 查找按下面的顺序取第一个找到的值：

1. 页面自己的 front matter；
2. 祖先分区 `_index.md` 里的 `cascade`（离页面越近越优先）；
3. 站点 `params`。

**写进 front matter 时去掉 `ui.` 前缀。** 站点上的 `params.ui.reading_time`，在页面里写成 `reading_time`。front matter 里的 `ui:` 块会被主题静默忽略，所以覆盖看上去没生效时，先对照[页面参数](/zh/docs/write/frontmatter/)核对键名。

```yaml {title="content/docs/wide-reference.md"}
---
title: 宽版参考
page_width: wide
navbar_enabled: false
footer_style: slim
reading_time: false
---
```

分区级用 cascade 一次设定整棵子树：

```yaml {title="content/docs/_index.md"}
---
title: 文档
cascade:
  type: docs
  footer_style: slim
  feedback: true
---
```

只在内容确实不同的地方覆盖。靠一堆覆盖给某一页另造一套视觉系统，主题升级后它往往会和站点其余部分对不上。

## 三项 goldmark 前置 {#goldmark}

Hugo **不会** 把主题模块的 `markup` 设置合并进站点，所以下面这些行必须写在站点自己的 `hugo.yml` 里：

```yaml {title="hugo.yml"}
markup:
  goldmark:
    parser:
      # 块级图片可以带属性行（{caption=…}、编号图）
      wrapStandAloneImageWithinParagraph: false
      attribute:
        block: true
    renderer:
      # `{{%/* … */%}}` 型 shortcode 输出的 HTML 必须保留
      unsafe: true
    extensions:
      passthrough:
        enable: true
        delimiters:
          block: [['\[', '\]'], ['$$', '$$']]
          inline: [['\(', '\)']]
  highlight:
    # 代码高亮用 class 输出，深浅色才能各用一套配色
    noClasses: false
  tableOfContents:
    endLevel: 4
```

前三项是每个 OINK 站点都必须有的前置设置，其余几项分别打开数学公式、随深浅色切换的代码高亮和更深的大纲。缺了哪一项，页面上都有看得见的症状：

| 设置 | 缺少时 |
| --- | --- |
| `parser.attribute.block: true` | `{.fields}`、`{.steps}`、`{caption=…}` 这类属性行原样显示成文字 |
| `parser.wrapStandAloneImageWithinParagraph: false` | 独立成段的图片无法带属性行，图注与编号图都不工作 |
| `renderer.unsafe: true` | 步骤、卡片和 `{{%/* … */%}}` 型 shortcode 输出的 HTML 被 Hugo 转义 |
| `extensions.passthrough` | `\(x\)` 与 `$$…$$` 保持为文字，不会变成公式 |
| `highlight.noClasses: false` | 代码以行内样式着色，深色模式下无法换配色 |
| `tableOfContents.endLevel: 4` | 可选：不写时大纲只收录到 `###` 级标题 |

`renderer.unsafe: true` 同时允许 Markdown 正文中的原始 HTML 通过。团队自己写文档时这没有问题，但它不是过滤器：站点若发布来自不可信作者的投稿，审查应放在合并之前。

## 站点身份与品牌 {#identity}

Hugo 原生键负责站名和 Git 元数据：

| 键 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | string | | 站名，显示在顶栏、`<title>` 与页脚 |
| `baseURL` | string | | 生产域名；子路径部署时带上路径段 |
| `copyright` | string | | 版权行的兜底值，`params.copyright` 未设时按 HTML 原样渲染 |
| `enableGitInfo` | boolean | false | 打开后才有「最后修改」日期与 commit 信息 |
| `enableRobotsTXT` | boolean | false | 生成 `robots.txt` |
| `enableEmoji` | boolean | false | 允许 `:smile:` 这类 emoji 简码 |
{.fields meta="type default"}

主题键负责 Logo、页脚文字与强调色：

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `params.logo` | string | icons/logo.svg | 品牌图标，可指向 `assets/` 资源或 `static/` 路径，见[品牌外观](/zh/docs/customize/brand/#logo) |
| `params.wordmark` | string | | 横向字标，设置后显示在顶栏 Logo 旁，代替站点名称；视口窄于 992 px 时顶栏只显示 Logo |
| `params.description` | string | | 站点描述，页面没有 `description` 时作为 meta 描述 |
| `params.copyright` | string 或 map | | 字符串按 Markdown 渲染；map 接受 `authors`、`from_year`、`to_year`，`present` 表示今年 |
| `params.footer_center_info` | string | Powered by [Oink](https://oink.pgsty.com) | 页脚中间的行内 Markdown，设为空字符串即隐藏 |
| `params.author` | string 或 map | | RSS 的作者；map 接受 `name` 与 `email` |
| `params.ui.theme_color` | string | | `#rgb` 或 `#rrggbb` 十六进制色，为外壳的强调底色着色；正文链接与行内代码保留各自的颜色，见[品牌外观](/zh/docs/customize/brand/#theme-color) |
| `params.ui.theme_color_dark` | string | 派生 | 深色模式下的强调色；省略时由 `theme_color` 逐步提亮，直到在深色画布上达到 AA |
{.fields meta="type default"}

favicon 没有参数：主题按约定文件名在 `static/` 里查找（`favicon.ico`、`favicon.svg`、`favicon-NxN.png`、`apple-touch-icon.png`、`apple-touch-icon-NxN.png`），见[品牌外观](/zh/docs/customize/brand/#favicon)。

## 外壳类型与栏目根 {#shell}

阅读外壳跟随页面的 **type**，而不是所在目录：文档放在任何目录都行，只要 cascade 给它 `type: docs`。

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `params.ui.shell_types` | list | [docs, book, blog, swagger, expo] | 使用带侧栏阅读外壳的 type，见[布局与页面类型](/zh/docs/customize/layout/#shell-types) |
| `params.ui.docs_section` | string | docs | 文档栏目的目录名，只用于导航解析 |
| `params.ui.blog_section` | string | blog | 博客栏目的目录名 |
| `params.ui.docs_sidebar_root` | enum | section | docs 页侧栏从哪里开始：`section` 从文档栏目开始，`home` 从站点首页开始 |
| `params.ui.quick_links` | list | [docs_section, blog_section] | 命令面板在输入之前列出的顶层菜单 identifier，见[命令面板](/zh/docs/customize/panel/) |
| `params.ui.sidebar_root_enabled` | boolean | true | 允许子分区用 `sidebar_root_for: self` 自成一棵侧栏树 |
| `params.ui.sidebar_root_menu` | boolean | true | 侧栏上方的栏目切换器；只有一个入口时退化为普通链接 |
| `params.ui.section_index` | enum | list | 栏目首页列出子页的方式：`list` 或 `cards`，可按分区覆盖 |
| `params.ui.section_index_columns` | integer | 2 | `section_index: cards` 时的列数 |
{.fields meta="type default"}

## Expo 相册 {#expo}

[Expo 相册](/zh/docs/write/expo/)的站点级默认值。页面自己的 `expo` 块会整体替换站点块，未写的字段取内置默认值；读者在浏览器里保存的布局与尺寸又优先于这两者。完整规则见 [Expo 默认值](/zh/docs/write/expo/#defaults)。

| 键 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `params.ui.expo.images` | string | `images/*` | 从页面包中挑选图片资源的匹配模式 |
| `params.ui.expo.mode` | enum | `wall` | `wall`、`cards` 或 `seamless` |
| `params.ui.expo.size` | integer | `240` | 目标格子尺寸，160 至 360 CSS 像素 |
{.fields meta="type default"}

## 博客 {#blog}

以下键控制 `params.ui.blog_section` 指定的博客栏目，每一个都可以在单个栏目的 front matter 或博客根目录的 `cascade` 里覆盖。四种列表布局的并排对比见[布局指南](/zh/docs/write/blog/#list)。

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `params.ui.featured_image` | enum | none | 文章题图在文章页和栏目列表页上怎么呈现：`none` 不显示；`banner` 在标题上方放一张 16:9 的图；`wash` 把图铺在文章头部背后，只留十分之一的不透明度；`hero` 把图作为外壳的通栏背景，并把开头下移。用的就是文章卡片和 `og:image` 里的那张图，三处始终一致。没有题图时，任何模式都不显示 |
| `params.ui.blog_index` | enum | list | `list` 水平条目，`cards` 图文卡片，`table` 紧凑表格，`gallery` 可点击的封面画廊。都按日期倒序；`table` 始终在一页里列出整个栏目 |
| `params.ui.blog_index_columns` | integer | 3 | `blog_index: cards` 在 xl 断点及以上的列数；md 到 xl 之间固定两列，md 以下一列 |
| `params.ui.blog_index_size` | integer | 12 | `list`、`cards`、`gallery` 的每页文章数；打开 `blog_index_toggle` 时四种布局共用。独立的 `table` 忽略此值 |
| `params.ui.blog_index_toggle` | boolean | false | 输出全部四种布局，让读者按 `list` → `cards` → `table` → `gallery` 循环切换并记住选择；为 false 时只输出配置的那一种 |
| `params.ui.blog_gallery.mode` | enum | wall | `gallery` 内部的排布：`wall` 留 6px 间隙，`seamless` 无间隙，`cards` 是始终显示文字的瀑布流；与 `blog_index` 无关 |
| `params.ui.blog_gallery.size` | integer | 240 | 画廊格子的目标尺寸，160–360 CSS 像素；不影响每页文章数 |
| `params.ui.toc_style` | enum | fixed | 右栏的呈现方式：`fixed` 是钉在视口上的面板；`flow` 是更宽的面板，从文章开头处起排，滚动后才钉住 |
| `params.ui.toc_taxonomies` | boolean | true | 右栏的分类词云。既没有大纲也没有词云的右栏不会渲染 |
{.fields meta="type default"}

页面或 cascade 里的 `blog_gallery` 块整体替换站点块，未写的字段取 `wall` 与 `240`。读者保存的排布和尺寸优先于作者的默认值，并且与 Expo 的偏好分开保存，见[画廊形态](/zh/docs/write/blog/#list-gallery)。

作者与系列是分类法而不是参数，见[分类法](/zh/docs/customize/taxonomy/#authors)与[写博客](/zh/docs/write/blog/)。

## 顶栏与页脚 {#navbar-footer}

顶栏、页脚，以及面包屑行右端的页面操作菜单：

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `params.ui.navbar_enabled` | boolean | true | 是否渲染站点顶栏；页面可用顶层 `navbar_enabled` 覆盖，见[导航与菜单](/zh/docs/customize/navigation/#navbar) |
| `params.ui.navbar_autohide` | boolean | false | 顶栏收到视口上方，指针移到顶部的唤醒区时再出现；宽度小于 768px 或粗指针设备上不生效 |
| `params.ui.footer_style` | enum | fat | `fat` 是多列网格加版权行，`slim` 只有版权行，`none` 不渲染 |
| `params.ui.dark_mode` | boolean 或 map | false | `true` 同时打开深色调色板与深浅色控件；`{ show_menu: true }` 隐含 `enable: true`；`{ enable: true, show_menu: false }` 仅启用深色模式而不显示顶栏控件 |
| `params.ui.breadcrumb` | boolean | 按外壳（`blog` 为 `false`，其余为 `true`） | 标题上方的面包屑导航。顶层分区本来就不显示只有一级的面包屑 |
| `params.ui.page_context_menu.enable` | boolean | true | 面包屑行右端的页面操作拆分按钮 |
| `params.ui.page_context_menu.assistant_links` | boolean | false | 加上「在 ChatGPT 中打开」「在 Claude 中打开」；点击时会把页面的完整 URL 发给对方站点 |
| `params.ui.page_context_menu.links` | list | [] | 自定义外部操作，`url` 可使用 `{url}`、`{title}`、`{markdown_url}` 占位符 |
| `params.ui.github_stars` | string 或 number | | 顶栏 GitHub 徽标上的星数，是你写死的常量，页面不发任何请求 |
| `params.ui.alt_site` | map | | 单语言站点页脚里的姊妹站链接，`label` 与绝对 `http(s)` 地址 `url` 缺一不可 |
{.fields meta="type default"}

胖页脚的各列来自 `data/footer/<语言>.yaml`，不是参数，见[导航与菜单](/zh/docs/customize/navigation/#footer)。

## 侧栏 {#sidebar}

左侧导航树的渲染方式。树的结构由 `content/` 下的目录决定（见[组织内容](/zh/docs/write/organize/)），这些键的实际用法见[布局与页面类型](/zh/docs/customize/layout/#sidebar)。

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `params.ui.sidebar_menu_compact` | boolean | true | 只展开当前分支与邻近条目 |
| `params.ui.sidebar_menu_foldable` | boolean | true | 允许读者展开、折叠分区 |
| `params.ui.sidebar_menu_truncate` | integer | 2000 | 一个分区最多渲染的条目数，超出部分截掉 |
| `params.ui.sidebar_cache_limit` | integer | 500 | 页数达到此值后，语言、侧栏根与有效设置都相同的页面共用一份导航标记，由浏览器标出当前条目 |
| `params.ui.sidebar_width_min` | integer | 220 | 桌面端拖拽调宽的下限，单位像素 |
| `params.ui.sidebar_width_max` | integer | 480 | 拖拽调宽的上限，单位像素 |
| `params.ui.sidebar_item_overflow` | enum | ellipsis | 长标题用 `ellipsis` 截断，或用 `wrap` 换行 |
| `params.ui.sidebar_icon_policy` | enum | all | 图标密度：`all` 全部显示，`groups` 只在根与有子页的条目上显示，`none` 都不显示 |
| `params.ui.sidebar_expand_levels` | integer | 2 | 默认展开的树层级数 |
| `params.ui.sidebar_headings` | boolean 或 integer | false | 仅对 `type: book` 生效：在侧栏当前行下展开本页标题分支；整数取值 2–4，`true` 等于 2 |
| `params.ui.sidebar_enabled` | boolean | true | 左侧栏；通常按页面关闭，而不是整站关闭 |
| `params.ui.taxonomy_icons` | map | 内置 | 按分类法复数名指定图标。每种分类法有两个图标：`taxonomy` 代表整个分类法，例如右栏词云的分组标题；`term` 代表单个词条的徽章。写一个字符串（如 `tags: fa-solid fa-tags`）同时设置两者；写成含 `taxonomy`、`term` 的 map 则分别设置，未写的键保留内置图标。`tags`、`categories`、`modules`、`authors`、`series` 有内置图标对，其它分类法使用通用的 shapes 图标 |
{.fields meta="type default"}

## 目录 TOC {#toc}

右侧大纲收录哪些标题级别由 Hugo 决定，主题只负责让它跟随阅读位置。单个页面隐藏大纲用 front matter `notoc: true`（见[页面参数](/zh/docs/write/frontmatter/)）。

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `markup.tableOfContents.startLevel` | integer | 2 | Hugo 原生：收录的最高标题级别 |
| `markup.tableOfContents.endLevel` | integer | 3 | Hugo 原生：收录的最低标题级别 |
| `params.ui.scroll_spy` | boolean | false | 不起作用：大纲始终高亮当前标题。旧配置里的这一行可以删掉 |
{.fields meta="type default"}

## 翻页与页尾 {#page-end}

页尾各块的顺序固定：分享、反馈、页面信息、翻页、评论，各有各的开关。反链显示在右栏大纲旁边。

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `params.ui.share` | list | [] | 页尾的分享目标，按列出的顺序显示，可选 `x` `bluesky` `mastodon` `facebook` `linkedin` `reddit` `hackernews` `telegram` `whatsapp` `line` `pinterest` `weibo` `chatgpt` `claude` `email` `copy`。为空则不显示分享栏。每一项都是普通链接，没有 SDK、iframe、第三方脚本，也没有分享计数。未知目标告警并丢弃。见[写博客](/zh/docs/write/blog/#share) |
| `params.ui.pager_types` | list | [docs, book, blog] | 显示上一页、下一页链接的 type；单页用 `pager: false` 关闭。未知 type 告警并丢弃 |
| `params.ui.annotation` | boolean | true | 正文末尾的「最后修改」与出处区块；上游署名由页面的 `upstream_link` 一族键决定，见[页面参数](/zh/docs/write/frontmatter/#upstream) |
| `params.ui.backlinks` | boolean | false | 在右栏以「反链」分组列出链接到本页的页面，构建时从普通链接推算，见[导航与菜单](/zh/docs/customize/navigation/#backlinks) |
| `params.ui.compare` | boolean | false | 双列视图：为同站内有 HTML 译文的 Docs、Book 与博客页面并排显示两种语言；单个语言可设为 `false` 退出，见[双列视图](/zh/docs/customize/i18n/#bilingual-view) |
| `params.ui.translation_notice` | 语言代码或 false | false | 权威版本的语言代码，译文页据此显示一行指回原文的说明；页面写 `translation_notice: false` 退出 |
| `params.ui.reading_time` | boolean | false | 在页面标题下显示阅读时长 |
| `params.ui.book_draft_banner` | boolean | false | Book 草稿页顶部加一条横幅 |
{.fields meta="type default"}

## 搜索与命令面板 {#search}

本地搜索默认关闭。打开后命令面板随之出现，可以从顶栏放大镜、{{< kbd "Cmd/Ctrl" "K" >}}、`/` 和 `\` 唤起。

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `params.offline_search` | boolean | false | 为每种语言生成一份本地索引，并启用命令面板，见[全文检索](/zh/docs/customize/search/) |
| `params.offline_search_on_serve` | boolean | true | `hugo server` 预览时也生成索引，预览里的搜索与线上一致；站点很大时设为 `false` 可加快本地重建 |
| `params.offline_search_index` | enum | content | 每页写进索引的范围，逐级累加：`title`、`heading`、`summary`、`content` |
| `params.offline_search_summary_length` | integer | 70 | 每页存入索引的摘录长度（字符数）；结果没有命中段落时显示这段摘录 |
| `params.offline_search_max_results` | integer | 10 | 一次搜索最多返回的页面结果数 |
| `params.ui.landing_search` | boolean | true | `layout: landing` 页面是否保留搜索入口 |
| `params.ui.command_palette.commands` | list | [] | 自定义面板命令，每条二选一：`url` 或内置 `action`，见[命令面板](/zh/docs/customize/panel/#custom-commands) |
| `params.gcs_engine_id` | string | | Google 可编程搜索引擎 ID；设置后搜索请求发往 Google |
| `params.search.algolia` | map | | Algolia DocSearch；`appId`、`apiKey`、`indexName` 三项都必填 |
{.fields meta="type default"}

自定义命令只接受 `id`、`title`、`description`、`icon`、`keywords`、`url`、`action` 七个键。`id` 必须匹配 `^[a-z][a-z0-9_-]*$`，且不能与内置动作 ID 重名。分语言的标题写在 `languages.<lang>.params.ui.command_palette.commands`。

## 键盘 {#keyboard}

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `params.ui.keyboard_nav` | boolean | true | 导航、页面操作与样式三组共二十九个单键快捷键，以及浏览历史和读者设定的正文宽度。设为 `false` 后页面不加载这部分运行时，不绑定按键、不记录历史，也不恢复宽度，见[键盘导航](/zh/docs/customize/keyboard/) |
{.fields meta="type default"}

## 图片缩放 {#image-zoom}

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `params.ui.image_zoom` | boolean | false | 允许点击正文图片查看原尺寸；页面用 front matter `image_zoom` 覆盖 |
{.fields meta="type default"}

哪些图片可以缩放见[图片](/zh/docs/components/image/)。

## 字体排版 {#typography}

视觉预设、字体与页面宽度：

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `params.ui.preset` | enum | paper | 站点整体外观：`paper` 或 `slate`，或者显式选择的实验预设 `ink`、`terminal` |
| `params.ui.preset_menu` | boolean 或 list | false | `true` 让读者在 Paper、Slate 与站点默认值之间选择；列表则列出提供哪些预设，可以包含实验预设，但必须包含站点默认值。与 `dark_mode` 互不影响 |
| `params.ui.typography` | enum | technical | `technical` 使用所选预设自带的字体（Paper：Plex Sans；Slate：Inter）；`system` 只用平台字体栈，不请求品牌字体 |
| `params.ui.fonts` | map | | 为 `ui`、`body`、`heading`、`code`、`display`、`meta`、`brand`、`print` 八个角色指定字体族名。主题检查名称，但不加载字体文件；每份列表都以通用字体族收尾 |
| `params.page_width` | enum | normal | 外壳整体宽度：`normal`、`wide`、`full`，可逐页覆盖 |
| `params.reading_width` | enum | normal | Book 页正文的行宽：`slim`、`normal`、`wide`，不影响外壳 |
{.fields meta="type default"}

读者系统里已有的字体，或者站点已用 `@font-face` 声明的字体，直接写进 `params.ui.fonts` 即可。要随站点分发字体文件，或做更细的排版调整，写在项目样式表里，见[品牌外观](/zh/docs/customize/brand/#fonts)。

## 评论与反馈 {#comments-feedback}

评论使用 giscus，每页的讨论存放在一个 GitHub 仓库里；页面反馈只是两个按钮，自身没有后端。

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `params.comments.enable` | boolean | false | 站点级评论开关，页面用 front matter `comments` 覆盖，见[启用评论](/zh/docs/admin/comments/) |
| `params.comments.type` | string | giscus | 目前只有 `giscus` 会真正渲染 |
| `params.comments.giscus.repo` | string | | 承载讨论的 GitHub 仓库，必填 |
| `params.comments.giscus.repoId` | string | | 仓库 ID，必填 |
| `params.comments.giscus.category` | string | | 讨论分类名，必填 |
| `params.comments.giscus.categoryId` | string | | 讨论分类 ID，必填 |
| `params.comments.giscus.mapping` | string | pathname | 页面与讨论的映射方式 |
| `params.comments.giscus.term` | string | | `mapping` 为 `specific` 或 `number` 时的讨论标题或编号；不设置时不输出该属性 |
| `params.comments.giscus.strict` | string | 0 | 严格标题匹配 |
| `params.comments.giscus.reactionsEnabled` | string | 1 | 在主贴上显示表情回应 |
| `params.comments.giscus.emitMetadata` | string | 0 | 向父页面发送讨论元数据 |
| `params.comments.giscus.inputPosition` | string | top | 输入框位于评论列表上方还是下方 |
| `params.comments.giscus.theme` | string | auto | giscus 主题，`auto` 跟随站点深浅色 |
| `params.comments.giscus.lightTheme` | string | OINK 配色 | 浅色模式下使用的 giscus 主题名或自定义 CSS URL；默认是 OINK 为当前预设准备的样式表，评论区与页面风格一致 |
| `params.comments.giscus.darkTheme` | string | OINK 配色 | 深色模式下使用的 giscus 主题名或自定义 CSS URL；默认是 OINK 为当前预设准备的样式表 |
| `params.comments.giscus.loading` | string | lazy | `lazy` 等读者接近评论区时才请求 giscus 脚本（从 GitHub 登录返回时除外）；`eager` 立即请求 |
| `params.comments.giscus.lang` | string | 按站点语言推导 | giscus 界面语言。不设置时中文站解析为 `zh-CN`、`zh-TW` 或 `zh-HK`，其它语言取主语言代码；giscus 不支持的语言回退到 `en` |
| `params.comments.giscus.ariaLabel` | string | 已翻译 | 评论区容器的 `aria-label`；默认是页面语言里的「评论」 |
| `params.comments.giscus.errorMessage` | string | 已翻译 | 加载失败时显示的文字；默认是页面语言里的「无法加载评论。」 |
| `params.ui.feedback.enable` | boolean | false | 页尾「本页对你有帮助吗？」两个按钮。没有后端；页面上有 `gtag` 时，每次回答记录为一条结构化事件 |
| `params.ui.feedback.reasons` | boolean | true | 选「否」后提供四个可选原因 |
{.fields meta="type default"}

四个 giscus 必填值缺任何一个，页面都不会出现评论区。这几个值去哪里找，见[启用评论](/zh/docs/admin/comments/#enable)。

## 仓库链接与页面信息 {#repository}

从每个页面链回源码的链接，以及页尾的信息区块：

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `params.github_repo` | string | | 存放内容的仓库 URL，驱动「编辑当前页面」「查看编辑历史」「添加子页面」「提交文档议题」，见[仓库与页面信息](/zh/docs/customize/repository/) |
| `params.github_project_repo` | string | github_repo | 产品仓库 URL，用于「提交项目议题」与顶栏 GitHub 入口 |
| `params.github_branch` | string | main | 编辑链接指向的分支 |
| `params.github_subdir` | string | | 内容站在 monorepo 中的子目录 |
| `params.path_base_for_github_subdir` | string 或 map | | 在源码路径（统一为 `/` 分隔）变成仓库链接之前重写它；map 接受 `from` 与 `to`。从仓库外挂载的内容必须显式映射为仓库内的相对路径，见[仓库链接](/zh/docs/customize/repository/#imported-content) |
| `params.github_url` | — | — | 已移除，主题不再读取；改用 `params.github_repo` |
| `params.ui.lastmod_commit` | enum | subject | 「最后修改」后面附什么：`subject` 为 commit 标题，`hash` 为短哈希，`none` 不附 |
| `params.images` | string 数组 | — | 站点级社交卡片：页面自己没有图片时用来填 `og:image`；只进元数据，不会显示为列表缩略图 |
| `params.upstream_source` | string | — | 声明了 `upstream_link` 的页面默认使用的 `data/upstreams` 记录；页面 front matter 可以覆盖 |
| `params.upstream_modified` | boolean | `false` | 上游材料是否经过改编的站点默认值，页面可以覆盖；没有 `upstream_link` 时什么也不渲染 |
| `params.default_featured` | — | — | 已移除，主题不再读取；改用 `params.images`，或栏目 `cascade` 里的 `images` |
{.fields meta="type default"}

## 内容运行时 {#runtimes}

Mermaid、KaTeX、ECharts、Infographic、Asciinema、Swagger UI 与 Redoc 会在用到它们的页面上自动加载，而且只在 HTML 输出里加载，因此没有开关。需要开关的只有下面这些，多半是因为它们要连接一个由你选定的服务。PlantUML 默认在读者的浏览器里渲染，设置 `svg_image_url` 后改由服务端渲染；两种模式的对比见 [PlantUML](/zh/docs/components/plantuml/)。

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `params.markmap` | boolean | false | 站点级启用思维导图围栏，见[思维导图](/zh/docs/components/markmap/) |
| `params.mermaid` | map | | 透传给 `mermaid.initialize()` 的配置；键名全小写，深色模式自动覆盖 `theme` |
| `params.plantuml` | boolean 或 map | 关闭 | `true` 启用本地渲染；`false` 关闭所有 PlantUML 渲染 |
| `params.plantuml.enable` | boolean | false | 启用 PlantUML 本地渲染，见 [PlantUML](/zh/docs/components/plantuml/) |
| `params.plantuml.svg_image_url` | string | | 可选的 PlantUML 服务端点；不写时在浏览器里渲染 |
| `params.plantuml.svg` | boolean | false | 仅服务端模式有效：输出内联 SVG 而不是 `<img>` |
| `params.drawio.enable` | boolean | false | 为 `.drawio.svg` 图片加上编辑按钮，见 [Draw.io](/zh/docs/components/drawio/) |
| `params.drawio.drawio_server` | string | | Draw.io 编辑器地址；`enable` 为 true 时必填 |
| `params.video_embeds` | list | `[]` | 读者点击视频卡片后可就地加载播放器的平台（`youtube`、`bilibili`、`vimeo`）；留空时卡片只链接到平台，见[视频](/zh/docs/components/video/#platforms) |
| `params.map` | boolean 或 map | 关闭 | 在 `map` 地点列表上方显示交互地图，见[地图](/zh/docs/components/map/) |
| `params.map.enable` | boolean | false | 启用交互地图；需要同时配置 `tiles` 与 `attribution` |
| `params.map.tiles` | string | | 含 `{z}`、`{x}`、`{y}` 的 HTTPS 瓦片模板（支持 `{s}`、`{r}` 与 `{-y}`；其他占位符会告警，该模板被忽略）。主题不指定任何服务；启用时必填 |
| `params.map.attribution` | string | | 瓦片服务要求的纯文本署名；启用时必填 |
| `params.map.attribution_url` | string | | 可选的 `https://` 链接，将署名渲染为可点击超链接 |
| `params.map.dark_tiles` | string | | 可选，深色模式下使用的瓦片模板 |
| `params.map.subdomains` | string | | 可选的 `{s}` 子域名字符集，写成带引号的字符串（如 `abcd`、`"01234567"`）；留空时沿用 Leaflet 的 `abc` |
| `params.map.max_zoom` | integer | 19 | 最大缩放级别，1–22 |
| `params.map.loading` | `lazy` \| `click` | `lazy` | 接近视口加载（`lazy`）或点击按钮后加载（`click`） |
| `params.highlight_classes` | boolean | true | 语法高亮输出 Chroma class；设为 `false` 回到 Hugo 的行内样式 |
| `params.ui.code_copy` | boolean | true | 代码块的复制按钮；设为 `false` 全站去掉，围栏自己写的 `copy=` 仍然优先 |
| `params.ui.rich_copy` | boolean | true | 正文选区粘贴到富文本编辑器时的排版 HTML 复制，可按页或经 cascade 覆盖，见[复制到富文本编辑器](/zh/docs/customize/print/#typeset-copy) |
{.fields meta="type default"}

数学公式不需要参数，只需要 [`passthrough` 设置](#goldmark)。

## 输出格式 {#outputs}

主题定义了额外的输出格式，但一个都不替站点打开：有些构建成本高，而大多数站点只用得上其中几种。需要哪种，就写进 `outputs`：

```yaml {title="hugo.yml"}
outputs:
  home: [HTML, markdown, LLMS, NAVJSON]
  page: [HTML, markdown]
  section: [HTML, RSS, print, markdown]
```

| 格式 | 产物 | 说明 |
| --- | --- | --- |
| `HTML` | `index.html` | 可交互的页面，必选 |
| `markdown` | `index.md` | 每页的纯 Markdown 版本；「复制 Markdown」「查看 Markdown 源码」依赖它，见 [Agent 支持](/zh/docs/customize/agents/) |
| `LLMS` | `llms.txt` | 给语言模型读的纯文本站点索引，通常只挂在 `home` 上 |
| `LLMSFULL` | `llms-full.txt` | 顶层栏目按需开启：按侧栏顺序拼接该栏目各页的 Markdown，每种语言一份 |
| `NAVJSON` | `navigation.json` | 在 `home` 上按需开启：把侧栏与翻页使用的树写成 JSON，每种语言一份，由 `schema/nav.v1.schema.json` 校验 |
| `print` | `_print/index.html` | 把整个栏目合成一个可打印页面，见[打印支持](/zh/docs/customize/print/) |
| `BookManifest` | `book.json` | 可选，放在 Book 根目录、交给 EPUB/PDF 打包工具的 JSON；本身不是电子书 |
| `RSS` | `index.xml` | Hugo 原生格式，挂在 `section` 上让每个栏目都有订阅源 |

`LLMSFULL` 与 `BookManifest` 写在发布它们的顶层栏目的 front matter 里，不写在站点配置中；`NAVJSON` 写在 `outputs.home`。完整示例见 [Agent 支持](/zh/docs/customize/agents/)和[书籍出版](/zh/docs/write/book/)。

打印输出有两个参数：

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `params.print.toc` | boolean | true | 在打印页开头生成目录；设为 `false` 不生成 |
| `params.print.section_break_wordcount` | integer | 50 | 一节至少多少词才在打印页上另起一页 |
{.fields meta="type default"}

## 多语言与版本 {#languages-versions}

语言用 Hugo 原生的 `languages` 块定义，主题读取 Hugo 据此建立的翻译关系：

| 键 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `defaultContentLanguage` | string | en | 首要语言，URL 不带路径前缀 |
| `languages.<lang>.label` | string | | 该语言的自称，显示在语言菜单里 |
| `languages.<lang>.locale` | string | | 完整 locale，用于 `<html lang>` 与 SEO |
| `languages.<lang>.weight` | integer | | 语言顺序，也是读者点击语言图标时的循环顺序 |
| `languages.<lang>.title` | string | | 该语言下的站名 |
| `languages.<lang>.direction` | string | ltr | 从右向左书写的语言设为 `rtl` |
{.fields meta="type default"}

对等文件、锚点对齐与缺译回退见[多语言](/zh/docs/customize/i18n/)。

版本相关参数：

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `params.version` | string | | 当前站点变体的版本标识，不必是 Git ref，见[多版本](/zh/docs/customize/versions/) |
| `params.version_menu` | string | Version | 版本菜单的标题 |
| `params.version_menu_pagelinks` | boolean | | 切换版本时先尝试目标站点上的同一路径 |
| `params.versions` | list | | 版本条目，含 `version`、`url`、`kind`；`name: '---'` 是分隔线 |
| `params.archived_version` | boolean | | 在顶部显示「这是归档版本」横幅 |
| `params.url_latest_version` | string | | 横幅里指向当前版本的链接 |
| `params.time_format_blog` | string | 2006-01-02 | 博客日期格式，可按语言覆盖 |
| `params.time_format_default` | string | 2006-01-02 | 其余日期格式，可按语言覆盖 |
{.fields meta="type default"}

## 其它 {#misc}

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `taxonomies` | map | | Hugo 原生：启用 `tag: tags` 与 `category: categories`，见[分类体系](/zh/docs/customize/taxonomy/) |
| `params.taxonomy.page_header` | list | | 文章头部显示哪些分类法；不设则全部显示 |
| `services.googleAnalytics.id` | string | | Hugo 原生：分析脚本只加进生产构建，见[分析与 SEO](/zh/docs/admin/analytics/) |
| `module.hugoVersion.min` | string | 0.169.0 | 允许构建本站的最低 Hugo 版本，应与主题自己声明的最低版本一致；Hugo 低于它时构建失败 |
{.fields meta="type default"}

## 通过生成式 Schema 获得编辑器补全 {#editor-schema}

主题为自己的配置发布了 JSON Schema，编辑器据此可以补全键名、悬停显示每个键的说明，并在你输入时标出类型错误。`schema/site-params.schema.json` 对应 `hugo.yml`，`schema/front-matter.schema.json` 对应页面 front matter。请从与 `go.mod` 中固定的主题版本相同的标签下取用，因为不同版本之间的键会变。

使用 VS Code YAML 扩展时，在设置里映射站点 Schema。下例以 OINK v1.7.0 为例，同时覆盖两种常见文件名；把标签换成你 `go.mod` 里的版本：

```json {title=".vscode/settings.json"}
{
  "yaml.schemas": {
    "https://raw.githubusercontent.com/pgsty/oink/v1.7.0/schema/site-params.schema.json": ["hugo.yml", "hugo.yaml"]
  }
}
```

想确认映射是否生效，可以把 `params.offline_search` 这类布尔键暂时写成字符串，编辑器应当标出类型错误，确认后改回正确的值。front matter 的补全取决于你的 Markdown 工具链，用同样方式关联 `front-matter.schema.json` 即可。这份 Schema 不做类型约束，因为 `share`、`theme_color` 这类键除了常规类型外，还接受一个裸布尔值来退出。

## 验证配置变更 {#verify}

每次改完配置构建一次：

```bash
hugo --printPathWarnings
```

以 `Total in …` 结束且没有 `ERROR`，构建就是好的。然后逐条读 `WARN`，常见的有这些：

| 告警片段 | 原因 |
| --- | --- |
| `invalid params.ui.typography` | 只有 `technical` 与 `system` 两个选项 |
| `invalid params.ui.footer_style … (allowed: fat \| slim \| none)` | 页脚形态拼错；来自 front matter 时告警会指出页面 |
| `invalid params.page_width … (allowed: normal \| wide \| full)` | 页宽拼错 |
| `invalid params.ui.section_index … (allowed: list \| cards)` | 栏目首页样式拼错 |
| `invalid params.offline_search_index` | 索引范围只有 `title`、`heading`、`summary`、`content` |
| `params.drawio.enable requires an explicit params.drawio.drawio_server` | 开了 Draw.io 却没给编辑器地址 |
| `params.map.enable requires params.map.tiles … and params.map.attribution` | 开了地图却没有配齐瓦片服务 |
| `params.map.tiles may use only the {s}, {z}, {x}, {y}, {-y} and {r} placeholders` | 模板里有 `{apikey}` 这类无值可填的占位符；请把密钥直接写进 URL |
| `params.video_embeds must be a list of platforms` | 写成了单个字符串或布尔值 |
| `params.search.algolia requires explicit appId, apiKey, and indexName` | Algolia 三项缺了一项 |
| `params.ui.image_zoom must be true or false` | 写成了 `"true"` 这样的字符串 |
| `theme_color … is not a #rgb or #rrggbb hex color` | 值不是十六进制颜色，保留默认配色 |
| `theme_color … reads at about N:1 against the theme's … canvas` | 建议性告警：颜色照常生效，消息里附带静音用的 id |
| `theme_color_dark … has no theme_color to pair with` | 只设了深色那一半；该值被忽略，两种模式都保留默认配色 |
| `command … must define exactly one of url or action` | 自定义命令同时给了 `url` 和 `action`，或两个都没给 |
| `invalid params.ui.sidebar_icon_policy …; using all` | 图标策略拼错 |

最后在浏览器里查三件事：每种语言各打开一页；打开一个没有译文的页面，看回退是否正常；在生产 `baseURL` 下检查链接，部署在子路径时尤其要看。构建时使用与生产环境相同的 Hugo，所需版本见[快速上手](/zh/docs/start/#tools)。

## 相关 {#related}

- [品牌外观](/zh/docs/customize/brand/) — 站名、Logo、配色、字体
- [导航与菜单](/zh/docs/customize/navigation/) — 顶栏菜单、页面操作、页脚
- [布局与页面类型](/zh/docs/customize/layout/) — 外壳、侧栏、目录
- [页面参数](/zh/docs/write/frontmatter/) — front matter 全表
- [排错与检查](/zh/docs/admin/troubleshooting/) — 构建失败时怎么定位
