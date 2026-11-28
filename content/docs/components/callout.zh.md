---
title: 提示块
linkTitle: 提示块
description: 用 `> [!NOTE]` 这样的块引用写出带颜色、图标与标题的提示、警告与折叠块，不需要短代码。
weight: 110
search_keywords: [提示块, Callout, Alert, Admonition, 告警, 折叠块, note, tip, warning, caution, details]
aliases:
  - /docs/components/layout/
---

提示块（Callout）用来把读者绝不能漏看的那件事单独拎出来：一个前提条件、一条有破坏性的命令、一个版本限制。它就是普通的块引用，只是第一行写一个 `[!TYPE]` 标记，与 GitHub、Obsidian 的写法相同。同一份源码在 GitHub 上显示为提示框，在其它 Markdown 阅读器里显示为普通引用。

请克制使用。每隔一段就有一个框，读者很快就会对框视而不见；一句正文能说清的，就写成正文。

## 最简例子 {#minimal}

```markdown {title="源码"}
> [!NOTE]
> Hugo Module 需要本机安装 Go；只用离线归档时不需要。
```

> [!NOTE]
> Hugo Module 需要本机安装 Go；只用离线归档时不需要。

不写标题时，显示当前语言的类型名：中文页面是「说明」，英文页面是 "Note"。

## 十种类型 {#types}

前五种类型由 GitHub 定义，后五种是 OINK 追加的；每种有自己的图标与颜色，类型名不区分大小写。按“读者跳过这个框会怎样”来选类型：`NOTE`、`TIP` 跳过也无妨；`IMPORTANT` 表示缺了它任务做不成；`WARNING`、`CAUTION` 表示会出故障或变慢；`DANGER` 留给无法撤销的操作。

```markdown {title="源码"}
> [!TIP]
> 用 `hugo server -D` 可以预览草稿。

> [!IMPORTANT]
> 主题下限是 Hugo 0.169.0，低于它构建直接失败。

> [!WARNING]
> `hugo --cleanDestinationDir` 会清空 `public/`。

> [!CAUTION]
> 删除 `resources/_gen` 后第一次构建会慢很多。

> [!SUCCESS]
> 312 个页面全部构建完成，可以部署了。

> [!DANGER]
> 部署前执行 `rm -rf public/`，会连同你手动放进去的文件一起删掉。

> [!QUESTION]
> 站点要不要开评论？看[启用评论](/zh/docs/admin/comments/)。

> [!EXAMPLE]
> `pgsty.com` 就是一个只用了提示块与表格的纯文档站。

> [!QUOTE]
> Documentation is a love letter that you write to your future self.
```

> [!TIP]
> 用 `hugo server -D` 可以预览草稿。

> [!IMPORTANT]
> 主题下限是 Hugo 0.169.0，低于它构建直接失败。

> [!WARNING]
> `hugo --cleanDestinationDir` 会清空 `public/`。

> [!CAUTION]
> 删除 `resources/_gen` 后第一次构建会慢很多。

> [!SUCCESS]
> 312 个页面全部构建完成，可以部署了。

> [!DANGER]
> 部署前执行 `rm -rf public/`，会连同你手动放进去的文件一起删掉。

> [!QUESTION]
> 站点要不要开评论？看[启用评论](/zh/docs/admin/comments/)。

> [!EXAMPLE]
> `pgsty.com` 就是一个只用了提示块与表格的纯文档站。

> [!QUOTE]
> Documentation is a love letter that you write to your future self.

## 自定义标题 {#title}

标记同一行后面的文字就是标题，可以包含行内代码、粗体与链接。

```markdown {title="源码"}
> [!WARNING] 会改写 `public/`
> 生产构建前先确认 `baseURL` 指向正式域名，否则所有绝对链接都会指错。
```

> [!WARNING] 会改写 `public/`
> 生产构建前先确认 `baseURL` 指向正式域名，否则所有绝对链接都会指错。

## 正文内容 {#body}
正文就是普通 Markdown：列表、代码围栏、表格、图片，甚至另一个提示块。每一行都以 `>` 开头，围栏行也不例外。

````markdown {title="源码"}
> [!TIP] 三条命令启动预览
>
> 1. 克隆：`git clone https://github.com/pgsty/oink-starter my-docs`
> 2. 进入目录并预览：
>    ```bash
>    cd my-docs && hugo server
>    ```
> 3. 打开 <http://localhost:1313/>
>
> | 端口 | 用途 |
> | --- | --- |
> | 1313 | Hugo 开发服务器 |
````

> [!TIP] 三条命令启动预览
>
> 1. 克隆：`git clone https://github.com/pgsty/oink-starter my-docs`
> 2. 进入目录并预览：
>    ```bash
>    cd my-docs && hugo server
>    ```
> 3. 打开 <http://localhost:1313/>
>
> | 端口 | 用途 |
> | --- | --- |
> | 1313 | Hugo 开发服务器 |

## 折叠 {#collapsible}

类型后加 `-` 渲染为收起状态，加 `+` 渲染为展开但可收起。两者都是原生 `<details>` 元素，不依赖 JavaScript。适合折叠大多数读者可以跳过的内容：完整命令输出、备选做法、背景阅读。

