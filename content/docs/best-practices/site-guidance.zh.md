---
title: Hugo 内容技巧
description: 使用 Docsy 主题编写 Hugo 站点内容时的实用建议。
---

Docsy 是一款面向 [Hugo](https://gohugo.io/)
静态站点生成器的主题。如果你还不熟悉 Hugo，本页汇总了一些添加和编辑站点内容时的实用技巧及常见陷阱。也欢迎补充自己的经验！

## 链接 {#linking}

默认情况下，Hugo 会原样保留链接中的普通相对 URL（它们在站点生成的 HTML 中仍是相对链接）。因此，像
`[相对交叉链接](../../peer-folder/sub-file.md)`
这样硬编码的相对链接，其行为可能与你在本地文件系统中看到的不同。为了避免生成的站点出现断链，可以使用 Hugo 内置的链接短代码，例如
[relref](https://gohugo.io/shortcodes/relref/)。例如，Hugo 中的
`{{</* ref "filename.md" */>}}` 会真正找到名为 `filename.md`
的文件，并自动生成指向它的链接。

但请注意，`ref` 和 `relref` 链接不适用于 `_index` 或 `index`
文件（例如本站的[内容首页](/zh/docs/content/)）。指向分区首页或其他索引页时，需要使用普通 Markdown 链接，并从站点根 URL 开始写路径，例如：`/docs/content/`。

进一步了解[链接的用法](/zh/docs/content/adding-content/#links)。
