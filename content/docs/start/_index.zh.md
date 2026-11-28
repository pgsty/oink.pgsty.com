---
title: 快速上手
linkTitle: 快速上手
description: 先克隆文档站本身用 Hugo 本地跑起来，再用一段提示词让 AI Agent 搭建自己的个人站；随后按需选择本地浏览、从零开始或为项目加装文档。
weight: 20
icon: fa-solid fa-rocket
no_list: true
search_keywords:
  [
    快速上手,
    AI agent,
    agent 技能,
    提示词,
    个人站点,
    克隆,
    Hugo,
    hugo serve,
    安装,
    get started,
  ]
aliases:
  - /docs/start/starter/
  - /docs/tutorial/
  - /docs/tutorial/prerequisites/
  - /docs/tutorial/project-site/
---

了解 OINK 最快的办法，不是从空目录一点点拼配置，而是直接克隆本文档站本身，在本地用 Hugo 跑起来。两分钟内你就能在浏览器里点遍整套功能，并对照 `content/` 里的源码看清每种写法；接下来，用一段提示词交给 AI Agent，就能直接搭出你自己的站点。

## 准备工具 {#tools}

需要 Git、Go 与 Hugo（已在 `0.170+` 上测试）。需要 Go，是因为 Hugo 以 Go 模块的方式拉取主题；整个构建过程不需要 Node.js、npm 或 Sass 编译器。

```console
$ hugo version
hugo v0.170.1+withdeploy darwin/arm64
```

macOS 上执行 `brew install git go hugo` 即可装齐。Linux 与 Windows 请按 [Hugo 安装指南](https://gohugo.io/installation/)和 [Go 下载页](https://go.dev/dl/)安装。

## 第一步：克隆文档站并本地跑起来 {#clone}

直接把 `oink.pgsty.com` 克隆到本地，运行 `hugo serve` 启动开发服务器：

```bash {title="终端"}
git clone https://github.com/pgsty/oink.pgsty.com.git
cd oink.pgsty.com
hugo serve
```

第一次启动会花几秒钟把固定版本的 OINK 主题下载到本机 Go 模块缓存，之后每次启动都是秒开。打开 <http://localhost:1313/>，亲手试一遍：

- 逛逛 **文档**、**教程**、**案例** 与 **博客**，点右上角外观菜单，在浅色与深色模式下切换 Paper、Slate、Ink、Terminal 四套风格。
- 按 {{< kbd "/" >}} 试试本地全文搜索，并在顶栏切换中英文。
- 用编辑器打开 `content/docs/components/` 下的任意一页，改一句话保存，浏览器会自动刷新——你立刻能看到 Markdown 源码与页面效果的对应关系。

这个仓库同时承担 OINK 的回归测试，配置较重，适合当作活参考来查阅和试玩；真正搭建自己的站点时，请按第二步或[从零开始](/zh/docs/start/from-scratch/)在干净目录里新建。

## 第二步：用 AI Agent 建一个个人站 {#agent-skill}

本地工具验证通过后，搭建自己站点最快的方式，是在一个空目录里打开 Claude Code 或 Codex 这类编程 Agent，把 OINK 建站技能（`oink-site`）和一段清晰的提示词交给它：

```bash {title="终端"}
mkdir my-site && cd my-site
claude   # 或 codex，或任意能执行命令的编程 Agent
```

把下面提示词中 `<尖括号>` 里的信息换成你自己的内容，直接发给 Agent：

```text {title="提示词：用 Hugo 和 OINK 搭建个人站点"}
请阅读 https://oink.pgsty.com/skill.zh.md，严格按照其中的建站流程，
在当前空目录里使用 Hugo 和 OINK 主题为我搭建一个个人站点。

关于我：<你的名字>，<一句话简介，例如：后端与数据库工程师，分享工程实践与读书笔记>。
域名：<https://you.example.com>。
语言：<简体中文，或中英双语>。

站点结构：
- 首页使用 OINK 的数据驱动落地页：简短的个人介绍 Hero、各栏目的卡片入口，以及 GitHub / X 链接。
- 博客栏目：使用卡片网格索引、标签分类与 RSS 订阅源，用我的口吻写三篇占位示例文章。
- 笔记栏目：使用 Docs 阅读外壳，用来沉淀长期维护的技术笔记与备忘。
- 关于页：包含个人简介、正在做的项目与联系方式。

外观与工程规范：
- 默认使用 Paper 预设，开启深色模式，外观菜单里提供 Paper、Slate、Ink、Terminal 四套风格。
- 开启本地全文搜索、每页的 Markdown 输出与 llms.txt；配置 .gitignore 排除 public/、resources/、.hugo_build.lock 与 .hugo_cache/。
- 在 go.mod 中固定当前最新发布的 OINK 标签版本，不要跟踪 main。

构建确认没有意外告警后，运行 hugo serve，在浏览器里分别检查桌面端与移动端页面，最后告诉我接下来需要替换哪些占位内容。
```

技能文件（简体中文：<https://oink.pgsty.com/skill.zh.md>；English：<https://oink.pgsty.com/skill.md>）会引导 Agent 查阅本文档的当前语法，避开已退役的 Docsy 或旧版 OINK 写法，并把不同类型的站点对应到[案例库](/zh/case/)里的真实项目。

如果你经常用 Agent 建站，可以把技能一次安装到本地，之后在新会话里直接说“使用 `oink-site` 技能”即可：

```bash {tab="Claude Code"}
mkdir -p ~/.claude/skills/oink-site
curl -fsSL https://oink.pgsty.com/skill.zh.md -o ~/.claude/skills/oink-site/SKILL.md
```

```bash {tab="Codex"}
mkdir -p ~/.codex/skills/oink-site
curl -fsSL https://oink.pgsty.com/skill.zh.md -o ~/.codex/skills/oink-site/SKILL.md
```

重新下载即可更新技能文件，文件开头标明了对应的 OINK 版本。开源项目官网、命令行手册与在线书籍的提示词模板，见[一句提示词，建一个站](/zh/book/01-start/)。

## 按场景继续深入 {#choose}

看完演示、跑通第一站之后，按你手头项目的实际情况选下一篇：

| 你当前的场景 | 阅读 | 你会学到 |
| --- | --- | --- |
| 手上已经有一个 OINK 站点仓库，想在本地舒服地阅读、边写边看，或实时查看 AI Agent 的工作报告 | [本地浏览](/zh/docs/start/local/) | 用 `hugo serve` 跑起本地服务器，实时阅读与编辑，并把浏览器变成 AI Agent 产出的实时看板 |
| 想不靠模板，从零搭一个结构干净的独立 OINK 项目，或把已有 Hugo 站点切到 OINK | [从零开始](/zh/docs/start/from-scratch/) | 最小目录骨架、`hugo.yml` 核心配置、第一页写法，以及离线归档与 submodule 等安装方式 |
| 已经有一个开源代码仓库，想在它的 `docs/` 目录下加装文档站并自动部署 | [加装文档](/zh/docs/start/add-docs/) | 独立的 `docs/` Hugo 子项目结构、`.gitignore` 排错与 GitHub / Cloudflare 自动构建配置 |
| 正在升级旧版 OINK，或从 Docsy 迁移 | [版本升级](/zh/docs/admin/upgrade/) | 版本升级、语法迁移与站点覆盖项检查 |