```markdown {title="源码"}
> [!NOTE]- 为什么需要 Go？
> Hugo 通过 Go 的模块系统下载主题（`hugo mod get`）。用 submodule 或离线归档时可以不装 Go。

> [!TIP]+ 默认展开，但读者可以收起
> 收起状态不会被记住，刷新后回到默认。
```

> [!NOTE]- 为什么需要 Go？
> Hugo 通过 Go 的模块系统下载主题（`hugo mod get`）。用 submodule 或离线归档时可以不装 Go。

> [!TIP]+ 默认展开，但读者可以收起
> 收起状态不会被记住，刷新后回到默认。

## 中性折叠块 DETAILS {#details}

`[!DETAILS]` 是不带颜色和图标的折叠块，默认收起，写成 `[!DETAILS]+` 则默认展开。内容既不是提示也不是警告、只是篇幅长时用它，例如一份完整配置文件、一段完整日志，或紧跟在播放器后的[音频文字稿](/zh/docs/components/audio/#transcript)。

````markdown {title="源码"}
> [!DETAILS] 完整的 `hugo version` 输出
> ```text
> hugo v0.169.0+extended+withdeploy darwin/arm64
> ```
````

> [!DETAILS] 完整的 `hugo version` 输出
> ```text
> hugo v0.169.0+extended+withdeploy darwin/arm64
> ```

## 自定义图标 {#icon}
在块引用的下一行写 `{icon="fa-solid fa-…"}`（一对 Font Awesome class），即可替换该类型的图标。属性行必须紧跟块引用，中间不能有空行。

```markdown {title="源码"}
> [!TIP] PostgreSQL 18 已支持
> 从 Pigsty v4 起默认安装 PostgreSQL 18。
{icon="fa-solid fa-database"}
```

> [!TIP] PostgreSQL 18 已支持
> 从 Pigsty v4 起默认安装 PostgreSQL 18。
{icon="fa-solid fa-database"}

## 嵌套 {#nesting}

每嵌套一层多写一个 `>`。通常一层就够，再深就难读了。

```markdown {title="源码"}
> [!WARNING] 升级前先备份
> 升级主题版本可能改变渲染结果。
>
> > [!TIP]- 怎么备份
> > `git tag pre-upgrade` 就够了——回滚只是 `git checkout pre-upgrade`。
```

> [!WARNING] 升级前先备份
> 升级主题版本可能改变渲染结果。
>
> > [!TIP]- 怎么备份
> > `git tag pre-upgrade` 就够了——回滚只是 `git checkout pre-upgrade`。

## 未知类型与易错写法 {#pitfalls}

类型名拼错不会导致构建失败，也不会丢内容：该块渲染为普通块引用，标记原样留在页面上，一眼就能看出拼写错误。

```markdown {title="源码"}
> [!NOTICE] 这不是合法类型
> 标记会保留在页面上提醒你。
```

> [!NOTICE] 这不是合法类型
> 标记会保留在页面上提醒你。

另外两类常见问题来自 Prettier 等格式化工具：

- 标题行被并入正文：在标题行下保留一个空的 `>` 行。
- `{icon=…}` 这类属性行被挪走：用 `<!-- prettier-ignore-start -->` 与 `<!-- prettier-ignore-end -->` 把提示块包起来。

## 输出形态 {#outputs}

提示块不加载脚本。打印与 RSS 中所有提示块都完整展开；页面的 Markdown 输出保留原始块引用，包括标记与标题。

## 参数参考 {#reference}

标记行 `> [!TYPE]±  标题`：

| 参数 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `TYPE` | 枚举 | — | `NOTE` `TIP` `IMPORTANT` `WARNING` `CAUTION` `SUCCESS` `DANGER` `QUESTION` `EXAMPLE` `QUOTE` `DETAILS`；大小写不敏感；未知值渲染为普通块引用 |
| `±` | `-` / `+` / 无 | 无 | `-` 折叠默认收起，`+` 折叠默认展开；`DETAILS` 不加符号即收起 |
| 标题 | 行内 Markdown | 类型的本地化名称 | 与标记同一行 |
{.fields meta="type default"}

属性行 `{…}`（块引用之后紧接的一行）：

| 参数 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `icon` | Font Awesome class 对 | 类型默认图标 | 例如 `fa-solid fa-database`；`DETAILS` 默认无图标 |
| `class` | 空格分隔的 class | — | 经校验的类名，供站点 CSS 使用；`data-*` 与 `aria-*` 原样透传 |
{.fields meta="type default"}

其它键（包括 `style`）会被丢弃，并在构建时告警；`on*` 事件属性在主题读到之前已被 Hugo 剥离，静默丢弃。

## 限制与常见问题 {#limits}

- 颜色由类型决定，没有颜色参数。找不到合适的类型时，选最接近的一种，用标题表达具体含义。
- 读者展开或收起的状态在刷新后不保留。
- 放在 `{.steps}` 列表项里时，每行 `>` 缩进到列表项文字处；放在 `{{%/* steps */%}}` 步骤里时不缩进。见[步骤](/zh/docs/components/steps/)。

## 相关 {#related}

- [步骤](/zh/docs/components/steps/) — 步骤中放置提示块
- [标签页](/zh/docs/components/tabs/) — 同一提示按平台分开呈现
- [编写页面](/zh/docs/write/pages/) — 提示块与正文的取舍
