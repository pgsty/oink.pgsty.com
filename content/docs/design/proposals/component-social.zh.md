---
title: "社交帖子组件"
linkTitle: 社交帖子组件
description: 用于引用 X 或其他社交平台帖子的静态离线卡片，包含作者、账号名、头像、日期、链接与 Markdown 正文；构建期不联网获取，也没有运行时。
weight: 29
icon: fa-solid fa-comment-dots
search_keywords: [social, 社交帖子, x, twitter, 推文, bluesky, mastodon, threads, 微博, 离线嵌入, 引用, 组件]
design_kind: proposal
design_status: implemented
proposal_date: 2026-11-27
---

> [!NOTE] 已实现，等待接受
> `social` 短代码已在主题 main 分支的工作区中实现，并写入了[社交帖子指南](/zh/docs/components/social/)。首版实现已提交（主题 `730e9f6`，站点 `e00295c`），评审后的加固尚未提交，均未发布。所依据的共同决策见[总览](/zh/docs/design/proposals/content-components-expansion/)。

| 记录 | 内容 |
| --- | --- |
| 状态 | 2026-11-27 实现（`730e9f6` / `e00295c`），经深度评审加固；等待接受 |
| 负责人 | OINK 维护者 |
| 交付阶段 | S3 |
| 形态 | 带 Markdown 正文的短代码：`{{</* social … */>}}…{{</* /social */>}}` |
| 新增公共 API | 短代码 `social`，参数为 `author`、`handle`、`avatar`、`date`、`url`、`platform`；语言键 `ui_social_view_original` |
| 运行时 | 无 |
| 实现 | `layouts/_shortcodes/social.html`、`layouts/_partials/content/markdown-escape-inline.html`、`assets/css/td/social.css`、夹具 `tests/site/content/fixtures/social.md` |

## 概要 {#summary}

```markdown
{{</* social author="OINK Example" handle="@oink_example" avatar="/logo.svg"
            date="2026-02-15" url="https://example.com/oink_example/status/1" */>}}
The post text, in ordinary **Markdown**, with its line breaks and links.

![The screenshot attached to the post](demo.webp)
{{</* /social */>}}
```

卡片显示头像、名称、账号名、平台图标、正文、附图、日期以及原帖链接。所有内容都来自页面本身，构建期和浏览期都不获取任何数据。`platform`（顶层默认 `x`，嵌套默认 `none`）为 Bluesky、Mastodon、Threads、微博、知乎、Telegram 或 LinkedIn 的帖子选择对应图标，版式保持不变，或使用 `none` 省略图标。

## 问题 {#problem}

Hugo 内置的 `x` 短代码在构建期向 X 请求 oEmbed 数据（Hugo 会在本地缓存响应，因此 CI 这类全新构建会重新请求），生成的嵌入还会在读者浏览器中加载 `widgets.js`。对 OINK 而言，这意味着：

- 构建需要联网，违背“普通构建不下载任何内容”的规则，在无法访问 X 的环境中还会失败；
- 读者要加载带有跟踪和版面偏移的第三方脚本；
- 原帖被删除、设为私密或账号改名后，引用随之消失；
- 卡片无视 OINK 的预设、明暗模式、Print、Markdown 与 RSS。

常见的替代做法是截图，但截图不满足无障碍要求（文字变成了像素），无法被搜索，也不会出现在 LLMS 输出中。

## 设计原则 {#principles}

1. **引用帖就是引文。** 它渲染为 `<figure>` + `<blockquote cite>` + 署名，是一张读来像引文的编辑式卡片，而不是平台界面的像素复刻。
2. **内容存放在页面中。** 作者只需保存一次文字和媒体；主题只渲染已有的内容，从不远程获取。
3. **正文靠组合。** 图片、画廊和引用帖都用 OINK 已有的语法书写，卡片无须为它们设置参数。
4. **平台只作标识，不改样式。** 所有平台共用一种版式，`platform` 只改变图标。
5. **不占用 Hugo 的名字。** 组件有自己的名字，Hugo 内置的 `x` 照旧按 Hugo 文档工作。

## 目标与非目标 {#goals}

### 目标 {#goals-list}

- 一张辨识度高、满足无障碍要求的帖子卡片，零网络请求，零 JavaScript。
- 支持文字、链接、图片（含图片缩放）、多图网格，以及一层引用帖。
- Print 输出同样的静态卡片；Markdown、LLMS 和 RSS 输出带署名的引用块。

### 非目标 {#non-goals}

