---
title: 部署到 Cloudflare Pages
linkTitle: Cloudflare Pages
description: 使用 Cloudflare Pages 构建并发布 Oink 站点。
weight: 30
aliases: [/docs/deployment/cloudflare/]
---

[Cloudflare Pages][]
可以从关联的 GitHub 或 GitLab 仓库构建 Oink 站点，并为评审分支创建预览部署。消费端直接运行 Hugo
Extended，无需安装前端软件包。

## 配置项目 {#configure-the-project}

在 **Workers & Pages** 中导入仓库，选择生产分支，并使用以下设置：

| 设置                      | 值                           |
| ------------------------- | ---------------------------- |
| 生产分支                  | `main`，或经过评审的源码分支 |
| 构建命令                  | `hugo --gc --minify`         |
| 构建输出目录              | `public`                     |
| `HUGO_VERSION`            | `0.164.0`                    |
| `SKIP_DEPENDENCY_INSTALL` | `1`                          |

请在 Production 与 Preview 环境中都设置 `HUGO_VERSION`。Cloudflare Pages 的 v3
[构建镜像][]当前默认使用 Hugo `0.147.7`，低于 Oink 要求的最低版本
`0.160.1`。固定已经验证的版本，可以避免构建镜像更新时静默改变工具链。`SKIP_DEPENDENCY_INSTALL=1`
会禁用 Oink 消费端不需要的通用依赖安装步骤。

如果 Hugo 站点不在仓库根目录，请把 **Root directory**
设置为站点目录。输出目录相对于这个根目录解析。

## 设置 base URL {#set-the-base-url}

生产构建应在 `baseURL`
中使用站点的规范自定义域名。如果预览需要在 canonical 与绝对链接中使用自动生成的 Pages
URL，可以运行：

```sh
hugo --gc --minify --baseURL "$CF_PAGES_URL"
```

不得把这份预览产物直接发布到生产环境；生产发布前必须使用规范域名重新构建。

## 部署并验证 {#deploy-and-verify}

保存配置并检查第一次构建日志。正常的 Oink 消费端构建应该直接运行 Hugo，不执行 npm、PostCSS、Autoprefixer，也不下载主题自有 CDN 资源。部署后检查：

- `*.pages.dev` 预览地址或自定义域名提供的是预期 commit；
- 英文与译文路由使用预期的规范来源；
- 搜索、语言切换、深色模式、打印与代表性组件正常工作；
- 重定向、响应头、自定义域名与 `404` 行为符合 Pages 项目配置。

Cloudflare 的 Git 集成与 Direct
Upload 是不同的项目模式。如果后续必须接入外部部署流水线，请在选择模式前核对当前 Pages 文档。

[Cloudflare Pages]:
  https://developers.cloudflare.com/pages/framework-guides/deploy-a-hugo-site/
[构建镜像]: https://developers.cloudflare.com/pages/configuration/build-image/
