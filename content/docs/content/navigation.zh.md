---
title: 导航与菜单
weight: 50
icon: fa-solid fa-bars
description: 配置导航、语言切换、侧栏与页面大纲。
---

OINK 把 Hugo 的内容树和菜单模型组织成一套文档工作台：全局导航栏、可折叠且可调整宽度的分区侧边栏，以及可折叠的页面大纲。同一套结构适用于英文、中文和从右向左书写的语言。

## 站点导航栏 {#site-navbar}

全局导航栏由 Hugo 的 `main`
菜单与 OINK 自动生成的控件组成。根据配置和页面类型，其中可以显示版本、语言、颜色模式与搜索控件。

### 添加 `main` 菜单项 {#adding-main-menu-entries}

可以在页面 Front Matter 中定义菜单项：

```yaml
---
title: 文档
linkTitle: 文档
menu:
  main:
    weight: 20
    pre: <i class="fa-solid fa-book" aria-hidden="true"></i>
---
```

权重越小，位置越靠前。站点级外部链接写法类似：

```yaml
menus:
  main:
    - name: GitHub
      identifier: github
      weight: 50
      url: https://github.com/pgsty/oink
      pre: <i class="fa-brands fa-github" aria-hidden="true"></i>
```

需要在配置中引用菜单项时，应为其设置 `identifier`。`name` 或 `linkTitle`
可以按语言翻译，但标识符必须稳定。

### 版本菜单 {#version-menu}

配置 `params.versions`
后会显示版本选择器。条目可以表示标题、分隔线、正式版本、开发版本或站点变体：

```yaml
params:
  version: v1.0.0
  version_menu: v1.0.0
  version_menu_pagelinks: true
  versions:
    - version: v1.1.0-dev
      kind: next
      url: https://next.example.org/
    - version: v1.0.0
      kind: latest
      url: https://docs.example.org/
```

`version`
标识已发布的站点变体，不一定是 Git 引用。安装命令等必须使用可解析标签的内容，应改用项目显式定义的发布引用参数。启用页面链接后，OINK 会先尝试目标版本中的同一路径，找不到时再使用条目配置的 URL。

### 语言菜单 {#language-menu}

OINK 根据 Hugo 的 `AllTranslations`
构造语言目标。当前页面缺少某种语言译文时，会链接到该语言首页，而不是生成损坏的 URL。只配置一种语言时不显示控件；配置两种或更多语言时，直接点击会按
`weight`
顺序切换到下一种语言，悬停半秒或聚焦控件则打开完整菜单。当前站点按英文、简体中文的顺序循环。目标链接包含
`lang`、`hreflang`、locale 与文字方向属性。

### 浅色/深色主题菜单 {#lightdark-theme-menu}

