---
title: 启用评论
linkTitle: 启用评论
description: 用 giscus 与 GitHub Discussions 给每个页面加上评论区，决定哪些页面开放评论，并让评论区配色与站点一致。
weight: 30
search_keywords: [评论, giscus, GitHub Discussions, 留言, 讨论, Disqus, comments, discussions]
aliases:
  - /docs/advanced/comments/
---

开启评论后，每个页面底部都有一个独立的讨论区，而你不需要运行任何评论服务器。OINK 使用 [giscus](https://giscus.app/zh-CN)：每个页面的讨论保存为你指定仓库里的一条 GitHub Discussion，读者用 GitHub 账号登录后发言，你在 GitHub Discussions 里像管理其它讨论一样审核。主题没有自建的评论后端，也不内置 giscus 以外的服务商。

仓库必须公开，因为访客读不到私有仓库的 Discussions。

> [!IMPORTANT] 评论会加载第三方服务
> 启用评论的页面会从 `https://giscus.app` 加载脚本和 iframe，因此在网络隔离环境里无法使用。评论在配置之前一直关闭；开启后，如果站点有隐私政策，请在其中写明 giscus 与 GitHub。

## 全站启用 {#enable}

全部配置都在 `params.comments` 下。把四个占位值换成 giscus.app 为你的仓库生成的值，做法见后面两节：

```yaml {title="hugo.yml"}
params:
  comments:
    enable: true
    type: giscus
    giscus:
      repo: YOUR_OWNER/YOUR_REPO
      repoId: YOUR_REPO_ID
      category: YOUR_CATEGORY
      categoryId: YOUR_CATEGORY_ID
      mapping: pathname
      inputPosition: bottom
      theme: auto
      loading: lazy
```

`repo`、`repoId`、`category`、`categoryId` 四个键必填，而且必须对应同一个仓库及其 Discussion 分类。任何一个缺失或为空，构建都会打印一条告警并且不渲染评论区，所以发布前要看一遍构建日志。`type` 只接受 `giscus`，写成其它值同样会告警并跳过。这些键名与 Hextra 的 `params.comments` 相同，从 Hextra 搬来的配置可以直接使用。

其余键都有默认值，见[配置总览](/zh/docs/customize/config/#comments-feedback)：`mapping`（`pathname`）、`inputPosition`（`top`）、`theme`（`auto`）、`loading`（`lazy`），以及 `strict`、`reactionsEnabled`、`emitMetadata`、`term`、`lang`、`lightTheme`、`darkTheme`、`ariaLabel`、`errorMessage`。giscus 的开关类键既可以写 YAML 布尔值，也可以写 giscus 自己的 `0` / `1`。

## 准备 GitHub 仓库 {#prepare-github}

1. 选一个公开仓库存放讨论，直接用站点源码仓库也可以。

1. 在仓库 Settings → General → Features 中开启 Discussions。

1. 为该仓库安装 [giscus GitHub App](https://github.com/apps/giscus)。没有安装时，访客既不能评论也不能表态。

1. 选一个 Discussion 分类。giscus 推荐 Announcements 类型：只有维护者和 giscus bot 能在其中新建 Discussion，读者不会随手开出无关的话题。
{.steps}

仓库 ID 与分类 ID 是公开标识符，不是凭据。不要把 personal access token、OAuth secret 或密码写进 Hugo 配置，因为配置会随站点源码一起公开。

## 生成配置 {#generate}

打开 [giscus.app](https://giscus.app/zh-CN)，填入仓库、映射方式和分类，页面会生成一段 `<script>`。把其中四个属性抄进 OINK 配置：

| giscus.app 生成的属性 | OINK 配置键 |
| --- | --- |
| `data-repo` | `repo` |
| `data-repo-id` | `repoId` |
| `data-category` | `category` |
| `data-category-id` | `categoryId` |
{.fields}

映射方式 `mapping` 决定页面与 Discussion 的对应关系。OINK 默认用 `pathname`，适合发布路径稳定的站点，也让同一个仓库可以同时服务多个域名或预览环境。

映射方式要在上线前定下来。已经有评论之后再改 `mapping` 或移动页面，giscus 会去找另一条 Discussion：旧评论不会被删除，但页面再也找不到它们。确实要改 URL 时，同时保留重定向，或者把 Discussion 改名。

## 按页开关 {#per-page}

页面 front matter 里的 `comments` 可以从两个方向覆盖全站开关，离页面最近的值生效。

只想让少数页面开放评论：全站设 `enable: false`，其余配置保持完整，再逐页打开：

```yaml {title="content/blog/2026-roadmap.md"}
---
title: 2026 路线图
comments: true
---
```

只想让少数页面关闭评论：全站开关保持打开，在不适合讨论的页面上关掉：

```yaml {title="content/about/security.md"}
---
title: 安全政策
comments: false
---
```

整个栏目统一设置，用 cascade。本站在 `content/docs/_index.zh.md` 的 cascade 里写了 `comments: true`，所以本页底部有一个真实的 giscus 评论区：

```yaml {title="content/docs/_index.zh.md"}
---
title: OINK 文档
cascade:
  type: docs
  comments: true
---
```

站点同时配置了 `services.disqus.shortname` 时，giscus 配置完整就优先生效，Disqus 不再加载；页面上的 `comments: false` 会把两者一起关掉。giscus 缺少必填键时，它会告警并被跳过，改由 Disqus 加载。

## 多语言文案 {#i18n}

giscus 的界面语言跟随页面语言：简体中文、繁体中文和香港繁体各自对应 giscus 的相应 locale，giscus 不支持的语言回退为英文。只有自动选择不对时，才需要显式设置 `lang`。

OINK 自己还有两句文案：评论区的无障碍标签，以及加载失败时的提示。主题自带的每种界面语言都已经翻译好这两句。想换个说法，就按语言设置 `ariaLabel` 与 `errorMessage`；语言层只写有差异的值，仓库相关的键仍然留在 `params.comments`：

```yaml {title="hugo.yml"}
languages:
  en:
    params:
      comments:
        giscus:
          ariaLabel: Discussion
          errorMessage: The discussion could not be loaded. Please try again later.
  zh:
    params:
      comments:
        giscus:
          ariaLabel: 讨论
          errorMessage: 讨论区加载失败，请稍后重试。
```

## 跟随深浅色 {#theme}

`theme: auto` 时，评论区跟随读者选择的深浅色和视觉预设，使用主题为站点提供的每套预设配好的样式表。

想用别的配色，就设置 `lightTheme` 与 `darkTheme`，取值可以是 giscus 内置的主题名，也可以是站点上某个样式表的 URL，例如放在 `static/` 下、地址为 `/css/giscus-brand-dark.css` 的文件。设置后，它们在所有预设下都生效。`theme` 写成固定的主题名时，评论区完全不再跟随切换。

```yaml {title="hugo.yml"}
params:
  comments:
    giscus:
      theme: auto
      lightTheme: light
      darkTheme: dark_dimmed
```

> [!NOTE]- 站点托管的 giscus 样式表必须允许跨域读取
> giscus 的 frame 运行在 `giscus.app` 上，却要从你的站点读取样式表（无论是主题自带的还是你自己的），所以响应必须允许跨域读取。线上请在托管商处配置 `Access-Control-Allow-Origin`。本站为 `hugo server` 在 `hugo.yml` 的 `server.headers` 里加了 `Access-Control-Allow-Origin: '*'`。

## 隐私与 CSP {#privacy}

- OINK 不会索取或保存读者的 GitHub 密码和令牌，登录与发帖全程在 giscus 和 GitHub 上完成。
- 评论加载脚本是同源脚本，主题只把它加到启用了评论的页面上。
- 读者滚动到评论区附近，或已经滚过评论区时，才会请求 giscus 脚本；`loading: lazy` 时 iframe 也同样等待。从 GitHub 登录回跳的访问，以及设置了 `loading: eager` 的站点，会立即请求。
- 站点有严格的内容安全策略时，要在 `script-src` 与 `frame-src` 中都放行 giscus，并合并进现有策略，而不是替换它；总体规则见[内容安全策略](/zh/docs/admin/deploy/#csp)。

```text {title="CSP 片段"}
script-src 'self' https://giscus.app;
frame-src 'self' https://giscus.app;
```

脚本加载失败或始终没有创建 iframe 时，OINK 会结束加载状态，并在实时状态区域显示 `errorMessage`，页面不会一直停在「加载中」。

## 验证 {#verify}

```bash {title="终端"}
hugo --minify # 必填键缺失时会告警并停用评论
hugo server --disableFastRender
```

1. 打开一个应该有评论的页面，底部出现 giscus 和「使用 GitHub 登录」，界面语言与页面一致。
1. 切换深浅色。`theme: auto` 时评论区随之改变。
1. 打开设置了 `comments: false` 的页面，确认那里没有任何评论区。
1. 发一条测试评论，再到 GitHub 上确认所选分类里出现了对应的 Discussion，并且可以管理。
{.steps}

某个页面在第一条评论或表态创建 Discussion 之前，浏览器控制台出现「找不到 Discussion」是正常的。

评论区没有出现时，按这个顺序查：构建日志中关于四个必填键的告警；`params.comments.enable` 与 `type`；页面 front matter 的 `comments`；仓库是否公开、是否开启了 Discussions、是否安装了 giscus App；最后看浏览器控制台和响应头，确认 CSP 没有拦截 `giscus.app`。已有的评论线程不见了，先恢复原来的 `mapping` 和页面路径。

## 相关 {#related}

- [仓库与页面信息](/zh/docs/customize/repository/) — 编辑链接、提 issue、贡献者与「这篇文档有用吗」反馈组件
- [分析与 SEO](/zh/docs/admin/analytics/) — 另一项需要调用外部服务的集成
- [发布上线](/zh/docs/admin/deploy/) — 内容安全策略与预览部署
- [配置总览](/zh/docs/customize/config/) — `params.comments.*` 每个键的定义
- [页面参数](/zh/docs/write/frontmatter/) — front matter 里的 `comments`
