---
title: 创作内容
linkTitle: 创作内容
description: 写文档页、博客、书籍、发布页与 API 文档：一页文档长什么样，内容怎么组织。
weight: 30
icon: fa-solid fa-pen-nib
cascade:
  categories: [创作内容]
aliases:
  - /docs/content/
  - /docs/scenarios/
---

本栏覆盖 OINK 支持的全部内容类型：文档页、博客文章、书籍、Expo 图片相册、发布下载页与 OpenAPI 参考。它们共用同一套 Markdown 与 front matter，各自在此基础上增加专属排版约定。

## 一页文档的构成 {#anatomy}

每页文档都是一个独立的 Markdown 文件。文件开头两行 `---` 之间是 YAML front matter，用于声明页面元数据（`title`、`linkTitle`、`description`、`weight`），下方正文直接使用标准 Markdown 与 OINK 原生组件：

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

存为 `content/docs/install.zh.md`，运行 `hugo server` 后页面出现在 `/zh/docs/install/`，左侧栏会出现「安装」条目。

## 常用排版速查 {#quick-syntax}

日常最常用的组件均基于原生 Markdown 与 Goldmark 属性块，无需记忆复杂的短代码：

| 常用能力 | 写法示例 | 详细指南 |
| --- | --- | --- |
| 显式标题锚点 | `## 前提条件 {#prerequisites}` | [编写页面](/zh/docs/write/pages/#headings) |
| 提示框 / 折叠块 | `> [!NOTE]`（及 `TIP`、`IMPORTANT`、`WARNING`、`CAUTION`、`DETAILS`） | [提示块](/zh/docs/components/callout/) |
| 代码标签页 | 相邻代码围栏带 ```` ```bash {tab="macOS"} ```` | [标签页](/zh/docs/components/tabs/) |
| 步骤列表 | 有序列表紧跟一行 `{.steps}` | [步骤列表](/zh/docs/components/steps/) |
| 导航卡片 | 链接无序列表紧跟一行 `{.cards}` | [卡片网格](/zh/docs/components/cards/) |
| 参数字典表 | Markdown 表格紧跟一行 `{.fields}` | [参数表](/zh/docs/components/fields/) |
| 带图注或尺寸的图片 | `![alt](/img.webp)` 紧跟一行 `{width="800" caption="..."}` | [图片](/zh/docs/components/image/) |
| 目录文件树 | ```` ```filetree ```` 代码围栏内写缩进列表 | [文件树](/zh/docs/components/filetree/) |

## 内容类型与对应页面 {#map}

| 你要写的 | 去哪页 |
| --- | --- |
| 一页文档：front matter、标题锚点、链接、图片、草稿 | [编写页面](/zh/docs/write/pages/) |
| 目录树与侧栏：`_index.md`、`weight`、图标、折叠、多根侧栏 | [组织内容](/zh/docs/write/organize/) |
| 查某个 front matter 键是什么意思 | [页面参数](/zh/docs/write/frontmatter/) |
| 一篇博客、发布公告、RSS | [博客与文章](/zh/docs/write/blog/) |
| 一本书：章节编号、图表式例、交叉引用、整本打印 | [书籍出版](/zh/docs/write/book/) |
| 图片相册：目录结构、元数据、布局与图片查看器 | [Expo 相册](/zh/docs/write/expo/) |
| 一个发布下载页：版本卡片、资产表、校验和 | [发布与下载页](/zh/docs/write/releases/) |
| 一份 OpenAPI 参考页 | [API 文档](/zh/docs/write/openapi/) |
| 中英双语写作：对等文件、锚点对齐、缺译回退 | [多语言](/zh/docs/customize/i18n/) |
| 某个组件的语法与参数 | [组件总览](/zh/docs/components/) |
