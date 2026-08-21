---
title: Agent 支持
linkTitle: Agent 支持
description: 每一页多产出一份 .md，站点根目录多一份 llms.txt，读者可以把当前页交给 ChatGPT 或 Claude。
weight: 140
search_keywords:
  [
    Agent,
    AI,
    大模型,
    智能体,
    Markdown 输出,
    llms.txt,
    复制 Markdown,
    LLM,
    llmstxt,
    outputs,
    markdown output,
  ]
aliases:
  - /docs/advanced/agent-support/
---

HTML 页面里有侧栏、脚本与样式，模型读它要先剥掉这层外壳。OINK 让同一份内容再产出一份纯 Markdown：每页一个 `.md`，站点根目录一份 `llms.txt` 索引，页面上一个「复制 Markdown 文本」按钮。三者都是构建期产物，没有运行时服务，也不需要内容协商。

这三件事都要站点自己在 `outputs` 里声明，主题不替站点打开。

## 每页一份 `.md` {#markdown-output}

`markdown` 是 Hugo 的内置输出格式。把它加进需要的页面类型：

```yaml {title="hugo.yml"}
outputs:
  home: [HTML, markdown, LLMS]
  page: [HTML, markdown]
  section: [HTML, RSS, print, markdown]
```

这是本站的配置。`outputs` 的每个键是 **整体替换** 而不是合并：加 `markdown` 时要把该类型原本有的格式（`RSS`、`print`）一起写全，漏一个就丢一种输出。

URL 规律是在页面 URL 后面接 `index.md`：

| 页面 | Markdown |
| --- | --- |
| `/zh/docs/customize/agents/` | [`/zh/docs/customize/agents/index.md`](/zh/docs/customize/agents/index.md) |
| `/zh/docs/customize/`（栏目首页） | [`/zh/docs/customize/index.md`](/zh/docs/customize/index.md) |
| `/zh/`（站点首页） | [`/zh/index.md`](/zh/index.md) |

每个 HTML 页的 `<head>` 里同时有一条发现用的链接，抓取工具不必推断 URL：

```html
<link rel="alternate" type="text/markdown" href="https://oink.pgsty.com/zh/docs/customize/agents/index.md">
```

## `.md` 的内容 {#markdown-shape}
不是把渲染好的 HTML 转回 Markdown，而是 **你写的源码**：front matter 换成一个 H1 标题加一段引用式摘要，其后是正文原文，shortcode 就地展开成各自的 Markdown 形态。

```markdown {title="/zh/docs/customize/print/index.md 的开头"}
# 打印支持

> 单页交给浏览器的 Cmd/Ctrl+P，整个栏目用 print 输出格式合成一份连续文档。

---

LLMS index: [llms.txt](/zh/llms.txt)

---

单页打印不需要配置：外壳（侧栏、目录、顶栏、按钮）都带 `d-print-none`，浏览器的 `Cmd/Ctrl+P` 得到的是一份干净的正文。
```

原生 Markdown 形态的组件（提示块、表格、参数表、图片属性行、代码围栏、数据围栏）在 `.md` 里原样保留源码，模型读到的与你写下的是同一份内容。栏目首页在正文之后还会附一份 `Section pages:` 子页链接清单。

shortcode 形态各有确定的降级：[徽章](/zh/docs/components/badge/)变成强调文本或链接，[按键](/zh/docs/components/kbd/)变成 `Ctrl + K`，[标签页](/zh/docs/components/tabs/)变成一段段 `**标签名**` 小节，[参数表](/zh/docs/components/fields/)变成条目列表。每个组件页的「输出形态」小节写了它自己那一行。

站点没有开 `LLMS` 输出时，上面那条 `LLMS index:` 不会出现：主题不指向未发布的文件。

## `llms.txt` {#llms-txt}

