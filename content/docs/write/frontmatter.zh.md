---
title: 页面参数
linkTitle: 页面参数
description: 查阅 OINK 读取的每个 front matter 键及其类型、默认值与效果，用来调整单个页面或整个分区。
weight: 30
search_keywords: [页面参数, front matter, 前置元数据, page parameters, cascade, 页面级覆盖, 参数表]
---

front matter（前置元数据）让单个页面，或通过 `cascade` 让整个分区，偏离 `hugo.yml` 里的全站设置：给一张参考大表加宽版面、让落地页不显示翻页器、只在博客文章下开评论。下面按作用分组列出 OINK 读取的全部页面键。Hugo 自身的字段（`slug`、`url`、`build`、`sitemap`、`expiryDate` 等）照常可用，含义见 [Hugo 文档](https://gohugo.io/content-management/front-matter/)；站点参数见[配置总览](/zh/docs/customize/config/)。

## 页面键的写法 {#how-to-read}

**页面键就是站点键去掉 `params.` 与 `ui.` 前缀，写在 front matter 顶层。** 站点的 `params.ui.section_index` 在页面上写作 `section_index`，`params.page_width` 写作 `page_width`。不要把页面键放进 `ui:` 段：主题既不读取它，也不会告警，设置就这样悄无声息地失效了。某个键看起来没起作用时，先对照下面的表格核对键名和位置。

```yaml {title="content/docs/wide-reference.zh.md"}
---
title: 兼容性矩阵
weight: 40
page_width: wide
footer_style: slim
image_zoom: true
section_index: list
---
```

分区的 `cascade` 用同样的键名、多缩进一层，作用于其下的每一个页面：

```yaml {title="content/docs/reference/_index.zh.md"}
cascade:
  pager: false
  section_index: list
```

同一个键在多处设置时，越具体的越优先：

1. 页面自己的 front matter；
2. 离页面最近的那一层 `cascade`；
3. `hugo.yml` 里的站点参数。

「默认」列写着「站点值」的键，未设置时取同名站点参数。非法值会告警，页面改用表中的默认值，规则见[配置总览](/zh/docs/customize/config/#principles)；只有回退方式与此不同的键，表里才单独注明。已改名或已退役的键不在表中：构建遇到它们时会告警，替代写法见[版本升级](/zh/docs/admin/upgrade/)。

## 基本 {#basic}

每个页面都会用到其中几个，`title` 是唯一不能省的。

| 键 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `title` | 字符串 | — | 页面大标题、浏览器标题与搜索结果标题。每页必写 |
| `linkTitle` | 字符串 | `title` | 侧栏、面包屑导航、翻页器与卡片里的短名 |
| `description` | 字符串 | — | 一句话摘要，用于栏目卡片、搜索摘要与 `meta description`；博客页还会把它渲染成正文上方的导语 |
| `weight` | 整数 | `0` | 同级排序，建议用 10 的倍数；`0`（不写）排在所有写了 weight 的页面之后，见[组织内容](/zh/docs/write/organize/#weight) |
| `draft` | 布尔 | `false` | 草稿不会进入构建产物，用 `hugo server -D` 预览，见[编写页面](/zh/docs/write/pages/#drafts) |
| `date` | 日期 | — | 博客日期与发布页的排序依据。日期在未来的页面默认不构建 |
| `lastmod` | 日期 | Git 提交时间 | 页尾的「最后修改」时间。站点开启 `enableGitInfo` 后由 Git 提供，不必手写 |
| `aliases` | 字符串数组 | — | 重定向到本页的旧路径，页面搬家时使用 |
| `type` | 字符串 | 顶层目录名 | 决定模板与外壳：`docs`、`book`、`blog`、`swagger`、`expo`，见[组织内容](/zh/docs/write/organize/#type-and-shell) |
| `layout` | 字符串 | — | 为单个页面指定布局：`landing` 或 `releases` |
| `cascade` | 映射 | — | 把下面这些键下推给整棵子树 |
{.fields meta="type default"}

## 侧栏与导航 {#navigation}

页面要换个位置出现在侧栏、干脆不出现，或者栏目首页要换一种方式列出子页时，用这一组。它们如何配合见[组织内容](/zh/docs/write/organize/)。

| 键 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `icon` | Font Awesome class 对 | — | 侧栏、栏目卡片与搜索结果里的图标，例如 `fa-solid fa-rocket` |
| `toc_hide` | 布尔 | `false` | 把本页及其整棵子树移出侧栏与翻页序列；内容树与显式导航树都遵循 |
| `hide_summary` | 布尔 | `false` | 不出现在所属栏目的子页索引里 |
| `sidebar_divider` | 布尔 | `false` | 把条目变成不带链接的分组标题，翻页器会跳过它；这样标记的分区仍然列出子页。不需要自身页面的分组改用 `build.render: never`（见[只分组、不发布页面](/zh/docs/write/organize/#group-only)） |
| `sidebar_expanded` | 布尔 | blog 栏目为 `true`，其余为 `false` | 这个栏目在侧栏里默认展开 |
| `sidebar_root_for` | `self` / `children` | — | 让这个栏目成为侧栏树的根；`self` 连同栏目首页，`children` 只含后代。其它取值告警并忽略 |
| `sidebar_root_link_self` | 布尔 | `true` | 根那一行链接到栏目自身；`false` 改为链接父栏目 |
| `sidebar_root_menu` | 布尔 | `true` | 顶层栏目或嵌套自根是否出现在侧栏的根切换器里。被排除的根在你身处其中时仍显示为当前位置 |
| `toc_root` | 布尔 | `false` | 侧栏根是站点首页时，把这个顶层栏目整个移出导航树与翻页序列 |
| `manual_link` | URL | — | 让侧栏与栏目索引里的这一行指向别处 |
| `manual_link_relref` | 内容引用 | — | 同上，但用 `relref` 解析；目标不存在时构建失败 |
| `manual_link_title` | 字符串 | `title` | 手动链接的悬停标题 |
| `manual_link_target` | 字符串 | — | 链接目标，例如 `_blank`；主题会自动补上 `noopener` |
| `no_list` | 布尔 | `false` | 栏目首页不列出子页 |
| `simple_list` | 布尔 | `false` | 子页索引改为紧凑的项目符号列表 |
| `section_index` | `list` / `cards` | 站点值（`list`） | 子页索引的样式 |
| `section_index_columns` | 整数 | `2` | 卡片样式的列数 |
| `notoc` | 布尔 | `false` | 隐藏右栏的页面目录 |
| `pager` | 布尔 | 由 `params.ui.pager_types` 决定 | `false` 去掉本页的上一页 / 下一页。非布尔值告警，页面沿用其类型的设置 |
| `navbar_enabled` | 布尔 | 站点值（`true`） | 本页是否渲染顶部导航栏 |
| `navbar_autohide` | 布尔 | 站点值（`false`） | 在使用鼠标的桌面屏幕上隐藏顶部导航栏，指针接近顶边或键盘焦点进入时再显示。首页不采用站点值，只认自己 front matter 里的设置 |
| `breadcrumb` | 布尔 | 由外壳决定 | 本页是否渲染面包屑导航；Docs 与 Book 默认开启，Blog 默认关闭 |
| `theme_color` | 字符串 | 站点值 | 本页的强调色，`#rgb` 或 `#rrggbb`。写在分区根的 `cascade` 里，就给整个分区一个专属颜色，见[品牌外观](/zh/docs/customize/brand/#theme-color) |
| `theme_color_dark` | 字符串 | 派生 | 暗色模式下的强调色。上层 cascade 设了这个键时，只覆盖 `theme_color` 的页面会继承 cascade 的暗色，所以两个要一起写。`theme_color: false` 让页面不再继承分区色 |
| `page_context_menu` | 布尔 | 站点值（`true`） | 标题行的页面操作菜单：复制 Markdown、编辑本页、打印等 |
| `page_context_menu.assistant_links` | 布尔 | 站点值（`false`） | ChatGPT 与 Claude 两项，写成 `page_context_menu: { assistant_links: false }`。页面只能关掉它们，站点没开时页面无法单独开启 |
{.fields meta="type default"}

## 页面外壳 {#shell}

某一页需要换一副外框时用这一组：更宽的正文栏、去掉侧栏、更薄的页脚。站点级默认值及其效果见[布局与页面类型](/zh/docs/customize/layout/)。

| 键 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `page_width` | `normal` / `wide` / `full` | `normal` | 正文栏宽度 |
| `reading_width` | `slim` / `normal` / `wide` | `normal` | Book 页的阅读行宽，只对 `type: book` 生效 |
| `footer_style` | `fat` / `slim` / `none` | 站点值（`fat`） | 页脚形态 |
| `body_class` | 字符串 | — | 追加到 `<body>` 上的 class，供站点自己的 CSS 使用 |
| `reading_time` | 布尔 | 站点值 | 本页是否显示阅读时长 |
| `sidebar_enabled` | 布尔 | `true` | `false` 隐藏本页的左侧栏 |
| `scroll_spy` | 布尔 | 站点值 | 可以写，但不起作用：页面目录始终高亮你正在读的标题 |
| `keyboard_nav` | 布尔 | 站点值（`true`） | 单键键盘导航，见[键盘导航](/zh/docs/customize/keyboard/) |
| `lastmod_commit` | `subject` / `hash` / `none` | `subject` | 「最后修改」后面显示提交标题、提交哈希，或什么都不显示 |
| `sidebar_expand_levels`、`sidebar_menu_compact`、`sidebar_menu_foldable`、`sidebar_item_overflow` | 同站点参数 | 站点值 | 逐页覆盖侧栏行为，取值见[配置总览](/zh/docs/customize/config/) |
| `sidebar_width_min`、`sidebar_width_max` | 正整数 | 站点值（`220` / `480`） | 本页桌面侧栏拖拽宽度的上下限；下限大于上限时告警并恢复站点值 |
| `code_copy` | 布尔 | 站点值（`true`） | 本页代码块默认是否带复制按钮；围栏自己写的 `copy=` 优先 |
| `rich_copy` | 布尔 | 站点值（`true`） | 正文选区粘贴到富文本编辑器时的排版 HTML 复制 |
| `toc_style` | `fixed` / `flow` | 站点值（`fixed`） | 固定的右栏面板，或从正文流中开始的较宽右栏 |
| `toc_taxonomies` | 布尔 | 站点值（`true`） | 分类词云是否与页面目录一起进入右栏 |
| `taxonomy_icons` | 映射 | 站点值 | 为本页（或经 `cascade` 为整个分区）覆盖各分类法的图标 |
{.fields meta="type default"}

## 搜索 {#search}

想让某个查询先命中正确的页面，或者把某页完全排除在搜索之外时，用这一组。指南见[全文检索](/zh/docs/customize/search/)。

| 键 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `search_keywords` | 字符串或字符串数组 | — | 附加检索词：同义词、缩写、其它语言的叫法 |
| `search_boost` | 正数 | `1.0` | 排序乘数，最终得分是文本匹配分乘以该值。非数字、无穷大、零或负值回退为 `1.0` |
| `search_exclude` | 布尔 | `false` | 不进入本地搜索索引 |
{.fields meta="type default"}

## 输出形态 {#outputs}

某页不需要 Markdown 副本，或不该进入整章打印时，用这一组。指南见 [Agent 支持](/zh/docs/customize/agents/)（`.md` 与 `llms.txt`）和[打印支持](/zh/docs/customize/print/)。

| 键 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `outputs` | 字符串数组 | 站点 `outputs` | 本页生成哪些输出格式；写 `[HTML]` 就不再生成 `.md` |
| `no_print` | 布尔 | `false` | 不进入整章、整书的打印视图 |
{.fields meta="type default"}

## 页尾：评论、反馈与出处 {#page-end}

这一组决定正文之后跟着什么。顺序固定：分享栏、反馈、出处、翻页器、评论，见[编写页面](/zh/docs/write/pages/#page-end)。

| 键 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `comments` | 布尔 | 站点 `params.comments.enable`（`false`） | 本页是否显示 giscus 评论区，见[启用评论](/zh/docs/admin/comments/) |
| `feedback` | 布尔或映射 | 站点 `params.ui.feedback`（关） | 「这页有帮助吗？」反馈组件；映射形态支持 `enable` 与 `reasons` |
| `annotation` | 布尔 | 站点 `params.ui.annotation`（开） | 页尾的「最后修改」与出处区块 |
| `backlinks` | 布尔 | 站点 `params.ui.backlinks`（关） | 在右栏目录旁用「反链」组列出链接到本页的页面，分区可以 cascade，见[导航与菜单](/zh/docs/customize/navigation/#backlinks) |
| `translation_notice` | 语言代码或 `false` | 站点 `params.ui.translation_notice`（关） | 权威版本的语言，译文据此显示一条说明并链回原文；本页就是用本语言原创时写 `false` |
{.fields meta="type default"}

### 上游出处 {#upstream}

页面改编自他人材料时，声明来源，页尾的出处行就会写明作品、版权人与许可证，并链接到完整声明。取值依次来自站点参数、`upstream_source` 指名的 `data/upstreams` 条目、本页 front matter，越具体的声明越优先。

`upstream_link` 本身只从 front matter 读取（cascade 有效，站点参数无效），因为站点级的值会让每一页都声称同一个来源。

| 键 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `upstream_link` | URL | — | 本页所依据材料的地址。写空字符串可退出经 `cascade` 继承来的值 |
| `upstream_name` | 字符串 | — | 上游作品名，按署名中显示的写法。设置了 `upstream_link` 即必填 |
| `upstream_copyright` | 字符串 | — | 版权声明，保留上游原文。必填 |
| `upstream_license` | SPDX 标识 | — | 必须能在 `data/licenses` 中查到。必填 |
| `upstream_notice` | 站内路径或 URL | — | 承载完整声明的页面：许可证全文、免责声明、上游 NOTICE、快照版本。必填 |
| `upstream_ref` | 字符串 | — | 快照对应的 tag 或 commit，显示在作品名后的括号里 |
| `upstream_source` | 字符串 | 站点参数 | `data/upstreams` 中的条目名，集中存放多页共用的上游信息 |
| `upstream_modified` | 布尔 | `false` | 把署名改成「改编自」；站点配置了仓库信息时，同一句话里还会带上本页历史的链接。非布尔值按 `false` 处理 |
{.fields meta="type default"}

署名要么完整，要么没有，因为残缺的署名比明显的缺失更容易误导读者。有同族键却没有 `upstream_link`、缺任何一个必填键、许可证在 `data/licenses` 中查不到、`upstream_source` 指向不存在的条目，都会告警并略去整条署名。主题自带一份 SPDX 表 `data/licenses.yaml`，站点用同名文件补充或覆盖其中的条目。

## 图片缩放 {#image-zoom}

页面里满是截图或图表、读者需要看原尺寸时打开它。

| 键 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `image_zoom` | 布尔 | 站点值（`false`） | 本页图片能否点击放大到原尺寸，见[图片](/zh/docs/components/image/) |
{.fields meta="type default"}

## 博客与文章 {#blog}

文章用这一组设置署名、系列与题图，博客栏目用它选择文章索引的形态。指南见[博客与文章](/zh/docs/write/blog/)，四种索引布局的对比见[列表布局](/zh/docs/write/blog/#list)。

| 键 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `author` | 字符串 | — | 文章署名，支持行内 Markdown。页面写了 `authors` 时忽略 |
| `authors` | 字符串数组 | — | `authors` 分类法的 term，顺序即署名顺序。需要在 `taxonomies:` 下声明 `author: authors`，见[作者与署名](/zh/docs/write/blog/#authors) |
| `series` | 字符串数组 | — | `series` 分类法的 term，正文上方的系列横幅取第一个，见[系列](/zh/docs/write/blog/#series) |
| `series_weight` | 整数 | — | 在系列中的位置。带权重的成员按升序排在前，其余按日期升序排在后 |
| `tags` | 字符串数组 | — | 标签，见[分类体系](/zh/docs/customize/taxonomy/) |
| `categories` | 字符串数组 | — | 分类，同上 |
| `images` | 字符串数组 | — | 第一项是文章的题图与分享卡片。写在栏目的 `cascade` 里就是整个栏目的默认图。`images: []` 让页面不再继承这个值，但不会屏蔽页面包里名为 `featured`、`cover` 或 `thumbnail` 的图片 |
| `byline` | 字符串 | — | 题图的图片署名，题图在哪里渲染就跟着显示在哪里 |
| `featured_image` | `none` / `banner` / `wash` / `hero` | 站点值（`none`） | 文章正文里如何显示题图；`hero` 是通栏的图片头部 |
| `blog_index` | `list` / `cards` / `table` / `gallery` | 站点值（`list`） | 博客栏目文章索引的布局。`table` 始终不分页，列出整个栏目 |
| `blog_index_columns` | 正整数 | 站点值（`3`） | 宽屏下的卡片列数；中等与窄屏保留各自的响应式上限 |
| `blog_index_size` | 正整数 | 站点值（`12`） | `list`、`cards`、`gallery` 每页的文章数，开启切换时四种视图共用；单独的 `table` 忽略它 |
| `blog_index_toggle` | 布尔 | 站点值（`false`） | 同时输出四种布局，并提供一个记住读者选择的切换按钮。为 `false` 时只输出配置的布局，忽略读者保存过的选择 |
| `blog_gallery` | 映射 | 站点块 | 整体替换站点的画廊配置块，未写的字段用内置默认值。读者保存的排布与尺寸优先 |
| `blog_gallery.mode` | `wall` / `cards` / `seamless` | 页面块内为 `wall` | 保留 6px 间隙的等高拼接、始终显示文字的瀑布流，或无间隙的行布局；与 `blog_index` 相互独立 |
| `blog_gallery.size` | 160–360 的整数 | 页面块内为 `240` | 目标格子尺寸，单位为 CSS 像素；与每页文章数无关 |
| `share` | 字符串数组或 `false` | 站点 `params.ui.share`（空） | 页尾的分享目标。整体替换继承来的列表；`false` 让本页不显示；未知目标告警并丢弃。见[分享](/zh/docs/write/blog/#share) |
| `summary` | 字符串 | — | 没有 `description` 时，画廊条目与标签、分类页文章行使用的摘要 |
{.fields meta="type default"}

## Book {#book}

一本书通过栏目 `cascade` 设置 `type: book`，再用这一组给章节编号、标记草稿。指南见[书籍出版](/zh/docs/write/book/)。

| 键 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `book_number` | 字符串 | — | 章节编号，显示在页面标题与侧栏条目前 |
| `book_status` | `draft` | — | 标记尚未完成的章节：在侧栏与目录中带草稿标记；`book-toc` 设 `drafts=false` 时不列出 |
| `sidebar_headings` | `false` / `true` / 2–4 的整数 | 站点值（`false`） | 在当前页的侧栏条目下列出它的标题，深度到指定级别；`true` 表示 h2 |
| `book_draft_banner` | 布尔 | 站点值（`false`） | 在草稿章节顶部加一条横幅 |
{.fields meta="type default"}

## Expo 相册 {#expo}

相册页（`type: expo`）从这个配置块读取图片与初始排布。指南见 [Expo 相册](/zh/docs/write/expo/)。

| 键 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `expo` | 映射 | 站点 `params.ui.expo` | 整体替换站点配置块；未写的字段用下列默认值 |
| `expo.images` | 字符串 | `images/*` | 匹配页面包内图片资源的模式 |
| `expo.mode` | `wall` / `cards` / `seamless` | `wall` | 读者自己选择之前显示的排布 |
| `expo.size` | 整数 | `240` | 目标格子尺寸，160 至 360 CSS 像素；读者保存的尺寸优先 |
{.fields meta="type default"}

单张图片的标题、说明、署名、权重、显式 ID 与独立原图，使用 Hugo 原生的 `resources` 元数据，见[图片元数据](/zh/docs/write/expo/#image-metadata)。

## Landing {#landing}

写了 `layout: landing` 的页面从数据文件或自己的 front matter 构建各个分区。指南见[首页与落地页](/zh/docs/customize/home/)。

| 键 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `landing` | 字符串 | — | 从 `data/landing/<key>/<语言>.yaml` 读取分区 |
| `sections` | 数组 | — | 直接写在 front matter 里的分区定义，优先于 `landing`。不是数组时告警，不渲染任何分区 |
{.fields meta="type default"}

## 发布页 {#releases}

发布注记用一个键指明对应的 GitHub Release；分区写上 `layout: releases` 后，会忽略 `weight`，按日期、再按 SemVer 从新到旧列出这些页面。指南见[发布与下载页](/zh/docs/write/releases/)。

| 键 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `release_url` | 字符串 | — | 一个 GitHub 发布地址：`https://github.com/<owner>/<repo>/releases/tag/<tag>`。主题从中推导 owner、项目名、标签与源码归档链接，日期取页面的 `date`；下载资产来自正文里的 `checksums` 块。其它写法告警并跳过发布区块 |
{.fields meta="type default"}

## 相关 {#related}

- [编写页面](/zh/docs/write/pages/) — 每页都要写的那几个键
- [组织内容](/zh/docs/write/organize/) — 侧栏与导航键组合起来的效果
- [配置总览](/zh/docs/customize/config/) — `hugo.yml` 里的全部站点参数
