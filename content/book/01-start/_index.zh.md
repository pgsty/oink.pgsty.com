---
title: 一句提示词，建一个站
linkTitle: 从提示词开始
description: 把 OINK 技能、一个可供参照的线上 OINK 站点和你项目的基本情况交给编程 agent，同一次会话里就能审阅一个能运行的站点。
book_kind: chapter
book_number: 1
weight: 10
---

拥有 OINK 站点之前，你不必先学会 OINK。在一个空目录里打开 Claude Code 或 Codex
这类编程 agent，把 OINK 技能和一个长得像你理想中站点的线上网站指给它，再介绍一下你的项目。agent
会从 Starter 起步，照着参照站点改造，在浏览器里检查结果，最后告诉你还差什么。本章给出四段这样的提示词，每段参照一个线上生产站点，最后总结出自己写提示词的套路。

```gallery
![vonng.com：带专栏和沉浸式文章的个人博客](/case/vonng-com/featured.webp) # 个人博客 {link=/zh/case/vonng-com/}
![silo.pgsty.com：一个开源对象存储的官网](/case/silo/featured.webp) # 开源项目网站 {link=/zh/case/silo/}
![pig.pgsty.com：一个命令行包管理器的手册](/case/pig/featured.webp) # 命令行工具网站 {link=/zh/case/pig/}
![ddia.vonng.com：一本多语言图书](/case/ddia/featured.webp) # 一本书 {link=/zh/case/ddia/}
```

## 开始之前 {#before}

