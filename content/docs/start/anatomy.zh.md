---
title: 仓库导览
linkTitle: 仓库导览
description: 克隆下来的每个目录是什么：哪些必须保留、哪些替换为你的信息、哪些是文档站自用可以整个删除。
weight: 10
search_keywords:
  [
    仓库结构,
    目录结构,
    导览,
    anatomy,
    repository tour,
    hugo.yml,
    content,
    static,
    layouts,
    data,
    删除,
  ]
aliases:
  - /docs/about/architecture/
---

本页逐项说明 `pgsty/oink.pgsty.com` 克隆下来的每个文件与目录：哪些必须保留、哪些替换为你自己的信息、哪些是文档站自用可以整棵删除，并给出一个安全的删除顺序。

主题代码不在这个仓库里：它是 `go.mod` 固定的一个 Hugo Module，存放在 Go 的模块缓存中。这个仓库只有内容、配置与站点自己的少量覆盖。

## 顶层结构 {#layout}

```filetree {title="克隆下来的 my-docs/"}
- my-docs/
  - hugo.yml                # 站点唯一配置：身份、语言、菜单、参数、模块导入
  - go.mod                  # 固定主题版本
  - go.sum                  # 主题模块的校验和
  - content/                # 全部内容，目录结构就是侧栏结构
    - _index.md             # 首页；_index.zh.md 是它的中文对等页
    - search.md             # Google 自定义搜索的结果页，用不到可删
    - docs/                 # 文档树：OINK 自己的主题文档
    - blog/                 # 博客：工程记录与版本发布
  - assets/                 # 要经 Hugo 处理的资源
    - scss/                 # 站点样式覆盖，三个 partial
    - images/               # 需要缩放裁切的图片
    - parts/                # include shortcode 引入的 Markdown 与 YAML 片段
  - static/                 # 原样复制到站点根，不做处理
    - logo.svg              # 品牌组合标，没有参数指向它
    - favicon.svg           # 浏览器标签页图标
    - favicon.ico
    - apple-touch-icon.png  # iOS 添加到主屏
    - images/               # 截图与示意图
  - layouts/                # 站点模板覆盖：只覆盖最窄的那一个
    - _shortcodes/          # 站点自己的 shortcode
  - data/                   # 数据驱动的页面
    - home/                 # 首页分区：en.yaml / zh.yaml
    - landing/              # Landing 页数据
    - download/             # 发布与下载页数据
  - .github/
    - workflows/            # pages.yml 部署；另外两个是本站回归测试
  - tests/                  # 文档站自用：Playwright、goldens、构建断言  {open=false tone=warning}
    - browser/              # Playwright 规格
    - hugo-build/           # 构建断言
    - md-output/            # Markdown 输出 goldens
    - alt-site/             # 备用配置构建
    - favicons/
    - release-pin/
    - fixtures/
  - scripts/                # 文档站自用：翻译对等与链接检查  {open=false tone=warning}
    - check-doc-translations.mjs
    - check-markdown-style.mjs
    - check-rendered-links.mjs
    - check-rendered-markdown.mjs
    - check-release-pin.mjs
  - Makefile                # build / serve 直接调 Hugo；dev / check 指向同级 ../oink
  - package.json            # 测试工具链，站点构建用不到
  - package-lock.json
  - playwright.config.mjs
  - agent-docs.config.yml   # Agent 文档评分工具的配置
  - AGENTS.md               # 给编码 Agent 的仓库说明
  - TRANSLATION.md          # 双语翻译流程
  - CONTRIBUTING.md
  - README.md
  - LICENSE                 # Apache-2.0，站点代码
  - LICENSE-CC-BY-4.0       # 内容许可
  - NOTICE
```

上面没有列出的还有 `.gitignore`、`.gitattributes`、`.nvmrc`、`.npmrc`，以及被 `.gitignore` 排除的生成物：`public/`（构建产物）、`resources/`（Hugo 资源缓存）、`node_modules/`。后一组不进版本库。

