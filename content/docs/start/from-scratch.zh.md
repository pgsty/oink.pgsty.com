---
title: 从零建站与其它安装方式
linkTitle: 从零建站
description: 把 OINK 接入现有 Hugo 站点，或手工搭一个最小站点；以及用 Module、submodule、离线归档或源码副本安装主题。
weight: 30
search_keywords:
  [
    从零建站,
    安装,
    hugo mod init,
    hugo mod get,
    submodule,
    离线,
    vendor,
    go.work,
    from scratch,
    install,
    Hugo Module,
  ]
aliases:
  - /docs/tutorial/install/
  - /docs/tutorial/create-site/
  - /docs/tutorial/configuration/
---

已经有一个 Hugo 站点、想让 OINK 来渲染它，或者不想从 [Starter](/zh/docs/start/starter/) 起步、要自己逐个文件搭站点时，看这一页。两种情况下，主题都以 Hugo 模块的形式接入，再加上它的 Markdown 组件所需的三项 Goldmark 设置；所需工具与[快速上手](/zh/docs/start/#tools)相同。Docsy 站点另有专门的路径，还会一并迁移 Docsy 语法，见[从 Docsy 迁移](/zh/docs/admin/upgrade/#from-docsy)。

用不了 Go 模块时，例如处于隔离网络，或者托管商要求主题文件就在仓库里，请看[其它安装方式](#install-methods)：Git submodule、离线归档与源码副本。

## 接入现有站点 {#existing-site}

在一个分支上操作，原有的配置文件和内容保持不动，不需要 `hugo new site`。

1. 站点没有 `go.mod` 时，用自己仓库的模块路径执行 `hugo mod init`；已经有的话保持不变。
1. 执行 `hugo mod get github.com/pgsty/oink@{{< param tdVersion.latest >}}`。
1. 在配置里把旧主题的引用换成 `module.imports` 下的 OINK 条目，无关的导入保持原样。再从[下方示例](#config)合并三项 `markup.goldmark` 设置与 `markup.highlight.noClasses: false`。只合并这几项，不要整份复制：示例是一个全新站点的完整配置，会冲掉你自己的设置。
1. 找出仍在沿用旧主题行为的地方：站点自己 `layouts/` 与 `assets/` 下的模板和资源、旧主题的短代码，以及 front matter 里的 `type`、`layout`。哪里坏了改哪里，内容不要动。
1. 执行 `hugo`，再用 `hugo server` 打开一篇有代表性的现有页面，检查导航、图片和代码块。确认无误后再开启可选的 OINK 功能，最后按[验证](#verify)收尾。
{.steps}

## 从空目录到第一页 {#scaffold}

下面四步得到一个单语站点，含一个 Docs 分区和一个页面。[Starter](/zh/docs/start/starter/) 给的东西多得多（三种语言、首页、Blog、Book 和部署 workflow），所以只有想自己决定每一个文件时，才从零开始。

1. ### 建骨架并获取主题 {#skeleton}

   ```bash
   hugo new site --format yaml my-docs
   cd my-docs
   git init
   hugo mod init github.com/example/my-docs
   hugo mod get github.com/pgsty/oink@{{< param tdVersion.latest >}}
   ```

   把 `github.com/example/my-docs` 换成你自己站点的模块路径，通常就是仓库地址。`hugo mod get` 会写出 `go.mod` 与 `go.sum`，两个都要提交，它们共同固定并校验主题版本。

   第一次构建之前就创建 `.gitignore`，生成文件才不会进入 Git：

   ```gitignore {title=".gitignore"}
   /public/
   /resources/
   /.hugo_build.lock
   /.hugo_cache/
   ```

   固定一个发布标签，不要跟踪 `main`，这样站点只在你主动升级时才变化。`{{< param tdVersion.latest >}}` 是本文档对应的版本，全部标签见 [GitHub Releases](https://github.com/pgsty/oink/releases)。

1. ### 写 `hugo.yml` {#config}

   把生成的 `hugo.yaml` 改名为 `hugo.yml`（本文档的示例都用这个文件名），再用下面的内容替换。Hugo 两个文件名都接受，但站点里只保留一份配置文件。已有站点只合并需要的设置。

   ```yaml {title="hugo.yml" collapse=30}
   title: Product Docs
   baseURL: https://docs.example.com/
   defaultContentLanguage: en
   # enableGitInfo: true        # 页面「最后修改」时间来自 git，完成首次 Git 提交后再打开

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

   # 三项 Goldmark 前置：OINK 的原生 Markdown 组件全靠它们
   markup:
     goldmark:
       renderer:
         unsafe: true # 允许内容里的行内 HTML
       parser:
         attribute:
           block: true # {.steps} {.cards} {caption=} 这类属性行
         wrapStandAloneImageWithinParagraph: false # 块级图片才能带属性行
     highlight:
       noClasses: false # 代码配色跟随深浅色模式

   params:
     offline_search: true
     github_repo: https://github.com/example/product-docs
     copyright:
       authors: '[Example Inc.](https://example.com/)'
       from_year: 2026
     ui:
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
     hugoVersion:
       min: '{{< param hugoMinVersion >}}'
   ```

   每一段管站点的不同部分：

   | 段 | 管什么 | 缺了会怎样 |
   | --- | --- | --- |
   | 顶层 + `languages` | 站名、地址、语言与顶部导航菜单 | `baseURL` 写错，生产环境里所有绝对链接都会指错 |
   | `markup.goldmark` | OINK 组件需要的三项设置 | 属性行会以 `{.steps}` 这样的原文出现在正文里 |
   | `params` | 搜索、仓库链接与外壳开关 | 交互功能保持关闭，主题不会替你打开 |
   | `outputs` | 每页的 `.md` 版本、`llms.txt` 与打印页 | 页面菜单里没有「复制 Markdown」，也没有打印视图 |
   | `module` | 主题导入与 Hugo 最低版本 | 构建时找不到主题 |

   写数学公式还需要 Goldmark 的 passthrough 扩展，见[公式](/zh/docs/components/math/)。每个键的含义与默认值见[配置总览](/zh/docs/customize/config/)。

1. ### 写第一页 {#first-page}

   `content/` 下的每个一级目录是一个分区，目录树就是侧栏。分区需要一个 `_index.md`，用来给出标题、描述和排序位置：

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

   从一开始就给每个标题写显式 `{#id}`：以后加译文时，两种语言的锚点自然一致。其余写法见[编写页面](/zh/docs/write/pages/)。

1. ### 预览 {#preview}

   ```bash
   hugo server
   ```

   打开 <http://localhost:1313/docs/>，Docs 分区里列出了 Install，每次保存页面预览都会随之更新。添加首页之前，站点根地址仍是空的，首页写法见[首页与落地页](/zh/docs/customize/home/)。
{.steps}

## 其它安装方式 {#install-methods}

Hugo Module 是默认方式，因为由 Hugo 自己解析版本、校验 checksum，并记录到 `go.sum`。另外三种方式各自对应特定的约束：网络无法访问 Go 模块代理、托管商要求主题文件就在仓库里、组织需要审查自己的主题副本。除 `hugo mod vendor` 外，它们都绕开 Go 模块体系：站点用 `theme: oink` 而不是 `module.imports` 引用主题，版本跟踪与完整性校验也就由你自己负责。

### 四种方式对比 {#comparison}

| 方式 | 需要 Go | 版本可审计 | 主题源码进你的仓库 | 适用 |
| --- | --- | --- | --- | --- |
| **Hugo Module** | 是 | `go.sum` 自动校验 | 否 | 默认推荐 |
| Git submodule | 否 | 仓库记录 commit | 以引用形式 | 需要主题源码在库内 |
| 离线归档 | 否 | 手工核对 checksum | 是 | 网络隔离 |
| 固定版本源码副本 | 否 | 记录标签与校验值 | 是 | 平台要求完整树 |

### Hugo Module（推荐） {#hugo-module}

```bash
hugo mod init github.com/example/product-docs
hugo mod get github.com/pgsty/oink@{{< param tdVersion.latest >}}
```

```yaml {title="hugo.yml"}
module:
  imports:
    - path: github.com/pgsty/oink
```

Starter 用的就是这种方式。`hugo mod graph` 查看实际解析的版本，`hugo mod get -u` 升级。每台构建站点的机器都需要安装 Go。

### Git submodule {#git-submodule}

站点仓库会记录主题的准确 commit：

```bash
git submodule add https://github.com/pgsty/oink.git themes/oink
git -C themes/oink fetch --tags
git -C themes/oink checkout {{< param tdVersion.latest >}}
git add .gitmodules themes/oink
```

```yaml {title="hugo.yml"}
theme: oink
```

CI 必须在运行 Hugo 之前初始化 submodule，否则 `themes/oink` 是空目录：

```bash
git submodule update --init --recursive
```

### 离线归档 {#offline-archive}

网络隔离环境中，先在联网机器上把主题准备好，再完整地搬进去。有两条路径。

**`hugo mod vendor`** 把已解析的主题固化进站点目录，之后的构建既不联网，也不需要 Go：

```bash
hugo mod vendor          # 生成 _vendor/，里面是主题的完整源码树
tar czf ../my-docs.tgz . # 把归档写到正在打包的目录之外
```

只要 `_vendor/` 存在，Hugo 就优先使用它（此时 `hugo mod graph` 输出 `+vendor`），`hugo.yml` 中的 `module.imports` 保持不变。只有 vendor 这一步需要 Go；升级主题时，回到联网机器重新执行 `hugo mod get` 与 `hugo mod vendor`。`_vendor/` 只包含主题挂载的目录（`assets`、`data`、`i18n`、`layouts`、`static`）以及 `hugo.yaml` 与 `theme.toml`，不含 `LICENSE`、`NOTICE` 和 `VENDOR.json`；要对外分发这份归档，请从主题仓库补上这三个文件。

**发布标签的源码归档** 完全不需要 Go 模块。下载该标签，解压到 `themes/oink/`：

```bash
curl -L -o oink.tar.gz \
  https://github.com/pgsty/oink/archive/refs/tags/{{< param tdVersion.latest >}}.tar.gz
mkdir -p themes/oink
tar xzf oink.tar.gz -C themes/oink --strip-components=1
```

```yaml {title="hugo.yml"}
theme: oink
```

主题仓库的根目录就是主题根目录，所以解压后 `layouts/`、`assets/`、`i18n/`、`static/` 直接位于 `themes/oink/` 下，没有多出来的一层目录。

要在机器之间搬运并做完整性校验，在联网一侧从不可变的标签生成归档和校验值：

```bash
git clone --branch {{< param tdVersion.latest >}} --depth 1 \
  https://github.com/pgsty/oink.git oink
git -C oink archive --format=tar.gz --prefix=oink/ \
  --output=../oink-{{< param tdVersion.latest >}}.tar.gz {{< param tdVersion.latest >}}
shasum -a 256 oink-{{< param tdVersion.latest >}}.tar.gz \
  > oink-{{< param tdVersion.latest >}}.tar.gz.sha256
```

把这两个文件一起带进隔离环境，先校验再解压：

```bash
shasum -a 256 -c oink-{{< param tdVersion.latest >}}.tar.gz.sha256
mkdir -p themes
tar -xzf oink-{{< param tdVersion.latest >}}.tar.gz -C themes
```

第一次离线构建之前，确认下面 11 项顶层文件与目录齐全。再分发主题时必须保留 `LICENSE`、`NOTICE` 与 `VENDOR.json`；`VENDOR.json` 记录了每个第三方运行时的版本、来源、许可证路径与 SHA-256，离线审计就以它为准。

```filetree {title="themes/oink/"}
- oink/
  - go.mod              # 模块路径声明，Hugo Module 方式解析用
  - hugo.yaml           # 主题默认参数与 Hugo 版本下限
  - theme.toml          # 主题元数据，theme: oink 方式需要
  - LICENSE             # Apache-2.0
  - NOTICE              # 上游署名，再分发时必须保留
  - VENDOR.json         # 第三方运行时清单：版本、来源、许可证路径、SHA-256
  - assets/             # 样式表、JS 与随主题分发的第三方运行时
  - layouts/            # 模板、partial、shortcode、render hook
  - static/             # 字体文件，原样发布
  - i18n/               # 32 份界面语言文件
  - data/               # 页尾出处行用的 SPDX 许可证表
```

此外不需要再下载任何东西。Bootstrap、Font Awesome、字体以及搜索和图表运行时全部随主题分发，站点不需要 `node_modules`、PostCSS、RTLCSS，也不需要 CDN。那些为 Docsy 站点安装 npm 包的教程描述的是 Docsy 自己的构建流程，不适用于 OINK。

### 固定版本源码副本 {#pinned-clone}

托管商要求站点仓库里包含主题文件时，按[上文](#offline-archive)准备标签归档，解压到 `themes/oink/`，配置 `theme: oink`，再把这些文件连同已校验的标签与校验值记录一起提交。

不要把主题 `git clone` 到 `themes/oink` 后直接提交：嵌套的 `.git` 目录会让 Git 只记录一个指向 commit 的链接，而不是文件本身，仓库里其实并没有主题。想用引用的方式跟踪主题，请使用 [submodule](#git-submodule)。

## 用本地主题 checkout 开发 {#local-theme-checkout}

只有同时修改主题和站点时才需要这一节。把两个仓库克隆到同级目录：

```text {title="同级目录布局" copy=false}
~/pgsty/
├── oink/            # 主题
└── product-docs/    # 你的站点
```

`HUGO_MODULE_REPLACEMENTS` 只对当前这条命令把 Hugo 指向本地 checkout，`go.mod` 保持不变：

```bash
cd ~/pgsty/product-docs
HUGO_MODULE_REPLACEMENTS='github.com/pgsty/oink -> ../oink' hugo server
```

由 Starter 创建的站点已经把它封装成 `make dev`（checkout 不在 `../oink` 时设置 `THEME_DIR`），而 `make serve` 与 `make build` 仍然使用已发布的版本。Go workspace（`go work init` 加 `HUGO_MODULE_WORKSPACE=go.work`）能起到同样的作用。

两种做法都只影响你的本机，CI 与生产构建使用的始终是 `go.mod` 里的版本。不要提交 `go.work`，因为其中的路径只存在于你的机器上。要确认一次构建实际用的是哪个版本，见[同时开发主题](/zh/docs/admin/preview/#theme-workspace)。

## 验证 {#verify}

```bash
hugo mod graph                                       # 主题实际解析到哪一版
hugo --gc --minify --printPathWarnings
```

构建以 `Total in …` 结束，且没有出乎意料的 `WARN` 或 `ERROR`，即为通过。然后检查：

- `/docs/` 能打开，侧栏里有你写的页面。
- 顶部导航栏的搜索框能搜到这一页里的标题。
- 切换深浅色时代码块配色也跟着变，说明 `markup.highlight.noClasses: false` 已经生效。
- `git status --short` 只列出源文件。Hugo Module 方式下其中包括 `go.mod` 与 `go.sum`；其它方式下则是主题文件或 submodule 记录。

## 相关 {#related}

- [快速上手](/zh/docs/start/) — 在 Starter、既有 Hugo 站点与迁移之间选择
- [OINK Starter](/zh/docs/start/starter/) — 新站点的推荐路径
- [Starter 仓库导览](/zh/docs/start/anatomy/) — 模板中每个文件的职责
- [配置总览](/zh/docs/customize/config/) — `hugo.yml` 每个键的含义与默认值
- [编写页面](/zh/docs/write/pages/) — 第一页之后怎么继续写
- [版本升级](/zh/docs/admin/upgrade/) — 升级主题模块、从 Docsy 迁移
