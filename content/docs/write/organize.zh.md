---
title: 组织内容
linkTitle: 组织内容
description: 用目录和 `_index.md` 搭出想要的侧栏，再控制排序、栏目首页、图标、折叠、隐藏页面，以及文档放在哪个路径。
weight: 20
search_keywords: [组织内容, 目录结构, 侧栏, sidebar, weight, -index, section, 栏目, type, cascade, sidebar-root-for, organizing]
aliases:
  - /docs/content/organize/
---

`content/` 下的目录就是站点的导航：每个目录成为侧栏里的一组，每个 Markdown 文件成为一页，`weight` 决定顺序。所以搭侧栏靠的是摆放文件，而不是另外维护一份菜单。面包屑、上一页 / 下一页翻页器和每个栏目首页上的子页列表都由同一棵树生成，彼此始终一致。

## 目录就是侧栏 {#tree-is-sidebar}

一个目录在 Hugo 中叫一个分区（section），目录里的 Markdown 文件是它的页面，嵌套目录是子分区。侧栏按这棵树逐层渲染，条目标签取 `linkTitle`（没有时取 `title`），同级之间按 `weight` 排序。一个产品的文档可能是这样：

```filetree {title="content/docs/"}
- content/
  - docs/
    - _index.md                      # Docs 根：type: docs + cascade
    - install/                       # weight: 10
      - _index.md
      - requirements.md              # weight: 10
      - linux.md                     # weight: 20
      - kubernetes.md                # weight: 30
    - operate/                       # weight: 20
      - _index.md
      - backup.md                    # weight: 10
      - upgrade/                     # weight: 20，一个页面包
        - index.md
        - upgrade-dialog.webp
    - reference/                     # weight: 90
      - _index.md
      - configuration.md
```

