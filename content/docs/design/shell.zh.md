---
title: 外壳与导航契约
linkTitle: 外壳与导航
description: 导航权威、沉浸式博客、搜索、操作、分类法、索引与页尾组合契约。
weight: 30
icon: fa-solid fa-window-maximize
search_keywords: [OINK 外壳, 导航契约, 搜索, 操作, 博客展示, 作者, 系列, 翻页]
contract_status: released-v0.8.0
---

> [!IMPORTANT] OINK 0.8.0 契约
> 这是随 OINK 0.8.0 正式发布的外壳与导航契约。本页是权威中文源文件，与英文版本
> 一同维护在 `content/docs/design/`。

## 权威来源与导航 {#authorities-and-navigation}

| 关注点 | 权威来源 |
| --- | --- |
| 全局导航 | Hugo `menus.main` |
| Docs / Book 侧栏与翻页 | 内容树或 `data/docs_nav.json` |
| 根栏目切换器 | 解析后的顶层内容根 |
| 内容发现 | 各语言的本地搜索索引 |
| 页面与命令面板操作 | 共享操作注册表 |

任何功能都不能引入另一套菜单或页面树。菜单只允许一层子项交互；更深层级会警告，
并平铺到带链接的分组标题下。外部链接使用
`target="_blank" rel="noopener noreferrer"`；内部链接保持语言与子路径感知。

顶部导航栏的桌面视图与抽屉视图投影同一棵树，每个下拉面板都是一列宽度适中的
"图标 + 标题"行——mega 面板与其 `columns` 菜单参数已退役，配置 `columns`
会发出警告并保持单列。菜单描述只是配置数据，不再渲染。链接树在任何宽度都保持居中：
lg 以上是文字链接，之下收缩为图标链接。lg 与 md 之间，右端保留搜索、版本、
语言、主题与 GitHub，没有菜单按钮；md 以下这些工具移入底栏工具组，此时首页
与显式 Landing 页在搜索旁增加一枚抽屉入口，展开完整的带标签菜单树；其余宽度
与页面一律不渲染抽屉入口。语言链接指向页面译文，缺少译文时
指向对应语言首页；多个语言共享主机与 base path 时保持相对链接，只有语言拥有
独立 `baseURL` 时才变成绝对链接；`hreflang` 始终使用绝对链接。
`navbar_autohide` 从 768px 起只对精细指针生效，绝不作用于触控或抽屉宽度；
隐藏的导航栏不交还占位：两种状态下布局都保留导航栏横带，固定顶栏正好占满这条
横带、下边框画在带内，显现时原地淡入、不遮挡静止内容，hero 页面忽略该策略、
保留自己的叠加导航栏。首页与 hero 页面共用同一套柔和边界：导航栏不画下边框、
滚动时不投阴影，改由栏下一小段渐隐过渡收束边缘。

侧栏与翻页共享同一个根和顺序。`manual_link`、`build.render: link`、分隔行、
隐藏节点与占位节点保留各自已定义的语义。`sidebar_icon_policy` 可取默认的 `all`、
`groups` 或 `none`；图标是一对 Font Awesome class。无效策略遵循共享的警告与
回退契约。

## 沉浸式博客展示 {#immersive-blog-presentation}

OINK 没有 article 类型或第二套外壳。沉浸式阅读由普通博客外壳上的四个独立键
组成，可设在页面或分区 cascade 上；分区索引会重复它自己也需要的值：

```yaml
featured_image: hero
toc_style: flow
toc_taxonomies: false
sidebar_enabled: false
```

博客外壳默认不渲染面包屑导航——文章应作为独立作品阅读——所以这份配置不需要
相应的键。`breadcrumb` 仍是普通键，页面或 cascade 可以在任何外壳上明确打开
或关闭它。

`hero` 在单页与分区索引上把共享特色图片用作装饰性的全出血背景。没有图片时
渲染普通开场；`banner` 与 `wash` 仍只用于单页。顶部导航栏以对比遮罩叠在 hero
上，并随页面一起滚动。

