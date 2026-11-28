---
title: 导航、搜索与多语言
linkTitle: 导航、搜索与多语言
description: 添加菜单条目，调校本地搜索，为命令面板加入自己的命令，熟悉键盘操作，显示反链，并确定站点语言与双列视图。
book_kind: chapter
book_number: 9
weight: 90
---

读者很少从首页一层层点进来。他们从搜索结果落地，在栏目之间跳转，只为查一项设置，或者用第二语言阅读。OINK 会根据你已经写好的内容——内容树、标题和描述——生成大部分导航线索，本章为 Acme DB 补齐剩下的部分。

## 菜单条目 {#menu}

顶部导航栏的 Docs 下拉菜单列出文档的各个分组。Starter 让每个分组通过自己的 front matter 加入菜单，所以第 3 章新建的 Operations 分组也照此处理：

```yaml {title="content/docs/operations/_index.md (front matter)"}
menus:
  main:
    identifier: docs-operations
    parent: docs
    weight: 35
    params:
      icon: fa-solid fa-screwdriver-wrench
```

新条目出现在 Docs 下拉菜单中，位于 Tutorial 与 Reference 之间；凡是有 Operations 页面的语言都会显示它，你只需在 `_index.zh.md` 里翻译它的标题。不对应页面的顶层条目，比如指向论坛的链接，写在 `hugo.yaml` 的 `languages.<lang>.menus.main` 下；顶部导航栏右端的 GitHub 按钮则来自 `params.github_repo`。下拉菜单、图标与页脚的写法见[导航与菜单](/zh/docs/customize/navigation/)。

## 本地搜索 {#search}

Starter 用 `params.offline_search: true` 打开了搜索。Hugo 在构建时为每种语言写出一份索引，由浏览器里的一个小型引擎负责检索，所以查询不会离开站点，本地预览的搜索效果也与生产环境完全一致。它能处理英文的词形变化和拼写容错，能匹配代码标识符，也能检索不带空格输入的中文。在本页按 {{< kbd "/" >}}，搜索 `xref` 就能看到效果。

读者会输入、页面正文里却从没出现过的词，可以由页面主动告诉搜索：

```yaml {title="content/docs/get-started/quick-start.md (front matter)"}
search_keywords: [getting started, first query, hello world, tutorial]
search_boost: 1.5
```

`search_keywords` 通常比加权更管用：读者输入“hello world”，现在也能找到标题为 Quick start 的页面。`search_boost` 把页面得分乘以给定倍数，1.5 足以把页面往前提，又不会让部分匹配排到完整匹配前面。

## 命令面板与键盘 {#palette}

按 {{< kbd "Ctrl" "K" >}}（Mac 上是 {{< kbd "⌘" "K" >}}）会打开一个同时处理页面和操作的输入框：搜索、切换语言或主题、把页面复制为 Markdown、打印整个分区。以 `>` 开头的查询只列出操作。自定义命令写在 `params.ui.command_palette.commands` 下，ddia.vonng.com 提供的“开始阅读”就是这样加进去的：

```yaml {title="hugo.yaml"}
params:
  ui:
    command_palette:
      commands:
        - id: acme_quick_start
          title: Quick start
          description: Start a server and run the first query
          url: /docs/get-started/quick-start/
          icon: fa-solid fa-rocket
          keywords: [install, first steps]
```

不碰鼠标，只用键盘也能到达任何地方。默认启用二十九个单键快捷键，你在输入框里打字时它们会自动让行。读者最常用的是下面这几个：

