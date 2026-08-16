---
title: FileTree
description: 用一个普通的嵌套 Markdown 列表展示带注释的仓库与目录结构。
weight: 50
---

FileTree 用来解释仓库或目录布局中与读者相关的那部分。它就是一个普通的嵌套列表，后面跟着
`{.filetree}` 标记：缩进表达层级，结尾的 `/` 表示目录，`—`
之后的文字是说明。源码在 GitHub 和任何 Markdown 阅读器里都是一个嵌套列表；OINK 把它渲染成带目录与文件图标的等宽字体树形面板。

## 适用场景 {#when-to-use}

FileTree 最适合安装指南、架构概览、部署手册和贡献说明中经过筛选的结构。需要逐字复制的命令输出请用代码块——把
`tree`
的输出贴进普通围栏根本不需要组件。自动生成或变化频繁的目录树用正文描述即可，不要提交很快就会过时的大快照。

## 快速开始 {#quick-start}

### 源码 {#source}

<!-- prettier-ignore-start -->

```markdown
- content/ — 页面包与模板
  - _index.md — 分区落地页
  - docs/ — 产品指南
    - [configuration.md](/zh/docs/configure/) — 运行时设置
    - operations/ — 运维手册与恢复流程
  - blog/
- [hugo.yml](https://github.com/pgsty/oink.pgsty.com/blob/main/hugo.yml) — 站点配置
{.filetree}
```

<!-- prettier-ignore-end -->

### 渲染结果 {#rendered-result}

<!-- prettier-ignore-start -->

- content/ — 页面包与模板
  - _index.md — 分区落地页
  - docs/ — 产品指南
    - operations-and-troubleshooting/ — 运维手册与恢复流程
      - [a-deliberately-long-runbook-filename-that-wraps-without-horizontal-overflow.md](/zh/docs/) — 应急流程
    - [configuration.md](/zh/docs/configure/) — 运行时设置
  - blog/ — 发布说明与文章
    - release.md — 发布公告
- [hugo.yml](https://github.com/pgsty/oink.pgsty.com/blob/main/hugo.yml) — 站点配置
{.filetree}

<!-- prettier-ignore-end -->

每个条目都是普通的列表项，因此链接、强调与行内代码的写法与 Markdown 其他地方完全相同。

## 记法 {#notation}

| 记法          | 含义                                                   |
| ------------- | ------------------------------------------------------ |
| 缩进          | 层级；每级两个空格                                     |
| `- name/`     | 目录（有子项的条目即使没有斜杠也是目录）               |
| `- name`      | 文件                                                   |
| ` — 说明`     | 分隔符之后的内容都是该条目的说明（书写约定）           |
| `[name](url)` | 带链接的条目；`*强调*` 与 `` `代码` `` 是普通 Markdown |
| `{.filetree}` | 紧跟在列表下一行的标记                                 |

树是静态且完全展开的。目录靠嵌套列表识别；只写了结尾 `/`
的空目录保留通用条目图标。没有逐条目的图标、颜色或属主字段：`0640 root:wheel`
这类文件系统记法直接写进说明文字。

## 更多示例 {#rich-examples}

### 属主与权限 {#ownership-and-permissions}

当布局本身要说明运维边界时，把权限位与身份写进说明：

<!-- prettier-ignore-start -->

```markdown
- /srv/atlas/ — 0755 root:root · 应用根目录
  - releases/ — 0750 deploy:release-engineering · 不可变构建
    - 2026.08.16/ — 0750 deploy:release-engineering · 当前版本
      - atlas-server — 0555 deploy:atlas · 可执行文件
      - app.toml — 0640 root:atlas · 运行配置
  - secrets/ — 0700 root:security · 受限凭据
    - production.env — 0600 root:security
{.filetree}
```

<!-- prettier-ignore-end -->

<!-- prettier-ignore-start -->

- /srv/atlas/ — 0755 root:root · 应用根目录
  - releases/ — 0750 deploy:release-engineering · 不可变构建
    - 2026.08.16/ — 0750 deploy:release-engineering · 当前版本
      - atlas-server — 0555 deploy:atlas · 可执行文件
      - app.toml — 0640 root:atlas · 运行配置
  - secrets/ — 0700 root:security · 受限凭据
    - production.env — 0600 root:security
{.filetree}

<!-- prettier-ignore-end -->

### 深层嵌套 {#deep-nesting}

长名称不会换行；面板会横向滚动，而不是撑宽页面。

<!-- prettier-ignore-start -->

- warehouse/ — 持久数据集
  - raw/
    - events/
      - 2026/
        - 08/
          - events-2026-08-16.parquet — 不可变的每日分区
  - curated/
    - `orders_daily.parquet` — 每晚重建
- notebooks/
  - *scratch.ipynb* — 不纳入版本控制
{.filetree}

<!-- prettier-ignore-end -->

## 语义与回退 {#semantics-and-fallback}

HTML 就是你写的嵌套 `ul`，最外层列表带 `filetree`
class。CSS负责绘制等宽面板、参考线与图标（`li:has(> ul)`
选中目录）；不加载 JavaScript，也不声明
`role="tree"`。Markdown 输出就是源码列表；打印与 RSS 渲染同一份展开的列表。

## 有意的限制 {#deliberate-limits}

FileTree 不折叠、不排序、不读取文件系统，也不提供逐条目图标、颜色、徽章或标题栏。目录树应保持精选且简短；需要逐字复制的清单请使用代码块。

## 从 0.4 迁移 {#migration}

`filetree`、`filetree/folder` 与 `filetree/file`
短代码已移除。主题的迁移工具会把它们改写成列表形态：`name` 成为条目，`link`
成为 Markdown 链接，`comment` 成为说明，而 `open`、`icon`、`color` 与 `label`
被丢弃。
