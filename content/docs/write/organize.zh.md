---
title: 组织内容
linkTitle: 组织内容
description: 目录结构就是侧栏树：`_index.md` 与 weight、栏目首页样式、图标与折叠、隐藏页面、把文档放在任意路径。
weight: 20
search_keywords: [组织内容, 目录结构, 侧栏, sidebar, weight, -index, section, 栏目, type, cascade, sidebar-root-for, organizing]
aliases:
  - /docs/content/organize/
---

OINK 不需要单独配置导航：`content/` 下的目录结构就是侧栏树。本页覆盖目录与文件的摆放、栏目首页、排序、图标、折叠、隐藏，以及多根侧栏。

## 目录就是侧栏 {#tree-is-sidebar}

一个目录是一个栏目（Hugo 称 section），目录里的 Markdown 文件是它的页面，嵌套目录是它的子栏目。侧栏按这棵树逐层渲染，顺序由 `weight` 决定，标签取 `linkTitle`，缺省时取 `title`。左侧这棵树的源码如下：

```filetree {title="content/docs/ 的前两层"}
- content/
  - docs/
    - _index.zh.md                   # 栏目根：type: docs + cascade
    - about/                         # 简介       {open=false}
      - _index.zh.md
      - features.zh.md
    - start/                         # 快速上手    {open=false}
      - _index.zh.md
    - write/                         # 创作内容（本栏目）
      - _index.zh.md                 # weight: 30
      - pages.zh.md                  # weight: 10
      - organize.zh.md               # weight: 20
      - frontmatter.zh.md            # weight: 30
    - components/                    # 组件       {open=false}
      - _index.zh.md
```

## 每个目录都要有 `_index.md` {#index-pages}

栏目首页是目录里的 `_index.md`（中文为 `_index.zh.md`）。缺少它时 Hugo 仍会生成栏目，但没有标题、描述、图标与 `weight`：侧栏那一行显示目录名，排序不受控制。

```yaml {title="content/docs/deploy/_index.zh.md"}
---
title: 部署上线
linkTitle: 部署
description: 把站点发布到 GitHub Pages、Cloudflare Pages 或自己的 Nginx。
weight: 50
icon: fa-solid fa-cloud-arrow-up
---
```

栏目 `_index.md` 另有一项专属能力：用 `cascade` 把共享设置一次下推给整棵子树，不必每页重复。

```yaml {title="content/docs/reference/_index.zh.md"}
---
title: 参考
weight: 90
cascade:
  pager: false        # 这个子树里的页面都不显示上一页 / 下一页
  search_boost: 0.8   # 参考页在搜索里排后一点
---
```

## 排序：weight 用 10 的倍数 {#weight}

同一栏目里的页面按 `weight` 升序排列，`weight` 相同时才退回日期与 `linkTitle` 字母序。一律用 10 的倍数（10、20、30），此后往中间插页不必改动其它页。栏目自身的 `weight` 决定它在父级里的位置。

没写 `weight` 的页面视为 0，Hugo 把它们排在所有写了 `weight` 的页面之后，彼此按日期与标题排列。这个顺序会随内容改动漂移，因此每页都写上 `weight`。

## 单文件还是页面包 {#bundles}

