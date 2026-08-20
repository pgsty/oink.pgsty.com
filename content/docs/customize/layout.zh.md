---
title: 布局与页面类型
linkTitle: 布局与页面类型
description: 用 type 决定一页用哪种外壳，再调侧栏宽度与图标、目录深度、栏目首页样式和页宽。
weight: 50
search_keywords:
  [布局, 页面类型, 外壳, 侧栏, 目录, TOC, 栏目首页, 页宽, layout, shell, type, sidebar, toc, section index, page width]
---

本页覆盖页面骨架：有没有侧栏、侧栏多宽、目录收几级、栏目首页是列表还是卡片。内容放在哪个目录见[组织内容](/zh/docs/write/organize/)，这里只讲外壳。

规则是 **外壳看 `type`，不看路径**。文档可以放在 `content/` 下的任何位置，只要给它 `type: docs`。

## 外壳类型 {#shell-types}

`params.ui.shell_types` 列出哪些 type 使用带侧栏的阅读外壳：

```yaml {title="hugo.yml"}
params:
  ui:
    shell_types: [docs, book, blog, swagger]
```

| type | 外壳 |
| --- | --- |
| `docs` | 文档外壳：左侧栏（栏目切换器 + 目录树）+ 正文 + 右栏大纲 |
| `book` | 文档外壳，另加编号目标、`reading_width` 阅读行宽与草稿横幅 |
| `blog` | 文档外壳，侧栏默认展开，标题行左半边是 RSS |
| `swagger` | 文档外壳，正文交给 Swagger UI 或 Redoc，见 [API 文档](/zh/docs/write/openapi/) |
| 其它 type | 普通页面：顶栏 + 单栏正文 + 页脚，没有侧栏 |

分类页与标签页（`taxonomy` / `term`）不在这张表里，但也走同一套外壳。

给一棵子树指定 type 用 cascade，这是把文档放在任意路径的做法：

```yaml {title="content/handbook/_index.md"}
---
title: 运维手册
type: docs
cascade:
  type: docs
---
```

### 栏目根只是导航起点 {#sections}

```yaml {title="hugo.yml"}
params:
  ui:
    docs_section: docs
    blog_section: blog
```

这两个键 **不决定外壳**，只告诉主题文档树与博客树的根在哪，用于解析侧栏根、快捷入口与默认图标。上面 `content/handbook/` 的例子照样有文档外壳，`docs_section` 保持 `docs` 不影响它。

需要让 docs 页的侧栏根变成站点首页，而不是文档栏目时：

```yaml {title="hugo.yml"}
params:
  ui:
    docs_sidebar_root: home # home | section
```

取值只有这两个，其它值构建失败。

### 文档挂在站点根 {#docs-at-root}

以文档为主的站点可以把 `docs` 分区发布到 URL 根路径，源码仍然放在 `content/docs/` 下。这需要三段配置一起给出。

第一段用 Hugo 原生的 `permalinks` 去掉 URL 里的 `docs/` 段：

```yaml {title="hugo.yml"}
permalinks:
  page:
    docs: /:sections[1:]/:slug/
  section:
    docs: /:sections[1:]
```

第二段让物理站点根索引仍可作为链接目标，但不再争抢同一个输出路径。每种语言的站点根索引（`content/_index.md`、`content/_index.zh.md`）都要写：

```yaml {title="content/_index.zh.md"}
---
title: 产品文档
build: { render: link }
---
```

第三段把侧栏根声明为站点首页，让侧栏与翻页共用同一棵树：

```yaml {title="hugo.yml"}
params:
  ui:
    sidebar_root_enabled: true
    docs_sidebar_root: home
```

`docs_sidebar_root: home` 之后，站点首页的所有顶层分区都会进入这棵树。博客、社区、下载这类不属于阅读序列的概览分区，在自己的 `_index.md` 里设 `toc_root: true` 退出，它们既不出现在树里，也不成为翻页目标：

```yaml {title="content/blog/_index.md"}
---
title: 博客
toc_root: true
---
```

文档此时与博客、社区等分区共享 URL 根路径。构建加 `--printPathWarnings`，发布前解决所有重复目标。

### 落地页 {#landing}

