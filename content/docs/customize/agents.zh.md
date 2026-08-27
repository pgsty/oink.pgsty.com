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

HTML 页面里有侧栏、脚本与样式，模型读它要先剥掉这层外壳。OINK 让同一份内容再产出一份纯 Markdown：每页一个 `.md`，站点根目录一份 `llms.txt` 索引，页面上一个「复制 Markdown 文本」按钮。三者都是构建期产物，没有运行时服务，也不需要内容协商。

这三件事都要站点自己在 `outputs` 里声明，主题不替站点打开。另有两样同样需要显式打开的产物，服务于一次要读不止一页的 agent：每个栏目一份全文包，每种语言一棵导航树。

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

## 全文包 {#full-text-bundle}

每页一份 `.md` 适合已经知道自己要读哪一页的 agent；想通读整本手册的 agent 只能一页页爬。`LLMSFULL` 输出把这件事压成一个文件：每个顶层栏目一份 `llms-full.txt`，按阅读顺序装下该栏目的每一页。它是 OINK 0.8.0 的新增能力，栏目不主动要就不生成。

开关在栏目首页自己的 front matter 里，不在站点配置：

```yaml {title="content/docs/_index.md"}
---
title: Docs
outputs: [HTML, print, RSS, markdown, LLMSFULL]
---
```

front matter 里的 `outputs` 会整体替换站点级列表，所以要把该栏目原本有的格式写回去：这里漏掉 `markdown` 或 `print`，栏目首页就少一种输出。front matter 按语言分开，双语站点要在 `_index.zh.md` 里同样写一遍，才有中文的全文包。

产物是每种语言一份，落在栏目根下——`/docs/llms-full.txt` 与 `/zh/docs/llms-full.txt`。顺序就是侧栏与翻页器呈现的阅读顺序：`docs`、`book` 栏目声明了 `data/docs_nav.json` 显式树时以显式树为准，否则按内容树的 `weight`。侧栏里藏起来的页面（`toc_hide`）同样不进包。

每一页前面有一条带来源 URL 的分隔，其后的正文与该页自己的 `.md` 逐字节相同：

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

`Source:` 指向该页的 Markdown 输出；页面没有 `.md` 输出时回退到它的 HTML 地址。

只有顶层栏目能带全文包。写在更深一层的栏目上会告警——「LLMSFULL output requires a top-level section」——并且什么都不产出：`hugo server` 照常能用，加了 `--panicOnWarning` 的发布构建则会停在这里。

只要有栏目开了全文包，`llms.txt` 就会多出一段 `## Full-text bundles`，列出本语言的全部全文包：发现入口仍在 agent 本来就会抓的那个文件里。

本站的文档栏目已经开启：<https://oink.pgsty.com/zh/docs/llms-full.txt> 是全部中文文档，一次抓取。

## 导航 JSON {#navigation-json}

侧栏是站点的目录，读得懂它的 agent 可以先规划路线再抓正文。`NAVJSON` 输出把它变成数据：每种语言一份 `navigation.json`，放在语言根目录下。和全文包一样，它是 OINK 0.8.0 新增、默认关闭，由站点在首页打开：

```yaml {title="hugo.yml"}
outputs:
  home: [HTML, markdown, LLMS, NAVJSON]
```

这会产出 `/navigation.json` 与 `/zh/navigation.json`。这棵树就是侧栏与翻页器读的那一棵——`docs`、`book` 栏目声明了 `data/docs_nav.json` 显式树时以显式树为准，其余按内容树的 `weight`：

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
| `markdown` | 该页 `.md` 的绝对地址，只有页面确实产出 `.md` 时才有 |
| `title` | 导航标题（`linkTitle`，回退到 `title`） |
| `description` | 页面的 `description`，有才写 |
| `kind` | 真实页面是 `home`、`section`、`page`；占位条目是 `external` 或 `link` |
| `children` | 有序子节点，有子节点才写 |

数组顺序就是契约，`weight` 不会被序列化：顺序已经算好了，消费方再排一次只会与它来源的侧栏对不上。

占位条目保持侧栏里的样子：`manual_link` 是 `external` 节点，URL 照作者写的原样带出；`manual_link_relref` 是 `link` 节点，引用已经解析好。两者都没有页面身份，因此既没有 `id` 也没有 `markdown`。侧栏分隔线与 Hugo 从不渲染的页面会被略去，它们的子节点留在原位。

