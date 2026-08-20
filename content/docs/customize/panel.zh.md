---
title: 命令面板
linkTitle: 命令面板
description: 一个对话框同时承担页面搜索、页面动作与站点命令：如何打开、包含哪些分组、如何添加自定义命令。
weight: 70
search_keywords: [命令面板, command palette, Cmd+K, Ctrl+K, 快捷键, 页面动作, page actions, 自定义命令, command-palette, quick-links, page-context-menu, 动作注册表]
---

命令面板是站点唯一的模态入口：搜索页面、复制本页 Markdown、切换语言、切换版本、跳转到站点自定义链接，都在这一个对话框里完成。它随本地搜索一起装配：`params.offline_search` 关闭时，面板连同索引与 Lunr 都不进入页面，见[全文检索](/zh/docs/customize/search/)。

## 打开面板 {#open}

| 打开方式 | 打开成什么 |
| --- | --- |
| 点顶栏或侧栏的搜索框 | 完整搜索态 |
| <kbd>⌘</kbd> / <kbd>Ctrl</kbd> + <kbd>K</kbd> | 完整搜索态；再按一次关闭 |
| <kbd>/</kbd> | 完整搜索态 |
| 反斜杠键 | 纯命令态（等于预填了 `>`） |
| <kbd>f</kbd> / <kbd>c</kbd> | 同上两者，由[键盘导航](/zh/docs/customize/keyboard/)提供 |
| 在框里输入 `>` 开头的查询 | 纯命令态 |

<kbd>/</kbd>、反斜杠、<kbd>f</kbd>、<kbd>c</kbd> 都是裸单键，会给输入让行：焦点位于 input、textarea、select 或 `contenteditable` 中，以及正在用输入法组字时，按键作为普通字符输入。带修饰键的 <kbd>⌘</kbd>/<kbd>Ctrl</kbd> + <kbd>K</kbd> 没有这个限制，在输入框里也能打开面板。

面板内：<kbd>↑</kbd> <kbd>↓</kbd> 选择，<kbd>Enter</kbd> 执行，<kbd>Esc</kbd> 关闭并把焦点交还给打开它的控件。

## 面板内容 {#contents}
不输入任何内容时，面板按固定顺序列出四组：

| 分组 | 内容 | 谁决定 |
| --- | --- | --- |
| 快速链接 | 顶栏一级菜单里选出的几个入口 | `params.ui.quick_links` |
| 页面操作 | 复制 Markdown、查看 Markdown 源码、编辑本页、查看修改历史、新建子页、提 issue、打印整节 | 仓库配置与本页是否有 Markdown 输出 |
| 偏好设置 | 切换版本 → 切换语言 → 切换主题 | 站点是否配了多版本、多语言、深浅色菜单 |
| 命令 | 打开 GitHub 仓库，之后是站点自定义命令 | `params.github_project_repo`（缺省回退到 `github_repo`）与 `ui.command_palette.commands` |

偏好设置三项的顺序与顶栏控件一致（版本、语言、主题），面板与顶栏是同一个次序。选中「切换语言」这类项后，面板不立即跳转，而是就地展开可选项，再选一次。

输入文字时，先是页面结果，按内容根分组（分组名是面包屑的第一段，组间顺序跟随顶栏一级菜单的顺序），命令与动作合并成一组排在最后。

以 `>` 开头时只列命令与动作，不查页面。不确定某个功能在哪个菜单里时用它定位。

不可用的项在能说明原因时仍然列出。站点没有配置仓库地址，「编辑本页」会带着「不可用」的说明留在列表里，而不是消失。

## 快速链接 {#quick-links}

快速链接从 Hugo 主菜单里按 identifier 选取，不另写一份清单：

```yaml {title="hugo.yml"}
params:
  ui:
    quick_links: [docs, blog]
```

值是 `menus.main` 里条目的 `identifier`。不写这个键时默认取文档栏目与博客栏目（`params.ui.docs_section` 和 `blog_section`）。菜单本身怎么配见[导航与菜单](/zh/docs/customize/navigation/)。

## 自定义命令 {#custom-commands}

站点自己的命令写在 `params.ui.command_palette.commands` 下，排在内建命令之后，顺序即书写顺序：

```yaml {title="hugo.yml"}
languages:
  zh:
    params:
      ui:
        command_palette:
          commands:
            - id: theme_issues
              title: OINK 问题反馈
              description: 报告或查看主题与文档问题
              url: https://github.com/pgsty/oink/issues
              icon: fa-brands fa-github
              keywords: [缺陷, 支持, 路线图]
```

上面是本站在用的那一条。字段共七个，写其它键构建失败：