- 在构建期或浏览器中获取任何数据；主题从不调用平台 API。
- 覆盖或改变 Hugo 内置的 `x` 短代码。
- 互动计数（点赞、转发、回复、浏览量）与认证徽章。
- 按平台区分的皮肤、品牌色，或模仿某个平台的界面。
- 卡片内的帖子串、回复、投票或视频播放。帖子中的视频在正文里写作 [Video](/zh/docs/design/proposals/component-video/)。
- GitHub issue、Hacker News、Reddit 或链接预览式的“书签”卡片；它们的数据形态不同。
- 第一阶段不提供数据文件形式，也不提供作者注册表。

## 行为 {#design}

### 参数 {#parameters}

| 参数 | 规则 | 无效输入 |
| --- | --- | --- |
| `author` | 显示名称，纯文本 | 非字符串：告警并忽略 |
| `handle` | 纯文本，按原样显示（`@name`、`@user@mastodon.social`） | 非字符串：告警并忽略 |
| `avatar` | 图片路径，经 `content/image-resolve.html`（`parameter="avatar"`）处理；名称就在旁边，因此作为装饰图（`alt=""`） | 不安全协议或非图片资源：以 `avatar` 为参数名告警并丢弃；静态路径在项目自己的 `static/` 中找不到时（仅在该目录存在时检查，路径先解码并规范化），以 ID `social:avatar-static` 告警并保留路径，使用模块挂载或自定义 `staticDir` 的站点可把该 ID 加入 `ignoreLogs`；用 `..` 越出站点根目录的静态路径告警并保留路径；从不抓取远程 URL |
| `date` | 纯文本。`YYYY-MM`，或 `YYYY-MM-DD` 后接可选的 `T`／空格、`HH:MM`、可选 `:SS` 与可选 `Z`／`±HH:MM`，且是真实日历日期时，输出 `<time datetime>`（空格写成 `T`）；其他写法输出 `<span class="td-social__date">` | 非字符串：告警并忽略 |
| `url` | 原帖地址，经共享 URL 策略处理（HTTP/HTTPS 附带 `rel="external"`，站内路径不附带）。可选，以便仍能引用已删除的帖子 | 无效：告警并丢弃 |
| `platform` | `x`（顶层默认）、`bluesky`、`mastodon`、`threads`、`weibo`、`zhihu`、`telegram`、`linkedin`、`none`（嵌套默认） | 未知、为空或非字符串：告警，回退至当前层级默认值 |

`author` 与 `handle` 至少提供一个。两者都缺失时，短代码告警并把正文渲染为普通引用块（空正文且 `url` 有效时渲染为含原帖链接的引用块），引用的文字不会丢失。有正文时，`url` 只保留为引用块的 `cite` 属性，Markdown 中不出现；`date`、`platform` 和 `avatar` 被忽略。没有头像时，用 CSS 绘制一个圆形，显示 `author`（或 `handle`）的首个字素簇（先剥离开头的 `@`、空白与不可见格式字符，剥离后为空时回退人物图标）；不请求默认头像，也不请求 Gravatar。只接受命名参数，未知参数会告警。

### 正文 {#body}

正文通过 `content/render-block.html` 渲染，并使用独立的 ID 作用域：

| 内容 | 写法 |
| --- | --- |
| 文字、换行、链接、代码 | 普通 Markdown |
| 一张附图 | Markdown 图片；符合条件时获得图片缩放 |
| 多张图片 | 正文中的 `gallery` 围栏（在卡片内采用匹配圆角的紧凑网格） |
| 引用帖 | 嵌套的 `social` 短代码；省略 `platform` 时默认 `none`，显式指定则呈现紧凑图标与隐藏平台名；超过一层嵌套告警 |
| 视频 | 一行 Video 图片语法 |

与所有短代码正文一样，正文中的脚注引用会告警，并按字面保留。正文为空时告警：若 `url` 有效，卡片渲染为仅含链接的卡片（匿名时渲染为含链接的引用块），否则不渲染任何内容。

### 渲染 {#rendering}

```html
<figure class="td-social td-social--x">
  <figcaption class="td-social__author">
    <img class="td-social__avatar" src="/logo.svg" alt="" loading="lazy" decoding="async">
    <span class="td-social__names"><span class="td-social__name" dir="auto">OINK Example</span> <span class="td-social__handle" dir="ltr">@oink_example</span></span>
    <i class="td-social__platform fa-brands fa-x-twitter" aria-hidden="true"></i>
    <span class="visually-hidden"> · X</span>
  </figcaption>
  <blockquote class="td-social__body" cite="https://example.com/oink_example/status/1">…</blockquote>
  <p class="td-social__meta"><a href="https://example.com/oink_example/status/1" rel="external"><time datetime="2026-02-15">2026-02-15</time> · View original<span class="visually-hidden"> — OINK Example</span></a></p>
</figure>
```

