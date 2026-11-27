---
title: 布局与页面类型
linkTitle: 布局与页面类型
description: 决定页面使用哪种外壳，并调整侧栏、目录、栏目首页与页宽。
weight: 50
search_keywords:
  [布局, 页面类型, 外壳, 侧栏, 目录, TOC, 栏目首页, 页宽, layout, shell, type, sidebar, toc, section index, page width]
---

每个页面都渲染在一个外壳里：要么是左侧有侧栏、右侧有大纲的阅读外壳，要么是普通的单栏页面。选择外壳的是页面的 `type`，而不是它所在的目录，所以文档可以放在 `content/` 下的任何位置。要让 `content/handbook/` 里的运维手册使用文档外壳，在分区上设置 type，并通过 cascade 传给下面的所有页面：

```yaml {title="content/handbook/_index.md"}
---
title: 运维手册
type: docs
cascade:
  type: docs
---
```

内容放在哪里、侧栏树如何跟随目录，见[组织内容](/zh/docs/write/organize/)；本页只讲内容外面的这层外壳。

## 外壳类型 {#shell-types}

| `type` | 外壳 |
| --- | --- |
| `docs` | 阅读外壳：左侧栏（分区切换器与页面树）、正文、右侧大纲 |
| `book` | 阅读外壳，另有章节、图与表格编号，`reading_width` 阅读行宽，以及可选的草稿横幅 |
| `blog` | 阅读外壳，侧栏中的博客分区默认展开，不显示面包屑导航；博客索引页上的页面操作按钮以 RSS 打头 |
| `swagger` | 阅读外壳，正文由 Swagger UI 或 Redoc 渲染，见 [API 文档](/zh/docs/write/openapi/) |
| `expo` | 共享侧栏加全宽图片相册，没有右侧大纲，见 [Expo 相册](/zh/docs/write/expo/) |
| 其它 type | 普通页面：顶栏、单栏正文与页脚，没有侧栏 |

分类页与词条页（例如 `/tags/`）也使用阅读外壳。

`params.ui.shell_types` 列出哪些 type 具备阅读外壳的行为，默认就是上面五种：

```yaml {title="hugo.yml"}
params:
  ui:
    shell_types: [docs, book, blog, swagger, expo]
```

覆盖这个列表时要保留这五种，因为主题只为列表中的 type 加载外壳脚本。加入自定义的 type 会为它开启外壳行为，但不会因此画出侧栏，除非你自己为这个 type 写的模板会渲染侧栏；想让某个分区像文档一样阅读，就像上面那样给它 `type: docs`。

### 分区根 {#sections}

```yaml {title="hugo.yml"}
params:
  ui:
    docs_section: docs
    blog_section: blog
```

这两个键指出文档与博客的顶层目录，主题用它们确定侧栏根、命令面板的快速链接与默认图标，但 **它们不决定外壳**：上面的运维手册照样使用文档外壳，`docs_section` 仍然是 `docs`。

docs 页面的侧栏通常从文档分区开始。要让它从站点首页开始、显示所有顶层分区：

```yaml {title="hugo.yml"}
params:
  ui:
    docs_sidebar_root: home # home | section
```

其它取值会告警并使用 `section`。

### 文档挂在站点根 {#docs-at-root}

以文档为主的站点可以把文档发布在 URL 根路径下，用 `/install/` 代替 `/docs/install/`，源文件仍留在 `content/docs/`。这需要同时做三处修改。

第一，用 Hugo 原生的 `permalinks` 去掉 URL 中的 `docs/` 段：

```yaml {title="hugo.yml"}
permalinks:
  page:
    docs: /:sections[1:]/:slug/
  section:
    docs: /:sections[1:]
```

第二，让每种语言的站点根索引（`content/_index.md`、`content/_index.zh.md` 等）不再渲染页面，这样它不再与文档分区争抢同一个输出路径，同时仍可作为链接目标：

```yaml {title="content/_index.zh.md"}
---
title: 产品文档
build: { render: link }
---
```