仓库里没有 `i18n/`：界面文字（「上一页」「本页目录」这类）由主题的 32 份语言文件提供。要改其中某一句，在站点根目录建 `i18n/zh.yaml`，只写需要覆盖的键。

## 各项的处理方式 {#what-to-keep}
| 路径 | 是什么 | fork 后怎么处理 |
| --- | --- | --- |
| `hugo.yml` | 站点的唯一配置文件，没有 `config/` 目录也没有分环境覆盖 | 替换为你的信息：身份、语言、菜单、品牌 |
| `go.mod` `go.sum` | 固定主题版本并记录校验和 | 必须保留，一起提交 |
| `content/` | 全部内容；目录结构决定侧栏结构 | 必须保留；里面的 `docs/`、`blog/` 换成你自己的 |
| `content/search.md` | `layout: search` 的整页搜索结果，只在配了 Google 自定义搜索（`params.gcs_engine_id`）时才有内容 | 用主题自带的本地搜索时可以删 |
| `assets/scss/` | 站点样式覆盖（`_variables_project.scss` 等） | 要改配色字体就保留，不改可以清空 |
| `assets/images/` | 需要 Hugo 处理（缩放、裁切）的图片 | 换成你自己的 |
| `assets/parts/` | `include` shortcode 引入的片段 | 随引用它的页面一起替换或删除 |
| `static/` | 原样复制到站点根 | 替换为你的：logo、favicon、截图 |
| `layouts/_shortcodes/` | 本站自己的四个 shortcode，当前内容里已无引用 | 可删 |
| `data/home/` | 首页分区数据（Hero、能力面板） | 改成你的；删除后首页退回普通页面 |
| `data/landing/` `data/download/` | Landing 页与发布下载页的数据 | 用不到就删 |
| `.github/workflows/pages.yml` | 推到 `main` 就构建并发布到 GitHub Pages | 保留，按你的仓库改 |
| `.github/workflows/site-checks.yml` `browser-quality.yml` | 本站的回归测试流水线 | 文档站自用，可删 |
| `tests/` `scripts/` `playwright.config.mjs` `package.json` `package-lock.json` | 本站的回归测试与检查工具链 | 文档站自用，可删 |
| `Makefile` | 主题与站点共同开发的快捷方式（要求同级有 `../oink`） | 文档站自用，可删 |
| `AGENTS.md` `TRANSLATION.md` `CONTRIBUTING.md` `agent-docs.config.yml` | 本站的协作约定 | 换成你自己的，或删 |
| `README.md` `LICENSE` `LICENSE-CC-BY-4.0` `NOTICE` | 说明与许可 | 换成你自己的 |
| `.nvmrc` `.npmrc` | Node 版本与 npm 配置 | 随 `package.json` 一起删 |

> [!NOTE] 用 OINK 建站不需要 Node.js
> 这个仓库里的 `package.json`、`tests/`、`scripts/` 用于维护文档站本身。你的站点构建只有一条命令：`hugo --gc --minify`。

## 删除顺序 {#deletion-order}

顺序是先删外围、再删内容、最后清数据。每删一步构建一次，出问题时能定位到具体步骤。

1. ### 删脚手架 {#drop-scaffolding}

   这一批与站点渲染无关，删除后不影响任何页面。

   ```bash
   rm -rf tests scripts node_modules
   rm -f package.json package-lock.json playwright.config.mjs .nvmrc .npmrc
   rm -f AGENTS.md TRANSLATION.md CONTRIBUTING.md agent-docs.config.yml Makefile
   rm -f .github/workflows/site-checks.yml .github/workflows/browser-quality.yml
   ```

   删除 `scripts/` 之后必须改 `.github/workflows/pages.yml`：把 `Set up Node.js` 与 `Verify advertised and pinned release match` 两步删掉，否则部署会在该步骤失败。

