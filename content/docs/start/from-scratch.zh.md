---
title: 从零开始
linkTitle: 从零开始
description: 了解一个最小独立 OINK 项目的骨架，从空目录一步步搭建并跑通第一页；以及接入已有 Hugo 站点、离线部署与其它安装方式。
weight: 20
search_keywords:
  [
    从零开始,
    从零建站,
    目录结构,
    安装,
    hugo mod init,
    hugo mod get,
    submodule,
    离线,
    部署,
    vendor,
    go.work,
    from scratch,
    Hugo Module,
    oink-starter,
  ]
aliases:
  - /docs/start/anatomy/
  - /docs/about/architecture/
  - /docs/tutorial/install/
  - /docs/tutorial/create-site/
  - /docs/tutorial/configuration/
---

如果你想亲手搭一个干净的独立 OINK 站点，看清仓库里每一个文件的职责——而不是交给 Agent 生成，也不想带入整套示例模板——实际只需要很少几个文件。本页从空目录带你建出第一页，也说明如何把已有 Hugo 站点切到 OINK，以及在离线或无 Go 环境下如何安装主题。

如果你已经有一个开源代码仓库、只想在它的 `docs/` 子目录下加装文档站，请直接看[加装文档](/zh/docs/start/add-docs/)。如果你想拿一个现成的三语 Docs / Blog / Book 模板直接改，也可以使用 [OINK Starter](https://github.com/pgsty/oink-starter)，它已备好可直接修改的 GitHub Pages 与 Cloudflare Pages 部署工作流。从 Docsy 迁移请走[从 Docsy 迁移](/zh/docs/admin/upgrade/#from-docsy)。

## 一个最小 OINK 项目的骨架 {#anatomy}

OINK 站点就是一个标准的 Hugo 仓库。主题代码本身不进入你的 Git 树：`go.mod` 固定确切的 OINK 版本标签，首次构建时 Hugo 自动把它拉到模块缓存里。

```filetree {title="my-docs/"}
- my-docs/
  - hugo.yml                # 唯一的站点配置：标题、baseURL、语言、Goldmark、参数与主题导入
  - go.mod                  # 固定 github.com/pgsty/oink@vX.Y.Z
  - go.sum                  # 校验该版本的校验和
  - .gitignore              # 把 public/、resources/ 与 Hugo 缓存挡在 Git 之外
  - content/
    - _index.md             # 首页入口（由 data/home/ 驱动首页时可省略）
    - docs/
      - _index.md           # Docs 分区根页：标题、排序与侧栏起点
      - install.md          # 第一篇文档页
  - data/
    - home/
      - en.yaml             # 可选：数据驱动的落地页（每种语言一份）
  - assets/
    - icons/logo.svg        # 可选：顶部导航栏 Logo，由 Hugo 处理
    - css/project.css       # 可选：纯 CSS 站点覆盖样式（无需 Sass）
  - static/
    - favicon.svg           # 可选：浏览器图标，原样复制
```

样式表、脚本、字体、Font Awesome 图标、全文搜索、图表运行时和全部布局都由主题模块提供。仓库里提交源码、配置文件以及 `go.mod` 与 `go.sum`；`public/`、`resources/`、`.hugo_build.lock` 与 `.hugo_cache/` 一律忽略。

## 从空目录到第一页 {#scaffold}

确认本机已按[准备工具](/zh/docs/start/#tools)装好 Git、Go 和 Hugo，然后依次执行以下四步。

1. ### 建骨架并获取主题 {#skeleton}

   ```bash {title="终端"}
   hugo new site --format yaml my-docs
   cd my-docs
   git init
   hugo mod init github.com/example/my-docs
   hugo mod get github.com/pgsty/oink@{{< param tdVersion.latest >}}
   ```

   把 `github.com/example/my-docs` 换成你自己站点的模块路径。`hugo mod get` 会生成 `go.mod` 与 `go.sum`，两者必须一同提交，保证本机与 CI 构建使用的是同一个经过校验的版本。请固定发布标签而不要跟踪 `main`，这样站点只在你主动升级时才变化；全部标签见 [GitHub Releases](https://github.com/pgsty/oink/releases)。

   第一次构建前先建好 `.gitignore`，防止生成产物进入 Git：

   ```gitignore {title=".gitignore"}
   /public/
   /resources/
   /.hugo_build.lock
   /.hugo_cache/
   go.work
   go.work.sum
   ```

1. ### 写 `hugo.yml` {#config}

   把生成的 `hugo.yaml` 改名为 `hugo.yml`（Hugo 两个名字都认，但站点根目录只保留一份配置文件），替换为下面的最小可用配置：

   ```yaml {title="hugo.yml" collapse=30}
   title: Product Docs
   baseURL: https://docs.example.com/
   defaultContentLanguage: en
   # enableGitInfo: true # 完成首次 Git 提交后再打开，用于显示页面「最后修改」时间

   languages:
     en:
       label: English
       locale: en-US
       weight: 1
       title: Product Docs
       params:
         description: Everything about running Product in production
       menus:
         main:
           - { name: Docs, pageRef: /docs, weight: 20 }
           - { name: Blog, pageRef: /blog, weight: 50 }

   # 三项 Goldmark 前置：OINK 的原生 Markdown 组件依赖它们
   markup:
     goldmark:
       renderer:
         unsafe: true # 允许内容里的行内 HTML
       parser:
         attribute:
           block: true # 支持 {.steps} {.cards} {caption=} 等属性行
         wrapStandAloneImageWithinParagraph: false # 块级图片才能携带属性行
     highlight:
       noClasses: false # 代码高亮随深浅色模式切换

   params:
     offline_search: true
     github_repo: https://github.com/example/my-docs
     copyright:
       authors: '[Example Inc.](https://example.com/)'
       from_year: 2026
     ui:
       preset: paper
       preset_menu: [paper, slate, ink, terminal]
       dark_mode: true
       sidebar_menu_foldable: true
       section_index: cards

   outputs:
     home: [HTML, markdown, LLMS]
     page: [HTML, markdown]
     section: [HTML, RSS, print, markdown]

   module:
     imports:
       - path: github.com/pgsty/oink
   ```

   每一段各司其职：

   | 配置段 | 负责内容 | 缺了会怎样 |
   | --- | --- | --- |
   | 顶层 + `languages` | 站名、规范 `baseURL`、语言与顶栏菜单 | `baseURL` 写错会导致生产环境绝对链接与搜索索引失效 |
   | `markup.goldmark` | OINK 组件必需的三项解析设置 | 属性行会以 `{.steps}` 原文显示在正文里 |
   | `params` | 本地搜索、仓库链接、外观预设与阅读外壳开关 | 可选功能默认关闭，不会擅自开启 |
   | `outputs` | 每页的 `.md` 副本、`llms.txt` 与打印视图 | 页面菜单里没有「复制 Markdown」与打印入口 |
   | `module` | 主题导入 | 构建时找不到 OINK 主题 |

   若要写数学公式，请按[公式](/zh/docs/components/math/)补上 Goldmark passthrough 扩展。所有站点参数及默认值见[配置总览](/zh/docs/customize/config/)。

1. ### 写第一个分区和页面 {#first-page}

   `content/` 下的每个一级目录是一个分区，子目录与 `weight` 共同决定侧栏顺序。先为分区建一个 `_index.md`，再写第一页内容：

   ```markdown {title="content/docs/_index.md"}
   ---
   title: Docs
   linkTitle: Docs
   description: Everything about running Product in production.
   weight: 20
   ---

   从[安装](/docs/install/)开始。
   ```

   ````markdown {title="content/docs/install.md"}
   ---
   title: Install
   description: Install Product on a fresh machine.
   weight: 10
   ---

   ## Prerequisites {#prerequisites}

   > [!IMPORTANT]
   > Product 需要 PostgreSQL 18 或更高版本。

   ## Install {#install}

   ```bash
   curl -fsSL https://get.example.com | bash
   ```
   ````

   从第一页就给标题加上显式 `{#id}` 锚点：以后增加第二种语言时，双语页面的锚点天然一致。更多写作与目录组织规则见[编写页面](/zh/docs/write/pages/)与[组织内容](/zh/docs/write/organize/)。

1. ### 本地预览 {#preview}

   ```bash {title="终端"}
   hugo serve
   ```

   打开 <http://localhost:1313/docs/>，即可看到包含 **Install** 的侧栏、本地搜索和外观切换菜单。在添加首页数据之前，站点根路径保持最简；首页编排见[首页与落地页](/zh/docs/customize/home/)。
{.steps}

## 接入已有 Hugo 站点 {#existing-site}

如果已经有一个包含内容的 Hugo 站点，切一个新分支直接改造，保留原有的 `content/` 目录，不需要 `hugo new site`：

1. 站点没有 `go.mod` 时，用自己仓库的模块路径执行 `hugo mod init`；已有的话直接保留。
1. 执行 `hugo mod get github.com/pgsty/oink@{{< param tdVersion.latest >}}`。
1. 在配置里把旧主题替换成指向 `github.com/pgsty/oink` 的 `module.imports`（无关导入照旧保留），再从[写 `hugo.yml`](#config)合并三项 `markup.goldmark` 设置和 `markup.highlight.noClasses: false`。
1. 排查仍依赖旧主题的部分：站点 `layouts/` 下的模板覆盖、`assets/` 样式、旧短代码，以及 front matter 里的 `type` 或 `layout`。
1. 运行 `hugo serve`，在深浅色下抽查代表页面，确认无误后再逐项开启可选功能，最后按[验证](#verify)收尾。
{.steps}

## 其它安装方式 {#install-methods}

Hugo Module 是默认推荐，因为版本解析和 `go.sum` 校验都由 Hugo 自动完成。另外三种方式适用于特定约束：网络无法访问 Go 模块代理、构建平台不提供 Go，或组织要求把审查过的主题副本放进自己仓库。除 `hugo mod vendor` 外，它们都改用 `theme: oink` 替代 `module.imports`，版本跟踪与完整性校验由你自行负责。

### 四种方式对比 {#comparison}

| 方式 | 需要 Go | 版本可审计 | 主题源码进你的仓库 | 适用场景 |
| --- | --- | --- | --- | --- |
| **Hugo Module** | 是 | `go.sum` 自动校验 | 否 | 默认推荐 |
| Git submodule | 否 | 仓库记录精确 commit | 以引用形式 | 不用 Go 且希望在 Git 中固定引用 |
| 离线归档 | 否 | 手工核对 checksum | 是 | 隔离网络 / 离线构建与部署 |
| 固定版本源码副本 | 否 | 记录标签与校验值 | 是 | 托管平台要求仓库包含完整文件树 |

### Hugo Module（推荐） {#hugo-module}

```bash {title="终端"}
hugo mod init github.com/example/product-docs
hugo mod get github.com/pgsty/oink@{{< param tdVersion.latest >}}
```

```yaml {title="hugo.yml"}
module:
  imports:
    - path: github.com/pgsty/oink
```

用 `hugo mod graph` 查看实际解析到的版本，用 `hugo mod get -u` 升级。每台构建机器都需要安装 Go。

### Git submodule {#git-submodule}

站点仓库记录主题的确切 commit：

```bash {title="终端"}
git submodule add https://github.com/pgsty/oink.git themes/oink
git -C themes/oink fetch --tags
git -C themes/oink checkout {{< param tdVersion.latest >}}
git add .gitmodules themes/oink
```

```yaml {title="hugo.yml"}
theme: oink
```

CI 在运行 Hugo 之前必须初始化 submodule，否则 `themes/oink` 是空目录：

```bash {title="CI 检出步骤"}
git submodule update --init --recursive
```

### 离线归档 {#offline-archive}

在隔离网络环境下做离线构建与部署，先在联网机器准备好主题，再整体搬进内网。有两种做法。

**`hugo mod vendor`** 把已解析的主题固化进 `_vendor/`，之后的构建既不需要联网，也不需要 Go：

```bash {title="终端"}
hugo mod vendor          # 生成 _vendor/，内含主题挂载的完整目录树
tar czf ../my-docs.tgz . # 归档输出到当前目录之外
```

只要 `_vendor/` 存在，Hugo 就会自动优先使用它（`hugo mod graph` 显示 `+vendor`），`hugo.yml` 里的 `module.imports` 无需修改。只有 vendor 这一步需要 Go；升级主题时回到联网机器重新执行 `hugo mod get` 与 `hugo mod vendor`。注意 `_vendor/` 不包含 `LICENSE`、`NOTICE` 与 `VENDOR.json`，对外分发归档时请从主题仓库补齐这三个文件。

**发布标签源码归档** 完全不依赖 Go 模块。下载标签归档并解压到 `themes/oink/`：

```bash {title="终端"}
curl -L -o oink.tar.gz \
  https://github.com/pgsty/oink/archive/refs/tags/{{< param tdVersion.latest >}}.tar.gz
mkdir -p themes/oink
tar xzf oink.tar.gz -C themes/oink --strip-components=1
```

```yaml {title="hugo.yml"}
theme: oink
```

主题仓库根目录就是主题根，所以 `layouts/`、`assets/`、`i18n/` 与 `static/` 会直接落到 `themes/oink/` 下。如果要在跨网搬运时做完整性校验，在联网一侧生成归档与校验文件：

```bash {title="联网机器"}
git clone --branch {{< param tdVersion.latest >}} --depth 1 \
  https://github.com/pgsty/oink.git oink
git -C oink archive --format=tar.gz --prefix=oink/ \
  --output=../oink-{{< param tdVersion.latest >}}.tar.gz {{< param tdVersion.latest >}}
shasum -a 256 oink-{{< param tdVersion.latest >}}.tar.gz \
  > oink-{{< param tdVersion.latest >}}.tar.gz.sha256
```

搬进隔离环境后先校验再解压：

```bash {title="隔离环境"}
shasum -a 256 -c oink-{{< param tdVersion.latest >}}.tar.gz.sha256
mkdir -p themes
tar -xzf oink-{{< param tdVersion.latest >}}.tar.gz -C themes
```

首次离线构建前，确认以下 11 个顶层条目齐全；再分发主题时必须保留 `LICENSE`、`NOTICE` 与 `VENDOR.json`：

```filetree {title="themes/oink/"}
- oink/
  - go.mod        # 模块路径声明
  - hugo.yaml     # 主题默认参数与挂载配置
  - theme.toml    # theme: oink 方式所需的主题元数据
  - LICENSE       # Apache-2.0
  - NOTICE        # 上游署名
  - VENDOR.json   # 第三方运行时清单：版本、来源、许可证与 SHA-256
  - assets/       # 样式表、JS 与随主题分发的第三方运行时
  - layouts/      # 模板、partial、shortcode 与 render hook
  - static/       # 内置字体文件
  - i18n/         # 32 份界面语言包
  - data/         # 页尾出处行用的 SPDX 许可证表
```

Bootstrap、Font Awesome、字体、搜索和图表运行时全部随主题内置，离线部署不需要 `node_modules`、PostCSS 或 CDN。

### 固定版本源码副本 {#pinned-clone}

如果构建平台要求主题文件直接提交在站点仓库里，按[上文](#offline-archive)准备已校验的标签归档，解压到 `themes/oink/`，设置 `theme: oink`，连同标签与 SHA-256 校验记录一起提交。

不要直接 `git clone` 到 `themes/oink` 后提交：嵌套的 `.git` 目录会让 Git 只记录一个未初始化的 gitlink 指针，实际文件并没有进仓库。需要按引用跟踪时请用 [Git submodule](#git-submodule)。

## 用本地主题 checkout 开发 {#local-theme-checkout}

只有同时修改 OINK 主题与站点时才需要。把两个仓库放在同级目录：

```text {title="同级目录布局" copy=false}
~/pgsty/
├── oink/            # 主题
└── product-docs/    # 你的站点
```

用 `HUGO_MODULE_REPLACEMENTS` 在单次命令中指向本地主题，`go.mod` 保持不动：

```bash {title="终端"}
cd ~/pgsty/product-docs
HUGO_MODULE_REPLACEMENTS='github.com/pgsty/oink -> ../oink' hugo serve
```

Go workspace（`go work init` 配合 `HUGO_MODULE_WORKSPACE=go.work`）作用相同。两者都只用于本机调试，切勿提交到 Git；CI 与生产环境必须构建 `go.mod` 固定的发布版本。确认实际解析版本的做法见[同时预览本地主题](/zh/docs/admin/preview/#theme-workspace)。

## 验证 {#verify}

```bash {title="终端"}
hugo mod graph                                                  # 确认实际解析的 OINK 标签
hugo --cleanDestinationDir --gc --minify --printPathWarnings
```

构建以 `Total in …` 结尾且没有意外告警即通过。接着检查：`/docs/` 能正常打开并显示侧栏，搜索能搜到页面标题，切换深浅色时代码块配色同步变化（`noClasses: false`），且 `git status --short` 中只有源文件（`hugo.yml`、`go.mod`、`go.sum`、`content/`）。

## 相关 {#related}

- [快速上手](/zh/docs/start/) — 克隆文档站跑通本地基线，并用 AI Agent 搭建个人站
- [本地浏览](/zh/docs/start/local/) — 日常阅读、边编辑边预览与查看 AI Agent 报告
- [加装文档](/zh/docs/start/add-docs/) — 在已有开源项目的 `docs/` 目录下加装文档站
- [配置总览](/zh/docs/customize/config/) — `hugo.yml` 每个键的含义与默认值
- [发布上线](/zh/docs/admin/deploy/) — 将 `public/` 部署到 GitHub Pages、Cloudflare Pages 或自有服务器
- [版本升级](/zh/docs/admin/upgrade/) — 升级 OINK 版本与从 Docsy 迁移
