---
title: OINK 上手教程
linkTitle: 教程
description: 用一句提示词得到一个能运行的 OINK 站点，再一层层学会它的功能：从单个页面开始，直到发布一个双语站点。
type: book
icon: fa-solid fa-book-open
weight: 30
book_kind: book
sidebar_root_for: self
sidebar_root_link_self: true
outputs: [HTML, print, markdown]
# Book 与 Blog 阅读外壳保持标题栏固定：长篇阅读时，顶部导航栏不应随指针时隐时现。
navbar_autohide: false
# 分区身份：教程用橙色。亮色在交互徽章把它同时用作文字与淡铺底色时仍可读；暗色
# 显式指定而非派生，确保它保持橙色，不会偏离色相。
cascade:
  theme_color: '#9a3412'
  theme_color_dark: '#fb923c'
  type: book
  navbar_autohide: false
  footer_style: fat
  comments: false
  feedback: false
  book_draft_banner: true
---

得到一个 OINK 站点，最快的办法是把它描述出来。第一部分把 OINK 技能、一个可以照着做的线上站点和你项目的基本情况交给编程
agent，一次会话就能拿到一个能运行的站点。第二部分再把同类站点一层层拆开，让你弄清 agent
到底搭了些什么，并能亲手修改其中任何一处。

## 阅读路线 {#reading-path}

{{< cards variant="list" >}}
{{< card title="第一部分：快速开始" icon="fa-solid fa-bolt" badge="第 1–2 章" >}}
用一句提示词建出博客、项目网站、命令行手册或一本书，预览并审阅它，再用后续提示词持续改进。

[1. 从提示词开始](/zh/book/01-start/) · [2. 接手站点](/zh/book/02-take-over/)
{{< /card >}}
{{< card title="第二部分：逐步掌握" icon="fa-solid fa-layer-group" badge="第 3–10 章" >}}
撰写和组织内容，用好每一类组件，发布文章和书籍，塑造首页与外观，让不同语言的读者都能找到想看的内容，并部署、升级站点。

[3. 页面](/zh/book/03-pages/) · [4. 组件](/zh/book/04-components/) · [5. 图表与媒体](/zh/book/05-media/) · [6. 博客](/zh/book/06-blog/) · [7. 书籍](/zh/book/07-book/) · [8. 首页与外观](/zh/book/08-design/) · [9. 导航、搜索与多语言](/zh/book/09-navigation/) · [10. 发布上线](/zh/book/10-ship/)
{{< /card >}}
{{< /cards >}}

如果你只想要一个站点，读完第 1 章也许就够了。第二部分始终围绕同一个示例项目展开：开源时序数据库
Acme DB 的文档站，它基于 [OINK Starter](https://github.com/pgsty/oink-starter)
搭建。每章为它加上一层，并在结尾给出一段提示词，让你的 agent 在你自己的站点上做同样的事。

这本书本身就是一本 OINK Book。章节带编号；图、表和示例也带编号，并汇总在下方的索引里；整本书可以作为一份文档在
[`/zh/_print/book/`](/zh/_print/book/) 打印；每个页面的地址后加上 `index.md`，就能得到它的
Markdown 副本。第 7 章会讲这些分别是怎么写出来的。

## 目录 {#contents}

{{< book-toc depth=3 >}}

## 图目录 {#figures}

{{< book-figures >}}

## 表目录 {#tables}

{{< book-tables >}}

## 公式目录 {#equations}

{{< book-equations >}}

## 示例目录 {#examples}

{{< book-examples >}}
