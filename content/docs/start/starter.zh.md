---
title: 使用 OINK Starter
linkTitle: OINK Starter
description: 按身份、语言、首页、内容、导航、品牌、集成、部署的顺序，把官方 Starter 逐层变成你的项目站点。
weight: 10
icon: fa-solid fa-wand-magic-sparkles
search_keywords: [OINK Starter, GitHub 模板, Use this template, 定制 Starter, starter repository]
---

[`pgsty/oink-starter`](https://github.com/pgsty/oink-starter) 是新建 OINK
站点的正式起点。它刻意小于 `oink.pgsty.com`：不会把主题文档、分析账号、评论仓库、
浏览器回归套件或 PGSTY 品牌复制进你的项目。

当前模板固定 OINK {{% param version %}}、Go 1.26 与 Hugo Extended 0.165.0。
默认三语、仅英文、英中双语三个 profile 都已经在这个版本上完成 warning 即失败的
严格构建。

## 模板包含什么 {#contents}

| 表面 | 内置基线 | 第一个决定 |
| --- | --- | --- |
| 语言 | 英语、简体中文、法语 | 保留三语，或选择内置单语 / 双语 profile |
| 内容 | Docs、Blog 与一本简短 Book 教程 | 重写示例；确认整个表面不需要时才整棵删除 |
| 首页 | 每种语言一份精简 `data/home/<lang>.yaml` | 替换项目承诺与入口 |
| 品牌 | 中性 Logo 与 favicon | 有正式项目图形之前先保留 |
| 集成 | 仓库、Giscus、分析、分享、反馈示例均被注释 | 只启用你准备长期运营的完整配置 |
| 部署 | GitHub Pages 与 Cloudflare Pages Direct Upload workflow | 选择一条生产路径并验证真实 URL |

Starter 自己的 `/book/` 是一份从预览到部署的四章短教程。本页是维护者级版本：
说明修改顺序、各层边界，以及每层之后应执行的检查。

## 创建自己的仓库 {#create-repository}

### 推荐使用 GitHub 模板 {#github-template}

打开 [Starter 仓库](https://github.com/pgsty/oink-starter)，点击
**Use this template → Create a new repository**，再克隆 GitHub 在你的账号或组织下
创建的仓库：

```bash
git clone https://github.com/OWNER/PROJECT-DOCS.git
cd PROJECT-DOCS
hugo server
```

这样站点从一开始就有自己的 Git 历史，原始 Starter 只是上游参考，不会成为一个
可能误推送的 remote。

### 克隆原始仓库进行评估 {#clone-original}

只做一次性本地评估时执行：

```bash
git clone https://github.com/pgsty/oink-starter.git
cd oink-starter
hugo server
```

真实项目不要从删除这个 clone 的 `.git` 目录开始。GitHub 模板操作已经创建了清晰的
项目边界，并保留可审计的初始提交。

## 修改前先预览 {#preview}

依次打开：

- `/`、`/zh/`、`/fr/`：三个首页；
- `/docs/`、`/blog/`、`/book/`：三种内容表面；
- 任意一组译文，再操作语言切换器；
- 本地搜索、深浅色切换，以及一个窄屏视口。

同时记录实际解析的模块：

```bash
hugo mod graph | grep github.com/pgsty/oink
```

结果应当是 `github.com/pgsty/oink@{{% param version %}}`。这份未修改的预览，是后面
判断每次改动的基线。

## 分层定制 {#customize}

### 第一层：站点身份 {#identity}

修改 `hugo.yaml` 顶部标有 `CHANGE ME` 的两个值：

```yaml {title="hugo.yaml"}
title: &siteTitle Project Name
baseURL: https://example.org/
```

标题的 YAML 锚点会把站名带进所有已启用语言。接着修改版权人，并在新仓库已存在后
取消仓库链接的注释：

```yaml {title="hugo.yaml"}
params:
  copyright:
    authors: '[项目贡献者](https://example.org/community/)'
    from_year: 2026
  github_repo: https://github.com/OWNER/PROJECT-DOCS
  github_branch: main
```

重新运行 `hugo server`，检查浏览器标题、页脚、编辑 / 历史链接与 canonical URL。
项目图形尚未定稿时先不要改 Logo；文字身份更容易先完成评审。

### 第二层：语言 profile {#languages}

根配置默认启用英语、中文和法语。如果这不是目标语言组合，请在其它配置修改之前
选择内置 profile：

```bash
cp examples/hugo.single.yaml hugo.yaml     # 仅英文
cp examples/hugo.bilingual.yaml hugo.yaml  # 英文 + 中文
```

这两份是完整的最小配置，不是可以叠加的片段；复制会覆盖根文件里那些被注释的集成
示例。因此应在最开始做；`hugo.yaml` 已有项目修改时，只合并 `languages` 与
`disableLanguages`，不要整文件覆盖。

未启用语言仍保留声明，让 Hugo 能识别 `.zh.md` 与 `.fr.md` 是译文并安全忽略。
要永久移除一种语言，先确认所选 profile 能构建，再删除对应内容与首页数据。

### 第三层：首页 {#home}

首页是数据，不是难以维护的整页模板覆盖：

```text
data/home/en.yaml
data/home/zh.yaml
data/home/fr.yaml
```

先改一种语言。每个文件里的 `sections` 决定顺序，`hero`、`cards`、`cta` 提供内容。
保持结构，替换项目承诺、目标 URL 与示例卡片。第一种语言确认无误后，再把同一组事实
翻译到已启用语言。

需要其它组合时，使用[首页与落地页](/zh/docs/customize/home/)中的完整注册表；不要复制
Starter 的首页 partial，因为这里本来就没有站点自有模板。

### 第四层：内容与导航 {#content-navigation}

重写或删除 `content/` 下的示例叶子页面。确定整个表面不属于你的项目之前，先保留
栏目根：

```text
content/docs/  参考与任务文档
content/blog/  文章、设计记录与发布说明
content/book/  连续阅读的长篇指南
```

内容树就是侧栏。顶部导航写在各语言 `_index` 根页的 `menus.main` 里，因此给 Docs、
Blog 或 Book 改名时，修改发生在它所描述的内容旁边，而不是另一棵全局菜单树。译文
并排放置，对应标题使用相同的显式 ID：

```text
page.md
page.zh.md
page.fr.md
```

新增自定义导航数据之前，先读[组织内容](/zh/docs/write/organize/)；大多数站点使用生成树
已经足够。

### 第五层：品牌与阅读功能 {#brand-features}

正式图形准备好后，替换 `assets/icons/logo.svg` 与 `static/favicon.svg`。随后一次只启用
一组最小而有用的配置：

```yaml {title="hugo.yaml"}
params:
  ui:
    theme_color: '#245f94'
    typography: system
    image_zoom: true
    share: [mastodon, linkedin, email, copy]
```

自定义本地字体时，用 `params.ui.fonts` 写字体族，或者在站点 CSS 中声明字体文件。
布局、侧栏、搜索与组件配置应查询[配置总览](/zh/docs/customize/config/)，不要复制
`oink.pgsty.com` 那份大得多的站点配置。

### 第六层：外部集成 {#integrations}

Starter 默认关闭或注释了仓库操作、Giscus、Google Analytics、反馈与分享。只有
必需事实全部明确时才启用：

- 仓库链接需要真实 owner、repository 与 branch；
- Giscus 需要仓库 / 分类名称和不可变 ID；
- Google Analytics 需要项目自己的 measurement ID；
- 反馈只有在分析存在时才记录结构化 `gtag` 事件；
- 助手链接会把当前 URL 发送给第三方，因此必须做显式策略选择。

不完整的可选块应继续保持注释。各集成的运营边界见[启用评论](/zh/docs/admin/comments/)、
[分析与 SEO](/zh/docs/admin/analytics/)和[仓库与页面信息](/zh/docs/customize/repository/)。

## 构建与部署 {#build-deploy}

### 严格本地构建 {#strict-build}

启用托管 workflow 前执行：

```bash
hugo --cleanDestinationDir --gc --minify --environment production \
  --printPathWarnings --panicOnWarning
```

提交 `hugo.yaml`、`go.mod` 与 `go.sum`；不要提交生成的 `public/`、`resources/`、模块
缓存或本地模块替换。

### GitHub Pages {#github-pages}

Starter 已包含 `.github/workflows/github-pages.yaml`。在
**Settings → Pages** 中选择 **GitHub Actions** 作为 Source。推送到 `main` 后，
workflow 使用固定工具链构建，向 GitHub 查询正确的项目子路径，再通过 Pages 部署
API 发布 `public/`。

### Cloudflare Pages {#cloudflare-pages}

内置 `.github/workflows/cloudflare-pages.yaml` 使用 Direct Upload。创建 Pages
Direct Upload 项目，添加 `CLOUDFLARE_ACCOUNT_ID` 与 `CLOUDFLARE_API_TOKEN`，再手动
运行一次 workflow。设置仓库变量 `CLOUDFLARE_PAGES_ENABLED=true` 后才会自动部署；
规范地址不是默认 `pages.dev` 域名时，再设置 `CLOUDFLARE_SITE_URL`。

同一个项目只选 Direct Upload 或 Cloudflare Git integration 其中一种。完整托管对比
与 `baseURL` 规则见[发布上线](/zh/docs/admin/deploy/)。

## 验证并删除示例 {#verify}

宣布站点完成前：

1. 搜索 `Project Name`、`example.org`、`OWNER`、`PROJECT` 等占位符，逐项确认剩余位置
   是否有意保留。
1. 在桌面与移动端打开每种已启用语言的根，以及代表性的 Docs、Blog、Book 页面。
1. 确认语言切换落到对页，而不是首页。
1. 验证搜索、深色模式、一个组件、Markdown 输出、打印、404、canonical URL 与仓库操作。
1. 把部署 workflow 和公开 URL 与本地构建分开检查。
{.steps}

删除示例 Book 或 Blog 之前，要同时移除对应顶部菜单根，以及首页上指向它的卡片。每整棵
删除一个表面就严格重建一次，才能让失败归因到单一改动。

## 下一步 {#next}

用 [Starter 仓库导览](/zh/docs/start/anatomy/)查询文件职责，再继续阅读
[编写页面](/zh/docs/write/pages/)与[配置总览](/zh/docs/customize/config/)。已有站点不应
继承 Starter 内容模型时，改走[从零建站](/zh/docs/start/from-scratch/)路径。