启用颜色模式后，导航栏与文档工作台会显示主题控件。详见[浅色/深色模式菜单](/zh/docs/content/lookandfeel/#lightdark-mode-menu)。

### 搜索框 {#search-box}

启用离线搜索后，文档工作台会使用本地搜索对话框。侧边栏按钮会显示当前平台快捷键（Command/Ctrl+K）。在线搜索集成仍可通过显式配置启用。详见[搜索](/zh/docs/advanced/search/)。

### 为导航栏添加图标 {#adding-icons-to-the-navbar}

在菜单项中使用 `pre` 或 `post`。OINK 已在本地提供免费版 Font Awesome 资源：

```yaml
menus:
  main:
    - name: 源码
      identifier: source
      url: https://github.com/pgsty/oink
      weight: 50
      pre: <i class="fa-brands fa-github" aria-hidden="true"></i>
      post: <span class="visually-hidden">（外部链接）</span>
```

装饰性图标需要设置
`aria-hidden="true"`；链接本身必须保留有意义的文字或无障碍标签。在新标签页打开的外部链接必须使用
`rel="noopener"`。

## 侧边导航 {#side-nav}

文档页与博客页的左侧面板由内容层级自动生成。OINK 按 `weight` 排序，并在存在
`linkTitle` 时用它作为标签。分区来自 `_index.md`；翻译后的分区需要配套
`_index.zh.md`，才能正确本地化导航元数据。

从侧边栏隐藏页面：

```yaml
toc_hide: true
```

从分区落地页摘要中隐藏页面则使用
`hide_summary: true`。只有页面确实不应出现在这两个发现入口中时，才同时设置二者。

### 侧边导航选项 {#side-nav-options}

常用控制项如下：

```yaml
params:
  ui:
    sidebar_menu_compact: true
    sidebar_menu_foldable: true
    sidebar_menu_truncate: 128
    sidebar_cache_limit: 2000
    sidebar_search_disable: false
    sidebar_width_min: 220
    sidebar_width_max: 480
    sidebar_item_overflow: ellipsis
```

- `sidebar_menu_compact` 只显示当前分支和附近条目；
- `sidebar_menu_foldable` 允许读者展开或折叠分区；
- `sidebar_menu_truncate` 限制条目数，数值过小时会发出构建警告；
- `sidebar_cache_limit` 在站点规模超过阈值后启用共享导航标记；
- `sidebar_width_min` 与 `sidebar_width_max` 限制桌面端拖拽调整的宽度；
- `sidebar_item_overflow` 默认为 `ellipsis`，长标签需要换行时改用 `wrap`。

折叠状态、宽度和滚动位置保存在读者本地。移动端会转换为带遮罩层和安全焦点控件的可关闭抽屉。

### 为侧边导航添加图标 {#adding-icons-to-the-side-nav}

在页面 Front Matter 中设置 `icon`：

```yaml
---
title: 运维
icon: fa-solid fa-screwdriver-wrench
---
```

同级条目的图标用法应保持一致。图标只是辅助线索，不能取代文字标签。

### 为侧边导航添加手动链接 {#adding-manual-links-to-the-side-nav}

在所需位置创建占位页面：

```yaml
---
title: API 状态
weight: 90
manualLink: https://status.example.org/
manualLinkTitle: 实时服务状态
manualLinkTarget: _blank
---
```

内部内容引用应使用 `manualLinkRelref` 而不是
`manualLink`；Hugo 无法解析目标时会令构建失败。OINK 会为新标签页链接补充
`noopener`。由于 Hugo 仍会为占位文件生成页面，正文应简短说明实际去向。

### 将分区设为侧边栏根节点（实验性） {#sidebar-root}

启用根侧边栏：

```yaml
params:
  ui:
    sidebar_root_enabled: true
    sidebar_root_menu: true
```

然后在分区的 `_index.md` 中设置：

```yaml
---
title: API Reference v2
sidebar_root_for: self
sidebar_root_link_self: true
---
```

`self` 会把该根节点应用于分区索引及其后代；`children`
会把索引留在父级树中，只限制其后代。可选的根菜单用于在不同根节点之间切换。根分区可以嵌套，但冗余或无效取值会触发构建警告。

## 页面目录 {#table-of-contents}

Hugo 根据 Markdown 标题生成右侧页面大纲。OINK 将其渲染为固定文档面板，并放置快捷链接、语言与主题控件、仓库元数据和分类标签。读者可以折叠该面板，状态保存在本地。

由 Markdown 短代码（`{{%/* ... */%}}`）输出的标题会进入 Hugo 目录；仅由标准短代码（`{{</* ... */>}}`）输出的标题通常不会进入。因此，只要条件允许，内容结构都应保留在 Markdown 中。

### 目录定制 {#toc-customization}

在单个页面隐藏大纲：

```yaml
notoc: true
```

配置 Hugo 收录的标题层级：

```yaml
markup:
  tableOfContents:
    startLevel: 2
    endLevel: 4
    ordered: false
```

`toc_on_this_page`
等标签在站点 i18n 资源包中翻译。自定义 CSS 调整大纲轨道或固定面板尺寸后，需要测试活动项跟踪、缩放、键盘焦点，以及完全没有标题的页面。

### 使用 ScrollSpy 跟踪目录活动项 {#toc-entry-tracking}

OINK 使用本地 Bootstrap
ScrollSpy 补丁与 IntersectionObserver 跟踪活动标题。工作台会绘制连续轨道、活动区段和位置标记。为某个页面关闭跟踪：

```yaml
params:
  ui:
    scrollSpy:
      disable: true
```

旧版 ScrollSpy 配置也接受全局
`rootMargin`。它会改变条目进入活动状态的时机，应在短分区、长分区和直接片段导航中分别测试。

#### ScrollSpy 高级定制 {#advanced-scrollspy-customization}

优先使用配置与项目 CSS。覆盖 ScrollSpy 属性 Partial 或 `docs-shell.js`
会形成实现级分支；必须增加浏览器 Fixture，覆盖哈希更新、前进/后退导航、尺寸变化、减少动态效果模式，以及存在重复或缺失 ID 的页面。

## 面包屑导航 {#breadcrumb-navigation}

普通内容页上方和分类结果中会显示面包屑。全局关闭方式如下：

```yaml
params:
  ui:
    breadcrumb_disable: true
    taxonomy_breadcrumb_disable: true
```

页面或分区 cascade 也可以设置
`ui.breadcrumb_disable`。面包屑标签来自本地化页面标题，而且必须与侧边栏遵循同一逻辑层级。

## 标题自链接 {#heading-self-links}

使用方站点可以启用 OINK 标题渲染钩子：

```go-html-template
{{ partial "td/render-heading.html" . }}
```

生成的 `.td-heading-self-link` 控件默认使用
`#`。它在触控设备上始终可见，在指针设备上则于悬停或聚焦时出现。链接必须支持键盘访问，并保留足以避开固定导航的滚动偏移。

## 标题别名与页内目标 <a id="a-heading-aliases"></a> {#heading-aliases}

修改标题可能破坏外部片段链接，因此标题 ID 应按公开路由对待。需要重命名 ID 时，应保留旧 ID 的空锚点，并显式写入新 ID：

```html
## Quickstart <a id="get-started"></a> {#quickstart}
```

别名和其他页内目标应使用空的 `<a id="..."></a>`。不要仅为片段目标使用
`span`。ID 必须唯一、稳定，在可行时使用 ASCII，并在各语言版本中保持一致。

## 快速开始 <a id="get-started"></a> {#quickstart}

这个真实标题演示了 `#get-started` 与 `#quickstart`
都能到达同一位置。译文标题应显式写入英文页面渲染后的 ID，不要依赖不同语言各自生成的自动 slug。

### 实现说明 {#heading-aliases-implementation-notes}

- 文档为固定界面设置全局滚动偏移；
- 内置块目标使用 `td-anchor-no-extra-offset`，避免重复应用额外偏移；
- 翻译审计会比较英文与中文页面渲染后的标题 ID；
- 删除旧别名属于破坏性文档变更，需要重定向或明确记录兼容性决策。