[`llms.txt`](https://llmstxt.org/) 是站点根目录的一份纯文本清单，告诉模型「这个站有什么、机器可读版本在哪」。给 **首页** 加上 `LLMS` 输出格式即可生成：

```yaml {title="hugo.yml"}
outputs:
  home: [HTML, markdown, LLMS]
```

多语言站点每种语言各一份：[`/llms.txt`](/llms.txt) 与 [`/zh/llms.txt`](/zh/llms.txt)。内容是自动生成的站点索引：

```text {title="/zh/llms.txt（节选）"}
# OINK

> 本地优先、仅依赖 Hugo 的技术文档主题

## Site index

- [Home page](https://oink.pgsty.com/zh/index.md)
- [文档](https://oink.pgsty.com/zh/docs/index.md): OINK 是一款只需 Hugo Extended 的技术文档主题……
- [博客](https://oink.pgsty.com/zh/blog/index.md): Docsy 文章、OINK 工程实践与 OINK 发布注记

## Documentation index

- [简介](https://oink.pgsty.com/zh/docs/about/index.md): 一款只需 Hugo Extended 的技术文档主题……
  - [亮点特性](https://oink.pgsty.com/zh/docs/about/features/index.md): 逐条列出 OINK 与普通 Hugo 主题的差别……
  - [示例站点](https://oink.pgsty.com/zh/docs/about/showcase/index.md): 十四个生产站点在用 OINK……
- [快速上手](https://oink.pgsty.com/zh/docs/start/index.md): 克隆 OINK 文档站，本地预览，替换站点信息，部署到 GitHub Pages。
…

## Site locales

- [English](https://oink.pgsty.com/index.md)
- [简体中文](https://oink.pgsty.com/zh/index.md)
```

三段的来源：`Site index` 是本语言首页加站点主菜单（`menus.main`，条目有 Markdown 版就链 Markdown 版，带 `description` 的顺带写上）；`Documentation index` 是 `docs` 栏目的子栏目及其下一层页面，缩进表示层级，每行附上该页的 `description`；`Site locales` 是站点配置里的全部语言。指向站外的菜单条目（GitHub、issue 跟踪器）会被剔除：它们属于导航外壳，不是本站内容。

改进 `llms.txt` 的入手处是主菜单与各栏目首页的 `description`，不是这个模板。

## 页面上的 Agent 动作 {#page-actions}

面包屑行右侧的操作菜单里，跟 Agent 有关的是四条：

| 条目 | 做什么 | 出现条件 |
| --- | --- | --- |
| 复制 Markdown 文本 | 抓取本页 `.md` 写进剪贴板（悬停时预取，点击后无明显等待） | 本页有 `markdown` 输出 |
| 查阅 Markdown 源码 | 新标签页打开 `.md` | 本页有 `markdown` 输出 |
| 在 ChatGPT 中打开 | 带一句提示词跳转到 ChatGPT | `assistant_links: true` |
| 在 Claude 中打开 | 同上，跳转到 Claude | `assistant_links: true` |

前两条只要开了 `markdown` 输出就存在。「复制」是拆分按钮的左半边（剪贴板图标），复制成功后短暂显示一个对勾。

后两条默认关闭，要显式打开：

```yaml {title="hugo.yml"}
params:
  ui:
    page_context_menu:
      enable: true
      assistant_links: true
```

打开之后的边界：读者点击时，运行时用浏览器地址栏里的完整 URL（含真实域名、查询串与锚点）拼一句提示词，中文站是「请阅读 <URL> 的内容，以便我就此向你提问。」，随后跳转到对方站点。**离开本站的只有这个 URL，页面正文不会被上传**，后续内容由对方自行抓取。URL 里不要放机密信息，站点也应当在隐私说明里披露这条第三方边界。

页面可以收紧站点策略，不能反向打开：front matter 里 `page_context_menu: { assistant_links: false }` 关掉本页的助手链接；站点没开时页面写 `true` 不会生效。整个菜单按页关闭用 `page_context_menu: false`，见[页面参数](/zh/docs/write/frontmatter/)。

命令面板里也能搜到这两条助手动作（用的是同一份动作清单），见[命令面板](/zh/docs/customize/panel/)。

## 按页面退出 `.md` 输出 {#opt-out}
在页面 front matter 里重写 `outputs`。它同样是整体替换，只写要保留的格式：

```yaml {title="content/legal/terms.zh.md"}
---
title: 服务条款
outputs: [HTML]
---
```

要保留 RSS、只去掉 Markdown，就把其它格式列全：

```yaml {title="content/blog/_index.zh.md"}
---
title: 博客
outputs: [HTML, RSS, print]
---
```

## 自定义输出 {#customize-output}

主题用 `layouts/all.md` 渲染 Markdown 输出，用 `layouts/index.llms.txt` 生成 `llms.txt`。站点在自己的 `layouts/` 下放同名文件即可整体替换，但 **先考虑更窄的做法**：

- **按内容类型**：`layouts/blog/single.md`、`layouts/docs/list.md` 这样带类型的路径只影响那一类内容，主题的打印模板即按此分化（`layouts/blog/single.print.html`）。查[模板查找顺序](https://gohugo.io/templates/lookup-order/)确认你的组合。
- **按 shortcode**：站点自己的 shortcode 可以加[输出格式专属模板](https://gohugo.io/templates/shortcode/)，让它在 Markdown 输出里给出更适合机器读的形式。
- **按页面**：少数高价值页面手写内容，成本低于改模板。

`llms.txt` 的内容由站点结构决定，改模板之前先确认问题不在主菜单或 `description`。

## 验证 {#verify}

```bash
hugo -d public
ls public/zh/llms.txt public/zh/docs/customize/agents/index.md
```

线上或本地预览用 `curl`：

```console
$ curl -s http://localhost:1313/zh/docs/customize/agents/index.md | head -5
# Agent 支持

> 每一页多产出一份 .md，站点根目录多一份 llms.txt，读者可以把当前页交给 ChatGPT 或 Claude。

$ curl -sI http://localhost:1313/zh/llms.txt | head -3
```

再检查三处：

- 任一页 HTML 的 `<head>` 里有 `rel="alternate" type="text/markdown"`；
- 面包屑行右侧的复制按钮点击后粘贴，得到的是 Markdown 而不是 HTML；
- `llms.txt` 里没有指向站外的链接。

## 限制 {#limits}

- 主题产出的机器可读表面只有两样：每页 `.md` 与 `llms.txt`。没有 `nav.json`，也没有别的结构化目录接口；站点地图仍是 Hugo 自己的 `sitemap.xml`。
- `LLMS` 输出格式声明为非替代格式，所以 `llms.txt` 不会出现在 `<head>` 的 `alternate` 链接里，也没有对应的页面操作；它靠约定俗成的根路径被发现。
- 服务端内容协商（同一个 URL 按 `Accept: text/markdown` 返回 Markdown）不属于主题范围，要做在托管层。
- Markdown 输出走 **源码** 路径：只在浏览器端由 JavaScript 生成的内容（运行时绘制的图表）在 `.md` 里是围栏源码，不是图。

## 相关 {#related}

- [打印支持](/zh/docs/customize/print/) — 另一种非 HTML 输出
- [命令面板](/zh/docs/customize/panel/) — 助手动作的另一个入口
- [页面参数](/zh/docs/write/frontmatter/) — `outputs` / `assistant_links` / `page_context_menu`
- [导航与菜单](/zh/docs/customize/navigation/) — `llms.txt` 的站点索引来自主菜单
- [配置总览](/zh/docs/customize/config/) — `outputs` 与 `params.ui.page_context_menu.*` 的完整定义
