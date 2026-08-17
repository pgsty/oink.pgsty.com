---
title: FileTree
description: 用 `filetree` 代码围栏展示带注释的仓库与目录结构：对齐的备注列、逐条目图标、可折叠的目录。
weight: 50
---

FileTree 用来解释仓库或目录布局中与读者相关的那部分。它是一个 `filetree`
代码围栏，围栏正文就是目录清单本身：缩进表达层级，结尾的 `/` 表示目录，`#`
之后的文字是备注，OINK 把备注渲染成对齐的灰色右列。在 GitHub
和任何 Markdown 阅读器里，围栏仍是一份可读的等宽清单；OINK
把它渲染成带图标、原生折叠和可选标题栏的面板。

## 适用场景 {#when-to-use}

FileTree 最适合安装指南、架构概览、部署手册和贡献说明中经过筛选的结构。只要条目值得配上备注、链接或图标，就用它；需要逐字复制的清单请用普通代码块。自动生成或变化频繁的目录树用正文描述即可，不要提交很快就会过时的大快照。

## 快速开始 {#quick-start}

### 源码 {#source}

````markdown
```filetree {title="仓库结构"}
- content/                        # 页面包与模板
  - _index.md                     # 分区落地页
  - docs/                         # 产品指南
    - [configuration.md](/zh/docs/configure/)   # 运行时设置
    - operations/                 # 运维手册与恢复流程   {open=false}
  - blog/
- [hugo.yml](https://github.com/pgsty/oink.pgsty.com/blob/main/hugo.yml)   # 站点配置
```
````

### 渲染结果 {#rendered-result}

```filetree {title="仓库结构"}
- content/                        # 页面包与模板
  - _index.md                     # 分区落地页
  - docs/                         # 产品指南
    - operations-and-troubleshooting/     # 运维手册与恢复流程
      - [a-deliberately-long-runbook-filename-that-does-not-wrap.md](/zh/docs/)   # 应急流程
    - [configuration.md](/zh/docs/configure/)   # 运行时设置
  - blog/                         # 发布说明与文章   {open=false}
    - release.md                  # 发布公告
- [hugo.yml](https://github.com/pgsty/oink.pgsty.com/blob/main/hugo.yml)   # 站点配置
- LICENSE
```

有子项的目录点击（或用键盘）即可折叠展开；备注列在每一行都从同一位置开始，且最多只占面板右侧的一半——拖动虚线分隔条（或聚焦后按方向键）可以把备注再往右推；过长的名称与备注以省略号截断，并用提示气泡显示全文。

## 记法 {#notation}

| 记法            | 含义                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------- |
| 缩进            | 层级：两个空格、四个空格、制表符，或 `tree` 命令输出的 `│   ├── └──` 连线——只要单位一致即可         |
| `- name/`       | 目录（有子项的条目即使没有斜杠也是目录）；名称按原样渲染                                          |
| `- name`        | 文件；项目符号可省略                                                                              |
| `# 备注`        | 第一个前面带空白的 `#` 之后的内容；渲染成对齐的灰色右列。需要字面 `#` 时写 `\#`                    |
| `[name](url)`   | 带链接的条目；URL 与其他组件的链接一样经过校验                                                    |
| `{key=value …}` | 行尾的逐条目属性：`icon`、`tone`、`open`、`type`（见下）                                           |
| `{title="…"}`   | 围栏属性：树上方的标题栏。不写就不画                                                              |

备注与名称都是纯文本——强调、行内代码等 Markdown 会按字面渲染，这样围栏源码始终可读。

### 参数 {#parameters}

围栏属性（写在开头一行）：

| 属性    | 类型   | 默认值 | 说明                               |
| ------- | ------ | ------ | ---------------------------------- |
| `title` | string | —      | 树上方的标题栏；不写就不画标题栏。 |
{.fields caption="FileTree 围栏属性"}

逐条目属性（写在条目行末尾的 `{…}` 里）：

| 属性   | 类型   | 默认值           | 说明                                                                                     |
| ------ | ------ | ---------------- | ---------------------------------------------------------------------------------------- |
| `icon` | string | 按文件名/扩展名   | 一对 Font Awesome class，如 `fa-solid fa-lock`；替换默认图标。                            |
| `tone` | enum   | `neutral`        | `neutral`、`info`、`success`、`warning`、`danger` 之一——给图标上色（与 [Badge](../badge/) 同一套词汇）。 |
| `open` | bool   | `true`           | 仅目录；`false` 表示初始折叠。                                                           |
| `type` | enum   | 自动判断         | `dir` 或 `file`；在既没有结尾 `/` 也没有子项时覆盖自动判断。                              |
{.fields caption="FileTree 条目属性"}

