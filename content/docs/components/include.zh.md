---
title: 引用
linkTitle: 引用
description: 让多页共用一份源头：include 引入共享片段与文件，param 打印站点或页面参数，comment 写永不发布的注释。
weight: 200
search_keywords: [引用, include, 引入文件, 片段, snippet, 复用, readfile, param, 参数, 插值, comment, 注释]
params:
  pigsty_pg_major: 18
---

同一段安装步骤出现在三页上，当前版本号散落在三十页里，每多一份拷贝，各页之间就多一分对不上的可能。这三个 shortcode 让它们只保留一份源头：`include` 把另一个文件的内容插进页面，`param` 打印一个页面或站点参数，`comment` 存放写给作者自己的备注，任何输出里都看不到。只在一页出现的内容，就直接写在那一页。

## 最简例子 {#minimal}

`include` 只有一个必填参数 `file`：

```markdown {title="源码"}
{{</* include file="parts/install-oink.zh.md" */>}}
```

被引入的文件是一段普通 Markdown，放在 `assets/` 下：

````markdown {title="assets/parts/install-oink.zh.md"}
把 OINK 安装到一个已有的 Hugo 站点，三条命令：

```sh
hugo mod init github.com/you/your-site
hugo mod get github.com/pgsty/oink
hugo server
```

> [!NOTE]
> `hugo mod get` 需要本机安装 Go；用离线归档或 submodule 时不需要。

当前发布版本是 {{</* param version */>}}。
````

渲染结果与直接写在本页完全一样，复制按钮和提示块都在：

{{< include file="parts/install-oink.zh.md" >}}

被引入的文件不是页面：它没有自己的 URL，不出现在侧栏，也不参与翻译配对。

## 文件位置 {#sources}

`file` 按下面的顺序查找，先命中的胜出：

| 顺序 | 找哪里 | 写法 |
| --- | --- | --- |
| 1 | 当前页面的页面资源（页面包里的文件） | `file="config.yaml"` |
| 2 | 全局资源 `assets/` 下的文件 | `file="snippets/dsn.txt"` |
| 3 | `content/` 下的文件：`/` 开头是内容根目录，否则相对当前页面所在目录 | `file="notes/caveat.md"`、`file="/shared/notice.md"` |

引用只会读取 `content/` 与 `assets/` 里的文件。路径含 `..`，或者三处都找不到时，构建告警，什么也不插入。

Markdown 片段请放在 `assets/` 或 `content/` 下，在那里写什么名字就取到哪个文件。页面包（第 1 步）有个陷阱：Hugo 会把带语言后缀的资源（如 `notice.zh.md`）挂在去掉后缀的名字下，向页面包索取 `notice.md` 拿到的是已经渲染好的 HTML 而不是源码，结果页面的 Markdown 输出里会混进 `<div class="td-code">` 这样的标记。`.yaml`、`.sh`、`.txt` 等非 Markdown 文件不受影响。

## 引入代码文件 {#code}

加 `code=true` 让文件以代码块显示，`lang=` 指定高亮语言。直接引入仓库里真实的配置文件，文档就不会与文件本身脱节。

```markdown {title="源码"}
{{</* include file="parts/module.zh.yml" code=true lang="yaml" */>}}
```

{{< include file="parts/module.zh.yml" code=true lang="yaml" >}}

引入的代码块与代码围栏一样有高亮、行号和复制按钮。`title=`、`collapse`、`hl_lines=` 这类围栏属性无法通过 `include` 传入，需要它们时，请写成普通的[代码块](/zh/docs/components/code/)。

## 片段内容 {#snippet-content}

片段是普通 Markdown，在引用它的页面上下文里渲染，所以提示块、表格、列表、图片、步骤和 shortcode 都能用。上面例子的最后一行显示的正是本站当前的发布版本，因为片段里的 `{{</* param version */>}}` 是在本页展开的。

两个页面引用同一个片段时，各自独立渲染，各自生成标题锚点和代码块 ID，互不冲突。适合做成片段的，是那些必须处处同步修改的内容：安装命令、连接串、支持矩阵、法律声明。

## 插入站点参数 {#param}

`param` 打印一个参数：先查本页 front matter，查不到再查站点配置，查找规则与 Hugo 的 `.Param` 相同。

```markdown {title="源码"}
本站发布版本 {{</* param version */>}}，版权起始年 {{</* param copyright.from_year */>}}，
本页 front matter 里写了 `pigsty_pg_major: 18`，这里取到 {{</* param pigsty_pg_major */>}}。
```

本站发布版本 {{< param version >}}，版权起始年 {{< param copyright.from_year >}}，
本页 front matter 里写了 `pigsty_pg_major: 18`，这里取到 {{< param pigsty_pg_major >}}。

嵌套键用 `.` 连接，`copyright.from_year` 读取的是 `params.copyright.from_year`。参数不存在，或者它的值是 map、列表而不是标量时，构建告警，什么也不输出。