| 按键 | 操作 |
| --- | --- |
| {{< kbd "Q" >}} {{< kbd "E" >}} | 按侧栏顺序前往上一页、下一页 |
| {{< kbd "K" >}} {{< kbd "J" >}} | 跳到本页上一个、下一个标题 |
| {{< kbd "H" >}} | 最近读过的页面 |
| {{< kbd "X" >}} | 切换到下一种语言 |
| {{< kbd "Z" >}} | 禅意模式，只留下正文 |
| {{< kbd "'" >}} | 全部二十九个快捷键 |
{#tbl-common-keys num="9-1" caption="读者最常用的键盘快捷键。"}

现在按 {{< kbd "E" >}} 就能翻到第 10 章，按 {{< kbd "'" >}} 可以查看其余快捷键。如何为整个站点、某个分区或单个页面关闭快捷键，见[键盘导航](/zh/docs/customize/keyboard/)。

## 反链 {#backlinks}

Starter 设置了 `params.ui.backlinks: true`，于是每个页面都会在右侧栏的“反链”标题下列出链接到它的页面。这份列表由 Hugo 在构建时根据你写的普通链接算出，不需要新语法，也不需要脚本。读者从搜索结果进入 Back up a server 页面时，一眼就能看到 Quick start 和配置参考都指向它，也就明白了它在整个站点中的位置。

## 确定站点语言 {#languages}

Starter 自带英文、中文和法文。Acme DB 只发布英文和中文，所以要移除法文：先删掉 `hugo.yaml` 中 `languages` 下的法文配置块，再删除法文内容和首页数据：

```bash
find content -name '*.fr.md' -delete
rm data/home/fr.yaml
```

`hugo.yaml` 里剩下的就是每种语言各一个配置块：

```yaml {title="hugo.yaml"}
languages:
  en:
    label: English
    locale: en-US
    weight: 1
    title: *siteTitle
    params:
      description: Documentation for the Acme DB time-series database.
  zh:
    label: 简体中文
    locale: zh-CN
    weight: 2
    title: *siteTitle
    hasCJKLanguage: true
    params:
      description: Acme DB 时序数据库文档。
      time_format_blog: 2006年1月2日
```

`label` 是语言选择器中显示的语言自称；`locale` 写入 `<html lang>`，以及供搜索引擎读取的多语言替代链接；`weight` 决定语言的排列顺序。默认语言没有路径前缀，其他语言各有自己的前缀，例如 `/zh/`。主题自身的界面文字，比如“搜索”“下一页”“反链”，已经内置 32 种语言包，所以新增一种语言只需要提供你自己的内容。从右到左书写的文字，以及尚未翻译的页面会怎样处理，见[多语言](/zh/docs/customize/i18n/)。

## 并排阅读两种语言 {#duo}

Starter 同样打开了 `params.ui.compare: true`。有译文的页面会在页面操作旁多出一个 **打开双列视图** 按钮：一侧是当前页面，另一侧是它的译文，两边按小节同步滚动。这是审校译文最快的办法，因为漏译的段落会直接显示成一段空白。本章有英文版，按 {{< kbd "B" >}} 试试，再按一次 {{< kbd "B" >}} 即可关闭。

## 检查成果 {#checkpoint}

- 两种语言的 Docs 下拉菜单都列出了带图标的 Operations。
- 搜索“hello world”时，Quick start 排在第一位。
- 用 `\` 打开命令面板（或在搜索框输入 `>`），能看到 Quick start 命令。
- Back up a server 页面的“反链”中列出了 Quick start。
- 语言选择器只提供 English 和简体中文，双列视图能为每个已翻译的页面配对。

## 交给 agent {#agent}

```text {num="9-1" caption="提示词：调整导航、搜索与多语言。" #eg-agent-navigation}
参照 https://oink.pgsty.com/zh/docs/customize/navigation/ 和 https://oink.pgsty.com/zh/docs/customize/search/，让站点的导航和搜索真正方便读者。
在每个 Docs 分组自己的 front matter 里把它加入 Docs 下拉菜单，并配上图标。
为最重要的十个页面添加 search_keywords，写上读者实际会输入的词，两种语言的页面都要加。
为最常见的两项任务各添加一条命令面板命令。
只保留<英文和中文>：删除其他语言的配置块、页面和首页数据。
最后在浏览器里逐个搜索这些关键词，确认排在第一位的是正确的页面。
```
