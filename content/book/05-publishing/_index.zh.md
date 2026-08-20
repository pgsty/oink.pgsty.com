---
title: 发布不止于参考页面的内容
linkTitle: 选择发布界面
description: 用 Docs、Blog、Case、Book 与发布页面分别回答读者的不同需求。
book_kind: chapter
book_number: 5
book_status: draft
weight: 50
---

同一个站点可以发布多种知识，而不必把它们强行塞进同一种布局。内容类型选择页面外壳，
front matter 变体则在同一外壳内调整呈现。

## 让发布界面匹配读者 {#surfaces}

- Docs 回答任务或参考问题，并显示它在内容树中的位置。
- Blog 是带日期、作者、分类法、订阅源与分享能力的文章。
- Case 说明真实站点如何应用主题。
- Book 章节组成有意设计的阅读顺序，并提供稳定交叉引用。
- 发布注记把版本、迁移方法与验证证据连接起来。

## 配置 Blog 家族 {#blog-family}

普通 Blog 分区可以选择行列表、卡片或表格。需要沉浸式开场的分区仍然保留同一类型，
只改变四个相互独立的呈现键：

```yaml
type: blog
featured_image: hero
toc_style: flow
toc_taxonomies: false
sidebar_enabled: false
```

这就是[沉浸式阅读](/zh/blog/oink/immersive-reading/)所演示的契约。没有第二种 Article 类型，
也没有被复制的发布流水线。

## 把样例变成 Case 案例 {#case-studies}

Case 索引使用 Blog 卡片形式，每个内部页面则先说明站点、源码、语言模式、规模与 OINK 能力，
再链接到线上成果。保留内部说明页，能让 showcase 成为文档的一部分，而不只是一面外链标识墙。

## 让 Book 与 Docs 相互补充 {#book-and-docs}

参考页面保持完备，并能独立搜索。教程则从参考中选出一条路径，每次只引入一项决策，
在读者需要完整参数表时再链接回参考文档。

完整演练将使用同一组源事实，新增一篇文章、一个 Case 案例与一篇短 Book 章节，
再比较三者的阅读体验。

