---
title: 文件树
linkTitle: 文件树
description: 用 `filetree` 围栏画一棵带注释的目录树：注释列自动对齐，条目带图标，目录可以折叠。
weight: 270
search_keywords: [文件树, FileTree, 目录树, tree, 目录结构, 仓库结构, 围栏, icon, tone, open]
---

文件树（FileTree）用来逐条解释一个目录结构：配置放在哪、数据在哪个目录、哪些东西可以删。它写在 `filetree` 围栏里：缩进表示层级，结尾的 `/` 表示目录，`#` 之后是注释。主题会把注释排成对齐的一列，把目录渲染成读者可以展开、收起的文件夹。

文件树只画出与读者相关的那部分结构，并说明原因。需要读者逐字复制的清单，请用普通[代码块](/zh/docs/components/code/)。

## 最简例子 {#minimal}

````markdown {title="源码"}
```filetree
- content/
  - _index.zh.md
  - docs/
  - blog/
- hugo.yml
- go.mod
```
````

```filetree
- content/
  - _index.zh.md
  - docs/
  - blog/
- hugo.yml
- go.mod
```

项目符号（`-`、`*` 或 `+`）可写可不写，效果相同。有子项的条目就是目录；没有子项的条目，只有名字以 `/` 结尾时才算目录。

## 加注释 {#comments}

每行第一个前面带空白的 `#` 之后都是注释，显示在右侧对齐的一列里。注释是纯文本，其中的 Markdown 按字面显示；需要字面井号时写 `\#`。

````markdown {title="源码"}
```filetree
- content/          # 全部页面，中英双语同目录
  - docs/          # 你正在读的这棵文档树
  - blog/           # 发布说明与文章
- assets/css/       # 站点自己的 CSS，在主题样式表之后加载
- layouts/          # 站点级模板覆盖，越少越好
- static/images/    # 不需要构建期处理的图
- hugo.yml          # 站点配置：语言、菜单、params.ui
```
````

```filetree
- content/          # 全部页面，中英双语同目录
  - docs/          # 你正在读的这棵文档树
  - blog/           # 发布说明与文章
- assets/css/       # 站点自己的 CSS，在主题样式表之后加载
- layouts/          # 站点级模板覆盖，越少越好
- static/images/    # 不需要构建期处理的图
- hugo.yml          # 站点配置：语言、菜单、params.ui
```

源码里的 `#` 不必手工对齐：主题把注释列的起点放在最宽的名称之后，每条注释自然对齐。注释列占面板宽度的三成到一半。读者可以拖动两列之间的虚线分隔条，也可以用 <kbd>Tab</kbd> 聚焦后按方向键调整，<kbd>Home</kbd> 与 <kbd>End</kbd> 直接到两端。分隔条是文件树唯一的脚本，所以不带注释的树不加载任何 JavaScript。

过长的名称或注释会在各自的列里以省略号截断，鼠标悬停可以看到完整文本：

````markdown {title="源码"}
```filetree {title="两列都发生截断"}
- runbooks/
  - a-deliberately-long-runbook-filename-for-a-failover-drill.md  # 同样超长的注释，写在一行里，因此必须在注释列内截断
  - restart.md                                                    # 短名字
```
````

```filetree {title="两列都发生截断"}
- runbooks/
  - a-deliberately-long-runbook-filename-for-a-failover-drill.md  # 同样超长的注释，写在一行里，因此必须在注释列内截断
  - restart.md                                                    # 短名字
```

屏幕窄于 `sm` 断点时，文件树收成单列：注释移到名称下方并完整显示，分隔条隐藏。

## 长注释换行 {#wrap}

如果注释正是这棵树的重点、必须读全，在围栏上加 `wrap=true`。注释会在本列内换行，连没有空格的长标识符也会折行，行高随内容增长；名称仍然用省略号截断。折叠、分隔条、窄屏布局与打印都不受影响。

````markdown {title="源码"}
```filetree {title="完整存储注释" wrap=true}
- storage/
  - metadata/ # 元数据定义：属性键、顶点标签、边标签、索引和计数器。
  - graph/    # 图数据：顶点、边、索引表，以及 OLAP 分析任务使用的数据。
```
````

```filetree {title="完整存储注释" wrap=true}
- storage/
  - metadata/ # 元数据定义：属性键、顶点标签、边标签、索引和计数器。
  - graph/    # 图数据：顶点、边、索引表，以及 OLAP 分析任务使用的数据。
```

## 标题栏 {#title}

围栏上的 `{title="…"}` 在树的上方加一条标题栏。读者需要知道这棵树描述的是哪台机器、哪个仓库时，它很有用。

````markdown {title="源码"}
```filetree {title="备份主机上的 pgBackRest 仓库"}
- /pg/backup/
  - archive/         # WAL 段文件，时间点恢复要用
  - backup/          # 全量、差异与增量备份
- /etc/pgbackrest/
  - pgbackrest.conf  # stanza、保留策略与仓库设置
```
````

