---
title: 代码块
linkTitle: 代码块
description: 用普通 Markdown 围栏展示命令、配置与源码，带文件名标题、精确复制、行号、高亮、换行、折叠与可链接的行。
weight: 120
search_keywords: [代码块, Code Block, 围栏, fence, 复制, copy, 行号, lineNos, 高亮, hl-lines, 折叠, collapse, 换行, wrap, Chroma, 语法高亮]
aliases:
  - /docs/components/code-blocks/
---

命令、配置文件与源码都写在普通的 Markdown 围栏里。语法高亮由 Hugo 内置的 Chroma 在构建站点时完成，页面拿到的是已经着色的 HTML，浏览器里不运行任何高亮器。围栏开头那一行的属性补上技术文档读者真正依赖的东西：代码上方的文件名、只复制该复制内容的复制按钮、行号、长文件的折叠，以及指向某一行的链接。`mermaid`、`echarts`、`filetree` 这类画图或展示数据的围栏是独立的组件，各有自己的页面。

## 最简例子 {#minimal}

````markdown {title="源码"}
```sql
SELECT datname, numbackends FROM pg_stat_database ORDER BY numbackends DESC;
```
````

```sql
SELECT datname, numbackends FROM pg_stat_database ORDER BY numbackends DESC;
```

不写任何属性的围栏也有完整的外框与复制按钮；没有标题的块就不显示标题栏。复制按钮位于右上角，鼠标悬停在块上或焦点进入块内时出现，在触屏设备上始终可见。页面上不显示语言名，站点 CSS 可以从块的 `data-td-language` 属性读到它。

语言标记就是 Chroma 的 lexer 名，绝大多数编程语言与文件格式都有对应的 lexer。比如 `diff` 围栏会用各自的颜色显示增加与删除的行，不需要额外的组件：

````markdown {title="源码"}
```diff {title="hugo.yml 的改动"}
 params:
   ui:
-    sidebar_menu_compact: true
+    sidebar_menu_compact: false
     sidebar_menu_foldable: true
```
````

```diff {title="hugo.yml 的改动"}
 params:
   ui:
-    sidebar_menu_compact: true
+    sidebar_menu_compact: false
     sidebar_menu_foldable: true
```

## 文件名标题 {#title}

`title` 在代码上方加一条标题栏，通常写文件名或路径，让读者知道这段代码该放到哪里。它同时成为这个块的无障碍名称。

````markdown {title="源码"}
```yaml {title="hugo.yml"}
markup:
  goldmark:
    parser:
      attribute:
        block: true
    renderer:
      unsafe: true
```
````

```yaml {title="hugo.yml"}
markup:
  goldmark:
    parser:
      attribute:
        block: true
    renderer:
      unsafe: true
```

`filename` 是 `title` 的别名。两个同时出现时，构建会告警并使用 `filename`。

## 行号、起始行与高亮 {#line-numbers}

`lineNos="inline"` 把行号放在代码同一列；`lineNoStart` 设置起始编号，适合摘录长文件中间的一段。`hl_lines` 高亮你希望读者注意的行，它从 1 开始数围栏内的行，与 `lineNoStart` 无关。

````markdown {title="源码"}
```ini {title="postgresql.conf" lineNos="inline" lineNoStart=120 hl_lines="2 4-5"}
shared_buffers = 8GB
max_connections = 200
work_mem = 64MB
wal_level = replica
max_wal_senders = 10
```
````

```ini {title="postgresql.conf" lineNos="inline" lineNoStart=120 hl_lines="2 4-5"}
shared_buffers = 8GB
max_connections = 200
work_mem = 64MB
wal_level = replica
max_wal_senders = 10
```

`lineNos="table"` 把行号放进单独的一列，读者手动选中代码时不会带上行号。两种模式下，复制按钮都会去掉行号。

````markdown {title="源码"}
```bash {title="部署三条命令" lineNos="table"}
./configure -c rich
./install.yml
pig ext install pg_duckdb
```
````

```bash {title="部署三条命令" lineNos="table"}
./configure -c rich
./install.yml
pig ext install pg_duckdb
```

Hugo 的其它高亮选项原样交给 Chroma，例如决定制表符展开成几个空格的 `tabWidth`。`style` 默认不起作用：OINK 用 CSS class 着色，代码颜色才能跟随深浅色切换；只有设置 `params.highlight_classes: false` 改回内联样式后，Chroma 的样式才会生效。

## 长行换行 {#wrap}

