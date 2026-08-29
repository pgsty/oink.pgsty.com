---
title: 页面参数
linkTitle: 页面参数
description: front matter 全表：主题真正读取的每一个页面键，按侧栏、外壳、搜索、输出、页尾、Book、Landing、发布页分组。
weight: 30
search_keywords: [页面参数, front matter, 前置元数据, page parameters, cascade, 页面级覆盖, 参数表]
---

本页是页面级参数的全表，只列 OINK 主题会读取的键。主题仅为提示「已重命名或已移除」而读取的旧键不在此列——它们在[迁移](/zh/docs/design/migration/)里，也不会出现在生成的编辑器 Schema 中。Hugo 自身的 front matter 字段（`slug`、`url`、`build`、`sitemap`、`expiryDate` 等）照常可用，语义见 [Hugo 文档](https://gohugo.io/content-management/front-matter/)。站点级参数（`hugo.yml` 里的 `params.*`）见[配置总览](/zh/docs/customize/config/)。

## 表格说明 {#how-to-read}
优先级从高到低：

1. 页面自己的 front matter；
2. 最近一层 `cascade`（多层 cascade 都设了同一个键时，离页面最近的那一层生效）；
3. `hugo.yml` 里的站点参数。

「默认」列标「站点值」的键，未写时回落到同名的站点参数。

页面键一律写在 front matter 顶层，键名是站点键去掉 `ui.` 前缀：站点的 `params.ui.section_index` 对应页面的 `section_index`。front matter 里不写 `ui:` 段，键一律在顶层。写在 `ui:` 段里的键不会被读取，也不会有任何提示——某个设置看着没生效时，先对照本页核一遍键名。

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

放进 `cascade` 时键名不变，多包一层：

```yaml {title="content/docs/reference/_index.zh.md"}
cascade:
  pager: false
  section_index: list
```

非法值不会中断构建。主题会发一条警告，指出键名、收到的值以及实际用了哪个回退值，然后按表里的默认值把这一页渲染出来——一个笔误只降级一个设置，而不是让 `hugo server` 下每个 URL 都返回 HTTP 500。它也不会因此混进线上：所有发布关卡都带 `--panicOnWarning` 构建，那条警告在真正要紧的地方仍然是硬失败。

没有任何 front matter 键会中断构建；主题的模板从不报错。当继续构建会发布出错误内容而不只是朴素内容时——比如残缺的上游署名，半条声明读起来和完整的一模一样——警告之后是整块略去，而不是回退。这里唯一会中断构建的属于 Hugo 而不是主题：解析不到目标的引用。

## 基本 {#basic}

| 键 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `title` | 字符串 | — | 页面大标题、浏览器标题、搜索结果标题。每页必写 |
| `linkTitle` | 字符串 | `title` | 侧栏、面包屑、翻页器、卡片里的短名 |
| `description` | 字符串 | — | 一句话摘要：栏目卡片、搜索摘要、`meta description`；博客页里渲染成正文上方的导语 |
| `weight` | 整数 | `0` | 同级排序，用 10 的倍数；`0`（不写）排在所有写了 weight 的页面之后，见[组织内容](/zh/docs/write/organize/#weight) |
| `draft` | 布尔 | `false` | 草稿不进构建产物，`hugo server -D` 可预览，见[编写页面](/zh/docs/write/pages/#drafts) |
| `date` | 日期 | — | 博客日期、发布页排序依据；未来日期默认不构建 |
| `lastmod` | 日期 | Git 提交时间 | 页尾「最后修改」；站点启用 `enableGitInfo` 时不必手写 |
| `aliases` | 字符串数组 | — | 旧路径重定向到本页；用于页面迁移，不用于日常导航 |
| `type` | 字符串 | 顶层目录名 | 决定模板与外壳：`docs` `book` `blog` `swagger`，见[组织内容](/zh/docs/write/organize/#type-and-shell) |
| `layout` | 字符串 | — | 为单个页面指定布局：`landing`、`releases` |
| `cascade` | 映射 | — | 把下面这些键下推给整棵子树 |
{.fields meta="type default"}

## 侧栏与导航 {#navigation}

指南在[组织内容](/zh/docs/write/organize/)。

| 键 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `icon` | Font Awesome class 对 | — | 侧栏、栏目卡片与搜索结果的图标，例如 `fa-solid fa-rocket` |
| `toc_hide` | 布尔 | `false` | 不出现在侧栏树里，也不进翻页序列 |
| `hide_summary` | 布尔 | `false` | 不出现在栏目首页的子页索引里 |
| `sidebar_divider` | 布尔 | `false` | 这一行渲染成侧栏分组标题：不是链接，也不进翻页序列 |
| `sidebar_expanded` | 布尔 | blog 栏目 `true`，其余 `false` | 这个栏目在侧栏里默认展开 |
| `sidebar_root_for` | `self` / `children` | — | 让这个栏目成为侧栏树的根；`self` 连同栏目首页，`children` 只管后代。其它取值告警并忽略 |
| `sidebar_root_link_self` | 布尔 | `true` | 根那一行链接自身；`false` 改为链接父栏目。非布尔值告警并使用 `true` |
| `sidebar_root_menu` | 布尔 | `true` | 顶层栏目是否出现在根切换器里 |
| `toc_root` | 布尔 | `false` | 侧栏根是站点首页时，把这个顶层栏目整个排除在树与翻页序列之外 |
| `manual_link` | URL | — | 侧栏与栏目索引里这一行指向别处 |
| `manual_link_relref` | 内容引用 | — | 同上，但用 `relref` 解析；目标不存在时构建失败 |
| `manual_link_title` | 字符串 | `title` | 手动链接的悬停标题 |
| `manual_link_target` | 字符串 | — | 例如 `_blank`，主题自动补 `noopener` |
| `no_list` | 布尔 | `false` | 栏目首页不生成子页索引 |
| `simple_list` | 布尔 | `false` | 子页索引渲染成紧凑的项目符号列表 |
| `section_index` | `list` / `cards` | 站点值（`list`） | 子页索引的样式。非法值告警并回退 |
| `section_index_columns` | 整数 | `2` | 卡片样式的列数 |
| `notoc` | 布尔 | `false` | 不显示右栏页面目录 |
| `pager` | 布尔 | 由 `params.ui.pager_types` 决定 | `false` 关闭本页的上一页 / 下一页。非布尔告警并忽略该覆盖 |
| `navbar_enabled` | 布尔 | 站点值（`true`） | 这一页是否渲染顶栏 |
| `navbar_autohide` | 布尔 | 站点值（`false`） | 顶栏在指针设备上自动隐藏 |
| `breadcrumb` | 布尔 | 按外壳决定 | 本页是否渲染面包屑；Docs/Book 默认开启，Blog 默认关闭 |
| `theme_color` | 字符串 | 站点值 | `#rgb`/`#rrggbb` 十六进制色，为本页的强调底着色。写在分区根的 `cascade` 里就给整个分区一个身份 —— 见[品牌外观](/zh/docs/customize/brand/#theme-color) |
| `theme_color_dark` | 字符串 | 派生 | 强调色的暗色一半。若上层 cascade 同时设了这个键，只覆盖 `theme_color` 的页面会继承那个暗色，所以要两个一起写。`theme_color: false` 可让页面整体退出继承的栏目色 |
| `page_context_menu` | 布尔 | 站点值（`true`） | 标题行的页面操作菜单（复制 Markdown、编辑本页、打印……） |
| `page_context_menu.assistant_links` | 布尔 | 站点值（`false`） | ChatGPT / Claude 交接项，写成 `page_context_menu: { assistant_links: false }`。页面只能收窄站点策略，不能单独开启 |
{.fields meta="type default"}

## 页面外壳 {#shell}

站点级的默认值与效果说明在[布局与页面类型](/zh/docs/customize/layout/)。

| 键 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `page_width` | `normal` / `wide` / `full` | `normal` | 正文栏宽度。非法值告警并回退 |
| `reading_width` | `slim` / `normal` / `wide` | `normal` | Book 页的阅读行宽，只对 `type: book` 生效 |
| `footer_style` | `fat` / `slim` / `none` | 站点值（`fat`） | 页脚形态。非法值告警并回退 |
| `body_class` | 字符串 | — | 追加到 `<body>` 上的 class，供站点自己的 CSS 使用 |
| `reading_time` | 布尔 | 站点值 | 本页是否显示阅读时长；写 `false` 关掉 |
| `sidebar_enabled` | 布尔 | `true` | 这一页是否显示左侧栏；写 `false` 关掉 |
| `scroll_spy` | 布尔 | 站点值 | 目录的滚动跟随；写 `true` 打开 |
| `keyboard_nav` | 布尔 | 站点值（`true`） | 单键键盘导航，见[键盘导航](/zh/docs/customize/keyboard/)。非布尔告警并回退 |
| `lastmod_commit` | `subject` / `hash` / `none` | `subject` | 「最后修改」后面怎么显示提交。非法值告警并回退 |
| `sidebar_expand_levels`、`sidebar_menu_compact`、`sidebar_menu_foldable`、`sidebar_item_overflow` | 同站点参数 | 站点值 | 侧栏行为也可以逐页覆盖；取值见[配置总览](/zh/docs/customize/config/) |
| `sidebar_width_min`、`sidebar_width_max` | 正整数 | 站点值（`220` / `480`） | 本页桌面侧栏拖拽宽度的上下限；下限大于上限时告警并恢复站点值 |
| `code_copy` | 布尔 | 站点值（`true`） | 本页代码块复制控件的默认值；围栏显式 `copy=` 仍然优先 |
| `toc_style` | `fixed` / `flow` | 站点值（`fixed`） | 固定右栏面板，或从内容流开始的较宽右栏 |
| `toc_taxonomies` | 布尔 | 站点值（`true`） | 分类词云是否与页面目录共同进入右栏 |
| `taxonomy_icons` | map | 站点值 | 为本页或分区 cascade 覆盖各分类法图标 |
{.fields meta="type default"}

## 搜索 {#search}

指南在[全文检索](/zh/docs/customize/search/)。

| 键 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `search_keywords` | 字符串或字符串数组 | — | 附加检索词，包含中英文与同义词 |
| `search_boost` | 正数 | `1.0` | 排序乘数，最终得分为文本匹配分乘以该值。非数字、非有限、零或负值告警并回退 `1.0` |
| `search_exclude` | 布尔 | `false` | 不进本地索引 |
{.fields meta="type default"}

## 输出形态 {#outputs}

指南在 [Agent 支持](/zh/docs/customize/agents/)（`.md` 与 `llms.txt`）与[打印支持](/zh/docs/customize/print/)。

| 键 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `outputs` | 字符串数组 | 站点 `outputs` | 这一页生成哪些输出格式；写 `[HTML]` 时不再生成 `.md` |
| `no_print` | 布尔 | `false` | 不进入整章 / 整书的聚合打印输出 |
{.fields meta="type default"}

## 页尾：评论、反馈与出处 {#page-end}

顺序固定为反馈 → 出处 → 翻页器 → 评论，见[编写页面](/zh/docs/write/pages/#page-end)。

| 键 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `comments` | 布尔 | 站点 `params.comments.enable`（`false`） | 本页是否显示 giscus 评论区，见[启用评论](/zh/docs/admin/comments/) |
| `feedback` | 布尔或映射 | 站点 `params.ui.feedback`（关） | 映射形态支持 `enable` 与 `reasons`。其它写法告警并回退 |
| `annotation` | 布尔 | 站点 `params.ui.annotation`（开） | 页尾的「最后修改 / 出处」区块。只接受布尔，其它写法告警并回退 |
| `backlinks` | 布尔 | 站点 `params.ui.backlinks`（关） | 右栏目录旁是否显示「反链」组，列出链接到本页的页面，分区可以 cascade。只接受布尔，其它写法告警并回退，见[导航与菜单](/zh/docs/customize/navigation/#backlinks) |
| `translation_notice` | 语言代码或 `false` | 站点 `params.ui.translation_notice`（关） | 权威版本的语言代码，译文据此显示一条指回原文的说明；本页即以本语言原创时写 `false` |
{.fields meta="type default"}

### 上游出处 {#upstream}

页面改写自别处的材料时，用 `upstream_link` 声明来源，页尾出处行会给出作品、版权人、许可证与完整声明的链接。这一族键的解析顺序是站点参数 → `data/upstreams` 中由 `upstream_source` 指名的条目 → 本页 front matter，最具体的声明胜出。

`upstream_link` 只从 front matter 读取（cascade 有效，站点参数无效）——站点级的值会让每一页都声称同一个来源。没有 `upstream_link` 却写了任何一个同族键，告警并略去署名。

| 键 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `upstream_link` | URL | — | 本页据以改写的材料地址。写空串退出 cascade 继承来的值 |
| `upstream_name` | 字符串 | — | 上游作品名，按上游自己的写法。设了 `upstream_link` 即必填 |
| `upstream_copyright` | 字符串 | — | 版权声明，保留上游原文。必填 |
| `upstream_license` | SPDX 标识 | — | 必须能在 `data/licenses` 中查到，否则告警并略去署名。必填 |
| `upstream_notice` | 站内路径或 URL | — | 承载完整声明（许可证全文、免责声明、上游 NOTICE、快照版本）的页面。必填 |
| `upstream_ref` | 字符串 | — | 快照对应的 tag 或 commit，显示在作品名后的括号里 |
| `upstream_source` | 字符串 | 站点参数 | `data/upstreams` 中的条目名，用于集中声明多页共用的上游事实；条目不存在时告警并略去署名 |
| `upstream_modified` | 布尔 | `false` | 把署名动词改成「改编自」，站点配了仓库信息时在同一句里带上「查看历史」链接——是一句话，不是多加一行。非布尔值告警并按未修改处理 |
{.fields meta="type default"}

四个必填键（`upstream_name`、`upstream_copyright`、`upstream_license`、`upstream_notice`）缺一即告警并略去整条署名：残缺的署名比明显的缺失更糟。主题自带一份 SPDX 表 `data/licenses.yaml`，站点用同名文件补充或覆盖条目。

## 图片缩放 {#image-zoom}

| 键 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `image_zoom` | 布尔 | 站点值（`false`） | 本页的图片是否可点击放大，见[图片](/zh/docs/components/image/)。非布尔告警并回退 |
{.fields meta="type default"}

## 博客与文章 {#blog}

指南在[博客与文章](/zh/docs/write/blog/)。

| 键 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `author` | 字符串 | — | 文章署名，支持行内 Markdown。页面写了 `authors` 时忽略它 |
| `authors` | 字符串数组 | — | `authors` taxonomy 的 term，顺序即署名顺序，见[作者与署名](/zh/docs/write/blog/#authors)。需要在 `taxonomies:` 下声明 `author: authors` |
| `series` | 字符串数组 | — | `series` taxonomy 的 term。正文上方的横幅取第一个，见[系列](/zh/docs/write/blog/#series) |
| `series_weight` | 整数 | — | 在系列中的位置。带权重的成员按升序排在前，其余按日期升序跟在后 |
| `tags` | 字符串数组 | — | 标签，见[分类体系](/zh/docs/customize/taxonomy/) |
| `categories` | 字符串数组 | — | 分类，同上 |
| `images` | 字符串数组 | — | 第一项作为文章封面与分享卡片；写进栏目 `_index.md` 的 `cascade` 即为栏目级默认。`images: []` 让这一页不继承 cascade 里的值，但不会屏蔽页面 bundle 里已有的 `featured`、`cover` 或 `thumbnail` 图片 |
| `byline` | 字符串 | — | 解析到的题图实际渲染时显示的图片署名 |
| `featured_image` | `none` / `banner` / `wash` / `hero` | 站点值（`none`） | 本文正文里怎么渲染自己的题图；`hero` 使用沉浸式通栏外壳。非法值告警并回退 |
| `blog_index` | `list` / `cards` / `table` | 站点值（`list`） | 写在博客根目录上，决定该栏目索引形态；`table` 不分页，列出整个栏目。非法值告警并回退 |
| `blog_index_columns` | 正整数 | 站点值（`3`） | 宽视口下的卡片列数；中等与窄视口仍保留响应式限制 |
| `blog_index_size` | 正整数 | 站点值（`12`） | `list` 与 `cards` 每页文章数；`table` 始终列出整个栏目 |
| `blog_index_toggle` | 布尔 | 站点值（`false`） | 同时发布三种索引形态，让读者切换；隐藏形态不加载图片 |
| `share` | 字符串数组或 `false` | 站点 `params.ui.share`（空） | 页尾分享目标，整体替换继承来的列表；`false` 让本页退出，见[分享](/zh/docs/write/blog/#share)。未知目标告警并丢弃 |
| `summary` | 字符串 | — | 标签 / 分类页上文章行的摘要回退来源，`description` 优先 |
{.fields meta="type default"}

## Book {#book}

指南在[书籍出版](/zh/docs/write/book/)。整本书通过栏目 `cascade` 设 `type: book`。

| 键 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `book_number` | 字符串 | — | 章节编号，显示在页面标题与侧栏条目前面 |
| `book_status` | `draft` | — | 标记草稿章节：侧栏与目录里带草稿标记，索引里默认不列 |
| `sidebar_headings` | `false` / `true` / 2–4 的整数 | 站点值（`false`） | 在侧栏当前条目下展开 h2–h4 分支。超出范围告警并回退 |
| `book_draft_banner` | 布尔 | 站点值（`false`） | 草稿章节正文开头加一条横幅。非布尔告警并回退 |
{.fields meta="type default"}

## Landing {#landing}

指南在[首页与落地页](/zh/docs/customize/home/)。任意页面写 `layout: landing` 就用落地页外壳。

| 键 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `landing` | 字符串 | — | 数据取自 `data/landing/<key>/<语言>.yaml` |
| `sections` | 数组 | — | 在 front matter 里内联分区定义，优先于 `landing`。不是数组时告警，不渲染任何分区 |
{.fields meta="type default"}

## 发布页 {#releases}

指南在[发布与下载页](/zh/docs/write/releases/)。栏目写 `layout: releases` 后忽略 `weight`，按发布日期与 SemVer 倒序排列。

| 键 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `release_url` | 字符串 | — | 一个 GitHub 发布地址，`https://github.com/<owner>/<repo>/releases/tag/<tag>`。主题从中解析出项目、标签、日期与资产列表。其它写法告警并跳过发布区块 |
{.fields meta="type default"}

## 相关 {#related}

- [编写页面](/zh/docs/write/pages/) — 每页都要写的那几个键
- [组织内容](/zh/docs/write/organize/) — 侧栏与导航键的实际效果
- [配置总览](/zh/docs/customize/config/) — `hugo.yml` 里的站点参数全表
