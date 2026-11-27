---
title: 导航与菜单
linkTitle: 导航与菜单
description: 配置顶栏菜单与下拉、栏目切换器、面包屑、页面操作、翻页器和页脚链接。
weight: 40
search_keywords:
  [导航, 菜单, 顶栏, 下拉菜单, 面包屑, 翻页, 页脚, 页面操作, navigation, menu, navbar, breadcrumb, pager, footer]
aliases:
  - /docs/configure/navigation/
---

每页顶部的菜单就是站点的地图：文档、博客、下载这几个读者在任何页面都应该能一步到达的地方。它按语言写在 `hugo.yml` 里，每种语言写一次。其余的移动方式，包括侧栏顶部的栏目切换器、面包屑导航、上一页 / 下一页与反向链接，都从内容树推导而来，你要做的是调整，而不是从头搭建。侧栏树与页面目录见[布局与页面类型](/zh/docs/customize/layout/)。

## 顶栏菜单 {#main-menu}

顶层入口写在各语言的 `menus.main` 下：

```yaml {title="hugo.yml"}
languages:
  zh:
    menus:
      main:
        - identifier: docs
          name: 文档
          pageRef: /docs
          weight: 20
        - identifier: blog
          name: 博客
          pageRef: /blog
          weight: 50
        - identifier: download
          name: 下载
          pageRef: /download
          weight: 60
          params:
            icon: fa-solid fa-download
```

条目按 `weight` 从小到大排列。指向本站页面时用 `pageRef`：Hugo 会在每种语言里解析到对应页面，并在该页面以下的所有页面上把这一项标为当前项；其它地址用 `url`。外部 `url` 在新标签页打开，带 `rel="noopener noreferrer"` 和一个外链角标。`name` 按语言翻译，`identifier` 在各语言中保持一致，因为别的配置靠它引用条目：`params.ui.quick_links` 按 identifier 挑选[命令面板](/zh/docs/customize/panel/)里的快速链接，默认图标也按它匹配。

页面也可以在自己的 front matter 里把自己加进菜单，适合「这一页本身就是顶层入口」的情况：

```yaml {title="content/download/_index.md"}
---
title: 下载
menu:
  main:
    weight: 30
---
```

顶栏右端的 GitHub 按钮不是菜单项，identifier 为 `github` 的菜单项会被跳过。这个按钮指向 `params.github_project_repo`，未设置时指向 `params.github_repo`，要改它就改这两个参数，见[仓库与页面信息](/zh/docs/customize/repository/)。

### 下拉菜单 {#dropdown}

给条目写上 `parent`，它就进入该父项的下拉面板：

```yaml {title="hugo.yml"}
menus:
  main:
    - identifier: docs
      name: 文档
      pageRef: /docs
      weight: 20
    - identifier: docs-start
      parent: docs
      name: 快速上手
      pageRef: /docs/start
      weight: 10
      params:
        icon: fa-solid fa-rocket
    - identifier: docs-components
      parent: docs
      name: 组件
      pageRef: /docs/components
      weight: 20
      params:
        icon: fa-solid fa-cubes
```

面板只有一列，每行一个图标加一个名称；子项的 `params.description` 不会显示，设置 `params.columns` 会被忽略并产生构建警告。父项仍是普通链接：悬停或聚焦时展开面板，点击或按 {{< kbd "Enter" >}} 进入父级页面。触屏读者因此会直接进入那一页，所以那一页应当列出同样的子链接，分区索引页本身就会列出。键盘操作时，{{< kbd "↓" >}} 展开面板并聚焦第一项，{{< kbd "Esc" >}} 关闭面板并把焦点还给父项；点击面板外部也会关闭。

下拉只支持一级。孙级条目在面板里渲染成普通的分组标题，不会生成三级悬浮菜单，构建时会警告 `only one interactive child level is supported`。更深的层级放进侧栏。

### 菜单图标 {#menu-icons}

视口小于 `lg` 时，顶栏的顶层条目只显示图标，所以每个顶层条目都应该有图标。条目的图标取以下第一个可用值：

