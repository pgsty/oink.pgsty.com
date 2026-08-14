---
title: 顺序阅读与数学公式
linkTitle: 顺序阅读
weight: 10
description:
  配置文档、Book 与博客共用的翻页体系，并使用本地服务端 KaTeX 渲染数学公式。
search_keywords: [翻页, 上一页, 下一页, 阅读顺序, 数学公式, KaTeX, 方程]
---

Oink
0.4.0 为手册、Book 与博客定义了明确的阅读序列，并把服务端数学公式渲染纳入正式内容路径。

## 启用或收窄翻页范围 {#configure-pager}

`docs`、`book` 与 `blog`
内容类型默认启用翻页。站点只使用其中一部分时，可以显式替换这个集合：

```yaml
params:
  ui:
    pager:
      types: [docs, book, blog]
```

只允许这三个类型名。页面或分区可以使用布尔型 front matter 退出序列：

```yaml
---
pager: false
---
```

交互式 HTML 只渲染实际存在的上一页或下一页，并在页面 `<head>` 中添加匹配的
`<link rel="prev">` 与
`<link rel="next">`。print、Markdown 和 RSS 不包含翻页标记或关系。

## 理解阅读顺序 {#reading-order}

文档与 Book 按 **侧栏同一导航根**
做前序遍历：分区首页先于其可见子项，普通子项按 weight 排序。站点使用
`data/docs_nav.json` 显式定义内容树时，这棵树同时是侧栏与翻页的权威来源。

以下条目可以显示在导航中，但不会成为翻页目的地：

- 使用 `toc_hide` 隐藏的页面；
- 使用 `manualLink` 或 `manualLinkRelref` 的纯链接占位页面；
- 标记为 `sidebar_divider: true` 的不可点击分组行。

博客保留 Hugo 的分区时间顺序，刻意不沿用手册树顺序。

手册通常位于已配置的 docs 分区下。如果手册页面刻意放在内容根目录，而 `/docs/`
只是概览页，请配置：

```yaml
params:
  ui:
    sidebar_root_enabled: true
    docs_root: home
```

`docs_root` 只接受默认的 `section` 或 `home`，其他值会导致构建失败。选择 `home`
后，顶层 `toc_root: true` 概览分区仍不进入手册序列。

## 渲染分隔符公式 {#math-passthrough}

Hugo 不会把主题的 Goldmark 配置合并到消费站，因此站点必须自行启用 passthrough 分隔符：

```yaml
markup:
  goldmark:
    extensions:
      passthrough:
        enable: true
        delimiters:
          block: [['\[', '\]'], ['$$', '$$']]
          inline: [['\(', '\)']]
```

Oink 提供 passthrough 渲染钩子与本地 KaTeX
CSS。公式在服务端渲染为 KaTeX 与 MathML，且只有公式页面会收到样式表。单独设置
`math: true` 不会启用分隔符解析。

请构建一页同时包含行内与块级分隔符的内容，然后检查 HTML 中是否出现 MathML，而不是原样的
`$$`。长块级公式在屏幕上限制在正文列内滚动，在打印中保持静态。

## 使用块级公式兜底 {#equation-shortcode}

暂时无法启用 Goldmark passthrough 时，可以使用无参数块级形式：

```go-html-template
{{</* eq */>}}E = mc^2{{</* /eq */>}}
```

这个形式刻意不带编号，也不会创建锚点、题注或 Book 注册项；Markdown 与 RSS 输出为普通
`$$` 块。要创建可引用的编号公式，请采用
[Book 公式形式](/zh/docs/scenarios/book/#numbered-components)，并添加带引号的
`num`。

## 验证阅读体验 {#validation}

1. 对比侧栏顺序、`q`/`e` 快捷键与可见翻页。
2. 确认纯链接、分隔项与隐藏条目都被跳过。
3. 在第一项、中间项与最后一项检查页面 head 关系。
4. 从子路径构建，确认翻页链接仍位于当前 origin。
5. 确认 print、Markdown 与 RSS 不含只用于交互的翻页标记。
6. 在两种颜色模式与打印中检查公式页，并确认普通页面没有加载 KaTeX CSS。

全部阅读快捷键见[键盘导航](/zh/docs/advanced/keyboard/)。