- `id` 必填，小写字母开头，只能用小写字母、数字、下划线和短横线；不能与内建动作 ID 重名。
- `title` 显示在面板里；`description` 是它下面那行小字；`icon` 是一对 Font Awesome class。
- `keywords` 是数组，参与匹配但不显示，用于收纳读者可能输入的检索词。
- `url` 与 `action` **有且只能有一个**。`url` 只接受 `http`/`https` 的完整地址、站内路径，或 `#` 开头的页内锚点；带主机名的地址在新标签打开。`action` 引用一个内建动作 ID。

> [!WARNING] 不要用 `action:` 给内建动作起别名
> 内建动作已经在面板里，再包一层会让同一个功能以两个名字出现两次。

多语言站点把命令写在 `languages.<lang>.params.ui.command_palette.commands` 下，标题与关键词才能本地化。顺序由默认语言的那份清单决定：其它语言里同 `id` 的条目只覆盖字段，新增的 `id` 追加在末尾。各语言的命令顺序因此一致，读者换语言时命令不会换位置。

配置只能给出链接或引用内建动作，不能注入 JavaScript 回调：面板读取的是一份纯数据清单。

## 页面动作 {#page-actions}

面板里的「页面操作」与文档标题旁的拆分按钮是同一套实现：同一份动作描述、同一段 URL 生成逻辑、同一个执行器。按钮左半边复制本页 Markdown，右侧箭头展开全部动作。

整组关闭，或只在某些页面关闭：

```yaml {title="hugo.yml"}
params:
  ui:
    page_context_menu:
      enable: true
      # 打开后才会出现「在 ChatGPT / Claude 中打开」
      assistant_links: false
      links: []
```

`enable: false` 只移除标题旁的按钮，面板里的对应项保留，面板本身就是命令入口。单页用 front matter 的 `page_context_menu: false` 覆盖。

`assistant_links` 默认关闭，原因是读者点击时 **当前页面的完整 URL（含查询串与锚点）会被发送到第三方**，页面正文不会上传。这是站点级的选择，页面 front matter 里的 `assistant_links` 只能把它收紧，不能替站点打开。

`links` 是额外的外部动作，只出现在标题旁的菜单里，不进面板：

```yaml {title="hugo.yml"}
params:
  ui:
    page_context_menu:
      links:
        - name: 在站内讨论区提问
          url: https://github.com/pgsty/oink/discussions/new?title={title}
          icon: fa-solid fa-comments
```

`{url}`、`{title}`、`{markdown_url}` 三个占位符会被替换成当前页面的值。

「编辑本页」「查看修改历史」「提 issue」这些动作是否可用，取决于仓库相关的配置，见[仓库与页面信息](/zh/docs/customize/repository/)；「复制 Markdown」「查看 Markdown 源码」需要页面开了 `markdown` 输出，见 [Agent 支持](/zh/docs/customize/agents/)。

## 与全文检索的关系 {#search}

同一个对话框，两条独立的数据来源：

- **页面结果** 来自本地搜索索引。索引未生成或下载失败时，面板照常打开、照常执行命令，页面那部分显示「页面索引暂不可用，操作仍可使用」。
- **命令与动作** 来自页面里内嵌的一段 JSON 清单，不需要网络。

打印态不装配面板，打印输出里没有它；关闭 `offline_search` 后同样没有面板，此时 <kbd>f</kbd> 与 <kbd>c</kbd> 静默，不影响正常输入。

## 验证 {#verify}

1. 构建后确认命令清单进了页面：

   ```bash
   grep -o 'id="oink-action-manifest"' public/zh/docs/customize/panel/index.html
   ```

   没有这一行说明本地搜索没启用，或者这个页面不在外壳布局里。

2. 打开站点按下 <kbd>⌘</kbd>/<kbd>Ctrl</kbd> + <kbd>K</kbd>，什么都不输入：应该看到快速链接、页面操作、偏好设置、命令四组，顺序如上。

3. 输入 `>`：只剩命令与动作。新加的命令应该排在「打开 GitHub 仓库」之后。

4. 切到另一种语言重复第 3 步，确认命令的标题变了、顺序没变。

5. 打印预览（<kbd>⌘</kbd>/<kbd>Ctrl</kbd> + <kbd>P</kbd>）里不应该出现任何面板痕迹。

## 相关 {#related}

- [全文检索](/zh/docs/customize/search/) — 面板里页面结果的来源
- [键盘导航](/zh/docs/customize/keyboard/) — <kbd>f</kbd> <kbd>c</kbd> 与其余单键
- [导航与菜单](/zh/docs/customize/navigation/) — 快速链接与分组顺序的来源
- [仓库与页面信息](/zh/docs/customize/repository/) — 编辑、历史、issue 三个动作的前提
- [配置总览](/zh/docs/customize/config/) — `ui.command_palette` 与 `ui.page_context_menu` 的完整定义
