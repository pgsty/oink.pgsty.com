---
title: 编写页面
linkTitle: 编写页面
description: 新建一页文档：文件放在哪、front matter 写什么、稳定的标题锚点、链接、图片、草稿，以及主题在页尾自动添加的内容。
weight: 10
search_keywords: [编写页面, front matter, 标题 ID, heading anchor, 链接, ref, relref, 草稿, draft, Markdown, writing pages]
aliases:
  - /docs/content/writing/
---

一页文档就是 `content/` 下的一个 Markdown 文件：开头几行 YAML front matter，下面是正文。文件存放的位置决定了它的 URL 和它在侧栏中的位置，所以新建一页只需要这个文件本身：

```markdown {title="content/docs/install.zh.md"}
---
title: 安装 Pigsty
linkTitle: 安装
description: 在一台干净的 EL 9 机器上装出可用的 PostgreSQL 集群。
weight: 20
---

## 前提条件 {#prerequisites}

一台能 SSH 登录的 Linux 机器，`sudo` 免密，Python 3.11 或更高版本。

> [!IMPORTANT]
> 安装脚本会改写 `/etc/yum.repos.d/`，先备份。
```

`hugo server` 运行时，这一页出现在 `/zh/docs/install/`，侧栏里多出「安装」一项。站点还没能构建的话，先看[快速上手](/zh/docs/start/)。

## 新建一页 {#new-page}

`content/` 下的路径就是 URL：`content/docs/install.md` 发布为 `/docs/install/`。译文是同一目录下带语言后缀的同名文件，如 `install.zh.md`，与英文页共享同一条逻辑路径。