1. ### 删示例内容 {#drop-example-content}

   `content/docs/` 是 OINK 自己的主题文档，`content/blog/` 是它的工程博客，与你的产品无关。

   ```bash
   rm -rf content/docs
   mkdir -p content/docs
   rm -rf content/blog        # 不要博客的话；要的话只留一篇当模板
   ```

   同时改 `hugo.yml` 里每种语言下的 `menus.main`：那些菜单项指向 `/docs/tutorial`、`/blog/release` 这些已不存在的路径。`content/_index.md` 是首页，保留它，把正文换成你的。

1. ### 清数据 {#trim-data}

   `data/` 下三组数据分别供首页、Landing 页与发布页使用。首页数据保留后修改，另外两组用不到就删除。

   ```bash
   rm -rf data/landing data/download
   ```

   `data/home/en.yaml` 与 `data/home/zh.yaml` 决定首页有哪些分区，逐项含义见[首页与落地页](/zh/docs/customize/home/)。删除整个 `data/home/` 也能构建，首页退回为普通内容页。

1. ### 换身份 {#swap-identity}

   最后把 `hugo.yml` 里的站名、`params.productionURL`、`params.github_repo` 与品牌参数换成你的，替换 `static/` 下的 logo 与 favicon，删掉 `services.googleAnalytics`、`params.comments` 与 `params.version*` 这些 OINK 专用配置。逐条清单见[十分钟上手](/zh/docs/start/)第 3 步。
{.steps}

## 主题的位置 {#where-the-theme-is}
主题以 Hugo Module 的形式引用，两处配置指向它：

```yaml {title="hugo.yml"}
module:
  imports:
    - path: github.com/pgsty/oink
  hugoVersion:
    extended: true
    min: '{{< param hugoMinVersion >}}'
```

```go-mod {title="go.mod"}
require github.com/pgsty/oink {{< param tdVersion.latest >}}
```

`hugo.yml` 声明使用哪个主题，`go.mod` 固定用它的哪一版，`go.sum` 记录该版本的校验和。三个文件都要提交。主题源码不进你的仓库：Hugo 把它下载到 Go 的模块缓存，`hugo mod graph` 显示实际解析结果。

升级到最新版：

```bash
hugo mod get -u github.com/pgsty/oink
```

固定到某一个版本：

```bash
hugo mod get github.com/pgsty/oink@{{< param tdVersion.latest >}}
```

两条命令都会改写 `go.mod` 与 `go.sum`。生产站点固定到发布标签，不要跟随 `main`。升级前后检查什么、如何回滚，见[版本升级](/zh/docs/admin/upgrade/)。

## 站点覆盖 {#site-overrides}
`layouts/` 下的文件按 Hugo 的模板查找顺序盖过主题里的同名文件。本站只放了一类：

- `layouts/_shortcodes/*.html`：站点自己的 shortcode。产品文档需要带业务语义的 shortcode 时也放这里。

标题自链锚点由主题的 `_markup/render-heading.html` 提供，站点不需要自己建这个钩子。

要改外壳（侧栏、页脚、页尾）时，覆盖最窄的那个 partial，不要整份复制 `baseof.html`：复制之后每次主题升级都要手工合并。

## 验证 {#verify}

每删一步运行一次构建，报错能定位到刚删除的内容：

```bash
hugo --gc --minify --printPathWarnings --panicOnWarning
```

删除完成后，这几条应当成立：

- 构建以 `Total in …` 结束，没有 `WARN` / `ERROR`
- 顶栏菜单没有指向已删目录的死链
- 标题右侧仍然有自链锚点（主题自带的标题渲染钩子，站点不需要覆盖）
- `git status` 里没有 `public/`、`resources/`

## 相关 {#related}

- [十分钟上手](/zh/docs/start/) — 克隆、改配置、部署的完整流程
- [从零建站与其它安装方式](/zh/docs/start/from-scratch/) — 从空目录搭建，不做删减
- [组织内容](/zh/docs/write/organize/) — `content/` 的目录结构怎么变成侧栏
- [配置总览](/zh/docs/customize/config/) — `hugo.yml` 每个键的含义与默认值
- [版本升级](/zh/docs/admin/upgrade/) — 升级主题模块与迁移工具