长行默认横向滚动。`wrap=true` 让它在屏幕上折行显示，适合很长的 URL 与校验和；源码与复制出来的文本仍保持原来的行。

````markdown {title="源码"}
```text {title="config/artifacts.env" wrap=true}
ARTIFACT_URL=https://repo.pigsty.io/pkg/infra/v3.6.0/infra-pkg-v3.6.0.el9.x86_64.tgz
CHECKSUM=sha256:6d3dce4f7acb18f586469adcb80ab35f3e859f9837786e151cfbc2b3c0f587b2
```
````

```text {title="config/artifacts.env" wrap=true}
ARTIFACT_URL=https://repo.pigsty.io/pkg/infra/v3.6.0/infra-pkg-v3.6.0.el9.x86_64.tgz
CHECKSUM=sha256:6d3dce4f7acb18f586469adcb80ab35f3e859f9837786e151cfbc2b3c0f587b2
```

换行不能与 `lineNos="table"` 同用：折行之后，代码行就与单独一列里的行号对不齐了。两者同时出现时，构建会告警并关闭换行；两样都要时请改用 `lineNos="inline"`。

## 折叠长代码 {#collapse}

`collapse=N` 只显示前 N 行，下面放一个「显示全部 M 行」按钮（M 为总行数），免得一整份配置文件把讲解挤出屏幕。

````markdown {title="源码"}
```yaml {title="hugo.yml" collapse=8}
baseURL: https://oink.pgsty.com/
title: OINK
defaultContentLanguage: en
languages:
  en:
    languageName: English
    weight: 1
  zh:
    languageName: 简体中文
    weight: 2
params:
  offline_search: true
  ui:
    sidebar_menu_foldable: true
```
````

```yaml {title="hugo.yml" collapse=8}
baseURL: https://oink.pgsty.com/
title: OINK
defaultContentLanguage: en
languages:
  en:
    languageName: English
    weight: 1
  zh:
    languageName: 简体中文
    weight: 2
params:
  offline_search: true
  ui:
    sidebar_menu_foldable: true
```

折叠只是在屏幕上隐藏多余的行，页面里始终是完整的文件，所以没有 JavaScript、使用读屏器或打印时，代码都是完整的。行数不超过 N 的块不会出现按钮。折叠可以与换行一起用，不会把折行的那一行截成两半。

## 复制内容 {#copy}

复制按钮复制整个块，终端会话除外。在 `console` 或 `shell-session` 围栏里，它只复制命令：保留以提示符开头的行，去掉提示符本身，丢弃输出。下面这个块复制出来是两条命令，没有 `$`，也没有输出行：

````markdown {title="源码"}
```console
$ pig ext list duckdb
name       version  category
pg_duckdb  1.0.0    OLAP
$ pig ext install pg_duckdb
INFO installing pg_duckdb
```
````

```console
$ pig ext list duckdb
name       version  category
pg_duckdb  1.0.0    OLAP
$ pig ext install pg_duckdb
INFO installing pg_duckdb
```

要连提示符和输出一起复制，写 `copy="all"`。`bash`、`sh` 这类普通 lexer 分不清哪里是提示符、哪里是命令和输出，所以在它们上面写 `copy="command"` 会告警并复制全部内容。一条命令跨多行时，每个续行都要以提示符开头，通常是 `>`，否则这一行会被当作输出而被排除。

会话块里一个提示符都没有时无法复制：按钮显示错误图标，并在浏览器控制台记录一条错误，剪贴板保持原样，不会改为复制整块内容。

`copy=false` 去掉复制按钮，用于不该被人粘贴的反例：

````markdown {title="源码"}
```yaml {title="反例：无效的布尔值" copy=false}
params:
  ui:
    image_zoom: sometimes   # 错：应使用 true 或 false
```
````

```yaml {title="反例：无效的布尔值" copy=false}
params:
  ui:
    image_zoom: sometimes   # 错：应使用 true 或 false
```

`params.ui.code_copy: false` 去掉所有未自行设置 `copy` 的块上的复制按钮（见[配置总览](/zh/docs/customize/config/)）。复制按钮只有图标，成功或失败时换一个图标，并播报本地化的状态。复制出的文本保留缩进、空行与 Unicode，去掉行号，末尾恰好一个换行。

## 单行命令 {#presentation}

