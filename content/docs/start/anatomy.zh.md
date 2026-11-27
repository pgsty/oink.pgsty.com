---
title: Starter 仓库导览
linkTitle: 仓库导览
description: 查清 OINK Starter 里哪个文件管站点的哪一部分、哪些可以删、构建依赖哪些文件。
weight: 20
search_keywords: [Starter 结构, 仓库导览, 目录结构, anatomy, hugo.yaml, content, data home, workflows]
aliases:
  - /docs/about/architecture/
---

[OINK Starter](https://github.com/pgsty/oink-starter) 里的每个文件只负责一件事。这张地图帮你找到站点某一部分背后的文件，判断哪些可以删除，以及构建依赖哪些文件。主题本身不在仓库里：`go.mod` 以 Hugo 模块的方式固定主题版本，第一次构建时 Hugo 把它下载到 Go 模块缓存。要按合理的顺序修改这些文件，请跟随[使用 OINK Starter](/zh/docs/start/starter/)。

## 顶层地图 {#layout}

```filetree {title="oink-starter/"}
- oink-starter/
  - hugo.yaml                         # 唯一的站点配置：身份、语言、输出、功能、主题导入
  - go.mod                            # 站点模块与精确的 OINK 版本
  - go.sum                            # 校验该版本的校验和
  - examples/
    - hugo.single.yaml                # 仅英文的完整配置
    - hugo.bilingual.yaml             # 英文 + 中文的完整配置
  - data/
    - home/
      - en.yaml                       # 每种语言一份精简首页
      - zh.yaml
      - fr.yaml
  - content/
    - _index.md                       # 各语言的首页根
    - _index.zh.md
    - _index.fr.md
    - docs/                           # 简介、快速上手、教程、参考
    - blog/                           # post/、design/ 与 release/
    - book/                           # 介绍 Starter 的四章短书
  - assets/
    - icons/logo.svg                  # 项目 Logo，经 Hugo 处理
  - static/
    - favicon.svg                     # 浏览器图标，原样复制到站点根
  - i18n/
    - fr.yaml                         # 少量界面文字的法语措辞
  - .github/workflows/
    - github-pages.yaml               # 生产构建后发布到 GitHub Pages
    - cloudflare-pages.yaml           # 生产构建后用 Cloudflare Direct Upload 发布
  - Makefile                          # dev、serve、build 快捷命令
  - .gitignore                        # 把构建产物挡在 Git 之外
  - AGENTS.md                         # 给编程 agent 的构建基线与仓库规则
  - README.md                         # 给仓库维护者的一页摘要
  - LICENSE                           # MIT，换上你自己的版权行
```

`.gitignore` 已经排除了构建产生的文件（`public/`、`resources/`、`.hugo_build.lock`，以及 workflow 使用的 `.hugo_cache/` 模块缓存），所以构建之后 `git status --short` 只会列出你改过的文件。

## 最先修改什么 {#change-first}

| 路径 | 管什么 | 第一步 |
| --- | --- | --- |
| `hugo.yaml` | 身份、规范 URL、语言、输出、主题功能、可选集成 | 先定语言，再改两个标着 `CHANGE ME` 的值 |
| `data/home/` | 首页的标语、卡片与行动入口 | 先改好一种语言，再翻译到其它语言 |
| `content/` | 首页以外读者看到的一切 | 替换示例页面；决定整体删除某个部分之前，保留该栏目的 `_index.md` |
| `assets/icons/logo.svg` | 顶部导航栏里的 Logo | 有了正式图形再替换 |
| `static/favicon.svg` | 浏览器标签页图标 | 与 Logo 一起替换 |
| `hugo.yaml` 中的 `params.github_*` | 编辑、历史、新建页面与 issue 链接 | 仓库建好之后再取消注释 |

## 哪些必须保留 {#keep}

- **`go.mod` 与 `go.sum`。** 两者一起固定 OINK 版本并校验下载内容，都要提交。升级主题时单独做一次提交，便于审阅，也便于回退。
- **`hugo.yaml` 中的三项 Goldmark 设置与 `markup.highlight.noClasses: false`。** 步骤、卡片、参数表、图片属性和 Book 引用目标都写成 Markdown 属性行，缺了这些设置就会原样显示为文字。见 [Goldmark 前置设置](/zh/docs/customize/config/#goldmark)。
- **`outputs`。** 删掉 `markdown`、`LLMS` 或 `print`，就分别失去页面的 Markdown 版本、供 agent 使用的 `llms.txt` 索引，或打印视图。
- **两个 workflow 中的 `fetch-depth: 0`。** Starter 设置了 `enableGitInfo: true`；浅克隆时所有页面会显示同一个最后修改日期。
- **CI 中的 `GOWORK: off` 与 `HUGO_MODULE_WORKSPACE: off`。** 否则 Go workspace 可能用另一份副本替换已发布的主题版本，部署出去的站点就不是你验证过的那一个。

## 可选内容区 {#optional}

Docs、Blog、Book 是站点中彼此独立的部分，任何一个都可以删除。它的菜单项写在它自己的 `_index.md` 里，所以删掉整棵目录树，菜单项也随之消失：

1. 删除 `content/<part>/` 及其全部语言文件。
1. 从每份 `data/home/<lang>.yaml` 中删掉指向它的首页链接。Starter 里，hero 的第二个按钮指向 `book/`，卡片分别指向 `blog/`、`docs/` 与 `book/`。
1. 在 `content/` 中搜索其它指向它或提到它的地方；Starter 的 Book 第二章就介绍了 `content/blog/` 与 `content/docs/`。
1. 构建，阅读告警，再检查每种语言的顶部导航。
{.steps}

一个部分要在所有已启用语言中同时删除。只删一种语言的栏目根，其它语言仍保留菜单项和侧栏，读者会以为是漏了翻译。

选定语言之后，`examples/` 下的两个文件只剩参考价值，保留或删除都可以；Hugo 只读取根目录的 `hugo.yaml`。

## 内容与导航 {#content-navigation}

在 Docs 与 Book 中，目录结构和 `weight` 决定侧栏顺序，也决定上一页 / 下一页的顺序。顶部导航来自各栏目 `_index.md` 中的 `menus.main`：Docs 的子栏目声明了 `parent: docs`，因此成为 Docs 的下拉菜单。译文 `_index` 重复相同的 `identifier`、`parent` 与 `weight`，只翻译可见的标题。

Docs 采用一种常见的文档模型，每个栏目只回答一类问题：

- **简介** 说明项目做什么、为什么。
- **快速上手** 带新用户得到第一个可用结果。
- **教程** 完整地教会一项任务。
- **参考** 记录精确的、受支持的行为。

可以按项目需要改名或重组这些栏目，但要让不同类型的回答各归其位：读者想查一个参数，不应该被迫读完一篇教程。

## 语言模型 {#languages}

英文文件以 `.md` 结尾，中文和法语译文以 `.zh.md`、`.fr.md` 结尾，与原文并排放置。首页在 `data/home/` 下每种语言一个数据文件。`hugo.yaml` 的 `languages` 块设定每种语言的标签、locale、顺序、站名与站点描述；`i18n/fr.yaml` 调整少量主题界面文字的法语措辞。

`examples/` 下的两份 profile 仍然声明了它们禁用的语言，这样 Hugo 依旧把 `.zh.md`、`.fr.md` 认作译文，而不是多出来的英文页面。如何选择语言组合，见上手流程的[第一层](/zh/docs/start/starter/#languages)。

## OINK 在哪里 {#theme}

两个文件把站点和主题连在一起：

```yaml {title="hugo.yaml"}
module:
  imports:
    - path: github.com/pgsty/oink
```

```go-mod {title="go.mod"}
module github.com/pgsty/oink-starter

go 1.27.4

require github.com/pgsty/oink v1.6.0
```

`hugo mod graph | grep github.com/pgsty/oink` 显示构建实际解析到的版本。如果你手上的 Starter 固定的是更早的版本，按[版本升级](/zh/docs/admin/upgrade/)操作。

Makefile 有三个目标。`make serve` 与 `make build` 使用 `go.mod` 中的版本运行 Hugo，并关闭所有本地替换。`make dev` 改用同级目录 `../oink` 中的主题 checkout（可用 `THEME_DIR=…` 指定别处），只在修改主题本身时才需要，见[用本地主题 checkout 开发](/zh/docs/start/from-scratch/#local-theme-checkout)。

## 部署文件 {#deployment}

两个 workflow 都安装 Go 1.27.4 和最新的 Hugo，下载固定版本的主题，执行同一条生产构建，区别只在发布到哪里：

- `github-pages.yaml` 在每次推送 `main` 时运行，也可手动触发。它用 GitHub Pages 分配的地址构建，再通过 Pages API 发布；只需在 **Settings → Pages** 中把 Source 设为 GitHub Actions。
- `cloudflare-pages.yaml` 可手动触发；仓库变量 `CLOUDFLARE_PAGES_ENABLED` 设为 `true` 之后，每次推送 `main` 也会运行。它从仓库 secrets 读取账号 ID 与 API token，并读取可选变量 `CLOUDFLARE_PROJECT_NAME` 与 `CLOUDFLARE_SITE_URL`。

删掉你不用的那个托管商的 workflow。Cloudflare 的同一个项目要么用这个 Direct Upload workflow，要么用 Cloudflare 的 Git integration，不能两者并用。具体设置步骤见[构建与部署](/zh/docs/start/starter/#build-deploy)。

## 相关 {#related}

- [使用 OINK Starter](/zh/docs/start/starter/) — 逐层修改这些文件
- [从零建站](/zh/docs/start/from-scratch/) — 不采用这套内容模型，只接入 OINK
- [组织内容](/zh/docs/write/organize/) — 目录、`weight` 与 `_index.md` 如何构成侧栏
- [配置总览](/zh/docs/customize/config/) — 每个站点参数及其默认值
- [发布上线](/zh/docs/admin/deploy/) — 托管商、`baseURL` 与线上检查
