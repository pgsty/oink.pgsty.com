---
title: 首页与落地页
linkTitle: 首页与落地页
description: 用一份本地 YAML 组合首页：Hero、卡片、能力面板、时间线、定价、案例、下载。任意页面也能用同一套分区做成落地页。
weight: 30
search_keywords: [首页, 落地页, landing, home, Hero, 分区, sections, data/home, data/landing, 产品页]
aliases:
  - /docs/scenarios/landing/
---

首页不是模板，是一份数据：`data/home/<语言>.yaml` 里的 `sections` 列表决定页面从上到下有哪些分区，每个分区的内容在同一份文件里按名字取。普通页面加 `layout: landing` 也能用同一套分区。

分区全部在服务端渲染。价格、star 数、截图、头像、下载状态都必须在 Hugo 启动前就存在于仓库中，没有分区会在浏览器里取数据。

从 Docsy 的 `blocks/*` 首页迁移过来的站点要重写首页：主题没有 `blocks/cover`、`blocks/section`、`blocks/feature` 这些 shortcode，保留它们会让构建报 `template for shortcode "blocks/cover" not found`。两条出路是本页讲的 `data/home/<语言>.yaml`，或者给一个普通页面加 `layout: landing`。

## 首页的数据来源 {#home-data}
首页的内容文件只留标题与描述：

```yaml {title="content/_index.zh.md"}
---
title: OINK
description: 本地优先、仅依赖 Hugo 的技术文档主题
---
```

分区数据按语言分文件：

```filetree {title="首页数据"}
- data/
  - home/
    - en.yaml            # 英文站首页
    - zh.yaml            # 中文站首页
```

查找顺序是 `data/home/<当前语言>.yaml` → `data/home/en.yaml` → 单语言站点的 `data/home.yaml`。

文件结构只有两层：一个 `sections` 列表，加上被列表引用的同名键。

```yaml {title="data/home/zh.yaml 的骨架"}
sections:
  - hero          # 用 hero: 键的数据
  - capabilities
  - type: cards   # 用 cards 分区，但读 release: 键的数据
    key: release
  - cta

hero: { … }
capabilities: { … }
release: { … }
cta: { … }
```

这是本站首页的写法，完整文件见仓库的 `data/home/zh.yaml`。

## 最小可用首页 {#minimal}

粘贴下面这段，替换文字与链接即可发布。链接写成不带前导斜杠的站内路径，主题会补上当前语言前缀（`docs/start/` → `/zh/docs/start/`）。

```yaml {title="data/home/zh.yaml"}
sections:
  - hero
  - cards
  - cta

hero:
  eyebrow: 本地优先 · 仅依赖 Hugo
  title_lines:
    - words:
        - { text: PGSTY OINK }
  lead: 组件写在 Markdown 里，资源随主题分发，一份内容产出四种输出。
  image:
    light: images/hero-light.webp
    dark: images/hero-dark.webp
    alt: OINK 工程文档插图
  actions:
    - { label: 十分钟上手, url: docs/start/, icon: fa-solid fa-rocket, style: primary }
    - { label: 看组件, url: docs/components/, style: ghost }

cards:
  eyebrow: 能做什么
  title: 工程文档需要的都在里面
  columns: 3
  items:
    - title: Markdown 原生组件
      desc: 提示块、标签页、参数表、文件树都是 Markdown 语法的一部分。
      icon: fa-solid fa-cubes
      url: docs/components/
    - title: 四态输出
      desc: HTML、打印、Markdown、RSS，同一份内容不丢信息。
      icon: fa-solid fa-file-export
      url: docs/customize/agents/
    - title: 本地优先
      desc: 字体、图标、搜索、图表运行时全部随主题分发，不连 CDN。
      icon: fa-solid fa-plug-circle-xmark
      url: docs/about/features/

cta:
  title: 从一个能跑的双语站点开始。
  text: 克隆文档站，删掉不要的，改成自己的。
  label: 开始使用
  url: docs/start/
  style: primary
```

## Hero {#hero}

Hero 是首屏，唯一一个带大标题与配图的分区。

