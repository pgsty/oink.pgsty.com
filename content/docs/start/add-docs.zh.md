---
title: 加装文档
linkTitle: 加装文档
description: 在已有开源项目的 docs/ 目录下加装独立的 OINK 文档子项目，正确配置 .gitignore 排除构建产物，并在 GitHub Pages 与 Cloudflare Pages 上实现自动构建部署。
weight: 30
search_keywords:
  [
    加装文档,
    docs 目录,
    开源项目,
    monorepo,
    gitignore,
    GitHub Pages,
    Cloudflare Pages,
    自动构建,
    github_subdir,
    CI,
  ]
---

你已经有一个正在开发的开源项目——Go 服务、Rust 命令行工具、Python 库或数据库扩展——希望文档和代码住在同一个仓库里，每次提 PR 都能同步更新文档，又不想让静态站工具链干扰主工程，更不想把生成的 HTML 混进 Git 历史。把一个自包含的 OINK 子项目放进 `docs/` 目录，就能干净地解决这件事。

这种同库子目录布局的真实生产案例，可以参考 [AGW](/zh/case/agw/)：它在应用主仓库的子目录里维护了完整的中英双语文档与产品落地页。

## 仓库目录结构 {#layout}

把 Hugo 配置、模块锁文件和文档内容全部收口在 `docs/` 内：

```filetree {title="my-project/"}
- my-project/
  - cmd/                     # 主项目自身的代码目录
  - internal/
  - go.mod                   # 主项目自己的 go.mod（如果是 Go 项目）
  - README.md
  - .gitignore               # 精准排除 docs/ 下的构建产物，不误伤主项目
  - .github/
    - workflows/
      - ci.yaml              # 主项目原有的测试 workflow
      - docs.yaml            # 只在 docs/ 变更时构建并发布文档
  - docs/                    # 自包含的 OINK 文档子项目
    - hugo.yml               # 文档站配置（注意填写 github_subdir: docs）
    - go.mod                 # 固定 github.com/pgsty/oink@vX.Y.Z
    - go.sum                 # 校验固定版本的 OINK
    - content/
      - _index.md
      - docs/
        - _index.md
        - install.md
    - data/
      - home/
        - en.yaml
    - assets/
      - icons/logo.svg
    - static/
      - favicon.svg
```

让 `docs/` 拥有自己独立的 `go.mod` 是关键设计：哪怕主项目本身就是 Go 工程、根目录已经有 `go.mod`，两套模块依赖也完全隔离，文档主题绝不会污染主程序的依赖树。

## 初始化 `docs/` 子项目 {#init}