任意页面加 `layout: landing` 即使用落地页布局：顶栏 + 分区拼装的正文 + 页脚，没有侧栏。数据写法见[首页与落地页](/zh/docs/customize/home/)。

```yaml {title="hugo.yml"}
params:
  ui:
    landing_search: true
```

`landing_search: false` 会把搜索入口从落地页外壳里去掉，其它页面不受影响。

## 侧栏 {#sidebar}

侧栏树来自 `content/` 的目录结构，按 `weight` 排序，有 `linkTitle` 时用它作为标签。可调的是密度与尺寸：

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

- `sidebar_menu_compact` 只展开当前分支及邻近条目；设为 `false` 时整棵树全展开。
- `sidebar_menu_foldable` 允许读者手动展开 / 折叠分区。博客栏目默认展开；某个分区要默认收起，在它的 `_index.md` 里写 `sidebar_expanded: false`。
- `sidebar_expand_levels` 是默认展开的层级数。
- `sidebar_menu_truncate` 是单个分区最多渲染的条目数，避免上千页的目录把 HTML 撑到不可用。
- `sidebar_width_min` / `sidebar_width_max` 是桌面端拖拽调宽的上下限（像素）。读者调整后的宽度存在浏览器本地，双击分隔条恢复默认。
- `sidebar_item_overflow` 默认 `ellipsis`（长标题省略），中文长标题多的站点可以改 `wrap` 换行。

折叠状态、宽度与滚动位置保存在读者本地，按语言隔离。小于 `md` 时侧栏变成带遮罩的抽屉。

单页去掉侧栏用 front matter：

```yaml {title="content/docs/fullscreen-report.md"}
---
title: 全屏报告
sidebar_enabled: false
---
```

### 显式导航树 data/docs_nav.json {#docs-nav}

侧栏树默认从 `content/` 推导。站点也可以给出一份显式导航清单，三个条件同时成立时主题改用它渲染：

- 站点存在 `data/docs_nav.json` 且其中有 `sections` 键；
- 页面的 type 是 `docs` 或 `book`；
- 解析出的侧栏根不是站点首页。

文件是一棵嵌套的节点树。每个节点用 `page` 指向内容路径，`url` 是它的链接，`children` 是子节点；`active_path_by_url` 记录每个 URL 对应的祖先链，供当前项高亮使用：

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

URL 在比较前去掉语言前缀，一份文件服务所有语言。

这棵树同时决定翻页顺序，侧栏与上一页 / 下一页不会出现两种排序。`sections` 为空数组时构建失败（`data/docs_nav.json does not define any Docs navigation sections`），`page` 指向不存在的页面同样失败（`Docs navigation page not found`）。带 `manual_link` 的占位节点与 `sidebar_divider` 分隔行留在侧栏里，但不会成为翻页目标。

适用场景是导航顺序由外部工具生成的站点，例如从 Sphinx toctree 迁移过来、需要冻结既有章节顺序的手册。顺序由 `content/` 的 `weight` 维护时不需要这个文件。

### 侧栏图标密度 {#sidebar-icons}

页面 front matter 里的 `icon` 会出现在侧栏。叶子页全部带图标会降低可读性，用密度策略控制：

```yaml {title="hugo.yml"}
params:
  ui:
    sidebar_icon_policy: groups # all | groups | none
```

| 取值 | 效果 |
| --- | --- |
| `all` | 每个有图标的条目都显示（未设置时的兼容默认值） |
| `groups` | 只有根节点和有子页的节点显示图标 |
| `none` | 侧栏不显示条目图标 |

非法取值只发警告并回落到 `all`，不让构建失败。本站使用 `groups`。

### 在侧栏里展开标题 {#sidebar-headings}

Book 页可以在侧栏当前行下展开 h2–h4 分支，便于在长章节内跳转：

```yaml {title="hugo.yml"}
params:
  ui:
    sidebar_headings: 3 # false | true | 2 | 3 | 4
```

整数指定展开到第几级（2–4），`true` 等于 2（只展开 h2），`false` 关闭。取值超出范围构建失败。只对 `type: book` 的页面生效，且只在侧栏当前行下展开。

## 目录 TOC {#toc}