## 在命令、表格与链接里插参数 {#param-in-place}

`param` 输出的是转义后的纯文本，因此也能放进代码围栏、表格单元格和链接地址，版本号通常就出现在这些地方：

````markdown {title="源码"}
```sh
hugo mod get github.com/pgsty/oink@{{</* param tdVersion.latest */>}}
```

| 项目 | 值 |
| --- | --- |
| 当前版本 | {{</* param version */>}} |
| Hugo 下限 | {{</* param hugoMinVersion */>}} |

[发布说明](https://github.com/pgsty/oink/releases/tag/{{</* param tdVersion.latest */>}})
````

```sh
hugo mod get github.com/pgsty/oink@{{< param tdVersion.latest >}}
```

| 项目 | 值 |
| --- | --- |
| 当前版本 | {{< param version >}} |
| Hugo 下限 | {{< param hugoMinVersion >}} |

[发布说明](https://github.com/pgsty/oink/releases/tag/{{< param tdVersion.latest >}})

站点参数在[配置总览](/zh/docs/customize/config/)中设置，页面参数见[页面参数](/zh/docs/write/frontmatter/)。

## 构建期删除的注释 {#comment}

待办事项、写给下一位作者的备注，放进 `comment`。它的内容在 HTML、打印、Markdown、RSS 所有输出里都会被删掉。HTML 注释做不到这一点：它留在页面源码里，还会进入 `llms.txt`。

```markdown {title="源码"}
PostgreSQL 18 起 `pg_stat_io` 拆分了 WAL 统计。

{{</* comment */>}}
待办：v0.5 发布后把上面的版本号换成 19，并补一张 pg_stat_io 的截图。
这段文字不会出现在任何输出里，包括 llms.txt。
{{</* /comment */>}}

升级前先在测试库上验证监控面板。
```

PostgreSQL 18 起 `pg_stat_io` 拆分了 WAL 统计。

{{< comment >}}
待办：v0.5 发布后把上面的版本号换成 19，并补一张 pg_stat_io 的截图。
这段文字不会出现在任何输出里，包括 llms.txt。
{{< /comment >}}

升级前先在测试库上验证监控面板。

这两段之间其实有一段注释，查看页面源码也找不到它。

## 输出形态 {#outputs}

三个 shortcode 都不加载脚本，打印与 RSS 显示的内容与网页相同。页面的 Markdown 输出保留源码而不是渲染后的 HTML：引入的片段原样输出，其中的 `{{</* param version */>}}` 等 shortcode 保持未展开；`include code=true` 变成一个代码围栏；`param` 输出参数值本身；`comment` 什么也不留下。

## 参数参考 {#reference}

`include`（只接受具名参数）：

| 参数 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `file` | 路径（必填） | — | 解析顺序见[文件位置](#sources)；含 `..`、文件缺失、空值时告警并不输出 |
| `code` | 布尔 | `false` | `true` 时按代码块渲染；带引号的 `code="true"` 会告警并按普通内容引入 |
| `lang` | 字符串 | — | 代码语言；没有 `code=true` 时告警并忽略 |
{.fields meta="type default"}

其它参数名会告警并被忽略，告警里带有文件名与行号。

`param`（一个位置参数）：

| 参数 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| 参数名 | 字符串（必填） | — | 嵌套键用 `.` 连接；先页面 front matter 后站点 `params`；缺失或非标量时告警并不输出 |
{.fields meta="type default"}

`comment` 没有参数，成对使用，`{{</* comment */>}}` 与 `{{</* /comment */>}}` 之间的内容整段丢弃。

## 限制与常见问题 {#limits}

- `include` 不是模板：不能向片段传变量，不能按条件引入，也不能给引入的代码块加 `title=`、`collapse` 等围栏属性。需要按平台区分时，写两个片段，放进[标签页](/zh/docs/components/tabs/)。
- `include` 不做语言回退，写什么路径就读什么文件。一个片段可以供所有语言共用；也可以像本页这样每种语言一份（`install-oink.md` 与 `install-oink.zh.md`），各语言页面引用自己的那份。
- `param` 只打印标量。版本矩阵、下载列表这类结构化数据放在 `data/` 里，用对应的组件渲染。
- `comment` 的内容每次构建都会被丢弃。想让整页暂时下线，用 `draft: true`。
- 一页如果要引入十个片段，给读者十条链接通常比拼出一个大页面更好。

## 相关 {#related}

- [代码块](/zh/docs/components/code/) — 围栏的全部属性，`include code=true` 用的是同一套渲染
- [标签页](/zh/docs/components/tabs/) — 按平台 / 语言分版本的片段
- [配置总览](/zh/docs/customize/config/) — `param` 能取到的站点参数
- [页面参数](/zh/docs/write/frontmatter/) — 页面级参数，优先于站点配置
