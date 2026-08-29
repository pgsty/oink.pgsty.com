---
title: Starter 仓库导览
linkTitle: 仓库导览
description: oink-starter 的文件级地图：身份、语言、首页、内容、导航、品牌、部署与固定主题分别由哪里管理。
weight: 20
search_keywords: [Starter 结构, 仓库导览, 目录结构, anatomy, hugo.yaml, content, data home, workflows]
aliases:
  - /docs/about/architecture/
---

本页说明从 [`pgsty/oink-starter`](https://github.com/pgsty/oink-starter)
创建的仓库，不再介绍大得多的 `oink.pgsty.com` 文档与回归测试仓库。主题源码不会
复制进任何一个站点：`go.mod` 以 Hugo Module 形式固定版本，Hugo 把解析结果存进
Go 模块缓存。

## 顶层地图 {#layout}

```filetree {title="oink-starter/"}
- oink-starter/
  - hugo.yaml                         # 身份、语言、输出、参数与模块导入
  - go.mod                            # 站点模块与精确 OINK 版本
  - go.sum                            # 模块校验和
  - examples/
    - hugo.single.yaml                # 仅英文的完整 profile
    - hugo.bilingual.yaml             # 英文 + 中文的完整 profile
  - data/
    - home/
      - en.yaml                       # 每种语言一份精简落地页
      - zh.yaml
      - fr.yaml
  - content/
    - _index.md                       # 各语言首页根
    - _index.zh.md
    - _index.fr.md
    - docs/                           # 简介、快速上手、教程、参考
    - blog/                           # 文章、设计记录、发布说明
    - book/                           # 介绍 Starter 的连续教程
  - assets/
    - icons/logo.svg                  # 经 Hugo 处理的项目 Logo
  - static/
    - favicon.svg                     # 原样复制到站点根
  - i18n/
    - fr.yaml                         # Starter 自有法语界面覆盖
  - .github/workflows/
    - github-pages.yaml               # 严格构建与 GitHub Pages 部署
    - cloudflare-pages.yaml           # 严格构建与 Cloudflare Direct Upload
  - README.md                         # 面向仓库维护者的操作摘要
  - LICENSE                           # 模板源码许可证
```

生成的 `public/`、`resources/`、`.hugo_build.lock` 与模块缓存是被忽略的构建状态，
不是源码。

## 最先修改什么 {#change-first}

| 路径 | 职责 | 第一次操作 |
| --- | --- | --- |
| `hugo.yaml` | 身份、规范 URL、语言、输出、主题功能、可选集成 | 修改两个标记值；其它修改前先选择语言 profile |
| `data/home/` | 首页承诺、卡片与行动入口 | 一种语言确认后，再重写所有已启用语言 |
| `content/` | 全部读者可见内容 | 替换示例叶子；确认整个表面不要时才删除栏目根 |
| `assets/icons/logo.svg` | 经处理的 Logo | 有正式图形后再替换 |
| `static/favicon.svg` | 浏览器图标 | 与 Logo 一起评审后替换 |
| `hugo.yaml` 中的 `params.github_*` | 编辑、历史、新建页面与 issue 链接 | 目标仓库已存在后才取消注释 |

## 哪些必须保留 {#keep}

- `go.mod` 与 `go.sum`：两者共同固定并校验 OINK {{% param version %}}，都要提交。
- `hugo.yaml` 中三项 Goldmark 设置：原生 Steps、Cards、Fields、图片属性与 Book
  目标都依赖它们。
- `outputs`：删除 `markdown`、`LLMS` 或 `print`，会有意删除对应的 Markdown、
  Agent 索引或打印表面。
- workflow 中的 `fetch-depth: 0`：保留 `enableGitInfo` 时，最后修改与贡献者事实需要
  完整 Git 历史。
- CI 中的 `GOWORK: off` 与 `HUGO_MODULE_WORKSPACE: off`：开发者本地 workspace 不得
  替换 CI 正在验证的公开版本。

## 可选表面 {#optional}

Docs、Blog 与 Book 是彼此独立的顶层表面。安全删除其中一个的顺序是：

1. 删除对应的 `content/<surface>/` 内容树；
1. 删除首页指向它的卡片或链接；
1. 确认其它页面不再链接它；
1. 严格构建，并检查剩余顶部导航。
{.steps}

不要只删除某种语言的栏目根：那会形成难以区分「有意不对称」与「漏译」的语言专属导航
和回退行为。要么在所有已启用语言中删除整个表面，要么明确记录这种不对称。

完成语言选择后，`examples/` 下两个配置 profile 可以删除，也可以作为参考保留；真正
生效的站点配置只有根目录 `hugo.yaml`。

## 内容与导航 {#content-navigation}

Docs 与 Book 下的目录结构和 `weight` 共同形成侧栏与翻页顺序。顶部导航来自栏目根的
`menus.main`。译文根重复相同的 `identifier`、`parent` 与 weight，只翻译可见标签。

Starter 刻意演示 Documentation System 内容模型：

- 简介回答是什么、为什么；
- 快速上手帮助新用户得到结果；
- 教程带领读者完成端到端任务；
- 参考记录精确的受支持行为。

可以按项目需要改名或重组，但应保留不同学习路径之间的分工，不要把所有答案混进一棵树。

## 语言模型 {#languages}

英文源码以 `.md` 结尾，中文和法语对页分别以 `.zh.md`、`.fr.md` 结尾。首页数据按
`data/home/` 下的语言键分文件。根 profile 声明语言、locale、顺序与站点描述。

单语与双语 profile 仍声明被禁用的语言，这是有意设计：Hugo 会把未使用后缀识别为
译文，而不会把多个文件渲染到同一个英文 URL。只在项目配置开始前复制 profile；之后
应手工合并。

## OINK 在哪里 {#theme}

两个文件建立模块边界：

```yaml {title="hugo.yaml"}
module:
  imports:
    - path: github.com/pgsty/oink
  hugoVersion:
    extended: true
    min: '{{< param hugoMinVersion >}}'
```

```go-mod {title="go.mod"}
module github.com/OWNER/PROJECT-DOCS

go 1.27.0

require github.com/pgsty/oink {{< param tdVersion.latest >}}
```

`hugo mod graph` 显示实际解析版本。生产使用 `go.mod` 中的精确标签；本地
`HUGO_MODULE_REPLACEMENTS` 只是开发覆盖，绝不能提交，也不能当成发布证明。

## 部署文件 {#deployment}

GitHub Pages workflow 在推送 `main` 后自动运行；仓库设置必须选择 GitHub Actions
作为 Pages Source。Cloudflare workflow 默认手动运行，只有仓库变量
`CLOUDFLARE_PAGES_ENABLED=true` 存在时才自动执行；所需账号 ID 与 API token 始终
保存在仓库 secrets 中。

只保留实际运营的部署路径。Cloudflare Direct Upload 与 Cloudflare Git integration
是同一个项目的两种所有权模型，不是应当同时运行的两道关卡。

## 安全的定制顺序 {#order}

1. 证明未修改的预览可用。
1. 修改身份并选择语言。
1. 替换一种首页，再补齐译文。
1. 替换内容并验证导航。
1. 品牌与阅读功能一次只改一组。
1. 启用完整的外部集成。
1. 执行严格生产构建。
1. 部署，再独立验证生产环境。
{.steps}

仓库已经属于自己后，每层之间做一次提交。小边界能让后续回归与回滚明确归因到一个决定。

## 验证 {#verify}

```bash
hugo mod graph | grep github.com/pgsty/oink
hugo --cleanDestinationDir --gc --minify --environment production \
  --printPathWarnings --panicOnWarning
git status --short
```

模块图应显示固定发布，构建没有警告或错误，Git 状态只包含源码修改而没有 `public/` 或
缓存。之后打开所有已启用语言的根，以及代表性的 Docs、Blog、Book 路由，再进入部署。

## 相关 {#related}

- [使用 OINK Starter](/zh/docs/start/starter/) — 完整分层流程
- [从零建站](/zh/docs/start/from-scratch/) — 不采用这套内容模型，只接入 OINK
- [组织内容](/zh/docs/write/organize/) — 侧栏、翻页与菜单权威
- [配置总览](/zh/docs/customize/config/) — 当前全部站点参数
- [发布上线](/zh/docs/admin/deploy/) — 托管商配置与生产检查