```filetree {title="备份主机上的 pgBackRest 仓库"}
- /pg/backup/
  - archive/         # WAL 段文件，时间点恢复要用
  - backup/          # 全量、差异与增量备份
- /etc/pgbackrest/
  - pgbackrest.conf  # stanza、保留策略与仓库设置
```

## 缩进与层级 {#indent}

层级由缩进决定。两个空格、四个空格、制表符（按四列计）都可以，同一棵树里甚至可以混用，只要每次退回的层级之前打开过。因此 `tree` 命令的输出可以原样粘贴进来，开头的根目录行和结尾的统计行都不用删，统计行会被自动丢弃。

````markdown {title="源码"}
```filetree
content/docs
├── about
│   ├── _index.zh.md
│   └── features.zh.md
├── components
│   ├── filetree.zh.md
│   └── image
│       └── index.zh.md
└── _index.zh.md

3 directories, 5 files
```
````

```filetree
content/docs
├── about
│   ├── _index.zh.md
│   └── features.zh.md
├── components
│   ├── filetree.zh.md
│   └── image
│       └── index.zh.md
└── _index.zh.md

3 directories, 5 files
```

如果某一行退回到从未打开过的层级，构建会告警并给出它在围栏内的行号，这一行被跳过。

## 折叠与显式类型 {#dir-file}

有子项的目录默认展开；在行尾写 `{open=false}` 可以让它初始收起，大的目录树因此能把注意力留在你正在讲解的部分。目录是原生 `<details>` 元素，用键盘就能展开、收起，不需要 JavaScript。单凭名字看不出类型时，用 `{type=dir}` 或 `{type=file}` 指定。

````markdown {title="源码"}
```filetree {title="内容目录"}
- content/
  - docs/                # 文档树
    - components/         # 28 个组件页        {open=false}
      - callout.zh.md
      - filetree.zh.md
      - image/            # 页面包：正文 + 图  {type=dir}
    - customize/          # 站点级配置          {open=false}
      - config.zh.md
  - blog/
    - release.zh.md
```
````

```filetree {title="内容目录"}
- content/
  - docs/                # 文档树
    - components/         # 28 个组件页        {open=false}
      - callout.zh.md
      - filetree.zh.md
      - image/            # 页面包：正文 + 图  {type=dir}
    - customize/          # 站点级配置          {open=false}
      - config.zh.md
  - blog/
    - release.zh.md
```

## 图标与配色 {#icon-tone}

主题根据名字挑选图标。目录图标随展开、收起切换；文件先按完整文件名匹配（`LICENSE`、`Makefile`、`go.mod`、`package.json`、`.gitignore` 等），再按扩展名匹配（`md yml toml json sh py go js sql css png svg pdf zip` 等），都不匹配时用通用的文件图标。

`{icon=…}` 用一对 Font Awesome class 替换图标。`{tone=…}` 给图标上色，取值与[徽章](/zh/docs/components/badge/)相同：`neutral`、`info`、`success`、`warning`、`danger`。

````markdown {title="源码"}
```filetree {title="部署目录：权限与要点"}
- /etc/pigsty/                 # 0755 root:root · 配置根目录        {icon="fa-solid fa-server" tone=info}
  - pigsty.yml                 # 0644 root:root · 集群清单
  - ca/                        # 0700 root:root · 自签 CA，不要提交进 Git  {icon="fa-solid fa-lock" tone=danger open=false}
    - ca.key                   # 0600 root:root
- /var/lib/pgsql/18/data/      # 0700 postgres:postgres · 数据目录   {tone=warning}
  - postgresql.conf            # 0600 postgres:postgres
- /usr/bin/pig                 # 0755 root:root · 命令行工具         {icon="fa-solid fa-terminal" tone=success}
```
````

```filetree {title="部署目录：权限与要点"}
- /etc/pigsty/                 # 0755 root:root · 配置根目录        {icon="fa-solid fa-server" tone=info}
  - pigsty.yml                 # 0644 root:root · 集群清单
  - ca/                        # 0700 root:root · 自签 CA，不要提交进 Git  {icon="fa-solid fa-lock" tone=danger open=false}
    - ca.key                   # 0600 root:root
- /var/lib/pgsql/18/data/      # 0700 postgres:postgres · 数据目录   {tone=warning}
  - postgresql.conf            # 0600 postgres:postgres
- /usr/bin/pig                 # 0755 root:root · 命令行工具         {icon="fa-solid fa-terminal" tone=success}
```

`tone` 只给图标上色，从不改变文字颜色。含义请写在名字或注释里，分辨不出颜色的读者也能从文字中读到。

## 条目链接 {#link}

把条目写成 `[名字](链接)` 就成了链接，例如指向讲解这个文件的页面。站内路径、相对路径、`http(s):` 都可以，URL 校验与其它组件相同。

````markdown {title="源码"}
```filetree {title="本站的组件页"}
- content/docs/components/
  - [callout.zh.md](/zh/docs/components/callout/)     # 提示块
  - [filetree.zh.md](/zh/docs/components/filetree/)   # 当前页面
  - [gallery.zh.md](/zh/docs/components/gallery/)     # 画廊
  - image/                                             # 页面包
    - [index.zh.md](/zh/docs/components/image/)       # 图片
- [hugo.yml](https://github.com/pgsty/oink.pgsty.com/blob/main/hugo.yml)   # 本站配置（GitHub）
```
````

