---
title: 架构契约
linkTitle: 架构
description: 仓库装配、配置、诊断、输出、性能、安全、CSS、无障碍与发布状态的边界。
weight: 10
icon: fa-solid fa-sitemap
search_keywords: [OINK 架构, 仓库边界, 运行时, 输出格式, 安全, 无障碍, 性能]
contract_status: released-v0.7.1
---

> [!IMPORTANT] OINK 0.7.1 契约
> 这是随 OINK 0.7.1 正式发布的架构契约。本页是权威中文源文件，与英文版本
> 一同维护在 `content/docs/design/`。

## 仓库与装配 {#repository-and-assembly}

仓库根目录是一个完整的 Hugo 模块与主题，不是站点，也不是 npm workspace。
Hugo Extended 负责编译 SCSS 与模板。浏览器运行时与第三方资源都已提交到仓库，
因此普通构建不会访问网络。公开的双语文档、示例与浏览器测试位于同级的
`oink.pgsty.com` 仓库；主题仓库只在 `tests/site/` 中保留范围明确的内部回归
夹具，不再维护独立的公开示例面。

生成的 `public/` 与 `resources/` 目录绝不是源文件。随主题内置的运行时、字体
家族与 Font Awesome 字形定义属于受支持的发行内容，并非待清理的死代码；
`VENDOR.json` 与 `bin/check-vendor.py` 固定其完整性。OINK 发布完整的受支持
Font Awesome 发行包，因为用户编写的内容可能使用主题模板本身没有引用的图标。

Font Awesome 官方编译 CSS 作为一份稳定、带指纹的 vendor 样式表发布，并排在由
主题与消费站 SCSS 编译出的指纹 `main.css` 之前。站点样式的普通修改不会再让图标
发行包失效，同时常规层叠顺序仍允许站点覆盖它。KaTeX、DocSearch、Swagger 与
Asciinema 等能力样式继续保持独立，只在实际使用时加载。内容指纹使不可变 URL 成为
可能；HTTP 缓存响应头属于部署宿主，而不是 Hugo 主题的职责。

Hugo 类型 `docs`、`book`、`blog` 与 `swagger` 选择阅读外壳；
`params.ui.shell_types` 可以增加类型。落地页使用 `layout: landing`。OINK 没有
`article` 类型或第二套博客外壳；沉浸式页面只是[外壳契约](/zh/docs/design/shell/)
定义的一种博客展示方式。

`layouts/_partials/shell/config.html` 解析共享外壳事实。布局必须先通过
`content/render.html` 渲染，再执行 `scripts.html`，因为渲染钩子与 shortcode
会在 Page Store 中登记能力标志。覆盖时应选择范围最窄的 partial；若合并会改变
Hugo 的查找优先级，即使几个基础模板看起来相似，也应保持分离。

## 配置与诊断 {#configuration-and-diagnostics}

主题策略位于 `params.ui.*`；`comments.giscus`、`plantuml`、`drawio` 等包含多项
设置的集成保留在顶层。布尔功能直接使用布尔值，除非它还包含多项设置。页面级
覆盖会去掉 `ui.` 前缀：`params.ui.image_zoom` 对应 `image_zoom`，front matter
中绝不嵌套 `ui` map。`hugo.yaml` 声明公开默认值；对应的解析器与检查器定义
任何可选配置的结构或范围。

无效输入遵循同一条规则：警告中写明输入值、允许的结构与安全回退，然后使用该
回退，或省略不安全的功能。普通 `hugo server` 因而仍可使用，而所有发布门禁都
使用 `--panicOnWarning`。主题绝不调用 `errorf`，`check-params.py` 会强制守住
这条边界。不要为无法到达的状态增加臆测式校验。

OINK 没有通用的键名重命名注册表。仍需给出迁移诊断的过渡，应在所属解析器中
添加针对性警告，并配严格的反向测试；已经移除的键绝不能作为兼容路径继续读取。

可能联网的功能必须显式启用，并以关闭方式降级。PlantUML 需要
`plantuml.svg_image_url`，Draw.io 需要 `drawio.drawio_server`，Algolia 需要
`appId`、`apiKey` 与 `indexName`；配置不完整时发出警告，而且不产生网络请求。
Draw.io 只在渲染内容含 PNG 或 SVG 候选图片时加载，并且每个不同的图片 URL
只检查一次。

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
包资源优先于继承的 cascade 图片。列表缩略图、Open Graph/Twitter/schema
帮助模板、作者头像、Pinterest 图片与博客展示都消费同一个决定。

`params.ui.featured_image` 只用于博客，默认值为 `none`；页面或 cascade 可用
front matter 覆盖。`banner` 在单页标题上方渲染图片，`wash` 用图片给页头着色，
`hero` 在单页与分区索引上把图片绘制为外壳背景。缺少图片或使用非 HTML 输出时
不渲染图片。

## 输出与运行时 {#outputs-and-runtime}

每个基础模板都会设置 `Page.Store.tdOutputFormat`：