`upgrade/` 是一个页面包：目录里放 `index.md` 和这一页用到的文件。它在侧栏中的显示和 URL 都与单个文件完全相同，见[新建一页](/zh/docs/write/pages/#new-page)。

## 每个目录都要有 `_index.md` {#index-pages}

分区自己的页面是目录里的 `_index.md`（中文为 `_index.zh.md`）。缺了它，Hugo 仍会生成这个分区，但没有标题、描述、图标和 `weight`：侧栏里只显示目录名，位置也无法控制。

```yaml {title="content/docs/deploy/_index.zh.md"}
---
title: 部署上线
linkTitle: 部署
description: 把站点发布到 GitHub Pages、Cloudflare Pages 或自己的 Nginx。
weight: 50
icon: fa-solid fa-cloud-arrow-up
---
```

分区的 `_index.md` 还可以写 `cascade`，把 front matter 下推给它下面的每一页，整棵子树共用的设置只需写一次：

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

同级页面按 `weight` 升序排列，只有权重相同时才依次按日期和 `linkTitle` 排。按 10 递增编号（10、20、30），以后在两页之间插入新页时，就不必改动其它页的编号。分区自身的 `weight` 写在它的 `_index.md` 里，决定它在同级中的位置。

没写 `weight` 的页面按 0 计，Hugo 把它们排在所有写了权重的页面之后，彼此再按日期和标题排列。这个顺序会随内容变化而漂移，所以每页都写上 `weight`。

## 栏目首页显示子页列表还是卡片 {#section-index}

`_index.md` 正文之后，主题会自动列出该分区的子页，栏目首页不必手写目录。样式由站点选择：

```yaml {title="hugo.yml：全站默认"}
params:
  ui:
    section_index: cards # list | cards
```

`list` 是主题默认样式，每个子页一行，显示标题和描述。`cards` 是链接卡片网格，取每个子页的 `icon`、`linkTitle` 与 `description`，本栏目的首页就是例子。卡片样式下 `description` 就是卡片正文，控制在一句话、一行显示得下。某个分区需要另一种样式时，在它的 front matter 里覆盖：

```yaml {title="content/docs/reference/_index.zh.md"}
section_index: list
cascade:
  section_index: list   # 连同后代栏目一起
```

两个页面开关对两种样式都有效：`simple_list: true` 渲染只有标题的紧凑列表，`no_list: true` 不生成列表，适合正文已经自带导航的页面。卡片列数等站点级设置见[栏目首页样式](/zh/docs/customize/layout/#section-index)。

## 从侧栏里藏起来 {#hiding}

| front matter | 效果 |
| --- | --- |
| `toc_hide: true` | 页面不出现在侧栏树里，也不进入上一页 / 下一页序列；页面本身照常发布，链接照常可用 |
| `hide_summary: true` | 页面不出现在所在分区的子页列表里 |
| `sidebar_divider: true` | 这一项不再是链接，而是侧栏里的一条分组标题 |
| `manual_link: https://…` | 侧栏这一行指向别处；配合 `manual_link_title`、`manual_link_target: _blank` 使用 |

`toc_hide` 与 `hide_summary` 管的是两个不同的地方，只有两处都不该出现时才同时设置。

## 侧栏图标 {#icons}

在页面或分区的 front matter 里写一对 Font Awesome class，就能给它加图标：

```yaml {title="content/docs/deploy/_index.zh.md"}
icon: fa-solid fa-cloud-arrow-up
```

每个叶子页都带图标，长侧栏就很难扫读，所以由一项站点级策略决定哪些条目显示图标：

```yaml {title="hugo.yml"}
params:
  ui:
    sidebar_icon_policy: groups # all | groups | none
```

| 取值 | 效果 |
| --- | --- |
| `all` | 每个写了 `icon` 的条目都显示；未设置该键时即为此值 |
| `groups` | 只有根节点和有子项的条目显示图标，普通叶子页不显示 |
| `none` | 侧栏不显示任何条目图标 |

新站点建议显式写 `groups`：分区保留用于辨识的图标，叶子页保持简洁。本站用的就是 `groups`，所以侧栏里只有分区带图标。

## 展开与折叠 {#folding}

有子项的分区在侧栏里带一个折叠箭头。默认情况下，当前页所在的分支展开，其余收起；博客类分区例外，默认展开。在分区的 `_index.md` 中写 `sidebar_expanded`，可以朝任一方向覆盖这个默认行为：

```yaml {title="content/docs/reference/_index.zh.md"}
sidebar_expanded: true   # 这个栏目始终默认展开
```

浏览器会记住读者对整个侧栏的选择：是否收起、宽度和滚动位置。各个分支的展开状态不会被记住；站点需要的话，可以用[侧栏 API](#sidebar-api) 自行实现。站点级的折叠、紧凑模式、初始展开层数、宽度与截断在[布局与页面类型](/zh/docs/customize/layout/#sidebar)中设置，每个键的定义见[配置总览](/zh/docs/customize/config/#sidebar)。

## 不发布目录页的分组 {#group-only}

目录只用来给子页分组时，把它的 `_index.md` 设为分隔项，并且不发布：

```yaml
---
title: Reference
sidebar_divider: true
build:
  render: never
---
```

标题在侧栏中变成一个不可点击的分组标签。启用折叠时，它的按钮负责展开和收起子页；没有 JavaScript 时，分组保持展开。子页仍然进入翻页器、搜索、导航 JSON 和打印视图。省略 `build`，分区页面照常发布，侧栏里仍显示为不可点击的标签。没有子项的分隔项显示为一条普通的分隔标题。

另外三个开关看起来相似，作用却不同，都不能代替分组：`toc_hide` 隐藏分区的整棵子树，`no_list` 只去掉分区页面正文后的子页列表，`hide_summary` 只把该条目从父级列表中移除。`build.render: link` 保留 permalink 但不发布页面；分组既然不该成为访问目标，就用 `never`，这样其它导航也不会给出指向它的链接。

## 外壳由 `type` 决定，不是路径 {#type-and-shell}

文档外壳（侧栏、目录、面包屑、翻页器）与目录名无关，而是跟随页面的 `type`：下面五种内置类型都带这套外壳，它们也是 `params.ui.shell_types` 的默认值（修改这个列表前请先读[布局与页面类型](/zh/docs/customize/layout/#shell-types)）。

```yaml {title="hugo.yml：主题默认"}
params:
  ui:
    shell_types: [docs, book, blog, swagger, expo]
```

因此文档可以放在任意路径，用 cascade 指定 `type: docs` 即可。例如把一套手册放在 `content/handbook/`，分区根这样写：

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
> 文档目录不叫 `docs` 时，`type: docs` 之外还要写 `sidebar_root_for: self`。否则侧栏会按 `params.ui.docs_section`（默认 `docs`）去找根，读者在 `/handbook/` 下看到的却是 `/docs/` 的树。

## 多根侧栏 {#sidebar-roots}

侧栏一次只显示一棵树，树上方的一行标出这棵树的根，默认是读者当前所在的顶层分区。规模较大的子树，例如带版本的 API 参考或一本独立的手册，可以自成一个根：

```yaml {title="content/docs/api/v2/_index.zh.md"}
---
title: API 参考 v2
sidebar_root_for: self   # self | children
---
```

| 取值 | 含义 |
| --- | --- |
| `self` | 这个分区的首页及其全部后代都以它为侧栏根 |
| `children` | 首页仍留在父级树里，只有后代以它为根 |

树上方的切换器在每一页上都相同：它列出所有顶层分区，以及所有声明了 `sidebar_root_for: self` 的分区；只有一项时显示为普通链接，多于一项时是下拉菜单。要把某个顶层分区或嵌套的根排除在列表之外，在它的 `_index.md` 中写 `sidebar_root_menu: false`；读者位于该分区内时，切换器仍会把它显示为当前位置。

切换器下方，根分区的首页是树里的第一个链接：切换器选的是哪棵树，根链接打开的是一个页面。设置 `sidebar_root_link_self: false`，这一行就改为指向父级分区。

## 验证 {#verify}

```bash
hugo --printPathWarnings
```

构建应以 `Total in …` 结束，且没有 `ERROR`。挪动目录之后，`--printPathWarnings` 会报告两个页面发布到同一路径的冲突。

然后在浏览器里逐项确认：

1. 侧栏顺序与你写的 `weight` 一致，新分区出现在预期的位置；
2. 每个栏目首页都列全了子页，缺项的原因是设置了 `hide_summary` 或缺少 `_index.md`；
3. 面包屑和翻页器的顺序与侧栏一致，因为它们读的是同一棵树；
4. 每种语言下树的形状相同，这要求每个 `_index.md` 旁边都有对应的译文（如 `_index.zh.md`）。

某个分区的条目超过 `params.ui.sidebar_menu_truncate` 时，构建会告警，并指出应调到多少。请按告警调整：超出上限的条目不会出现在侧栏里。

## 通过站点代码控制分支 {#sidebar-api}

`window.OinkSidebar` 让站点代码可以展开或收起侧栏分支，例如恢复读者保存的选择。站点脚本要在主题脚本之后加载，例如放进 `layouts/_partials/hooks/body-end.html`，并在读取或修改状态前等待 `ready`。下面的例子展开侧栏的第一个分组：

```javascript
const sidebar = window.OinkSidebar;
if (sidebar) {
  sidebar.ready.then(() => {
    const button = document.querySelector(
      '#td-shell-sidebar [data-td-shell-tree-toggle]'
    );
    if (!button) return;
    const id = button.getAttribute('aria-controls');
    sidebar.setExpanded(id, true);
  });
}
```

分支的 ID 就是其折叠按钮的 `aria-controls` 值。`getState(id)` 返回 `{id, expanded}`，ID 不存在时返回 `null`。每次变化都会在按钮、分支及其无障碍状态一致之后，在 `document` 上派发一次 `oink:sidebar-disclosure` 事件，detail 为 `{id, expanded, source}`；写入与当前相同的状态不会派发事件。通过 API 恢复状态时，包含当前页的分支保持展开，读者仍可以手动收起。

如果要持久保存分支选择，存储键应区分语言和导航版本，在存储不可用时正常工作，并忽略当前页面上不存在的 ID。完整的生命周期见[侧栏契约](/zh/docs/design/shell/#sidebar-runtime)。

## 相关 {#related}

- [编写页面](/zh/docs/write/pages/) — 单页怎么写
- [页面参数](/zh/docs/write/frontmatter/) — 这页出现的每个 front matter 键的完整定义
- [布局与页面类型](/zh/docs/customize/layout/) — 站点级的外壳、侧栏与目录设置
- [导航与菜单](/zh/docs/customize/navigation/) — 顶栏菜单、面包屑与翻页器
- [多语言](/zh/docs/customize/i18n/) — 双语目录树怎么保持一致