没有自身资源的页面用单文件 `slug.md`；带图片、cast、示例文件的页面改成目录加 `index.md`，资源与它同放。两种形态在侧栏里没有区别，URL 也相同。详见[编写页面](/zh/docs/write/pages/#new-page)。

## 栏目首页显示子页列表还是卡片 {#section-index}

`_index.md` 的正文之后，主题自动接上子页索引，两种样式：

```yaml {title="hugo.yml：全站默认"}
params:
  ui:
    section_index: cards # list | cards
```

`list` 是主题默认，每个子页一行标题加描述；`cards` 是链接卡片网格，读取子页的 `icon`、`linkTitle` 与 `description`。本站用 `cards`，本栏目首页即是例子。单个栏目需要另一种样式时在它的 front matter 里覆盖：

```yaml {title="content/docs/reference/_index.zh.md"}
section_index: list
cascade:
  section_index: list   # 连同后代栏目一起
```

两个页面级开关不受样式影响：`simple_list: true` 渲染紧凑的项目符号列表，`no_list: true` 不生成索引，用于正文自行手写导航的场合。

> [!TIP]
> 卡片样式下 `description` 即卡片正文。描述控制在一句话、单行可显示。

## 侧栏图标 {#icons}

在页面或栏目的 front matter 里写一对 Font Awesome class：

```yaml {title="content/docs/deploy/_index.zh.md"}
icon: fa-solid fa-cloud-arrow-up
```

图标密度是站点级策略，用于避免叶子页全部带图标：

```yaml {title="hugo.yml"}
params:
  ui:
    sidebar_icon_policy: groups # all | groups | none
```

| 取值 | 效果 |
| --- | --- |
| `all` | 每个写了 `icon` 的条目都显示（未设置时的兼容默认值） |
| `groups` | 只有根节点和有子页的节点显示图标，普通叶子页不显示 |
| `none` | 侧栏不显示任何条目图标 |

新站点建议显式写 `groups`：保留分组的语义标识，去掉叶子层的图标。本站使用这个设置，左侧只有六个栏目带图标。

## 展开与折叠 {#folding}

有子页的栏目在侧栏里带一个折叠箭头，读者的展开状态保存在本地。默认行为：当前页所在的那条路径展开，其余收起；博客类栏目默认展开。

```yaml {title="content/docs/reference/_index.zh.md"}
sidebar_expanded: true   # 这个栏目始终默认展开
```

站点级的折叠、紧凑模式、初始展开层数、宽度与截断在[布局与页面类型](/zh/docs/customize/layout/)里配；键的完整定义见[配置总览](/zh/docs/customize/config/)。

## 从侧栏里藏起来 {#hiding}

| front matter | 效果 |
| --- | --- |
| `toc_hide: true` | 页面不出现在侧栏树里（页面本身照常发布，链接照常可用） |
| `hide_summary: true` | 页面不出现在栏目首页的子页索引里 |
| `sidebar_divider: true` | 这一项不再是链接，而是侧栏里的一条分组标题 |
| `manual_link: https://…` | 侧栏这一行指向别处；配 `manual_link_title`、`manual_link_target: _blank` 用 |

`toc_hide` 与 `hide_summary` 控制两个不同的入口，两处都不该出现时才同时设置。

## 外壳由 `type` 决定，不是路径 {#type-and-shell}

文档外壳（侧栏、目录、面包屑、翻页器）不取决于目录名，只取决于页面的 `type` 是否在 `params.ui.shell_types` 里：

```yaml {title="hugo.yml：主题默认"}
params:
  ui:
    shell_types: [docs, book, blog, swagger]
```

文档因此可以放在任意路径，用 cascade 指定 `type` 即可。例如把一套手册放在 `content/handbook/`，栏目根的写法如下：

```yaml {title="content/handbook/_index.zh.md"}
---
title: 运维手册
type: docs
sidebar_root_for: self      # 侧栏树的根即本栏目，不回退到 /docs
cascade:
  type: docs                # 整棵子树都用文档外壳
---
```

> [!IMPORTANT]
> 文档目录不叫 `docs` 时，`type: docs` 之外还要写 `sidebar_root_for: self`。否则侧栏会按 `params.ui.docs_section`（默认 `docs`）去找根，读者在 `/handbook/` 下却看到 `/docs/` 的树。

## 多根侧栏 {#sidebar-roots}

侧栏树默认以读者所在的顶层栏目为根，树上方一行标出当前的根。规模较大的子树可以自己成为一个根，例如带版本的 API 参考或一本独立的手册：

```yaml {title="content/docs/api/v2/_index.zh.md"}
---
title: API 参考 v2
sidebar_root_for: self   # self | children
---
```

| 取值 | 语义 |
| --- | --- |
| `self` | 这个栏目的首页及其全部后代都以它为侧栏根 |
| `children` | 首页仍留在父级树里，只有后代以它为根 |

根节点上方的切换器是全站的：它列出所有顶层栏目，加上站内所有 `sidebar_root_for: self` 的栏目。只有一个入口时它退化成一个普通链接，两个及以上才是下拉菜单。顶层栏目不出现在切换器里时，在它的 `_index.md` 写 `sidebar_root_menu: false`。

切换器下方，栏目首页仍是树里的第一个链接：切换器选择一棵树，根链接指向一篇文档。`sidebar_root_link_self: false` 让根那一行改为指向父级栏目。

## 验证 {#verify}

```bash
hugo --printPathWarnings --panicOnWarning
```

必须 `Total in …`，没有 ERROR / WARN。`--printPathWarnings` 报出两个页面指向同一输出路径的情况，改目录结构时较常出现。

在浏览器里逐项确认：

1. 侧栏里的顺序与写下的 `weight` 一致，新栏目出现在预期位置；
2. 栏目首页的子页索引齐全（缺项来自 `hide_summary` 或缺少 `_index.zh.md`）；
3. 面包屑与翻页器的顺序与侧栏一致，翻页器读的是同一棵树；
4. 换语言之后树的形状相同（每个 `_index.md` 都要有 `.zh.md` 对等文件）。

侧栏条目超过 `params.ui.sidebar_menu_truncate` 时构建给出警告，并指出应调到多少。这个警告不可忽略：被截断的条目不会出现在侧栏里。

## 相关 {#related}

- [编写页面](/zh/docs/write/pages/) — 单页怎么写
- [页面参数](/zh/docs/write/frontmatter/) — 这页出现的每个 front matter 键的完整定义
- [布局与页面类型](/zh/docs/customize/layout/) — 站点级的外壳、侧栏与目录设置
- [导航与菜单](/zh/docs/customize/navigation/) — 顶栏菜单、面包屑与翻页器
- [多语言](/zh/docs/customize/i18n/) — 双语目录树怎么保持一致
