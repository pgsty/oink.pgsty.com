---
downstream_modified: true
title: Callouts、标签页、步骤与卡片
linkTitle: 版式
weight: 80
description:
  用 Markdown 原生的 callout、标签页、步骤、卡片以及少数保留短代码组织页面结构。
---

OINK 的大多数组件都有 **原生形态**：一个普通 Markdown 块，加上 `{.steps}`
之类的标记或 `{tab="npm"}`
之类的属性行。同一份源码在 GitHub、任何 Markdown 编辑器和 OINK 自己的 Markdown 输出里读起来完全一样。只有当普通块表达不了内容时才使用短代码（**全量形态**）：标签页和卡片里的任意 Markdown 正文、处理型图片、引入文件，以及 Book 能力包。

本页介绍结构类组件。代码围栏、表格、图片和更小的原语各有独立页面；主题仓库中的[编写指南](https://github.com/pgsty/oink/blob/main/docs/components.md)是规范性的 API 摘要。

## 分隔符与标记 {#shortcode-delimiters}

Hugo 有两种短代码分隔符，OINK 有意区分使用：

- `{{%/* steps */%}}` 是 **唯一** 的 `{{%/* */%}}`
  短代码。它的正文是页面级 Markdown，因此其中的标题会进入目录（TOC）。
- 其余短代码一律使用 `{{</* name */>}}`。`tabs`、`cards`、`fields`、`image`
  等容器由模板自己渲染 Markdown 正文。

标记是写在列表或表格下一行的 Goldmark 块属性：`{.steps}`、`{.cards}`、`{.filetree}`、`{.gallery}`、`{.fields}`、`{.matrix}`
与
`{.full-width}`。标记必须紧贴块的最后一行；中间隔一个空行会让它悄悄脱离。示例里的
`/* ... */` 转义用于防止 Hugo 执行正在展示的短代码。

两项站点设置让原生形态生效，也是 OINK 预检的一部分：`markup.goldmark.renderer.unsafe: true`
与 `markup.goldmark.parser.attribute.block: true`。

## Callouts {#callouts}

<a id="alert"></a><a id="pageinfo"></a><a id="helpers-shortcodes"></a>

Callout 是 GitHub 风格的块引用，可选 Obsidian 风格的标题与折叠符号。不需要短代码，也不需要 JavaScript。

### 源码 {#callouts-source}

<!-- prettier-ignore-start -->

```markdown
> [!TIP] 标题是行内 Markdown
>
> 正文是页面级 Markdown：列表、围栏、表格、嵌套 callout 都可以。

> [!NOTE]- 默认折叠
>
> `-` 折叠 callout；`+` 同样折叠但默认展开。

> [!DETAILS] 中性折叠块
>
> 默认收起，没有语义颜色。
{icon="fa-solid fa-rocket"}
```

<!-- prettier-ignore-end -->

### 渲染结果 {#callouts-rendered-result}

<!-- prettier-ignore-start -->

> [!TIP] 标题是行内 Markdown
>
> 正文是页面级 Markdown：列表、围栏、表格、嵌套 callout 都可以。

> [!NOTE]- 默认折叠
>
> `-` 折叠 callout；`+` 同样折叠但默认展开。

> [!DETAILS] 中性折叠块
>
> 默认收起，没有语义颜色。
{icon="fa-solid fa-rocket"}

<!-- prettier-ignore-end -->

### 类型与规则 {#callout-types}

| 类型                                            | 行为                                                |
| ----------------------------------------------- | --------------------------------------------------- |
| `NOTE` `TIP` `IMPORTANT` `WARNING` `CAUTION`    | GitHub 的五种类型，在 GitHub 上也原生渲染           |
| `SUCCESS` `DANGER` `QUESTION` `EXAMPLE` `QUOTE` | 额外的语义类型，各有图标与强调色                    |
| `DETAILS`                                       | 中性折叠块，默认收起，写成 `[!DETAILS]+` 时默认展开 |
| `[!TYPE]-` / `[!TYPE]+`                         | 折叠任意类型：默认收起或展开，使用原生 `<details>`  |

- 标记后的标题是行内 Markdown；省略时使用本地化的类型名。
- 属性行接受 `icon`（恰好一对 Font Awesome class）与
  `class`；`style`、事件处理器和未知键会导致构建失败。
- 未知类型会渲染成普通块引用并保留可见的 `[!TYPE]`
  标记，因此不会有内容悄悄丢失。
- 打印和 RSS 会把所有 callout 静态展开；Markdown 输出保留源码块引用。
- 如果内容会经过 Prettier 之类的 Markdown 格式化工具，请像上面一样在标题行后保留一个空的
  `>` 行，并把 `{icon=…}`、`{.steps}` 这类标记行包在
  `<!-- prettier-ignore-start -->` / `<!-- prettier-ignore-end -->`
  之间；否则格式化工具会把标题并入正文，或把标记行并进上一个块。

## 标签页 {#tabs}

<a id="tabbed-panes"></a><a id="code-groups"></a>

标签页用于并列等价的表示形式——包管理器、YAML/TOML/JSON、环境变量与配置项。它不能用来隐藏顺序步骤或互不相关的选择。

### 相邻围栏 {#adjacent-fences}

给连续的围栏加上 `tab` 属性，它们就组成一个标签页集。在第一个围栏上加 `group`
可启用 URL
hash、页内多组同步与浏览器持久化；分组内的每个围栏随后都需要一个稳定的 `value`。

**作者写法**

<!-- prettier-ignore-start -->

````markdown
```bash {tab="Homebrew" group="install" value="brew"}
brew install pigsty
```

```bash {tab="APT" value="apt"}
sudo apt install pigsty
```
````

<!-- prettier-ignore-end -->

**渲染结果**

<!-- prettier-ignore-start -->

```bash {tab="Homebrew" group="install" value="brew"}
brew install pigsty
```

```bash {tab="APT" value="apt"}
sudo apt install pigsty
```

<!-- prettier-ignore-end -->

没有 JavaScript、在 GitHub 上以及打印时，读者看到的是连续的带标题代码块；运行时增强页面之前不会隐藏任何内容。围栏的
`tab` 可以与 `title`
共存（文件名标题栏留在面板内）。[代码块](/zh/docs/components/code-blocks/#tabs)记录了完整的属性契约。

### 相邻表格 {#adjacent-tables}

同样的属性也适用于表格：连续带 `{tab="…"}` 的表格组成一个标签页集。

<!-- prettier-ignore-start -->

| 参数              | 取值 |
| ----------------- | ---- |
| `max_connections` | 100  |
{tab="PG 17" group="pgver" value="pg17"}

| 参数              | 取值 |
| ----------------- | ---- |
| `max_connections` | 200  |
{tab="PG 16" value="pg16"}

<!-- prettier-ignore-end -->

### `tabs` 短代码 {#tabs-shortcode}

当一个标签页承载正文、标题、列表或多个块时，使用短代码：

```go-html-template
{{</* tabs group="setting" default="conf" label="MinIO 设置" */>}}
{{</* tab label="环境变量" value="env" */>}}
在环境中设置 `MINIO_LOGGER_WEBHOOK_QUEUE_DIR`。
{{</* /tab */>}}
{{</* tab label="配置项" value="conf" */>}}
用 `mc admin config set` 设置 `logger_webhook queue_dir`。

> [!TIP]
> 标签页内可以放任何块。
{{</* /tab */>}}
{{</* /tabs */>}}
```

<!-- prettier-ignore-start -->

{{< tabs group="setting" default="conf" label="MinIO 设置" >}}
{{< tab label="环境变量" value="env" >}}
在环境中设置 `MINIO_LOGGER_WEBHOOK_QUEUE_DIR`。
{{< /tab >}}
{{< tab label="配置项" value="conf" >}}
用 `mc admin config set` 设置 `logger_webhook queue_dir`。

> [!TIP]
> 标签页内可以放任何块。
{{< /tab >}}
{{< /tabs >}}

<!-- prettier-ignore-end -->

`tabs` 接受
`group`（选择性启用 hash、同步与持久化）、`default`（某个子项的 value，需要
`group`）与 `label`（标签栏的无障碍名称）。`tab` 必须有 `label`；有分组时
`value` 必填，无分组时禁止。重复的 value、空的 `tabs`
或子项之间的多余内容都会导致构建失败。

### 行为 {#tabs-behaviour}

- 分组的标签页集共享 `#<group>-<value>` hash，在页内互相同步，并把读者的选择记在
  `localStorage`（`td-tabs:v1:<group>`）里。无分组的标签页集只在本地切换。
- 键盘：左右方向键（感知 RTL）与 Home/End 移动并激活；焦点停留在标签上。
- 打印和 RSS 渲染为带标题的静态分节；Markdown 输出为每个标签生成一个
  `**标签名**` 小节。

## 步骤 {#steps}

Steps 会自动为一组顺序步骤编号。原生形态是带 `{.steps}`
的有序列表；全量形态包裹标题。

### 原生形态 {#steps-native}

<!-- prettier-ignore-start -->

```markdown
1. 安装依赖

   步骤里可以放任何块：段落、围栏、callout、嵌套列表。

1. ### 初始化工作区 {#init}

   步骤内的标题会进入目录。

1. 验证安装
{.steps}
```

<!-- prettier-ignore-end -->

<!-- prettier-ignore-start -->

1. 安装依赖

   步骤里可以放任何块：段落、围栏、callout、嵌套列表。

   ```bash
   brew install pigsty
   ```

1. 初始化工作区

   > [!NOTE]
   > 步骤内可以使用 callout。

1. 验证安装
{.steps}

<!-- prettier-ignore-end -->

每一项都写成
`1.`，这样内容缩进恒为三个空格，重新排序也不必手工改号。步骤项可以包含任何块和任何
`{{</* */>}}` 短代码，但不能包含 `{{%/* */%}}` 容器。

### 全量形态 {#steps-full}

当步骤很长，或者需要放 `tabs`、`cards` 之类的容器短代码时，使用
`{{%/* steps */%}}`：每个直接子标题就是一个步骤，正文无需缩进：

{{% steps %}}

#### 创建内容 {#steps-create-content}

每一步先写一个直接子标题，再在标题后添加属于该步骤的任意 Markdown 内容。

#### 检查顺序 {#steps-check-sequence}

整体移动、新增或删除步骤；显示的序号会自动更新。

#### 发布结果 {#steps-publish-result}

在窄屏和两种配色主题下检查这组步骤。

{{% /steps %}}

<!-- prettier-ignore-start -->

```markdown
{{%/* steps */%}}

### 创建内容

添加第一条说明。

### 检查顺序

添加下一条说明。序号会自动生成。

{{%/* /steps */%}}
```

<!-- prettier-ignore-end -->

同级步骤保持相同的标题层级，不要把一个 `steps` 块嵌套在另一个里面。

## 卡片 {#cards}

<a id="doc-cards-and-nav-cards"></a><a id="card-panes"></a><a id="shortcode-card-programming-code"></a><a id="shortcode-card-textual-content"></a>

### 原生形态 {#cards-native}

带 `{.cards}` 的链接列表会变成卡片网格。链接是卡片标题，其后的内容是描述。

<!-- prettier-ignore-start -->

```markdown
- [安装](/zh/docs/tutorial/) — 从零开始部署。
- [配置](/zh/docs/configure/) — 调整运行参数。
{.cards}
```

<!-- prettier-ignore-end -->

<!-- prettier-ignore-start -->

- [安装](/zh/docs/tutorial/) — 从零开始部署。
- [配置](/zh/docs/configure/) — 调整运行参数。
- [组件参考](/zh/docs/components/) — 本页介绍的所有组件。
{.cards}

<!-- prettier-ignore-end -->

### `cards` 短代码 {#cards-shortcode}

需要图标、徽章、图片或 Markdown 正文时使用短代码：

```go-html-template
{{</* cards */>}}
{{</* card title="快速上手" link="/zh/docs/tutorial/" icon="fa-solid fa-rocket" badge="新" */>}}
用 Hugo 构建，描述里 *支持 Markdown*。
{{</* /card */>}}
{{</* card title="架构" link="/zh/docs/about/architecture/" icon="fa-solid fa-diagram-project" */>}}
主题各部分如何协作。
{{</* /card */>}}
{{</* /cards */>}}
```

<!-- prettier-ignore-start -->

{{< cards >}}
{{< card title="快速上手" link="/zh/docs/tutorial/" icon="fa-solid fa-rocket" badge="新" >}}
用 Hugo 构建，描述里 *支持 Markdown*。
{{< /card >}}
{{< card title="架构" link="/zh/docs/about/architecture/" icon="fa-solid fa-diagram-project" >}}
主题各部分如何协作。
{{< /card >}}
{{< card title="组件参考" link="/zh/docs/components/" image="images/content-primitives/oink.webp" image_alt="OINK 文档总览" >}}
图片卡片经共享图片解析器解析。
{{< /card >}}
{{< /cards >}}

<!-- prettier-ignore-end -->

`cards` 没有参数。`card` 接受 `title`（必填）、`link`、`icon`（一对 Font Awesome
class）、`badge`（纯文本），以及 `image` 与 `image_alt` 或 `decorative=true`
之一。没有 `cols`、`accent` 或 `desc` 参数：网格随宽度自适应，描述就是正文。

## 表格 {#tables}

表格有一族标记与属性——`{.full-width}`、`{.fields}`、`{.matrix}`、`{caption="…"}`、带编号的 Book 表格与
`{tab="…"}`——见[表格](/zh/docs/components/tables/)。

## 引入文件、参数与注释 {#include-external-files}

### 引入文件 {#reuse-documentation}

`include` 内联页面资源、全局资源或 `content/` 下的文件（以 `/`
开头表示内容根目录，否则相对于当前页面所在目录）。不带 `code=true`
时文件是在页面上下文中渲染的 Markdown；带上时文件成为代码块：

```go-html-template
{{</* include file="includes/installation.zh.md" */>}}
{{</* include file="includes/config.yaml" code=true lang="yaml" */>}}
```

{{< include file="includes/installation.zh.md" >}}

{{< include file="includes/config.yaml" code=true lang="yaml" >}}

文件缺失、路径含 `..`
或参数未知都会导致构建失败；没有草稿占位输出。被引入的 Markdown 不是独立发布的页面，不参与页面配对审计；语言相关的引入文件应并排放置。

### 打印参数 {#param}

`param` 打印页面参数，并按 Hugo 的 `Page.Param` 规则回退到站点配置：

```go-html-template
OINK 需要 Hugo {{</* param hugoMinVersion */>}} 或更高版本。
```

OINK 需要 Hugo {{< param hugoMinVersion >}} 或更高版本。

参数缺失会导致构建失败；只打印标量值（字符串、数字、布尔值），并做 HTML 转义。`param`
绝不注入原始 HTML。

### 注释 {#comment}

`{{</* comment */>}}…{{</* /comment */>}}`
在所有输出——HTML、打印、Markdown 与RSS——中丢弃内容。适合写不该泄漏到 `llms.txt`
的编辑备注。

## 终端录像 {#asciinema}

`asciinema` 用本地随附的播放器播放 `.cast` 录像：

```go-html-template
{{</* asciinema file="images/install.cast" speed="1.5" markers="0:开始,1:完成" */>}}
```

{{< asciinema file="images/install.cast" speed="1.5" markers="0:开始,1:完成" >}}

窗口标题优先使用 `title`，否则显示 `file`。其他参数包括
`theme`、`autoplay`、`loop`、`preload`、`speed`、`startAt`、`poster`、`cols`、`rows`、`idleTimeLimit`、`pauseOnMarkers`、`markers`
与 `fit`（`width`、`height`、`both` 或
`none`）。避免自动播放，清除终端历史中的密钥，并在附近用文字说明关键步骤。

## OpenAPI {#openapi}

### `swaggerui` {#swaggerui}

嵌入本地随附的 Swagger UI 运行时并加载规范：

```go-html-template
{{</* swaggerui src="/openapi.yaml" */>}}
```

### `redoc` {#redoc}

嵌入本地随附的 Redoc 运行时：

```go-html-template
{{</* redoc "openapi.yaml" */>}}
```

两者都指向页面相对、站点相对或显式 `http(s)`
的规范。远程规范是一项网络依赖，并可能向该主机暴露读者元数据；隔离网络与 CSP 安全部署应使用同源规范，且一个页面只放一个 Swagger
UI 实例。

## 落地页 {#blocks}

<a id="shortcode-blocks"></a><a id="blocks-cover"></a><a id="blocks-lead"></a><a id="blocks-section"></a><a id="blocks-feature"></a><a id="blocks-link-down"></a><a id="td-below-navbar"></a>

Docsy 的 `blocks/*`
短代码（`cover`、`lead`、`section`、`feature`、`link-down`）已经移除。落地页改用
`layout: landing`
加本地数据构建——分区目录与配置见[Landing 页面](/zh/docs/scenarios/landing/)。

## 从 0.4 迁移 {#migration}

下列短代码已被上述形态取代。主题仓库中的[迁移工具](https://github.com/pgsty/oink/blob/main/scripts/migrations/oink06.py)（`report`、`migrate`、`check`）会改写既有内容，并列出所有无法自动转换的构造。

| 已移除                                                                            | 改用                                              |
| --------------------------------------------------------------------------------- | ------------------------------------------------- |
| `alert`、`details`、`pageinfo`、原始 `<details><summary>`                         | `> [!TYPE] 标题`、`> [!DETAILS]-`                 |
| `tabpane`/`tab`、`code-group`/`code-tab`                                          | 带 `{tab=}` 的相邻围栏或 `tabs`/`tab`             |
| `doc-cards`/`doc-card`、`nav-cards`/`nav-card`、`cardpane`/`card`、`doc-carousel` | `{.cards}` 列表或 `cards`/`card`                  |
| `filetree`、`filetree/folder`、`filetree/file`                                    | 嵌套列表 + `{.filetree}`                          |
| `gallery`、`gallery/image`                                                        | 图片列表 + `{.gallery}`                           |
| `imgproc`                                                                         | `image`（具名参数）                               |
| `readfile`                                                                        | `include`                                         |
| `echarts`、`infographic` 短代码                                                   | 同名围栏                                          |
| `iframe`、`conditional-text`、`_param`、`blocks/*`                                | 原始 HTML、独立页面、徽章/图标、`layout: landing` |
