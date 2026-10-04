---
title: 发布上线
linkTitle: 发布上线
description: 把 public/ 部署到 GitHub Pages、Cloudflare Pages 或任何静态托管：baseURL 配对、内容安全策略、验收清单与回滚。
weight: 20
search_keywords: [部署, 发布, 上线, GitHub Pages, Cloudflare Pages, Netlify, Vercel, Nginx, 对象存储, hugo deploy, baseURL, 子路径, CSP, deploy, hosting]
aliases:
  - /docs/deploy/
  - /docs/deploy/github-pages/
  - /docs/deploy/cloudflare/
  - /docs/deploy/other/
---

OINK 站点的产物是一个纯静态目录，任何能托管静态文件的地方都能部署，不需要 Node 运行时、服务端渲染或构建插件。托管商一侧只有三件事：用正确的 Hugo 版本执行一条命令、发布 `public/`、让 `baseURL` 与最终访问地址一致。

前提是本机已经能完成零告警的[生产构建](/zh/docs/admin/preview/#production-build)。

## 确定 baseURL {#baseurl}
`baseURL` 是最常见的故障源，失败方式也隐蔽：页面能打开，但搜索索引 404、页面操作链接指向错误位置、部分资源加载失败。

部署到域名根目录：

```yaml {title="hugo.yml"}
baseURL: https://oink.pgsty.com
```

部署到子路径（`https://example.com/docs/`）时，路径必须写进 `baseURL`：

```yaml {title="hugo.yml"}
baseURL: https://example.com/docs/
```

也可以在构建时覆盖，让同一份源码部署到不同位置：

```bash {title="终端"}
hugo --gc --minify --baseURL "https://example.com/docs/"
```

> [!WARNING] 不要用 `canonifyURLs` 修子路径
> Hugo 的 `canonifyURLs` 默认 `false`，保持这个默认值。OINK 的模板与内容链接都基于 `baseURL` 解析：路径不对是 `baseURL` 不对，打开 `canonifyURLs` 会把本来正确的相对链接一起改写，让问题更难定位。

启用本地搜索后，打开搜索，在浏览器 Network 面板检查实际索引请求：语言与部署子路径
应正确，响应应为 200。页面的 `data-td-index-src` 属性给出完整地址；生产文件名是
`offline-search-index.<语言>.<hash>.json`，开发环境不带 hash。不要通过猜文件名来验证。

## 选一个托管商 {#hosts}

{{< tabs group="host" default="ghpages" label="托管商" >}}
{{< tab label="GitHub Pages" value="ghpages" >}}

源码托管在 GitHub 时，一份 Actions 工作流就够：构建在 Actions 里执行，产物通过
Pages 部署 API 发布，不需要维护 `gh-pages` 分支。OINK Starter 已经包含下面的文件；
只有手工组装站点时才需要复制。

```yaml {title=".github/workflows/github-pages.yaml" lineNos="inline" collapse=30}
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: github-pages
  cancel-in-progress: false

env:
  HUGO_VERSION: 0.165.0
  # 同级 checkout 的 workspace 绝不能参与 CI 构建
  GOWORK: off
  HUGO_MODULE_WORKSPACE: off
  HUGO_CACHEDIR: ${{ github.workspace }}/.hugo_cache

jobs:
  build:
    name: Build Pages artifact
    runs-on: ubuntu-latest
    steps:
      - name: Check out source
        uses: actions/checkout@v7
        with:
          fetch-depth: 0

      - name: Set up Go
        uses: actions/setup-go@v7
        with:
          go-version-file: go.mod
          cache-dependency-path: go.sum

      - name: Configure GitHub Pages
        id: pages
        uses: actions/configure-pages@v6

      - name: Install Hugo Extended
        run: |
          curl --fail --location --silent --show-error \
            --output "${RUNNER_TEMP}/hugo.deb" \
            "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb"
          sudo dpkg -i "${RUNNER_TEMP}/hugo.deb"

      - name: Download OINK
        run: go mod download github.com/pgsty/oink

      - name: Build
        run: |
          hugo --cleanDestinationDir --gc --minify --environment production \
            --printPathWarnings --panicOnWarning \
            --baseURL "${{ steps.pages.outputs.base_url }}/"

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v5
        with:
          path: public

  deploy:
    name: Deploy
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Publish
        id: deployment
        uses: actions/deploy-pages@v5
```

这是 OINK Starter 内置的工作流。几处不能删：

- `fetch-depth: 0` — 站点开了 `enableGitInfo` 时，「最后修改时间」和贡献者信息要读完整 Git 历史，浅克隆会让它们为空。
- `setup-go` + `go mod download` — Hugo Module 方式引入主题时，Hugo 需要 Go 才能解析模块。用 submodule 安装主题的站点改成 `submodules: recursive`，用离线归档的站点把 `themes/oink/` 提交进仓库，这两步都可以去掉。
- `GOWORK: off` 与 `HUGO_MODULE_WORKSPACE: off` — 防止本地开发用的 `go.work` 意外参与 CI 构建，保证 CI 验证的是 `go.mod` 里固定的那个公开标签。
- `--baseURL "${{ steps.pages.outputs.base_url }}/"` — 项目站点的 URL 形如 `https://<OWNER>.github.io/<REPO>/`，`configure-pages` 会把它算出来，不用手写。
- `--panicOnWarning` — 有告警不发布。

在仓库 Settings → Pages → Build and deployment 里把 Source 设为 GitHub Actions，推一次 `main`，在 Actions 标签页查看第一次运行。

自定义域名在同一设置页的 Custom domain 里填写，并按提示配置 DNS，随后把
`hugo.yaml` 里的 `baseURL` 换成这个域名。发布流程需要产物里带 `CNAME` 文件时，
把它放进 `static/CNAME`，Hugo 会原样复制到 `public/`。

{{< /tab >}}
{{< tab label="Cloudflare Pages" value="cloudflare" >}}

OINK Starter 内置 `.github/workflows/cloudflare-pages.yaml`，使用 Direct Upload。
严格构建留在 GitHub Actions，Wrangler 把同一份 `public/` 产物上传到 Cloudflare
Pages 项目。

1. 创建一个 **Direct Upload** Pages 项目。项目名默认与仓库相同，也可用仓库变量
   `CLOUDFLARE_PROJECT_NAME` 覆盖。
1. 添加仓库 secrets：`CLOUDFLARE_ACCOUNT_ID` 与 `CLOUDFLARE_API_TOKEN`。token 需要
   **Account → Cloudflare Pages → Edit** 权限。
1. 手动运行一次 **Deploy to Cloudflare Pages**。设置仓库变量
   `CLOUDFLARE_PAGES_ENABLED=true` 后，每次推送 `main` 才自动部署。
1. 规范 URL 默认是 `https://<project>.pages.dev/`；自定义域名成为生产地址时设置
   `CLOUDFLARE_SITE_URL`。
{.steps}

workflow 固定 Hugo Extended 0.165.0，从 `go.mod` 读取 Go 版本，关闭本地模块
workspace，并在上传前用 `--panicOnWarning` 构建。这是 Starter 用户最可复现的推荐路径。

Cloudflare Git integration 仍然是另一种有效模式：构建命令设为
`hugo --gc --minify --printPathWarnings --panicOnWarning`，输出目录 `public`，Hugo
固定 `0.165.0`，Go 固定 `1.27`。同一个项目只用 Git integration 或 Direct Upload
workflow 其中一种。预览部署仍不等于生产证明；它要按自己的 URL 重建并保持不收录。

{{< /tab >}}
{{< tab label="其它" value="other" >}}

**Netlify** — 构建命令 `hugo --gc --minify`，发布目录 `public`，环境变量 `HUGO_VERSION`。同样的设置可以写进仓库：

```toml {title="netlify.toml"}
[build]
command = "hugo --gc --minify --printPathWarnings --panicOnWarning"
publish = "public"

[build.environment]
HUGO_VERSION = "0.165.0"
```

用 submodule 安装主题就打开递归 submodule 检出；用 Hugo Module 就要求构建环境有 Git 和 Go。生产与预览应使用同一个 Hugo 版本，除非预览环境本来就是用来测升级的。

**Vercel** — 同样的三件事：构建命令 `hugo --gc --minify`、输出目录 `public`、环境变量 `HUGO_VERSION`。它同样不需要安装 npm 依赖。

**任意静态服务器（Nginx / Caddy）** — 原样提供 `public/` 的内容。下例通过
`current` 符号链接指向一份发布目录，创建方法见下方离线打包步骤。配置 Nginx 或
Caddy 时，将宿主的站点根目录设为这个链接：

```nginx {title="/etc/nginx/conf.d/docs.conf"}
server {
    listen 80;
    server_name docs.example.com;
    root /var/www/oink/current;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    error_page 404 /404.html;
}
```

站点是纯静态的，没有需要转发给应用服务器的路径。

**对象存储** — Hugo 自带 `deploy` 命令，把目标写进配置即可：

```yaml {title="hugo.yml"}
deployment:
  targets:
    - name: aws
      URL: 's3://www.your-domain.tld'
      cloudFrontDistributionID: E9RZ8T1EXAMPLEID
```

构建之后执行 `hugo deploy`：它比对远端与 `public/` 的差异，只上传变化的文件，并在给了 `cloudFrontDistributionID` 时使 CDN 缓存失效。不带 `--target` 时用第一个目标，`--dryRun` 先看要改什么。两个前提：Hugo 二进制带 `withdeploy`（`hugo version` 的输出里能看到），云厂商凭据由标准环境变量或配置文件提供（AWS 上先用 `aws s3 ls` 确认）。

**离线打包** — 网络隔离环境里，在能联网的机器上构建，把产物打成一个包带过去。
先将归档路径换成自己的值，每份产物使用新的发布名称。Linux 宿主上的命令需要
`/var/www/oink` 的写权限及 GNU `mv`；`current` 应不存在或为符号链接，
`current.next` 应不存在。按上例配置 Nginx 或 Caddy，从 `current` 提供文件；
这是宿主配置，不是 Hugo 选项。

```bash {title="终端"}
hugo --cleanDestinationDir --gc --minify --panicOnWarning --baseURL "https://docs.internal.example.com/" &&
  tar -czf oink-site-20260929-01.tar.gz -C public .

```

仅在构建与打包成功后，把这份归档传到 Linux 宿主，再在那里执行以下命令。
每份产物使用新的发布名称：

```bash {title="Linux 宿主"}
release_dir=/var/www/oink/releases/20260929-01
mkdir -p /var/www/oink/releases
mkdir "$release_dir" &&
  tar -xzf oink-site-20260929-01.tar.gz -C "$release_dir" &&
  test -f "$release_dir/index.html" &&
  ln -s "$release_dir" /var/www/oink/current.next &&
  mv -Tf /var/www/oink/current.next /var/www/oink/current
```

这组命令只有在新目录创建成功、解压完成且 `index.html` 存在时才切换 `current`。
随后检查线上页面，并保留上一份发布目录用于回滚。不要把新包解压覆盖到已有发布目录。

构建时就要用目标环境的 `baseURL`；需要改变它时重新构建。

**托管商没有 Go** — 用 Hugo Module 引入主题需要构建环境有 Go。平台不提供时，改用 Git submodule（构建前执行 `git submodule update --init`）或离线归档（把 `themes/oink/` 提交进仓库），见[从零建站与其它安装方式](/zh/docs/start/from-scratch/)。

{{< /tab >}}
{{< /tabs >}}

## 预览部署不要被收录 {#preview-builds}

Hugo 的 `-e` / `--environment` 只选择构建期行为，不改变站点内容，但 OINK 有三处会跟着它变：`production` 环境才输出 `<meta name="robots" content="index, follow">`、才让 `robots.txt` 变成 `Allow: /`、才渲染 Google Analytics 模板。PR preview、staging 这类构建不要用 `--environment production`：

```bash {title="终端"}
hugo --gc --minify --environment staging --baseURL "$PREVIEW_URL"
```

出来的产物自带 `noindex, nofollow` 与 `Disallow: /`，也不会向分析服务上报数据。

## 内容安全策略 {#csp}

主题自带的运行时、字体与图标都是同源资源，但仅有
`script-src 'self'; style-src 'self'` 并不能覆盖普通 OINK 页面。主题会输出行内的
主题初始化与外壳预绘制脚本、初始画布及主题色和字体角色样式，以及部分组件的
style 属性；Markmap 还会增加行内配置与样式。主题不提供通用策略，也不自动生成
CSP 哈希或注入 nonce；部署方需根据实际构建产物制定策略。

额外功能也会改变所需指令：

- 作者写的行内 HTML 与行内脚本，`renderer.unsafe: true` 之下由作者负责。
- [ECharts 的 `$fn:` 回调](/zh/docs/components/echarts/#callbacks)：回调函数由站点注册到 `window.OinkEchartsFunctions`，注册脚本的来源要进 `script-src`。
- [分析脚本](/zh/docs/admin/analytics/#other-analytics)：站点自己插入的那段脚本与它上报的目标。
- [远程 API 规范](/zh/docs/write/openapi/#spec-file)与[自建图表服务](/zh/docs/components/plantuml/#server)：落在 `connect-src` 与 `img-src`。
- [giscus](/zh/docs/admin/comments/#privacy)：`script-src` 与 `frame-src` 要一起放行。

对允许执行的行内脚本和样式块，按最终部署字节计算哈希；或者由托管层为每次响应
同时向策略和对应标签注入新的 nonce。style 标签上的 nonce 不会授权 style 属性，
后者要在 `style-src-attr` 下单独审查。正文、配置、压缩方式或主题变更后，都要重新
核对哈希。先以 `Content-Security-Policy-Report-Only` 观察，再验证明暗主题启动、
外壳状态、菜单和所有启用的组件，之后再强制执行。仅扫描资源来源不能证明 CSP 兼容。

从只覆盖已审查功能的最小策略起步，逐项放行：不需要回调时让 ECharts 选项保持纯数据，审查作者写的行内脚本，只为站点主动启用的集成添加远程来源。产物里的子资源来源可以先用[断网构建验证](/zh/docs/admin/preview/#air-gapped)里的脚本扫一遍。

## 验收清单 {#checklist}

部署完成后按这张表走一遍。前四项是构建期的，后面几项要在真实 URL 上查。

| 检查 | 怎么确认 |
| --- | --- |
| 零告警构建 | 构建命令带 `--printPathWarnings --panicOnWarning`，日志里有 `Total in …` |
| `baseURL` 正确 | 页面源码里 `<link rel="canonical">` 指向真实生产地址（含子路径） |
| 站点地图 | `<baseURL>/sitemap.xml` 可访问；多语言站点是一个索引，指向 `/en/sitemap.xml`、`/zh/sitemap.xml` |
| robots | `<baseURL>/robots.txt` 是 `Allow: /` 并带 `Sitemap:` 行；预览部署应该是 `Disallow: /` |
| 搜索索引 | 启用本地搜索后，`data-td-index-src` 指定的实际 URL 返回 200；生产文件名带 hash，站内搜索有结果 |
| Markdown 输出 | 任一页面 URL 后面加 `index.md` 能取到纯文本（站点在 `outputs.page` 里开了 `markdown` 时） |
| `llms.txt` | 站点在 `outputs.home` 里开了 `LLMS` 时，首要语言与每种已启用语言根都能访问 `llms.txt` |
| 已启用语言 | 每种语言的文档页、博客页、首页都能打开，语言切换落到对应页面而不是首页 |
| 外观与交互 | 深浅色切换、打印视图、代表性组件（提示块、标签页、代码块复制）正常 |
| 404 | 访问一个不存在的路径，看到站点自己的 404 页 |
{.fields}

`sitemap.xml`、`robots.txt`、`.md` 与 `llms.txt` 这几项的开关在[配置总览](/zh/docs/customize/config/)，Agent 输出的细节见 [Agent 支持](/zh/docs/customize/agents/)。

## 回滚 {#rollback}

静态站点的回滚就是重新发布上一个已知可用的 commit，不要在生产上手工改文件。

- GitHub Pages：在 Actions 里找到上一次成功的 `Deploy to GitHub Pages` 运行，点 Re-run all jobs；或者 `git revert` 出问题的提交再推一次。
- Cloudflare Pages / Netlify / Vercel：在部署列表里选上一个成功的部署，用平台的 Rollback / Publish deploy 把它重新设为生产版本。
- 自建静态服务器：把 `current` 切回[离线打包](#hosts)时保留的上一份发布目录。不要把旧包覆盖到新文件上，否则新版本独有的路径仍会在线上保留。

在 Linux 宿主上，把示例路径换成保留的已知可用版本。符号链接与 GNU `mv` 的前提同上：

```bash {title="终端"}
previous_release=/var/www/oink/releases/20260928-01
test -d "$previous_release" &&
  ln -s "$previous_release" /var/www/oink/current.next &&
  mv -Tf /var/www/oink/current.next /var/www/oink/current
```

通过线上 URL 检查一个旧版代表页，并确认仅在被撤回版本中新增的路径已不再提供。

问题出在主题升级而不是内容时，回滚的是 `go.mod` 里固定的版本，见[版本升级](/zh/docs/admin/upgrade/#rollback)。

## 相关 {#related}

- [本地预览](/zh/docs/admin/preview/) — 生产构建的完整命令、清缓存与断网验证
- [排错与检查](/zh/docs/admin/troubleshooting/) — 404、搜索无结果、平台相关故障
- [分析与 SEO](/zh/docs/admin/analytics/) — 上线之后让搜索引擎正确收录
- [版本升级](/zh/docs/admin/upgrade/) — 升级主题版本与回滚
- [配置总览](/zh/docs/customize/config/) — `baseURL`、`outputs` 与其它站点键
