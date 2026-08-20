---
title: 十分钟上手
linkTitle: 快速上手
description: 克隆 OINK 文档站，本地预览，替换站点信息，部署到 GitHub Pages。
weight: 20
icon: fa-solid fa-rocket
no_list: true
search_keywords:
  [
    快速上手,
    上手,
    安装,
    克隆,
    Quick start,
    Get started,
    hugo server,
    GitHub Pages,
    fork,
  ]
cascade:
  categories: [快速上手]
aliases:
  - /docs/tutorial/
  - /docs/tutorial/prerequisites/
  - /docs/tutorial/project-site/
---

这条路径不从空目录开始，而是克隆你正在读的这个站点，删掉不需要的部分，再替换成你自己的信息。本站是 OINK 的回归站，包含每个组件与每种页面类型，并与主题保持同版本；从它开始删减，比从空目录逐项补配置与示例少写很多。

前提：一台能安装 Hugo Extended 与 Go 的机器、一个 GitHub 账号、十分钟。不需要 Node.js，也不需要其它前端工具链。

## 结果 {#what-you-get}

完成后得到一个双语文档站：左侧栏是你的目录树，右侧是本页目录，顶栏有全文搜索与命令面板，深浅色跟随系统；一份 Markdown 同时产出网页、打印页、纯 Markdown 与 RSS；托管在 GitHub Pages 上。

![内容、配置与主题在构建期汇成一个静态站点的示意图](/images/hero-light.webp)
{width="720" height="480" caption="一份内容，四种输出：HTML、打印、Markdown、RSS"}

## 步骤 {#walkthrough}