```filetree {title="本站的组件页"}
- content/docs/components/
  - [callout.zh.md](/zh/docs/components/callout/)     # 提示块
  - [filetree.zh.md](/zh/docs/components/filetree/)   # 当前页面
  - [gallery.zh.md](/zh/docs/components/gallery/)     # 画廊
  - image/                                             # 页面包
    - [index.zh.md](/zh/docs/components/image/)       # 图片
- [hugo.yml](https://github.com/pgsty/oink.pgsty.com/blob/main/hugo.yml)   # 本站配置（GitHub）
```

## 按平台分成标签页 {#tabs}

不同平台的目录布局不一样时，给每个围栏写 `tab=`（以及 `group=`、`value=`），相邻的围栏就合并成一组[标签页](/zh/docs/components/tabs/)，其中可以混排文件树与代码围栏。

````markdown {title="源码"}
```filetree {tab="Linux" group="platform" value="linux"}
- /etc/pigsty/          # 配置
- /var/lib/pgsql/       # 数据
- /usr/bin/pig          # 可执行文件
```
```filetree {tab="macOS" value="macos"}
- ~/Library/Application Support/pigsty/   # 配置
- /opt/homebrew/bin/pig                   # 可执行文件
```
````

```filetree {tab="Linux" group="platform" value="linux"}
- /etc/pigsty/          # 配置
- /var/lib/pgsql/       # 数据
- /usr/bin/pig          # 可执行文件
```
```filetree {tab="macOS" value="macos"}
- ~/Library/Application Support/pigsty/   # 配置
- /opt/homebrew/bin/pig                   # 可执行文件
```

## 输出形态 {#outputs}

打印时所有目录全部展开，注释换行而不截断，也没有分隔条。页面的 Markdown 输出原样保留 `filetree` 围栏，RSS 则把同一段源码放在 `<pre>` 块里。

## 参数参考 {#reference}

围栏属性（写在 ```` ```filetree ```` 后面）：

| 属性 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `title` | 纯文本 | — | 树上方的标题栏；不写就没有；不能为空 |
| `wrap` | 布尔值 | `false` | 长注释换行，行高随内容增长；名称继续省略；无效值告警并按 `false` 处理 |
| `tab` | 纯文本 | — | 让这棵树成为一个标签页 |
| `group` / `value` | 字符串 | — | 标签页分组与同步值；必须与 `tab` 同时出现 |
| `class` | class 列表 | — | 透传给站点 CSS |
{.fields meta="type default"}

条目属性（写在每行末尾的 `{…}` 里）：

| 属性 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `icon` | Font Awesome class 对 | 按名字 / 扩展名匹配 | 例如 `fa-solid fa-lock`；格式不符时告警并使用默认图标 |
| `tone` | 枚举 | `neutral` | `neutral` `info` `success` `warning` `danger`，只给图标上色 |
| `open` | 布尔 | `true` | 仅目录；`false` 表示初始收起 |
| `type` | 枚举 | 自动判断 | `dir` 或 `file`，覆盖自动判断 |
{.fields meta="type default"}

行语法：

| 元素 | 说明 |
| --- | --- |
| 缩进 | 两个空格 / 四个空格 / 制表符 / `tree` 的 `│ ├── └──` 连线都行 |
| `- name` | 项目符号可省略；`-` `*` `+` 等价 |
| `name/` | 结尾斜杠表示目录；名字原样渲染，斜杠保留 |
| `[name](url)` | 带链接的条目 |
| `# 注释` | 第一个前面带空白的 `#` 之后的内容；`\#` 是字面井号 |
| `N directories, M files` | `tree` 的统计行，自动丢弃 |
{.fields}

未知属性或取值、写在文件上的 `open`、格式错误的 `{…}`、退回到未打开过的层级，都会告警并给出围栏内的行号，主题随后采用安全的默认值或跳过该行。

## 限制与常见问题 {#limits}

- 只有 `filetree` 围栏这一种写法，没有 `{.filetree}` 列表标记，也没有 shortcode。
- 名字与注释都是纯文本，`**粗体**` 会原样显示，源码在任何 Markdown 阅读器里都读得通。
- 文件树不读取磁盘，它就是你写下或粘贴的文字，不会跟随仓库后来的变化。
- 不提供搜索、多选或一键复制整棵树；读者需要复制清单时用代码块。
- 拖动过的分隔条位置不保存，刷新后回到构建期算出的宽度。

## 相关 {#related}

- [代码块](/zh/docs/components/code/) — 需要逐字复制的清单
- [标签页](/zh/docs/components/tabs/) — 按平台并列多棵树
- [徽章](/zh/docs/components/badge/) — `tone` 用的是同一套词汇
- [目录与页面组织](/zh/docs/write/organize/) — 真实的内容目录该怎么排