只有一条、希望读者直接粘贴的命令，可以显示成紧凑的命令条，复制按钮独占一列：给单行围栏加上 `{class="td-code-command"}`。块有多行、带行号或设置了 `collapse` 时会告警，并保留普通外框。示例见[组件呈现](/zh/docs/components/presentation/#tabs)。

## 行链接与稳定 ID {#line-links}

想在正文里链接到「第 4 行」，就给围栏一个 `id`，并设置 `anchorLineNos=true`。每个行号随即成为指向 `#<id>-<行号>` 的链接：

````markdown {title="源码"}
```sql {id="ex-explain" title="explain.sql" lineNos="table" anchorLineNos=true}
EXPLAIN (ANALYZE, BUFFERS)
SELECT relname, n_live_tup
FROM pg_stat_user_tables
WHERE n_live_tup > 1000
ORDER BY n_live_tup DESC;
```

跳到 [第 4 行](#ex-explain-4)。
````

```sql {id="ex-explain" title="explain.sql" lineNos="table" anchorLineNos=true}
EXPLAIN (ANALYZE, BUFFERS)
SELECT relname, n_live_tup
FROM pg_stat_user_tables
WHERE n_live_tup > 1000
ORDER BY n_live_tup DESC;
```

跳到 [第 4 行](#ex-explain-4)。

只要打算分享链接，就自己写 `id`。不写时主题也会生成一个页面内唯一的 ID，但它取决于围栏在页面中的位置，前面插入一个围栏，ID 就会改变，旧链接随之失效。`id` 不能含空格或控制字符，也不能与页面上的其它 ID 重复；空的或无效的 `id` 会告警，并换成自动生成的 ID；重复的 `id` 告警但不改名。

## 编号例 {#numbered}

在书或长篇手册里，`num` 加 `caption` 让围栏成为一个编号示例，可以被 [`xref`](/zh/docs/write/book/#xref) 引用，也会出现在全书的示例目录里。编号由你自己写，主题从不自动计数；锚点默认是 `eg-<num>`。

````markdown {title="源码"}
```sql {num="4-1" caption="按表统计膨胀率" #eg-bloat}
SELECT schemaname, relname, n_dead_tup, n_live_tup
FROM pg_stat_user_tables
WHERE n_dead_tup > n_live_tup * 0.2;
```

参见 {{</* xref eg="4-1" anchor="eg-bloat" */>}}。
````

```sql {num="4-1" caption="按表统计膨胀率" #eg-bloat}
SELECT schemaname, relname, n_dead_tup, n_live_tup
FROM pg_stat_user_tables
WHERE n_dead_tup > n_live_tup * 0.2;
```

参见 {{< xref eg="4-1" anchor="eg-bloat" />}}。

`num` 与 `caption` 必须成对出现：只有说明没有编号，或只有编号没有说明，都会告警并丢弃。编号示例不能同时是标签页，所以 `num` 与 `tab` 同时出现时告警并忽略 `tab`。图、表、公式的编号见[书籍出版](/zh/docs/write/book/)。

## 一组围栏做成标签页 {#tabs}

连续几个都带 `tab` 属性的围栏会合成一组标签页，适合同一条命令在不同包管理器下的写法。第一个围栏上的 `group` 让读者可以分享指向某个标签的链接，让同名的组保持同步，并记住读者的选择。

````markdown {title="源码"}
```bash {tab="Homebrew" group="oink-install" value="brew"}
brew install hugo
```
```bash {tab="APT" value="apt"}
sudo apt install hugo
```
````

```bash {tab="Homebrew" group="oink-install" value="brew"}
brew install hugo
```
```bash {tab="APT" value="apt"}
sudo apt install hugo
```

分组语法、URL hash、同步规则与装正文的标签页见[标签页](/zh/docs/components/tabs/)。

## 易错写法 {#pitfalls}

- **围栏里的 shortcode 照样会执行**。围栏挡不住 Hugo 解析 shortcode，代码块里写的 `{{</* tabs */>}}` 仍会被执行。要把 shortcode 当文字展示，在两侧定界符内侧各加一个注释标记，写成 <code>&#123;&#123;&lt;/&#42; tabs &#42;/&gt;&#125;&#125;</code>，百分号形式对应 <code>&#123;&#123;%/&#42; steps &#42;/%&#125;&#125;</code>。本页展示的每个 shortcode 都是这样写的。
- **围栏里套围栏**，外层要更长：外层四个反引号、内层三个，本页每一段「源码」都是如此；内层还有围栏时，外层再加一个反引号。
- **属性写在开头那一行**，跟在语言后面。表格和图片的属性行写在块的下一行，围栏不是；围栏下方的 `{…}` 会显示成一行文字。
- **列表项里的围栏**，要缩进到列表项文字的位置（`1.` 之后三个空格），否则围栏会把列表截断。

## 输出形态 {#outputs}

复制与折叠按钮要等页面脚本运行后才出现；页面上没有复制或折叠控件时，根本不加载这段脚本。打印时每个块都完整显示，去掉按钮、保留标题栏，长块可以跨页。页面的 Markdown 输出原样保留每个围栏及其属性。

## 参数参考 {#reference}

开头那一行、语言之后的 `{…}` 里可以写的 OINK 属性：

| 参数 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `title` | 非空字符串 | 无 | 可见标题栏（通常是文件名），同时是无障碍名称 |
| `filename` | 非空字符串 | 无 | `title` 的别名；两者同时出现时告警并使用 `filename` |
| `copy` | `all` `command` `true` `false` | 会话 lexer 为 `command`，其余为 `all` | `true` 等价于 `all`；`command` 只允许 `console`/`shell-session` |
| `wrap` | 布尔 | `false` | 视觉换行，不改源码；与表格行号互斥 |
| `collapse` | 正整数 | 无 | 初始显示的最大行数；行数不足时不生效 |
| `label` | 非空字符串 | 由标题派生 | 无障碍名称，不显示在页面上；与 `aria-label` 互斥 |
| `id` | 非空 token | 自动生成 | 稳定的块 ID 与行锚点前缀；不能含空白 |
| `tab` | 非空字符串 | 无 | 标签名，见[标签页](/zh/docs/components/tabs/)；与 `num` 互斥 |
| `group` | `^[a-z][a-z0-9_-]*$` | 无 | 写在一组的第一个围栏上，启用 hash / 同步 / 持久化；需要 `tab` |
| `value` | `^[a-z0-9][a-z0-9_-]*$` | 无 | 分组时每个块必填；未分组时只用作面板标识；需要 `tab` |
| `num` | `[0-9A-Za-z.-]+` | 无 | 编号示例（Book `eg`）；必须与 `caption` 同时出现 |
| `caption` | 纯文本 | 无 | 编号示例的说明；必须与 `num` 同时出现 |
| `class` | class 列表 | 无 | 追加到 `.td-code` 根元素；`td-code-command` 生成[命令条](#presentation) |
| `data-*` / `aria-*` / `role` | 字符串 | 无 | 透传到根元素 |
{.fields meta="type default"}

`title`、`filename` 与 `label` 已经为块提供了无障碍名称和 `role="group"`，所以与它们之一同时出现的 `aria-label`、`aria-labelledby` 或 `role` 会告警并被忽略；这三个属性只在块既没有标题也没有 `label` 时才透传。未知、不安全与主题保留的属性会告警并被忽略，警告里列出允许的名字。

同一行还可以写 Chroma 的选项，主题原样交给 Hugo：

| 选项 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `lineNos` | `false` `inline` `table` | `false` | 行号形态；`table` 与 `wrap=true` 互斥 |
| `lineNoStart` | 正整数 | `1` | 显示的起始行号，不影响 `hl_lines` 的计数 |
| `hl_lines` | 行号与区间 | 无 | 如 `"2 4-5"`，按围栏内源码行计数 |
| `anchorLineNos` | 布尔 | `false` | 行号变成锚点链接，前缀取自块的 `id` |
| `tabWidth` | 正整数 | Hugo 默认 | 制表符展开的空格数 |
{.fields meta="type default"}

## 限制与常见问题 {#limits}

- 高亮器只有 Chroma，没有 Shiki、Twoslash、浏览器端高亮，也没有可运行的代码演练场；补丁请用 `diff` 围栏。
- `copy="command"` 只适用于 `console` 与 `shell-session` 两个 lexer，用在别处会告警并复制全部内容。
- 自动生成的 ID 不是永久链接。凡是要从别处链接过来的行或块，都自己写 `id`。
- `mermaid`、`math`、`chem`、`markmap`、`plantuml`、`echarts`、`infographic`、`checksums`、`filetree`、`gallery`、`map` 围栏不是代码块，各自渲染成独立的组件，没有代码外框，也没有复制按钮。

## 相关 {#related}

- [标签页](/zh/docs/components/tabs/) — 相邻围栏合成标签页的完整规则
- [引用](/zh/docs/components/include/) — 把仓库里的真实文件当代码块插进来
- [书籍出版](/zh/docs/write/book/) — 编号示例、交叉引用与示例目录
- [打印支持](/zh/docs/customize/print/) — 长代码在打印里的形态
