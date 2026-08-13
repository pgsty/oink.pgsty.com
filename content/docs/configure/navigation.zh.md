---
title: 导航与菜单
weight: 20
description: 配置导航、语言切换、侧栏与页面大纲。
---

OINK 把 Hugo 的内容树和菜单模型组织成一套文档工作台：出现在所有布局上的站点导航栏、可折叠且可调整宽度的分区侧边栏、位于右栏的可折叠页面大纲，以及站点页脚。同一套结构适用于英文、中文和从右向左书写的语言。

## 站点导航栏 {#site-navbar}

导航栏由 Hugo 的 `main`
菜单与 OINK 自动生成的控件组成：版本选择器、语言选择器、颜色模式控件、搜索，以及项目仓库链接。**它会在所有布局上渲染**——落地页、文档、博客、Swagger 和分类页面都不例外，因此站点级导航在任何位置都只有一次点击的距离。

### 关闭导航栏 {#navbar-enabled}

`navbar_enabled` 默认为 `true`。可以对整个站点关闭导航栏，也可以通过 front
matter（前置元数据）cascade 对某个分区关闭，或只对单个页面关闭：

```yaml {filename="hugo.yaml"}
params:
  ui:
    navbar_enabled: false
```

```yaml
---
title: 独立报告
navbar_enabled: false
---
```

Front matter 的优先级高于站点参数，而且显式写出的 `false`
在任何层级都会生效。关闭导航栏后，OINK 会恢复此前被导航栏取代的界面：移动端子导航、侧边栏的品牌与搜索行、目录轨道上的工具按钮，以及侧边栏底部的工具区。这个开关适用于必须独占整个视口的页面，不应当作常规排版偏好使用。

### 两种状态，没有独立的移动菜单 {#navbar-states}

导航栏只有两种状态：

| 宽度        | 状态                                      |
| ----------- | ----------------------------------------- |
| `lg` 及以上 | 完整：品牌、菜单文字标签与各个工具控件    |
| 小于 `lg`   | 紧凑：先是 Logo，其余条目全部右对齐为图标 |

紧凑状态并不是精简过的菜单。菜单项保留各自的图标，搜索仍是放大镜，版本、语言与主题控件也停在原处——没有任何东西会折叠进汉堡按钮，因为根本不存在独立的移动菜单。唯一按宽度切换的控件出现在带侧边栏的页面上：小于
`md` 时会多出一个图标，用于打开侧边栏抽屉。

> [!NOTE] `navbar_accordion_single_open`
> 已废弃。该参数会被忽略，请从现有配置中删除。

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

### 嵌套下拉菜单 {#nested-menus}

顶层菜单支持一级下拉。用 Hugo 的 `parent` 建立父子关系：

```yaml {filename="hugo.yaml"}
menus:
  main:
    - identifier: docs
      name: 文档
      pageRef: /docs
      weight: 20
    - identifier: docs-tutorial
      parent: docs
      name: 快速上手
      pageRef: /docs/tutorial
      weight: 10
      params:
        icon: fa-solid fa-route
        description: 安装 OINK 并创建第一个文档站
```

子项的 `params.description` 会显示在下拉项的标题下方，帮助读者判断该去哪。

交互上有一个关键设计：**父级本身就是一个普通链接**。悬停或键盘聚焦时展开面板，点击或按 Enter 则直接跳转到父级页面。这里没有单独的展开箭头，父级页面也不会被自己的下拉「劫持」。Esc 关闭面板并把焦点留在链接上；触屏读者会直接进入父级页面，那里的正文同样列出了这些链接。

> [!NOTE] 只支持一级子项。更深的层级会在构建时产生警告，并降级为静态分组标题——不会生成三级悬浮菜单。深层信息架构应该放进内容侧栏，而不是顶部菜单。

### 版本菜单 {#version-menu}

配置 `params.versions`
后会显示版本选择器。它是一个分支图标，悬停或键盘聚焦时展开列表，与语言、主题控件共用同一套浮层样式。条目可以表示标题、分隔线、正式版本、开发版本或站点变体：

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
构造语言目标。当前页面缺少某种语言译文时，会链接到该语言首页，而不是生成损坏的 URL。只配置一种语言时不显示控件；配置两种或更多语言时，点击语言图标会按
`weight`
顺序切换到下一种语言，悬停半秒或聚焦控件则打开完整菜单。当前站点按英文、简体中文的顺序循环。目标链接包含
`lang`、`hreflang`、locale 与文字方向属性。