未知属性、未知取值、以及写在文件上的 `open` 都会让构建失败，并给出围栏内的行号。

### 默认图标 {#default-icons}

目录使用文件夹图标，随折叠状态切换开合。文件先按完整文件名匹配（`LICENSE`、`Makefile`、`Dockerfile`、`.gitignore`、`go.mod`、`package.json`、`Cargo.toml`、`.env`……），再按扩展名匹配（Markdown、YAML/TOML/JSON/INI
配置、shell 脚本、Python、Go、JavaScript、Rust、Java、PHP、HTML、CSS、SQL、图片、PDF、压缩包、lock
与密钥文件、日志……）；其余使用普通文件图标。`icon=` 始终优先。

## 更多示例 {#rich-examples}

### 属主与权限 {#ownership-and-permissions}

当布局本身要说明运维边界时，把权限位与身份写进备注，并节制地用 `icon`/`tone` 标出要点：

````markdown
```filetree
- /srv/atlas/                  # 0755 root:root · 应用根目录   {icon="fa-solid fa-server" tone=info}
  - releases/                  # 0750 deploy:release-engineering · 不可变构建
    - 2026.08.16/              # 0750 deploy:release-engineering · 当前版本
      - atlas-server           # 0555 deploy:atlas · 可执行文件   {icon="fa-solid fa-terminal" tone=success}
      - app.toml               # 0640 root:atlas · 运行配置
  - secrets/                   # 0700 root:security · 受限凭据   {icon="fa-solid fa-lock" tone=danger open=false}
    - production.env           # 0600 root:security
```
````

```filetree
- /srv/atlas/                  # 0755 root:root · 应用根目录   {icon="fa-solid fa-server" tone=info}
  - releases/                  # 0750 deploy:release-engineering · 不可变构建
    - 2026.08.16/              # 0750 deploy:release-engineering · 当前版本
      - atlas-server           # 0555 deploy:atlas · 可执行文件   {icon="fa-solid fa-terminal" tone=success}
      - app.toml               # 0640 root:atlas · 运行配置
  - secrets/                   # 0700 root:security · 受限凭据   {icon="fa-solid fa-lock" tone=danger open=false}
    - production.env           # 0600 root:security
```

### 粘贴 `tree` 输出 {#tree-output}

`tree` 命令的输出可以原样粘贴，包括根目录行和末尾的统计行（统计行会被丢弃）：

````markdown
```filetree
.
├── bin
│   └── pig
├── etc
│   └── pig.yml
└── README.md

2 directories, 3 files
```
````

```filetree
.
├── bin
│   └── pig
├── etc
│   └── pig.yml
└── README.md

2 directories, 3 files
```

### 深层嵌套 {#deep-nesting}

长名称不会换行；它在自己的列内截断，并用提示气泡显示全名。小于 small 断点时，备注移到名称下方而不再截断。

```filetree
- warehouse/                          # 持久数据集
  - raw/
    - events/
      - 2026/
        - 08/
          - events-2026-08-16.parquet   # 不可变的每日分区
  - curated/
    - orders_daily.parquet            # 每晚重建
- notebooks/
  - scratch.ipynb                     # 不纳入版本控制
```

## 语义与回退 {#semantics-and-fallback}

HTML 是一个带嵌套 `ul` 的面板 `<div>`（只有主题自己的 `td-` 前缀 class）；有子项的目录是原生的
`<details>`/`<summary>`（可用键盘操作，也不声明
`role="tree"`）。每一行是两列网格，名称列宽度在构建期按最长条目算出并限制在整行的
50%–70% 之间，因此备注无需运行时即可对齐；唯一的脚本是让分隔条可拖动的小运行时，没有它树也是完整的。打印渲染同一棵完全展开的静态树，Markdown
输出保留围栏本身，RSS 以 `<pre>` 携带源码。

## 有意的限制 {#deliberate-limits}

FileTree 不排序、不读取文件系统，也不在名称与备注里渲染行内
Markdown。目录树应保持精选且简短；需要逐字复制的清单请使用代码块。

## 从 0.4 迁移 {#migration}

`filetree`、`filetree/folder`、`filetree/file` 短代码与过渡期的 `{.filetree}`
列表标记均已移除。主题的迁移工具会把两者都改写成围栏：`label` 变为
`title`，`comment` 变为 `#` 备注，`link` 变为 Markdown 链接，`open`、`icon`、`color`（改名为
`tone`）变为行尾属性。