```yaml {title="data/home/zh.yaml"}
hero:
  eyebrow: OINK 0.4.0 · 本地优先          # 标题上方的小字，带状态点
  title_lines:                            # 逐行控制的大标题
    - words:
        - { text: PGSTY OINK }
  lead: 一句话说清这是什么。                 # 支持行内 Markdown 与 <br>
  note: 无需 Node.js                       # 带图标的补充行
  note_icon: fa-solid fa-circle-check
  title_size: 4.25rem                     # 只接受 rem / em / px
  image:
    light: images/hero-light.webp
    dark: images/hero-dark.webp           # 只给一个时深浅色共用
    alt: 首屏插图
  media:
    ratio: '1fr 240px'                    # 文案与配图的列宽
    max_width: 240px
    hide_below: md                        # sm | md | lg | xl 以下隐藏配图
  actions:
    - { label: 开始使用, url: docs/start/, icon: fa-solid fa-rocket, style: primary }
    - { label: GitHub, url: 'https://github.com/pgsty/oink', external: true, style: ghost }
  detail: { label: 看看它长什么样, url: docs/about/showcase/ }
```

不写 `title_lines` 时用 `title`，两者都没有时用站点标题。配图是 CSS 背景图，`alt` 有值时容器带 `role="img"`，无值时对辅助技术隐藏。

`align: center` 是纯文字的居中首屏：文案块加宽居中，标题自动平衡换行，`note` 挪到按钮下方。它不接受 `image`，两者同时出现构建失败。

## 分区注册表 {#registry}

22 种分区，名字用连字符（旧数据里的下划线会被规范化）。除 Hero 之外，每种都共用 `eyebrow` / `title` / `desc`（或 `text`）三个抬头字段与一个 `class`。

| 类型 | 放什么 |
| --- | --- |
| `hero` | 首屏：大标题、按钮、跟随主题的配图 |
| `metrics` | 数字事实，可选计数动画与来源链接 |
| `capabilities` | 左右交替的能力叙事 + 专用视觉面板 |
| `principles` | 编号的产品原则 |
| `cards` | 通用卡片集合：功能、场景、入口 |
| `logo-wall` | 工具与伙伴，网格或纯 CSS 跑马灯 |
| `gallery` | 截图墙 |
| `testimonials` | 引语与署名 |
| `contributors` | 人、角色、头像与链接 |
| `faq` | 折叠或平铺的问答 |
| `markdown` | 一段自由 Markdown |
| `cta` | 结尾的行动号召 |
| `pricing` | 价格档位卡片 |
| `pricing-compare` | 档位功能对比矩阵 |
| `command-box` | 一条可复制的命令 |
| `steps` | 有序流程，可带命令 |
| `timeline` | 带日期的里程碑 |
| `code-plate` | 展示面板里的代码 |
| `preview` | 一段 Markdown 源码与它渲染出来的样子并排 |
| `case-study` | 案例：指标 + 引语 + 出处 |
| `download` | 一个或多个 `data/download/` 记录 |
| `bar-chart` | 不用图表 JS 的数值对比 |

写错类型名不会静默消失：构建时给一条 `unknown section type` 警告并跳过该分区。CI 里加上 `--panicOnWarning` 即变成构建失败。

## 常用分区的最小写法 {#section-examples}

卡片与能力面板是最常用的两种。`cards` 用 `columns` 控制列数：

```yaml {title="data/home/zh.yaml"}
cards:
  title: 应用场景
  columns: 4
  link_label: 了解详情
  items:
    - title: 书籍出版
      meta: 长篇
      icon: fa-solid fa-book-open
      desc: 编号图表式例、交叉引用、索引与整本打印。
      url: docs/write/book/
```

`capabilities` 是一屏一条能力，右边配一块结构化的视觉面板，`visual.type` 只能是 `shell`、`components`、`code`、`image`、`card` 五种之一：

```yaml {title="data/home/zh.yaml"}
capabilities:
  eyebrow: 价值主张
  title: 工程文档所需的能力，开箱即用
  items:
    - ref: 01 / 工程文档
      title: 为工程师与文档站设计
      url: docs/start/
      motto: 从第一次构建到长期维护都没有额外阻力
      bullets:
        - '开箱即用的[部署上线](docs/admin/deploy/)体验'
        - '自带[全文检索](docs/customize/search/)与[多语言](docs/customize/i18n/)'
      value: 内容团队把时间用在文档上，而不是重复搭站点。
      visual:
        type: code
        title: build.sh
        lines:
          - { class: c, prefix: '# ', text: 一条命令，一份确定性输出 }
          - { class: p, prefix: '$ ', text: hugo --gc --minify }
          - { class: ok, prefix: '✓ ', text: public/ 可以部署 }
```