契约带版本：`schemaVersion` 是 `1`，JSON Schema 随主题仓库发布，见 [`schema/nav.v1.schema.json`](https://github.com/pgsty/oink/blob/main/schema/nav.v1.schema.json)——要消费这个文件就拿它做校验。站点发布了它时，`llms.txt` 的站点索引里会列出本语言的 `navigation.json`。

本站已开启：<https://oink.pgsty.com/zh/navigation.json> 就是这棵树的实例。

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

主题用 `layouts/all.md` 渲染 Markdown 输出，用 `layouts/index.llms.txt` 生成 `llms.txt`，两种可选输出则由 `layouts/list.llmsfull.txt` 与 `layouts/index.navjson.json` 负责。站点在自己的 `layouts/` 下放同名文件即可整体替换，但 **先考虑更窄的做法**：

- **按内容类型**：`layouts/blog/single.md`、`layouts/docs/list.md` 这样带类型的路径只影响那一类内容，主题的打印模板即按此分化（`layouts/blog/single.print.html`）。查[模板查找顺序](https://gohugo.io/templates/lookup-order/)确认你的组合。
- **按 shortcode**：站点自己的 shortcode 可以加[输出格式专属模板](https://gohugo.io/templates/shortcode/)，让它在 Markdown 输出里给出更适合机器读的形式。
- **按页面**：少数高价值页面手写内容，成本低于改模板。

`llms.txt` 的内容由站点结构决定，改模板之前先确认问题不在主菜单或 `description`。替换 `index.navjson.json` 还意味着接手 `nav.v1` 契约：你自己产出的内容仍要能通过 `schema/nav.v1.schema.json` 的校验。

## 验证 {#verify}

```bash
hugo -d public
ls public/zh/llms.txt public/zh/docs/customize/agents/index.md
ls public/zh/docs/llms-full.txt public/zh/navigation.json   # 开了才有
```

线上或本地预览用 `curl`：

```console
$ curl -s http://localhost:1313/zh/docs/customize/agents/index.md | head -5
# Agent 支持

> 每一页多产出一份 .md，站点根目录多一份 llms.txt，读者可以把当前页交给 ChatGPT 或 Claude。

$ curl -sI http://localhost:1313/zh/llms.txt | head -3

$ curl -s http://localhost:1313/zh/docs/llms-full.txt | head -3
================
Source: http://localhost:1313/zh/docs/index.md
================
```

再检查四处：

- 任一页 HTML 的 `<head>` 里有 `rel="alternate" type="text/markdown"`；
- 面包屑行右侧的复制按钮点击后粘贴，得到的是 Markdown 而不是 HTML；
- `llms.txt` 里没有指向站外的链接；
- 开了这两种输出的话：`llms-full.txt` 里每一页都以一行 `Source:` 开头，同一页在各语言 `navigation.json` 里的 `id` 相同。

## 限制 {#limits}

- 主题产出的机器可读表面是四种构建期文件：每页 `.md`、`llms.txt`，以及需要显式打开的、每个顶层栏目一份的 `llms-full.txt` 与每种语言一份的 `navigation.json`。站点地图仍是 Hugo 自己的 `sitemap.xml`。
- 全文包属于顶层栏目，没有整站一份的 `llms-full.txt`：想读全站的 agent 按栏目逐个读，清单在 `llms.txt` 里。
- `LLMS`、`LLMSFULL`、`NAVJSON` 都声明为非替代格式，所以它们都不会出现在 `<head>` 的 `alternate` 链接里，也没有对应的页面操作；它们靠约定俗成的路径与 `llms.txt` 里的条目被发现。
- 服务端内容协商（同一个 URL 按 `Accept: text/markdown` 返回 Markdown）不属于主题范围，要做在托管层。
- Markdown 输出走 **源码** 路径：只在浏览器端由 JavaScript 生成的内容（运行时绘制的图表）在 `.md` 里是围栏源码，不是图。

## 相关 {#related}

- [打印支持](/zh/docs/customize/print/) — 另一种非 HTML 输出
- [命令面板](/zh/docs/customize/panel/) — 助手动作的另一个入口
- [页面参数](/zh/docs/write/frontmatter/) — `outputs` / `assistant_links` / `page_context_menu`
- [导航与菜单](/zh/docs/customize/navigation/) — `llms.txt` 的站点索引来自主菜单
- [配置总览](/zh/docs/customize/config/) — `outputs` 与 `params.ui.page_context_menu.*` 的完整定义