1. 菜单项自己的 `params.icon`；
2. 目标页面 front matter 中的 `icon`；
3. 按 identifier、目标页所在分区或 URL 第一段匹配的内置默认值（`docs`、`guide`、`blog`、`news`、`examples`、`community`、`about`、`download`、`github`）；
4. `fa-solid fa-link`。

图标写成一对 Font Awesome class。主题自带免费图标集，不需要下载任何东西。把 `params.icon` 设为 `false` 或 `"none"` 可以去掉图标，该条目在任何宽度下都保留文字标签：

```yaml {title="hugo.yml"}
menus:
  main:
    - identifier: handbook
      name: 运维手册
      pageRef: /handbook
      weight: 40
      params:
        icon: false
```

### 标签菜单 {#taxonomy-menu}

指向分类法列表页（例如 `/tags/`）的顶层条目不需要写子项：面板会自动列出该分类法的术语与页面数，用得最多的排在前面。条目的写法与其它条目相同，见[顶栏菜单里的分类面板](/zh/docs/customize/taxonomy/#navbar-panel)。

## 顶栏控件 {#navbar}

顶栏高 50px，开头是品牌 Logo 或字标，中间是菜单，末端是工具控件。它按视口分三档：

| 视口 | 状态 |
| --- | --- |
| `lg` 及以上 | 品牌、菜单文字，以及搜索、版本、语言、外观与 GitHub 控件；没有抽屉按钮 |
| `md` 至小于 `lg` | 中间显示菜单图标，末端是工具控件；没有抽屉按钮 |
| 小于 `md` | 中间显示菜单图标，末端只有搜索与抽屉按钮；版本、语言、外观与快捷键帮助移到页脚最底层栏 |

有侧栏的页面上，抽屉按钮打开侧栏；首页与 Landing 页面上，它打开站点菜单。

菜单条目任何时候都不换行。品牌区、固定的桌面侧栏和工具控件把空间挤窄时，带图标的条目先收成纯图标，设置了 `params.icon: false` 的条目保留文字；仍然放不下的条目收进末尾的 `…` 面板，在那里显示完整的图标、名称与子项。

每个工具控件在对应功能配置好后出现：搜索需要 `params.offline_search`（[全文检索](/zh/docs/customize/search/)），版本菜单需要 `params.versions`（[多版本](/zh/docs/customize/versions/)），语言菜单在配置两种及以上语言时出现（[多语言](/zh/docs/customize/i18n/)），外观菜单在站点提供明暗模式或预设选择时出现（[品牌外观](/zh/docs/customize/brand/#dark-mode)）。

### 自动隐藏 {#autohide}

长页面上，可以把顶栏占的空间让给正文：

```yaml {title="hugo.yml"}
params:
  ui:
    navbar_autohide: true
```

隐藏后的顶栏仍保留 50px 高度，下面的内容不会移动。指针移入这一带的上方 60%，或用键盘 Tab 进入顶栏时，顶栏在原位淡入，不遮挡页面。唤醒区左右各让出 64px，让折叠后的侧栏与大纲的恢复按钮仍然点得到。

视口小于 768px、粗指针或纯触屏设备上不启用自动隐藏，顶栏始终可见。首页不跟随站点设置，除非它自己的 front matter 打开；Hero 页面保留覆盖在主图上、随主图滚走的顶栏。页面 front matter 顶层的 `navbar_autohide` 或分区 cascade 可以覆盖站点设置。

### 关闭顶栏 {#navbar-disable}

需要占满整个视口的页面（全屏报表、嵌入式应用）可以关闭顶栏。全站关闭：

```yaml {title="hugo.yml"}
params:
  ui:
    navbar_enabled: false
```

或者只关闭某一页、某个分区：

```yaml {title="content/docs/_index.md"}
---
title: 文档
cascade:
  navbar_enabled: false
---
```

顶栏关闭后，主题把它承担的必要功能挪到别处：移动端子导航、侧栏顶部的品牌与搜索行、大纲轨道上的工具按钮。但读者会失去站点菜单，所以只在确实需要的页面上关闭，不要把它当作样式偏好。

## 栏目切换器 {#root-menu}

侧栏顶部那一行用来在整棵树之间切换：文档、博客、一本书，或者你单独提升为根的大型子树。它依次列出所有顶层分区和所有标记了 `sidebar_root_for: self` 的分区并去重；读者当前所在的根不在列表中时，会追加到末尾。没有 permalink 的分区（`build.render: never`）和分隔分组不会出现。没有条目时不渲染切换器，只有一个条目时是一个普通链接，两个及以上才是下拉菜单。

```yaml {title="hugo.yml"}
params:
  ui:
    sidebar_root_enabled: true
    sidebar_root_menu: true
```

两项默认都是 `true`。`sidebar_root_menu: false` 去掉切换器；`sidebar_root_enabled: false` 忽略 `sidebar_root_for`，每个页面都显示它所在顶层分区的树。

要让一棵大子树（带版本的 API 参考、自成一体的手册）成为独立的根，在它的 `_index.md` 中标记：

```yaml {title="content/docs/api-v2/_index.md"}
---
title: API 参考 v2
sidebar_root_for: self
sidebar_root_link_self: true
---
```

取值 `self` 时，分区索引页与它下面的所有页面都使用新树；取值 `children` 时，索引页留在父级的树里，只有后代页面切换到新树。`sidebar_root_link_self`（默认 `true`）让新树顶端的根链接指向该分区自己的索引页，设为 `false` 则指向父级分区。切换器选的是哪棵树，根链接打开的是树里的页面。

要把某个顶层分区或自根分区排除在切换器之外，在它的 front matter 中设置 `sidebar_root_menu: false`。读者位于该分区内时，它仍会出现在切换器里，标明当前位置。

## 面包屑与页面操作 {#breadcrumb}

页面标题上方的面包屑导航显示本页所处的位置，各级名称取祖先页面本地化的 `linkTitle`，层级与侧栏一致。同一行的右端是页面操作菜单。顶层分区不显示只有一级、只会重复标题的面包屑，操作菜单的位置不变。博客页面默认不显示面包屑，因为一篇文章是独立成篇的；在 front matter 或 cascade 中设置 `breadcrumb` 可以改变某页或某个分区的行为，也可以全站关闭：

```yaml {title="hugo.yml"}
params:
  ui:
    breadcrumb: false
```

### 页面操作菜单 {#page-actions}

标题行末尾的拆分按钮汇集了读者能对本页做的事：把内容带走，或者到源头修改它。左半边复制本页 Markdown，成功后显示绿色对勾；箭头展开完整菜单。每一项只在站点能提供时出现，并带一个稳定的操作 ID，供命令面板与自定义 CSS 使用：

| 条目 | 操作 ID | 出现条件 |
| --- | --- | --- |
| 复制 Markdown | `copy_markdown` | 页面启用了 `markdown` 输出格式 |
| 在 ChatGPT 中打开 | `open_chatgpt` | `page_context_menu.assistant_links: true` |
| 在 Claude 中打开 | `open_claude` | `page_context_menu.assistant_links: true` |
| 查看 Markdown 源码 | `view_markdown` | 页面启用了 `markdown` 输出格式 |
| 查看编辑历史 | `view_history` | 设置了 `params.github_repo`，且能解析出本页源文件路径 |
| 编辑当前页面 | `edit_page` | 同上 |
| 添加子页面 | `create_child_page` | 同上 |
| 提交文档议题 | `create_issue` | 设置了 `params.github_repo` |
| 提交项目议题 | `create_project_issue` | 设置了 `params.github_project_repo` |
| 打印完整章节 | `print_section` | 分区启用了 [`print` 输出格式](/zh/docs/customize/print/#enable) |

```yaml {title="hugo.yml"}
params:
  ui:
    page_context_menu:
      enable: true
      assistant_links: false
      links: []
```

在站点配置或页面 front matter 中写 `page_context_menu: false` 会去掉这个按钮，同样的操作仍保留在[命令面板](/zh/docs/customize/panel/)里。两个助手条目默认关闭，因为读者点击时，本页完整的 URL（含 query 与 fragment）会发给对应的第三方。页面可以关闭它们，但站点没有开启时，页面不能自行开启；它们发送的提示词以及隐私说明里应写什么，见 [Agent 支持](/zh/docs/customize/agents/#page-actions)。

`links` 在菜单末尾追加站点自己的外部操作。`url` 中的 `{url}` 是页面完整地址，`{title}` 是页面标题，`{markdown_url}` 是 Markdown 版本的地址，三者都经过 URL 编码：

```yaml {title="hugo.yml"}
params:
  ui:
    page_context_menu:
      links:
        - name: 询问内部助手
          icon: fa-solid fa-wand-magic-sparkles
          url: https://assistant.example.com/new?source={markdown_url}&title={title}
```

在博客根分区及其一级分区上，左半边换成 RSS 订阅链接，「复制 Markdown」移进菜单。没有 Markdown 输出的页面没有左半边，箭头变成带文字的「操作」按钮。

## 翻页器 {#pager}

正文末尾的两个文本链接通向上一页和下一页，顺序与侧栏可见树一致，从根页一直到最后一页。根页没有上一页，最后一页没有下一页。站点提供 [`data/docs_nav.json`](/zh/docs/customize/layout/#docs-nav) 时，这棵树同时决定翻页顺序和它声明过的分区索引顺序，侧栏、翻页器与索引列出子页的顺序因此一致；其余分区沿用内容树。

```yaml {title="hugo.yml"}
params:
  ui:
    pager_types: [docs, book, blog]
```

`pager_types` 只接受 `docs`、`book`、`blog`，其它取值会告警并被丢弃。单页去掉翻页器：

```yaml {title="content/docs/appendix.md"}
---
title: 附录
pager: false
---
```

同一份顺序也以 `<link rel="prev">` 与 `<link rel="next">` 写进页面的 `<head>`，浏览器与爬虫据此识别阅读顺序：

```html {title="页面源码"}
<link rel="prev" href="/zh/docs/customize/home/">
<link rel="next" href="/zh/docs/customize/layout/">
```

只有 HTML 页面带翻页器和这两个链接，打印、Markdown 与 RSS 输出都没有。翻页器是页尾区块之一，这些区块的顺序固定，见[页尾的组成](/zh/docs/customize/repository/#page-end)。

## 反向链接 {#backlinks}

反向链接列出哪些页面链到了当前页。从搜索进来的读者由此看到哪些页面认为它值得引用，也看到它在站点其余部分中的位置。它默认关闭，由站点开启：

```yaml {title="hugo.yml"}
params:
  ui:
    backlinks: true
```

页面用 front matter 中的 `backlinks` 覆盖站点设置，分区用 cascade 传给下面所有页面：

```yaml {title="content/docs/_index.md"}
---
title: 文档
cascade:
  backlinks: true
---
```

列表显示在右栏，是一个默认展开的「反链」组，位于目录下方、分类云上方；视口小于 `xl` 时，它随目录一起移进侧栏抽屉。前八条直接显示，其余收在原生的「再显示 N 条」展开控件里；悬停某一条时显示来源页面的描述。没有任何页面链进来时，整个区块连同标题都不渲染。非布尔取值会告警并按关闭处理。

列表在构建时由 Hugo 从你本来就在写的普通 Markdown 链接和 `ref` / `relref` 短代码生成，没有新语法，也不需要 JavaScript。代码中的链接不计入，自链接、外链、`mailto:` 与同页锚点也不计入；指向同一页面的多个链接只算一条，匹配目标时忽略 fragment。每种语言各有一份列表，中文页面不会出现在英文页面下面；条目按页面路径排序，同样的内容每次构建都得到同样的顺序。

写在自定义短代码参数或原始 `<a href>` 里的 URL 不计入，解析不到的链接会被静默丢弃。反向链接是给读者的导航，查断链仍然要靠链接检查器。

页面的 Markdown 输出在「反链：」一行后附上同一份列表，RSS 与打印视图不包含它。本站全站开启了反向链接，本页右栏就是实际效果；[配置总览](/zh/docs/customize/config/)一页列出了四十多条，大部分收在展开控件里。

## 页脚 {#footer}

`params.ui.footer_style` 在 `fat`、`slim`、`none` 中选一种，见[品牌外观](/zh/docs/customize/brand/#footer)。`fat` 页脚的链接网格来自 `data/footer/<语言>.yaml`，而不是菜单（主题没有 `menus.footer`）：

```yaml {title="data/footer/zh.yaml"}
brand:
  name: 产品文档
  tagline: 一段简短的**支持 Markdown 的**说明。
  slogan: 贴近产品，给出明确答案。
columns:
  - title: 文档
    links:
      - { label: 快速上手, url: /zh/docs/start/ }
      - { label: 组件, url: /zh/docs/components/ }
  - title: 项目
    links:
      - { label: GitHub, url: https://github.com/pgsty/oink, external: true }
      - { label: 发布记录, url: /zh/blog/release/ }
```

- 不写 `brand.name` 与 `brand.logo` 时，使用站点自己的品牌名、Logo 与字标；`tagline` 与 `slogan` 渲染 Markdown。
- 站内 `url` 相对当前语言根解析；`external: true` 在新标签页打开，并带 `rel="noopener noreferrer"`。
- 数据有几列，网格就有几列。
- 单语言站点可以使用 `data/footer.yaml`。
- 设置了 `fat` 但没有数据时回退为 `slim`，因此可以先开启、再补数据。

`fat` 页脚版权行的末端有一个箭头，用来收起和恢复链接网格。网格默认展开，读者的选择以 `td-footer-collapsed` 键存在 `localStorage` 中，跨页面保留，与禅意模式无关。`slim` 与 `none` 没有这个箭头。

页脚最底层栏的末尾是一组图标，依次为版本、语言、外观与快捷键帮助，之后是 `fat` 页脚的折叠箭头。各菜单向上展开。桌面端悬停快捷键帮助会预览双列速查卡，点击则打开居中的对话框。版本按钮只显示图标，选项里仍是完整的版本名。侧栏不重复这组控件，`footer_style: none` 会连同页脚一起去掉最底层栏。

版权行与其中间的说明文字在[配置总览](/zh/docs/customize/config/#identity)中设置。

## 验证 {#verify}

构建后检查警告与渲染出的导航：

```bash
hugo --printPathWarnings
```

- 构建输出中没有 `only one interactive child level is supported` 警告；出现它说明某个菜单嵌套了三层。
- 桌面端悬停父项展开面板，点击父项进入其页面，{{< kbd "Esc" >}} 关闭面板。
- 视口小于 `lg` 时，每个顶层条目都显示图标；没有图标的条目在这个宽度下是空白。
- 视口小于 `md` 时，首页与 Landing 的顶栏末端只剩搜索和抽屉按钮，版本、语言、外观与快捷键帮助位于页脚最底层栏。
- 侧栏顶部的切换器列出所有顶层分区，并标出当前分区。
- 在文档页上用 {{< kbd "E" >}} / {{< kbd "Q" >}} 翻页，顺序与侧栏一致，页面源码中有对应的 `rel="prev"` / `rel="next"`。
- 开启反向链接后，`grep td-backlinks public/<某个被链接的页面>/index.html` 能找到该区块，没有页面链入的页面则完全没有。
- 页面操作菜单里该出现的条目都在，不该出现的都不在；例如没有配置 `github_project_repo` 时，没有「提交项目议题」。

## 相关 {#related}

- [布局与页面类型](/zh/docs/customize/layout/) — 侧栏树、目录与外壳类型
- [配置总览](/zh/docs/customize/config/#navbar-footer) — 导航相关参数的默认值
- [命令面板](/zh/docs/customize/panel/) — 页面操作与自定义命令
- [仓库与页面信息](/zh/docs/customize/repository/) — 编辑本页、历史与 issue 链接
- [组织内容](/zh/docs/write/organize/) — 目录结构如何决定侧栏