> [!DETAILS] 另外十种场景分区的最小 YAML
> 这些片段摘自主题仓库的可执行回归夹具
> [`tests/site/data/landing/demo/en.yaml`](https://github.com/pgsty/oink/blob/main/tests/site/data/landing/demo/en.yaml)，字段名可照抄。
>
> ```yaml
> metrics:
>   title: 事实
>   animate: true
>   items:
>     - { value: 2189, compact: true, label: Stars, source: { label: 本地 CI 数据, url: 'https://example.org/' } }
>     - { value: 32, suffix: '+', label: 语言 }
>
> command-box:
>   title: 安装
>   code: hugo mod get github.com/pgsty/oink
>   lang: bash
>   note: 复制按钮由按需加载的 Landing 运行时提供。
>
> steps:
>   title: 三步上线
>   items:
>     - { title: 克隆, desc: 复制文档站仓库。 }
>     - { title: 配置, desc: 改三处配置。, cmd: { code: hugo server } }
>     - { title: 发布, desc: 推上 GitHub Pages。 }
>
> timeline:
>   title: 项目历程
>   items:
>     - { date: '2024', title: 原型, desc: 第一批数据驱动分区。 }
>     - { date: '2026', title: 场景组件, desc: Landing 成为可复用外壳。 }
>
> code-plate:
>   title: 页面配置
>   aria_label: 示例配置
>   lang: yaml
>   code: |
>     layout: landing
>     landing: pricing
>
> preview:
>   title: 所写即所得
>   file: guide.md            # 源码面板抬头里的文件名，默认 page.md
>   source: |                 # 右侧用站点自己的渲染钩子渲染这段 Markdown
>     > [!TIP] 只用 Markdown
>     > 提示块、步骤、标签页，都是普通语法。
>
>     1. 写 Markdown
>     2. 运行 `hugo`
>     {.steps}
>
> case-study:
>   title: 迁移结果
>   stats:
>     - { value: 12, label: 可复用分区 }
>     - { value: 0, label: 远程请求 }
>   quote: “一份 YAML 取代了一个定制页面模板。”
>   source: 站点维护者
>
> pricing:
>   title: 价格
>   tiers:
>     - name: 社区版
>       price: 免费
>       period: 永久
>       desc: 完整开源能力。
>       features: [全部组件, 社区支持]
>       cta: { label: 下载, url: docs/start/ }
>     - name: 专业版
>       featured: true
>       price: ¥24K
>       period: /年
>       features: [优先响应, 发布包]
>       cta: { label: 联系我们, url: 'mailto:example@example.org' }
>
> pricing-compare:
>   title: 档位对比
>   tiers: [社区版, 专业版]
>   groups:
>     - name: 支持
>       rows:
>         - { name: 优先响应, cells: [N, Y] }
>         - { name: 年费, price_row: true, cells: [免费, ¥24K] }
>
> download:
>   title: 下载
>   keys: [prd5]
>
> bar-chart:
>   title: 构建耗时
>   unit: 秒
>   items:
>     - { label: 首次构建, value: 12.3, group: cold }
>     - { label: 热缓存, value: 1.6, group: warm, note: 同一台机器上的重复构建。 }
> ```

`download` 分区消费的就是[发布与下载页](/zh/docs/write/releases/)里那份 `data/download/<key>.yaml`，不引入第二套版本模型。

## 任意页面做落地页 {#landing-page}

普通内容页加两行 front matter 即成为落地页：全宽画布，保留顶栏、命令面板与页脚，去掉侧栏与目录。

```yaml {title="content/pricing.zh.md"}
---
title: 价格
layout: landing
landing: pricing
---
```

数据放在与首页平行的目录下，同样按语言分文件：

```filetree {title="落地页数据"}
- data/
  - landing/
    - pricing/
      - en.yaml
      - zh.yaml
```

非首页落地页按这个顺序查找数据，找不到则构建失败，不会渲染空页面：

1. 页面 front matter 里的 `sections`；
2. `data/landing/<key>/<精确语言>.yaml`；
3. 单文件 `data/landing/<key>.yaml` 里的精确语言条目；
4. 英文或无语言后缀的记录。

数据量小时可以写在 front matter 里，但 `landing:` 与 `sections:` **互斥**：

```yaml {title="content/pricing.zh.md"}
---
title: 价格
layout: landing
sections:
  - type: hero
    data:
      title: 只用 Hugo 发布产品页面
      actions:
        - { label: 阅读文档, url: docs/, style: primary }
  - type: download
    data: { title: 下载, keys: [prd5] }
  - cta
---
```

## 分区条目写法 {#entry}
`sections` 的每一项可以是一个类型名字符串，也可以是一个 Map：

| 键 | 作用 |
| --- | --- |
| `type` | 分区类型；省略时用 `key` 当类型 |
| `key` | 从哪个键取数据，默认与 `type` 同名；同一种分区用两次时用它区分 |
| `data` | 内联数据，不再到顶层查找键 |
| `id` | 分区的锚点 ID，默认由 `key` / `type` 生成 |
| `enabled: false` | 停用这个分区，保留数据 |
| `partial` | 换成站点自己的 partial。属于本地模板约定，不是可移植的 Landing 数据 |

## 多语言与本地事实 {#i18n}

叙事文字优先分语言文件（`zh.yaml` / `en.yaml`）。共享的事实记录也可以在字段级回退：`<字段>_<精确语言>` → `<字段>_<主语言>` → `<字段>`，语言标签里的 `-` 规范化成 `_`。中文站解析 `title_zh_cn`、`title_zh`、`title`。不接受 camelCase 后缀。

分区里的显示文字是站点数据，不是主题的 i18n 字符串。只有跑马灯暂停、定价状态这类主题自带控件用翻译键。多语言站点的整体配置见[多语言](/zh/docs/customize/i18n/)。

落地页外壳上的几个可选事实也是本地的，写在 `hugo.yml` 里，运行时不会去取它们：

```yaml {title="hugo.yml"}
params:
  offline_search: true
  ui:
    landing_search: true          # 布尔；只有站点开了 offline_search 才显示命令面板
    github_stars: 2189            # 已提交的数字，不请求 GitHub API
    alt_site: { label: English site, url: 'https://example.com/' }
```

页脚不属于首页数据：它读 `data/footer/<语言>.yaml`（单语言站点用 `data/footer.yaml`），本站两种语言各一份。`data/home/<语言>.yaml` 里残留的 `footer` 键会让构建失败并提示新位置。写法见[导航与菜单](/zh/docs/customize/navigation/)。

## 输出形态 {#outputs}

| 输出 | 呈现 |
| --- | --- |
| HTML | 完整的静态分区内容，再按需加载 `landing.js` 做渐显、计数、复制与主题图片切换 |
| 打印 | 内容保留，跑马灯之类的动态面变成静态网格，控件移除 |
| Markdown | 标题、正文、列表、表格与代码，不带组件 class |
| RSS | 不输出 Landing 分区 |

禁用 JavaScript 后服务端文档仍然完整。跑马灯的副本轨道不进无障碍树，暂停用的是不依赖 JavaScript 的复选框；读者开启减少动态效果偏好时，移动与渐显关闭。

## 验证 {#verify}

1. 构建零告警：`hugo --printPathWarnings --panicOnWarning`。类型写错、数据键不存在、`landing` 与 `sections` 同时出现都在这一步暴露。
2. 打开首页与落地页，逐个分区对照数据文件，每种语言各看一遍。
3. 禁用 JavaScript 后刷新：内容仍在，只是没有动效。
4. 深浅色各看一遍，确认 `image.light` / `image.dark` 都给对。
5. 部署到子路径时，确认站内链接与图片都带上了前缀。

## 相关 {#related}

- [品牌外观](/zh/docs/customize/brand/) — 站名、Logo、配色与字体
- [导航与菜单](/zh/docs/customize/navigation/) — 顶栏、页脚与语言菜单
- [发布与下载页](/zh/docs/write/releases/) — `download` 分区的数据来源
- [多语言](/zh/docs/customize/i18n/) — 语言启用与数据分文件
- [配置总览](/zh/docs/customize/config/) — `params.ui.landing_search` 等参数的完整定义
