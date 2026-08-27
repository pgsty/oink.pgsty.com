---
title: 编写页面
linkTitle: 编写页面
description: 新建一页文档：文件放在哪、front matter 写什么、标题锚点为什么要手写、链接与图片怎么写、页尾会自动出现什么。
weight: 10
search_keywords: [编写页面, front matter, 标题 ID, heading anchor, 链接, ref, relref, 草稿, draft, Markdown, writing pages]
aliases:
  - /docs/content/writing/
---

本页覆盖一页文档的完整写法：文件位置、front matter、标题锚点、链接、图片、草稿与页尾。前提是站点已能本地构建，尚未搭起时先看[十分钟上手](/zh/docs/start/)。

## 新建一页 {#new-page}

页面是 `content/` 下的 Markdown 文件，URL 由它在 `content/` 里的位置决定：`content/docs/install.md` 发布为 `/docs/install/`。中文译文是同目录下的 `.zh.md` 同名文件，与英文页共享同一条逻辑路径。

没有附带资源的页面写成单个文件。页面带图片、cast、示例配置这类资源时改成一个目录，页面本身命名为 `index.md`，资源与它同放，这是 Hugo 的[页面包](https://gohugo.io/content-management/page-bundles/)（page bundle）：

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

`hugo new content docs/install.md` 用 archetype 生成一个带 front matter 的空文件，见 [Hugo 文档](https://gohugo.io/commands/hugo_new_content/)；手写文件同样可行。

> [!IMPORTANT]
> 中文页没有英文对等页时，Hugo 不会把无语言后缀的资源分给它。这种情况下资源文件名要带 `.zh.`（`shell.zh.webp`），正文里仍然写 `shell.webp`。

## 必要的 front matter {#front-matter}
文件开头两行 `---` 之间是 YAML front matter。四个键每页都应写上：

```yaml {title="content/docs/install.zh.md"}
---
title: 安装 Pigsty          # 页面大标题、浏览器标题、搜索结果标题
linkTitle: 安装             # 侧栏与面包屑里的短名，省略时用 title
description: 在一台干净的 EL 9 机器上装出可用的 PostgreSQL 集群。
weight: 20                  # 同级页面的排序，用 10 的倍数留出插入空间
---
```

`description` 用一句话说清这页让读者做成什么。它出现在栏目首页的卡片、搜索结果与社交卡片中。`weight` 决定侧栏顺序，`weight` 相同时才退回字母序。

其余的键可选：图标、草稿、搜索权重、评论开关、页面外壳等，全表见[页面参数](/zh/docs/write/frontmatter/)。

## 标题层级与稳定锚点 {#headings}

正文用 `##` 开始分节，`#` 留给 `title`。主题已渲染页面大标题，正文里再写一个 `#` 会出现两个一级标题。右栏的页面目录从 `##` 开始收，收到第几级由 Hugo 的 `markup.tableOfContents` 决定，本站是 `####`。

每个 `##` 与 `###` 都要手写英文锚点 `{#id}`：

```markdown {title="源码"}
## 前提条件 {#prerequisites}

### 磁盘与内存 {#disk-and-memory}
```

理由有两条：

- 中英对齐。Hugo 从标题文字生成 ID，中文标题生成中文 ID：`/docs/install/#prerequisites` 与 `/zh/docs/install/#前提条件` 指向同一个语义位置，却是两个锚点，翻译审计无法比对。译文标题写上英文页的 ID，两边即同一个片段。
- 链接稳定。标题文字会随措辞调整而改变，公开链接不应随之失效。显式 ID 一旦发布即视为公开路由；需要改名时保留旧 ID 的空锚点：

```markdown {title="源码：给旧锚点留一个空目标"}
## 快速开始 <a id="get-started"></a> {#quickstart}
```

ID 用短横线小写英文，全页唯一。本站的翻译审计脚本会比对英文页与中文页渲染出的标题 ID，不一致就报错。

## 链接写法 {#links}
三种写法，用途不同：

| 写法 | 例子 | 什么时候用 |
| --- | --- | --- |
| 站内绝对路径 | `[配置总览](/zh/docs/customize/config/)` | 默认写法。指向已发布的路由，便于审计与全站替换，不受源码文件移动影响 |
| 相对路径 | `[另一页](../organize/)`、`![图](shell.webp)` | 同一页面包内的资源，或有意跟着源码目录走的相邻页面 |
| `ref` / `relref` shortcode | `[配置总览]({{</* ref "/docs/configure/overview" */>}})` | 需要构建期校验目标存在时；目标缺失时构建失败，不会留下死链 |

三种写法都带尾部斜杠，指向目录形式的路由（`/zh/docs/write/pages/`），与 Hugo 的默认永久链接一致。

主题没有链接渲染钩子，链接原样交给 Goldmark：外链不会自动加 `target="_blank"`，需要新标签页时写成 HTML，或在站点自己的 `layouts/_markup/render-link.html` 里处理。

普通 Markdown 链接不做存在性检查。因此：

- 站内链接优先写绝对路径，改结构后用 `grep` 全站替换；
- 移动页面时给旧路径加 `aliases`，同时把站内链接改到新路由，不要让 alias 长期承担导航；
- 拿不准的目标用 `ref`，让构建替你检查。

双语页面链接到逻辑页面（`/zh/docs/write/pages/`），不要链接 `.zh.md` 文件名；片段 ID 保持语言中立。

## 图片位置 {#images}
页面自己的截图放页面包，多页共用的图放 `assets/images/`，不需要处理的大文件放 `static/`。三处在源码里都写成 `![替代文字](来源)`，属性行控制图注、尺寸、缩放与编号，见[图片](/zh/docs/components/image/)。

## 草稿与发布 {#drafts}

`draft: true` 的页面不会进入构建产物：

```yaml {title="front matter"}
---
title: 尚未定稿的迁移指南
draft: true
---
```

预览时用 `hugo server -D` 显示草稿（`-D` 即 `--buildDrafts`）。`date` 写在未来的页面同样被排除，用 `-F` 显示。生产构建不加这两个开关，`hugo` 默认只发布已定稿的内容。

## OINK 的 Markdown 扩展一览 {#extensions}

正文是标准 Markdown（Goldmark），加上下面这些原生形态。它们都是普通 Markdown 语法加一行属性，在 GitHub 上按源码阅读同样可读：

| 组件 | 最短语法 | 页面 |
| --- | --- | --- |
| 提示块 | 块引用首行写 `> [!NOTE]` | [提示块](/zh/docs/components/callout/) |
| 标签页 | 相邻的两个围栏各加 `{tab="Homebrew"}` | [标签页](/zh/docs/components/tabs/) |
| 步骤 | 有序列表后面跟一行 `{.steps}` | [步骤](/zh/docs/components/steps/) |
| 卡片 | 链接列表后面跟一行 `{.cards}` | [卡片](/zh/docs/components/cards/) |
| 参数表 | 表格后面跟一行 `{.fields meta="type default"}` | [参数表](/zh/docs/components/fields/) |
| 表格增强 | 表格后面跟一行 `{.matrix}`、`{caption="…"}` | [表格](/zh/docs/components/table/) |
| 代码块 | 围栏信息行写 `{title="hugo.yml" copy=false}` | [代码块](/zh/docs/components/code/) |
| 图片 | 独立成段的图片后面跟一行 `{caption="…" width="600"}` | [图片](/zh/docs/components/image/) |
| 文件树 | `filetree` 围栏，每行一个 `- 名字/  # 注释` | [文件树](/zh/docs/components/filetree/) |
| 公式 | `math` 围栏，或用 `$$` 包住的块级公式 | [公式](/zh/docs/components/math/) |
| 图表 | `mermaid` 围栏（还有 `plantuml`、`markmap`、`echarts`） | [Mermaid](/zh/docs/components/mermaid/) |

剩下的少数组件（徽章、按键、引用文件、终端录像、Book 的图表式例）用 shortcode，语法与参数见[组件总览](/zh/docs/components/)。

组合例子：步骤里放代码围栏与提示块。

````markdown {title="源码"}
1. 安装 Hugo Extended，最低 0.160.1：
   ```bash
   brew install hugo
   ```
1. 克隆文档站并预览：
   ```bash
   git clone https://github.com/pgsty/oink.pgsty.com my-docs
   cd my-docs && hugo server
   ```
   > [!TIP]
   > 加 `-D` 连草稿一起预览。
{.steps}
````

1. 安装 Hugo Extended，最低 0.160.1：
   ```bash
   brew install hugo
   ```
1. 克隆文档站并预览：
   ```bash
   git clone https://github.com/pgsty/oink.pgsty.com my-docs
   cd my-docs && hugo server
   ```
   > [!TIP]
   > 加 `-D` 连草稿一起预览。
{.steps}

## 页尾的自动内容 {#page-end}
页面末尾的五块内容由主题按固定顺序生成，不必在正文里写：

| 位置 | 是什么 | 默认 | 怎么改 |
| --- | --- | --- | --- |
| 1 | 反馈：「这页有帮助吗」两个按钮 | 关 | [仓库与页面信息](/zh/docs/customize/repository/) |
| 2 | 最后修改：时间加最近一次提交的标题，链到 GitHub | 有 Git 信息时开 | [仓库与页面信息](/zh/docs/customize/repository/) |
| 3 | 反向链接：链接到本页的页面 | 关 | [导航与菜单](/zh/docs/customize/navigation/#backlinks) |
| 4 | 翻页器：上一页 / 下一页，顺序与侧栏树一致 | docs / book / blog 开 | [导航与菜单](/zh/docs/customize/navigation/) |
| 5 | 评论：giscus | 配置完整且开启时 | [启用评论](/zh/docs/admin/comments/) |

标题旁边的操作菜单（复制 Markdown、编辑本页、查看历史、提 issue、打印）也是自动的，同样在[仓库与页面信息](/zh/docs/customize/repository/)里配置。

单页关闭其中某一块用 front matter：`feedback: false`、`annotation: false`、`backlinks: false`、`pager: false`、`comments: false`。键的含义见[页面参数](/zh/docs/write/frontmatter/)。

## 验证 {#verify}

写完一页，运行一次严格构建：

```bash
hugo --printPathWarnings --panicOnWarning
```

- 输出必须以 `Total in …` 结束，没有 ERROR、没有 WARN。属性行写了不允许的键、组件参数非法、`ref` 目标不存在，都在这一步失败并指出文件与行号；主题不做静默降级。
- `--printPathWarnings` 报出两个页面指向同一输出路径的情况，多语言站或改过 `permalinks` 时较常出现。

在浏览器里确认三项：

1. 侧栏里出现了这一页，位置符合 `weight`；
2. 右栏目录列出了你写的 `##`，点击后 URL 里的锚点是英文；
3. 中英两个版本的同名标题锚点一致（本站有 `node scripts/check-doc-translations.mjs --public public` 做这项审计）。

## 相关 {#related}

- [组织内容](/zh/docs/write/organize/) — 目录结构如何决定侧栏
- [页面参数](/zh/docs/write/frontmatter/) — front matter 全表
- [组件总览](/zh/docs/components/) — 每个组件的语法与参数
- [多语言](/zh/docs/customize/i18n/) — 双语对等文件与缺译回退
- [本地预览](/zh/docs/admin/preview/) — `hugo server` 的常用开关
