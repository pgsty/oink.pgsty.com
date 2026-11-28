---
title: 版本升级
linkTitle: 版本升级
description: 把站点升级到更新的 OINK 版本，或从 OINK 0.4、Docsy 迁移过来，每一步都留有回滚路径。
weight: 50
search_keywords: [升级, 迁移, 版本, Hugo Module, hugo mod get, oink06, Docsy, jQuery, 破坏性变更, upgrade, migration]
aliases:
  - /docs/upgrade/
  - /docs/upgrade/upgrade/
  - /docs/upgrade/from-docsy/
  - /docs/upgrade/v0-4/
---

升级 OINK，就是换掉站点固定的版本，再核对新版本渲染出来有哪些不同。大部分内容不需要改动。某个版本退役了某种写法或接口时，下文对应的小节会说明影响谁、要改什么；旧 shortcode 则有迁移工具批量改写，默认先干跑。请在单独的分支上升级，放弃升级时丢掉这个分支就行。

> [!IMPORTANT] Hugo 与 OINK 要一起升级
> OINK 1.6.0 及更新版本使用纯 CSS，已在 Hugo 0.170+ 上测试，构建过程不做任何编译。OINK 1.5.1 及更早版本需要 Hugo 的 Extended 版，而 Extended 版止于 Hugo 0.169，所以停留在旧版本的站点在升级之前，Hugo 无法越过 0.169。详见[暂时停留在 1.5.1 或更早版本](#hugo-extended)。

## 先看发布说明 {#release-notes}

每个版本的发布说明都列出了变更、破坏性改动与升级步骤。改动固定版本之前，把当前版本到目标版本之间每个版本的说明都读一遍：

- 本站的[发布说明](/zh/release/)
- GitHub 上的 [Releases](https://github.com/pgsty/oink/releases)

它们会告诉你哪些内容要改、哪些配置键已经移除、哪些默认行为变了。这样升级后哪个页面变了样，都能找到原因。

## 升级 Hugo Module {#hugo-module}

固定一个已发布的版本标签，或者一个你主动选定的不可变 commit，不要跟随分支，也不要用 `@latest`，这样同一个站点 commit 每次构建出来的都是同一个站点。固定之前，先确认标签已经发布并且能够解析：

```bash {title="终端"}
hugo mod get github.com/pgsty/oink@v1.8.0   # 已发布的版本标签
hugo mod tidy
hugo mod graph | grep github.com/pgsty/oink
```

模块图里显示的必须正好是这个版本；主动选定的 commit 在 `go.mod` 里记作 Go 伪版本。提交 `go.mod` 与 `go.sum`。固定上面的标签后，`go.mod` 内容如下：

```go {title="go.mod"}
module github.com/example/product-docs

require github.com/pgsty/oink v1.8.0
```

如果你同时在对着本地主题 checkout 预览，这个替换会盖掉固定的版本；信任构建结果之前，先看[对着本地主题预览](/zh/docs/admin/preview/#theme-workspace)。

使用 Git submodule 时，先确认没有本地修改，再拉取标签并检出精确的发布版本，不要跟随远端分支：

```bash {title="终端"}
git -C themes/oink fetch origin --tags
git -C themes/oink checkout --detach v1.8.0
git add themes/oink
```

站点验证通过后，提交新的 submodule 指针。离线归档或直接克隆的方式，用新版本的完整目录替换 `themes/oink/`，并确认 `theme:` 的值仍与目录名一致。各种安装方式的取舍见[从零建站与其它安装方式](/zh/docs/start/from-scratch/)。

## 升级后必做 {#after-upgrade}

```bash {title="终端"}
rm -rf public resources/_gen
env -u HUGO_MODULE_REPLACEMENTS GOWORK=off HUGO_MODULE_WORKSPACE=off \
  hugo --gc --minify --printPathWarnings --logLevel info
```

这条命令清掉可能还留着旧版本产物的缓存，只用固定的版本构建（不带本地替换或 workspace），并在告警之外打印信息级消息。其中 Hugo 的弃用提示说明未来的 Hugo 会移除什么；升级 Hugo 本身之前先处理它们，每一条有多紧急取决于具体功能。

构建通过后，亲眼看一遍结果：首页、一个文档页、一个博客页和 404，每种语言、两种配色，打印视图，以及站点定制过的每个地方。

## 验证 {#verify}

构建通过并不代表升级完成。按站点用到的表面逐项检查：

| 表面 | 看什么 |
| --- | --- |
| 文档 / Book | 侧栏顺序、翻页、标题、页面操作、编号与交叉引用 |
| 博客 | 按时间翻页、RSS 归属、顶部导航栏与页脚 |
| 首页 / Landing | 关闭 JavaScript 时的内容、紧凑菜单、打印 |
| 发布页 | 推导出的下载 URL、校验和、发布状态 |
| 组件 | 站点最常用的每个组件各看一页 |
| 无障碍 | 只用键盘操作、焦点顺序、两种配色、强制颜色模式 |
| 部署 | 所有站内链接与资源都保留了 base path 前缀 |
{.fields}

然后运行[站点可以执行的检查](/zh/docs/admin/troubleshooting/#site-checks)：生产构建、输出可信检查，有书籍时再加锚点检查。部署一份预览，在真实 URL 上用浏览器打开各个页面，同时留意网络请求。评审通过后再合并升级，上线后在生产环境做一次冒烟测试。

## 回滚 {#rollback}

回滚主题，就是恢复之前的固定版本：

```bash {title="终端"}
hugo mod get github.com/pgsty/oink@v1.6.0   # 示例：站点上一个已知可用的标签
hugo mod tidy
rm -rf public resources/_gen
hugo --gc --minify
```

- 保留升级前的模块固定、站点 commit 与已知可用的部署产物，回滚时三者一起恢复。
- 不要只回滚一部分。在新主题上塞回旧的布局副本，得到的混合状态比任何一个完整版本都更难诊断。
- 升级分支和验证中积累的结论都留着。回滚是为了先恢复线上，不是丢掉已经完成的升级工作。

重新发布上一个部署本身，见[发布上线](/zh/docs/admin/deploy/#rollback)。

## 升级到 1.8.0 {#preparing-1-8-0}

固定 `v1.8.0` 之前，先阅读 [1.8.0 发布说明](/zh/release/1.8.0/)并核对以下更新：

- **六套视觉预设与独立深色模式**：Paper 回归经典暖纸与链接蓝风格（`#f7f6f3`、`#21201c`、`#2b5f8c`，IBM Plex Sans 配黑体）。新增 `github` 与 `news` 两套预设，`ink` 重写为手写笔墨页面（Palatino、楷体、仿宋或宋体与朱色；夜间为绀纸金银字），深色 Terminal 校准为克制的荧光屏配色。如需向读者开放全部六套风格，将 `params.ui.preset_menu` 设为 `[paper, slate, github, ink, news, terminal]`，详见[品牌外观](/zh/docs/customize/brand/#visual-presets)。
- **外观按钮与菜单排布**：提供三、五或六套预设时，菜单按三列排布于三张明暗卡片之上；开启键盘导航时，分组标题注明 `T` 与 `Y` 快捷键。菜单提供明暗选项时，顶栏按钮显示读者的选择。浅色显示太阳，深色显示月亮，跟随系统显示半实心圆，即使系统切换明暗，半实心圆也会保留。
- **统一的音视频控件栏**：本地音频与视频文件改用主题的 `.td-media__controls` 控件栏替代浏览器原生控件，提供三色单轨进度条、倍速切换、音量条以及视频字幕与全屏控制。站点 CSS 如曾定制旧的 `.td-media__progress` 选择器，请改用 `.td-media__controls` 与 `.td-media__seek`。
- **使用 `> [!SOCIAL]` 提示块引用帖子**：社交帖子采用 `> [!SOCIAL]` 提示块加紧邻块属性行（`{avatar="…" date="…" url="…" platform="…"}`）书写，在纯 Markdown 查看器中保持普通引用块可读性，详见[帖子](/zh/docs/components/social/)。如果站点中仍存有旧的 `social` 短代码调用，可在主题仓库运行 `python3 bin/migrations/oink06.py migrate --site <dir> --only social --write` 批量转换，再运行 `python3 bin/migrations/oink06.py check --site <dir>` 列出仍未转换的调用。

## 升级到 1.7.0 {#preparing-1-7}

已在 1.6.0 上的站点无需修改模板或样式表。固定 `v1.7.0` 之前，先阅读 [1.7.0 发布说明](/zh/release/1.7.0/)并核对以下外观与交互更新：

- **Paper 强调色与预设排版**：Paper 底色调整为暖白（`#faf9f5`），界面强调色改为陶红（`#9b4a28`，暗色 `#de8460`），正文行内链接仍为蓝色细下划线。若想沿用之前的蓝色强调色，设置 `params.ui.theme_color: '#2b5f8c'`。Terminal 屏幕正文同步改用 IBM Plex Mono（打印仍用 IBM Plex Sans）；显式设置的 `params.ui.fonts.ui` 或 `fonts.body` 会作用于所有预设的标题，除非 `fonts.heading` 另行指定。详见[品牌外观](/zh/docs/customize/brand/#visual-presets)。OINK 1.8.0 让 Paper 回到 1.6.0 的样子，并新增由这套 1.7.0 外观发展而来的 `preset: news`，偏爱 1.7.0 Paper 的站点可改用它，见[升级到 1.8.0](#preparing-1-8-0)。
- **单键快捷键重排**：快捷键调整为二十九个快捷键、三栏布局（导航十项、操作九项、样式十项）：禅意模式从 `H` 改到 `Z`（`H` 改为本地浏览历史），切换语言改为 `X`，切换视觉预设为 `T`，切换明暗模式为 `Y`，切换博客索引视图为 `L`，切换版本为 `V`，回到语言首页为 `G`，纯命令面板仍保留在 `\`（并与 `C` 对应），`[`、`]` 分别打开 ChatGPT 与 Claude。`G` 不再打开侧栏中聚焦的条目（`Enter` 与 `Space` 照旧可用），首页的 `N` 分节别名已移除（`J` 保留）。如有站点自写帮助文案或快捷键测试引用了旧键位，请一并更新；详见[键盘快捷键](/zh/docs/customize/keyboard/)。
- **排版复制**：复制正文选区默认输出基于打印调色板的干净富文本，避免粘贴到微信公众号等编辑器时带入页面背景色。如需恢复浏览器默认富文本复制，设置 `params.ui.rich_copy: false`（或页面 front matter `rich_copy: false`）。
- **新增按需组件与 CSP**：时间线、更新条目、帖子与本地音视频不产生外部请求；如果启用 `params.map` 或 `params.video_embeds`，请在 CSP 中放行瓦片服务的 `img-src` 与已启用视频平台的 `frame-src`，见[发布上线](/zh/docs/admin/deploy/#csp)。
- **归档版本横幅**：开启 `params.archived_version: true` 的站点现获得带样式的 `role="note"` 横幅，且需要非空的 `params.version`（缺省时会告警一次并省略空横幅）。

## 升级到 1.6.0 {#preparing-1-6}

升级到 1.6.0 的每个站点都要读这一节。这个版本保留 `github.com/pgsty/oink` 模块路径，但有意退役了 Sass、Bootstrap 的 JavaScript 与 Lunr，主题因此才能在 Hugo 0.170 及更新版本上构建。先读 [1.6.0 发布说明](/zh/release/1.6.0/)，再逐项检查：

- **工具链**：使用当前 Hugo 版本（已在 `0.170+` 上测试，无需 Extended 版或 Sass 编译器）。你要构建的所有分支都用上 OINK 1.6.0 或更新版本后，从 CI 工作流中删掉 `extended: true`。
- **样式表**：把已退役的 `assets/scss/_*_project*.scss` 改写成纯 CSS，放进 `assets/css/project.css`；模板里写死的 `/scss/*.css` 路径改成 `/css/*.css`；站点自有外壳的布局改用 `partial "css/bundle.html"`。见[已退役的 SCSS 钩子](#sass-hooks)。
- **Bootstrap JavaScript**：去掉对主题提供的 `window.bootstrap` 或 `data-bs-toggle` 钩子的依赖；Landing 下载标签页改为监听 `td:tab-shown` 而不是 `shown.bs.tab`；版本列表上的 `.dropdown-menu` 选择器改为 `.td-version-menu__list`。见[Bootstrap 的 JavaScript](#bootstrap-script)。
- **本地搜索**：去掉站点脚本对 `window.lunr` 的依赖，调用形式改为 `OinkSearchEngine.create(documents, maxResults)`。超过 2 MiB 的 `content` 索引现在会把正文拆到 `offline-search-body.<lang>.json`。见[去掉 Lunr 的本地搜索](#search-engine)。
- **Markmap 1.1.0**：把 Markmap 0.18 的旧 YAML 选项迁移为 `foldLevel`、`wrapWidth`、`levelGap`、`siblingGap` 与 `colorDepth`，旧名称会告警并被忽略。见 [Markmap 迁移说明](/zh/docs/components/markmap/#migration)。
- **ReDoc 3.1.0**：每份规范现在在各自的同源阅读器 frame 中渲染，限制了 frame 的内容安全策略必须允许 `frame-src 'self'`。ReDoc 2 的 `hide-hostname`、`hide-logo`、`suppress-warnings`、`lazy-rendering` 与 `native-scrollbars` 默认值随 v2 API 一并移除；覆盖过 `redoc` shortcode 或其样式的站点，要把这些覆盖改写到 ReDoc 3 的 API 上。规范扩展 `x-code-samples` 改名为 `x-codeSamples`。旧的操作链接仍会重定向，但 ReDoc 2 指向 schema 和单个安全方案的深层链接在 ReDoc 3 中没有对应路由，指向它们的链接需要更新。
- **接近时才加载的组件**：Asciinema、ECharts、Infographic、Markmap 与 giscus 现在在读者滚动接近时才加载。如果你自己的浏览器测试会断言图表、地图或播放器的渲染结果，先把组件滚动到视口内。

### 已退役的 SCSS 钩子 {#sass-hooks}

如果站点里有 `assets/scss/_variables_project.scss`、`_variables_project_after_bs.scss` 或 `_styles_project.scss`，需要手工转换一次。主题的样式表已经是纯 CSS，构建不再运行 Sass 编译器，这些文件会被忽略，每个各产生一条构建告警；转换之前，站点只带着主题的默认样式构建。

1. 把 `_styles_project.scss` 及其导入的 partial 中的规则，改写成纯 CSS 放进 `assets/css/project.css`。原生 CSS 嵌套可以保留；只有 Sass 才认识的写法要展开：变量、mixin（如 Bootstrap 的断点）、`@extend`，以及用 `&-` 拼接类名的嵌套选择器。
2. 两个变量钩子里赋过值的每个 Sass 变量，改为直接设置它原本影响的东西。颜色和字体有专门的设置，见[品牌外观](/zh/docs/customize/brand/)；其余情况，覆盖该变量对应的自定义属性或主题规则。
3. 构建站点并比对关键页面。`project.css` 在主题样式表之后加载，同等优先级的主题规则不再盖过你的规则。请核对同时带有主题修饰类的元素，以及你提供的每个视觉预设。
4. 删除三个 SCSS 文件以及只被它们导入的 partial。此后直接编辑[项目样式表](/zh/docs/customize/brand/#scss)。

如果你自己的模板编译过主题的 SCSS partial，请改为[按名称取用主题样式表](/zh/docs/customize/brand/#bundles)。

### Bootstrap 的 JavaScript {#bootstrap-script}

如果站点的布局、shortcode 或内容用到了 Bootstrap 的下拉菜单、标签页、模态框或其它 Bootstrap 脚本，需要自己加载 Bootstrap：主题不再提供 `window.bootstrap`，也不再激活 Bootstrap 的脚本钩子。要找出依赖它的地方，搜索 `bootstrap.`、`data-bs-toggle`、`data-bs-dismiss`、`data-bs-target` 以及监听 `.bs.` 事件的代码。逐一改用 OINK 组件，或者在 `layouts/_partials/hooks/body-end.html` 中加载站点自己的 Bootstrap bundle。配色模式属性 `data-bs-theme` 与 `data-bs-theme-value` 仍然有效。

OINK Landing 的下载标签页上，把 `shown.bs.tab` 换成监听 `td:tab-shown`，该事件从刚显示的渠道面板向上冒泡。页脚和抽屉里的版本列表使用 `.td-version-menu__list`，为它们定制的 `.dropdown-menu` 选择器需要更新。版本按钮通过 `aria-expanded` 表明状态，原来监听 `*.bs.dropdown` 的脚本改为观察这个属性。

### 去掉 Lunr 的本地搜索 {#search-engine}

如果站点使用本地搜索，它的配置、索引文件与 front matter 键都不变。升级后确认三件事：

1. 主题不再附带 Lunr。如果站点自己的布局或脚本用到了主题那份副本提供的 `window.lunr`，请自行加载 Lunr。
2. 如果直接调用了 `OinkSearchEngine.create`，去掉 Lunr 参数：`create(documents, maxResults)`。
3. 结果排序有变化。短词不再匹配另一个词的内部，所以 `port` 不会再返回只写着 “support” 的页面；中文、日文、韩文查询也不再需要用空格分词。用读者最常搜的几个词试一试。

超过 2 MiB 的 `content` 索引现在发布成两个文件：索引保留标题、小节标题和关键词，`offline-search-body.<lang>.json` 存放正文，命令面板在给出首批结果之后再加载它。如果当初设置 `offline_search_index: summary` 只是为了不超出体积预算，现在可以改回 `content`。站点自己的脚本若从大索引里读取 `body`，需要改读第二个文件，并按 `ref` 对应。2 MiB 以内的索引没有变化。

参数现在也是搜索结果：搜索参数名会直接打开它在 `fields` 列表或 `{.fields}` 表格中的那一条，你不需要做任何改动。想保留已有的锚点，给这个参数加上 `id`。想让自己的标记同样可以被搜到，给元素加上 `id` 和 `data-td-search-entry="标题"`。具体规则见 [Shell 契约](/zh/docs/design/shell/#search-engine)。

### 暂时停留在 1.5.1 或更早版本 {#hugo-extended}

如果某个站点，或者某个你仍在构建的分支，停留在 OINK 1.5.1 或更早版本，它的构建要编译 Sass，需要 Hugo 的 Extended 版，而 Extended 版止于 Hugo 0.169；这些旧版本在 Hugo 0.170 上构建失败。凡是构建这个站点的地方，都要使用 Extended 版，且版本不高于 0.169：

- 本机执行 `hugo version`，输出中必须带 `extended`。
- GitHub Actions 中，给 `peaceiris/actions-hugo` 指定精确版本并选择 Extended 版：

  ```yaml {title="工作流中的 Install Hugo 步骤"}
  - name: Install Hugo
    uses: peaceiris/actions-hugo@v3
    with:
      hugo-version: 0.169.0
      extended: true
  ```

- [容器镜像](/zh/docs/admin/preview/#container)中，安装 `hugo_extended_${HUGO_VERSION}_linux-${TARGETARCH}.deb` 而不是 `hugo_${HUGO_VERSION}_linux-${TARGETARCH}.deb`，且 `HUGO_VERSION` 不高于 0.169。
- `resources/_gen/` 里还存着构建编译出的 CSS，改了字体或主色却看不到效果时，要清掉它。

## 升级到 1.5.1 {#preparing-1-5}

没有设置 `params.ui.compare` 的站点无需任何改动，1.5.1 生成的页面与输出完全相同。这个版本稳定了 1.5.0 引入的按需开启的[双列视图](/zh/docs/customize/i18n/#bilingual-view)，并修正了 RSS、打印、导航、校验、搜索与无障碍方面的行为，详见 [1.5.1 发布说明](/zh/release/1.5.1/)。

开启 `params.ui.compare: true` 时：

- 译文与原文保持一致的显式 `{#id}` 标题锚点，「同步滚动」才能准确对齐章节。
- 某种语言既不显示阅读器入口、也不作为目标语言时，设置 `languages.<lang>.params.ui.compare: false`。
- 用 `window.OinkComparePane` 守住 `head-end.html` 里的自定义统计脚本，避免窗格加载被重复计数。开启对照期间，站点对 Hugo `google_analytics.html` partial 的本地覆盖不会被使用，见[分析与 SEO](/zh/docs/admin/analytics/#bilingual-view)。
- 在内容安全策略中允许同源 frame（`frame-src 'self'`），并确认服务器没有用 `X-Frame-Options: DENY` 或 `frame-ancestors 'none'` 禁止同源嵌入。
- 打开一篇有译文的 Docs、Book 或博客页面，确认「打开双列视图」（1.5.1 起由「打开双语视图」改名）能加载目标语言、按共同的标题同步滚动，并在窄屏下正确切换。

## 升级到 1.4.0 与 1.3.1 {#preparing-1-4}

如果站点用到了 PlantUML，1.4.0 可以在浏览器里直接渲染，不需要额外软件或渲染服务。要切换过去，保留 `params.plantuml: true` 或 `plantuml.enable: true`，删除 `svg_image_url`，随主题提供的两份浏览器脚本就会接管。要继续使用服务端模式，保留一个非空的端点，因为空端点现在会选择本地模式。要完全关闭渲染，设置 `params.plantuml: false` 或 `plantuml.enable: false`。切换已有的图表之前，先核对[不支持的 include、库与 CSP 要求](/zh/docs/components/plantuml/#limits)。

除此之外，1.4.0 保持仅依赖 Hugo 的构建方式，新增统一的图表阅读、更完善的本地搜索、按需开启的表格阅读器与博客画廊布局（[1.4.0 发布说明](/zh/release/1.4.0/)）。固定到这个版本后，检查导航、图片查看与阅读器设置。以源码副本方式安装主题的站点，还要刷新复制过来的文件，因为修改 `go.mod` 不会更新 vendor 副本。

1.3.1 修复了 Markmap 文字对比度和固定目录与页脚之间的间距，并为技术表格与文件树长注释提供了按需开启的布局。已有内容保持原有外观；只在必须完整显示技术文字的地方开启[技术宽表布局](/zh/docs/components/table/#wide)或文件树的 `wrap=true`。提供全部四套风格的站点，继续使用 `preset: paper` 和显式的 `[paper, slate, ink, terminal]` 菜单。[1.3.1 发布说明](/zh/release/1.3.1/)列出了这些修复以及贡献者致谢。

## 升级到 1.2.0 {#preparing-1-2}

> [!IMPORTANT] 默认外观改为 Paper
> 站点必须保留原有外观时，在采用 1.2.0 之前设置 `params.ui.preset: slate`。`preset_menu: true` 开启读者自选，默认仍为 false。Ink 与 Terminal 只有在被设为预设或写进菜单列表时才会出现，它们的按钮不带实验标记。自定义的深色品牌选择器按[品牌外观](/zh/docs/customize/brand/#visual-presets)中的说明检查。

除外观变化外，1.2.0 不需要迁移内容。请检查：

- 所选预设、深浅色图标、键盘与移动端菜单、已保存的偏好，以及自定义的字体与强调色。太阳表示浅色，月亮表示深色；切换风格不能改变已保存的深浅色偏好。
- 显式导航、隐藏的子树、页面链接、博客分页的 canonical，以及缺少译文的页面的 SEO 备用链接。
- 只命中关键词的 CJK 搜索摘要，以及标题含字面百分号的大纲链接。对比 Windows 上或挂载进来的内容的编辑、历史与新建子页链接，映射结果必须是仓库相对路径。
- 禁用或拦截 JavaScript 时的 Landing 内容、指标格式是否保留、弹窗与快捷键、复制回退、Draw.io 控件，以及窄屏下的编号公式。
- 生产构建中的图表端点与资源 alt 元数据：格式错误的值现在会告警并安全回退。要有意关闭渲染，设置 `params.plantuml: false` 或 `params.drawio.enable: false`。
- 发布 PDF 或转换内容时使用修订后的 PDF 与迁移工具。审查 PDF 的远程资源开关和迁移 diff，包括嵌套在列表中的代码示例。

## 升级到 1.1.0 {#from-1-0}

如果站点还在 1.0.x，不需要迁移源码，模块的 Go 1.27.0 声明也与 1.0.0 相同；工具链细节见 [1.1 发布说明](/zh/release/1.1.0/)。变化的是行为，所以选定新版本之前，先检查站点用到的这些表面：

| 表面 | 1.1 的行为与检查项 |
| --- | --- |
| 语言 | 32 份界面目录共用同一套原生消息结构。检查站点的语言标签、复数计数与 RTL 方向；正文译文仍由站点负责。 |
| 分类法 | 根页变成术语卡片目录，并带有分类法切换器。检查分类法模板或 CSS 覆盖、作者头像与本地化面包屑。 |
| 侧栏 | 缓存树保留每个页面的有效设置，没有 JavaScript 也能使用。测试折叠、悬停恢复、移动端抽屉与键盘焦点；隐藏的内容必须退出焦点顺序。 |
| 分组 | `sidebar_divider: true` 保留分区的子文档。只有明确不发布分组自身输出时才加 `build.render: never`，随后检查子导航、面包屑、翻页、打印与 Book 目录。 |
| 根菜单 | 显式的 `sidebar_root_menu: false` 现在对自根分区同样生效；当前可链接的根仍作为位置标记显示。 |
| 自定义脚本 | 集成还要兼容 1.0.0 时，先检测 `OinkSidebar` 与 `OinkCommandPalette.registerSearchTail` 是否存在。通过 API 恢复分支状态，不要直接改 class 或 ARIA 属性。 |
| 文章复制 | 开启图片缩放时，复制图片和图注会得到纯文本与富文本 HTML。预览提示不能混进复制的文章，缩放及其键盘操作也必须正常。 |
| 打印与 Redoc | 检查单页和 Book 聚合打印、标题与标签页链接，以及真实部署前缀下的本地 Redoc 规范。本地规范路径以 `static/` 为根。 |
{.fields}

`params.ui.image_zoom` 与 `params.offline_search` 仍默认关闭，新的搜索钩子既不会启用远程服务，也不会添加查询遥测。`params.ui.scroll_spy` 与页面级 `scroll_spy` 在 1.x 中仍可写，但不起任何作用，所以删除过时的补丁不会关掉正常的大纲跟踪。

如果站点保留了主题代码的副本，例如图片缩放脚本或侧栏 partial，请与新实现对比后更新或删除；否则旧副本会继续盖过上游的修复。相关细节见[内容分组](/zh/docs/write/organize/#group-only)、[侧栏契约](/zh/docs/design/shell/#sidebar-runtime)、[搜索动作](/zh/docs/customize/panel/#search-tail)与[图片缩放](/zh/docs/components/image/#zoom)。

## 从 0.4 升级 {#from-0-4}

如果站点起步于 OINK 0.4，升级后某个页面多了或少了某项功能，先看这几项改变了的默认行为：

- 顺序翻页默认开启。`docs`、`book`、`blog` 页面末尾都有上一页 / 下一页；文档沿侧栏树排列，博客按时间排列。不属于任何序列的页面设 `pager: false`。
- 顶部导航栏在所有布局上都显示。紧凑状态只有一行图标导航，没有第二套移动端手风琴菜单，依赖旧移动菜单的本地脚本和测试要删掉。某个栏目不要导航栏时，在 cascade 里设 `navbar_enabled: false`。
- 页脚默认对全站使用 `fat`，只接受 `fat`、`slim` 或 `none`。页脚数据放在 `data/footer/<语言>.yaml`，单语言站点用 `data/footer.yaml`；`data/home` 里残留的 `footer` 键会告警并指出新位置。
- 单键导航默认开启：`/` 打开完整搜索，`\` 只进入命令模式。培训材料里描述旧行为的地方要更新。页面操作移到了面包屑旁边的拆分按钮上。
- 代码块的 DOM 变了：`.td-code` 外壳包在原来的 `.highlight` 外面，`.highlight` 与 `.chroma` 都还在。站点 CSS 里 `.td-content > .highlight` 这类子选择器，要改成后代选择器 `.td-content .highlight`。
- 两个 ICP 页脚键 `footer_icp` 与 `footer_icp_url` 合并为一个支持行内 Markdown 的字符串：

  ```yaml {title="hugo.yml"}
  params:
    footer_center_info: '[京ICP备00000000号](https://beian.miit.gov.cn/)'
  ```

- 数学公式需要在站点自己的配置里开启 Goldmark passthrough，因为 Hugo 不会合并主题的 `markup` 设置。站点用到 `\(…\)`、`\[…\]` 或 `$$…$$` 时，在它的 `hugo.yml` 里开启 passthrough，见[公式](/zh/docs/components/math/)。

上面每个键都在[配置总览](/zh/docs/customize/config/)与[布局与页面类型](/zh/docs/customize/layout/)中有说明。0.4 的 shortcode 用下面的迁移工具转换。

## 内容迁移工具 {#migration-toolkit}

如果内容里还在用 `alert`、`tabpane`、`imgproc` 这类 0.4 shortcode，用 `oink06.py` 转换，不必手改几百个文件。它随主题仓库提供，只依赖 Python 标准库：

```bash {title="终端"}
git clone https://github.com/pgsty/oink
cd oink

# 1. 只读盘点：一次看多个站点要改什么，可导出 Markdown / JSON 报告
python3 bin/migrations/oink06.py report --sites ~/sites/product-docs ~/sites/handbook --md report.md

# 2. 干跑：打印每个文件的 diff 与计数，不写任何东西
python3 bin/migrations/oink06.py migrate --site ~/sites/product-docs

# 3. 真改：原子写入
python3 bin/migrations/oink06.py migrate --site ~/sites/product-docs --write

# 4. 查残留：还有旧语法时退出码为 1
python3 bin/migrations/oink06.py check --site ~/sites/product-docs
```

- 默认就是干跑，只有 `--write` 才会改文件。先干跑，读 diff，再写入。
- 第二次运行必须零改动。第二次 `--write` 仍报告改动，说明有转换不收敛，停下来检查那些文件。
- 代码围栏里的文字不会被改动，文档中示范旧写法的代码块因此完好无损。
- 工具无法表达的构造原样保留，并附上 `file:line` 与原因列出来，作为手工处理的清单，而不是失败。

想一次只转一类，用 `--only` 加上语法映射表最后一列的键：

```bash {title="终端"}
python3 bin/migrations/oink06.py migrate --site ~/sites/handbook --only callout,tabs --write
```

转换之后重新构建，读一遍告警，再逐页看渲染结果。工具保证语法正确，每页是否仍表达了你的本意，要由你来确认。

## 0.4 → 当前语法映射 {#syntax-map}

| 0.4 的写法 | 当前写法 | `--only` 键 |
| --- | --- | --- |
| `{{%/* alert color= title= */%}}`、`{{%/* details */%}}`、`{{%/* pageinfo */%}}`、手写 `<details><summary>` | `> [!TYPE] 标题` / `> [!DETAILS]-` | `callout` |
| `{{</* tabpane */>}}` + `{{%/* tab header= */%}}`、`{{</* code-group */>}}` + `{{</* code-tab */>}}` | 相邻围栏加 `{tab= group= value=}`；正文型标签页用 `{{</* tabs */>}}` + `{{</* tab */>}}` | `tabs` |
| `{{</* filetree */>}}` 与 `filetree/folder`、`filetree/file` | `filetree` 数据围栏 | `filetree` |
| `{{</* gallery */>}}` 与 `gallery/image` | `gallery` 数据围栏 | `gallery` |
| `{{</* echarts */>}}`、`{{</* infographic */>}}` | 同名数据围栏（`$fn:` 不变，`js` 子围栏要挪到 `window.OinkEchartsFunctions`） | `datafence` |
| `doc-cards` / `doc-card`、`nav-cards` / `nav-card`、`card` / `cardpane`、`doc-carousel` | `{{</* cards */>}}` + `{{</* card */>}}`，或链接列表加 `{.cards}` | `cards` |
| `{{</* imgproc */>}}`、`{{</* image */>}}` | `![alt](src)` 加属性行 `{command= options= caption=}` | `image` |
| `{{</* readfile file= */>}}` | `{{</* include file= */>}}` | `include` |
| 围栏属性 `{filename="x"}` | `{title="x"}` | `fencetitle` |
| `{{</* badge outline= */>}}` | 去掉 `outline` 参数 | `badge` |
| `{{</* example */>}}` + 围栏、`{{</* book-figures kind="tbl" */>}}` | `{{</* eg */>}}…{{</* /eg */>}}`、`{{</* book-tables */>}}` | `eg` |
| `{{%/* _param x */%}}`、`iframe`、`conditional-text`、`blocks/*`、`netlify`、不带 kind 的 `xref` | 工具只报告，需要手工处理 | `reportonly` |
{.fields}

每种新写法的样子和参数，见[组件](/zh/docs/components/)中对应的页面。

## 从 Docsy 迁移 {#from-docsy}

如果站点运行在 Docsy 上，大部分东西都能直接沿用。OINK 是 Docsy 的硬分支，保留了它的内容模型、`td-` 命名和大部分 front matter，所以迁移的主要工作是删掉站点里复制的公共外壳，交给主题来提供；正文不用重写。

1. 固定目标版本。把 `go.mod` 指向 OINK 的发布标签，或者使用完整的版本化归档。评估期间可以用一个不提交的 `go.work` 指向本地 checkout。

1. 清点覆盖项。把 `layouts/`、`assets/`、`static/` 下每个站点级文件分成四类：公共外壳的副本（验证后删除）、OINK 已经提供的组件（删除或机械改名）、品牌定制（保留，收缩到最小的合适钩子）、业务专属的数据与交互（留在站点）。按引用关系逐个删除，不要一次清空 `layouts/`，因为首页或下载页可能还在调用你打算删掉的 partial。

1. 迁移配置。`title`、`languages.*`、`github_repo`、`github_branch`、`page_width` 与 `params.ui.*` 的含义和位置都不变，OINK 没有另起命名空间。用这几个键打开搜索和 Logo：

   ```yaml {title="hugo.yml"}
   params:
     logo: img/product.svg
     offline_search: true
   ```

   Docsy 的驼峰式搜索键要自己改名：`offlineSearch`、`offlineSearchIndex`、`offlineSearchMaxResults`、`offlineSearchOnServe` 与 `offlineSearchSummaryLength` 一律改成下划线形式。OINK 会直接忽略旧键名，不给任何告警，改名之前搜索会一声不响地保持关闭。

1. 字体与样式。Docsy 放在 `assets/scss/` 下的 SCSS 钩子不再被编译，其中的 Sass 变量（包括字体变量和 Google Fonts 开关）都不再生效。按[已退役的 SCSS 钩子](#sass-hooks)转换这些钩子。OINK 自带 IBM Plex Sans、Inter、Chakra Petch 与 IBM Plex Mono，任何预设都不请求 Google Fonts。要换字体，走 token 层，见[品牌外观](/zh/docs/customize/brand/)。

1. 转换 shortcode。Docsy 的 `alert`、`pageinfo`、`tabpane` 与 `card` 系列都有对应的当前写法，用[迁移工具](#migration-toolkit)批量转换，`--only` 一次一类。

1. 一次删一组，每删一组构建一次。先在临时副本上演练，记录主题 commit、Hugo 版本、删除的文件和生成的 HTML 文件数；结果等价之后，再在生产分支上重做一遍。
{.steps}

第二步里「验证后删除」的那一类，通常是这些文件：

- `layouts/baseof.html` 以及公共的 docs、blog `baseof*.html`；
- 顶部导航栏、页脚、侧栏、目录、搜索与 head CSS 的 partial 及其钩子；
- 旧的品牌文档外壳 partial；
- `asciinema`、`echarts`、`infographic`、`doc-carousel`、`details`、`tab` / `tabpane`、card 与 `param` 的 shortcode 副本；
- 只服务于上述实现的 JavaScript、Lunr 副本、轮播代码与 SCSS；
- 站点资源已经不再需要的 PostCSS 与 Autoprefixer 步骤。

删完之后，通常会冒出两类问题。

站点脚本报 `$ is not defined`。Docsy 在每个页面的 `<head>` 里加载 jQuery，OINK 不需要它，也不附带它。站点仍然需要时，自己引入：

```html {title="layouts/_partials/hooks/head-end.html"}
<script src="{{ (resources.Get "js/jquery.min.js").RelPermalink }}"></script>
```

用 Docsy `blocks/*` 搭的首页构建时报 `template for shortcode "blocks/cover" not found`，因为 OINK 没有这一组 shortcode。改用 `data/home/<语言>.yaml` 中的首页分区，或者给页面设置 `layout: landing`，见[首页与落地页](/zh/docs/customize/home/)。

## 相关 {#related}

- [发布上线](/zh/docs/admin/deploy/) — 回滚部署
- [排错与检查](/zh/docs/admin/troubleshooting/) — 升级后如何读构建报错
- [本地预览](/zh/docs/admin/preview/) — 清缓存与对着本地主题预览
- [从零建站与其它安装方式](/zh/docs/start/from-scratch/) — 四种安装方式的取舍
- [组件总览](/zh/docs/components/) — 每个组件的当前写法