| 平台 | 图标（随主题内置的 Font Awesome 7.3.1） |
| --- | --- |
| `x` | `fa-brands fa-x-twitter` |
| `bluesky` | `fa-brands fa-bluesky` |
| `mastodon` | `fa-brands fa-mastodon` |
| `threads` | `fa-brands fa-threads` |
| `weibo` | `fa-brands fa-weibo` |
| `zhihu` | `fa-brands fa-zhihu` |
| `telegram` | `fa-brands fa-telegram` |
| `linkedin` | `fa-brands fa-linkedin` |
| `none` | 无 |

图标是装饰性的单色图标；有平台名称时以视觉隐藏文字提供给辅助技术。卡片使用抬升表面令牌（`--td-brand-elev`），嵌套引用回到 `--bs-body-bg`，正文隔离 `blockquote` 的楷体规则以保持与预设正文一致；Ink 和 Terminal 保持平面、直角的几何形态（0px 与 2px），Terminal 中的头像也是方形。Print 无论屏幕明暗都切换至 `--td-print-*` 纸张调色板，并在链接后打印原帖 URL。RTL 通过逻辑属性镜像，并对账号名与 ISO 时间戳执行 LTR 双向隔离；过长的账号名和 URL 会自动换行。

### 输出 {#outputs}

| 输出 | 结果 |
| --- | --- |
| HTML | 卡片本身，没有运行时。正文图片照常按条件接入共享的图片缩放 |
| Print | 纸张调色板上的静态卡片，URL 可见 |
| Markdown / LLMS | 引用块：先是正文各行，然后是 ``— OINK Example (`@oink_example`) · X · 2026-02-15 · [View original](url)``；嵌套帖子变为嵌套引用块。署名中的文字经 `content/markdown-escape-inline.html` 处理 |
| RSS | 包含 `<blockquote cite>`（仅含链接的卡片省略空引用块）与带绝对 URL 署名行的 `<figure>`；不含头像 |

### Hugo 自带的 `x` {#hugo-x}

Hugo 内置的 `x` 短代码保持可用且不变：它在构建期获取 oEmbed 数据，并在浏览器中加载 X 的脚本。OINK 不拦截它。指南建议用 `social` 做离线、永久的引用。

最初的方案是覆盖 `x`，在 Hugo 0.170.1 上做探针后被否决：读取 `.Inner` 的短代码模板会让 Hugo 解析器要求每次调用都必须闭合或自闭合，Hugo 文档中未闭合的写法 `{{</* x user="…" id="…" */>}}` 会在任何模板有机会告警之前就构建失败（`shortcode "x" must be closed or self-closed`）。

### 权利与存档 {#rights}

主题本身不存储任何内容。作者自行决定可以引用什么、可以保留哪些头像和媒体，指南会明确说明这一点。原帖删除后卡片依然存在，这正是离线引用的意义所在；`url` 是可选的，作者可以去掉已经失效的链接。

## 权衡与备选方案 {#alternatives}

| 初稿要素 | 决定 | 理由 |
| --- | --- | --- |
| 名称 `x`，取代 Hugo 内置版本 | 改名为 `social`（负责人，2026-11-27） | 与 Hugo 不冲突，已有的 `x` 调用不会解析失败，而且这个名字对每个平台都读得通 |
| `likes`、`reposts`、`replies`、`views` | 移除 | 快照会过时并误导读者；还需要四个语言键 |
| `verified`（蓝、金、灰） | 移除 | 属于平台专有概念，会随时间变化，还暗示主题能做它无法完成的认证 |
| `images` 与 `image_alts` 列表 | 改用正文图片与 `gallery` | 替代文字紧挨各自的图片；缩放、图片处理与资源解析无须额外实现 |
| `quote_author`、`quote_handle`、`quote_date`、`quote_url`、`quote_text` | 改用嵌套 `social` | 参数相同、规则相同，无须另设一套平行参数 |
| `data=` 文件形式 | 移除 | 每条帖子一个数据文件会形成第二个权威来源；辅助工具可以直接生成短代码文本 |
| `data/x_authors.yaml` 注册表与自动查找 `assets/avatars/<handle>.*` | 暂时移除 | `avatar="avatars/name.jpg"` 已能共享同一个全局文件；隐式文件查找难以被发现 |
| `github`、`hackernews`、`reddit` 平台 | 移除 | 标题、讨论串和缺失的头像属于另一种组件 |
| 按平台自动添加账号名前缀 | 移除 | 账号名按书写原样显示 |
| 按平台区分的样式 | 统一版式 | 颜色由预设负责；否则平台一改版，主题就会显得过时 |

