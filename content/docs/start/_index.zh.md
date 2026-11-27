---
title: 快速上手
linkTitle: 快速上手
description: 从官方 OINK Starter 建立可运行的本地基线，再依次定制内容、语言、品牌、集成与部署。
weight: 20
icon: fa-solid fa-rocket
no_list: true
search_keywords: [快速上手, agent 技能, AI agent, OINK Starter, 模板, 安装, Hugo, 本地预览, 部署]
aliases:
  - /docs/tutorial/
  - /docs/tutorial/prerequisites/
  - /docs/tutorial/project-site/
---

得到一个可用 OINK 站点的最快办法，是使用官方 GitHub 模板仓库
[OINK Starter](https://github.com/pgsty/oink-starter)。它固定了当前的 OINK
版本，克隆下来就能构建，并且自带一个三语的 Docs、Blog、Book 站点和部署
workflow。你从修改一个能跑的站点开始，而不是从零件开始拼装。

## 选择起点 {#choose}

| 你手上有 | 走这条路 | 最后得到 |
| --- | --- | --- |
| 什么都还没有 | [OINK Starter](/zh/docs/start/starter/) | 一个中、英、法三语的精简 Docs、Blog、Book 站点，附 GitHub Pages 与 Cloudflare Pages workflow |
| 一个有内容的 Hugo 站点 | [从零安装](/zh/docs/start/from-scratch/) | 加上主题模块和三项 Goldmark 设置后，原有内容由 OINK 渲染 |
| 一个 Docsy 站点或旧版 OINK 站点 | [版本升级](/zh/docs/admin/upgrade/) | 内容不变，受支持的语法完成迁移，站点覆盖逐项审过 |

## 五分钟跑起来 {#baseline}

1. ### 安装工具 {#tools}

   需要 Git、Go 1.27.4 或更新版本，以及 Hugo {{% param hugoMinVersion %}}
   或更新版本（不限 edition）。需要 Go，是因为 Hugo 以 Go 模块的方式下载主题；
   构建本身不需要 Node.js、npm 或 Sass 编译器。

   ```console
   $ go version
   go version go1.27.4 darwin/arm64
   $ hugo version
   hugo v0.169.0+extended+withdeploy darwin/arm64
   ```

   macOS 上执行 `brew install git go hugo` 即可装齐。Linux 与 Windows 请按
   [Hugo 安装指南](https://gohugo.io/installation/)和
   [Go 下载页](https://go.dev/dl/)安装。

1. ### 创建站点 {#clone}

   打算长期维护，就打开 [Starter](https://github.com/pgsty/oink-starter)，点击
   **Use this template**，再克隆 GitHub 为你创建的新仓库。只想先试试，直接克隆原仓库：

   ```bash
   git clone https://github.com/pgsty/oink-starter.git my-docs
   cd my-docs
   hugo server
   ```

   第一次启动会慢一些，Hugo 要先把主题下载到模块缓存。

1. ### 先看一遍 {#open}

   打开 <http://localhost:1313/>。动手修改之前，先把 Docs、Blog、Book 点一遍，
   切换到中文（`/zh/`）和法语（`/fr/`），试试搜索，再切换深浅色模式。此时发现的
   问题一定不是你的修改造成的，报告或修复都容易得多。

1. ### 做一处看得见的修改 {#first-change}

   修改 `hugo.yaml` 顶部的 `title` 与 `baseURL`，再改 `data/home/en.yaml` 里的一句话。
   浏览器会自动刷新。两处修改都显示出来，就说明配置、内容与固定版本的主题已经连通。
{.steps}

## 换成自己的站点 {#learning-path}

每次只改一层，改完就预览。出了问题，你立刻知道是哪一处修改引起的。

- [使用 OINK Starter](/zh/docs/start/starter/) — 完整流程：语言、身份、首页、内容、导航、品牌、集成、部署，按这个顺序来。
- [Starter 仓库导览](/zh/docs/start/anatomy/) — 哪个文件管站点的哪一部分，哪些可以删。
- [编写页面](/zh/docs/write/pages/) — front matter、标题、链接、图片与草稿。
- [组件总览](/zh/docs/components/) — 提示块、标签页、图表等组件，等内容树稳定后再加。
- [品牌外观](/zh/docs/customize/brand/) — Logo、强调色、字体、页宽与自定义 CSS。
- [发布上线](/zh/docs/admin/deploy/) — 使用自带的 GitHub Pages 或 Cloudflare Pages workflow，并检查线上站点。
{.cards}

## 发布之前 {#publication-gate}

在本地执行一遍与 Starter workflow 相同的生产构建：

```bash
hugo --cleanDestinationDir --gc --minify --environment production \
  --printPathWarnings
```

命令以 `Total in …` 结尾，`public/` 下每种语言一个目录，Docs、Blog、Book
页面都在。推送前请读一遍告警：配置写错或集成配置不完整时，OINK 只告警并用安全的
默认值继续构建，所以一条告警往往意味着某个你以为开着的功能其实没开。推送后，确认
workflow 通过，再打开线上地址看一眼。

## 用 AI agent 建站 {#agent-skill}

OINK 发布了一个 agent 技能 **Oink 建站**（`oink-site`）：一个 Markdown 文件，教编程
agent 搭建、迁移和打磨 OINK 站点，内含 OINK 自家站点的审阅标准和[案例库](/zh/case/)
中的经验。语法细节它会让 agent 回来查本文档，并要求 agent 在浏览器里检查自己的成果。

- English：<https://oink.pgsty.com/skill.md>
- 简体中文：<https://oink.pgsty.com/skill.zh.md>

保存为技能后，开启一个新的 agent 会话：

```bash {tab="Claude Code"}
mkdir -p ~/.claude/skills/oink-site
curl -fsSL https://oink.pgsty.com/skill.zh.md -o ~/.claude/skills/oink-site/SKILL.md
```

```bash {tab="Codex"}
mkdir -p ~/.codex/skills/oink-site
curl -fsSL https://oink.pgsty.com/skill.zh.md -o ~/.codex/skills/oink-site/SKILL.md
```

然后描述你想要的站点，例如“用 oink-site 技能为这个项目搭建一个中英双语文档站”。
没有技能目录的 agent，把地址交给它就能直接读取。想要英文版，把地址换成
`skill.md`。重新下载即可更新；文件里写明了它对应的 OINK 版本。