agent 要在你的机器上运行 Git、Go 和 Hugo，所以先把它们装好；支持的版本见[快速上手](/zh/docs/start/#tools)。然后为站点新建一个空目录，在里面启动
agent：

```bash
mkdir my-site && cd my-site
claude        # 或 codex，或任何能执行命令、能打开浏览器的 agent
```

下面每段提示词的第一句，都是让 agent 去读
`https://oink.pgsty.com/skill.zh.md`。这就是 OINK 技能：一个 Markdown
文件，里面写着建站流程、OINK 自家站点的审阅标准，以及以往建站踩过的坑。直接从网址读取，不用安装任何东西。如果你经常建站，可以[把它安装成技能](/zh/docs/start/#agent-skill)，然后把提示词的开头改成“使用
oink-site 技能”。

发送提示词之前，把 `<尖括号>` 里的内容全部换成你自己的信息。不要删掉“不要照搬参照站点”那一句：下面四个站点虽然都是开源的，但其中的文章、图片和名称属于各自的作者。

## 仿照 vonng.com 做个人博客 {#blog}

[vonng.com](/zh/case/vonng-com/)
是一个工程博客，收录了一千多篇双语文章。每个专栏都是一个顶级分区，有自己的订阅源；专栏索引页是卡片网格；文章以通栏头图开篇，大纲紧挨着正文。如果你定期写作，希望站点读起来像一份刊物而不是一本手册，就以它为参照。

```text {num="1-1" caption="仿照 vonng.com 搭建的个人博客。" #eg-prompt-blog}
阅读 https://oink.pgsty.com/skill.zh.md，按照其中的流程，
在这个空目录里用 OINK 搭建我的个人博客。

参照 https://vonng.com（源码：https://github.com/Vonng/vonng.com）：
- 每个专栏是一个顶级分区，各有自己的 RSS 订阅源。
- 专栏索引页用卡片网格，读者可以切换成列表或表格。
- 文章以通栏头图开篇，正文旁边始终显示大纲，文末放分享按钮。
- 启用作者页、系列和标签；首页先用一张照片介绍我，再列出各个专栏。
- 默认使用 Paper 外观，支持深色模式，“外观”菜单里提供全部六套预设。

关于我：<姓名>，<一句话简介>，写作主题：<数据库与运维>。
域名：<blog.example.com>。语言：<简体中文，附英文版>。
专栏：<工程、笔记、旅行>。

只借鉴结构、配置和设计，不要照搬 vonng.com 的文章、图片或品牌标识。
用我的口吻写三篇占位文章。构建通过后运行 hugo server，在浏览器里
分别按桌面和手机宽度检查，然后告诉我还缺什么。
```

完成后，`content/` 下每个专栏各有一个目录，`content/authors/` 下有一份作者简介，`hugo.yaml`
里会出现 `blog_index: cards`、`featured_image: hero`、`toc_style: flow`
这类设置，[第 6 章](/zh/book/06-blog/)会逐一解释。打开一个专栏，按 {{< kbd "L" >}}
循环切换索引布局；再打开一篇文章，检查头图、大纲和作者署名。

## 仿照 silo.pgsty.com 做开源项目网站 {#project}

[silo.pgsty.com](/zh/case/silo/) 是 S3
兼容对象存储 SILO 的官网：每种语言约四百页的双语手册，用博客发布的版本说明，一个下载页，若干案例研究，以及由数据文件拼装、带指标和项目卡片的首页。如果你的项目有用户要安装、配置和升级它，就以它为参照。

```text {num="1-2" caption="仿照 silo.pgsty.com 搭建的开源项目网站。" #eg-prompt-project}
阅读 https://oink.pgsty.com/skill.zh.md，按照其中的流程，
在这个空目录里用 OINK 搭建我的开源项目官网。

参照 https://silo.pgsty.com（源码：https://github.com/pgsty/silo.pgsty.com）：
- 文档树分为：快速上手、配置、运维、参考。
- 一个博客，每个版本发一篇版本说明。
- 一个下载页，列出安装包和校验值，数据放在 data/download/。
- 数据驱动的首页：首屏、指标、功能卡片和行动号召。
- 本地搜索，并为每个页面提供 Markdown 副本，另外生成 llms.txt。

我的项目：<名称>，<一句话描述>，仓库 <https://github.com/you/project>。
以仓库里的 README、docs/ 目录和 CHANGELOG.md 为素材，
所有命令和配置键都与原文保持一致。
域名：<project.example.com>。语言：<简体中文，附英文版>。

只借鉴结构、配置和设计，不要照搬 SILO 的文字、Logo 或截图。
构建通过后运行 hugo server，在浏览器里按桌面和手机宽度检查两种语言，
并列出仍需补充真实内容的页面。
```

完成后会有 `content/docs/`（每个分区一个 `_index.md`）、`content/blog/release/`，首页数据按语言放在
`data/home/` 下（如 `en.yaml` 及其译文 `zh.yaml`），下载页则读取 `data/download/`
里的记录。[第 3 章](/zh/book/03-pages/)讲内容树如何变成侧栏，[第 8 章](/zh/book/08-design/)讲首页。在顶部导航栏里切换语言，再按
{{< kbd "/" >}} 试试搜索。

## 仿照 pig.pgsty.com 做命令行工具网站 {#cli}

[pig.pgsty.com](/zh/case/pig/) 是 PostgreSQL
扩展包管理器 PIG 的文档站。它的手册刻意做得很小：每种语言约二十页，每个子命令一页；另有一个五十篇文章的博客，承载版本说明和更长的讲解。如果你的参考文档短小而稳定，动态消息却需要不断增长的空间，就以它为参照。

```text {num="1-3" caption="仿照 pig.pgsty.com 搭建的命令行工具网站。" #eg-prompt-cli}
阅读 https://oink.pgsty.com/skill.zh.md，按照其中的流程，
在这个空目录里用 OINK 搭建我的命令行工具网站。

参照 https://pig.pgsty.com（源码：https://github.com/pgsty/pig.pgsty.com）：
- 层级很浅的手册：安装、快速上手，以及每个子命令一页参考。
  每个参考页用字段列表记录该命令的参数。
- 各平台的安装命令做成标签页。
- 一个博客，为 CHANGELOG.md 里的每个版本写一篇版本说明。
- 首页放一条可复制的安装命令和几项指标。
- 页面操作里提供“在 ChatGPT 中打开”和“在 Claude 中打开”。

我的工具：<名称>，仓库 <https://github.com/you/tool>。它已经装在这台机器上：
运行 `<工具名> --help`，并对每个子命令运行 `<工具名> <子命令> --help`，
根据输出起草参考页。
域名：<tool.example.com>。语言：<简体中文，附英文版>。

只借鉴结构、配置和设计，不要照搬 PIG 的文字或品牌标识。
构建通过后运行 hugo server，在浏览器里检查，
并告诉我哪些命令的帮助文字太单薄，不足以写成文档。
```

完成后，每个子命令各有一页，页上用 `{.fields}`
表格列出参数；安装标签页由相邻的代码围栏生成，[第 4 章](/zh/book/04-components/)会演示这两种写法。助手链接只需要一项设置，[第 10 章](/zh/book/10-ship/)会连同其他面向
agent 的输出一起讲解。

## 仿照 ddia.vonng.com 做一本书 {#book}

[ddia.vonng.com](/zh/case/ddia/)
以多语言图书的形式发布《设计数据密集型应用》：简体中文、繁体中文和英文版各有二十多章，有
130 多个带编号的图、表和示例，章节挪动后依然有效的交叉引用，一份术语表，还能把整本书作为一份可打印的文档输出。手册、课程、译著这类需要按顺序阅读的长篇作品，都可以以它为参照。

```text {num="1-4" caption="仿照 ddia.vonng.com 出版的一本书。" #eg-prompt-book}
阅读 https://oink.pgsty.com/skill.zh.md，按照其中的流程，
在这个空目录里用 OINK 出版我的书。

参照 https://ddia.vonng.com（源码：https://github.com/Vonng/ddia）：
- 一棵 type: book 内容树，包含带编号的章节、前言和术语表。
- 图、表和代码示例都带编号，用 xref 交叉引用，
  不要手写“见图 3”这类链接。
- 一个目录页，附图目录、表目录和示例目录。
- 支持整书打印，读者可以把整本书另存为 PDF。
- 命令面板里提供“开始阅读”和“打印整本书”两个入口。

我的书稿：<./manuscript 下的 Markdown 文件，或 book.pdf>，
书名<书名>，作者<作者名>。我拥有出版它的权利。
原文措辞一字不改，只转换结构。
域名：<book.example.com>。语言：<简体中文>。

只借鉴结构、配置和设计，不要照搬 DDIA 的文字、插图或封面。
开始转换前，先列出你找到的章节、图和表，等我确认后再动手。
构建通过后运行 hugo server，检查编号、交叉引用和打印视图。
```

对一本书来说，确认这一步很关键：转换前先盘点一遍，能及时发现缺失的章节，或者两个其实属于不同版本的文件。[第 7 章](/zh/book/07-book/)讲解编号、`xref`
和自动生成的索引。

## 写你自己的提示词 {#your-prompt}

这四段提示词遵循同一个结构，你写的也应该如此。漏掉哪一部分，agent
就会去猜，而且往往是照着一个不属于你的站点去猜：

```text {num="1-5" caption="建站提示词的结构。" #eg-prompt-shape}
阅读 https://oink.pgsty.com/skill.zh.md，按照其中的流程，
在这个目录里用 OINK 搭建<站点类型>。

参照 <参照站点 URL>（源码：<源码仓库 URL>）：
- <你想要的参照站点功能，每项一行>

我的素材：<仓库、文件夹、PDF 或旧站点>；保持<不能改动的内容>不变。
基本信息：名称 <…>，域名 <…>，语言 <…>。

只借鉴结构、配置和设计。构建通过后，在浏览器里按桌面和手机宽度检查，
并汇报<你希望得到的反馈>。
```

- **技能**：让 agent 回到本文档查语法，并给它 OINK 的审阅标准。没有技能，agent 往往会凭记忆写出 Docsy 或旧版 OINK 的语法。
- **参照站点**：给出网址和源码仓库，agent 就能读到真实的配置，而不是对着截图去猜。要列出你想要的功能，因为生产站点上有很多功能你用不着。
- **你的素材**：agent 据此写作。README、`--help` 输出、变更日志或旧站点，写出来的页面远胜于从空目录起步；指明哪些内容是权威来源，命令和配置键才能保持原样。
- **基本信息**：任何 agent 都推断不出来：名称、将成为 `baseURL` 的域名，以及语言。
- **验收标准**：说明什么时候算完成。技能本身已经要求在浏览器里检查，你只需说清楚希望它汇报什么；如果目录是一个真实的仓库，再加一句“不要推送或部署”。

### 更多参照站点 {#more-models}

[案例库](/zh/case/)里的任何站点都可以作为参照。下面这些覆盖了其他常见的站点类型：

| 你想发布 | 参照站点 | 借鉴什么 |
| --- | --- | --- |
| 公司或产品官网 | [pgsty.com](/zh/case/pgsty-com/) | 完全由 Landing 区块拼成的双语首页 |
| 带下载的应用 | [caps.pgsty.com](/zh/case/caps-pgsty/) | 居中的首屏、下载页和一份精简手册 |
| 由数据生成的名录 | [ext.pgsty.com](/zh/case/pgext-cloud/) | 由数据文件渲染出的数千个条目，支持本地搜索 |
| 课程或教程书 | [pgexp.pgsql.cc](/zh/case/pgexp-pgsql/) | 以 Book 章节组织课程，附带可运行的示例和下载 |
| 相册或展览 | [fzb.vonng.com](/zh/case/fzb/) | Expo 相册与长篇 Book 页面并列 |
| 迁移到 OINK 的现有 Docsy 站点 | [hugegraph.apache.org](/zh/case/apache-hugegraph/) | Slate 预设上的品牌首屏，配合迁移过来的双语文档 |
{#tbl-model-sites .wide num="1-1" caption="可供新站点参照的更多 OINK 生产站点，按站点类型列出。"}

如果要迁移现有的 Hugo 或 Docsy 站点而不是新建，就在那个站点的仓库里运行 agent，并把
{{< xref eg="1-5" anchor="eg-prompt-shape" />}} 的头几行换成“阅读
https://oink.pgsty.com/skill.zh.md，按照其中的流程把这个 Hugo 站点迁移到
OINK”；技能涵盖了[版本升级](/zh/docs/admin/upgrade/#from-docsy)中介绍的迁移路径。

## 看看 agent 交回了什么 {#handoff}

一次完整的运行以一份报告收尾：搭建了什么、正在运行的预览地址、做过哪些检查，以及哪些地方仍是占位文字。打开它给出的地址，通常是
<http://localhost:1313/>，并保留这份报告。[第 2 章](/zh/book/02-take-over/)会把它变成你自己的审阅，让
agent 的会话结束后，站点依然由你掌控。