先按[准备工具](/zh/docs/start/#tools)装好 Git、Go 和 Hugo，再从主项目仓库根目录依次执行以下步骤：

1. ### 创建 `docs/` 并固定 OINK 版本 {#init-module}

   ```bash {title="终端"}
   mkdir -p docs/content/docs
   cd docs
   hugo mod init github.com/OWNER/PROJECT/docs
   hugo mod get github.com/pgsty/oink@{{< param tdVersion.latest >}}
   ```

   模块路径以 `/docs` 结尾，与主项目根模块区分开。把 `docs/go.mod` 和 `docs/go.sum` 一并提交到 Git，确保 CI 拉取到与本机完全一致的主题标签。

1. ### 编写 `docs/hugo.yml` 并设置 `github_subdir` {#init-config}

   在 `docs/` 下创建 `hugo.yml`。与独立文档仓库相比，这里最容易漏掉的一行是 `params.github_subdir: docs`——缺了它，标题旁页面操作菜单中的「编辑当前页面」和历史记录链接都会指向仓库根下的 `/content/...`，点开就是 404。

   ```yaml {title="docs/hugo.yml" collapse=30}
   title: My Project
   baseURL: https://OWNER.github.io/PROJECT/
   defaultContentLanguage: en
   enableGitInfo: true

   languages:
     en:
       label: English
       locale: en-US
       weight: 1
       title: My Project
       params:
         description: Documentation for My Project
       menus:
         main:
           - { name: Docs, pageRef: /docs, weight: 20 }

   markup:
     goldmark:
       renderer:
         unsafe: true
       parser:
         attribute:
           block: true
         wrapStandAloneImageWithinParagraph: false
     highlight:
       noClasses: false

   params:
     offline_search: true
     github_repo: https://github.com/OWNER/PROJECT
     github_branch: main
     github_subdir: docs # Hugo 站点放在 docs/ 子目录时必填
     ui:
       preset: paper
       preset_menu: [paper, slate, ink, terminal]
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
       min: '{{< param hugoMinVersion >}}'
   ```

1. ### 写第一页并本地预览 {#init-preview}

   创建 `docs/content/docs/_index.md` 和 `docs/content/docs/install.md`（最小示例见[从零开始](/zh/docs/start/from-scratch/#first-page)），然后在仓库根目录通过 `-s docs` 启动预览（或 `cd docs && hugo serve`）：

   ```bash {title="终端（在仓库根目录执行）"}
   hugo serve -s docs
   ```

   打开 <http://localhost:1313/docs/>，点一下标题旁页面操作菜单中的「编辑当前页面」，确认跳转地址正好指向仓库中的 `docs/content/docs/...`。
{.steps}

## 配置 `.gitignore` 排除生成文件 {#gitignore}

Hugo 构建会在文档目录下写出静态 HTML、图片缓存、锁文件和模块缓存。首次构建之前，先在仓库根目录的 `.gitignore` 中加上带 `docs/` 前缀的忽略规则——这样既能挡住所有构建产物，避免仓库膨胀和合并冲突，又不会误伤主项目中可能同名的 `public/` 或 `resources/` 源码目录：

```gitignore {title=".gitignore（仓库根目录）"}
# OINK / Hugo 文档构建产物与本地缓存
docs/public/
docs/resources/
docs/.hugo_build.lock
docs/.hugo_cache/
go.work
go.work.sum
```

哪些文件该排除、哪些文件必须提交，一眼看清：

| 路径 | 是否提交 Git | 原因 |
| --- | --- | --- |
| `docs/public/` | **忽略** | 生成的静态 HTML/CSS/JS，每次部署由 CI 全新构建 |
| `docs/resources/` | **忽略** | 图片处理缓存（`_gen/`），提交旧副本只会撑大仓库 |
| `docs/.hugo_build.lock` | **忽略** | Hugo 运行时的临时构建锁文件 |
| `docs/.hugo_cache/` | **忽略** | 本地或 CI 使用的 Hugo 缓存目录 |
| `go.work`、`go.work.sum` | **忽略** | 本机路径工作区，提交会破坏他人与 CI 的构建 |
| `docs/hugo.yml`、`docs/go.mod`、`docs/go.sum` | **提交** | 文档配置与经过校验和锁定的 OINK 版本 |
| `docs/content/`、`docs/data/`、`docs/assets/`、`docs/static/` | **提交** | 文档正文、首页数据、Logo、自定义 CSS 与静态资源 |

跑一遍生产构建并用 `git status --short` 验证工作区干净，没有任何构建产物变成未跟踪文件：

```bash {title="终端"}
hugo -s docs --cleanDestinationDir --gc --minify --environment production --printPathWarnings
git status --short
```

## 在 GitHub Pages 配置自动构建 {#github-pages}

在主仓库添加一份 `.github/workflows/docs.yaml`。与独立文档仓库相比，关键区别只有两点：构建步骤统一加上 `working-directory: docs`（同时把 Go 缓存路径设为 `docs/go.sum`、产物路径设为 `docs/public`），并用 `paths:` 过滤触发条件，让纯代码提交不白白触发文档重建。

```yaml {title=".github/workflows/docs.yaml" lineNos="inline" collapse=30}
name: Deploy Docs to GitHub Pages

on:
  push:
    branches: [main]
    paths:
      - 'docs/**'
      - '.github/workflows/docs.yaml'
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: github-pages
  cancel-in-progress: false

env:
  GO_VERSION: 1.27.4
  # 禁止工作区覆盖 docs/go.mod 固定的主题版本
  GOWORK: off
  HUGO_MODULE_WORKSPACE: off
  HUGO_CACHEDIR: ${{ github.workspace }}/docs/.hugo_cache

jobs:
  build:
    name: Build docs
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: docs
    steps:
      - name: Check out repository
        uses: actions/checkout@v7
        with:
          fetch-depth: 0 # enableGitInfo 需要完整提交历史来计算最后修改时间

      - name: Set up Go
        uses: actions/setup-go@v7
        with:
          go-version: ${{ env.GO_VERSION }}
          check-latest: true
          cache-dependency-path: docs/go.sum

      - name: Configure GitHub Pages
        id: pages
        uses: actions/configure-pages@v6

      - name: Install Hugo
        uses: peaceiris/actions-hugo@v3
        with:
          hugo-version: latest

      - name: Download OINK module
        run: go mod download github.com/pgsty/oink

      - name: Build production site
        run: |
          hugo --cleanDestinationDir --gc --minify --environment production \
            --printPathWarnings \
            --baseURL "${{ steps.pages.outputs.base_url }}/"

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v5
        with:
          path: docs/public

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

这套自动构建背后的逻辑很清晰：

- **`paths: ['docs/**', '.github/workflows/docs.yaml']`**：只有改动了文档或这份 workflow 才会自动构建发布；保留 `workflow_dispatch` 方便随时手动触发。
- **`defaults.run.working-directory: docs`**：让 `go mod download` 和 `hugo` 只作用于 `docs/go.mod` 与 `docs/hugo.yml`，完全不碰仓库根目录的 `go.mod`。
- **`--baseURL "${{ steps.pages.outputs.base_url }}/"`**：直接传入 GitHub Pages 分配的真实地址（包含项目子路径 `/<PROJECT>/`），避免搜索索引、样式表和 canonical 链接 404。
- **`--printPathWarnings` 且不加 `--panicOnWarning`**：把 OINK 的告警完整打在日志里供检查，但不把非致命诊断升级为构建中断。

最后到 GitHub 仓库的 **Settings → Pages → Build and deployment → Source**，把来源改成 **GitHub Actions**，推送到 `main` 即可上线。

## 在 Cloudflare Pages 配置自动构建 {#cloudflare-pages}

Cloudflare Pages 同样支持直接发布 `docs/` 子目录，有两种模式。同一个 Cloudflare Pages 项目只选 **一种**，切勿把 Git 集成与 Direct Upload 同时绑在同一个项目上：

{{< tabs group="cf-mode" default="cf-actions" label="Cloudflare 部署模式" >}}
{{< tab label="GitHub Actions Direct Upload（推荐）" value="cf-actions" >}}

在 GitHub Actions 中完成构建，再用 Wrangler 上传 `docs/public`。好处是你能精确掌控 Hugo 和 Go 版本（即使 Cloudflare 内置镜像尚未跟进到 `0.169.0+` 或 Go `1.27.4` 也不受影响），并且可以复用 `paths:` 过滤，只在 `docs/` 变化时部署。

```yaml {title=".github/workflows/docs-cloudflare.yaml" lineNos="inline" collapse=30}
name: Deploy Docs to Cloudflare Pages

on:
  push:
    branches: [main]
    paths:
      - 'docs/**'
      - '.github/workflows/docs-cloudflare.yaml'
  workflow_dispatch:

permissions:
  contents: read
  deployments: write

concurrency:
  group: cloudflare-docs-${{ github.ref }}
  cancel-in-progress: true

env:
  GO_VERSION: 1.27.4
  GOWORK: off
  HUGO_MODULE_WORKSPACE: off
  HUGO_CACHEDIR: ${{ github.workspace }}/docs/.hugo_cache

jobs:
  deploy:
    name: Build and upload docs
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: docs
    steps:
      - name: Check out repository
        uses: actions/checkout@v7
        with:
          fetch-depth: 0

      - name: Set up Go
        uses: actions/setup-go@v7
        with:
          go-version: ${{ env.GO_VERSION }}
          check-latest: true
          cache-dependency-path: docs/go.sum

      - name: Install Hugo
        uses: peaceiris/actions-hugo@v3
        with:
          hugo-version: latest

      - name: Download OINK module
        run: go mod download github.com/pgsty/oink

      - name: Build production site
        env:
          SITE_URL: ${{ vars.CLOUDFLARE_SITE_URL || 'https://my-project.pages.dev/' }}
        run: |
          hugo --cleanDestinationDir --gc --minify --environment production \
            --printPathWarnings \
            --baseURL "${SITE_URL}"

      - name: Upload to Cloudflare Pages
        uses: cloudflare/wrangler-action@v4
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy docs/public --project-name=${{ vars.CLOUDFLARE_PROJECT_NAME || github.event.repository.name }} --branch=${{ github.ref_name }}
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

一次性配置步骤：

1. 在 Cloudflare 控制台创建一个 **Direct Upload** 类型的 Pages 项目。
1. 在 GitHub 仓库中添加 Secrets：`CLOUDFLARE_ACCOUNT_ID` 和 `CLOUDFLARE_API_TOKEN`（权限选 **Account → Cloudflare Pages → Edit**）。
1. 按需设置仓库 Variables：`CLOUDFLARE_PROJECT_NAME`（默认取仓库名），绑定自定义域名（如 `https://docs.example.com/`）后设置 `CLOUDFLARE_SITE_URL`。
{.steps}

{{< /tab >}}
{{< tab label="Cloudflare Git 集成" value="cf-git" >}}

如果你希望由 Cloudflare 直接拉仓库构建、不写 Actions workflow，在 **Workers & Pages → Create → Pages → Connect to Git** 中关联仓库并填写如下设置：

| 配置项 | 填写值 | 原因 |
| --- | --- | --- |
| Root directory（根目录） | `docs` | 让构建在 `docs/` 下运行，读取 `docs/hugo.yml` 与 `docs/go.mod` |
| Build command（构建命令） | `hugo --cleanDestinationDir --gc --minify --environment production --printPathWarnings` | 与 OINK 生产构建参数保持一致 |
| Build output directory（输出目录） | `public` | 相对于根目录 `docs`，实际发布 `docs/public` |
| Include watch paths（监听路径） | `docs/*` | 仅改动主项目代码时跳过文档构建 |
| `HUGO_VERSION` | `{{< param hugoMinVersion >}}` 或更高 | 满足 OINK 的 Hugo 最低版本要求 |
| `GO_VERSION` | `1.27.4` 或更高 | Hugo Module 拉取 `github.com/pgsty/oink` 需要 Go |
| `GOWORK` / `HUGO_MODULE_WORKSPACE` | `off` | 防止工作区覆盖 `docs/go.mod` 中的锁定版本 |

配置分支预览时，把预览环境的构建命令改为附带 `--environment staging --baseURL "$CF_PAGES_URL"`，这样预览地址会输出 `noindex`，不会与生产域名争抢搜索引擎收录。

{{< /tab >}}
{{< /tabs >}}

## 合并前检查 {#verify}

1. 执行 `hugo -s docs --cleanDestinationDir --gc --minify --environment production --printPathWarnings`，确认结尾打印 `Total in …` 且无意外告警。
1. 执行 `git status --short`，确认 `docs/public/`、`docs/resources/` 和 `docs/.hugo_build.lock` 都没有出现在待提交列表中。
1. 提交 `docs/hugo.yml`、`docs/go.mod`、`docs/go.sum`、`docs/content/`、`.gitignore` 与 workflow 文件。
1. 工作流跑绿后打开线上地址，检查搜索、深浅色模式、canonical 链接，并点一次「编辑当前页面」确认落到 `docs/content/` 下的真实文件。
{.steps}

## 相关 {#related}

- [发布上线](/zh/docs/admin/deploy/) — 自定义域名、`baseURL`、CSP 安全头、预览防收录与回滚
- [本地浏览](/zh/docs/start/local/) — 用 `hugo serve -s docs` 边写代码边看文档
- [从零开始](/zh/docs/start/from-scratch/) — 独立 OINK 站点骨架以及离线 / submodule 安装方式
- [配置总览](/zh/docs/customize/config/) — `hugo.yml` 完整参考，包含 `github_subdir` 说明