右栏大纲由 Hugo 从 Markdown 标题生成，收录层级是 Hugo 原生配置：

```yaml {title="hugo.yml"}
markup:
  tableOfContents:
    startLevel: 2
    endLevel: 4
    ordered: false
```

主题只管跟踪行为：

```yaml {title="hugo.yml"}
params:
  ui:
    scroll_spy: false
```

默认 **关闭** 滚动跟踪。设为 `true` 开启后，大纲绘制连续轨道、高亮当前区段并标出位置。读者可以整体折叠右栏，状态存在本地。小于 `xl` 时右栏隐藏，大纲内容移进侧栏抽屉。

单页隐藏大纲用 front matter `notoc: true`。

只有进入 Hugo 目录的标题才出现在大纲里：Markdown 型 shortcode（`{{%/* … */%}}`）输出的标题会进，普通 shortcode（`{{</* … */>}}`）输出的通常不会。结构性标题应留在 Markdown 里。

## 栏目首页样式 {#section-index}

带 `_index.md` 的分区会自动列出子页。两种样式：

```yaml {title="hugo.yml"}
params:
  ui:
    section_index: cards # list | cards
    section_index_columns: 2
```

- `list`（默认）：每个子页一个标题 + 描述段落；
- `cards`：网格卡片，读子页的 `title`（或 `linkTitle`）、`description` 与 `icon`。

可以按分区覆盖，非法取值构建失败：

```yaml {title="content/docs/components/_index.md"}
---
title: 组件
section_index: cards
section_index_columns: 3
---
```

相关的页面级开关：`no_list: true` 不列子页；`simple_list: true` 只输出一个无描述的项目符号列表；子页设 `hide_summary: true` 把自己从列表里去掉。**不要手写子页清单**：手写的清单会与侧栏失同步。

## 页宽 {#page-width}

```yaml {title="hugo.yml"}
params:
  page_width: normal # normal | wide | full
```

`normal` 是常规阅读宽度，`wide` 放宽正文栏，`full` 铺满视口。可以逐页或按分区覆盖；宽表格、大图与 API 参考页常用 `wide`：

```yaml {title="content/docs/api/reference.md"}
---
title: 接口参考
page_width: wide
---
```

Book 页另有一个 `reading_width`（`slim` / `normal` / `wide`），改的是正文本身的阅读行宽，不动外壳。两个键取值非法都让构建失败。

## 顶栏与页脚开关 {#chrome}

顶栏与页脚属于逐页的布局决定，写在 front matter **顶层**（不在 `ui` 下），可以用分区 cascade 一次设定：

```yaml {title="content/docs/_index.md"}
---
title: 文档
cascade:
  navbar_enabled: false
  footer_style: slim
---
```

行为见[导航与菜单](/zh/docs/customize/navigation/#navbar-disable)与[品牌外观](/zh/docs/customize/brand/#footer)，键的定义见[页面参数](/zh/docs/write/frontmatter/)。

## 验证 {#verify}

```bash
hugo --printPathWarnings --panicOnWarning
```

- 构建输出 `Total in …`，没有 ERROR / WARN；
- 新建的 `type: docs` 页面有左侧栏。没有则检查 cascade 是否覆盖到该页，以及 `shell_types` 是否包含这个 type；
- 拖动侧栏分隔条，刷新后宽度保留，双击恢复默认；
- 窗口缩到 `md` 以下时侧栏变成抽屉且可关闭，缩到 `xl` 以下时大纲移进抽屉；
- 栏目首页的卡片数量与侧栏子页数量一致；
- `page_width: wide` 的页面比相邻页面宽；
- 文档挂在站点根时，`hugo --printPathWarnings` 没有重复输出路径的告警。

## 相关 {#related}

- [配置总览](/zh/docs/customize/config/#shell) — 外壳、侧栏、目录参数的默认值
- [组织内容](/zh/docs/write/organize/) — 目录结构、`weight` 与侧栏树
- [导航与菜单](/zh/docs/customize/navigation/) — 顶栏、栏目切换器与翻页
- [首页与落地页](/zh/docs/customize/home/) — `layout: landing` 的数据写法
- [页面参数](/zh/docs/write/frontmatter/) — 逐页覆盖用到的 front matter 键