1. ### 安装 Hugo Extended 与 Go {#install-tools}

   除 Git 之外需要两样。Hugo Extended 必须是 `{{< param hugoMinVersion >}}` 或更高版本：标准版 Hugo 没有内置 Sass 编译器，编译不了主题样式，构建失败。Go 用于解析模块：OINK 以 Hugo Module 发布，Hugo 通过 Go 的模块机制下载并校验 `github.com/pgsty/oink`。

   ```bash {tab="macOS" group="os" value="macos"}
   brew install hugo go git
   ```

   ```bash {tab="Linux" value="linux"}
   # 发行版仓库里的 Hugo 往往过旧，改用官方 deb 包（本站 CI 也是如此）
   curl -LO https://github.com/gohugoio/hugo/releases/download/v0.164.0/hugo_extended_0.164.0_linux-amd64.deb
   sudo dpkg -i hugo_extended_0.164.0_linux-amd64.deb
   sudo apt install -y golang-go git
   ```

   ```powershell {tab="Windows" value="windows"}
   winget install Hugo.Hugo.Extended
   winget install GoLang.Go
   winget install Git.Git
   ```

   安装完成后核对一次，输出里必须出现 `extended`：

   ```console
   $ hugo version
   hugo v0.164.0+extended+withdeploy darwin/arm64 BuildDate=2026-07-06T16:39:30Z
   $ go version
   go version go1.26.6 darwin/arm64
   ```

   其它平台按 [Hugo 安装指南](https://gohugo.io/installation/) 与 [go.dev/dl](https://go.dev/dl/) 安装，注意选 extended 版本。

1. ### 克隆文档站并预览 {#clone-and-preview}

   ```bash
   git clone https://github.com/pgsty/oink.pgsty.com my-docs
   cd my-docs
   hugo server
   ```

   打开 <http://localhost:1313/>，中文站在 <http://localhost:1313/zh/>。第一次启动会下载主题模块（几秒到一分钟，取决于网络），之后修改文件是毫秒级热重载。

   已提交的 `go.mod` 固定了主题版本，克隆之后即可构建，不需要额外的安装脚本。

   > [!NOTE]
   > 仓库里的 `Makefile` 只是几条命令的别名。`make dev` 与 `make check` 通过 `HUGO_MODULE_REPLACEMENTS` 使用同级的 `../oink` 主题 checkout；`make build` 与 `make serve` 始终使用 `go.mod` 固定的公开版本。新站点用 `hugo server` 即可。

1. ### 替换站点信息 {#make-it-yours}

   **站点身份**：全部在 `hugo.yml` 里。`baseURL` 用的是 YAML 锚点，实际地址写在 `params.productionURL` 上，只改这一处：

   ```yaml {title="hugo.yml"}
   title: Product Docs # 顶栏站名与 <title>

   params:
     productionURL: &productionURL https://docs.example.com/
     github_repo: https://github.com/example/product-docs # 「编辑当前页面」指向哪
     copyright:
       authors: '[Example Inc.](https://example.com/)'
       from_year: 2026
     footer_center_info: ''

   baseURL: *productionURL
   ```

   `languages.en.title` 与 `languages.zh.title` 会覆盖顶层 `title`，两处一起改。参数逐项的含义与默认值见[配置总览](/zh/docs/customize/config/)。

   **删掉本站专用的配置**：保留它们会让你的站点指向 OINK 的仓库与账号。

   | `hugo.yml` 里的键 | 怎么处理 |
   | --- | --- |
   | `services.googleAnalytics.id` | OINK 的统计 ID，删掉；需要统计时换成你自己的 |
   | `params.comments` | giscus 指向 `pgsty/oink.pgsty.com` 的讨论区，整段删掉或换成你的仓库 |
   | `params.tdVersion` `params.version` `params.version_menu` `params.versions` | OINK 的版本菜单，删掉 |
   | `params.github_project_repo` | 主题仓库链接，删掉 |
   | `languages.<lang>.menus.main` | 顶栏菜单指向 `/docs/tutorial` 这类本站栏目，按你的目录重写 |

   **换 Logo 与图标**：替换这三个文件，文件名保持不变，主题按文件名挂载：

   ```text {title="static/" copy=false}
   static/favicon.svg           # 浏览器标签页图标
   static/favicon.ico
   static/apple-touch-icon.png  # iOS 添加到主屏
   ```

   `static/logo.svg` 是本站自己的品牌组合标，没有参数指向它：删掉，或者换成你的横向字标再设 `params.wordmark`。

   **替换内容**：`content/docs/` 是 OINK 自己的主题文档，整棵删除，写你自己的第一页：

   ```bash
   rm -rf content/docs && mkdir -p content/docs
   ```

   ```markdown {title="content/docs/_index.md"}
   ---
   title: Docs
   linkTitle: Docs
   description: Product documentation.
   weight: 20
   ---

   Everything about running Product in production.
   ```

   `content/blog/` 可以留一篇当模板，也可以整个目录删除（删除后把 `menus.main` 里的 `blog` 项一并删掉）。哪些目录必须保留、哪些是文档站自用，见[仓库导览](/zh/docs/start/anatomy/)。

   **只做英文站**：删除 `languages.zh` 整段与所有 `.zh.md` 文件，`languages` 缩成一段：

   ```yaml {title="hugo.yml"}
   defaultContentLanguage: en
   languages:
     en:
       label: English
       locale: en-US
       weight: 1
       title: Product Docs
       menus:
         main:
           - { name: Docs, pageRef: /docs, weight: 20 }
   ```

   ```bash
   find content -name '*.zh.md' -delete
   ```

   保留双语或换成其它语言对，见[多语言](/zh/docs/customize/i18n/)。

1. ### 部署 {#publish}

   在 GitHub 上新建一个空仓库，把本地历史换成你自己的：

   ```bash
   rm -rf .git && git init -b main
   git add . && git commit -m "Initial documentation site"
   git remote add origin git@github.com:example/product-docs.git
   git push -u origin main
   ```

   仓库自带 `.github/workflows/pages.yml`：推到 `main` 分支即构建并发布，也可以在 Actions 页面手动触发（`workflow_dispatch`）。它固定 Hugo Extended 与 Go 的版本，用 `--printPathWarnings --panicOnWarning` 构建，`baseURL` 由 GitHub Pages 提供，因此发布到 `example.github.io/product-docs/` 这类子路径也不必改配置。

   在仓库的 Settings → Pages → Build and deployment → Source 选 **GitHub Actions**。默认值是 `Deploy from a branch`，不改这一项 workflow 会在部署步骤失败。

   > [!IMPORTANT] 删除 `scripts/` 后要改 workflow
   > `pages.yml` 中的 `Verify advertised and pinned release match` 一步运行 `node scripts/check-release-pin.mjs`，校验站点公告的版本与 `go.mod` 固定的版本一致。删掉 `scripts/` 之后，把这一步与 `Set up Node.js` 一并从 `pages.yml` 移除。

   Cloudflare Pages、Netlify、Nginx 与离线打包见[发布上线](/zh/docs/admin/deploy/)：构建命令都是 `hugo --gc --minify`，区别只在 `baseURL` 与环境变量。
{.steps}

## 验证 {#verify}

本地运行一次生产构建。它比开发服务器严格，路径告警会让构建失败：

```bash
hugo --gc --minify --printPathWarnings --panicOnWarning
```

输出 `Total in …` 且没有 `WARN` / `ERROR` 即通过。再对照预览核对：

- 顶栏是你的站名与 Logo，浏览器标签页是你的 favicon
- 侧栏是你自己的目录树，每页都能打开
- 按 {{< kbd "Ctrl" "K" >}}（macOS 上是 {{< kbd "⌘" "K" >}}）打开命令面板，能搜到刚写的页面
- 页面标题右侧的菜单里，「编辑当前页面」指向你自己的仓库，不是 `pgsty/oink.pgsty.com`
- 部署后 GitHub 仓库 Actions 页面里的 `Deploy Oink site to GitHub Pages` 是绿的

构建报错见[排错与检查](/zh/docs/admin/troubleshooting/)。

## 下一步 {#next-steps}

- [仓库导览](/zh/docs/start/anatomy/) — 克隆下来的每个目录是什么，哪些可以删。
- [编写页面](/zh/docs/write/pages/) — 一页文档的组成：front matter、标题锚点、链接与图片。
- [组件总览](/zh/docs/components/) — 提示块、标签页、参数表、文件树等，每个组件一页。
- [品牌外观](/zh/docs/customize/brand/) — 主色、字体预设、页宽与自定义样式。
- [发布上线](/zh/docs/admin/deploy/) — GitHub Pages 之外的托管方式与验收清单。
{.cards}

## 给编码助手的指令 {#for-agents}

上面四步可以交给编码助手（Claude Code、Codex 等）执行。复制下面这段指令，把方括号里的三处替换为你自己的信息：

> [!DETAILS] 可整段复制的指令
>
> ```text
> 请帮我用 OINK 主题建一个文档站，按下面的流程做，遇到不确定的地方按「只在缺信息时问人」处理。
>
> 1. 检查环境：运行 `hugo version`，要求输出包含 `extended` 且版本 >= 0.160.1；运行 `go version`，
>    要求能拿到版本号。任一不满足就先按官方文档安装，macOS 用 `brew install hugo go`，
>    Debian/Ubuntu 装 GitHub Releases 上的 hugo_extended deb 包。
> 2. 克隆站点模板：`git clone https://github.com/pgsty/oink.pgsty.com [目标目录]` 并进入该目录。
> 3. 改 hugo.yml 三处：顶层 `title` 与 `languages.<lang>.title` 改成 [站点名称]；
>    `params.productionURL` 改成 [站点域名]（baseURL 是指向它的 YAML 锚点，不要单独改 baseURL）；
>    `params.github_repo` 改成本站将来的仓库地址。
>    同时删掉这些本站专用配置：`services.googleAnalytics`、`params.comments`、
>    `params.tdVersion`、`params.version`、`params.version_menu`、`params.versions`、
>    `params.github_project_repo`，并把 `menus.main` 改成只指向 /docs 与 /blog。
> 4. 清空示例内容：删除 `content/docs/` 整棵目录，新建 `content/docs/_index.md`
>    （front matter 至少有 title / description / weight）；`content/blog/` 下只保留一篇文章当模板。
>    删除文档站自用的脚手架：`tests/`、`scripts/`、`playwright.config.mjs`、`package.json`、
>    `package-lock.json`、`AGENTS.md`、`TRANSLATION.md`、`CONTRIBUTING.md`、`agent-docs.config.yml`，
>    并把 `.github/workflows/` 下除 `pages.yml` 外的 workflow 删掉，
>    同时删掉 `pages.yml` 里的 `Set up Node.js` 与 `Verify advertised and pinned release match` 两步。
> 5. 后台启动 `hugo server`，确认 http://localhost:1313/ 返回 200 且页面标题是新站点名。
> 6. 校验：运行 `hugo --gc --minify --printPathWarnings --panicOnWarning`，
>    要求以 `Total in ...` 结束且没有 WARN/ERROR；有报错就修到通过，不要用忽略告警的方式绕过。
> 7. 只在缺少 [站点名称]、[站点域名]、仓库地址这三项信息时才问我，其余按上面的默认做法执行。
> ```

建好的站点便于助手读取：每页都有 `.md` 纯文本输出，站点根有 `llms.txt`，页面标题右侧的菜单里有「复制 Markdown 文本」与「在 Claude 中打开」。见 [Agent 支持](/zh/docs/customize/agents/)。

不从这个仓库起步、要从空目录搭建，见[从零建站与其它安装方式](/zh/docs/start/from-scratch/)。

## 相关 {#related}

- [仓库导览](/zh/docs/start/anatomy/) — 每个目录是什么、删的顺序
- [从零建站与其它安装方式](/zh/docs/start/from-scratch/) — `hugo mod init` 起步、submodule 与离线安装
- [本地预览](/zh/docs/admin/preview/) — `hugo server` 的常用开关与草稿预览
- [发布上线](/zh/docs/admin/deploy/) — 各家托管的配置与验收清单
- [排错与检查](/zh/docs/admin/troubleshooting/) — 构建、语言、搜索、平台四类常见错误
