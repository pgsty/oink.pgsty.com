---
title: 启用评论
linkTitle: 启用评论
description: 用 giscus 把 GitHub Discussions 接成页面底部的评论区，全站开、按页关、跟随深浅色。
weight: 30
search_keywords: [评论, giscus, GitHub Discussions, 留言, 讨论, Disqus, comments, discussions]
aliases:
  - /docs/advanced/comments/
---

OINK 的评论走 [giscus](https://giscus.app/zh-CN)：每个页面对应一条 GitHub Discussion，读者用 GitHub 账号登录后发言，维护者在 GitHub Discussions 里审核与管理。主题不提供自建评论后端，也不内置 giscus 以外的服务商。

前提是一个公开的 GitHub 仓库，访客读不到私有仓库的 Discussions。

> [!IMPORTANT] 这是主题里少数对外发请求的功能
> 启用评论的页面会从 `https://giscus.app` 加载脚本和 iframe，网络隔离环境里用不了。它默认关闭，只在显式打开时才加载。站点有隐私政策时，这条外部数据边界应当写进去。

## 准备 GitHub 仓库 {#prepare-github}

1. 选一个公开仓库存放评论线程，可以就是站点源码仓库。

1. 在仓库 Settings → General → Features 里勾选 Discussions。

1. 为该仓库安装 [giscus GitHub App](https://github.com/apps/giscus)。未安装 App 时访客无法评论或表态。

1. 选一个 Discussion 分类。giscus 推荐 Announcements 类型：只有维护者与 giscus bot 能在该类型下新建 Discussion，读者不会误开话题。
{.steps}

仓库 ID 与分类 ID 是公开标识符，不是凭据。不要往 Hugo 配置里放 personal access token、OAuth secret 或密码。

## 生成配置 {#generate}

打开 [giscus.app](https://giscus.app/zh-CN)，按表单填仓库、映射方式和分类，页面下方会生成一段 `<script>`。把里面四个属性抄进 OINK 配置：

| giscus.app 生成的属性 | OINK 配置键 |
| --- | --- |
| `data-repo` | `repo` |
| `data-repo-id` | `repoId` |
| `data-category` | `category` |
| `data-category-id` | `categoryId` |
{.fields}

映射方式（`mapping`）决定哪个页面对应哪条 Discussion。OINK 默认 `pathname`，适合发布路径稳定、同一个仓库要服务多个域名或预览环境的站点。开始收集评论之后再改 `mapping` 或移动页面，giscus 会去找另一条 Discussion：已有评论不会被删除，但页面上再也找不到它们。映射方式要在上线前定好；确实要改 URL 时，同时保留重定向或重命名 Discussion。

## 全站启用 {#enable}

把生成的标识符写进站点配置：

```yaml {title="hugo.yml"}
params:
  comments:
    enable: true
    type: giscus
    giscus:
      repo: pgsty/oink.pgsty.com
      repoId: R_kgDOTzFZAg
      category: Announcements
      categoryId: DIC_kwDOTzFZAs4DDCm-
      mapping: pathname
      inputPosition: bottom
      theme: auto
      loading: lazy
```

上面是本站正在使用的配置。`repo`、`repoId`、`category`、`categoryId` 四个键缺一不可：任何一个缺失或只有空白字符，Hugo 打一条 WARNING 并跳过 giscus，构建不会失败，因此生产构建要带 `--panicOnWarning`。`type` 目前只接受 `giscus`，写别的值同样是告警加跳过。`params.comments` 的键名与 Hextra 同形，从 Hextra 迁来的配置可以照搬。

其余的键（`strict`、`reactionsEnabled`、`emitMetadata`、`term`、`lang`、`lightTheme`、`darkTheme`、`ariaLabel`、`errorMessage`）都有默认值，完整定义见[配置总览](/zh/docs/customize/config/)。功能开关既可以写 YAML 布尔值，也可以写 giscus 风格的 `0` / `1`。

## 按页开关 {#per-page}

front matter 里的 `comments` 可以从任一方向覆盖全站开关，离页面最近的值优先。

只给某些页面开评论。全站关掉但保留完整仓库配置，再让选中的页面显式打开：

```yaml {title="content/blog/2026-roadmap.md"}
---
title: 2026 路线图
comments: true
---
```

只关掉某些页面。全站开着，让不适合讨论的页面退出：

```yaml {title="content/about/security.md"}
---
title: 安全政策
comments: false
---
```

整个栏目统一设置用 cascade。本站在 `content/docs/_index.zh.md` 的 cascade 里写了 `comments: true`，本页底部因此有一个真实的 giscus 评论区。

```yaml {title="content/docs/_index.zh.md"}
---
title: OINK 文档
cascade:
  type: docs
  comments: true
---
```

站点同时配了 `services.disqus.shortname` 时，giscus 优先：giscus 生效即抑制 Disqus，`comments: false` 同时关掉两者，giscus 必填键不全则告警跳过、由 Disqus 兜底。

## 多语言文案 {#i18n}

giscus 的界面语言自动跟随当前 Hugo 语言：简体、繁体、香港繁体分别映射到对应的 giscus locale，不支持的语言回退英文。只有自动选择不合适时才显式设 `lang`。

需要翻译的是 OINK 一侧的两句文案：评论区的无障碍标签与加载失败提示。它们按语言配置，与全局仓库配置合并：

```yaml {title="hugo.yml"}
languages:
  en:
    params:
      comments:
        giscus:
          ariaLabel: Comments
          errorMessage: Comments could not be loaded. Please try again later.
  zh:
    params:
      comments:
        giscus:
          ariaLabel: 评论
          errorMessage: 评论加载失败，请稍后重试。
```

语言层只需要写差异部分，`repo` / `repoId` / `category` / `categoryId` 留在 `params.comments` 里就够了。

## 跟随深浅色 {#theme}

`theme: auto` 时，giscus iframe 跟随 OINK 的深浅色切换按钮和浏览器的 `prefers-color-scheme`，读者切换主题时评论区一起变。

需要更贴合站点配色时，用 `lightTheme` / `darkTheme` 分别指定两套 giscus 主题，取值是 giscus 内置主题名或站点自己托管的 CSS。本站用的是后者：

```yaml {title="hugo.yml"}
params:
  comments:
    giscus:
      theme: auto
      lightTheme: /css/giscus-oink-light.css?v=0.4.0
      darkTheme: /css/giscus-oink-dark.css?v=0.4.0
```

`theme` 写成固定主题名时不再跟随切换。

> [!NOTE]- 自定义 giscus 主题需要跨域可读
> giscus 的 iframe 从 `giscus.app` 加载，要读站点上的这个 CSS 文件需要 CORS 允许。本站在 `hugo.yml` 的 `server.headers` 里给本地预览加了 `Access-Control-Allow-Origin: '*'`；线上由托管商的响应头配置决定。

## 隐私与 CSP {#privacy}

- OINK 不会索取或保存读者的 GitHub 密码与访问令牌，登录与发帖全程在 giscus / GitHub 一侧完成。
- 评论初始化脚本是主题自带的同源资源，只加入启用了评论的页面，未开评论的页面没有这段脚本。
- `loading: lazy` 时，读者滚动到评论区附近才加载 iframe。
- 站点有严格的内容安全策略时，`script-src` 和 `frame-src` 都要放行 giscus，合并进现有策略而不是替换其它指令（总则见[内容安全策略](/zh/docs/admin/deploy/#csp)）：

```text {title="CSP 片段"}
script-src 'self' https://giscus.app;
frame-src 'self' https://giscus.app;
```

外部脚本加载失败或没能创建 iframe 时，OINK 结束加载状态并在实时状态区域显示 `errorMessage`，不会让页面停在「加载中」。

## 验证 {#verify}

```bash {title="终端"}
hugo --minify --panicOnWarning     # 必填键缺失会在这里失败
hugo server --disableFastRender
```

然后逐项确认：

1. 打开一个应该有评论的页面，页面底部出现 giscus，显示「使用 GitHub 登录」，界面语言是当前页面的语言。
1. 切换 OINK 的深浅色，评论区跟着变（`theme: auto` 时）。
1. 打开设置了 `comments: false` 的页面，确认那里既没有 giscus 也没有其它评论组件。
1. 发一条测试评论，回到 GitHub 看指定分类下是否出现了对应的 Discussion，并且能在 GitHub 上管理。
{.steps}

首次评论或表态创建 Discussion 之前，浏览器控制台提示「找不到 Discussion」是正常现象。

出问题时按这个顺序查：构建日志里的 WARNING（四个必填键）→ `params.comments.enable` 与 `type` → 页面 front matter 的 `comments` → 仓库是否公开、Discussions 是否开启、giscus App 是否安装 → 浏览器控制台与响应头（CSP 是否拦了 `giscus.app`）。找不到已有评论线程，先恢复原来的 `mapping` 和页面路径。

## 相关 {#related}

- [仓库与页面信息](/zh/docs/customize/repository/) — 编辑本页、提 issue、贡献者与「这篇文档有用吗」反馈组件
- [分析与 SEO](/zh/docs/admin/analytics/) — 另一类需要接外部服务的能力
- [发布上线](/zh/docs/admin/deploy/) — 内容安全策略与预览部署的外部集成
- [配置总览](/zh/docs/customize/config/) — `params.comments.*` 每个键的定义
- [页面参数](/zh/docs/write/frontmatter/) — front matter 里的 `comments`
