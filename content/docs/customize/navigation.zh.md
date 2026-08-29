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

本页覆盖读者在页面之间移动的入口：顶栏菜单、栏目切换器、面包屑、页面操作、上一页 / 下一页与页脚。侧栏树与目录属于[布局与页面类型](/zh/docs/customize/layout/)。

导航没有第二套信息架构：顶栏来自 Hugo 的 `menus.main`，侧栏来自 `content/` 的目录结构。主题不读 `docs.json`、`navigation.yaml` 一类的并行导航树。

## 顶栏菜单 {#main-menu}

顶层入口写在各语言的 `menus.main` 里：

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

`weight` 越小越靠前。`pageRef` 指向站内页面，`url` 指向外链；外链自动加 `target="_blank"` 与 `rel="noopener noreferrer"`，并带一个外链角标。`identifier` 是配置里引用这个入口的稳定标识（`quick_links`、`sidebar_root_menu` 按它匹配），`name` 按语言翻译，identifier 不翻译。

菜单项也可以挂在页面 front matter 上，适用于「这一页本身就是一个顶层入口」：

```yaml {title="content/download/_index.md"}
---
title: 下载
menu:
  main:
    weight: 30
---
```

顶栏右侧的 GitHub 入口 **不是** 菜单项，它来自 `params.github_project_repo`（未设时回落 `params.github_repo`）。标识为 `github` 的菜单项会被菜单区跳过，写了也不显示。改变这个入口的目标要改仓库参数，见[仓库与页面信息](/zh/docs/customize/repository/)。

### 下拉菜单 {#dropdown}

用 Hugo 的 `parent` 建立父子关系，**只支持一级子项**：

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
        description: 从 OINK Starter 起步，分层定制并部署
    - identifier: docs-components
      parent: docs
      name: 组件
      pageRef: /docs/components
      weight: 20
      params:
        icon: fa-solid fa-cubes
```

- 每个条目都是独占一行的一个图标加一个标题，整个面板是一列宽度适中的
  纵向列表。子项的 `params.description` 只是配置数据，面板不会渲染它。
- **父级本身是一个普通链接**：悬停或键盘聚焦展开面板，点击或回车进入父级页面。没有单独的展开箭头，触屏读者落到父级页面，该页正文同样列出这些链接。
- 键盘：向下箭头展开并聚焦第一项，{{< kbd "Esc" >}} 关闭并把焦点还给链接，点击面板外部关闭。
- 0.5 的 `params.columns` 参数已退役：设置它会发出构建警告，面板保持单列。
- 再深一层会发出构建警告并降级成静态分组标题，**不会** 生成三级悬浮菜单。更深的层级放进侧栏。

### 菜单图标 {#menu-icons}

小于 `lg` 时菜单项只剩图标，每个顶层入口都应有一个。图标按这个顺序解析：

1. 目标页面 front matter 里的 `icon`；
2. 菜单项自己的 `params.icon`；
3. 按 identifier / 分区名匹配的内置默认值（`docs` `blog` `examples` `community` `about` `download` `github` 等）；
4. 都没有时用 `fa-solid fa-link`。

图标写成一对 Font Awesome class，主题本地提供免费版字体：

```yaml {title="hugo.yml"}
menus:
  main:
    - identifier: handbook
      name: 运维手册
      pageRef: /handbook
      weight: 40
      params:
        icon: fa-solid fa-screwdriver-wrench
```


### 标签菜单 {#taxonomy-menu}

顶层入口指向 taxonomy 页面（`/tags/`、`/categories/`）时不需要手工配置子菜单：面板自动渲染「标签 + 数量」的 chip 网格，按数量降序排列。

```yaml {title="hugo.yml"}
menus:
  main:
    - identifier: tags
      name: 标签
      pageRef: /tags
      weight: 60
