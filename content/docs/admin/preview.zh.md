---
title: 本地预览
linkTitle: 本地预览
description: 用 hugo server 在本机预览改动，用 hugo --panicOnWarning 构建可部署的 public/，不需要 Node 与 CDN。
weight: 10
search_keywords: [本地预览, hugo server, 开发服务器, 草稿, 生产构建, 容器, Docker, 缓存, 断网, preview, local, build, air-gapped]
aliases:
  - /docs/tutorial/container/
  - /docs/deploy/local/
---

两条命令覆盖日常工作：`hugo server` 在本机预览改动，`hugo` 产出可以部署到任何静态托管的 `public/`。前提是本机安装了 Hugo Extended（不低于 {{< param hugoMinVersion >}}）；用 Hugo Module 引入主题时还需要 Go。构建不依赖 Node.js、npm 与 PostCSS，它们只服务于本仓库自身的回归检查。

## 预览服务器 {#hugo-server}

在站点根目录（`hugo.yml` 所在的目录）执行：

```bash {title="终端"}
hugo server
```

打开 <http://localhost:1313/>。保存文件后 Hugo 重新构建并刷新浏览器，切换 Git 分支同样触发重建。首次启动较慢：用 Hugo Module 引入主题时，Hugo 要先通过 Go 把模块下载到缓存，之后的启动都走缓存。

## 常用开关 {#server-flags}

| 开关 | 默认 | 说明 |
| --- | --- | --- |
| `-D` / `--buildDrafts` | 关 | 把 `draft: true` 的页面也构建出来 |
| `-F` / `--buildFuture` | 关 | 把 `date` / `publishDate` 在未来的页面也构建出来 |
| `-E` / `--buildExpired` | 关 | 把 `expiryDate` 已过的页面也构建出来 |
| `--disableFastRender` | 关 | 每次改动都整站重渲染，不用增量 |
| `-M` / `--renderToMemory` | 关（写磁盘） | 只在内存里渲染，不落 `public/` |
| `-N` / `--navigateToChanged` | 关 | 保存哪个页面，浏览器就跳到哪个页面 |
| `--bind` | `127.0.0.1` | 监听地址；要让局域网或容器外访问就设 `0.0.0.0` |
| `-p` / `--port` | `1313` | 监听端口 |
| `--minify` | 关 | 预览也压缩输出，用来复现生产环境下的渲染 |
| `--printPathWarnings` | 关 | 有两个页面写到同一个目标路径时告警 |
{.fields meta="default"}

本站开发时用的组合是：

```bash {title="终端"}
hugo server -DFE \
  --disableFastRender --renderToMemory --minify \
  --printPathWarnings --logLevel info
```

`-DFE` 是 `-D -F -E` 的合写，草稿、未来与过期页面一并构建，写作时新建的页面才可见。

### 改动没有生效 {#fast-render}

Hugo 默认开启快速渲染（fast render），只重建它判定受影响的部分。修改布局、配置、`data/` 或被 `include` 引用的文件时，增量判定可能不准，页面看起来没有变化。三步排查：