### 浅色/深色主题菜单 {#lightdark-theme-menu}

启用颜色模式后，导航栏会显示主题控件。点击它在浅色与深色之间切换，悬停或聚焦则展开「跟随系统 / 浅色 / 深色」三项选择器，其中「跟随系统」采用读者操作系统的设置。详见[浅色/深色模式菜单](/zh/docs/appearance/styling/#lightdark-mode-menu)。

### 搜索框 {#search-box}

搜索是导航栏上的一个放大镜图标，点击后打开命令面板；`Cmd/Ctrl-K`
以及在可编辑控件之外按下的 `/`
同样可以打开它。启用离线搜索后该图标才会出现；关闭导航栏时，搜索行会回到侧边栏顶部。在线搜索集成仍可通过显式配置启用。详见[搜索](/zh/docs/advanced/search/)。

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

小于 `lg` 时，图标就是菜单项仅剩的表现形式，因此每个顶层菜单项都应配置 `pre`
图标。没有图标的菜单项在紧凑状态下无内容可显示。

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
---
```

同级条目的图标用法应保持一致。图标只是辅助线索，不能取代文字标签。

### 侧栏图标密度 {#sidebar-icon-policy}

叶子页面全都带图标会产生明显的视觉噪声。用 `sidebar_icon_policy` 控制密度：

```yaml {filename="hugo.yaml"}
params:
  ui:
    sidebar_icon_policy: groups # all | groups | none
```

| 取值     | 效果                                               |
| -------- | -------------------------------------------------- |
| `all`    | 每个有图标的侧栏条目都显示                         |
| `groups` | 只有根节点和带子页的节点显示图标，普通叶子页不显示 |
| `none`   | 侧栏完全不显示条目图标                             |

未设置时的兼容默认值是 `all`。**新站点建议显式设为
`groups`**——保留了分组的语义标识，同时去掉叶子层的噪声。本站就用这个设置。

无效取值会产生警告并回退到 `all`。

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

### 将分区设为侧边栏根节点 {#sidebar-root}

侧边栏树以读者当前所在的顶层分区为根，树上方那一行标出的就是这个根节点。规模较大的子树——带版本的 API 参考、独立的手册——可以自己成为一个根节点，让读者不必离开当前分区就能切换过去：

```yaml
params:
  ui:
    sidebar_root_enabled: true
    sidebar_root_menu: true
```

然后在后代分区的 `_index.md` 中设置：

```yaml
---
title: API Reference v2
sidebar_root_for: self
sidebar_root_link_self: true
---
```

`self` 会把该根节点应用于分区索引及其后代；`children`
会把索引留在父级树中，只限制其后代。根分区可以嵌套，但冗余或无效取值会触发构建警告。

**切换器的范围限定在当前顶层分区之内**：条目是该分区本身（默认项），加上每个设置了
`sidebar_root_for: self`
的后代分区。同级的其他顶层分区不会列出——在文档与博客之间跳转是导航栏的职责。因此，没有可切换后代的分区根本不显示下拉框，那一行只是一个指向分区落地页的普通链接，没有边框，与树的顶层条目对齐。

分类术语页没有内容层级，因此术语会采用其成员共同所属的顶层分区。从文档页面点进某个标签后，侧边栏保留的仍是文档树和文档根链接，而不会回退到站点级的树；成员横跨多个分区的术语则不显示根节点行。

## 页面目录 {#table-of-contents}

Hugo 根据 Markdown 标题生成右侧页面大纲。OINK 把它渲染为固定右栏中的第一个分组，后面依次排列当前分区的分类标签云。读者可以折叠整个右栏，状态保存在本地。

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

### 右栏分组 {#rail-groups}

右栏里的每个分组都使用同一套标题行：图标、标题和折叠箭头，整行作为一个条目高亮。大纲分组的标题是「目录」，它的图标是一个三横线字形，作用是折叠整个右栏，而不只是装饰。在侧边栏抽屉中，该分组保留静态的三横线图标，从而与旁边的分类标题保持一致。

分类分组的图标可以按分类复数名配置：

```yaml {filename="hugo.yaml"}
params:
  ui:
    taxonomy_icons:
      categories: fa-solid fa-folder
      tags: fa-solid fa-tags
      projects: fa-solid fa-diagram-project
```

`categories` 默认使用文件夹图标，`tags`
默认使用标签图标；其他分类在这里指定之前，一律使用通用的形状图标。标签云本身的范围规则参见[分类法支持](/zh/docs/content/taxonomy/#sidebar-and-rail)。

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

普通内容页上方和分类结果中会显示面包屑，这一行同时承载页面操作。顶层分区页面保留只有一级的面包屑，使这一行在任何层级都保持稳定。全局关闭面包屑的方式如下：

```yaml
params:
  ui:
    breadcrumb_disable: true
    taxonomy_breadcrumb_disable: true
```

页面或分区 cascade 也可以设置
`ui.breadcrumb_disable`。面包屑标签来自本地化页面标题，而且必须与侧边栏遵循同一逻辑层级。

### 页面操作 {#page-actions}

页面操作是面包屑行末尾的一个纯图标拆分按钮。左半边复制本页 Markdown，成功后翻转为绿色对勾；右侧箭头展开一个包含十项操作的菜单，分为两组。上半组负责把页面内容带到别处：

- 复制 Markdown 文本
- 在 ChatGPT 中打开
- 在 Claude 中打开
- 查阅 Markdown 源码
- 查阅编辑历史

其后是一条分隔线，下半组负责修改或产出内容：

- 编辑本页
- 创建子页面
- 提交文档 issue
- 提交项目 issue
- 打印整个分区

配置的 `page_context_menu.links`
排在最后，前面还有一条分隔线。每个条目只有在能解析出目标时才出现：Markdown 相关操作需要
`markdown` 输出格式，仓库相关操作需要 `github_repo`，项目 issue 需要
`github_project_repo`，助手操作则需要
`params.ui.page_context_menu.assistant_links`。

在博客根分区及其一级子分区上，左半边变成 RSS 链接，菜单中仍保留「复制 Markdown 文本」。博客叶子页面不显示订阅图标。没有 Markdown 输出的页面会去掉左半边，改为渲染带文字的「操作」按钮。

`create_child_page`、`create_project_issue` 与 `print_section`
现在都是注册表中的一等操作，因此也会出现在[命令面板](/zh/docs/advanced/search/#palette-contents)中。页面级的
`print` 操作已废弃，读者直接使用浏览器自带的 `Cmd/Ctrl+P`。

## 站点页脚 {#site-footer}

页脚会在所有布局上渲染，由 `footer_style` 在三种形态之间选择：

| 取值   | 渲染内容                       |
| ------ | ------------------------------ |
| `fat`  | 版权行之上的多列网格（默认值） |
| `slim` | 只有版权行                     |
| `none` | 完全不渲染页脚                 |

```yaml {filename="hugo.yaml"}
params:
  ui:
    footer_style: fat
```

Front matter（包含分区 cascade）的优先级高于站点取值：

```yaml
---
title: 内嵌参考
footer_style: slim
---
```

**无法识别的取值会令构建失败**，而不是静默回退。

### 胖页脚数据 {#footer-data}

多列网格读取 `data/footer/<语言>.yaml`；单语言站点可以直接使用
`data/footer.yaml`：

```yaml {filename="data/footer/zh.yaml"}
brand:
  name: 产品文档
  tagline: 一段简短的**支持 Markdown 的**说明。
  slogan: 贴近产品，给出明确答案。
columns:
  - title: 文档
    links:
      - { label: 文档, url: /docs/ }
      - { label: 博客, url: /blog/ }
  - title: 项目
    links:
      - { label: GitHub, url: https://github.com/pgsty/oink, external: true }
```

`brand.name` 与 `brand.logo`
未设置时回退到站点自身的品牌名、Logo 和 wordmark。`tagline` 和 `slogan`
会渲染 Markdown。站内 `url` 以语言根为基准解析；`external: true`
会在新标签页打开链接并附带
`rel="noopener noreferrer"`。网格的列数由数据中的列数决定。

没有数据的 `fat` 页脚会降级为
`slim`，因此站点可以先保留默认值，再逐步补齐各列内容。

> [!NOTE] `data/home/<语言>.yaml` 中的 `footer`
> 块仍会作为回退读取。它此前只在首页渲染，现在会应用到全站，因此在继续使用这个旧位置之前，请确认这些链接列从文档深层页面看仍然合理。

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
