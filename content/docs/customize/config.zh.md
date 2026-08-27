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

站点参数的唯一归属页。主题读取的每个键在下面某张表里有一行，给出类型、默认值与一句说明，并链接到讲它的指南页。指南页只给可粘贴的片段，不重复定义。页面级参数（front matter）见[页面参数](/zh/docs/write/frontmatter/)。

表格按功能分组，每组一个 `##`，锚点可以引用，例如 `/zh/docs/customize/config/#sidebar`。**默认值一栏空着表示主题没有默认值**：不配置该功能就不生效。

## hugo.yml 的分层 {#layers}

OINK 站点配置有四类键，改哪一层取决于改动目标：

| 层 | 例子 | 谁定义的 |
| --- | --- | --- |
| Hugo 原生顶层键 | `baseURL` `title` `languages` `markup` `outputs` `taxonomies` `module` | Hugo 本身，行为见 [gohugo.io](https://gohugo.io/configuration/) |
| `params` 顶层 | `logo` `offline_search` `github_repo` `version` `page_width` `comments` | 主题读取的站点级选项 |
| `params.ui.*` | `navbar_enabled` `sidebar_width_min` `typography` `pager_types` | 外壳、导航与阅读界面 |
| `params.<运行时>` | `mermaid` `plantuml` `drawio` `markmap` | 各内容运行时自己的开关与端点 |

最小的可用配置只需要前两层：

```yaml {title="hugo.yml"}
title: 产品文档
baseURL: https://docs.example.com/
defaultContentLanguage: zh
enableGitInfo: true

module:
  imports:
    - path: github.com/pgsty/oink
  hugoVersion:
    extended: true
    min: 0.160.1

params:
  offline_search: true
  github_repo: https://github.com/example/product-docs
```

## 配置原则 {#principles}

- **主题默认保守，只写要改的键**。交互功能（本地搜索、图片缩放、评论、反馈、深浅色菜单）默认关闭，主题不替站点做策略决定。从一份「完整配置」逐条删减，比按需添加更容易留下用不上的键。
- **没有主题总开关**。不存在 `oink.enabled`，也没有 `params.oink.*` 命名空间，更没有在「Docsy 外壳」与「OINK 外壳」之间切换的选项。这一页查不到的开关即不存在。
- **非法值告警并回退到文档里写明的默认值**。`params.ui.typography: solarized` 报 `invalid params.ui.typography "solarized" (allowed: technical | system) -- using "technical"`，站点照常构建；`footer_style: thin`、`page_width: huge`、`section_index: grid` 同理。一个笔误因此只降级一个设置，而不是让 `hugo server` 下每个 URL 都返回 HTTP 500。它也不会因此静悄悄上线：所有发布关卡都带 `--panicOnWarning` 构建，那条警告在那里仍然是硬失败。
- **有一条警告保留取值而不是丢弃它**。主题读出的 `theme_color` 若在它自己的画布上低于 AA 正文对比度（4.5:1），颜色照常生效 —— 自定义画布或品牌强制色是作者的决定 —— 但会说出来，并打印可以让它闭嘴的 `ignoreLogs` id。把它当建议而不是拒绝：要么换个更深的颜色，要么加一行配置，在你做出选择之前发布关卡会一直卡住构建。只有解析不出来的十六进制才会被真正丢弃，那种情况和其他非法值一样回退到默认配色。

- **主题自身从不中断构建**。它的模板里没有任何 `errorf`：每个非法值都走上面的告警并回退。需要外部端点的功能——PlantUML、Draw.io、Algolia——缺少端点时告警并保持关闭，因为主题不会代为连接公共服务；残缺的上游署名告警并略去整条声明，因为半条读起来和完整的一模一样。真正会中断构建的来自 Hugo 而非主题：解析不到目标的内容引用，以及低于 `module.hugoVersion.min` 的 Hugo 版本。

## 页面级覆盖优先级 {#overrides}

Hugo 的 `.Param` 查找让大部分参数可以逐页覆盖，优先级从高到低：

1. 页面自己的 front matter；
2. 祖先分区 `_index.md` 里的 `cascade`（离页面越近越优先）；
3. 站点 `params`。

**写进 front matter 时要去掉 `ui.` 前缀。**
站点上的 `params.ui.scroll_spy` 在页面里就写成 `scroll_spy`。front matter 里出现 `ui:`
块的话，里面的键没有人读，也没有人报错——某个设置看着没生效时，先对照[页面参数](/zh/docs/write/frontmatter/)核一遍键名。

```yaml {title="content/docs/wide-reference.md"}
---
title: 宽版参考
page_width: wide
navbar_enabled: false
footer_style: slim
scroll_spy: true
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

覆盖用于真实的内容差异。逐页重建一套视觉系统的配置，会在主题升级后失配。

## 三项 goldmark 前置 {#goldmark}

Hugo **不会** 把主题模块的 `markup` 配置合并进站点，这三项必须写在站点自己的 `hugo.yml` 里，否则属性行、组件 HTML 与数学公式都不工作：

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

缺 `attribute.block` 时，`{.fields}` `{.steps}` `{caption=…}` 会原样显示成文字；缺 `passthrough` 时 `\(x\)` 不会变成公式；缺 `unsafe` 时步骤与卡片的结构会被转义。

`renderer.unsafe: true` 同时允许 Markdown 正文里的原始 HTML 通过，面向的是受信任的作者，不是投稿过滤器。内容来自不可信来源时，审查应放在提交流程里。

## 站点身份与品牌 {#identity}

Hugo 原生顶层键：

| 键 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | string | | 站名，显示在顶栏、`<title>` 与页脚 |
| `baseURL` | string | | 生产域名；子路径部署时带上路径段 |
| `copyright` | string | | 版权行的兜底值，`params.copyright` 未设时按 HTML 原样渲染 |
| `enableGitInfo` | boolean | false | 打开后才有「最后修改」与 commit 信息 |
| `enableRobotsTXT` | boolean | false | 生成 `robots.txt` |
| `enableEmoji` | boolean | false | 允许 `:smile:` 简码 |
{.fields meta="type default"}

主题参数：

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `params.logo` | string | icons/logo.svg | 品牌图标，可指向 `assets/` 资源或 `static/` 路径，见[品牌外观](/zh/docs/customize/brand/#logo) |
| `params.wordmark` | string | | 横向字标；设置后顶栏用它替代「图标 + 站名」 |
| `params.description` | string | | 站点描述，页面没有 `description` 时作为 meta 兜底 |
| `params.copyright` | string 或 map | | 字符串按 Markdown 渲染；map 接受 `authors` `from_year` `to_year`（`present` 表示今年） |
| `params.footer_center_info` | string | Powered by [Oink](https://oink.pgsty.com) | 页脚中间的行内 Markdown，设为空字符串即隐藏 |
| `params.author` | string 或 map | | RSS 的作者；map 接受 `name` 与 `email` |
| `params.ui.theme_color` | 字符串 | | `#rgb`/`#rrggbb` 十六进制色，为外壳的强调底着色；正文链接与行内代码不受影响 —— 见[品牌外观](/zh/docs/customize/brand/#theme-color) |
| `params.ui.theme_color_dark` | 字符串 | 派生 | 强调色的暗色一半；省略时从 `theme_color` 提亮派生，直到在暗色画布上达到 AA |
{.fields meta="type default"}

favicon 没有参数：主题按约定名扫描 `static/`（`favicon.ico` `favicon.svg` `favicon-NxN.png` `apple-touch-icon.png` `apple-touch-icon-NxN.png`），见[品牌外观](/zh/docs/customize/brand/#favicon)。

## 外壳类型与栏目根 {#shell}

外壳按 **页面 type** 生效，不看路径。文档可以放在任意目录，再用 cascade 给它 `type: docs`。

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `params.ui.shell_types` | list | [docs, book, blog, swagger] | 哪些 type 使用带侧栏的阅读外壳，见[布局与页面类型](/zh/docs/customize/layout/#shell-types) |
| `params.ui.docs_section` | string | docs | 文档栏目的根目录名，只用于导航解析 |
| `params.ui.blog_section` | string | blog | 博客栏目的根目录名 |
| `params.ui.docs_sidebar_root` | enum | section | `section` 时 docs 页的侧栏根是文档栏目；`home` 时是站点首页。非法值告警并回退 |
| `params.ui.quick_links` | list | [docs_section, blog_section] | 命令面板空查询时列出的顶层菜单 identifier，见[命令面板](/zh/docs/customize/panel/) |
| `params.ui.sidebar_root_enabled` | boolean | true | 允许子分区用 `sidebar_root_for: self` 自成一棵侧栏树 |
| `params.ui.sidebar_root_menu` | boolean | true | 侧栏顶部显示栏目切换器；只有一个入口时退化为普通链接 |
| `params.ui.section_index` | enum | list | 栏目首页子页列表样式：`list` 或 `cards`，可按分区覆盖 |
| `params.ui.section_index_columns` | integer | 2 | `section_index: cards` 时的列数 |
{.fields meta="type default"}

## 博客 {#blog}

七个键决定博客栏目的样子。它们作用于 `params.ui.blog_section` 指定的栏目，每一个都能通过博客根目录的 front matter 或 `cascade` 按栏目覆盖。

| 参数 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `params.ui.featured_image` | enum | none | 文章正文里怎么渲染自己的题图：`none` 不渲染，`banner` 在标题上方框出一张 16:9 的图，`wash` 把它铺在文章头部背后、只留十分之一的不透明度，`hero` 把它作为外壳自己的通栏背景铺开并把开头下移——单页与栏目列表页都一样。用的就是这一页在卡片与 `og:image` 里已经在用的那张图，两处不会打架。没有题图的文章在任何模式下都不渲染任何东西 |
| `params.ui.blog_index` | enum | list | 博客栏目列表页的形态：`list` 是行列表，`cards` 是内容卡片网格，卡片带 16:9 题图、日期与栏目行，以及三行摘要，`table` 是每篇一行的紧凑表格——整个栏目一次列全，不按年分组，也不分页。按年分组、分页与 `manual_link` 在 `list` 与 `cards` 下行为一致 |
| `params.ui.blog_index_columns` | integer | 3 | `blog_index: cards` 时的列数；md 到 xl 之间恒为两列，md 以下一列，不受此值影响 |
| `params.ui.blog_index_size` | integer | 12 | `list` 与 `cards` 索引每页的文章数；`table` 形态总是列全。12 能被 2、3、4 整除，卡片行不会缺角 |
| `params.ui.blog_index_toggle` | boolean | false | 让读者从索引工具栏在列表、卡片、表格之间切换。默认关闭，因为它会把三种形态都放进文档——隐藏的那些不加载图片，但标记是真实存在的 |
| `params.ui.toc_style` | enum | fixed | 右栏的呈现方式：`fixed` 是钉在视口上的面板，`flow` 是跟随内容流、从文章开头处开始、滚动后才钉住的宽面板 |
| `params.ui.toc_taxonomies` | boolean | true | 右栏的分类词云。既没有目录也没有词云的右栏不会渲染任何东西 |
{.fields meta="type default"}

作者与系列是 taxonomy 而不是参数，见[分类法](/zh/docs/customize/taxonomy/#authors)与[写博客](/zh/docs/write/blog/)。

## 顶栏与页脚 {#navbar-footer}

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `params.ui.navbar_enabled` | boolean | true | 是否渲染站点顶栏，可用页面顶层 `navbar_enabled` 覆盖，见[导航与菜单](/zh/docs/customize/navigation/#navbar) |
| `params.ui.navbar_autohide` | boolean | false | 顶栏收到视口上方，指针进入唤醒区才出现；小于 768px 或粗指针时不生效 |
| `params.ui.footer_style` | enum | fat | `fat` 多列网格 + 版权行，`slim` 只有版权行，`none` 不渲染。非法值告警并回退 |
| `params.ui.dark_mode` | boolean 或 map | false | `true` 同时启用深色调色板与主题控件；只要控件写 `dark_mode: { show_menu: true }` |
| `params.ui.breadcrumb` | boolean | true | 面包屑；设为 `false` 关闭。顶层分区本来就省略只有一级的面包屑 |
| `params.ui.page_context_menu.enable` | boolean | true | 标题旁的页面操作拆分按钮 |
| `params.ui.page_context_menu.assistant_links` | boolean | false | 显示「在 ChatGPT / Claude 中打开」；读者点击时完整 URL 会离开本站 |
| `params.ui.page_context_menu.links` | list | [] | 自定义外部操作，`url` 支持 `{url}` `{title}` `{markdown_url}` 占位符 |
| `params.ui.github_stars` | string 或 number | | 顶栏 GitHub 徽标上的星数，本地常量，不发请求 |
| `params.ui.alt_site` | map | | 单语言站在页脚显示的姊妹站链接，必填 `label` 与绝对 `http(s)` 的 `url` |
{.fields meta="type default"}

胖页脚的列数据来自 `data/footer/<语言>.yaml`，不是参数，见[导航与菜单](/zh/docs/customize/navigation/#footer)。

## 侧栏 {#sidebar}

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `params.ui.sidebar_menu_compact` | boolean | true | 只展开当前分支与邻近条目 |
| `params.ui.sidebar_menu_foldable` | boolean | true | 允许读者展开/折叠分区 |
| `params.ui.sidebar_menu_truncate` | integer | 2000 | 一个分区最多渲染的条目数，超出截断 |
| `params.ui.sidebar_cache_limit` | integer | 500 | 站点页数超过它就复用共享导航标记，active 状态改由浏览器还原 |
| `params.ui.sidebar_width_min` | integer | 220 | 桌面端拖拽调宽的下限，像素 |
| `params.ui.sidebar_width_max` | integer | 480 | 拖拽调宽的上限，像素 |
| `params.ui.sidebar_item_overflow` | enum | ellipsis | `ellipsis` 长标题省略，`wrap` 换行 |
| `params.ui.sidebar_icon_policy` | enum | all | 图标密度：`all` 全部、`groups` 只有根与有子页的节点、`none` 全不显示。非法值警告并回落 `all` |
| `params.ui.sidebar_expand_levels` | integer | 2 | 默认展开的树层级数 |
| `params.ui.sidebar_headings` | boolean 或 integer | false | 只对 `type: book` 生效：在侧栏当前行下展开标题分支；整数取值 2–4，`true` 等于 2 |
| `params.ui.sidebar_enabled` | boolean | true | 左侧栏；设为 `false` 关掉，通常按页面而不是按站点设置 |
| `params.ui.taxonomy_icons` | map | | 按分类复数名指定右栏分组图标，例如 `tags: fa-solid fa-tags` |
{.fields meta="type default"}

侧栏怎么用见[布局与页面类型](/zh/docs/customize/layout/#sidebar)；目录树本身由 `content/` 的结构决定，见[组织内容](/zh/docs/write/organize/)。

## 目录 TOC {#toc}

右栏大纲的层级由 Hugo 原生配置决定，主题只控制跟踪行为：

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `markup.tableOfContents.startLevel` | integer | 2 | Hugo 原生：收录的最高标题级别 |
| `markup.tableOfContents.endLevel` | integer | 3 | Hugo 原生：收录的最低标题级别 |
| `params.ui.scroll_spy` | boolean | false | 滚动位置跟踪；设为 `true` 打开活动项高亮 |
{.fields meta="type default"}

单页隐藏大纲用 front matter `notoc: true`，见[页面参数](/zh/docs/write/frontmatter/)。

## 翻页与页尾 {#page-end}

页尾组件顺序固定为分享 → 反馈 → 页面信息 → 反向链接 → 翻页 → 评论，六者独立开关。

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `params.ui.share` | list | [] | 页尾分享目标，按给定顺序渲染，取值来自 `x` `bluesky` `mastodon` `facebook` `linkedin` `reddit` `hackernews` `telegram` `whatsapp` `line` `pinterest` `weibo` `chatgpt` `claude` `email` `copy`。为空则不出现分享栏。每一项都是纯粹的 intent 链接——没有 SDK、没有 iframe、没有第三方脚本、没有分享计数，见[写博客](/zh/docs/write/blog/#share)。未知目标告警并丢弃 |
| `params.ui.pager_types` | list | [docs, book, blog] | 哪些 type 显示上一页/下一页；单页用 front matter `pager: false` 退出。未知 type 告警并丢弃 |
| `params.ui.annotation` | boolean | true | 正文末尾的「最后修改」与出处区块；上游署名由页面的 `upstream_link` 一族键驱动，见[页面参数](/zh/docs/write/frontmatter/#upstream) |
| `params.ui.backlinks` | boolean | false | 在页面信息与翻页器之间列出链接到本页的页面，构建时从普通链接派生，见[导航与菜单](/zh/docs/customize/navigation/#backlinks) |
| `params.ui.translation_notice` | 语言代码或 false | false | 权威版本的语言代码，译文页据此显示一条指回原文的说明；页面写 `translation_notice: false` 退出 |
| `params.ui.reading_time` | boolean | false | 页面标题下显示阅读时长 |
| `params.ui.book_draft_banner` | boolean | false | Book 草稿页开头额外加一条横幅 |
{.fields meta="type default"}

## 搜索与命令面板 {#search}

本地搜索默认关闭；打开后命令面板才会出现（顶栏放大镜、{{< kbd "Cmd/Ctrl" "K" >}}、`/`、`\`）。

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `params.offline_search` | boolean | false | 生成每语言一份本地索引并启用命令面板，见[全文检索](/docs/customize/search/) |
| `params.offline_search_on_serve` | boolean | true | `hugo server` 预览时也构建索引，预览行为与线上一致；站点极大时设 `false` 跳过以加快本地重建 |
| `params.offline_search_index` | enum | content | 索引范围，逐级累加：`title` `heading` `summary` `content`。非法值告警并使用 `content` |
| `params.offline_search_summary_length` | integer | 70 | `summary` 档摘录截断的字数 |
| `params.offline_search_max_results` | integer | 10 | 结果条数上限，同时约束 Lunr 与中文子串兜底 |
| `params.ui.landing_search` | boolean | true | `layout: landing` 页面是否保留搜索入口 |
| `params.ui.command_palette.commands` | list | [] | 自定义命令，每条二选一：`url` 或内置 `action`；见[命令面板](/zh/docs/customize/panel/#custom-commands) |
| `params.gcs_engine_id` | string | | Google 可编程搜索引擎 ID，启用后引入外部服务 |
| `params.search.algolia` | map | | Algolia DocSearch，必须显式给出 `appId` `apiKey` `indexName`，缺一则告警并保持 DocSearch 关闭 |
{.fields meta="type default"}

自定义命令的每条记录只接受 `id` `title` `description` `icon` `keywords` `url` `action` 七个键；`id` 必须匹配 `^[a-z][a-z0-9_-]*$`，且不能与内置动作 ID 重名。分语言的标题写在 `languages.<lang>.params.ui.command_palette.commands`。

## 键盘 {#keyboard}

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `params.ui.keyboard_nav` | boolean | true | 单键导航（WASD/方向键走树、j/k 跳标题、q/e 翻页、面板与外壳开关）。设为 `false` 后运行时不进包，见[键盘导航](/docs/customize/keyboard/) |
{.fields meta="type default"}

## 图片缩放 {#image-zoom}

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `params.ui.image_zoom` | boolean | false | 允许正文图片点击放大；页面用 front matter `image_zoom` 覆盖。非布尔告警并回退 |
{.fields meta="type default"}

哪些图片会成为缩放候选见[图片](/zh/docs/components/image/)。

## 字体排版 {#typography}

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `params.ui.typography` | enum | technical | `technical` 用随主题分发的 Inter / Chakra Petch / IBM Plex Mono；`system` 只用平台字体栈，不请求品牌字体。非法值告警并回退 |
| `params.page_width` | enum | normal | 外壳整体宽度：`normal` `wide` `full`，可逐页覆盖 |
| `params.reading_width` | enum | normal | Book 页正文的阅读行宽：`slim` `normal` `wide`，不影响外壳 |
{.fields meta="type default"}

自定义字体与配色走 SCSS 入口而不是 YAML，见[品牌外观](/zh/docs/customize/brand/#fonts)。

## 评论与反馈 {#comments-feedback}

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `params.comments.enable` | boolean | false | 站点级评论开关，页面用 front matter `comments` 覆盖，见[启用评论](/zh/docs/admin/comments/) |
| `params.comments.type` | string | giscus | 目前只有 `giscus` 会真正渲染 |
| `params.comments.giscus.repo` | string | | 承载讨论的 GitHub 仓库，必填 |
| `params.comments.giscus.repoId` | string | | 仓库 ID，必填 |
| `params.comments.giscus.category` | string | | 讨论分类名，必填 |
| `params.comments.giscus.categoryId` | string | | 讨论分类 ID，必填 |
| `params.comments.giscus.mapping` | string | pathname | 页面与讨论的映射方式 |
| `params.comments.giscus.term` | string | | `mapping` 为 `specific` 或 `number` 时的讨论标题或编号；不设置时不输出这个属性 |
| `params.comments.giscus.strict` | string | 0 | 严格标题匹配 |
| `params.comments.giscus.reactionsEnabled` | string | 1 | 显示主贴表情 |
| `params.comments.giscus.emitMetadata` | string | 0 | 向父页面发送讨论元数据 |
| `params.comments.giscus.inputPosition` | string | top | 输入框在评论列表上方还是下方 |
| `params.comments.giscus.theme` | string | auto | giscus 主题，`auto` 跟随站点深浅色 |
| `params.comments.giscus.lightTheme` | string | light | 浅色模式下使用的 giscus 主题或自定义 CSS URL |
| `params.comments.giscus.darkTheme` | string | dark | 深色模式下使用的 giscus 主题或自定义 CSS URL |
| `params.comments.giscus.loading` | string | lazy | iframe 加载策略 |
| `params.comments.giscus.lang` | string | 按站点语言推导 | giscus 界面语言。不设置时中文站解析为 `zh-CN` / `zh-TW` / `zh-HK`，其它语言取主语言代码，giscus 不支持则回落 `en` |
| `params.comments.giscus.ariaLabel` | string | Comments | 评论区容器的 `aria-label`；默认值是英文，多语言站点需按语言各写一份 |
| `params.comments.giscus.errorMessage` | string | Comments could not be loaded. | 加载失败时显示的文字；默认值是英文，多语言站点需按语言各写一份 |
| `params.ui.feedback.enable` | boolean | false | 页尾「这页有帮助吗」两个按钮；无后端，有 `gtag` 时记录结构化事件 |
| `params.ui.feedback.reasons` | boolean | true | 选「否」后展开四个可选原因 |
{.fields meta="type default"}

四个 giscus 必填项缺任意一个，评论区就不渲染：不报错，也不出现。

## 仓库链接与页面信息 {#repository}

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `params.github_repo` | string | | 内容仓库 URL，解析「编辑本页」「查看历史」「新建子页」「提文档 issue」，见[仓库与页面信息](/zh/docs/customize/repository/) |
| `params.github_project_repo` | string | github_repo | 产品仓库 URL，用于「提项目 issue」与顶栏 GitHub 入口 |
| `params.github_branch` | string | main | 编辑链接指向的分支 |
| `params.github_subdir` | string | | 内容站在 monorepo 里的子目录 |
| `params.path_base_for_github_subdir` | string 或 map | | 源路径重写；map 形式接受 `from` 与 `to` |
| `params.github_url` | — | — | 已移除，改写 `params.github_repo`。那份负责提示替代键名的迁移登记表已经删掉，所以旧键现在只是一个没人读的键 |
| `params.ui.lastmod_commit` | enum | subject | 「最后修改」后面附什么：`subject` commit 标题、`hash` 短哈希、`none` 不附。非法值告警并回退 |
| `params.images` | string 数组 | — | 站点级社交卡片：页面自己没有封面时用它填 `og:image`；只进元数据，不会渲染成列表缩略图 |
| `params.default_featured` | — | — | 已移除，改写 `params.images` 或栏目 `cascade` 里的 `images`。同上，旧键现在只是一个没人读的键 |
{.fields meta="type default"}

## 内容运行时 {#runtimes}

Mermaid、KaTeX、ECharts、Infographic、Asciinema、Swagger UI 与 Redoc 按内容自动检测，只有用到它们的页面、且只在该页的 HTML 输出里加载，没有站点开关。需要开关或外部端点的只有这几个：

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `params.markmap` | boolean | false | 站点级启用思维导图围栏，见[思维导图](/docs/components/markmap/) |
| `params.mermaid` | map | | 透传给 `mermaid.initialize()` 的配置；键名全小写，深色模式自动覆盖 `theme` |
| `params.plantuml.enable` | boolean | false | 启用 PlantUML 围栏，见 [PlantUML](/zh/docs/components/plantuml/) |
| `params.plantuml.svg_image_url` | string | | PlantUML 服务的 SVG 端点，启用时必填，缺失则告警并保持 PlantUML 关闭 |
| `params.plantuml.svg` | boolean | | 用内联 SVG 而不是 `<img>` 渲染 |
| `params.drawio.enable` | boolean | false | 启用 `.drawio.svg` 图片的编辑按钮，见 [Draw.io](/zh/docs/components/drawio/) |
| `params.drawio.drawio_server` | string | | Draw.io 编辑器地址，启用时必填，缺失则告警并保持 Diagrams.net 关闭 |
| `params.highlight_classes` | boolean | true | 代码高亮输出 Chroma class；设 `false` 回到 Hugo 的行内样式 |
| `params.ui.code_copy` | boolean | true | 代码块的复制按钮；设为 `false` 全局去掉，围栏上的 `copy=` 仍然优先 |
{.fields meta="type default"}

数学公式不需要参数，只需要 [`passthrough` 前置](#goldmark)。

## 输出格式 {#outputs}

主题声明了两种自定义输出格式，但 **不替站点打开**：要哪种就在 `outputs` 里写哪种。

```yaml {title="hugo.yml"}
outputs:
  home: [HTML, markdown, LLMS]
  page: [HTML, markdown]
  section: [HTML, RSS, print, markdown]
```

| 格式 | 产物 | 说明 |
| --- | --- | --- |
| `HTML` | `index.html` | 交互形态，必选 |
| `markdown` | `index.md` | 每页的纯 Markdown 版本，页面操作里的「复制 Markdown」「查看源码」依赖它，见 [Agent 支持](/zh/docs/customize/agents/) |
| `LLMS` | `llms.txt` | 主题声明的纯文本格式，通常只挂在 `home` |
| `print` | `_print/index.html` | 主题声明的整分区打印页，见[打印支持](/zh/docs/customize/print/) |
| `RSS` | `index.xml` | Hugo 原生，挂在 `section` 上让每个栏目都有订阅源 |

打印输出的两个参数：

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `params.print.toc` | boolean | true | 打印页开头生成目录；设为 `false` 不生成 |
| `params.print.section_break_wordcount` | integer | 50 | 打印页中一节多少词以上才另起一页 |
{.fields meta="type default"}

## 多语言与版本 {#languages-versions}

语言用 Hugo 原生的 `languages` 块定义，主题只读它建立的翻译关系：

| 键 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `defaultContentLanguage` | string | en | 不带路径前缀的首要语言 |
| `languages.<lang>.label` | string | | 该语言的自称，显示在语言菜单里 |
| `languages.<lang>.locale` | string | | 完整 locale，用于 `<html lang>` 与 SEO |
| `languages.<lang>.weight` | integer | | 语言顺序，也是点击语言图标时的循环顺序 |
| `languages.<lang>.title` | string | | 该语言的站名 |
| `languages.<lang>.languageDirection` | string | ltr | RTL 语言设为 `rtl` |
{.fields meta="type default"}

写作侧的对等文件、锚点对齐与缺译回退见[多语言](/zh/docs/customize/i18n/)。

版本相关参数：

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `params.version` | string | | 当前站点变体的版本标识（不一定是 Git ref），见[多版本](/zh/docs/customize/versions/) |
| `params.version_menu` | string | Version | 版本菜单的标题 |
| `params.version_menu_pagelinks` | boolean | | 切版本时先尝试目标站点的同一路径 |
| `params.versions` | list | | 版本条目：`version` `url` `kind`，`name: '---'` 是分隔线 |
| `params.archived_version` | boolean | | 顶部显示「这是归档版本」横幅 |
| `params.url_latest_version` | string | | 归档横幅里指向最新版的链接 |
| `params.time_format_blog` | string | 2006-01-02 | 博客日期格式，按语言覆盖 |
| `params.time_format_default` | string | 2006-01-02 | 其它日期格式，按语言覆盖 |
{.fields meta="type default"}

## 其它 {#misc}

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `taxonomies` | map | | Hugo 原生：启用 `tag: tags` / `category: categories`，见[分类体系](/zh/docs/customize/taxonomy/) |
| `params.taxonomy.page_header` | list | | 只在文章头部显示这几种分类；不设则显示全部 |
| `services.googleAnalytics.id` | string | | Hugo 原生：分析脚本只在生产构建注入，见[分析与 SEO](/zh/docs/admin/analytics/) |
| `module.hugoVersion.min` | string | 0.160.1 | 主题声明的 Hugo 下限，低于它构建失败 |
| `module.hugoVersion.extended` | boolean | true | 必须是 Hugo Extended（要编译 SCSS） |
{.fields meta="type default"}

## 通过生成式 Schema 获得编辑器补全 {#editor-schema}

主题在其 `schema/` 目录下携带两个生成的 JSON Schema：校验站点 `hugo.yaml` 的
`site-params.schema.json` 与校验页面 front matter 的
`front-matter.schema.json`。它们是主题自身 `hugo.yaml` 默认值（注释即悬浮文档）
与参数扫描注册表的投影；主题 CI 会重新生成并在漂移时失败，因此它们永远不会与你
pin 的主题版本相左。

配合 VS Code YAML 扩展，在设置中映射站点 Schema：

```json {title=".vscode/settings.json"}
{
  "yaml.schemas": {
    "https://raw.githubusercontent.com/pgsty/oink/main/schema/site-params.schema.json": "hugo.yaml"
  }
}
```

把 URL 里的 `main` 换成你的发布 tag，与 `go.mod` 的 pin 保持一致。front matter
补全取决于你的 Markdown 工具链，用同样方式指向 `front-matter.schema.json` 即可。
front-matter Schema 刻意不带类型约束，因为 `share`、`theme_color` 这类键在常规
类型之外还接受裸布尔退出。

## 验证配置变更 {#verify}

改完配置跑一次严格构建：

```bash
hugo --printPathWarnings --panicOnWarning
```

输出 `Total in …` 且没有 ERROR / WARN 才算通过。常见报错与原因：

| 报错片段 | 原因 |
| --- | --- |
| `invalid params.ui.typography` | 预设只有 `technical` 与 `system` |
| `invalid footer_style … (allowed: fat \| slim \| none)` | 页脚形态写错，报错会指出是哪个页面 |
| `invalid page_width … (allowed: normal \| wide \| full)` | 页宽写错 |
| `invalid params.ui.section_index … (allowed: list \| cards)` | 栏目首页样式写错 |
| `invalid params.offline_search_index` | 索引范围只有 `title` `heading` `summary` `content` |
| `params.plantuml.enable requires an explicit params.plantuml.svg_image_url` | 开了 PlantUML 却没给端点 |
| `params.drawio.enable requires an explicit params.drawio.drawio_server` | 开了 Draw.io 却没给服务地址 |
| `params.search.algolia requires explicit appId, apiKey, and indexName` | Algolia 三项必须齐全 |
| `params.ui.image_zoom must be a boolean` | 写成了字符串 `"true"` |
| `theme_color … is not a #rgb or #rrggbb hex color` | 值不是十六进制颜色，保留默认配色 |
| `theme_color … reads at about N:1 against the theme's … canvas` | 建议性告警：颜色照常生效，消息里带着让它闭嘴的 id |
| `theme_color_dark … has no theme_color to pair with` | 只设了暗色一半而没有有效的 `theme_color`；该值被忽略，两种模式都保留默认配色 |
| `command … must define exactly one of url or action` | 自定义命令同时给了 `url` 和 `action`，或两个都没给 |
| `invalid params.ui.sidebar_icon_policy …; using all` | 只是警告，但取值拼错了 |

配置改动还要至少验证三件事：每种语言各一页、缺译页的回退、生产 `baseURL` 下的链接（子路径部署容易漏）。

主题声明的 Hugo 下限是 `0.160.1`，当前验证版本是 `0.164.0`。改动配置后按这两个版本各构建一次，可以及早发现只在新版本可用的特性：

```bash
# 下限版本的二进制
/path/to/hugo-0.160.1 --printPathWarnings --panicOnWarning
# 当前验证版本
hugo --printPathWarnings --panicOnWarning
```

下限版本写在主题的 `hugo.yaml` 与 `theme.toml` 里，站点自己的 `module.hugoVersion.min` 应与它一致。

## 相关 {#related}

- [品牌外观](/zh/docs/customize/brand/) — 站名、Logo、配色、字体
- [导航与菜单](/zh/docs/customize/navigation/) — 顶栏菜单、页面操作、页脚
- [布局与页面类型](/zh/docs/customize/layout/) — 外壳、侧栏、目录
- [页面参数](/zh/docs/write/frontmatter/) — front matter 全表
- [排错与检查](/zh/docs/admin/troubleshooting/) — 构建失败时怎么定位