1. 加 `--disableFastRender` 重启，看是否恢复。
1. 硬刷新浏览器（`Cmd`/`Ctrl` + `Shift` + `R`），排除浏览器缓存。
1. 仍未恢复则[清缓存](#clean-caches)后重启。
{.steps}

### 从其它设备访问 {#bind}
`hugo server` 默认只监听 `127.0.0.1`，其它设备访问不到。要在手机或另一台机器上预览：

```bash {title="终端"}
hugo server --bind 0.0.0.0 --port 1313 --baseURL http://192.168.1.10:1313/
```

`--baseURL` 必须写成对方可访问的地址，否则页面能打开，但 CSS 与搜索索引这类走绝对路径的资源会指向 `localhost`。

## 生产构建 {#production-build}

部署产物用 `hugo` 构建，不用 `hugo server`：

```bash {title="终端"}
hugo --gc --minify --printPathWarnings --panicOnWarning
```

产物写入 `public/`，该目录可以脱离源码树独立部署。四个开关各管一件事：

| 开关 | 说明 |
| --- | --- |
| `--gc` | 构建后清掉 `resources/_gen` 里不再被引用的缓存资源 |
| `--minify` | 压缩 HTML、CSS、JS 与 XML 输出 |
| `--printPathWarnings` | 两个页面撞到同一个输出路径时告警，多语言站点最常见的静默错误 |
| `--panicOnWarning` | 遇到第一条 WARNING 就让构建失败 |
{.fields}

`--panicOnWarning` 需要单独说明。OINK 的多数降级路径是告警而不是报错：giscus 必填键缺失、`params.comments.type` 取了不支持的值、Hugo 弃用的配置键，都只打一条 WARNING 然后跳过。CI 日志通常无人逐行阅读，这些问题会带到线上。把这个开关写进构建命令，等于要求零告警才算构建通过。

本站 CI 的构建步骤（`.github/workflows/site-checks.yml`）是 `hugo --cleanDestinationDir --gc --minify --environment production --printPathWarnings --panicOnWarning`，任何一条告警都会让部署停在构建阶段。

### baseURL 与构建环境 {#baseurl-and-environment}

`baseURL` 写在 `hugo.yml` 里，也可以在命令行覆盖：

```yaml {title="hugo.yml"}
baseURL: https://oink.pgsty.com
```

```bash {title="终端"}
hugo --minify --baseURL "https://example.com/docs/"
```

部署到子路径时 `--baseURL` 必须带上那段路径，细节见[发布上线](/zh/docs/admin/deploy/#baseurl)。

构建环境用 `-e` / `--environment` 选择，`hugo` 默认 `production`，`hugo server` 默认 `development`。这个选择在 OINK 里有三处可见后果：

- `production` 下才输出 `<meta name="robots" content="index, follow">`，其它环境输出 `noindex, nofollow`。
- `production` 下 `robots.txt` 是 `Allow: /`，其它环境是 `Disallow: /`。
- `production` 下才渲染 Hugo 的 Google Analytics 模板，静态资源也才做指纹与 SRI。

预览部署（PR preview、staging）用非 production 环境构建，产物自带不被搜索引擎收录、不上报分析的行为：

```bash {title="终端"}
hugo --minify --environment staging --baseURL "$PREVIEW_URL"
```

## 容器内预览 {#container}

容器不是必需的。两种情况适合用容器：团队需要固定工具链版本，或不希望在每台开发机上安装 Hugo。

```dockerfile {title="Dockerfile" collapse=16}
FROM debian:bookworm-slim

ARG HUGO_VERSION=0.164.0
ARG GO_VERSION=1.26.6
ARG TARGETARCH

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl git \
    && curl -L -o /tmp/hugo.deb \
      "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-${TARGETARCH}.deb" \
    && apt-get install -y /tmp/hugo.deb \
    && curl -L -o /tmp/go.tgz \
      "https://go.dev/dl/go${GO_VERSION}.linux-${TARGETARCH}.tar.gz" \
    && tar -C /usr/local -xzf /tmp/go.tgz \
    && rm -rf /var/lib/apt/lists/* /tmp/hugo.deb /tmp/go.tgz

ENV PATH="/usr/local/go/bin:${PATH}"
WORKDIR /src
EXPOSE 1313
ENTRYPOINT ["hugo"]
CMD ["server", "--bind", "0.0.0.0", "--disableFastRender"]
```

```bash {title="终端"}
docker build -t oink-hugo .

# 预览：把站点源码挂进去，顺带挂上 Go 模块缓存
docker run --rm -it -p 1313:1313 \
  -v "$PWD:/src" \
  -v "$HOME/go/pkg/mod:/root/go/pkg/mod" \
  oink-hugo

# 生产构建：覆盖默认的 server 命令
docker run --rm --user "$(id -u):$(id -g)" \
  -v "$PWD:/src" \
  oink-hugo --gc --minify
```

镜像里装 Go 的原因：用 Hugo Module 引入主题时，Hugo 需要 Go 解析并下载模块。用 submodule、离线归档或直接克隆的站点可以去掉 Go，镜像会小很多。

> [!WARNING] 不要让 root 写 `public/`
> 容器里的进程默认是 root，生成的 `public/` 属于 root，宿主机上删不掉。共享环境里用 `--user "$(id -u):$(id -g)"` 映射用户 ID（上面的生产构建命令已经带了）。

镜像不需要 Node.js、npm 与 PostCSS，也不应出现拉取远程浏览器资源的步骤。网络隔离环境需要预先镜像基础镜像与这两个软件包。

## 清缓存 {#clean-caches}

Hugo 的中间产物分三处，从轻到重依次清：

| 目录 / 命令 | 内容 | 什么时候清 |
| --- | --- | --- |
| `public/` | 上一次的构建产物 | 删了页面但线上还在；或用 `hugo --cleanDestinationDir` 让构建自己清 |
| `resources/_gen/` | 处理过的图片与编译出的 CSS | 换了图片处理参数、换了字体或主色，页面还是旧样子 |
| `hugo mod clean` | Hugo Module 缓存 | 换了主题版本但解析出来还是旧的；加 `--all` 清整个模块缓存 |
{.fields}

```bash {title="终端"}
rm -rf public resources/_gen
hugo mod clean          # 只清当前项目用到的模块
hugo mod clean --all    # 清整个模块缓存，下次构建重新下载
```

`public/` 与 `resources/` 都应该写进 `.gitignore`，不要提交生成产物。

## 与主题一起改 {#theme-workspace}

同时修改主题与站点时才需要这一节。用 `HUGO_MODULE_REPLACEMENTS` 把模块临时指向本地 checkout，`go.mod` 保持不变：

```bash {title="终端"}
HUGO_MODULE_REPLACEMENTS='github.com/pgsty/oink -> /absolute/path/to/oink' hugo server
```

本站的 `Makefile` 封装了这几条命令，要求主题 checkout 在同级目录 `../oink`：

```text {title="Makefile 目标" copy=false}
make dev     # 替换为 ../oink 的开发服务器
make check   # 替换为 ../oink 跑完整回归套件（npm test）
make build   # 用 go.mod 里的版本构建
make serve   # 按生产配置起预览服务器
```

> [!DANGER] 替换只作用于本机
> 无论用环境变量还是 Go workspace（`go work init` + `HUGO_MODULE_WORKSPACE=go.work`），CI 与生产构建都只看 `go.mod`；`go.work` 记录的是开发机的路径，不能提交。判定一个发布标签是否可用时，去掉替换、用 `go.mod` 里的版本单独构建一次。

## 断网构建验证 {#air-gapped}

网络隔离环境的验收要同时覆盖构建阶段与浏览器阶段。六步：

1. 从一份已校验的主题归档与空的模块缓存开始（`hugo mod clean --all`）。
1. 阻断出站 HTTP、HTTPS 与 Go module proxy。
1. 运行生产构建 `hugo --gc --minify --printPathWarnings --panicOnWarning`。
1. 浏览产物里两种语言的页面：文档页、博客页、首页、404。
1. 操作搜索、深浅色切换、图表与内容组件。
1. 检查子资源来源，确认没有意外的远程主机。
{.steps}

最后一步用主题仓库里的脚本，它不依赖站点的测试框架：

```bash {title="终端"}
python3 bin/check-output-security.py \
  --public public --base-url https://docs.internal.example.com/
```

脚本扫描四种输出里的每个 `href` / `src` / `srcset` / `poster` 与表单 `action`，要求它们是站内相对路径或 `http` / `https` / `mailto` / `tel`，并拒绝行内 `on*` 事件处理器与 `javascript:` URL。指向别的主机的 `<iframe>` `<script>` `<link>` `<img>` `<video>` `<audio>` `<embed>` `<object>` `<source>` 一律报错，站点确实要嵌入第三方内容时加 `--third-party` 放行，多域名语言配置用 `--allow-host` 追加首方主机。

一次通过只证明当次提交与当次环境。每个主题候选版本、每次随附依赖更新之后都要重跑一遍。

## 验证 {#verify}

一次干净的生产构建应该是这样：

```bash {title="终端"}
rm -rf public resources/_gen
hugo --gc --minify --printPathWarnings --panicOnWarning
```

看到 `Total in …` 且没有 ERROR / WARNING 才算通过。然后确认：

- 日志里没有 npm、PostCSS、Autoprefixer 或下载浏览器资源的步骤。出现了说明配置里混进了上游 Docsy 的流程。
- `public/` 下有 `sitemap.xml`、`robots.txt`，`robots.txt` 是 `Allow: /`。
- 开了本地搜索的站点，`public/` 根下有 `offline-search-index.<语言>.json`。
- 用 `hugo server` 打开代表性页面：一个文档页、一个博客页、首页、404，两种语言、两种配色都看一遍。

构建失败或结果不对，去[排错与检查](/zh/docs/admin/troubleshooting/)。

## 相关 {#related}

- [发布上线](/zh/docs/admin/deploy/) — 把 `public/` 发到 GitHub Pages、Cloudflare 或别处
- [排错与检查](/zh/docs/admin/troubleshooting/) — 构建、语言、搜索、平台四类常见故障
- [从零建站与其它安装方式](/zh/docs/start/from-scratch/) — Hugo Module / submodule / 离线归档的取舍
- [配置总览](/zh/docs/customize/config/) — `hugo.yml` 里每个键的定义