没有自带文件的页面写成单个 `.md` 文件。页面需要截图、录屏或示例配置时，改成一个目录：页面本身命名为 `index.md`，所需文件放在旁边。这在 Hugo 中叫[页面包](https://gohugo.io/content-management/page-bundles/)（page bundle），页面直接用文件名引用这些文件：

```filetree {title="content/ 里的两种页面形态"}
- content/
  - docs/
    - _index.md                      # 栏目首页，英文
    - _index.zh.md                   # 栏目首页，中文
    - install.md                     # 单文件页面 → /docs/install/
    - install.zh.md                  # 它的中文译文
    - anatomy/                       # 页面包 → /docs/anatomy/
      - index.md
      - index.zh.md
      - shell.webp                   # 页面资源，两种语言共用
```

两种形态在侧栏中看不出区别。`hugo new content docs/install.md` 会按 [archetype](https://gohugo.io/commands/hugo_new_content/) 生成一个带 front matter 的文件，手写同样可行。页面包里不带语言后缀的资源由所有语言共用；按语言区分的资源，以及唯一必须用到它的情形（只有中文、没有英文的页面），见[文件命名与资源](/zh/docs/customize/i18n/#files)。

## 必要的 front matter {#front-matter}

文件开头两行 `---` 之间的 YAML 就是 front matter。每页都应写上四个键：

```yaml {title="content/docs/install.zh.md"}
---
title: 安装 Pigsty          # 页面大标题、浏览器标题、搜索结果标题
linkTitle: 安装             # 侧栏与面包屑里的短名，省略时用 title
description: 在一台干净的 EL 9 机器上装出可用的 PostgreSQL 集群。
weight: 20                  # 同级页面的排序，用 10 的倍数留出插入空间
---
```

`description` 用一句话说清读者能用这页做成什么。它出现在栏目首页的卡片、搜索结果和社交卡片里，读者正是凭它决定要不要点开。`weight` 决定这一页在同级页面中的位置；权重相同或没写权重时怎么排，见[排序](/zh/docs/write/organize/#weight)。

其余键都是可选的：图标、草稿、搜索权重、评论、页面外壳等，全部列在[页面参数](/zh/docs/write/frontmatter/)中。

## 标题层级与稳定锚点 {#headings}

正文从 `##` 开始分节。主题已经把 `title` 渲染为页面唯一的 `#` 标题，正文里再写 `#` 就会出现第二个。右栏目录从 `##` 收录到 Hugo 的 `markup.tableOfContents.endLevel` 为止，默认是 `###`，设为 `4` 才会收录 `####`。

每个 `##` 与 `###` 都写上显式的英文 ID：

```markdown {title="源码"}
## 前提条件 {#prerequisites}

### 磁盘与内存 {#disk-and-memory}
```

不写的话，Hugo 会从标题文字生成 ID，带来两个问题：

- 译文标题生成的 ID 不同（是 `#前提条件` 而不是 `#prerequisites`），英文页上好用的链接，到了中文页只会停在页面顶部。两边都写英文 ID，`/docs/install/#prerequisites` 与 `/zh/docs/install/#prerequisites` 就指向同一个位置，详见[标题锚点必须对齐](/zh/docs/customize/i18n/#anchors)。
- 改一下标题措辞，所有指向它的链接都会悄悄失效。已发布的 ID 应当视为 URL 的一部分；确实需要改名时，给旧 ID 留一个空锚点，原有链接仍能到达：

  ```markdown {title="源码：给旧锚点留一个空目标"}
  ## 快速开始 <a id="get-started"></a> {#quickstart}
  ```

ID 用短横线连接的小写英文单词，在页面内唯一。

## OINK 的 Markdown 扩展一览 {#extensions}

正文是由 Hugo 的 Goldmark 渲染的标准 Markdown，再加上下面这些写法。每一种都是普通 Markdown 加至多一行属性，所以源码在 GitHub 或任何编辑器里依然好读：

| 组件 | 最短语法 | 页面 |
| --- | --- | --- |
| 提示块 | 块引用首行写 `> [!NOTE]`；写 `> [!SOCIAL]` 则引用一条社交帖子 | [提示块](/zh/docs/components/callout/) · [帖子](/zh/docs/components/social/) |
| 代码块 | 围栏信息行写 `{title="hugo.yml" copy=false}` | [代码块](/zh/docs/components/code/) |
| 表格增强 | 表格后面跟一行 `{.matrix}` 或 `{caption="…"}` | [表格](/zh/docs/components/table/) |
| 参数表 | 表格后面跟一行 `{.fields meta="type default"}` | [参数表](/zh/docs/components/fields/) |
| 标签页 | 相邻的两个围栏各加 `{tab="Homebrew"}` | [标签页](/zh/docs/components/tabs/) |
| 步骤 | 有序列表后面跟一行 `{.steps}` | [步骤](/zh/docs/components/steps/) |
| 时间轴 | 定义列表后面跟一行 `{.timeline}` | [时间轴](/zh/docs/components/timeline/) |
| 更新条目 | 标题行附带 `{.update date="…" tags="…"}` | [更新](/zh/docs/components/update/) |
| 卡片 | 链接列表后面跟一行 `{.cards}` | [卡片](/zh/docs/components/cards/) |
| 图表 | `mermaid` 围栏（还有 `plantuml`、`markmap`、`echarts`） | [Mermaid](/zh/docs/components/mermaid/) |
| 地图 | `map` 围栏，内含 YAML 或 JSON 地点列表 | [地图](/zh/docs/components/map/) |
| 文件树 | `filetree` 围栏，每行一个 `- 名字/  # 注释` | [文件树](/zh/docs/components/filetree/) |
| 公式 | `math` 围栏，或用 `$$` 包住的块级公式 | [公式](/zh/docs/components/math/) |
| 图片与媒体 | 独立成段的图片／视频／音频后面跟一行 `{caption="…"}` | [图片](/zh/docs/components/image/) · [视频](/zh/docs/components/video/) · [音频](/zh/docs/components/audio/) |

少数 Markdown 表达不了的组件使用短代码：徽章、按键（裸 `<kbd>` 同样渲染为键帽）、引用文件、终端录像，以及 Book 的图表式例系列，语法见[组件总览](/zh/docs/components/)。

这些写法可以组合使用。下面在步骤里放了代码围栏和提示块：

````markdown {title="源码"}
1. 安装 PostgreSQL 18：
   ```bash
   brew install postgresql@18
   ```
1. 启动服务并连接：
   ```bash
   brew services start postgresql@18
   psql postgres
   ```
   > [!TIP]
   > `brew services list` 可以查看服务是否在运行。
{.steps}
````

1. 安装 PostgreSQL 18：
   ```bash
   brew install postgresql@18
   ```
1. 启动服务并连接：
   ```bash
   brew services start postgresql@18
   psql postgres
   ```
   > [!TIP]
   > `brew services list` 可以查看服务是否在运行。
{.steps}

## 链接写法 {#links}

按链接指向的目标选择写法：

| 写法 | 例子 | 什么时候用 |
| --- | --- | --- |
| 站内绝对路径 | `[配置总览](/zh/docs/customize/config/)` | 默认写法。它写的是已发布的路由，源文件移动不受影响，也便于全站查找替换 |
| 相对路径 | `[另一页](../organize/)`、`![图](shell.webp)` | 同一页面包内的资源，或应当跟着源码目录一起移动的相邻页面 |
| `ref` / `relref` 短代码 | `[配置总览]({{</* ref "/docs/customize/config" */>}})` | 目标必须存在时：目标缺失会让构建失败，而不是留下死链 |

三种写法都指向带尾部斜杠的目录式路由（`/zh/docs/write/pages/`），这是 Hugo 默认的发布方式。双语站点中，链接指向逻辑页面，而不是某个 `.zh.md` 文件，两种语言使用相同的片段 ID。

普通 Markdown 链接在构建时不做检查，因此：

- 站内链接写绝对路径，结构调整后一次全站查找替换就能改全；
- 移动页面时，把旧路径加进 `aliases`，让外部链接继续有效，同时把站内链接改到新路由，不要依赖 alias 导航；
- 拿不准目标是否存在时用 `ref`，让构建替你检查。

主题把链接原样交给 Goldmark，没有链接渲染钩子，所以外链在当前标签页打开。需要新标签页时，把链接写成 HTML，或自己添加 `layouts/_markup/render-link.html`。

## 图片位置 {#images}

页面自己的截图放在页面包里，多页共用的图片放 `assets/images/`，不需要处理的大文件放 `static/`。三处都用同样的 `![替代文字](来源)` 写法，图片下一行的属性行可以加图注、尺寸、缩放或图号，见[图片](/zh/docs/components/image/)。

## 草稿与发布 {#drafts}

把未完成的页面标记为 `draft: true`，任何构建都不会发布它：

```yaml {title="front matter"}
---
title: 尚未定稿的迁移指南
draft: true
---
```

`hugo server -D`（`--buildDrafts`）可以预览草稿。`date` 在未来的页面同样会被排除，直到该日期之后再构建才会发布，用 `-F`（`--buildFuture`）可以提前预览。生产构建不加这两个开关，所以直接执行 `hugo` 只发布已完成的页面。

## 页尾的自动内容 {#page-end}

不要在正文里手写反馈提问、最后更新时间、上一页 / 下一页链接或评论框。主题会在最后一段之后按固定顺序添加它们：

| 区块 | 默认 | 单页关闭 | 配置位置 |
| --- | --- | --- | --- |
| 分享栏 | 关；`params.ui.share` 列出平台后才出现 | `share: false` | [博客与文章](/zh/docs/write/blog/#share) |
| 反馈：「这页有帮助吗」两个按钮 | 关 | `feedback: false` | [仓库与页面信息](/zh/docs/customize/repository/#feedback) |
| 最后修改：时间加最近一次提交的标题，链到 GitHub | 有 Git 信息时开 | `annotation: false` | [仓库与页面信息](/zh/docs/customize/repository/#lastmod) |
| 翻页器：上一页 / 下一页，顺序与侧栏一致 | docs、book、blog 中开 | `pager: false` | [导航与菜单](/zh/docs/customize/navigation/#pager) |
| 评论：Giscus | 配置完整且开启时 | `comments: false` | [启用评论](/zh/docs/admin/comments/) |

标题旁的操作菜单（复制 Markdown、编辑当前页面、查看历史、提 issue、打印）同样是自动生成的，在[仓库与页面信息](/zh/docs/customize/repository/)中配置。这些区块为什么按这个顺序排列，见[页尾由什么构成](/zh/docs/customize/repository/#page-end)。

## 验证 {#verify}

写完一页，构建一次：

```bash
hugo --printPathWarnings
```

构建应以 `Total in …` 结束，且没有 `ERROR`。属性或组件参数写错时，会输出带源码位置的告警，并渲染安全的回退结果，见[配置原则](/zh/docs/customize/config/#principles)；`ref` 指向不存在的页面则会让构建失败。`--printPathWarnings` 会报告两个页面发布到同一路径的冲突，多见于多语言站点或修改 `permalinks` 之后。

然后在浏览器里确认：

1. 这一页在侧栏中的位置与它的 `weight` 相符；
2. 右栏目录列出了你写的 `##` 标题，点击后 URL 里的锚点是英文；
3. 同一个标题在英文页和译文页上的锚点相同。

## 相关 {#related}

- [组织内容](/zh/docs/write/organize/) — 目录结构如何决定侧栏
- [页面参数](/zh/docs/write/frontmatter/) — front matter 全表
- [组件总览](/zh/docs/components/) — 每个组件的语法与参数
- [多语言](/zh/docs/customize/i18n/) — 双语对等文件与缺译回退
- [本地预览](/zh/docs/admin/preview/) — `hugo server` 的常用开关
