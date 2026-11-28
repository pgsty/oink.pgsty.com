---
title: 架构契约
linkTitle: 架构
description: 仓库装配、配置、诊断、本地化、输出、性能、安全、CSS、无障碍与发布状态的边界。
weight: 10
icon: fa-solid fa-sitemap
search_keywords: [OINK 架构, 仓库边界, 运行时, i18n, Docsy 语言, 输出格式, 安全, 无障碍, 性能]
contract_status: v1.8.0
---

> [!NOTE] OINK 1.8.0 契约
> 本契约描述 OINK v1.8.0。

## Hugo 工具链 {#hugo-toolchain}

**OINK v1.8.0** 使用纯 CSS，已在 **Hugo 0.170+** 上测试（无需 Sass 编译器，也不区分 Extended 版）。
CI 跟随 `latest` 构建，不测试更老版本 Hugo 的兼容性；开发和检查使用本机安装的 Hugo。
`theme.toml` 与 `module.hugoVersion` 均不再声明最低 Hugo 版本（自 v1.8.0 起移除；v1.7.0 标签仍保留过该声明，Hugo 对此只发出告警）。
详见[运行时依赖与 1.8.0 基线](#unreleased-dependencies)。

禁止启用 `--panicOnWarning` 或 `HUGO_PANICONWARNING`。告警保持可见并接受审阅。
无效输入测试直接检查对应告警和安全降级产物。

OINK v1.8.0 不含任何 Sass：样式表是纯 CSS，由 Hugo 拼接，见[纯 CSS 样式表的交付](#stylesheet-delivery)。
普通用户无需安装 Dart Sass、LibSass 或其他 Sass 程序，站点构建只需要 Hugo 这一个程序。
1.5.1 及更早版本曾用 Hugo 内置 LibSass 编译主样式与 ReDoc 样式（需要 Hugo Extended 0.168.0 与 Go 1.27.3）。
后续变更必须保持仅依赖 Hugo 的边界；要求、检查器与双语契约须同步修改，历史发布和研究记录保留当时的工具版本。

Go 仅用于解析 Hugo Modules，已准备好传统主题副本的站点无需 Go；面向用户的文档不要求特定 Go 版本。

## 仓库与装配 {#repository-and-assembly}

仓库根目录是一个完整的 Hugo 模块与主题，不是站点，也不是 npm workspace。
Hugo 渲染模板并发布主题的样式表。浏览器运行时与第三方资源都已提交到仓库，
因此普通构建不会访问网络。公开的双语文档、示例与浏览器测试位于同级的
`oink.pgsty.com` 仓库；主题仓库只在 `tests/site/` 中保留范围明确的内部回归
夹具，不再维护独立的公开示例面。

生成的 `public/` 与 `resources/` 目录绝不是源文件。随主题内置的运行时、字体
家族与 Font Awesome 字形定义属于受支持的发行内容，并非待清理的死代码；
`VENDOR.json` 与 `bin/check-vendor.py` 固定其完整性。OINK 发布完整的受支持
Font Awesome 发行包，因为用户编写的内容可能使用主题模板本身没有引用的图标。

Font Awesome 官方编译 CSS 作为一份稳定、带指纹的 vendor 样式表发布，并排在
带指纹的主题样式表 `main.css` 与站点自有样式之前。站点样式的普通修改不会再让图标
发行包失效，同时常规层叠顺序仍允许站点覆盖它。KaTeX、DocSearch、Swagger、Asciinema 与
Leaflet 等能力样式继续保持独立，只在实际使用时加载。内容指纹使不可变 URL 成为
可能；HTTP 缓存响应头属于部署宿主，而不是 Hugo 主题的职责。

Hugo 类型 `docs`、`book`、`blog` 与 `swagger` 选择阅读外壳；
`params.ui.shell_types` 可以增加类型。落地页使用 `layout: landing`。OINK 没有
`article` 类型或第二套博客外壳；沉浸式页面只是[外壳契约](/zh/docs/design/shell/)
定义的一种博客展示方式。

`layouts/_partials/shell/config.html` 解析共享外壳事实。布局必须先通过
`content/render.html` 渲染，再执行 `scripts.html`，因为渲染钩子与 shortcode
会在 Page Store 中登记能力标志。覆盖时应选择范围最窄的 partial；若合并会改变
Hugo 的查找优先级，即使几个基础模板看起来相似，也应保持分离。

## 运行时依赖与 1.8.0 基线 {#unreleased-dependencies}

开发和 CI 均遵循 [Hugo 工具链](#hugo-toolchain)契约。
样式表是由 Hugo 拼接的纯 CSS，消费站点的 SCSS 钩子已退役，
见[纯 CSS 样式表的交付](#stylesheet-delivery)。贡献者浏览器检查使用
Node 26.13.0 与 npm 12.2.2；它们不是普通消费站点的构建依赖。
博客卡片、图库和外链列表通过 `RawSummary` 读取作者提供的后备摘要。
Hugo 的 `plainify` 改进了 HTML 块之间的空白，摘要与字数统计遵循该行为。
出版 CI 固定 Pandoc 3.13、EPUBCheck 5.4.0 和 Chrome headless shell
157.0.8103.50，Java 使用 27。
搜索关闭按钮的本地化无障碍名称包含可见的 `Esc` 标签，并通过
`aria-keyshortcuts="Escape"` 声明快捷键，支持语音与键盘操作。

更新后的运行时集合（`VENDOR.json` 共收录 26 项内置依赖）包括 DocSearch 5.2.0、Mermaid 12.4.0、KaTeX 0.19.1、
Markmap 1.1.1、Swagger UI 5.36.0、ReDoc 3.2.0、Asciinema 3.19.0、
Infographic 0.2.20、Pako 3.0.3、idb-keyval 6.3.0、PlantUML core 1.2026.10、Viz.js 3.31.0
（Graphviz 16.1.0、Expat 2.8.5）以及 Leaflet 1.9.4（BSD-2-Clause）。Font Awesome 7.3.1、Bootstrap 5.3.8、
ECharts 6.1.0 与字体包维持当前稳定版。
精确清单仍以 `VENDOR.json` 为准。

`main` 样式表保留 Bootstrap 的组件样式，包括模态框、侧滑面板和轮播图，供站点自己的模板使用。
使用这些组件的 JavaScript 行为时，站点自行加载脚本。主题不再随包分发
`bootstrap.bundle.js` 和 Popper。版本菜单由 `base.js` 控制，`main` 和 `chrome`
两份样式表都包含它的样式。`landing.js` 为服务端渲染的下载渠道添加标签切换行为。
站点自有的事件监听和 CSS 选择器如何迁移，见[升级指南](/zh/docs/admin/upgrade/#bootstrap-script)。

Mermaid 显式保留 `layout: dagre`、`theme: default`、`look: classic`，不会因为
上游改用 ELK、neo 与新颜色主题而默默改变已有图表。Mermaid 12 要求浏览器支持
ES2024（Safari 至少 17.4）；加载或渲染失败时保留源码。KaTeX 0.19.1 的样式与
字体保留对 Hugo 内置公式渲染器的类名归一化。含公式的页面只发布 KaTeX 的
二十个 woff2 字体，以及只引用它们的样式表；woff 与 ttf 副本留在模块里，不发布。
DocSearch 使用关键词搜索包，
把现有 `indexName` 设置转换为上游的 `indices` API，不启用 Ask AI。

Markmap 的本地 ESM 资源由 `@markmap/core`、`parse`、`render`、`view` 与
`plugin-math` 1.1.1 构建，内置所需 D3 模块、高亮与按需加载的 MathJax。旧的全局
自动加载器、独立 D3 包与 WebFontLoader 已退役。所有相对路径 chunk 一同发布。
更新内容前请阅读 [Markmap 迁移说明](/zh/docs/components/markmap/#migration)。
适配层从 Markdown 链接文字生成 SVG 链接的无障碍名称，并在动画折叠与重绘期间保留名称与可见键盘焦点。
通过 `include` 引入的 Markmap 围栏在宿主页面登记运行时能力。
注释支持键盘打开，Escape 关闭后恢复焦点，即使原 SVG 标记已在重绘中被替换。字体加载完成后使用文档内 Canvas
测量文字，避免 Firefox 的 OffscreenCanvas 系统字体度量偏差。
打开注释前先完成焦点引起的页面滚动，避免平滑滚动立即将浮层关闭。已打开的
注释随明暗模式与预设实时更新，浏览器打印时隐藏浮层。注释 chunk 加载
失败时，对应导图恢复完整 Markdown 源码并接收键盘焦点，不影响其他导图。
注释链接使用正文的链接颜色，并保留下划线。打印结束后恢复注释中原有控件的
焦点；若浮层已关闭，则恢复到注释标记。

每个 ReDoc 阅读器使用独立的本地 HTML 文档、ES 模块与 hash 路由，多个阅读器不会
接管文章锚点或彼此的导航。遥测明确关闭，两张上游品牌图片改为内嵌，消除默认 CDN
请求。规范地址仍由作者显式提供，在同源 `.td-redoc__frame` 中且与页面嵌入地址一致时支持远程 URL；直接访问本地阅读器文档只接受同源规范。框架外始终保留规范链接。
框架允许读者主动下载文件或通过链接打开新标签页。静态输出只保留该链接，
参见 [API 写作说明](/zh/docs/write/openapi/#redoc)。Asciinema
在 JavaScript 增强前、运行时资源不可用，或初始化、录像获取、解析失败时保留
录像链接；播放器拥有焦点时，失败后将焦点交给链接，不阻断其他组件的初始化。

维护者构建脚本位于 `bin/vendor/`。将该目录复制到主题仓库之外，执行
`npm ci --ignore-scripts` 和 `node build.mjs`，审阅资源、内嵌依赖清单、许可证与
校验值后再导入。`import-redoc.py` 只对原始 npm 包做两处已记录的图片替换。
lockfile 固定传递依赖，也覆盖 SVG loader 内嵌的 idb-keyval。普通 Hugo 构建
不会执行这些工具。

### 纯 CSS 样式表的交付 {#stylesheet-delivery}

主题不含任何 Sass，样式表也不经过任何编译。源码是 `assets/css/td/` 下的纯 CSS
分层文件。`assets/css/td/bootstrap/` 存放为主题构建的 Bootstrap 5.3.8，按
Bootstrap 组件拆分：其中带有主题的调色板，与某条 Bootstrap 规则共用的主题
选择器也直接写进该规则。字体声明层是
`assets/third_party/inter/{normal,italic}.css` 与
`assets/third_party/ibm-plex-sans/{normal,italic}.css`。

`layouts/_partials/css/layers.html` 按层叠顺序列出每份样式表的各层；权重相同时，
排在后面的层胜出。`layouts/_partials/css/bundle.html` 接收一个名称，把对应的
样式表作为 Hugo 资源返回：各层由 `resources.Concat` 拼接，发布为
`css/<name>.css`。名称未知时发出告警。

| 样式表 | 使用方 |
| --- | --- |
| `main` | 所有主题页面，共 123 层。`head-css.html` 把它发布为 `css/main.css`；生产构建中压缩、加指纹并带完整性属性 |
| `redoc.css` | 登记了 ReDoc 的页面。它是单独的一个文件 `assets/css/td/redoc.css`，不在各层清单之内，按同样方式发布为 `css/redoc.css` |
| `chrome` | 不加载 `main` 的站点自有外壳：令牌、排版、六套配色、站点导航栏，以及语言、明暗与外观控件 |
| `landing` | 站点自有外壳使用的 Landing 区块，在 `chrome` 之后加载。它重复了配色规则，因为配色以同等优先级改写 Landing 区块，必须排在其后 |
| `search`、`compare` | 站点自有外壳使用的命令面板与本地搜索，以及双列视图 |

四份较小的样式表没有自己的源码：它们列出的每一层 `main` 也都加载。站点布局
按名称取用，并自行压缩、加指纹：

```go-html-template
{{ with partial "css/bundle.html" "chrome" }}<link rel="stylesheet" href="{{ (. | minify | fingerprint).RelPermalink }}">{{ end }}
```

这里没有编译器，没有构建步骤，Git 中也没有生成文件；修改某一层就是全部改动。
每一层都是可直接拼接的扁平 CSS：不写 `@import`，不写 `//` 注释，所有取值都直接
写出。原先是 Sass 变量的取值（例如 50px 的导航栏高度）在用到的地方各写一遍，
修改时须同时改动每一处。任何布局都不得调用 `toCSS`、`css.Sass` 或 PostCSS。

各层以 `../webfonts/…` 引用字体，因此所有样式表都发布在 `css/` 下，即站点根目录
的下一级。Font Awesome 的样式表同样发布为 `css/fontawesome.css`。1.5.1 及更早
版本发布的是 `scss/main.css`、`scss/fontawesome.css` 与 `scss/redoc.css`；写死了
这些路径的站点布局必须随之修改。

站点自己的规则是纯 CSS：先是 `assets/css/project.css`，再按路径顺序接上每个
`assets/css/project/*.css`。主题把它们拼接为一份样式表，发布为
`css/project.css`，位于 `main.css` 之后、RTL 产物之前；生产构建中压缩并加指纹。
Hugo 不对它做转换。三个 SCSS 钩子 `_variables_project.scss`、
`_variables_project_after_bs.scss` 与 `_styles_project.scss` 会被忽略；每个仍
存在的文件在一次构建中告警一次，页面保留主题样式。消费站的 Sass 变量不再进入
Bootstrap、字体角色或任何其他主题规则。

这份契约由 `bin/check-stylesheets.py` 负责。出现以下情况时它会失败：`assets/`
下存在 `.scss` 文件；布局调用了样式表编译器；各层清单与分层文件不一致，即清单
中的每一层都必须存在，每个分层文件也都必须列入清单。随后它在 `PATH` 为空的
环境下构建探测站点，并检查：各层按清单顺序发布；生产产物经过压缩、带指纹和
完整性属性；每个已退役的 SCSS 钩子都会告警且不进入产物；四份较小的样式表能为
站点自有外壳发布。

这次转换没有改动任何规则。2026-11-23 在 Hugo 0.170.1 上验证：生产环境的 `main`
样式表与最后一次由 Sass 编译的结果逐字节相同（556,437 字节），回归夹具的 683 个
产物文件除样式表路径外完全一致。四份较小的样式表现在复用 `main` 的各层，因此
多出了一些选择器（Bootstrap 标题、`.small` 与 `.mark` 的类变体，以及少量
`.td-content` 选择器），但没有任何规则或声明发生变化。已发布的 v1.5.1 在
Hugo 0.170 上构建失败，因为 Hugo 此时要求安装 Dart Sass。已有钩子的转换方法见
[升级指南](/zh/docs/admin/upgrade/#sass-hooks)。

## 配置与诊断 {#configuration-and-diagnostics}

主题策略位于 `params.ui.*`；`comments.giscus`、`plantuml`、`drawio` 等包含多项
设置的集成保留在顶层。布尔功能直接使用布尔值，除非它还包含多项设置。页面级
覆盖会去掉 `ui.` 前缀：`params.ui.image_zoom` 对应 `image_zoom`，front matter
中绝不嵌套 `ui` map。`hugo.yaml` 声明公开默认值；对应的解析器与检查器定义
任何可选配置的结构或范围。

无效输入遵循同一条规则：警告中写明输入值、允许的结构与安全回退，然后使用该
回退，或省略不安全的功能。普通构建与预览保持可用；告警和降级产物由对应检查器直接验证。主题绝不调用 `errorf`，`check-params.py` 会强制守住
这条边界。不要为无法到达的状态增加臆测式校验。

OINK 没有通用的键名重命名注册表。仍需给出迁移诊断的过渡，应在所属解析器中
添加针对性警告，并配严格的反向测试；已经移除的键绝不能作为兼容路径继续读取。

可能联网的功能必须显式启用，并以关闭方式降级。OINK 1.4.0 启用 PlantUML 且未配置端点时
使用本地渲染，显式 `plantuml.svg_image_url` 才选择服务端模式。Draw.io 需要
`drawio.drawio_server`，Algolia 需要
`appId`、`apiKey` 与 `indexName`；地图需要 `map.tiles`（含 `{z}`、`{x}`、`{y}`
的 HTTPS 模板）与 `map.attribution`，主题不指定任何瓦片服务；视频平台播放器只对
`video_embeds` 列出的平台、且只在读者点击之后加载。配置不完整时发出警告，而且不产生网络请求。
Draw.io 只在渲染内容含 PNG 或 SVG 候选图片时加载，并且每个不同的图片 URL
只检查一次。
图表端点必须是字符串，内容为带主机的 HTTP(S) URL 或同站路径。不支持的协议、
省略协议的 URL、反斜杠、空白字符及缺少路径的同站引用都会告警，并在选择运行时前关闭该集成。

> [!NOTE] 自包含 PlantUML（自 OINK 1.4.0 起）
> `plantuml: true` 或未配置端点的 `plantuml.enable: true` 选择浏览器渲染。固定的两份本地
> 资源（`@plantuml/core` 1.2026.10 与 Viz.js 3.31.0）仅在包含 PlantUML 围栏的 HTML 页面
> 加载。普通构建和读者无需安装 Java、Graphviz 可执行程序或 npm 包，也不依赖 CDN 或
> 渲染服务。非空端点继续选择服务端模式，保留地址校验与 `svg` 行为；非法端点不回退到
> 本地模式。本地渲染不会下载可选库、主题、include 文件或外部资源。生成的 SVG 以 Blob
> 图片显示，不插入页面 DOM。输入错误或资源加载失败时保留可读源码；独立 Print、Markdown
> 与 RSS 保留源码，不加载运行时。

> [!NOTE] OINK 1.3.0 修复
> 添加嵌入参数时保留编辑器 URL 原有的查询参数与片段。消息必须同时来自当前
> 编辑器 iframe 及其配置的源；无关或格式错误的消息会被忽略。图表数据只发送到
> 该源。导出结果必须是 PNG 或 SVG 的 data URL。

> [!NOTE] OINK 1.4.0 的图表按需加载
> Mermaid 与本地 PlantUML 的小型调度器只出现在使用它们的 HTML 页面；大型引擎
> 在可见图表接近视口时加载。同页共享引擎，主线程串行执行，未引入 Worker、新依赖
> 或构建步骤。缺少 IntersectionObserver 时使用滚动与尺寸检查。普通浏览器打印不等待
> 异步渲染：已有图显示图片，其余保留源码。独立输出不变。

Asciinema、ECharts、Infographic、Markmap 与地图（Leaflet）在 HTML 页面上遵循同一规则。页面只发布
各自的引擎，不主动请求。位于屏幕内、下方一小段滚动距离内，或在读者上方任意位置的
组件会加载引擎并挂载；更靠下的组件等待，隐藏的组件等到显示时再挂载，配置了
`loading: click` 的地图则等到读者显式点击后再挂载。在读者上方
挂载会推动正在阅读的文字，因此上方的组件一律立即到期。挂载之前，播放器是录像链接，
Markmap 导图是源码，地理地图保留带编号的地点列表，图表与信息图是一个空画框。普通浏览器打印不等待脚本：已挂载的组件照原样
打印，未挂载的图表与信息图打印其声明的选项或 DSL，与 Print 输出一致。引擎无法加载时，
图表与信息图显示这份源码，播放器保留链接，地理地图隐藏画布并保留地点列表。站点自行加载过的引擎不会被重复请求。
Giscus 以同样的方式请求：读者滚动到评论区附近，或已经滚过评论区时。从登录回跳的访问
（会话仍在地址里）与设置了 `loading: eager` 的站点会立即请求。

## 界面本地化 {#interface-localization}

> [!NOTE] 自 OINK 1.1 起提供
> OINK 1.1.0 将原生界面语言包扩展到下方列出的完整语言集合；消费站点编写的正文
> 仍需自行翻译。

OINK 为
[`google/docsy@64f51c5`](https://github.com/google/docsy/tree/64f51c5bde2abd2e8a001cb31b32656f5800ca56/theme/i18n)
中现有的 31 个 locale 文件名提供原生界面文本，并额外保留通用 `zh` 作为简体中文
默认值：

```text
ar az bg bn de en es et fa fi fr he hi hu it ja ko nl no oc pl pt-br ro ru
sr-cyrl sr-latn sv tr uk zh-cn zh-tw
```

这些语言包覆盖主题界面文案，站点正文仍由站点自行翻译。
Docsy 以后增加的 locale 不会自动成为 OINK 支持项；它必须先补齐完整的 OINK
词条，并接受与现有语言相同的审校。

`i18n/en.yaml` 管理消息 schema。OINK 的 32 份语言包都必须拥有完全相同
的消息集与原生界面文本；只有经过审查的产品名、标点、通行缩写或目标语言真实
同形词可以与英文保持相同，不再生成整段英文 fallback。`zh` 与 `zh-cn` 使用简体中文，
`zh-tw` 使用繁体中文。

主题支持的所有 Hugo 版本都允许通用 `zh` 语言与地区化中文语言包并存时使用 `locale: zh`，也可
选择 `locale: zh-CN`。两种配置都不改变语言包文件名 `i18n/zh.yaml`。

`%s`、`{count}`、`{{ .Count }}` 等运行时占位符可以移到符合目标语言语法的位置，
但字节内容必须保持不变。取值可以是字符串或 Hugo 复数消息映射。复数映射使用该
语言支持的类别（`zero`、`one`、`two`、`few`、`many`、`other`），必须包含 `other`，
每种形式都是包含相同占位符的字符串（经过审查的词法复数形式除外，如阿拉伯语双数 `two` 直接用词形表达数量而无需重复原始数字）。语言包不得包含隐藏的双向文本控制符；
阿拉伯语、波斯语和希伯来语的方向仍由消费站点的语言设置（`direction: rtl`）
决定，不得把方向字符塞进译文，同时连写 RTL 语言（`ar`、`fa`）会清除大写/小标题上的正 `letter-spacing` 以保持字形连写。
`bin/check-i18n.py` 会检查 locale 集合、schema、模板键引用、取值类型、占位符、方向控制符，
以及少量已审查的英文本地同形词。因此增加可见字符串时，必须在同一变更中为每份
语言包提供译文，不能再运行 fallback 生成器。

## 特色图片 {#featured-images}

Hugo 的 `images` 是唯一的创作 API；`params.images` 只作为全站社交卡片回退。

| 来源 | 阅读列表缩略图 | 社交卡片 |
| --- | --- | --- |
| 页面 `images`，或页面包中的 `**featured*`、`*feature*`、`{*cover*,*thumbnail*}` | 是 | 是 |
| 分区 `cascade.images` | 是 | 是 |
| 站点 `params.images` | 否 | 是 |

`images: []` 会清除显式值或 cascade 继承值，但不会禁止发现页面包资源。只把解析
到的第一张图片作为代表图。Hugo 可以裁剪本地可处理的位图；SVG、static 与远程
资源仍然有效，只是不能执行 Hugo 图片操作。

`featured-image-resolve.html` 统一决定来源优先级与相对、绝对 URL。页面自己的
显式 `images` 优先于页面包资源，页面包资源优先于继承的 cascade 图片；显式值与
继承值恰好相同时也遵守此顺序。有源文件的页面通过原始 front matter 判断是否显式
声明，由 Hugo 解析 YAML、TOML 或 JSON；没有源文件的生成页面将解析后的 `images`
视为显式值。列表缩略图、Open Graph/Twitter/schema
帮助模板、作者头像、Pinterest 图片与博客展示都消费同一个决定。

`params.ui.featured_image` 只用于博客，默认值为 `none`；页面或 cascade 可用
front matter 覆盖。`banner` 在单页标题上方渲染图片，`wash` 用图片给页头着色，
`hero` 在单页与分区索引上把图片绘制为外壳背景。缺少图片或使用非 HTML 输出时
不渲染图片。

文章模式会把可处理的图片重新编码为 WebP：`banner` 裁剪为 1600×900，`hero` 缩放到
1800 像素宽，`wash` 缩放到 1200 像素宽。这张图是页面的最大绘制元素，因此以高优先级
请求，且从不懒加载。列表页与术语页的行缩略图懒加载；可处理的图片按行内画框裁剪，
不下发原图。术语页的行对本就不大于画框的图片保持原样。

## 输出与运行时 {#outputs-and-runtime}

每个基础模板都会设置 `Page.Store.tdOutputFormat`：

| 输出 | 契约 |
| --- | --- |
| HTML | 完整的语义内容；只为实际用到的能力加载本地运行时 |
| Print | 展开的内容；不含外壳导航、搜索或图片缩放运行时；共享操作层仍支持明确的打印控制 |
| Markdown / LLMS | 保持源 Markdown 形态，不含 `td-` 组件标记 |
| LLMSFULL | 按顶层 section 选择启用：每个启用 section、每种语言一份 `llms-full.txt`，按阅读顺序拼接同一份 Markdown |
| RSS | 安全的静态摘要，或明确省略 |
| NAVJSON | 按站点选择启用：每种语言一份 `navigation.json`，序列化侧栏与 pager 已经在读的导航权威 |
| BookManifest | 选择启用、供 EPUB/PDF 打包工具消费的有序 JSON 交接 |

各输出格式按既定顺序执行。一次渲染会在整个输出期间保持自己的可变格式状态；摘要
辅助逻辑不得把较早的格式值恢复到 RSS 渲染中。但在 Print 内，Hugo
可能并行渲染同一 Book 页面与相互重叠的聚合。因此每页由一个缓存 coordinator 按
固定顺序生成普通与整书两种变体，各调用方只选择自己需要的形态。普通 Print 保留
页面局部标题与带路由的 xref URL；Book 聚合保留带命名空间的标题与文档内 xref。
正文移入 Print 之前，相对链接按各自来源页面的 HTML URL 解析。单页和聚合输出
都保留语言与部署路径前缀、查询参数和编码路径。纯片段链接仍留在当前文档，交由
标题和脚注命名空间处理；规范路径与外部链接保持原目标。
只改写实际的 `href` 属性；`title` 等非链接属性内即使出现相同文字，也必须原样保留。

标题片段在命名空间匹配前只解码一次百分号编码，涵盖 Unicode 与编码后的 ASCII。
字面加号仍为加号，格式错误的转义保持原样；ID 与属性中的 HTML 实体单独解码。
片段规范化不会改动路径、查询参数或外部来源。
Tabs 及其他 Markdown shortcode 内渲染的标题使用相同的命名空间，
即使 Hugo 没有将它们纳入 `Page.Fragments`。
以实际渲染的标题 ID 为准，保留中文、字面加号和百分号序列，不从转义后的标题自链接反推 ID。

Landing 页面配置 RSS 输出后，通过共享 RSS 渲染器生成静态 feed。
声明的 alternate 输出必须存在实际文件；省略交互式 Landing 组件不等于省略 feed。

Print 页面在送往纸张之前也是可供浏览器阅读的文档。屏幕预览中的宽表格保留带名称、
可键盘聚焦的滚动区，不得撑宽整个页面；打印媒体样式在实际打印时展开这些区域。
表格无需加载运行时；RSS 表格仍是不可聚焦的静态内容。

站点自行选择是否启用自定义输出；OINK 不会强制生成昂贵的整书聚合。HTML 加载
共享操作层、核心层，以及由页面 flag 选择的稳定第一方能力分片。需要模板化的能力
每种语言至多发布一份；flag 只决定引用哪些 script tag，绝不再生成新的组合 bundle。
Print 保留操作层，并且只加载渲染打印功能所需的运行时。大型第三方 UMD 文件保持
独立；未使用的功能运行时不会出现。

顶层 section 在自己 `_index` front matter 的 `outputs` 中列出 `LLMSFULL` 才会启用它，
主题绝不替站点把它加进输出集合。逐页 Markdown 与全文包由同一个渲染器产出，因此全文包
就是那份语义 Markdown（同样不含 `td-` 组件标记）按侧栏与 pager 的阅读顺序拼接。在顶层
之下启用会告警且不产出任何文件，普通构建仍然可用，检查器直接验证告警与已禁用的输出。

站点在 `outputs.home` 中启用 `NAVJSON`，为每种语言在语言根下发布一份 `navigation.json`。
它序列化侧栏与 pager 所读的同一条权威链：存在显式 `data/docs_nav.json` 树时用它，否则用
带 weight 的内容树。数组顺序就是契约，`weight` 绝不序列化，该输出标记为 `notAlternative`。
`schema/nav.v1.schema.json` 为该格式提供版本，它是手写的契约产物，随模板与检查器一同修改，
不受生成式配置 Schema 漂移门禁管辖。两种输出默认关闭，都不启用的站点构建结果逐字节不变；
`bin/check-agent-indexes.py` 是它们的归属检查器。

只有 Book 根在 `outputs` 中明确列出 `BookManifest` 时才会生成它。它引用该 Book
既有的逐页 Markdown，并记录派生出的页面顺序、标题、编号目标与 xref；主题不会在
其中猜测出版元数据。

主题仓库提供 `bin/book-epub.py` 与 `bin/book-pdf.py` 作为显式出版步骤，并用
`bin/check-book-epub.py` 与 `bin/check-book-pdf.py` 承担产物门禁。EPUB 打包器组合
`BookManifest` 与同一份整书 Print HTML，消费站另行传入出版 metadata；PDF runner
只在临时回环地址提供该 Print 产物，通过 `script-src 'none'` 内容安全策略调用显式指定的
Chrome/Chromium 二进制，输出带 CSS 页码的 A4 页面。两种工具都会拒绝缺失资源或越出构建树的资源；网络资源
与覆盖已有输出分别需要独立的显式开关。网络 opt-in 只允许被动 HTTP(S) 媒体，远程脚本与
本地文件协议仍属非法。EPUB metadata 文件中的相对资源以该文件所在目录为基准，不依赖
调用者的工作目录。普通 Hugo 构建不会执行出版工作；PDF 仍从 Print 派生，而不是另一种
模板输出。

PDF 服务还会应用 CSP sandbox、拒绝 meta refresh 导航，并拒绝指向构建树以外的
符号链接。没有网络 opt-in 时，图片与媒体请求仅限回环同源地址和 data URL，
CSS 或 SVG 发起的请求也受此限制。

性能规则如下：

- 若站点级资源或 `partialCached` 结果可以承担工作，不要为每一页遍历
  `.Site.Pages`；
- `.Content` 只渲染一次，完成后再读取 Page Store 标志；
- 直接输出正确标记，不要扫描 DOM 后再修复；
- 浏览器工作按资源 URL 分组，而不是按 DOM 实例重复；
- 成本显著的普通输出应保持选择启用；
- 默认不输出 Speculation Rules：必须先由一个明确的生产消费站用可回滚的 `moderate`
  实验测量 `Sec-Purpose: prefetch` 请求、实际命中导航、传输字节与 CSP 影响；
- 校验确实可达的作者输入，不校验假想的内部状态。

`bin/measure-baseline.py` 测量构建时间、输出体积、bundle 数量与 shortcode
密度。

单页 Print 只输出一次页面摘要。分区 Print 将所有纳入后代页面的数学能力标志
传递到聚合根，因此目录页本身没有公式时，仍会按子页需要加载本地 KaTeX 样式。
完全没有公式的打印文档不加载这些样式。

## 信任边界、CSS 与无障碍 {#trust-css-and-accessibility}

作者可以启用 Goldmark `unsafe`，但配置与组件参数不能视作原始 HTML。共享属性
策略使用允许清单、校验 class token、放行 `data-*` 与 `aria-*`，并在丢弃
`style`、`srcdoc`、`on*`、保留属性与未知属性时发出警告。需要本地 URL 或明确
绝对 URL 时，URL 帮助模板会拒绝危险协议与协议相对 URL。公开 API 承诺支持的
远程 URL 仍然可用，但构建时绝不抓取它们。

> [!NOTE] OINK 1.3.0 修复
> 普通图片、Gallery 及缩放原图的 URL 在校验后仍须按 HTML 属性转义。
> 引号与 `&` 保持为 URL 的内容，不得生成新属性或被当作 HTML 实体解码。

主题输出使用 `td-` class、`data-td-*` 属性与 `--td-*` 自定义属性；`.steps`、
`.cards`、`.full-width`、`.wide`、`.expand` 等作者标记保持无前缀。CSS 支持 RTL、打印、强制颜色、
减少动画、超长 token 与窄视口。主题拥有的装饰图标带 `aria-hidden`；只有包含
任务列表或原始 Font Awesome 元素的页面才加载作者内容无障碍修复。

阅读容器区分指针聚焦与键盘导航。由指针聚焦的 main 区域、表格滚动区或代码 `pre`
不会仅因读者随后按键而出现边框；Tab、失焦或新的非指针聚焦会清除这项豁免。普通控件
保留自己的焦点样式，滚动容器保留 `tabindex`，跳过导航的目标在标题附近显示局部边框，
不再包围整篇文章。强制颜色模式保留键盘提示，不使用全局焦点边框重置。

字体角色为 `ui`、`body`、`heading`、`code`、`display`、`meta`、`brand` 与 `print`，
通过 `--td-*-font-family` 暴露。显式设置 `fonts.ui` 会同时改变每种预设的界面、正文与标题字体，包括 Paper。
显式设置 `fonts.body` 时，无论是否同时设置了 `fonts.ui`，它都提供正文字体和标题字体，除非 `fonts.heading` 另行指定标题字体。`params.ui.typography`
可取 `technical` 或 `system`；两者都在同一份样式表中，不加载运行时。自 OINK 1.6.0 起，样式表是纯 CSS，不读取消费站的任何 Sass 变量（1.5.1 及更早版本曾由旧 Bootstrap/Docsy Sass 变量提供初值）。

`params.ui.fonts` 让配置层触达同一组角色，供不愿新增样式表的站点
使用。它只写字体族名，绝不加载字体文件：所写字体族必须是读者已有的，或站点
自己用 `@font-face` 声明过的，这也让该键留在网络契约之外。取值只放行纯粹的
字体族语法，输出的 `:root` 块由匹配到的片段重新拼装；未知角色或不安全取值只
告警并单独丢弃。该块在样式表之后渲染，正是这一点让作者字体在同等优先级下压
过预设。外壳读站点的字体，不自带字体：Book 的编号与题注用正文字体，而非某种
技术字体。

强调色按角色拆开。**强调文字**（链接、外链、行内代码）跟随 Bootstrap 链接
族与 `--bs-code-color`，主题色永不重声明它们；行内代码随视觉预设变化：Slate 保留胭脂红明暗对，Paper 使用墨色文字与淡底，
使一页密集的标识符读成「代码与正文」而非「代码与链接」。**强调底**（选中行、
指针划过导航行时那层更灰的底、hover 淡铺、目录药丸与轨道光点、徽章 hover、
卡片 hover 时的外边、分享按钮 hover 时的实心底、文本选中、焦点环）跟随
`--td-accent`、`--td-accent-rgb` 与 `--td-accent-hover`，它们默认取链接族，也是
`params.ui.theme_color` 唯一注入的属性。属于外壳而非正文的文字同样跟随它们：
视口正停在其上的目录锚点、以及指针或键盘焦点落在其上的 Book 章节小标题，
按分区颜色点亮，而不是链接蓝。`theme_color` 与 `theme_color_dark`
取 `#rgb`/`#rrggbb`；front matter 与分区 cascade 覆盖站点值。未配置的站点不注入
任何内容。解析失败的值告警并保留默认配色。解析成功但在主题自身画布上低于 4.5:1
的颜色，带可抑制 id 告警并照常生效：该检查是建议性的，只有解析失败才丢弃颜色。
亮色是主键：没有有效 `theme_color` 的 `theme_color_dark` 告警并被忽略，一页要么
两种模式都着色，要么都不着色。省略暗色一半时，向白按 4% 步进提亮，直到在暗色画布
上达到 4.5:1。注入的每个字节
都由解析出的整数通道格式化，绝不来自作者文本。同一个解析器同时回答 head 注入块
与侧栏根切换器的「这一页是什么颜色」。

## 视觉预设 {#visual-presets}

OINK 1.2.0 默认使用 Paper。`params.ui.preset` 接受 `paper`、`slate`，以及显式
选择的实验预设 `github`、`ink`、`news` 与 `terminal`；非法值与保留名称（`folio`、
`canvas`）告警并回退到 `paper`。`params.ui.preset_menu` 默认 `false`；`true` 提供
Paper、Slate 与站点默认值，列表指定可选项并可显式开启实验。列表必须包含站点默认值，
缺失时告警并补入。无论列表顺序如何，菜单都按同一顺序排列：Paper、Slate、GitHub，
然后是 Ink、News、Terminal，在风格菜单中排成两行三列；`t` 键也按此顺序切换。
不支持页面级预设。

Hugo 为所有文档根元素输出 `data-td-preset` 与 `data-td-site-preset`，包括 404
和打印输出。开启读者选择时，head 内联脚本在 CSS 加载前校验 `td-preset`。选择
带默认标记的预设会删除该存储键。非法存储值被清除；存储被禁用时，控件仍可在当前
页面使用，并显示无法持久化的提示。`storage` 事件同步标签页，`td-preset-change`
携带 `{preset, previous, stored}`。明暗状态独立使用 `data-bs-theme`、
`td-color-theme` 与 `td-theme-change`。浏览器栏颜色跟随实际明暗和预设。禁用
JavaScript 时显示站点默认的浅色预设；外观控件需要 JavaScript。

六套预设编入同一个样式表。Slate 保留 v1.1.0 的基础色板选择器与值。Paper 调整
配色和少量组件规则，不改变外壳列宽、断点或全局间距。Paper 的画布为暖白色
`#f7f6f3`，墨色为 `#21201c`；蓝色链接（`#2b5f8c`，深色 `#7db5e6`）同时充当强调色，
因此选中行、大纲光标与文字选区都是蓝色。GitHub 采用 GitHub 的 `#ffffff` 与
`#1f2328`（深色 `#0d1117` 与 `#f0f6fc`），以链接蓝 `#0969da`（深色 `#4493f8`）为
强调色。Ink 是写出来的页面，News 是印出来的页面。Ink 在纸色 `#f3ead7` 上用墨色
`#241a10` 书写，强调色为朱色 `#a8321b`；纸面向窗口边缘渐深至 `#e8dabd`。News 在
灰色新闻纸 `#f0eee8` 上印油墨黑 `#161616`，链接与强调色只用一种专色蓝 `#1f4f7a`，
版面平整，没有圆角与阴影。深色色板并不是浅色色板的反相：每套预设都有自己的夜色，
字体不随明暗改变。Paper 保留暖深灰 `#161513`，Slate 保留 v1.1.0 的深蓝，GitHub 采用
GitHub 自己的深色。深色 Ink 是一卷金银写经：紫青色绀纸 `#1b1730` 上写泥银色文字
`#e3ddd0`，标题与强调色为泥金 `#dcb766`，纸面向边缘渐深至 `#120f22`。深色 News 是报社冲洗新闻照片的暗房：`#0f0f0f` 上的银盐色文字 `#d8d6d1`，
链接与强调色为安全灯橙 `#f2804a`，窗口一角有一点淡淡的橙色光晕。Ink 与 News 把画布
渐变的极值命名为 `--td-preset-canvas-edge`，所有文字色在这里和在平整画布上一样都要
达到 AA。深色 Terminal 是一块克制使用的荧光屏：`#050806` 上的浅灰绿文字 `#c9d2cc`，
荧光绿 `#3dff7a` 只用于标题、链接、强调色与当前行的光标条，标题标记、强调与引用竖线
用琥珀色 `#e5b45a`。GitHub、Ink、News 与 Terminal 通过可选的
`--td-preset-accent` 属性设置强调色。已发布的 `theme_color` 在任何预设下都会替换
强调色。每个深色色板都重声明对应浅色色板的全部 token，并覆盖嵌套深色区域。字体角色保持同等选择器优先级，顺序为预设、
`typography: system`、站点自有样式、head 输出的 `params.ui.fonts`。`brand` 单独控制字标。Slate 保留 Inter。
Paper 的界面、正文与标题都使用本地 IBM Plex Sans。两者的字标保留 Chakra Petch，
代码保留 IBM Plex Mono。News 的正文使用系统衬线字体，标题使用 Times New Roman
（Linux 上为 Liberation Serif），汉字配宋体-简最粗的一档；界面、搜索、菜单、列表、
表格标签与日期线使用同一款正文衬线字体；字标排成报头，已安装时用 Didot 或 Bodoni 72。GitHub 的所有文字角色
使用 GitHub 的系统字体栈（`-apple-system`、BlinkMacSystemFont、Segoe UI、Noto Sans、
Helvetica、Arial），代码使用 GitHub 的代码字体栈（`ui-monospace`、SFMono-Regular、
SF Mono、Menlo、Consolas、Liberation Mono）。Ink 是手写的，全页一种声音：西文处处
使用 Palatino（Windows 上为 Palatino Linotype 或 Book Antiqua，Linux 上为 URW Palladio、
P052 或 TeX Gyre Pagella），页面标题与 Landing 大标题为正体，章节标题为其书写体斜体；
汉字在标题以及界面、搜索、菜单与列表中用楷体，正文用仿宋，缺少楷体或仿宋时为宋体。
展示角色与字标采用标题字体；阿拉伯文与希伯来文标题按字形回退到 Diwan Thuluth、
Arabic Typesetting 或 Corsiva Hebrew。配合朱色标记、正文链接下划线、直角与无阴影。Terminal 的界面、标题与
正文都使用 IBM Plex Mono，配合青色链接、琥珀强调、2 px 圆角与无阴影，打印角色
仍为 IBM Plex Sans。系统排版模式不请求内置文字字体，除非站点显式覆盖角色。
没有新增外部字体请求。Terminal 仅压紧
桌面导航，保留正文行长与手机触控目标。CSS 标题标记使用空的无障碍替代文字，
不支持的浏览器省略标记。显式 `fonts.ui` 仍控制主字体（含标题），除非设置了有效的
`fonts.body` 或 `fonts.heading`。参见[实验记录](/zh/docs/design/research/2026-10-05-ink-terminal-experiment/)。

汉字使用读者系统已有的字体，主题不分发任何中日韩字体文件。每套预设以不同方式
编排中文骨架；西文与汉字同处一行时类别一致：无衬线配黑体，衬线配宋体。

| 预设 | 正文的西文与汉字 | 标题的西文与汉字 | 强调与引称 | 引用 |
| --- | --- | --- | --- | --- |
| Paper | IBM Plex Sans；平台黑体 | IBM Plex Sans；平台黑体 | 楷体 | 正文字体 |
| Slate | Inter；平台黑体 | Inter；平台黑体 | 楷体 | 正文字体 |
| Ink | Palatino；仿宋（`size-adjust: 108%`），未安装时为宋体，字号 17 px | Palatino，章节为斜体；楷体，未安装楷体时为宋体 | 楷体 | 楷体 |
| Terminal | IBM Plex Mono；平台黑体 | IBM Plex Mono；平台黑体 | 正文字体，直立，强调色 | 正文字体 |
| News | 系统衬线（Charter、Iowan Old Style、Cambria、Georgia）；宋体，字号 17 px | Times New Roman；宋体-简 Black，Windows 上为粗黑体 | 楷体 | 楷体，西文为斜体 |
| GitHub | GitHub 系统字体栈；平台黑体 | GitHub 系统字体栈；平台黑体 | 楷体 | 正文字体 |

为此新增三个角色：`--td-emphasis-font-family` 用于 `em`、`cite`、`dfn` 与无类名的
`i`，`--td-heading-emphasis-font-family` 用于标题内的强调，`--td-quote-font-family`
用于 `blockquote`。`[!QUOTE]` 提示块正文使用强调角色。这些角色不是
`params.ui.fonts` 的键，站点在自己的 CSS 中设置。楷体来自 `OINK Kai`：只用
`local()` 引用（Kaiti SC、STKaiti、KaiTi），仅覆盖中日韩码位，`size-adjust: 114%`，
同时声明为正体与斜体，因此汉字从不被推歪，同一短语中的西文仍保留真斜体。未安装
楷体时（如 Android），该字体不会加载，由其后的字体栈接替。另有一组 600 至 900
字重的字体只引用系统已安装的粗楷体（Kaiti SC Bold、Kaiti TC Bold），楷体标题与加粗
的汉字强调因此显示真正的粗体；未安装粗楷体时这组字体不加载，由常规字体合成粗体。
仿宋以同样方式来自 `OINK Fangsong`（STFangsong、FangSong），仅覆盖中日韩码位，
`size-adjust: 108%`，同时声明为正体与斜体，只用于 Ink 的正文。中文 Windows 自带楷体与
仿宋，macOS 读者需要自行下载，手机与多数 Linux 两者都没有，因此 Ink 的中文在那里显示为
宋体；在没有可按名称引用的宋体的平台上（如 iOS），显示为平台的回退字体。`local()`
别名还能命中 WebKit 按字体族名查不到的已下载字体。Ink 与 News 的标题字体栈在 `serif` 之前列出 Microsoft YaHei，没有可用宋体的 Windows
显示粗黑体；Ink 与 News 的正文字体栈以 STSong 与 SimSun 结尾。这些字体栈只在
macOS 上审阅过。

所有预设共用同一组正文细节。Markdown 中的裸 `<kbd>` 采用 `kbd` 短代码的键帽
样式，列表符号使用三级墨色；GitHub 按 GitHub 的画法重新设定这两项。中文、日文、韩文段落（`:lang(zh)`、`:lang(ja)`、
`:lang(ko)`）中的标题字距为零；各预设的负字距只作用于其他语言。`.td-content`
设置 `text-autospace: normal`，代码、`kbd` 与 `samp` 不参与；段落、列表项与引用
使用 `text-wrap: pretty`。不支持这些属性的浏览器保持原有渲染。Ink 的所有标题都用
正文字重并带一丝洇墨：页面标题为正体，章节标题用书写体斜体配直立楷体，在深色纸面
上为金色，标题上方留出更深的天头；Landing 分区标题同样用正文字重。每节开头有一道由浓到淡的笔触（强制色彩模式下为
2 px 横线），`hr` 是一道两头收锋的短笔画，表格与提示块标签用标题字体书写，保持原有
大小写与字重。Ink 正文中的中文 `strong` 不加粗，改为朱色着重号。Blog 文章与 Book
章节的首段以标题字体、强调墨色的三行首字开篇，包括有编号、有正文且不列子页的 Book
分支页面包。索引页保持普通首字。导航当前行用一个朱色圆点标出。纸面渐变与 News 的光晕只在屏幕上显示，
强制色彩模式下让位于系统画布。Ink 的引用挂在一道 3 px、向下渐淡的朱砂笔触
上；Terminal 的引用使用其强调色竖线。两者在打印与排版复制中保留这道竖线，Ink 的
标题在这两处使用楷体。Terminal 生成的标题标记使用 400 字重与 `0.12em` 字距。深色
Terminal 另有带淡淡辉光的绿色标题、指针悬停时发光的链接、淡淡的扫描线、以绿色光标条
标出的导航与搜索当前行，以及各部分区分清楚的语法配色：关键字荧光绿、字符串琥珀、
数字青色、名称浅灰、注释暗淡。

News 的页面标题用最粗的字重、收紧字距，下方加双线；其下的页面描述成为副题，西文为
斜体，没有斜体的文字保持直立；日期线为界面衬线字体的大写小字，夹在两道细线之间。每节开头
有一道粗细双线，`hr` 画成双线，站点页头下缘也收在一道双线上，像报头。表格不加外框，
标签上方与末行下方各一条墨线，标签大写并加宽字距。引用是拉引：字号大一级，上方一道
粗线、下方一道细线，侧边不加竖线，保持起始对齐。提示块、搜索、菜单与外观面板去掉
圆角。导航控件、搜索键帽、Landing 磁贴、文章操作按钮、缩略图和头像外框均用直角且不加阴影。
文件树、标签页标题和分类计数也遵循这条规则。
导航当前行用黑色栏线与粗体标出，不加底色。GitHub 遵循
github-markdown-css 5.9.0 与 @primer/primitives 11.10.0（均为 MIT 许可）：正文
16 px、行高 1.5；标题为半粗体、零字距，`h1` 与 `h2` 下方各一条细线，宽屏时锚点以
链接图标置于标题前；代码块为灰底，带标题的代码块是带框的文件框；表格每个单元格
都有边框，偶数行加底色，宽度随内容收缩；`hr` 为 0.25em 粗条；提示块采用 GFM alert
配色；侧栏当前行左侧加 4 px 竖条；主按钮为绿色。为满足对比度，GitHub 的三个数值有所
调整：深色主按钮悬停色为 `#268838`；浅色选中标签页下划线用 `#bc4c00`，替代对比度
仅 2.15:1 的珊瑚色；深色焦点环沿用链接蓝。

正文中的链接在每套预设下都带有不依赖颜色的线索。News、Ink 与 GitHub 使用
下划线，字重与周围文字相同：News 的下划线为 1 像素、链接色的一半浓度，悬停或
聚焦时变为完整颜色；Ink 的为实线，以强调墨色画在墨色文字下；GitHub 的为实线。Paper、Slate 与 Terminal 保持 600 字重、
不加下划线。这里的正文指段落、表格
单元格、图注，以及没有类名的列表或 `.steps` 列表、任务列表的条目。带有其他类名的列表
属于组件：其中的链接（如卡片标题、Book 目录、文件树条目）在所有预设下都保持 600 字重、
不加下划线。标题锚点、徽章、按钮与脚注引用除外。行内代码在 Paper、Slate 与 Ink 中为 600 字重，
在 News、Terminal 与 GitHub 中为 400 字重，因为底板或边框已经标明了代码；加粗的代码在所有预设中均为 600。这些规则保持
元素级优先级，主题的语义 `code` 元素与站点自有样式仍可覆盖。表格单元格使用等宽数字。
表格视口的顶部圆角为 8 px，除非预设为其加了外框或改为直角。深色模式使用灰度字体平滑。

> [!NOTE] OINK 1.4.0 的 Paper 章节标题
> Paper 在浅色与深色模式下均不再绘制正文 `h2` 标题右侧的装饰横线。
> 标题的字体、间距、锚点与正常换行保持原样，仍支持站点自定义的标题边框。

Giscus 自动色板同时跟随风格与明暗；显式主题或浅深色样式表配置仍优先。打印使用
当前预设的浅色配色与白纸背景，即使屏幕为深色。Mermaid 与 ECharts 继续只跟随
明暗，API 组件保留供应商色板。参见[已接受决策](/zh/docs/design/decisions/visual-presets/)
与[本地验收记录](/zh/docs/design/research/2026-10-05-visual-presets-acceptance/)。

## 排版复制 {#typeset-copy}

`params.ui.rich_copy` 是布尔值，默认 `true`；front matter 与分区 cascade 可以覆盖。
其他取值告警并保持默认值。开启时，可交互的 HTML 输出加载
`js/chunks/rich-copy.js`；打印、Markdown、RSS 与 LLMS 输出不加载。

运行时处理触及正文（`.td-content`）的单区间选区的 `copy` 事件。它写入
`text/html`，`text/plain` 保持浏览器自身的 `Selection.toString()`。以下情况它不做
任何事，由浏览器原生复制：事件已被其他处理器阻止、选区位于表单字段或可编辑区域、
选区完全落在界面元素内，或任一步骤抛出异常。

HTML 由选中的节点重建，不使用浏览器带样式的序列化结果：

- 输出只包含 `h1`–`h6`、`p`、`a`、`strong`、`em`、`del`、`u`、`mark`、`sub`、
  `sup`、`kbd`、`code`、`pre`、`blockquote`、`ul`、`ol`、`li`、`table`、`tbody`、
  `tr`、`th`、`td`、`caption`、`figure`、`figcaption`、`img`、`hr`、`br` 与 `span`。
  属性只有 `style`、`href`、`src`、`alt`、`start`、`reversed`、`value`、`colspan`、`rowspan`，以及代码块上的
  `class="language-…"`。从有序列表中间开始选取多个条目时，复制结果保留条目原有的编号。
- 链接保留 `http`、`https`、`mailto`、`tel` 的绝对地址，其他协议变为纯文本。
  图片保留 `http`、`https` 或 `data:image/` 的绝对地址。
- 丢弃：页尾区块、文章元数据、署名、系列条、页面操作、面包屑、标题锚点、脚注
  返回链接、代码块工具、标签页列表、按钮、表单、导航、内嵌 frame、媒体、
  canvas、SVG，以及隐藏、`aria-hidden`、视觉隐藏、未渲染或不可选中的内容。
  折叠的 disclosure 只复制摘要。
- 颜色取自 `--td-print-*` 属性：无论屏幕明暗，都是预设的浅色色板配白底。只使用
  能解析为十六进制、`rgb()`、`rgba()` 或 `color(srgb …)` 的值，其余回退到内置色板。
  尺寸使用像素。不输出画布颜色、自定义属性、`rem` 值或网页字体名。
- 代码块保留文本、文件名与语法着色，不含行号。浅色代码表面使用打印代码底色；
  深色代码表面保留自己的背景与墨色。提示块变为引用，标题加粗，语义色作为竖线。
  KaTeX 复制为 `$` 或 `$$` 包裹的 TeX 源码。
- 行内空白按 CSS 规则折叠，但两个汉字、假名或全角字符之间的源码换行不产生空格。
- 选区位于一行正文、一个列表项、一个单元格或一行代码之内时，复制为不带 `style`
  的裸标记，由粘贴目标决定格式。选区超出文章范围时只复制文章。

`--td-copy-heading-rule`（`under`、`over` 或 `none`）与 `--td-copy-heading-font`
让预设决定剪贴板中二级标题横线的位置和标题字体。Ink 使用 `over` 与楷体；Terminal 使用
`none` 与平台等宽字体栈；News 保留默认横线，标题字体为 Times New Roman 配宋体；GitHub
显式写出默认值 `under`。

`tests/js/rich-copy.test.js` 负责序列化器，`bin/check-params.py` 负责配置项，
文档站的 `rich-copy.spec.mjs` 在每套预设下测试真实页面。在微信、Word 等编辑器中的
粘贴结果取决于各编辑器自己的过滤规则，不在自动化测试范围内。

## 译文阅读运行时 {#translation-reader-runtime}

唯一设置是布尔参数 `params.ui.compare`，默认 `false`，可按语言覆盖。无效值会警告并
保持关闭。Hugo 只从同样开启对照的语言中的真实译文页面推导候选，并输出少量描述数据。
入口脚本在点击后加载阅读器，阅读器使用两个同源 HTML frame，不生成语言组合或新的
内容输出。保留的宿主页使总数为三个活动文档。读者偏好（最后的目标语言与同步设置）存放在
`localStorage` 的 `td-compare-reader` 键中，读写均包在 `try`/`catch` 里；可恢复的会话（目标、
同步、可见窗格和语义书签）只存放在阅读器自身历史记录的 `history.state.oinkCompareSession` 中。

`oink_compare_pane=1` 仅在已打开阅读器拥有的 frame 中启用内部窗格状态。顶层访问
该 URL 仍显示普通页面。自定义脚本可以在 head hook 中读取 `window.OinkComparePane`。
窗格状态停用外壳运行时与快捷键、搜索初始化、评论和主题管理的统计，保留正文运行时与
样式。`bin/check-compare.py` 把每个浏览器运行时归类为窗格中停用、窗格中运行或仅限
宿主页，新增运行时必须声明它在窗格中的行为。开启对照后，生产构建通过主题自带的、
能识别窗格的模板渲染 Google Analytics，而不是 Hugo 内置 partial；因此站点覆盖的
`google_analytics.html` 不再生效。Frame 隔离文档 ID，同源内容仍属于受信站点内容。
窗格需要 `frame-src 'self'` 和同源嵌入。普通 canonical 链接继续标识原页面。Print
和机器输出不包含对照控件或对照运行时。

窗格以其启动脚本报告 DOMContentLoaded 为就绪，而不是等待所有图片和嵌入内容加载完成；
缓慢的资源不会推迟或销毁已经可读的窗格。无效文档在其 load 事件或 15 秒文档超时后
判定为失败。iframe 初始的 `about:blank` load 事件会被忽略，但超时时仍为空白的文档
会判定为失败。浏览器在就绪时测量几何位置，并在窗口尺寸、frame 的 load 事件、
字体、图片以及折叠项或组件布局变化（包括 `td:tab-shown`）后重新计算。用户输入决定当前活动窗格，程序驱动的跟随滚动不会夺取控制权。滚动更新
按动画帧合并。主动窗格连续滚动时，跟随窗格逐帧即时跟随，因为每帧重新开始平滑滚动会
让跟随窗格停滞；单次跳转在允许动画时平滑过渡，偏好减少动态效果或恢复阅读位置时直接
定位。关闭或替换窗格时会终止对应的事件监听器、观察器和加载超时计时器。原生
`dialog` 的 inert 机制将焦点限制在阅读器内，子文档键盘事件处理保留窗格内组件对话框与 ARIA 对话框
的交互，窗格链接处理同时支持 SVG 锚点。阅读器的历史记录在页面刷新或前进/后退恢复后仍然保留：入口脚本将恢复状态
绑定到该历史记录的 token，并在阅读器脚本加载完成后再次校验；若加载期间已离开该
记录，则取消恢复。在原记录上重新打开时保留既有 token 且不重复写入历史。历史记录
跳转会先处理显式关闭或用户排队触发的重开，再执行自动恢复。跨越窄屏断点迁移语言
菜单时，会先更新窗格可见性与不可交互状态，再恢复菜单的键盘焦点与展开状态。
运行时在改变菜单容器的可见性之前捕获焦点；媒体查询样式不得在回调之前隐藏该容器。

## 发布状态 {#release-states}

发布流程中应分别跟踪本地验证、模块打标、消费站版本更新与站点部署。

## v1.5.1 审查修正 {#unreleased-review-corrections}

v1.5.1 继续使用 Hugo Extended 0.168.0 和 Go 1.27.3。
验证报告必须注明实际工具链和本地模块来源。

Feed 在应用 `services.rss.limit` 前按日期倒序排列，无日期条目省略 `pubDate`。
RSS 摘要和页面订阅源可能在 RSS 阶段共用页面 Store。摘要渲染保持该 Store 的 RSS
格式状态，不恢复陈旧的 HTML 状态，同时保留手工摘要分隔符的语义。

焦点指示器使用当前预设的不透明链接颜色。导航栏控件及会裁剪内容的代码块、
FAQ 容器保留可见的键盘焦点。强制颜色模式明确显示当前导航项和页脚字标。
标题及字段自链接保持键盘可达，打印链接保留下划线。本地 Bootstrap RTL
制品提供方向规则，但不替换主题的字体角色。正文列表间距不应用到组件列表。

配置 schema 接受 `translation_notice` 为 `false` 或非空语言代码字符串，
语言是否存在由所属解析器验证。分页和面包屑标签覆盖全部 32 种语言。
缩略图替代文本直接使用页面标题，不添加英文前缀。