```

分类怎么启用见[分类体系](/zh/docs/customize/taxonomy/)。

## 顶栏控件 {#navbar}

顶栏高 50px，从左到右是：品牌（Logo 或字标）、菜单区、搜索、版本、语言、主题、GitHub。首页和 Landing 页面最右侧还固定保留抽屉菜单按钮。顶栏在所有布局上渲染；文档、博客和分类页使用相同控件，但没有这个 Landing 抽屉。

顶栏分为桌面完整形态与紧凑图标形态：

| 视口 | 状态 |
| --- | --- |
| `lg` 及以上 | 完整：品牌、带文字的菜单项、各工具控件；首页/Landing 最后是抽屉按钮 |
| 小于 `lg` | 紧凑：品牌保留，其余全部右对齐成图标 |
| 小于 `md` | 顶栏右侧只留搜索与抽屉按钮；版本、语言、主题与快捷键帮助仍在页脚最底层栏中 |

各控件的开关不在这里：搜索图标要 `params.offline_search`（见[全文检索](/zh/docs/customize/search/)），版本菜单要 `params.versions`（见[多版本](/zh/docs/customize/versions/)），语言菜单在配置了两种及以上语言时自动出现（见[多语言](/zh/docs/customize/i18n/)），主题控件要 `params.ui.dark_mode`（见[品牌外观](/zh/docs/customize/brand/#dark-mode)）。

### 自动隐藏 {#autohide}

```yaml {title="hugo.yml"}
params:
  ui:
    navbar_autohide: true
```

开启后顶栏离开正常流、停在视口上方，指针进入原位置上方 60% 的中间区域（或键盘焦点进入）才滑出，并且覆盖在正文之上，不把正文顶下去。左右各 64px 不属于唤醒区，避免盖住折叠后的侧栏与大纲恢复按钮。

小于 768px、粗指针或纯触屏时自动停用，顶栏始终可见。页面 front matter 顶层的 `navbar_autohide` 或分区 cascade 可以逐段覆盖。

### 关闭顶栏 {#navbar-disable}

```yaml {title="hugo.yml"}
params:
  ui:
    navbar_enabled: false
```

也可以只关闭某一页或某一段：

```yaml {title="content/docs/_index.md"}
---
title: 文档
cascade:
  navbar_enabled: false
---
```

关闭后主题补回原本由顶栏承担的界面：移动端子导航、侧栏顶部的品牌与搜索行、大纲轨道上的工具按钮。这个开关适用于必须独占视口的页面，不作为常规排版偏好。本站的文档栏目使用它：文档页依靠侧栏导航，顶栏是多余的一行。

## 栏目切换器 {#root-menu}

侧栏顶部那一行是栏目切换器，决定当前显示哪棵树。入口集合按顺序去重构造：所有顶级栏目 → 全站所有 `sidebar_root_for: self` 的分区 → 当前解析出的根。

```yaml {title="hugo.yml"}
params:
  ui:
    sidebar_root_enabled: true
    sidebar_root_menu: true
```

让一棵大子树自成一个根（带版本的 API 参考、独立手册），在它的 `_index.md` 里：

```yaml {title="content/docs/api-v2/_index.md"}
---
title: API 参考 v2
sidebar_root_for: self
sidebar_root_link_self: true
---
```

`self` 让这个分区索引与它的后代都用这棵新树；`children` 把索引留在父树里，只约束后代。让某个顶层分区不出现在切换器里，在它的 front matter 里设 `sidebar_root_menu: false`。

只有一个入口时切换器退化成一个无边框链接，两个及以上才是下拉菜单。切换器下面的树仍然把栏目首页本身作为第一个链接：切换器选一棵树，根链接选一篇文档。

## 面包屑与页面操作 {#breadcrumb}

普通内容页标题上方是面包屑行，这一行右端同时承载页面操作。顶层分区省略只有一级、与标题重复的面包屑，操作按钮的位置不变。

```yaml {title="hugo.yml"}
params:
  ui:
    breadcrumb: false
```

面包屑标签取本地化的 `linkTitle`，层级与侧栏一致。

### 页面操作菜单 {#page-actions}

页面操作是标题行末尾的拆分按钮：左半边一键复制本页 Markdown（成功后变成绿色对勾），右侧箭头展开完整菜单。菜单分两组，上半组是取走内容，下半组是改动与产出：

| 操作 | 出现条件 |
| --- | --- |
| 复制 Markdown 文本 | 站点开了 `markdown` 输出格式 |
| 在 ChatGPT 中打开 | `page_context_menu.assistant_links: true` |
| 在 Claude 中打开 | 同上 |
| 查看 Markdown 源码 | `markdown` 输出格式 |
| 查看编辑历史 | `params.github_repo` 能解析出源文件路径 |
| 编辑本页 | `params.github_repo` |
| 新建子页面 | `params.github_repo` |
| 提交文档 issue | `params.github_repo` |
| 提交项目 issue | `params.github_project_repo` |
| 打印整个分区 | 分区开了 `print` 输出格式 |

```yaml {title="hugo.yml"}
params:
  ui:
    page_context_menu:
      enable: true
      assistant_links: false
      links: []
