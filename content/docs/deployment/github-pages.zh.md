---
title: 部署到 GitHub Pages
linkTitle: GitHub Pages
description: 仅使用 Hugo 将 OINK 站点部署到 GitHub Pages。
---

如果源码托管在 [GitHub][]，只需一份 Actions 工作流，就能通过 GitHub
Pages 构建并发布站点。消费站点需要 Hugo
Extended，但不需要 Node.js、npm、PostCSS，也不需要生成专门的部署分支。

项目站点的 URL 形如
`https://<OWNER>.github.io/<REPOSITORY>/`；用户和组织站点使用
`https://<OWNER>.github.io/`。GitHub Pages 也支持自定义域名。

## 准备代码仓库 {#prepare-the-repository}

把完整的站点源码推送到 GitHub，并确认在仓库根目录执行以下命令能够成功：

```sh
hugo --gc --minify
```

将站点的 `baseURL` 设为生产 URL，或者在工作流中通过 Hugo 的 `--baseURL`
参数传入 Pages
URL。项目站点必须包含仓库路径，否则 CSS、JavaScript 和其他资源会从错误的位置解析。

## 添加 Pages 工作流 {#add-the-pages-workflow}

创建 `.github/workflows/pages.yml`，内容如下。请让 `HUGO_VERSION`
始终与主题已经验证的版本保持一致。

```yaml
name: Deploy Hugo site to Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

env:
  HUGO_VERSION: 0.164.0

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          submodules: recursive
      - name: Install Hugo Extended
        run: |
          curl -L -o hugo.deb \
            "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb"
          sudo dpkg -i hugo.deb
      - uses: actions/configure-pages@v5
        id: pages
      - name: Build
        run: >-
          hugo --gc --minify --baseURL "${{ steps.pages.outputs.base_url }}/"
      - uses: actions/upload-pages-artifact@v4
        with:
          path: public

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v4
```

如果通过 Git submodule 安装主题，`submodules: recursive`
会在 Hugo 运行前检出主题。如果使用完整离线归档，则可以把相邻的 `theme/`
目录提交到仓库，或在构建输入中恢复该目录。

## 启用 GitHub Pages {#enable-github-pages}

在仓库设置中打开 **Pages**。在 **Build and deployment** 下，将 **Source** 设为
**GitHub Actions**。把工作流推送到 `main`，然后在仓库的 **Actions**
标签页中查看第一次运行。

工作流只上传生成的 `public/` 目录，并通过 Pages 部署 API 发布，不会维护
`gh-pages` 分支。

有关其他身份验证、域名和权限选项，请参阅 GitHub 的
[Pages 文档][GitHub Pages]和 Hugo 的 [GitHub 托管指南][Hugo guide]。

[GitHub]: https://github.com/
[GitHub Pages]: https://docs.github.com/en/pages
[Hugo guide]: https://gohugo.io/host-and-deploy/host-on-github-pages/
