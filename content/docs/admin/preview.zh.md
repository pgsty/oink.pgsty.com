---
title: 本地预览
linkTitle: 本地预览
description: 用 hugo server 边保存边看渲染结果，再用 hugo 构建用于部署的 public/ 目录。
weight: 10
search_keywords: [本地预览, hugo server, 开发服务器, 草稿, 生产构建, 容器, Docker, 缓存, 断网, preview, local, build, air-gapped]
aliases:
  - /docs/tutorial/container/
  - /docs/deploy/local/
---

日常工作只用两条命令。`hugo server` 在每次保存后重建站点并自动刷新浏览器；`hugo` 把完整站点写进 `public/`，也就是要部署的那个目录：

```bash {title="终端"}
hugo server                                                   # 在 http://localhost:1313/ 预览
hugo --cleanDestinationDir --gc --minify --printPathWarnings  # 构建用于部署的 public/
```

两者都不需要 Node.js、npm 或 CDN。需要安装的 Git、Go 与 Hugo 见[快速上手](/zh/docs/start/#tools)。

## 预览服务器 {#hugo-server}

在站点根目录（`hugo.yml` 所在目录）执行 `hugo server`，然后打开 <http://localhost:1313/>。每次保存文件、每次切换 Git 分支，Hugo 都会重建并刷新浏览器。首次启动较慢，因为 Hugo 要先把主题模块下载到缓存，之后的启动直接读缓存。

## 常用开关 {#server-flags}

| 开关 | 默认 | 作用 |
| --- | --- | --- |
| `-D` / `--buildDrafts` | 关 | 把 `draft: true` 的页面也构建出来 |
| `-F` / `--buildFuture` | 关 | 把 `date` / `publishDate` 在未来的页面也构建出来 |
| `-E` / `--buildExpired` | 关 | 把 `expiryDate` 已过的页面也构建出来 |
| `--disableFastRender` | 关 | 每次改动都整站重新渲染，而不是只渲染 Hugo 认为受影响的页面 |
| `-M` / `--renderToMemory` | 关（写磁盘） | 从内存提供页面，不往 `public/` 写任何文件 |
| `-N` / `--navigateToChanged` | 关 | 保存哪个页面，浏览器就跳到哪个页面 |
| `--bind` | `127.0.0.1` | 监听地址；要从局域网或容器外访问，设为 `0.0.0.0` |
| `-p` / `--port` | `1313` | 监听端口 |
| `--minify` | 关 | 预览时也压缩输出，用来复现生产环境下的渲染 |
| `--printPathWarnings` | 关 | 两个页面写到同一个输出路径时告警 |
{.fields meta="default"}

写作时推荐这样组合：

```bash {title="终端"}
hugo server -DFE \
  --disableFastRender --renderToMemory --minify \
  --printPathWarnings --logLevel info
```

`-DFE` 是 `-D -F -E` 的合写，草稿、未来日期与已过期的页面在写作期间都能看到。`--renderToMemory` 让这些页面不落进 `public/`，之后部署时就不会被误带上线。

### 改动没有生效 {#fast-render}

Hugo 默认只重新渲染它判断受影响的部分，而布局、配置、`data/` 或被 `include` 引用的文件改动后，这个判断偶尔会漏。页面看起来没变时：

1. 加 `--disableFastRender` 重启。
1. 强制刷新浏览器（`Cmd`/`Ctrl` + `Shift` + `R`），排除浏览器缓存。
1. 仍然是旧内容，就[清缓存](#clean-caches)后重启。
{.steps}

### 从其它设备访问 {#bind}

预览服务器只监听 `127.0.0.1`，手机或另一台电脑访问不到。要让它们访问，就监听所有网卡，并把对方能访问的地址写进 `--baseURL`：

```bash {title="终端"}
hugo server --bind 0.0.0.0 --port 1313 --baseURL http://192.168.1.10:1313/
```

不写 `--baseURL` 时页面也能打开，但样式表、搜索索引这些走绝对路径的资源仍然指向 `localhost`。

## 生产构建 {#production-build}

要部署的产物只用 `hugo` 构建，不用 `hugo server`：

```bash {title="终端"}
hugo --cleanDestinationDir --gc --minify --printPathWarnings
```

`public/` 是自包含的，可以脱离源码树拷到任何地方。四个开关各有用处：

| 开关 | 为什么 |
| --- | --- |
| `--cleanDestinationDir` | 删除本次构建没有写出的文件，已经删掉的页面不会继续留在线上 |
| `--gc` | 清掉 `resources/_gen` 里已经没有引用的处理结果 |
| `--minify` | 压缩 HTML、CSS、JS 与 XML 输出 |
| `--printPathWarnings` | 两个页面抢同一个输出路径时告警，这是多语言站点最常见的静默错误 |
{.fields}

构建成功的最后一行是 `Total in …`。部署前读一遍告警：每条告警都指出一个被主题忽略的设置，构建则用安全的默认值继续完成。

产物一旦离开本机，有两项设置就很要紧。`baseURL` 决定所有绝对链接，包括 `/docs/` 这样的子路径，见[确定 baseURL](/zh/docs/admin/deploy/#baseurl)。构建环境（`hugo` 默认 `production`，`hugo server` 默认 `development`）决定页面是否请求收录、是否加载统计脚本，见[预览部署不要被收录](/zh/docs/admin/deploy/#preview-builds)。

## 容器内预览 {#container}

容器不是必需的。团队希望所有人用同一套工具链，或者不想在每台机器上安装 Hugo 时，它才派得上用场。

```dockerfile {title="Dockerfile" collapse=16}
FROM debian:bookworm-slim

ARG HUGO_VERSION=0.170.1
ARG TARGETARCH

COPY --from=golang:1 /usr/local/go /usr/local/go

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl git \
    && curl --fail --location -o /tmp/hugo.deb \
      "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}_linux-${TARGETARCH}.deb" \
    && apt-get install -y /tmp/hugo.deb \
    && rm -rf /var/lib/apt/lists/* /tmp/hugo.deb

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

`HUGO_VERSION` 设为团队实际使用的版本（OINK 已在 `0.170+` 上测试）。仍固定在 OINK 1.5.1 或更早版本的站点要换一个软件包，见[版本升级](/zh/docs/admin/upgrade/#hugo-extended)。

镜像里装 Go，是因为主题以 Hugo Module 方式引入时，Hugo 要靠 Go 下载模块。用 submodule、离线归档或直接克隆的站点可以去掉 Go，镜像会小很多。镜像里没有任何东西需要 Node.js、npm 或 PostCSS，构建也不下载浏览器资源，因此在网络隔离环境里，只需预先镜像基础镜像以及 Hugo、Go 两个软件包。

> [!WARNING] 不要让 root 写 `public/`
> 容器默认以 root 运行，root 写出的 `public/` 在宿主机上不用 `sudo` 就删不掉。用 `--user "$(id -u):$(id -g)"` 映射自己的用户 ID，上面的生产构建命令已经这样做了。

## 清缓存 {#clean-caches}

Hugo 把中间产物放在三处。按症状清能解释它的最小范围：

| 目录 / 命令 | 内容 | 什么时候清 |
| --- | --- | --- |
| `public/` | 上一次的构建产物 | 删掉的页面线上还在；`hugo --cleanDestinationDir` 会在构建时顺带清理 |
| `resources/_gen/` | 处理过的图片 | 改了图片处理参数、字体或主色，页面还是旧样子 |
| `hugo mod clean` | Hugo Module 缓存 | 换了主题版本，解析出来的还是旧版；加 `--all` 清掉整个模块缓存 |
{.fields}

```bash {title="终端"}
rm -rf public resources/_gen
hugo mod clean          # 只清当前项目用到的模块
hugo mod clean --all    # 清整个模块缓存，下次构建重新下载
```

`public/` 与 `resources/` 都写进 `.gitignore`。它们每次构建都会重新生成，提交进仓库只会过期，还会让仓库越来越大。

## 对着本地主题预览 {#theme-workspace}

同时修改主题与站点时，用 `HUGO_MODULE_REPLACEMENTS` 让这一条命令改用本地的主题 checkout。`go.mod` 不动，替换也就不会被误提交：

```bash {title="终端"}
HUGO_MODULE_REPLACEMENTS='github.com/pgsty/oink -> /absolute/path/to/oink' hugo server
```

目录布局和 Go workspace 的替代做法见[从零建站](/zh/docs/start/from-scratch/#local-theme-checkout)。

> [!WARNING] 替换会盖掉你固定的版本
> 只要这个变量还在，或者 Go workspace 处于生效状态，构建用的就是本地 checkout，与 `go.mod` 写的版本无关；CI 任务也可能继承其中任何一个。要构建公开发布的版本，先移除 `HUGO_MODULE_REPLACEMENTS`，设置 `GOWORK=off` 和 `HUGO_MODULE_WORKSPACE=off`，检查 `go.mod` 与 Hugo 配置里有没有持久的 `replace` 指令、站点里有没有 `_vendor/` 副本，再在同一环境下用 `hugo mod graph` 确认精确版本。不要提交写有本机路径的 workspace 文件。

## 断网构建验证 {#air-gapped}

站点要在网络隔离环境里使用时，切断网络，把构建和浏览器两头都测一遍：

1. 从一份已校验的主题归档与空的模块缓存开始（`hugo mod clean --all`）。
1. 阻断出站 HTTP、HTTPS 与 Go module proxy。
1. 运行生产构建 `hugo --gc --minify --printPathWarnings`。
1. 每种语言都浏览一遍：文档页、博客页、首页、404。
1. 实际操作搜索、深浅色切换、图表，以及站点用到的内容组件。
1. 检查所有子资源的来源，确认没有意外的远程主机。
{.steps}

最后一步用输出检查器完成。从与站点固定版本相同的主题 checkout 里运行它，只需要 Python 3。把两个路径换成自己的目录，base URL 与构建时一致：

```bash {title="终端"}
python3 /path/to/oink/bin/check-output-security.py \
  --public /path/to/my-site/public --base-url https://docs.internal.example.com/
```

脚本读取 HTML、打印、Markdown 与 RSS 输出里的每个 `href`、`src`、`srcset`、`poster` 与表单 `action`，要求它们是站内相对路径，或者使用 `http`、`https`、`mailto`、`tel`；行内 `on*` 事件处理器与 `javascript:` URL 一律拒绝。指向其它主机的 `<iframe>`、`<script>`、`<link>`、`<img>`、`<video>`、`<audio>`、`<embed>`、`<object>`、`<source>` 都算错误。站点有意嵌入第三方内容时加 `--third-party`；各语言分布在多个域名时，用 `--allow-host` 补充首方主机。

一次通过只说明这一次构建没问题，每次升级主题后都要重跑。

## 验证 {#verify}

从空缓存开始，避免旧产物掩盖问题：

```bash {title="终端"}
rm -rf public resources/_gen
hugo --gc --minify --printPathWarnings
```

以 `Total in …` 结束且没有 ERROR 即为构建通过。然后确认：

- 日志里没有 npm、PostCSS、Autoprefixer 或下载资源的步骤。出现了，说明配置里残留着 Docsy 的流程。
- `public/` 下有 `sitemap.xml` 和 `robots.txt`，`robots.txt` 内容是 `Allow: /`。
- 启用本地搜索时，`public/` 下每种语言各有一份索引，生产构建的文件名是 `offline-search-index.<语言>.<hash>.json`（开发构建不带 hash）。打开搜索，确认页面 `data-td-index-src` 属性给出的 URL 返回 200。
- 在 `hugo server` 里，文档页、博客页、首页和 404 在每种语言、两种配色下都显示正常。

部署之后，按[验收清单](/zh/docs/admin/deploy/#checklist)在线上站点再查一遍。构建失败或结果不对，见[排错与检查](/zh/docs/admin/troubleshooting/)。

## 相关 {#related}

- [发布上线](/zh/docs/admin/deploy/) — 把 `public/` 发到 GitHub Pages、Cloudflare 或别处
- [排错与检查](/zh/docs/admin/troubleshooting/) — 构建、语言、搜索与平台故障
- [从零建站与其它安装方式](/zh/docs/start/from-scratch/) — Hugo Module、submodule 还是离线归档
- [配置总览](/zh/docs/customize/config/) — `hugo.yml` 里每个键的定义
