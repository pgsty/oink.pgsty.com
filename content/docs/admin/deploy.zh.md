---
title: 发布上线
linkTitle: 发布上线
description: 把 public/ 发布到 GitHub Pages、Cloudflare Pages 或任何静态托管，配好 baseURL、CI 设置与安全策略，上线后验收并保留回滚路径。
weight: 20
search_keywords: [部署, 发布, 上线, GitHub Pages, Cloudflare Pages, Netlify, Vercel, Nginx, 对象存储, hugo deploy, baseURL, 子路径, CSP, deploy, hosting]
aliases:
  - /docs/deploy/
  - /docs/deploy/github-pages/
  - /docs/deploy/cloudflare/
  - /docs/deploy/other/
---

OINK 站点构建出来是一个纯静态目录，任何能托管静态文件的地方都能部署，不需要 Node 运行时、服务端渲染或构建插件。部署归结为三件事：执行[生产构建](/zh/docs/admin/preview/#production-build)、发布 `public/`、让 `baseURL` 与读者实际访问的地址一致。用 OINK Starter 创建的站点已经带有 GitHub Pages 与 Cloudflare Pages 两套工作流，这三件事都替你做好了。

## 确定 baseURL {#baseurl}

`baseURL` 配错是最常见的部署故障，而且不显眼：页面能打开，但搜索索引 404、页面操作链接指错地方、部分资源加载失败。

部署在域名根目录：

```yaml {title="hugo.yml"}
baseURL: https://docs.example.com
```

部署在 `https://example.com/docs/` 这样的子路径下，路径要写进 `baseURL`：

```yaml {title="hugo.yml"}
baseURL: https://example.com/docs/
```

也可以在构建时覆盖，同一份源码就能部署到多个地址：

```bash {title="终端"}
hugo --gc --minify --baseURL "https://example.com/docs/"
```

> [!WARNING] 不要用 `canonifyURLs` 修子路径
> `canonifyURLs` 保持 Hugo 的默认值 `false`。OINK 的模板与内容链接都基于 `baseURL` 解析，路径不对就是 `baseURL` 不对。打开 `canonifyURLs` 还会改写原本正确的相对链接，让故障更难定位。

启用了本地搜索时，在线上站点打开搜索，从浏览器 Network 面板查看索引请求：语言和子路径都要正确，响应为 200。索引地址以页面 `data-td-index-src` 属性为准，不要自己猜，因为生产构建的文件名带内容 hash（`offline-search-index.<语言>.<hash>.json`）。

## 选一个托管商 {#hosts}

{{< tabs group="host" default="ghpages" label="托管商" >}}
{{< tab label="GitHub Pages" value="ghpages" >}}

源码在 GitHub 上时，一份 Actions 工作流就能完成构建，并通过 Pages 部署 API 发布，不需要维护 `gh-pages` 分支。OINK Starter 已经带有这个文件，只有自己组装站点时才需要复制。

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
          go-version: stable
          cache-dependency-path: go.sum

      - name: Configure GitHub Pages
        id: pages
        uses: actions/configure-pages@v6

      - name: Install Hugo
        uses: peaceiris/actions-hugo@v3
        with:
          hugo-version: latest

      - name: Record build tool versions
        run: |
          go version
          hugo version

      - name: Download OINK
        run: go mod download github.com/pgsty/oink

      - name: Build
        run: |
          hugo --cleanDestinationDir --gc --minify --environment production \
            --printPathWarnings \
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

每项设置的用意见 [CI 构建设置](#ci)，修改这个文件时请保留它们。只有一项是 GitHub Pages 特有的：`--baseURL` 取 `configure-pages` 算出的地址，项目站点形如 `https://<OWNER>.github.io/<REPO>/`，不必手写。

在仓库 Settings → Pages → Build and deployment 中把 Source 设为 GitHub Actions，推送一次 `main`，到 Actions 标签页查看第一次运行。

使用自定义域名时，在同一设置页的 Custom domain 中填入域名，按提示配置 DNS，再把 `hugo.yaml` 里的 `baseURL` 改成这个域名。发布流程需要 `CNAME` 文件时，把它放在 `static/CNAME`，Hugo 会原样复制到 `public/`。

{{< /tab >}}
{{< tab label="Cloudflare Pages" value="cloudflare" >}}

OINK Starter 带有 `.github/workflows/cloudflare-pages.yaml`，采用 Direct Upload：生产构建在 GitHub Actions 里完成，[构建设置](#ci)与 GitHub Pages 工作流相同，再由 Wrangler 把得到的 `public/` 上传到 Cloudflare Pages 项目。Starter 站点推荐走这条路。

1. 创建一个 **Direct Upload** 类型的 Pages 项目。项目名默认与仓库同名，想用别的名字就设置仓库变量
   `CLOUDFLARE_PROJECT_NAME`。
1. 添加仓库 secrets `CLOUDFLARE_ACCOUNT_ID` 与 `CLOUDFLARE_API_TOKEN`。token 需要
   **Account → Cloudflare Pages → Edit** 权限。
1. 手动运行一次 **Deploy to Cloudflare Pages**。要让每次推送 `main` 都自动部署，设置仓库变量
   `CLOUDFLARE_PAGES_ENABLED=true`。
1. 规范 URL 默认是 `https://<project>.pages.dev/`。自定义域名成为生产地址后，把
   `CLOUDFLARE_SITE_URL` 设为该域名。
{.steps}

也可以用 Cloudflare 的 Git integration，由 Cloudflare 执行构建：构建命令设为 `hugo --gc --minify --printPathWarnings`，输出目录 `public`，并设置 `HUGO_VERSION` 为当前版本（如 `0.170.1`；OINK 已在 `0.170+` 上测试，而 Cloudflare 默认镜像内置的是较旧版本）。同一个项目只选一种模式，Git integration **或** Direct Upload 工作流；预览部署用各自的预览 URL，并以[非生产环境](#preview-builds)构建。

{{< /tab >}}
{{< tab label="其它" value="other" >}}

**Netlify** — 构建命令设为 `hugo --gc --minify`，发布目录 `public`，并设置环境变量 `HUGO_VERSION`。同样的设置也可以写进仓库：

```toml {title="netlify.toml"}
[build]
command = "hugo --gc --minify --printPathWarnings"
publish = "public"

[build.environment]
# 用当前版本覆盖平台默认 Hugo（OINK 已在 0.170+ 上测试）
HUGO_VERSION = "0.170.1"
```

主题以 submodule 安装时要开启递归 submodule 检出；以 Hugo Module 安装时，构建镜像里要有 Git 和 Go。预览与生产使用同一个 Hugo 版本，除非这个预览本来就是为了测试升级。

**Vercel** — 构建命令设为 `hugo --gc --minify`，输出目录 `public`，并设置环境变量 `HUGO_VERSION`。不需要 npm install 步骤。

**任意静态服务器（Nginx、Caddy）** — 原样提供 `public/` 的内容。下例的站点根目录是 `/var/www/oink/current`，它是指向某个发布目录的符号链接，由下文离线打包的步骤创建：

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

**对象存储** — Hugo 的 `deploy` 命令可以上传到 S3、Google Cloud Storage 或 Azure，在配置里写明目标：

```yaml {title="hugo.yml"}
deployment:
  targets:
    - name: aws
      URL: 's3://www.your-domain.tld'
      cloudFrontDistributionID: E9RZ8T1EXAMPLEID
```

构建之后执行 `hugo deploy`：它比对存储桶与 `public/`，只上传变化的文件，设置了 `cloudFrontDistributionID` 时还会让 CDN 缓存失效。不带 `--target` 时使用第一个目标；先加 `--dryRun` 看看它打算改什么。Hugo 二进制必须带 `withdeploy`（`hugo version` 的输出里能看到），云厂商凭据由其标准环境变量或配置文件提供；在 AWS 上先用 `aws s3 ls` 确认有权限。

**离线打包** — 服务器处在网络隔离环境时，在能联网的机器上按目标环境的 `baseURL` 构建，把产物打成一个归档带过去。每个归档都用新的发布名称：

```bash {title="终端"}
hugo --cleanDestinationDir --gc --minify --baseURL "https://docs.internal.example.com/" &&
  tar -czf oink-site-20260929-01.tar.gz -C public .
```

Linux 宿主上需要 `/var/www/oink` 的写权限和 GNU `mv`；`current` 要么不存在、要么是符号链接，`current.next` 不能已经存在。每个版本解压到新目录，再把 `current` 切过去：

```bash {title="Linux 宿主"}
release_dir=/var/www/oink/releases/20260929-01
mkdir -p /var/www/oink/releases
mkdir "$release_dir" &&
  tar -xzf oink-site-20260929-01.tar.gz -C "$release_dir" &&
  test -f "$release_dir/index.html" &&
  ln -s "$release_dir" /var/www/oink/current.next &&
  mv -Tf /var/www/oink/current.next /var/www/oink/current
```

只有新目录创建成功、归档解压完成并且找到 `index.html`，这串命令才会切换 `current`；最后的 `mv` 一步替换链接，读者不会看到写了一半的站点。不要解压覆盖已有的发布目录，上一个版本也要留着，它就是[回滚](#rollback)的依据。换 `baseURL` 要重新构建，不能去改产物。

**托管商没有 Go** — 以 Hugo Module 方式安装主题时，构建环境里必须有 Go。平台不提供 Go，就改用 Git submodule（构建前执行 `git submodule update --init`），或把离线归档提交到 `themes/oink/`，见[从零建站与其它安装方式](/zh/docs/start/from-scratch/)。

{{< /tab >}}
{{< /tabs >}}

## CI 构建设置 {#ci}

无论产物发到哪个托管商，OINK 站点的 CI 构建都应该包含下面这些设置。Starter 的工作流里已经都有了。

- checkout 时 `fetch-depth: 0` — 开启 `enableGitInfo` 后，最后修改时间和贡献者名单都来自 Git 历史；浅克隆会让每个页面显示同一个日期。
- 安装 Go，再执行 `go mod download github.com/pgsty/oink` — 主题以 Hugo Module 方式安装时，Hugo 要靠 Go 获取它。用 submodule 安装时改为 `submodules: recursive` 检出，用离线归档时把它提交在 `themes/oink/` 下；这两种情况都可以删掉两个 Go 步骤。
- `GOWORK: off` 与 `HUGO_MODULE_WORKSPACE: off` — 把开发者的 Go workspace 挡在构建之外，CI 构建的就只是 `go.mod` 固定的那个版本。
- Hugo 用 `latest` — 主题使用纯 CSS，已在 Hugo `0.170+` 上测试，CI 可以一直跟随最新版本。仍固定在 OINK 1.5.1 或更早版本的站点不行，见[版本升级](/zh/docs/admin/upgrade/#hugo-extended)。
- `--environment production` 与真实的 `--baseURL` — 构建环境决定是否收录、是否统计（见[下文](#preview-builds)），`baseURL` 决定所有绝对链接。
- 加 `--printPathWarnings`，不加 `--panicOnWarning` — OINK 的告警是有意设计的：键名写错或集成配置不全时，主题告警并回退到安全的默认值，站点照常构建。用 `--panicOnWarning` 或 `HUGO_PANICONWARNING` 把告警升级为错误，会让本来没问题的构建失败。告警应当在构建日志里阅读。

## 预览部署不要被收录 {#preview-builds}

Hugo 的 `-e` / `--environment` 改变的是 OINK 的构建方式，而不是站点内容。只有 `production` 构建才会：

- 输出 `<meta name="robots" content="index, follow">`（其它环境输出 `noindex, nofollow`）；
- 在 `robots.txt` 里写 `Allow: /` 和一行 `Sitemap:`（其它环境写 `Disallow: /`）；
- 渲染 Google Analytics 代码；
- 给主题的脚本与样式表加指纹，并附上 SRI `integrity` 属性。

`hugo` 默认就是 `production`，在预览宿主上也一样，所以 PR 预览与 staging 站点要显式换一个环境构建：

```bash {title="终端"}
hugo --gc --minify --environment staging --baseURL "$PREVIEW_URL"
```

这样构建出的产物会请搜索引擎不要收录，也不会向统计服务上报任何数据。

## 内容安全策略 {#csp}

主题的脚本、字体与图标都由站点自己的源提供，但只写 `script-src 'self'; style-src 'self'` 仍会拦掉普通 OINK 页面的一部分。主题会输出几段行内脚本，在首次绘制前设置配色模式和页面外壳的状态；还有初始画布、主题色与字体角色的行内样式，以及部分组件上的 `style` 属性；Markmap 另外会加行内配置与样式。OINK 不提供现成的策略，也不生成 CSP 哈希或注入 nonce，策略需要根据你自己的构建产物来定。

启用的功能会各自带来额外要求：

- 作者在 `renderer.unsafe: true` 下写的行内 HTML 与脚本，由站点自行审查。
- [ECharts 的 `$fn:` 回调](/zh/docs/components/echarts/#callbacks)与[自定义主题](/zh/docs/components/echarts/#theme)：站点把函数注册到 `window.OinkEchartsFunctions`、把主题定义在 `window.OinkEchartsThemes`，注册脚本的来源要加入 `script-src`。
- [分析脚本](/zh/docs/admin/analytics/#other-analytics)：你插入的脚本，以及它上报的主机。
- [PlantUML 本地渲染](/zh/docs/components/plantuml/#limits)：允许同源脚本，在 `script-src` 中允许 `wasm-unsafe-eval` 以编译 WebAssembly，在 `img-src` 中允许 `blob:`；不需要放行任何渲染服务。
- [远程 API 规范](/zh/docs/write/openapi/#spec-file)与[自建图表服务](/zh/docs/components/plantuml/#server)：它们的来源加入 `connect-src` 与 `img-src`。
- [giscus](/zh/docs/admin/comments/#privacy)：`script-src` 与 `frame-src` 都要放行。
- [交互地图](/zh/docs/components/map/#configuration)（`params.map`）：将 `tiles` 与 `dark_tiles` 的主机加入 `img-src`。
- [视频平台播放器](/zh/docs/components/video/#platforms)（`params.video_embeds`）：将已启用的播放器源（`https://www.youtube-nocookie.com`、`https://player.bilibili.com`、`https://player.vimeo.com`）加入 `frame-src`；如有远程媒体、海报图、字幕轨或社交帖子头像，将对应来源加入 `media-src`、`img-src` 与 `connect-src`。
- [双列视图](/zh/docs/customize/i18n/#bilingual-view)与 ReDoc API 文档在同源 frame 中渲染，`frame-src`（或 `child-src`）必须允许 `'self'`，响应头也要允许同源嵌入（不能有 `X-Frame-Options: DENY` 或 `frame-ancestors 'none'`）。双列视图还会给每个 HTML 页面加一段行内启动脚本，脚本哈希随之改变。

允许执行的行内脚本和样式块，按最终部署的字节计算哈希；或者由托管层在每次响应时，向策略头和对应标签同时注入新的 nonce。`<style>` 上的 nonce 管不到 `style="…"` 属性，后者要单独用 `style-src-attr` 放行。正文、配置、压缩方式或主题版本一变，哈希就会变，每次都要重新计算。

从只覆盖已审查功能的最小策略起步，一项一项放行：不需要回调时让 ECharts 选项保持纯数据，审查作者写的行内脚本，只为站点明确启用的集成添加远程来源。[断网构建验证](/zh/docs/admin/preview/#air-gapped)里的输出检查器会列出所有子资源来源，适合作为起始清单。策略先以 `Content-Security-Policy-Report-Only` 上线观察，在浏览器里确认深浅色启动、外壳状态、菜单和每个已启用的组件都正常后，再切换为强制执行。

## 验收清单 {#checklist}

每次部署后按这张表走一遍。前四项在构建产物里就能查，后面几项要在真实 URL 上看。

| 检查 | 怎么确认 |
| --- | --- |
| 构建成功，告警已读过 | 带 `--printPathWarnings` 的构建日志以 `Total in …` 结束 |
| `baseURL` 正确 | 页面源码里的 `<link rel="canonical">` 指向真实的生产地址，包括子路径 |
| 站点地图 | `<baseURL>/sitemap.xml` 可以访问；多语言站点是一个索引，指向 `/en/sitemap.xml`、`/zh/sitemap.xml` 等 |
| robots | `<baseURL>/robots.txt` 是 `Allow: /` 并带 `Sitemap:` 行；预览部署应为 `Disallow: /` |
| 搜索索引 | 启用本地搜索时，`data-td-index-src` 给出的 URL 返回 200，文件名带 hash，站内搜索有结果 |
| Markdown 输出 | 站点在 `outputs.page` 里启用了 `markdown` 时，页面 URL 后加 `index.md` 能取到纯文本 |
| `llms.txt` | 站点在 `outputs.home` 里启用了 `LLMS` 时，每种已启用语言的根路径都能访问 `llms.txt` |
| 每种语言 | 文档页、博客页、首页都能打开，语言切换落到对应页面而不是首页 |
| 外观与交互 | 深浅色切换、打印视图和常用组件（提示块、标签页、代码块复制）正常 |
| 404 | 访问一个不存在的路径，显示站点自己的 404 页 |
{.fields}

`sitemap.xml`、`robots.txt`、`.md` 与 `llms.txt` 的开关在[配置总览](/zh/docs/customize/config/)，面向 Agent 的输出见 [Agent 支持](/zh/docs/customize/agents/)。

## 回滚 {#rollback}

静态站点的回滚就是重新发布上一个已知可用的构建。不要在生产主机上手工改文件：下一次部署会悄悄冲掉这些改动，而且没有任何记录说明改过什么。

- GitHub Pages：在 Actions 里找到上一次成功的 `Deploy to GitHub Pages` 运行，选择 Re-run all jobs；或者 `git revert` 出问题的提交后重新推送。
- Cloudflare Pages、Netlify、Vercel：在平台的部署列表里选上一个可用的部署，用 Rollback 或 Publish deploy 把它重新设为生产版本。
- 自建静态服务器：把 `current` 指回[离线打包](#hosts)时保留的上一个发布目录。不要把旧归档解压到新文件上，否则只有新版本才有的路径会继续留在线上。

在 Linux 宿主上，符号链接与 GNU `mv` 的前提同上，把示例路径换成你保留的那个版本：

```bash {title="终端"}
previous_release=/var/www/oink/releases/20260928-01
test -d "$previous_release" &&
  ln -s "$previous_release" /var/www/oink/current.next &&
  mv -Tf /var/www/oink/current.next /var/www/oink/current
```

然后通过公网 URL 打开一个旧页面，并确认只在被撤回版本中新增的路径已经访问不到。

问题出在主题升级时，要回滚的是 `go.mod` 里固定的版本，见[版本升级](/zh/docs/admin/upgrade/#rollback)。

## 相关 {#related}

- [本地预览](/zh/docs/admin/preview/) — 生产构建、清缓存与断网验证
- [排错与检查](/zh/docs/admin/troubleshooting/) — 404、搜索无结果与平台相关故障
- [分析与 SEO](/zh/docs/admin/analytics/) — 上线之后被正确收录
- [版本升级](/zh/docs/admin/upgrade/) — 升级主题与回滚
- [配置总览](/zh/docs/customize/config/) — `baseURL`、`outputs` 与其它站点键