第三，把侧栏根设为站点首页，让侧栏与上一页 / 下一页沿着同一棵树走：

```yaml {title="hugo.yml"}
params:
  ui:
    sidebar_root_enabled: true
    docs_sidebar_root: home
```

设置 `docs_sidebar_root: home` 后，所有顶层分区都会进入这棵树。博客、社区页、下载页这类不属于阅读顺序的分区，在各自的 `_index.md` 里写 `toc_root: true` 退出，它们就既不出现在树里，也不进入翻页顺序：

```yaml {title="content/blog/_index.md"}
---
title: 博客
toc_root: true
---
```

此时文档与其它所有分区共用 URL 根路径，所以构建时加上 `--printPathWarnings`，发布前解决所有重复的输出目标。

### 落地页 {#landing}

`layout: landing` 的页面两种外壳都不用：保留顶栏与页脚，中间的全宽区域由 Hero、卡片、定价等分区填充。见[首页与落地页](/zh/docs/customize/home/#landing-page)。

## 侧栏 {#sidebar}

侧栏照搬 `content/` 下的目录结构，按 `weight` 排序，页面有 `linkTitle` 时用它作标签。下面这些设置（取值均为默认值）决定树展开多少、侧栏有多宽：

```yaml {title="hugo.yml"}
params:
  ui:
    sidebar_menu_compact: true
    sidebar_menu_foldable: true
    sidebar_menu_truncate: 2000
    sidebar_width_min: 220
    sidebar_width_max: 480
    sidebar_item_overflow: ellipsis # ellipsis | wrap
    sidebar_expand_levels: 2
```

- `sidebar_menu_compact` 只展开当前页面所在的分支及其相邻条目；设为 `false` 时整棵树全部展开。
- `sidebar_menu_foldable` 允许读者展开、折叠分区。博客分区默认展开；要让某个分区默认折叠，在它的 `_index.md` 里写 `sidebar_expanded: false`。
- `sidebar_expand_levels` 是默认展开的层数。
- `sidebar_menu_truncate` 限制每个分区渲染的条目数，避免上千页的目录树把 HTML 撑到不可用。某个分区被截断时，构建告警会指出是哪个分区、需要调到多少。
- `sidebar_width_min` 与 `sidebar_width_max` 是桌面端读者拖动侧栏时的宽度上下限（像素），双击分隔条恢复默认宽度。
- `sidebar_item_overflow: ellipsis` 用省略号截断长标题；长标题多的站点（例如中文站）适合改成 `wrap` 换行。

每位读者的展开状态、侧栏宽度与滚动位置都保存在浏览器里，按语言分开。宽度小于 `md` 断点时，侧栏变成带遮罩的抽屉。

大型站点为每个页面单独渲染侧栏会拖慢构建。站点页数达到 `params.ui.sidebar_cache_limit`（默认 500）后，有效侧栏设置相同的页面共用一棵缓存的树，由浏览器标出当前页面并展开它的上级。这棵共享的树在没有 JavaScript 时依然完整、可以导航。页数低于这个值时，每个页面的当前位置都在构建期渲染。开启了 [`sidebar_headings`](#sidebar-headings) 的 Book 页面始终使用自己的树。

要在某一页去掉侧栏：

```yaml {title="content/docs/fullscreen-report.md"}
---
title: 全屏报告
sidebar_enabled: false
---
```

### 显式导航树 data/docs_nav.json {#docs-nav}

手册的章节顺序来自别处时（例如从 Sphinx toctree 迁移过来、需要保持原有顺序），使用显式导航树；`content/` 里的 `weight` 已经能表达顺序时，不需要这个文件。以下三个条件同时成立时，主题用 `data/docs_nav.json` 代替目录树：

- 文件存在，且包含 `sections` 键；
- 页面的 type 是 `docs` 或 `book`；
- 页面解析出的侧栏根不是站点首页。

文件是一棵节点树。每个节点的 `page` 指向一个内容路径，`children` 是它在导航中的子节点。主题根据页面身份解析链接与当前分支；`url` 与记录祖先链的 `active_path_by_url` 是为旧文件保留的可选提示：

```json {title="data/docs_nav.json"}
{
  "sections": [
    {
      "page": "/docs/start",
      "url": "/docs/start/",
      "children": [{ "page": "/docs/start/install", "url": "/docs/start/install/" }]
    }
  ],
  "active_path_by_url": {
    "/docs/start/install/": ["/docs/start/"]
  }
}
```

路径里不写语言前缀，也不写 `baseURL` 中的部署子路径。主题比较前会去掉这两种前缀，所以 `/docs/start/` 同样匹配 `/zh/docs/start/` 与 `/handbook/zh/docs/start/`，渲染出的链接则保留真实的前缀。

这棵树还能在不移动文件的情况下给页面分组。设置 `docs_section: docs` 与 `docs_sidebar_root: section` 后，type 为 `docs` 的根级页面可以这样编排：

```json {title="data/docs_nav.json"}
{
  "sections": [
    { "page": "/intro" },
    { "page": "/config", "children": [{ "page": "/api" }] }
  ]
}
```

`content/config.md` 与 `content/api.md` 仍是同级文件，但导航里 API 位于 Config 之下，打开 API 时 Config 随之展开。节点适用于某个侧栏根的条件是：它就是这个根、在 `content/` 中位于这个根之下，或者是解析到同一个根的 Docs 或 Book 页面。页面的自定义 URL 只改变链接，不改变它在侧栏里的位置。独立的 Book 根，或用 `sidebar_root_for` 嵌套的根，使用各自的分支；文件里没有出现的根沿用它的目录树。

同一棵树也决定上一页 / 下一页与导航 JSON，所以翻页与侧栏始终一致。`sections` 为空数组时告警并回退到目录树；`page` 指向不存在的页面时告警并跳过该项。带 `manual_link` 的占位节点与 `sidebar_divider` 分隔行留在侧栏里，但不成为翻页目标。分隔分区在这里同样保留子页，写法与目录树中[只分组、不发布页面的 front matter](/zh/docs/write/organize/#group-only) 相同。

### 侧栏图标密度 {#sidebar-icons}

页面 front matter 里的 `icon` 会显示在侧栏中。每个叶子页都带图标，长目录树反而难以扫读，可以加以限制：

```yaml {title="hugo.yml"}
params:
  ui:
    sidebar_icon_policy: groups # all | groups | none
```

| 取值 | 效果 |
| --- | --- |
| `all`（默认） | 每个带图标的条目都显示图标 |
| `groups` | 只有根节点与有子页的条目显示图标 |
| `none` | 侧栏不显示条目图标 |

非法取值会告警并使用 `all`。本站使用 `groups`。

### 在侧栏里展开标题 {#sidebar-headings}

Book 的长章节里，把当前页面的 h2–h4 标题作为分支挂在侧栏当前行下，读者就能从侧栏直接在各节之间跳转。这个分支默认关闭，开启方式：

```yaml {title="hugo.yml"}
params:
  ui:
    sidebar_headings: 3 # false | true | 2 | 3 | 4
```

2 到 4 的整数表示展开到第几级，`true` 等于 2（只展开 h2），`false` 关闭；其它取值会告警并关闭。它只对 `type: book` 的页面生效，只在当前页面所在的那一行下展开，右侧大纲依然保留。front matter 或分区 cascade 也可以设置同名键，`sidebar_headings: false` 可以关闭继承来的设置。

## 目录 TOC {#toc}

右侧大纲列出页面的 Markdown 标题，收录哪几级由 Hugo 自己的配置决定：

```yaml {title="hugo.yml"}
markup:
  tableOfContents:
    startLevel: 2
    endLevel: 4
    ordered: false
```

大纲始终跟随阅读位置：页面滚动时，一条连续的轨道标出当前章节，不需要额外开关。读者可以折叠右栏，浏览器会记住这一选择。宽度小于 `xl` 断点时右栏隐藏，大纲移进侧栏抽屉。旧配置里可能还写着 `params.ui.scroll_spy` 或页面级的 `scroll_spy`，两者都会被接受并忽略。

要在某一页隐藏大纲，在 front matter 里写 `notoc: true`。

只有进入 Hugo 目录的标题才会出现在大纲里。Markdown 型短代码（`{{%/* … */%}}`）输出的标题会进入；普通短代码（`{{</* … */>}}`）里的标题通常不会，所以结构性的标题要写在 Markdown 里。

## 栏目首页样式 {#section-index}

带 `_index.md` 的分区会自动列出子页面，形式可以是列表或卡片：

```yaml {title="hugo.yml"}
params:
  ui:
    section_index: cards # list | cards
    section_index_columns: 2
```

- `list`（默认）：每个子页面显示标题，下面是描述。
- `cards`：卡片网格，显示每个子页面的 `title`（或 `linkTitle`）、`description` 与 `icon`；列数由 `section_index_columns`（默认 2）决定。

分区可以在自己的 front matter 里选择样式。取值非法时告警并使用默认值：

```yaml {title="content/docs/components/_index.md"}
---
title: 组件
section_index: cards
section_index_columns: 3
---
```

`no_list: true` 不列出子页面，`simple_list: true` 只列成不带描述的项目符号列表，子页面设置 `hide_summary: true` 则把自己排除在外。子页面清单交给主题生成，不要手写，因为手写的清单迟早会与侧栏对不上。

## 页宽 {#page-width}

```yaml {title="hugo.yml"}
params:
  page_width: normal # normal | wide | full
```

`normal` 是舒适的阅读宽度，`wide` 加宽内容栏，`full` 铺满窗口。可以逐页设置，也可以通过 cascade 按分区设置；宽表格、大图与 API 参考页常常需要 `wide`：

```yaml {title="content/docs/api/reference.md"}
---
title: 接口参考
page_width: wide
---
```

Book 页面另外接受 `reading_width`（`slim`、`normal` 或 `wide`），它改变正文的行宽，不改变外壳。两个键取值非法时都会告警并使用 `normal`。

## 顶栏与页脚开关 {#chrome}

顶栏与页脚可以用 front matter 顶层的键逐页开关，这些键不在 `ui` 之下。要改整个分区，在它的 cascade 里设置一次即可：

```yaml {title="content/docs/_index.md"}
---
title: 文档
cascade:
  navbar_enabled: false
  footer_style: slim
---
```

各个键的作用见[导航与菜单](/zh/docs/customize/navigation/#navbar-disable)与[品牌外观](/zh/docs/customize/brand/#footer)，完整的键列表见[页面参数](/zh/docs/write/frontmatter/)。

## 验证 {#verify}

```bash
hugo --printPathWarnings
```

- 构建以 `Total in …` 结束且没有 ERROR。
- 新建的 `type: docs` 页面有左侧栏。没有的话，检查 cascade 是否覆盖到该页，以及它的 type 是否在 `shell_types` 中。
- 拖动侧栏分隔条后刷新，宽度保持不变；双击恢复默认宽度。
- 宽度小于 `md` 时侧栏是可以关闭的抽屉，小于 `xl` 时大纲位于这个抽屉里。
- 栏目首页列出的条目数与侧栏中的子页面数一致。
- `page_width: wide` 的页面比相邻页面宽。
- 文档挂在站点根时，构建没有报告重复的输出路径。

## 相关 {#related}

- [配置总览](/zh/docs/customize/config/#shell) — 外壳、侧栏与大纲相关设置的默认值
- [组织内容](/zh/docs/write/organize/) — 目录结构、`weight` 与侧栏树
- [导航与菜单](/zh/docs/customize/navigation/) — 顶栏、分区切换器与翻页
- [首页与落地页](/zh/docs/customize/home/) — `layout: landing` 的数据写法
- [页面参数](/zh/docs/write/frontmatter/) — 逐页覆盖用到的 front matter 键
