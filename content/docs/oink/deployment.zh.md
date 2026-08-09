---
title: 部署
weight: 60
description: 一次构建 OINK，再发布其静态输出
---

OINK 部署包含两个独立阶段：Hugo 先生成完整的 `public/`
目录，静态托管服务再发布该目录。请把构建验证与线上验证分开，避免把一次成功的本地命令误认为已经完成生产发布。

## 生产构建 {#production-build}

在站点根目录使用固定版本的 Hugo Extended 运行：

```sh
hugo --gc --minify --cleanDestinationDir
```

`--gc` 会清理不再使用的缓存资源，`--minify`
生成生产资源，`--cleanDestinationDir` 删除上次构建残留的文件。如果 `publishDir`
不是站点专用输出目录，使用最后一个参数前必须先检查命令目标。

构建应顺利完成，并且不能用忽略告警的方式掩盖缺失内容、端点或资源。上传前请先在本地检查
`public/`。

## 本地预览 {#local-preview}

编辑期间运行：

```sh
hugo server --disableFastRender
```

Hugo 开发服务器只能证明源码可以渲染；它不是生产托管服务，实时重载行为也不属于生成后的站点。每次发布前都应执行一次干净的生产构建。

## 静态托管 {#static-hosting}

任何能够提供目录和文件的主机都可以发布 OINK：

- 对象存储与 CDN；
- GitHub Pages、GitLab Pages 或类似的 Git 驱动静态托管；
- Netlify、Cloudflare Pages 或其他构建并发布的平台；
- Nginx、Caddy、Apache 或内部文件服务器。

请把 `baseURL` 设置为生产环境 canonical URL。如果站点发布在
`https://example.com/manual/`
之类的子路径下，应包含该路径并进行测试；OINK 的本地资源与组件 URL 设计为支持子路径部署。

## Cloudflare Pages {#cloudflare-pages}

让 Pages 直接连接源分支。OINK 不需要由 GitHub
Actions 预先构建并推送孤立 Pages 分支。

当前 starter 使用以下设置：

| 设置                      | 值                         |
| ------------------------- | -------------------------- |
| 生产分支                  | `main`，或经过审查的源分支 |
| 根目录                    | 独立站点目录               |
| 构建命令                  | `hugo --gc --minify`       |
| 构建输出目录              | `public`                   |
| `HUGO_VERSION`            | `0.164.0`                  |
| `SKIP_DEPENDENCY_INSTALL` | `1`                        |

截至 2026-08-08，Cloudflare Pages v3 构建镜像文档中的默认 Hugo 版本为
`0.147.7`，低于 OINK 最低要求
`0.160.1`。应当在 Production 与 Preview 中都显式设置
`HUGO_VERSION`，不要依赖持续变化的平台默认值。 `SKIP_DEPENDENCY_INSTALL=1`
可阻止平台的通用依赖安装器增加站点并不需要的前端安装步骤。

预览环境如需使用 Pages 生成的地址作为构建 canonical URL，可以运行：

```sh
hugo --gc --minify --baseURL "$CF_PAGES_URL"
```

Cloudflare 官方文档把 `public` 列为 Hugo 标准输出目录，并说明了 `HUGO_VERSION`
覆盖与 `CF_PAGES_URL` base
URL 用法。调整构建镜像或固定 Hugo 版本时，请重新核对平台文档。

[Cloudflare Hugo 指南]:
  https://developers.cloudflare.com/pages/framework-guides/deploy-a-hugo-site/
[Cloudflare 构建镜像]:
  https://developers.cloudflare.com/pages/configuration/build-image/

参阅 [Cloudflare Hugo 指南][]与[Cloudflare 构建镜像][]。

## 网络隔离部署 {#air-gap-deployment}

在断网环境中，应同时传入站点源码与已经验证的主题归档，而不是依赖首次构建时下载 Hugo
Module：

1. 验证主题归档附带的 SHA-256 文件；
2. 在环境中安装受支持的 Hugo Extended 二进制文件；
3. 把主题解压到站点的 `themes/oink/` 目录；
4. 设置 `theme: oink`，并在站点中运行 `hugo --gc --minify`；
5. 把 `public/` 发布到内部静态服务器。

除非已经配置隔离网络内可达的端点，否则请保持 PlantUML 与 Diagrams.net 关闭。外部链接与嵌入内容仍由内容作者负责。

## 响应头与缓存 {#headers-and-caching}

带指纹的 CSS 与 JavaScript 可以使用长期 immutable 缓存。HTML、搜索索引、Feed 与站点地图应使用较短缓存或重新验证，以便新部署及时生效。

项目站点提供了适用于部分托管平台的 `static/_headers`
示例。它只是起点，并非可移植标准。应根据站点实际使用的行内内容与集成审查安全响应头。

## 预览与生产 URL {#preview-and-production-urls}

canonical、`hreflang`、Open Graph、Feed 与绝对链接都依赖
`baseURL`。生产构建应使用生产 URL；如果链接验证或社交元数据需要准确，预览构建可以使用临时地址。

不要把针对预览地址生成的产物直接发布到生产环境；反过来，也不要因为预览中出现有意传入的预览域名就判定失败。

## 部署验收 {#deployment-acceptance}

每一层都要独立验证：

### 源码与配置 {#source-and-configuration}

- 预期提交与固定主题版本确实存在；
- `baseURL`、语言、菜单、仓库元数据与可选端点正确；
- 未发布草稿或秘密信息没有进入公开内容树。

### 构建产物 {#build-artifact}

- 使用固定版本的 Hugo Extended 完成干净生产构建；
- 英文、中文、Feed、站点地图、搜索索引与 `404.html` 均存在；
- 本地资源在根路径与配置的子路径下都能解析；
- 产物包含所需许可证与归属说明。

### 托管站点 {#hosted-site}

- 生产 URL 返回新产物；
- canonical 与备用语言 URL 使用生产域名；
- 导航、搜索、语言切换、深色模式、打印和代表性组件在真实浏览器中工作；
- 重定向、自定义响应头、缓存策略与 `404` 行为符合配置；
- “支持网络隔离”的结论有浏览器网络审计作为依据。

绿色构建日志只完成产物阶段；托管检查全部通过后，部署才算完成。

## 回滚 {#rollback}

保留上一份已知可用的静态产物或托管平台部署标识。新版本未通过线上验证时，应先恢复该产物，再诊断源码或平台行为。使用新的、未固定工具链重新构建旧提交，并不等同于恢复原产物。
