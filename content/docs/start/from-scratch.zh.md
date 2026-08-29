---
title: 从零建站与其它安装方式
linkTitle: 从零建站
description: 从空目录搭一个最小 OINK 站点，以及 Module / submodule / 离线归档 / 克隆四种安装方式的取舍。
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

这是推荐路径 [OINK Starter](/zh/docs/start/starter/) 的手工替代方案。本页从空目录
搭建一个最小 OINK 站点：一份精简 `hugo.yml` 加一条 `hugo mod get`，得到一个可预览
的单语站点。代价是首页、示例内容、部署 workflow 与每种组件用法都要自己组装。

已有 Hugo 站点时不需要脚手架：装上主题模块，再补三项 goldmark 前置配置（见[写 `hugo.yml`](#config)），正文不用重写。已有 Docsy 站点见[版本升级](/zh/docs/admin/upgrade/)。

后半部分是四种安装方式的取舍：Hugo Module、Git submodule、离线归档、固定版本克隆。
当前 v1.0.0 发布路径应使用 Go 1.27 与 Hugo Extended 0.165.0；只有刻意维护旧环境的
既有站点才使用主题声明的较低兼容下限。

## 从空目录到第一页 {#scaffold}

1. ### 建骨架并获取主题 {#skeleton}

   ```bash
   hugo new site --format yaml my-docs
   cd my-docs
   hugo mod init github.com/example/my-docs
   hugo mod get github.com/pgsty/oink@{{< param tdVersion.latest >}}
   ```

   `hugo mod init` 后面跟的是你自己站点的模块路径，通常就是仓库地址。`hugo mod get` 会写出 `go.mod` 与 `go.sum`，两个都要提交。

   最新版本号在 [GitHub Releases](https://github.com/pgsty/oink/releases)；本页出现的 `{{< param tdVersion.latest >}}` 是本站当前固定的版本。生产站点固定到发布标签，不要跟随 `main`：`@latest` 是一次性解析动作，不是版本策略。

1. ### 写 `hugo.yml` {#config}

   把 `hugo new site` 生成的 `hugo.yaml` 改名为 `hugo.yml`（两个后缀 Hugo 都接受，本文统一用后者），内容替换为下面这份，可直接构建：

   ```yaml {title="hugo.yml" collapse=30}
   title: Product Docs
   baseURL: https://docs.example.com/
   defaultContentLanguage: en
   # enableGitInfo: true        # 页面「最后修改」时间来自 git，先 git init 再打开

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
       extended: true
       min: '{{< param hugoMinVersion >}}'
   ```

   五段分别管什么：

   | 段 | 管什么 | 少了会怎样 |
   | --- | --- | --- |
   | 顶层 + `languages` | 站名、域名、语言与顶栏菜单 | `baseURL` 不对，线上所有绝对链接指错 |
   | `markup.goldmark` | 三项组件前置 | 属性行变成正文里的一行 `{.steps}` |
   | `params` | 搜索、仓库链接、外壳开关 | 交互功能默认关闭，主题不替站点决定 |
   | `outputs` | 每页的 `.md`、`llms.txt`、打印页 | 页面菜单里没有「复制 Markdown」，也没有打印视图 |
   | `module` | 引用主题、声明 Hugo 下限 | 构建时找不到主题 |

   写公式还需要 Goldmark 的 passthrough 扩展，见[公式](/zh/docs/components/math/)。每个键的完整含义与默认值见[配置总览](/zh/docs/customize/config/)。

1. ### 写第一页 {#first-page}

   `content/` 下的每个一级目录是一个分区，目录结构就是侧栏结构。文档分区至少要有一个 `_index.md`：

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

   标题写显式 `{#id}`：后续加译文时两种语言的锚点才能对应。页面写法见[编写页面](/zh/docs/write/pages/)。

1. ### 预览 {#preview}

   ```bash
   hugo server
   ```

   打开 <http://localhost:1313/>，侧栏里有 Docs → Install。修改文件是毫秒级热重载。
{.steps}

## 其它安装方式 {#install-methods}

上面用的是 Hugo Module。另外三种方式面向特定约束：网络隔离、平台要求构建输入包含完整主题树、组织内部需要评审主题副本。除 `hugo mod vendor` 之外，它们都不建立 Go 模块，站点用 `theme: oink` 而不是 `module.imports` 引用主题；共同的代价是版本解析与完整性校验由你自己负责。

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

唯一能让 Hugo 自己解析版本、校验 checksum、并在 `go.sum` 里留下审计记录的方式。`hugo mod graph` 看实际解析结果，`hugo mod get -u` 升级。需要本机有 Go。

### Git submodule {#git-submodule}

在站点仓库里记录准确的主题 commit：

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

网络隔离环境使用。两条路径，都先在联网机器上准备，再整体搬入。

**用 `hugo mod vendor`**：把已解析的主题源码固化进站点目录，之后构建既不联网也不需要 Go。

```bash
hugo mod vendor          # 生成 _vendor/，里面是主题的完整源码树
tar czf my-docs.tgz .    # 连 _vendor/ 一起搬进隔离环境
```

`_vendor/` 存在时 Hugo 优先使用它（`hugo mod graph` 输出 `+vendor`），`hugo.yml` 里的 `module.imports` 保持不变。这一步需要 Go，之后的构建不需要。升级主题要回到联网环境重新执行 `hugo mod get` 与 `hugo mod vendor`。

`_vendor/` 只收主题挂载出来的目录（`assets` `data` `i18n` `layouts` `static`）以及 `hugo.yaml` 与 `theme.toml`，不含 `LICENSE`、`NOTICE` 与 `VENDOR.json`。要对外分发这份归档，把这三个文件从主题仓库一并取来。

**用 tag 源码归档**：不建 Go 模块，直接把某个版本的主题解压到 `themes/oink/`。

```bash
curl -L -o oink.tar.gz \
  https://github.com/pgsty/oink/archive/refs/tags/{{< param tdVersion.latest >}}.tar.gz
mkdir -p themes/oink
tar xzf oink.tar.gz -C themes/oink --strip-components=1
```

```yaml {title="hugo.yml"}
theme: oink
```

主题仓库的根目录就是模块根目录，解压出来直接是 `layouts/`、`assets/`、`i18n/`、`static/` 这一层，不需要再进入下一级。重新分发时必须保留 `LICENSE`、`NOTICE` 与 `VENDOR.json`。最后一个记录了每个第三方运行时的版本、来源、许可证路径与 SHA-256，是离线审计的依据。

跨机器传输时，在联网侧从不可变标签生成归档与校验值：

```bash
git clone --branch {{< param tdVersion.latest >}} --depth 1 \
  https://github.com/pgsty/oink.git oink
git -C oink archive --format=tar.gz --prefix=oink/ \
  --output=../oink-{{< param tdVersion.latest >}}.tar.gz {{< param tdVersion.latest >}}
shasum -a 256 oink-{{< param tdVersion.latest >}}.tar.gz \
  > oink-{{< param tdVersion.latest >}}.tar.gz.sha256
```

把归档与 `.sha256` 一起传入隔离环境，先校验再解压：

```bash
shasum -a 256 -c oink-{{< param tdVersion.latest >}}.tar.gz.sha256
mkdir -p themes
tar -xzf oink-{{< param tdVersion.latest >}}.tar.gz -C themes
```

这样得到的归档是自建产物，不是项目发行物。某个标签的发行页面是否附带归档与校验文件按发布而定，使用公开附件时独立验证其校验值。

断网构建之前确认归档内容完整，这十一项都要在：

```filetree {title="themes/oink/"}
- oink/
  - go.mod              # 模块路径声明，Hugo Module 方式解析用
  - hugo.yaml           # 主题默认参数与 Hugo 版本下限
  - theme.toml          # 主题元数据，theme: oink 方式需要
  - LICENSE             # Apache-2.0
  - NOTICE              # 上游署名，再分发时必须保留
  - VENDOR.json         # 第三方运行时清单：版本、来源、许可证路径、SHA-256
  - assets/             # SCSS、JS 与随主题分发的第三方运行时
  - layouts/            # 模板、partial、shortcode、render hook
  - static/             # 字体文件，原样发布
  - i18n/               # 32 份界面语言文件
  - data/               # 页尾出处行用的 SPDX 许可证表
```

### 固定版本克隆 {#pinned-clone}

托管平台要求构建输入包含完整主题树时用：

```bash
git clone https://github.com/pgsty/oink.git themes/oink
git -C themes/oink checkout {{< param tdVersion.latest >}}
```

与 submodule 的区别是主题文件直接进入你的仓库历史，没有 `.gitmodules` 这层间接。记录最终解析出的 commit 与恢复流程。

### 四种方式对比 {#comparison}

| 方式 | 需要 Go | 版本可审计 | 主题源码进你的仓库 | 适用 |
| --- | --- | --- | --- | --- |
| **Hugo Module** | 是 | `go.sum` 自动校验 | 否 | 默认推荐 |
| Git submodule | 否 | 仓库记录 commit | 以引用形式 | 需要主题源码在库内 |
| 离线归档 | 否 | 手工核对 checksum | 是 | 网络隔离 |
| 固定版本克隆 | 否 | 需自行记录 | 是 | 平台要求完整树 |

> [!TIP] 消费站点不需要前端工具链
> Bootstrap、Font Awesome、字体、搜索与图表运行时全部随主题分发。站点不需要 `node_modules`、PostCSS、RTLCSS，也不需要 CDN。为 Docsy 站点安装 npm 依赖的教程属于上游 Docsy 的流程，不适用于 OINK。

## 用本地主题 checkout 开发 {#local-theme-checkout}

同时修改主题与站点时才需要这一节。把两个仓库克隆为同级目录：

```text {title="同级目录布局" copy=false}
~/pgsty/
├── oink/            # 主题
└── product-docs/    # 你的站点
```

用环境变量 `HUGO_MODULE_REPLACEMENTS` 把模块临时替换为本地 checkout，`go.mod` 不变：

```bash
cd ~/pgsty/product-docs
HUGO_MODULE_REPLACEMENTS='github.com/pgsty/oink -> ../oink' hugo server
```

文档站仓库的 `Makefile` 就是这几条命令的别名，`make dev` 与 `make check` 要求主题 checkout 在同级目录 `../oink`：

```makefile {title="Makefile：文档站里的写法"}
build:
	hugo --cleanDestinationDir --minify

check:
	HUGO_MODULE_REPLACEMENTS='github.com/pgsty/oink -> $(abspath ../oink)' npm test

dev:
	HUGO_MODULE_REPLACEMENTS='github.com/pgsty/oink -> $(abspath ../oink)' hugo server --renderToMemory
```

Go workspace（`go work init` + `HUGO_MODULE_WORKSPACE=go.work`）是等价的另一种做法。两种做法都只作用于本机：CI 与生产构建用的是 `go.mod` 里的版本，`go.work` 不要提交。

## 验证 {#verify}

```bash
hugo mod graph                                       # 主题实际解析到哪一版
hugo --gc --minify --printPathWarnings --panicOnWarning
```

构建以 `Total in …` 结束、没有 `WARN` / `ERROR` 即通过。再确认：

- `/docs/` 打得开，侧栏里有你写的页面
- 顶栏有搜索框，搜得到刚写的标题
- 深浅色切换按钮在，切换后代码块配色跟着变（说明 `markup.highlight.noClasses: false` 生效）
- `git status` 里有 `go.mod` 与 `go.sum`，没有 `public/`、`resources/`

## 相关 {#related}

- [快速上手](/zh/docs/start/) — 在 Starter、既有 Hugo 站点与迁移之间选择
- [OINK Starter](/zh/docs/start/starter/) — 推荐的新站点路径
- [Starter 仓库导览](/zh/docs/start/anatomy/) — 模板各目录的职责
- [配置总览](/zh/docs/customize/config/) — `hugo.yml` 每个键的含义与默认值
- [编写页面](/zh/docs/write/pages/) — 第一页之后怎么继续写
- [版本升级](/zh/docs/admin/upgrade/) — 升级主题模块、从 Docsy 迁移
