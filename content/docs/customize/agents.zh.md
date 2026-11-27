---
title: Agent 支持
linkTitle: Agent 支持
description: 每一页多产出一份 .md，站点根目录多一份 llms.txt，读者可以把当前页交给 ChatGPT、Claude 或 Gemini。
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
    llms-full.txt,
    LLMSFULL,
    navigation.json,
    NAVJSON,
    全文包,
    导航 JSON,
  ]
aliases:
  - /docs/advanced/agent-support/
---

越来越多的读者是通过大模型来读文档的：编程 agent 查一个配置项，或者有人把页面贴进对话框里提问。对它们来说，HTML 页面是很差的来源：侧栏、脚本与样式都得先剥掉才能看到正文，剥完剩下的还是一份有损的副本。OINK 可以把同一份内容再发布成纯 Markdown，让模型读到的就是你写下的原文，上下文也都花在内容上。

具体是三样产物：每个页面旁边一份 `.md`，站点根目录一份告诉 agent「这个站有什么」的 `llms.txt`，以及每页上的「复制 Markdown」按钮。三者都是构建时写出的文件，不需要运行时服务，也不需要内容协商。主题不会替站点打开它们，要在 `outputs` 里自己声明。另有两种产物服务于一次要读不止一页的 agent：每个顶层栏目一份全文包，每种语言一棵导航树。

## 每页一份 `.md` {#markdown-output}

`markdown` 是 Hugo 内置的输出格式，把它加进需要的每一种页面类型：

```yaml {title="hugo.yml"}
outputs:
  home: [HTML, markdown, LLMS]
  page: [HTML, markdown]
  section: [HTML, RSS, print, markdown]
```

本站用的就是这份配置。`outputs` 下的每个键是 **整体替换** 该页面类型的格式列表，而不是往里追加，所以要把这类页面原有的格式（例如 `RSS`、`print`）一起写上；漏掉哪个，哪种输出就不再发布。

Markdown 文件的地址就是页面 URL 后面接 `index.md`：

| 页面 | Markdown |
| --- | --- |
| `/zh/docs/customize/agents/` | [`/zh/docs/customize/agents/index.md`](/zh/docs/customize/agents/index.md) |
| `/zh/docs/customize/`（栏目首页） | [`/zh/docs/customize/index.md`](/zh/docs/customize/index.md) |
| `/zh/`（站点首页） | [`/zh/index.md`](/zh/index.md) |

每个 HTML 页面还会在 `<head>` 里声明自己的 Markdown 版本，抓取工具不必猜地址：

```html
<link rel="alternate" type="text/markdown" href="https://oink.pgsty.com/zh/docs/customize/agents/index.md">
```

## `.md` 的内容 {#markdown-shape}

文件里是 **你写的源码**，而不是把渲染好的 HTML 再转回 Markdown：标题变成一个 H1，`description` 变成一段引用，其后是原样的正文，shortcode 就地展开成各自的 Markdown 形态。

```markdown {title="/zh/docs/customize/print/index.md 的开头"}
# 打印支持

> 单页交给浏览器的 Cmd/Ctrl+P，整个栏目用 print 输出格式合成一份连续文档。

---

LLMS 索引： [llms.txt](/zh/llms.txt)

---

单页打印不需要配置：外壳（侧栏、目录、顶栏、按钮）都带 `d-print-none`，浏览器的 `Cmd/Ctrl+P` 得到的是一份干净的正文。
```