## 配套辅助命令 {#helper}

手工填写参数是主要的使用阻力。将来 `../oink-cli` 中的 `oink fetch social <url>` 可以在写作时一次性把头像和媒体下载到页面包中，并输出一段可直接使用的 `social` 短代码。它不在本提案范围内，需要单独的 `oink-cli` 提案，因为它要用到的端点并非官方接口，可能变更或受限，还涉及使用条款问题。主题从不依赖它。

## 兼容性 {#compatibility}

- 新增一个短代码名称；Hugo 内置短代码均不受影响。
- 短代码数量从 29 个增至 30 个。

## 实现与检查 {#implementation}

| 部分 | 位置 |
| --- | --- |
| 模板 | `layouts/_shortcodes/social.html`（使用共享的参数、URL、图片与正文渲染 partial；包含静态的 Markdown、Print 与 RSS 分支） |
| 样式 | `assets/css/td/social.css` |
| 语言文件 | 全部 32 个语言文件中的 `ui_social_view_original` |
| 夹具 | `tests/site/content/fixtures/social.md` 及其中文对页，由 HTML、Markdown 与 Print golden 固定 |
| 无效输入 | `bin/check-content-primitives.py` 中的 15 个 `social-*` 用例、`check_social_posts()` 及模板/样式契约校验，加上 `tests/browser/social.spec.mjs` 浏览器回归测试 |
| 指南 | [社交帖子](/zh/docs/components/social/) |

## 验收标准 {#acceptance}

- 禁用网络访问时，构建能渲染所有夹具。
- 任何 `social` 页面在构建期或浏览期都不向平台主机发起请求。
- Markdown 与 LLMS 包含可读的带署名引用块，不含组件 HTML。
- 无效输入会告警，并且只要存在正文就保留引用的文字。
- 预设、明暗模式、窄屏、RTL、强制颜色与打印评审全部通过。

## 待决问题 {#open-decisions}

1. **平台列表。** 已扩展为 `x`、`bluesky`、`mastodon`、`threads`、`weibo`、`zhihu`、`telegram`、`linkedin` 与 `none`。后续仅在具备随主题内置的图标且有作者需求时新增平台。
2. **作者注册表。** 建议：暂不提供；等实际页面出现重复元数据后再考虑。

## 决策日志 {#decision-log}

- **2026-11-27（初稿）。** 离线 `x`，包含八个取值的平台枚举、互动指标、认证徽章、图片与引用参数组、数据文件形式和作者注册表。
- **2026-11-27（评审）。** 精简为六个参数加组合式 Markdown 正文；记录了已验证的旧式 `x` 调用解析失败。
- **2026-11-27（负责人）。** 改名为 `social`，避免与 Hugo 的 `x` 冲突；`platform` 继续支持其他平台。
- **2026-11-27（实现）。** 按设计实现；另以视觉隐藏文字提供平台名称，打印规则在链接后显示原帖 URL。
- **2026-11-27（深度评审与加固）。** 修复深色打印剪影、嵌套卡片样式优先级失效、RTL 双向隔离、嵌套平台读屏矛盾、匿名空正文带 URL 退化、HTML5 `<time>` 校验、emoji/字素簇首字符截断、卡片内画廊网格与圆角、CJK 正文楷体泄漏、强制颜色首字母头像边框、离线 `static/` 头像告警以及上下文感知 Markdown 行内转义；新增 `zhihu`、`telegram` 与 `none` 平台及 Playwright 回归测试。
- **2026-11-27（对抗性评审）。** 首字符跳过开头的不可见字符（零宽空格、BOM、双向控制符及任意 Unicode 空白）；静态头像检查先解码并规范化路径，对用 `..` 越出站点根目录的路径告警，缺失文件的告警改为可用 `social:avatar-static` 关闭；Markdown 在每张卡片后留一个空行，相邻卡片不再合并为一个引用块；指南中日期、头像解析顺序与匿名卡片的描述已与实现对齐。
