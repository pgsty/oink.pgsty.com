---
title: 排错与检查
linkTitle: 排错与检查
description: 按症状查出构建、语言、搜索与托管平台问题的原因和修法，并在发布前检查站点。
weight: 60
search_keywords: [排错, 故障, 报错, 构建失败, 搜索不到, 404, baseURL, 检查, troubleshooting, error, debug]
aliases:
  - /docs/tutorial/troubleshooting/
---

构建失败或页面显示不对时，先做一次干净的生产构建，从第一条错误看起，因为后面的错误多半由它引起：

```bash {title="终端"}
rm -rf public resources/_gen
hugo --gc --minify --printPathWarnings --logLevel info
```

OINK 站点的构建就只有这一条 Hugo 命令。日志里如果出现 npm、PostCSS、Autoprefixer 或下载浏览器资源的步骤，说明站点还带着上游 Docsy 的构建流程，见[从 Docsy 迁移](/zh/docs/admin/upgrade/#from-docsy)。

## 构建 {#build}

| 症状 | 原因 | 修法 |
| --- | --- | --- |
| 旧版 Hugo 构建报错 | 实际运行的 Hugo 老于已测试的 `0.170+` 版本 | 先看 `hugo version`，升级到当前版本（`0.170+`）。装了多个 Hugo 时，先查 `PATH` 和 CI 里配置的版本，不要急着再装一份 |
| `TOCSS-DART: … You need to install Dart Sass` | 站点固定在需要编译 Sass 的 OINK 1.5.1 或更早版本，而 Hugo 0.170 起不再内置 Sass 编译器 | 把站点升级到当前 OINK 版本，见[升级到 1.6.0](/zh/docs/admin/upgrade/#preparing-1-6)；升级之前可先用 0.169 或更早的 Hugo Extended 构建 |
| `module "github.com/pgsty/oink" not found` | 主题没解析出来 | Hugo Module：看 `hugo mod graph`、`go.mod`、`go.sum`，以及有没有多余的 workspace / replace。submodule：CI 有没有在 Hugo 之前跑 `git submodule update --init`。归档 / 克隆：`theme:` 的值要与 `themes/` 下的目录名一致 |
| 模块下载卡住或超时 | Go 的模块代理不通 | Hugo 通过 Go 拉模块，所以走 `GOPROXY`。国内网络可以 `export GOPROXY=https://goproxy.cn,direct`；隔离环境改用离线归档或提交 `themes/oink/` |
| 页面上出现 `{.cards}`、`{.steps}`、`{caption=…}` 这类原样文字 | Goldmark 块级属性没开 | 在站点自己的 `hugo.yml` 里设置 `markup.goldmark.parser.attribute.block: true`，Hugo 不会合并主题的 `markup` 配置。完整配置块从[三项 Goldmark 前提](/zh/docs/customize/config/#goldmark)复制 |
| 图片带属性行时被包进了 `<p>`，图注没生效 | 缺 `markup.goldmark.parser.wrapStandAloneImageWithinParagraph: false` | 从同一个配置块里补上 |
| 行内 HTML 被转义成文字 | 缺 `markup.goldmark.renderer.unsafe: true` | 从同一个配置块里补上 |
| `\(…\)` `$$…$$` 原样显示 | Goldmark passthrough 没开 | 见[公式](/zh/docs/components/math/)；`math: true` 并不会打开 passthrough |
| `shortcode "tabs" must be closed or self-closed` | 有 `{{</* tabs */>}}` 没写对应的 `{{</* /tabs */>}}` | 到报错给出的 `文件:行:列` 处补上闭合标记 |
| `template for shortcode "tabs" not found` | 正文调用了不存在的短代码，或展示短代码语法时没有转义 | 名字拼错就改正。要把短代码语法当文字展示，在开、闭标记内侧各加一对 `/*` 与 `*/`，Hugo 就不会把它当作调用 |
| `... attributes: unknown attribute "witdh" at ...` | 属性行里的键拼错或不被允许 | 按告警列出的允许键改正。改正之前主题会忽略这个属性；`style` 与 `on*` 一律丢弃 |
| `shortcode "field": unsupported parameter "colour" at ...` | 短代码参数名不对 | 按告警给出的参数、文件与行号改正。改正之前主题会忽略该参数，本地预览照常可用 |
| `invalid params.ui.page_width "widee" (allowed: normal \| wide \| full) -- using "normal"` | 配置或 front matter 的取值不在允许范围内 | 改正消息里指出的值。改正之前主题使用消息中给出的回退值并继续构建，见[配置原则](/zh/docs/customize/config/#principles) |
| 某个页面设置不生效，也没有任何提示 | 键写在了 front matter 的 `ui:` 段里 | 页面键写在 front matter 顶层，键名是站点键去掉 `ui.` 前缀。front matter 里的 `ui:` 段会被静默忽略，见[页面参数](/zh/docs/write/frontmatter/) |
| 构建通过但线上少了某个功能 | 一条告警关掉了这个功能 | 阅读构建告警。非法配置取值、缺失的 giscus 必填键或不支持的 `comments.type`，都会让对应功能关闭，而不是让构建失败 |
| 升级后站点自有样式消失，并出现 `stylesheet: assets/scss/… is ignored` 告警 | 站点仍在使用已退役的 SCSS 钩子 | 把其中的规则移到 `assets/css/project.css`，见[已退役的 SCSS 钩子](/zh/docs/admin/upgrade/#sass-hooks) |
{.wide .expand}

两种短代码报错的结尾都给出要修改的 `文件:行:列`：

```text {title="构建输出" copy=false}
ERROR error building site: assemble: failed to create page from pageMetaSource /a:
  "…/content/docs/x.md:4:1": failed to extract shortcode:
  shortcode "tabs" must be closed or self-closed

ERROR error building site: assemble: failed to create page from pageMetaSource /a:
  "…/content/docs/x.md:4:5": failed to extract shortcode:
  template for shortcode "tabs" not found
```

## 语言 {#language}

| 症状 | 原因 | 修法 |
| --- | --- | --- |
| 译文页面不出现 | 四种可能，按顺序查 | ① `hugo.yml` 里有 `languages.zh` 且设了 `weight`；② 文件名是 `page.zh.md`，`zh` 必须小写；③ 译文 front matter 没有 `draft: true`，`date` 不在未来；④ 影响路由的元数据与源文件一致 |
| 语言切换跳到了首页 | Hugo 没找到对应译文 | 页面没有译文时，切换器回退到目标语言首页。补上译文文件，两个页面就能互相跳转 |
| 锚点链接打开了页面却不定位 | 译文标题文字不同，自动生成的 ID 也不同 | 在译文标题上显式写英文 ID：`## 安装 {#installation}`。标题里含短代码或行内 HTML 时，去看英文页渲染出来的 HTML，不要凭文字猜 ID |
| 菜单或首页分区没翻译 | 这些内容在配置和数据文件里，不在页面里 | 菜单在 `languages.<lang>.menus`，首页分区在 `data/home/<lang>.yaml`，界面字符串在 `i18n/<lang>.yaml`，见[多语言](/zh/docs/customize/i18n/) |
{.wide .expand}

## 搜索 {#search}

| 症状 | 原因 | 修法 |
| --- | --- | --- |
| 搜索框有但一直没结果 | 索引没生成 | 检查 `params.offline_search`，然后打开搜索，在网络面板里找页面 `data-td-index-src` 指向的请求。生产文件名为 `offline-search-index.<语言>.<hash>.json`，开发环境不带 hash；只有 `hugo server` 下没有索引时，还要检查 `offline_search_on_serve` |
| 索引文件请求 404 | `baseURL` 不对 | 子路径部署下，`baseURL` 配错是最常见的原因。在浏览器网络面板里看索引的请求地址，见[发布上线](/zh/docs/admin/deploy/#baseurl) |
| `hugo server` 下搜不了，构建出来就正常 | 站点关掉了预览期的索引 | `params.offline_search_on_serve` 默认为 `true`，预览与线上一致。删掉显式写的 `false` |
| 中文搜不到 | 通常是页面没进索引，或正文在拆分出去的正文文件里 | 打开中文页面 `data-td-index-src` 指向的地址（索引拆分时一并看 `data-td-body-src`），确认该页已入库，并核对 `offline_search_index` 的范围，见[中文、混合查询与标识符](/zh/docs/customize/search/#cjk) |
| 新页面搜不到，旧页面正常 | 索引是构建产物 | 重新构建。`hugo server` 下改了页面要等它重建完 |
| `params.search.algolia requires explicit appId, apiKey, and indexName values` | Algolia 三个键没配全 | 三个键必须显式给全，主题不会退而使用别的项目的 DocSearch 凭据。不用 Algolia 就把这段配置删掉 |
| 命令面板搜不到内容 | 命令与全文检索是两回事 | 没有索引时命令面板照样能打开，会提示索引不可用，页面操作与命令照常执行，见[命令面板](/zh/docs/customize/panel/) |
{.wide .expand}

## 平台 {#platform}

| 症状 | 原因 | 修法 |
| --- | --- | --- |
| GitHub Pages 上页面 404 或样式全丢 | 项目站点的 URL 带仓库路径，`baseURL` 没带 | 用工作流传入的 `--baseURL "${{ steps.pages.outputs.base_url }}/"`，不要手写地址。完整工作流见[发布上线](/zh/docs/admin/deploy/#hosts) |
| GitHub Pages 上「最后修改时间」「贡献者」全空 | checkout 是浅克隆 | `actions/checkout` 加 `fetch-depth: 0`，因为 `enableGitInfo` 要读完整历史 |
| Cloudflare Pages 构建报 Hugo 模板错误 | 构建镜像的默认 Hugo 版本过旧 | 在 Production 和 Preview 两个环境都将 `HUGO_VERSION` 设为当前版本（如 `0.170.1`），并设 `SKIP_DEPENDENCY_INSTALL=1` |
| 托管平台构建时拉不到主题 | 构建环境没有 Go | Hugo Module 需要 Go。平台不提供就改用 submodule，或把 `themes/oink/` 提交进仓库 |
| CI 上构建结果和本地不一样 | `go.work` 参与了 CI 构建 | CI 里设 `GOWORK: off` 与 `HUGO_MODULE_WORKSPACE: off`，让它只用 `go.mod` 里固定的版本 |
| 预览部署被搜索引擎收录了 | 预览也用 production 环境构建 | 预览构建去掉 `--environment production`，非 production 构建自带 `noindex` 与 `Disallow: /`，见[分析与 SEO](/zh/docs/admin/analytics/#robots) |
| macOS 报打开文件过多 | 实时预览监视的文件超过了 shell 限制 | 先把生成目录与无关目录排除出监视范围，它们通常才是根因；仍不够时再调大 `ulimit -n` |
| WSL 下很慢或漏掉改动 | 站点放在 Windows 挂载点上 | 把站点放进 Linux 文件系统，跨文件系统的变更通知与权限行为会让实时重载失效 |
| 缺 Bootstrap / Font Awesome / Mermaid 之类资源 | 主题副本不完整 | 不要用 CDN URL 顶替。确认 `assets/third_party/`、`static/webfonts/`、`VENDOR.json` 都在，缺了就重新获取同一个固定版本 |
{.wide .expand}

## 站点自带检查 {#site-checks}

每次改动都跑一遍构建。两个脚本来自主题仓库的 checkout（下文写作 `/path/to/oink`，版本与站点固定的发布版本一致），只需要 Python 3；把站点路径和 base URL 换成自己的。

| 检查 | 命令 | 管什么 |
| --- | --- | --- |
| 生产构建 | `hugo --printPathWarnings` | 重复输出路径、参数非法、外部集成配置不全 |
| 输出信任检查 | `python3 /path/to/oink/bin/check-output-security.py --public /path/to/my-site/public --base-url https://my-site.example/` | 四种输出里的每个 `href` / `src` 都是站内相对路径或 `http(s)` / `mailto` / `tel`；没有 `javascript:` URL 和行内 `on*` 事件处理器；跨站的 `<iframe>`、`<script>`、`<img>` 要显式加 `--third-party` 才放行。详见[断网构建验证](/zh/docs/admin/preview/#air-gapped) |
| 书籍锚点 | `python3 /path/to/oink/bin/check-book.py --site-public /path/to/my-site/public` | 适用于有[书籍](/zh/docs/write/book/#verify)的站点：每个交叉引用的目标都存在，类型与编号一致，页内 ID 唯一 |
{.fields}

构建告警一定要读：每条告警都写明键名、被拒绝的值和主题改用的默认值。OINK 为什么告警而不中断构建，见[取值写错时](/zh/docs/customize/config/#principles)。

## 诊断习惯 {#habits}

表里找不到对应症状时：

- 用一个确定的 Hugo 版本复现，并记下 `hugo version` 的输出，避免版本在两次运行之间变化。
- 对比开发与生产两套配置，只在线上出现的问题往往是环境差异。
- 用最小页面区分「主题行为」和「站点覆盖」：把可疑内容单独放一页，再分批重新启用站点覆盖，直到某一批让问题重现。
- 看故障页面的浏览器控制台与网络面板，尤其是返回 404 的资源路径。

## 求助渠道 {#getting-help}

开 issue 时附上 `hugo version` 的完整输出、`hugo mod graph | grep oink` 给出的主题版本、第一条完整错误，以及能复现问题的最小页面或最小站点。有了这四样，就省掉一轮追问。

- 主题与文档的问题：<https://github.com/pgsty/oink/issues>
- 本站内容的问题：<https://github.com/pgsty/oink.pgsty.com/issues>
- 上游 Docsy 的兼容性讨论：<https://github.com/google/docsy/discussions>

## 相关 {#related}

- [本地预览](/zh/docs/admin/preview/) — 干净构建、清缓存、容器与工作区
- [发布上线](/zh/docs/admin/deploy/) — `baseURL`、验收清单与回滚
- [版本升级](/zh/docs/admin/upgrade/) — 升级引入的问题与迁移工具
- [全文检索](/zh/docs/customize/search/) — 索引范围、权重与 Algolia
- [多语言](/zh/docs/customize/i18n/) — 语言配置与锚点对齐流程