`toc_style` 可取 `fixed` 或 `flow`；flow 在文章旁放置更宽的导轨，并且只在滚动
之后固定。它的静止位置与文章信息行对齐；页面没有信息行时，与描述对齐。标题
换行数无法预知，因此由 `docs-shell.js` 测量偏移；没有 JavaScript 时，导轨从
文章起点开始。`toc_taxonomies: false` 移除术语云；导轨既无 TOC 又无术语云时
完全不渲染。`notoc` 仍是页面级 TOC 退出键。这些开关不改变署名、标签、系列、
翻页顺序、feed 或页尾组合；导轨在 `xl` 断点以下消失。

## 搜索、操作与运行时 {#search-actions-and-runtime}

`params.offline_search` 选择启用各语言的本地索引。启用后默认也在 `hugo server`
期间构建；大型编辑循环可以设置 `offline_search_on_serve: false`。HTML 搜索出现
在首页、外壳页面，以及启用 `landing_search` 的落地页上。其它非外壳页面与 Print
不包含对话框、Lunr 或命令面板。

搜索元数据包括 `search_keywords`、默认值为 1 的 `search_boost`，以及
`search_exclude`。索引携带 URL、标题、分类法、摘录、小标题、description、
正文或摘要、根、分区、类型、关键词、boost、面包屑导航与图标。夹具预算为原始
2 MiB、gzip 512 KiB。站点可以通过 `hooks/search-keywords-extra.html` 返回额外
字符串。

内置操作 ID 包括 `copy_markdown`、`copy_link`、`open_chatgpt`、`open_claude`、
`view_markdown`、`view_history`、`edit_page`、`create_child_page`、`create_issue`、
`create_project_issue`、`print_section`、`print`、`switch_theme`、
`switch_language`、`switch_version` 与 `open_github`。分享栏之外的 `copy_link`
只出现在命令面板中。站点通过
`languages.<lang>.params.ui.command_palette.commands` 配置的命令可以打开安全
URL，或调用内置 ID，绝不能注入 JavaScript。

命令面板有空状态、文本搜索状态与 `>` 命令状态；快捷链接来自导航。它没有历史、
语义搜索、个性化或远程回退。搜索查询留在浏览器内，默认不发送遥测。