| 输出 | 契约 |
| --- | --- |
| HTML | 完整的语义内容；只为实际用到的能力加载本地运行时 |
| Print | 展开的内容；不含外壳导航、搜索或图片缩放运行时；共享操作层仍支持明确的打印控制 |
| Markdown / LLMS | 保持源 Markdown 形态，不含 `td-` 组件标记 |
| RSS | 安全的静态摘要，或明确省略 |
| BookManifest | 选择启用、供出版打包器消费的有序 JSON 交接；绝不冒充 EPUB 或 PDF |

站点自行选择是否启用自定义输出；OINK 不会强制生成昂贵的整书聚合。HTML 加载
共享操作层、核心层，以及由页面 flag 选择的稳定第一方能力分片。需要模板化的能力
每种语言至多发布一份；flag 只决定引用哪些 script tag，绝不再生成新的组合 bundle。
Print 保留操作层，并且只加载渲染打印功能所需的运行时。大型第三方 UMD 文件保持
独立；未使用的功能运行时不会出现。

只有 Book 根在 `outputs` 中明确列出 `BookManifest` 时才会生成它。它引用该 Book
既有的逐页 Markdown，并记录派生出的页面顺序、标题、编号目标与 xref；主题不会在
其中猜测出版元数据，它也不是可分发的电子书。

主题仓库提供 `bin/book-epub.py` 与 `bin/book-pdf.py` 作为显式出版步骤，并用
`bin/check-book-epub.py` 与 `bin/check-book-pdf.py` 承担产物门禁。EPUB 打包器组合
`BookManifest` 与同一份整书 Print HTML，消费站另行传入出版 metadata；PDF runner
只在临时回环地址提供该 Print 产物，通过 `script-src 'none'` 内容安全策略调用显式指定的
Chrome/Chromium 二进制，输出带 CSS 页码的 A4 页面。两种工具都会拒绝缺失资源或越出构建树的资源；网络资源
与覆盖已有输出分别需要独立的显式开关。网络 opt-in 只允许被动 HTTP(S) 媒体，远程脚本与
本地文件协议仍属非法。EPUB metadata 文件中的相对资源以该文件所在目录为基准，不依赖
调用者的工作目录。普通 Hugo 构建不会执行出版工作；PDF 仍从 Print 派生，而不是另一种
模板输出。

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
密度。`bin/sites/build-all.py` 在隔离快照中构建维护范围内的消费站点。

## 信任边界、CSS 与无障碍 {#trust-css-and-accessibility}

作者可以启用 Goldmark `unsafe`，但配置与组件参数不能视作原始 HTML。共享属性
策略使用允许清单、校验 class token、放行 `data-*` 与 `aria-*`，并在丢弃
`style`、`srcdoc`、`on*`、保留属性与未知属性时发出警告。需要本地 URL 或明确
绝对 URL 时，URL 帮助模板会拒绝危险协议与协议相对 URL。公开 API 承诺支持的
远程 URL 仍然可用，但构建时绝不抓取它们。

主题输出使用 `td-` class、`data-td-*` 属性与 `--td-*` 自定义属性；`.steps`、
`.cards`、`.full-width` 等作者标记保持无前缀。CSS 支持 RTL、打印、强制颜色、
减少动画、超长 token 与窄视口。主题拥有的装饰图标带 `aria-hidden`；只有包含
任务列表或原始 Font Awesome 元素的页面才加载作者内容无障碍修复。

字体角色为 `ui`、`body`、`heading`、`code`、`display`、`meta` 与 `print`，
通过 `--td-*-font-family` 暴露。`ui` 是主字体：`body` 经它解析，`heading` 又经
`body` 解析，因此赋一次值即同时移动界面、正文与标题。`params.ui.typography`
可取 `technical` 或 `system`；两者编译到同一份样式表，不加载运行时。旧
Bootstrap/Docsy Sass 变量继续为这些角色提供初值。

`params.ui.fonts` 让配置层触达同一组角色，供不愿挂载 SCSS 或新增样式表的站点
使用。它只写字体族名，绝不加载字体文件：所写字体族必须是读者已有的，或站点
自己用 `@font-face` 声明过的，这也让该键留在网络契约之外。取值只放行纯粹的
字体族语法，输出的 `:root` 块由匹配到的片段重新拼装；未知角色或不安全取值只
告警并单独丢弃。该块在样式表之后渲染，正是这一点让作者字体在同等优先级下压
过预设。外壳读站点的字体，不自带字体：Book 的编号与题注用正文字体，而非某种
技术字体。

强调色按角色拆开。**强调文字**（链接、外链、行内代码）跟随 Bootstrap 链接
族与 `--bs-code-color`，主题色永不重声明它们；行内代码是固定的胭脂红明暗对，
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

## 发布状态 {#release-states}

源码完成、本地验证、提交、打标签、推送、消费站点固定版本、部署与生产一致是彼此
独立的状态。一次本地 Hugo 构建只能证明本地验证通过。