原生 Markdown 形态的组件保留源码：提示块、表格、参数表、图片属性行、代码围栏与数据围栏，模型读到的和你写下的完全一样。栏目首页在正文之后附一份「本节页面：」子页链接清单；打开[反链](/zh/docs/customize/navigation/#backlinks)时，页面末尾还有一份「反链：」清单。文件里的这些标签都跟随页面语言。

每种 shortcode 都有确定的 Markdown 形态：[徽章](/zh/docs/components/badge/)变成强调文本或链接，[按键](/zh/docs/components/kbd/)变成 `Ctrl + K`，[标签页](/zh/docs/components/tabs/)变成一段段 `**标签名**` 小节，[参数表](/zh/docs/components/fields/)变成条目列表。每个组件页的「输出形态」小节写明了它自己的形态。

只有站点发布了 `llms.txt`，文件里才会出现「LLMS 索引：」这一行，所以它永远不会指向不存在的文件。

## `llms.txt` {#llms-txt}

[`llms.txt`](https://llmstxt.org/) 是一种约定：在站点根目录放一份小小的纯文本地图，agent 抓一个文件就知道这个站有什么、Markdown 版本在哪里。给 **首页** 加上 `LLMS` 输出格式即可发布：

```yaml {title="hugo.yml"}
outputs:
  home: [HTML, markdown, LLMS]
```

多语言站点每种语言各一份：[`/llms.txt`](/llms.txt) 与 [`/zh/llms.txt`](/zh/llms.txt)，内容都由站点结构自动生成：

```text {title="/zh/llms.txt（节选）"}
# OINK

> 本地优先的 Hugo 技术文档主题

## Site index

- [Home page](https://oink.pgsty.com/zh/index.md)
- [navigation.json](https://oink.pgsty.com/zh/navigation.json)
- [文档](https://oink.pgsty.com/zh/docs/index.md): 为文档、博客、书籍与 API 参考建立统一的技术内容站点……
- [博客](https://oink.pgsty.com/zh/blog/index.md): Oink 工程实践、设计笔记与阅读外壳指南

## Documentation index

- [简介](https://oink.pgsty.com/zh/docs/about/index.md): 一套从 Docsy 演化而来的本地优先 Hugo 文档框架……
  - [特性](https://oink.pgsty.com/zh/docs/about/features/index.md): 逐条列出 OINK 与普通 Hugo 主题的差别……
  - [案例](https://oink.pgsty.com/zh/docs/about/showcase/index.md): 找到最接近自己需求的 OINK 生产案例……
- [快速上手](https://oink.pgsty.com/zh/docs/start/index.md): 从官方 OINK Starter 开始……
…

## Full-text bundles

- [文档](https://oink.pgsty.com/zh/docs/llms-full.txt)

## Site locales

- [English](https://oink.pgsty.com/index.md)
- [简体中文](https://oink.pgsty.com/zh/index.md)
```

- **Site index**：本语言的首页；站点发布了 `navigation.json` 时列出它；再加上主菜单（`menus.main`）里的条目，条目有 Markdown 版本就链接 Markdown 版本，并附上它的 `description`。
- **Documentation index**：文档栏目下的每一个页面，缩进在所属子栏目之下，后面附上该页的 `description`。
- **Full-text bundles**：至少有一个栏目发布了全文包时才出现。
- **Site locales**：站点配置的全部语言。

指向站外的菜单条目（GitHub、issue 跟踪器之类）会被剔除：它们属于导航，不是本站内容。所以想改善 `llms.txt`，就去改主菜单和各页的 `description`，模板很少需要动。

## 全文包 {#full-text-bundle}

每页一份 `.md`，适合已经知道自己要读哪一页的 agent；想通读整本手册的 agent 只能一页页地爬。`LLMSFULL` 输出把这件事变成一个文件：每个顶层栏目一份 `llms-full.txt`，按阅读顺序装下该栏目的每一页。

开关写在栏目首页自己的 front matter 里，而不是站点配置里：

```yaml {title="content/docs/_index.md"}
---
title: Docs
outputs: [HTML, print, RSS, markdown, LLMSFULL]
---
```

front matter 里的 `outputs` 会整体替换这一页的站点级列表，所以要把栏目原有的格式写回去：漏掉 `markdown` 或 `print`，栏目首页就少了这种输出。front matter 按语言分开，双语站点要在 `_index.zh.md` 里同样写一遍，才有中文的全文包。

每种语言在栏目根下各有一份文件：`/docs/llms-full.txt` 与 `/zh/docs/llms-full.txt`。页面顺序与侧栏、翻页一致：`docs`、`book` 栏目声明了 `data/docs_nav.json` 显式树时按显式树，否则按内容树的权重。用 `toc_hide` 从侧栏藏起来的页面同样不进全文包。

每一页前面有一条写着来源 URL 的分隔，其后的正文与该页自己的 `.md` 逐字节相同：

```text {title="/zh/docs/llms-full.txt（节选）"}
================
Source: https://oink.pgsty.com/zh/docs/customize/print/index.md
================

# 打印支持

> 单页交给浏览器的 Cmd/Ctrl+P，整个栏目用 print 输出格式合成一份连续文档。
…

================
Source: https://oink.pgsty.com/zh/docs/customize/agents/index.md
================

# Agent 支持
…
```

`Source:` 指向该页的 Markdown 输出；页面没有 `.md` 时，指向它的 HTML 地址。

只有顶层栏目能发布全文包。写在更深的栏目上，会得到一条告警（`LLMSFULL output requires a top-level section`），并且不生成文件。每份已发布的全文包都会列在该语言 `llms.txt` 的 `## Full-text bundles` 下，agent 在它本来就会读的那个文件里就能找到。

本站的文档栏目已经发布：<https://oink.pgsty.com/zh/docs/llms-full.txt> 一个文件就是全部中文文档。

## 导航 JSON {#navigation-json}

侧栏就是站点的目录。读得懂它的 agent，可以在抓取任何正文之前先规划好要读哪些页面。`NAVJSON` 输出把这棵树发布成 `navigation.json`，每种语言一份，放在语言根目录下。在首页打开它：

```yaml {title="hugo.yml"}
outputs:
  home: [HTML, markdown, LLMS, NAVJSON]
```

这会产出 `/navigation.json` 与 `/zh/navigation.json`，用的就是侧栏与翻页读的那一棵树：`docs`、`book` 栏目声明了 `data/docs_nav.json` 显式树时按显式树，其余按内容树的权重：

```json {title="/zh/navigation.json（节选）"}
{
  "baseURL": "https://oink.pgsty.com/",
  "language": "zh",
  "root": {
    "children": [
      {
        "children": [
          {
            "description": "每一页多产出一份 .md，站点根目录多一份 llms.txt……",
            "id": "/docs/customize/agents/",
            "kind": "page",
            "markdown": "https://oink.pgsty.com/zh/docs/customize/agents/index.md",
            "title": "Agent 支持",
            "url": "https://oink.pgsty.com/zh/docs/customize/agents/"
          }
        ],
        "id": "/docs/",
        "kind": "section",
        "title": "文档",
        "url": "https://oink.pgsty.com/zh/docs/"
      }
    ],
    "id": "/",
    "kind": "home",
    "title": "OINK",
    "url": "https://oink.pgsty.com/zh/"
  },
  "schemaVersion": 1
}
```

| 键 | 含义 |
| --- | --- |
| `id` | 去掉语言前缀的页面路径，同一页在每种语言里 `id` 相同 |
| `url` | 该语言下 HTML 页面的绝对地址 |
| `markdown` | 该页 `.md` 的绝对地址，只有页面确实发布了 `.md` 时才有 |
| `title` | 导航标题（`linkTitle`，没有则用 `title`） |
| `description` | 页面的 `description`，有才写 |
| `kind` | 真实页面是 `home`、`section` 或 `page`；占位条目是 `external` 或 `link` |
| `children` | 有序的子节点，有子节点才写 |

数组顺序本身就是约定的一部分。主题已经按侧栏排好了顺序，不会输出 `weight`；消费方若再排一次，得到的顺序就和侧栏对不上了。

占位条目保持侧栏里的结构：`manual_link` 条目成为 `external` 节点，URL 照作者写的原样带出；`manual_link_relref` 条目成为 `link` 节点，引用已经解析好。两者都不是页面，所以既没有 `id` 也没有 `markdown`。侧栏分隔线与 Hugo 从不渲染的页面会被略去，它们的子节点留在原位。

格式带版本号：`schemaVersion` 是 `1`，JSON Schema 随主题仓库发布，见 [`schema/nav.v1.schema.json`](https://github.com/pgsty/oink/blob/main/schema/nav.v1.schema.json)。消费这个文件时请用它校验。某种语言发布了 `navigation.json` 时，该语言的 `llms.txt` 会在站点索引里列出它。

本站已经发布：<https://oink.pgsty.com/zh/navigation.json> 就是这棵树的实例。

## 页面上的 Agent 动作 {#page-actions}

面包屑行右端的页面操作菜单里，有五个条目与 agent 和聊天助手有关：

| 条目 | 做什么 | 出现条件 |
| --- | --- | --- |
| 复制 Markdown | 把本页的 `.md` 复制到剪贴板；悬停时预取，点击后几乎无需等待 | 本页有 `markdown` 输出 |
| 查看 Markdown 源码 | 在新标签页打开 `.md` | 本页有 `markdown` 输出 |
| 在 ChatGPT 中打开 | 带着关于本页的提示词打开 ChatGPT | `assistant_links: true` |
| 在 Claude 中打开 | 带着关于本页的提示词打开 Claude | `assistant_links: true` |
| 在 Gemini 中打开 | 复制提示词到剪贴板并打开 Gemini | `assistant_links: true` |

前两条随 `markdown` 输出自动出现。「复制 Markdown」同时也是拆分按钮的左半边，显示为剪贴板图标，复制成功后短暂变成一个对勾。

三个助手条目默认关闭，需要显式打开：

```yaml {title="hugo.yml"}
params:
  ui:
    page_context_menu:
      enable: true
      assistant_links: true
```

读者点击其中一个时，页面用地址栏里的完整 URL（含真实域名、查询串与锚点）拼出一句提示词，中文站是「请阅读 <URL> 的内容，以便我就此向你提问。」，然后带着它打开对方站点（Gemini 没有公开的提示词 URL 参数，因此打开新标签页前还会先将提示词复制到剪贴板）。**离开本站的只有这个 URL，页面正文不会被上传**，内容由对方自行抓取。不要把机密信息放进 URL，并在站点的隐私说明里写明这次交给第三方的过程。

页面可以收紧站点策略，但不能放宽：front matter 里写 `page_context_menu: { assistant_links: false }` 会去掉本页的助手链接；站点没打开时，页面写 `true` 不起作用。`page_context_menu: false` 去掉本页的整个菜单。见[页面参数](/zh/docs/write/frontmatter/)。

自己的条目写在 `params.ui.page_context_menu.links` 里。本站就用它加了一个打开 `llms.txt` 的「Markdown 索引」条目，并按语言分别设置，好让标签随语言翻译：

```yaml {title="hugo.yml"}
languages:
  zh:
    params:
      ui:
        page_context_menu:
          links:
            - { name: Markdown 索引, url: zh/llms.txt, icon: fa-solid fa-list }
```

命令面板里也有同样的助手动作，来自同一份动作清单，见[命令面板](/zh/docs/customize/panel/)。

## 按页面退出 `.md` 输出 {#opt-out}

在页面 front matter 里设置 `outputs`。它同样整体替换整个列表，所以只写要保留的格式：

```yaml {title="content/legal/terms.zh.md"}
---
title: 服务条款
outputs: [HTML]
---
```

只想去掉 Markdown、保留栏目的订阅源和打印视图，就把其余格式列全：

```yaml {title="content/blog/_index.zh.md"}
---
title: 博客
outputs: [HTML, RSS, print]
---
```

## 自定义输出 {#customize-output}

这些文件出问题，多半是内容的问题：`llms.txt` 读起来不对时，先改主菜单和各页的 `description`，再考虑动模板。确实需要改变形态时，主题用 `layouts/all.md` 渲染 `.md` 输出，用 `layouts/index.llms.txt` 生成 `llms.txt`，两种可选输出分别由 `layouts/list.llmsfull.txt` 与 `layouts/index.navjson.json` 负责。在站点自己的 `layouts/` 下放一个同名文件就能替换主题的版本，但范围更窄的覆盖通常更省维护：

- **按内容类型**：`layouts/blog/single.md`、`layouts/docs/list.md` 这类带类型的路径只影响那一类内容，主题自己的打印模板就是这样分化的（`layouts/blog/single.print.html`）。具体组合请查 Hugo 的[模板查找顺序](https://gohugo.io/templates/lookup-order/)。
- **按 shortcode**：站点自己的 shortcode 可以加一个[输出格式专属模板](https://gohugo.io/templates/shortcode/)，让它在 Markdown 输出里给出更适合机器读的形式。
- **按页面**：少数重要页面手写内容，比改模板更省事。

替换 `index.navjson.json` 意味着由你来维护 `nav.v1` 格式：你的输出仍要能通过 `schema/nav.v1.schema.json` 的校验，因为消费方可能会校验它。

## 验证 {#verify}

启用 Markdown 与 LLMS 输出后，在站点根目录执行下面的命令。把 `PAGE_MD` 换成某个真实页面生成的 Markdown 文件；示例假设文档栏目叫 `docs`，请按自己的站点结构调整栏目名与语言前缀：

```bash
hugo --printPathWarnings
PAGE_MD=public/zh/docs/getting-started/index.md
ls "$PAGE_MD" public/zh/llms.txt
# 仅在 docs 启用 LLMSFULL、home 启用 NAVJSON 时检查：
ls public/zh/docs/llms-full.txt public/zh/navigation.json
```

检查运行中的本地预览或生产站点时，用自己的地址与页面路径。`BASE_URL` 要包含部署子路径；检查译文站点时也包含语言前缀：

```bash
BASE_URL=https://your-site.example/zh/
PAGE_PATH=docs/getting-started/index.md
curl -fsS "${BASE_URL}${PAGE_PATH}" | head -5
curl -fsSI "${BASE_URL}llms.txt" | head -3
# 仅在 docs 启用 LLMSFULL 时检查：
curl -fsS "${BASE_URL}docs/llms-full.txt" | head -3
```

然后检查四处：

- 页面 HTML 的 `<head>` 中有 `rel="alternate" type="text/markdown"`；
- 点击面包屑行旁的复制按钮后粘贴，得到的是 Markdown 而不是 HTML；
- `llms.txt` 里没有指向站外的链接；
- 若启用了对应输出，`llms-full.txt` 里每一页都以 `Source:` 行开头，同一页在各语言 `navigation.json` 里的 `id` 相同。

## 限制 {#limits}

- 主题生成四种机器可读文件：每页的 `.md`、`llms.txt`，以及需要显式打开的、每个顶层栏目一份的 `llms-full.txt` 与每种语言一份的 `navigation.json`。站点地图仍是 Hugo 自己的 `sitemap.xml`。
- 全文包属于顶层栏目，没有整站一份的 `llms-full.txt`。想读全站的 agent，就逐个读 `llms.txt` 列出的栏目全文包。
- `LLMS`、`LLMSFULL`、`NAVJSON` 既没有 `<head>` 里的 alternate 链接，也没有对应的页面操作；agent 通过约定的路径和 `llms.txt` 里的条目找到它们。
- 让页面 URL 本身在客户端发送 `Accept: text/markdown` 时返回 Markdown，属于内容协商，要由 Web 服务器或托管平台来做，不在主题范围内。
- Markdown 输出基于 **源码** 生成：只在浏览器里绘制的内容（例如运行时渲染的图表）在 `.md` 里是围栏源码，而不是图。

## 相关 {#related}

- [打印支持](/zh/docs/customize/print/) — 另一种非 HTML 输出
- [命令面板](/zh/docs/customize/panel/) — 助手动作的另一个入口
- [页面参数](/zh/docs/write/frontmatter/) — `outputs` / `assistant_links` / `page_context_menu`
- [导航与菜单](/zh/docs/customize/navigation/) — `llms.txt` 的站点索引来自主菜单
- [配置总览](/zh/docs/customize/config/) — `outputs` 与 `params.ui.page_context_menu.*` 的完整定义