`OinkSurfaceCoordinator` 协调命令面板、抽屉、根栏目、语言与版本菜单。各界面自行
管理焦点恢复与 Escape。键盘导航会忽略可编辑控件与模态框：`/`、`\`、`f`、`c`
打开搜索或命令；`j`/`k` 移动标题；`q`/`e` 翻页；`h` 改变展示方式；`l`/`y`、
`t`、`r` 分别打开语言、主题与根栏目选项。侧栏 WASD/方向键导航使用真实焦点，
不会改写 Tab 顺序。

页面大纲从同一套标题模型与滚动容器计算后的 `scroll-padding-top` 推导光标和可见
标题范围；SVG 线条与圆点共享同一组动画值，不会漂移。禁止增加臆测性的 DOM
修复遍历。

## 分享 {#share}

`params.ui.share` 默认为空，可接受 16 个目标的任意有序子集：`x`、`bluesky`、
`mastodon`、`facebook`、`linkedin`、`reddit`、`hackernews`、`telegram`、
`whatsapp`、`line`、`pinterest`、`weibo`、`chatgpt`、`claude`、`email`、`copy`。
页面列表会替换继承列表；`share: false` 退出。未知项会警告并丢弃。只有普通页面
渲染分享栏；Print、Markdown 与 RSS 省略它。

目标是携带页面永久链接与标题的普通 intent 链接，外加本地 `copy_link` 按钮。
Pinterest 图片来自共享特色图片解析器。ChatGPT 与 Claude 接收构建期生成的永久
链接提示，与页面菜单里的助理操作相互独立。Discord 没有公共 intent 目标，因此
有意不提供。

分享栏不加载平台 SDK、iframe、脚本、样式表、计数器或 campaign 参数；只有读者
主动点击链接时才产生请求。它是一行带无障碍标签的字形。
`share/items.html` 解析目标，`share/bar.html` 负责渲染。

## 注记 {#annotation}

页面注记在 `annotation-items.html` 中解析描述项，再通过
`page-meta-lastmod.html` 渲染；两者都可以做窄范围覆盖。各行顺序如下：

| 行 | 条件 |
| --- | --- |
| 最后修改 | 已设置 `Lastmod` |
| 上游 | front matter 中的 `upstream_link` 非空 |
| 翻译 | 配置的权威语言存在译文，而且本页包含作者正文 |

`upstream_link` 是页面级事实；cascade 有效，`upstream_link: ""` 表示退出。
其它上游事实按站点参数 → `data/upstreams[upstream_source]` → front matter 解析：
`upstream_name`、`upstream_copyright`、`upstream_license`、`upstream_notice`，
以及可选的 `upstream_ref`、`upstream_modified`。存在链接时，前四项必填。无效或
残缺的署名会警告，而且不渲染法律声明；不支持的 URL 会被拒绝。发布门禁通过
`--panicOnWarning` 拒绝这类警告。

`upstream_modified` 改变署名动词并链接提交历史，不增加新行。notice 页面承载
完整的许可证与免责声明。翻译说明通过 `params.ui.translation_notice` 选择启用，
以页面键 `translation_notice` 参与 cascade，跳过生成页面或无正文页面；以本语言
原创的页面可以用 `translation_notice: false` 关闭。

## 作者与系列 {#authors-and-series}

博客文章页头依次为标题、信息行、术语徽章、作者署名、系列条；description 在其后
引出正文。信息行 `article-info.html` 始终包含日期；启用 `reading_time` 后再增加
字数与分钟数。Front matter 的 `upstream_link` 与注记使用同一个页面级事实，
并在共享 URL 策略保护下增加本地化的原文链接。术语行只是裸徽章组，分类法名称
位于分组标签中，不显示前缀。术语徽章静止时是浅中性底与弱化文字，前置该分类法的
term 图标；可点击徽章在 hover 或 focus 时才取得当前分区的强调色淡铺、边框与文字。
图标词汇表由 `taxonomy-icon.html` 独家拥有——每个
分类法配一对图标：整体分类法一枚、单个术语一枚（`folder-open`/`folder`、
`tags`/`tag`、`cubes`/`cube`、`users`/`user-pen`、series 用
`book-bookmark`/`book`，其余用 `shapes`）；`params.ui.taxonomy_icons` 可覆盖：
字符串同时作用于两个表面，`taxonomy`/`term` map 分别设置；无效输入警告并保留
内置。右栏词云只在云头戴整体图标：云 chip 与术语归档筛选条保持"文本 + 计数"——
分类法已经亮明身份，再在每个 chip 上重复图标只是噪声。作者署名只放人物——头像、姓名与个人资料的一行简介——
不带标签或日期。列表行、卡片与术语归档共享同一形态的元数据行：日期、一条本地化
的作者与分区短语，以及由同一个 `reading_time` 开关控制的字数和分钟数。句子下方
是独立成行、自动换行的徽章行，按分类法字母序列出页面在全部分类法下的词条，每枚
徽章佩戴各自的 term 图标；卡片排除 `authors`——其句中已具名。

只有声明 `taxonomies: {author: authors}` 才启用作者。作者 term 页面拥有显示名称、
摘要、正文与特色图片头像；没有 profile 时，回退到链接标题、首字母与归档。
`authors-resolve.html` 在文章页头、列表行中保留 front matter 顺序，并为每位作者
生成一个 RSS `dc:creator`。没有 `authors` 时，旧 `author` 保持原样；两者同时
存在时，`authors` 无警告胜出。自定义作者分类法复数名按普通分类法处理。

只有声明 `taxonomies: {series: series}` 才启用系列。Term 页面拥有引言；不新增
参数、数据文件、封面模型或运行时。页面使用 `series: [name]` 与可选的
`series_weight`。`series-pages.html` 先按 weight 排有权重成员，再按日期升序排
无权重成员，并用 `Path` 打破平局；系列条与 term 页面共享该顺序。第一个命名系列
得到一条 HTML/Print 系列条。面板是半透明加模糊，而不是一张不透明卡片：`hero`
文章会把题图铺在这一段背后，不透明底色等于在画面上挖个洞；普通文章上这层色调
就落回页面自身的底色，所以一种处理同时服务两种场景。summary 拥有整行与末端
箭头；系列名连同它的分类法图标，仍是 summary 的兄弟链接，覆盖在一份隐藏的等宽
占位文字上，避免 summary 内出现嵌套交互控件。展开后先划一条细线，再在同一层
表面上把成员阅读顺序放进一个保持 DOM 顺序的自适应网格。每个链接都把序号纳入
点击目标，序号贴在固定方格轨道的末端，因此无论多少篇，标题都对齐在同一条边上；
窄屏保持一栏，只有当每个标题仍有可读宽度时才增加等宽栏，因此桌面面板能用满自身
宽度，也不会把一条选中背景拖过整篇正文。悬停与读者所在位置直接借用侧栏导航
处理这两种状态的同两种底色，当前篇再加上填充序号与加粗标题，不靠颜色单独表意。打印时显示同一份展开
列表，收为单栏。单篇系列与非 HTML 输出省略它。编号、交叉引用与聚合输出仍属于 Book。

默认文章分类法徽章会排除保留的 `authors` 与 `series`，因为专属界面已经展示
它们。显式设置 `params.taxonomy.page_header` 可以恢复任意一项。

## 博客索引与页面组合 {#blog-indexes-and-page-composition}

博客分区索引使用 `params.ui.blog_index`：默认的 `list` 与 `cards` 都是按最新优先
排列的一段扁平结果，共享 `blog_index_size` 分页；元数据行已经显示日期，所以不再
需要年份标题。`table` 把整个分区显示为日期、标题、标签行，不分页。卡片使用共享
首图、本地化日期/作者/分区元数据、标签与三行摘要。Term 与 taxonomy 页面保持
行列表。

`params.ui.blog_index_toggle` 为当前分页切片渲染三种形态，并允许读者循环切换。
配置值控制首次绘制，隐藏形态不加载图片。读者存储的选择只作用于发布了全部三种
形态的索引：切换器关闭的分区只发布一种形态，并始终显示它。Front matter 或
cascade 可为每个分区覆盖站点模式。没有切换器的 table 仍是完整且不分页的归档。

`params.logo` 始终是品牌标志；`params.wordmark` 或站点标题是紧凑宽度下隐藏的
文字部分。Docs、Book、Blog 与 Swagger 共享一个外壳模型。页尾顺序为分享、反馈、
注记、翻页、评论。Docs/Book 翻页遵循侧栏前序遍历；Blog 按 weight 后接日期倒序；
`pager: false` 退出。静态输出省略翻页 UI。

每一种实际渲染的页脚形态，都会在最底层栏右侧保留纯图标工具组，顺序为版本、
语言、主题、快捷键帮助。各菜单向上展开；版本触发器不直接显示当前分支或版本名。
胖页脚的折叠箭头排在工具组之后。低于 `lg` 时，底层栏放弃版权/居中/工具组的
三列布局，改为三行全宽居中堆叠，工具组在最后一行。这些全局控件不再出现在
侧栏底部；`footer_style: none` 会移除整条底栏。

OINK 没有归档外壳、任意深度飞出菜单、第二个导航权威、查询上传，也没有针对已
移除配置的浏览器兼容 shim。反馈只通过既有 `gtag` 发出 `docs_feedback`，在本地
保存选择，而且不替代 Giscus。

## 验证 {#verification}

`bin/check-navigation-contract.py`、`bin/check-shell.py`、JavaScript 测试、输出
golden 与消费站点浏览器套件覆盖导航、语言与子路径链接、博客变体、页尾顺序、
键盘行为、无障碍与响应式布局。