```

助手入口默认关闭：读者点击时，**完整的当前 URL（含 query 与 fragment）会随本地化提示词发给第三方**，页面正文不上传。开启前确认 URL 里没有敏感信息，并在隐私说明里披露这个边界。页面可以用布尔型 front matter `assistant_links` 收紧站点策略，不能反过来替站点开启。

自定义外部操作排在菜单最后，`url` 支持三个已 URL 编码的占位符：

```yaml {title="hugo.yml"}
params:
  ui:
    page_context_menu:
      links:
        - name: 询问内部助手
          icon: fa-solid fa-wand-magic-sparkles
          url: https://assistant.example.com/new?source={markdown_url}&title={title}
```

可用占位符：`{url}`（页面完整地址）、`{title}`（页面标题）、`{markdown_url}`（Markdown 版地址）。

在博客根分区及其一级子分区上，左半边变成 RSS 订阅链接，菜单里仍保留「复制 Markdown 文本」。没有 Markdown 输出的页面去掉左半边，箭头变成带文字的「操作」按钮。

这些操作同时是[命令面板](/zh/docs/customize/panel/)里的条目。

## 翻页器 {#pager}

正文末尾的上一页 / 下一页是两个文本链接，顺序与侧栏可见树一致：根页 → 第一篇 → 直到最后一篇。根页没有上一页，末页没有下一页。站点提供 `data/docs_nav.json` 时，这棵显式树同时决定翻页顺序，以及该文件声明过的 docs / book 栏目的栏目索引顺序——侧栏、翻页器与索引不会再把同一批子页排出三种顺序。文件没有声明的栏目，以及没有这个文件的站点，仍然沿内容树走。见[布局与页面类型](/zh/docs/customize/layout/#sidebar)。

```yaml {title="hugo.yml"}
params:
  ui:
    pager_types: [docs, book, blog]
```

`pager_types` 只接受 `docs`、`book`、`blog` 三个值，其它取值告警并丢弃。单页退出用 front matter：

```yaml {title="content/docs/appendix.md"}
---
title: 附录
pager: false
---
```

同一份顺序也写进 `<head>`：有上一页 / 下一页时输出 `<link rel="prev">` 与 `<link rel="next">`，供浏览器与爬虫识别阅读序列。

```html {title="页面源码"}
<link rel="prev" href="/zh/docs/customize/home/">
<link rel="next" href="/zh/docs/customize/layout/">
```

翻页只在 HTML 输出中生效。打印、Markdown 与 RSS 既没有翻页链接，也没有这两个 `rel` 关系。

翻页器是页尾四件套的第三件（反馈 → 页面信息 → 翻页 → 评论），顺序固定，四者独立开关。

## 反向链接 {#backlinks}

右栏可以列出有哪些页面链接到这一页：一个带链接图标的「反链」组，排在目录下方、分类标签云上方，默认展开；低于 `xl` 断点时，它随目录一起进入侧栏抽屉。从搜索落到这一页的读者由此看到哪些页面认为它值得指向，也看到它在站点其余部分里的位置。默认关闭，由站点打开：

```yaml {title="hugo.yml"}
params:
  ui:
    backlinks: true
```

单页用 front matter 覆盖，分区用 cascade 覆盖它下面的所有页面：

```yaml {title="content/docs/_index.md"}
---
title: 文档
cascade:
  backlinks: true
---
```

索引在构建时从作者本来就在写的东西里派生：页面源码里的普通 Markdown 链接，以及 `ref` / `relref` shortcode。没有新语法要学，没有内容要迁移，也不需要 JavaScript——列表就在 HTML 里。扫描前先剥掉代码围栏与行内代码；指向同一个目标的多个链接合并成一条；自链接、外链、`mailto:` 与同页锚点都不计入。判断目标页面时去掉 fragment，每种语言各有一张互不相干的图，中文页面不会出现在英文页面下面。条目按稳定页面路径排序，同样的内容每次构建出同样的顺序；没有任何页面链进来时整个区块不渲染——没有标题，也没有空容器。

前八条直接可见，其余折进原生的「再显示 N 条」disclosure，避免被大量引用的页面把右栏撑满，其中不涉及 JavaScript。每一条都带来源页面的描述，悬停时显示。

读源码有一处已知遗漏：写在自定义 shortcode 参数里或原始 `<a href>` 里的 URL 不会成为一条边；解析不出来的目标被静默丢弃，不发告警。它是导航增强，不是链接检查器，查断链仍然要用链接检查器。

非布尔取值告警并回落到关闭，`hugo server` 照常可用，加了 `--panicOnWarning` 的构建会停在这里。

页面的 Markdown 输出带同一份列表，前缀是「反链：」。RSS 省略它，`print` 输出格式连同整个右栏一起省略。

本站全站开启了它：看本页右栏的「反链」组就是实际效果；被引用最多的[配置总览](/zh/docs/customize/config/)一页，列出了四十多个入链，其中大部分收在「再显示 N 条」里。

## 页脚 {#footer}

页脚形态由 `params.ui.footer_style` 决定（`fat` / `slim` / `none`，见[品牌外观](/zh/docs/customize/brand/#footer)）。`fat` 的多列链接网格读 `data/footer/<语言>.yaml`。它不是菜单，主题没有 `menus.footer`：

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

- `brand.name` 与 `brand.logo` 不写时回落到站点自己的品牌名、Logo 与字标；`tagline` 与 `slogan` 渲染 Markdown。
- 站内 `url` 相对当前语言根解析；`external: true` 在新标签页打开并带 `rel="noopener noreferrer"`。
- 网格列数等于数据里的列数。
- 单语言站可以使用 `data/footer.yaml`。
- 配了 `fat` 但没有数据时自动降级成 `slim`，可以先开启再补内容。

`fat` 页脚的版权行右端有一个折叠箭头，收起或恢复它上方的链接栅格。默认展开，读者的选择存在 localStorage 的 `td-footer-collapsed` 键里，跨页面保留；`slim` 与 `none` 没有这个按钮，它也与专注模式无关。

只要页脚有渲染，最底层栏右侧就固定保留同一组图标：版本、语言、主题、快捷键帮助。各菜单向上展开；版本按钮只显示分支图标，完整版本名仍保留在选项中。`fat` 页脚的折叠箭头排在这四项之后。侧栏不再重复这组控件，`footer_style: none` 则连同页脚一起移除底栏。

版权行与中间那句说明由参数控制，见[配置总览](/zh/docs/customize/config/#identity)。

## 验证 {#verify}

```bash
hugo --printPathWarnings --panicOnWarning
```

改完导航要检查这几处：

- 构建没有 `Navbar menu … supports one interactive child level` 警告；出现它说明菜单嵌了三层；
- 桌面端：父级菜单点击进入父级页面，悬停展开面板，{{< kbd "Esc" >}} 关闭面板；
- 窗口缩到 `lg` 以下：每个顶层入口仍有图标，没有图标的项在这个宽度下是空白；
- 缩到 `md` 以下：首页与 Landing 顶栏右侧只剩搜索和抽屉按钮；版本、语言、主题与快捷键帮助固定在 footer 最底层栏；
- 侧栏顶部的切换器列出所有顶级栏目，当前项有选中标记；
- 任意文档页按 {{< kbd "E" >}} / {{< kbd "Q" >}} 翻页，顺序与侧栏一致，页面源码里有对应的 `rel="prev"` / `rel="next"`；
- 打开反向链接后，`grep td-backlinks public/<某个被链接的页面>/index.html` 能找到这个区块，而没有页面链进来的页面里完全没有这段标记；
- 打开页面操作菜单，确认该出现的项都在，不该出现的没有（例如未配置 `github_project_repo` 时的「提交项目 issue」）。

## 相关 {#related}

- [布局与页面类型](/zh/docs/customize/layout/) — 侧栏树、目录与外壳类型
- [配置总览](/zh/docs/customize/config/#navbar-footer) — 导航相关参数的默认值
- [命令面板](/zh/docs/customize/panel/) — 页面操作与自定义命令
- [仓库与页面信息](/zh/docs/customize/repository/) — 编辑本页、历史与 issue 链接
- [组织内容](/zh/docs/write/organize/) — 目录结构如何决定侧栏
