---
title: 首页与落地页
linkTitle: 首页与落地页
description: 用 YAML 数据文件里的分区列表搭出首页，或任意产品页、定价页，不必写模板。
weight: 30
search_keywords: [首页, 落地页, landing, home, Hero, 分区, sections, data/home, data/landing, 产品页]
aliases:
  - /docs/scenarios/landing/
---

OINK 的首页是数据，不是模板。`data/home/<语言>.yaml` 从上到下列出页面上的分区（首屏 Hero、卡片网格、定价、结尾的行动号召等），每个分区的内容也写在这份文件里。改首页就是改 YAML，用不着碰 HTML。其它页面也能用同一套分区做成[落地页](#landing-page)。

## 修改 Starter 的首页 {#minimal}

[OINK Starter](/zh/docs/start/) 自带一个三段式首页，数据在 `data/home/zh.yaml`。把文字和链接换成自己的，浏览器会自动刷新出结果：

```yaml {title="data/home/zh.yaml"}
sections: [hero, cards, cta]

hero:
  align: center
  eyebrow: 开源时序数据库
  title_lines:
    - words: [{ text: Acme DB。 }]
    - words: [{ text: 多年指标，查询依然飞快。 }]
  lead: 安装、导入数据、跑通第一条查询，十分钟就够。
  actions:
    - { label: 安装, url: docs/install/, icon: fa-solid fa-download, style: primary }
    - { label: 阅读文档, url: docs/, style: ghost }

cards:
  eyebrow: 从这里开始
  title: 每样东西都有位置
  columns: 3
  items:
    - title: 安装
      desc: Linux 与 macOS 安装包、容器镜像和 Helm chart。
      icon: fa-solid fa-download
      url: docs/install/
    - title: 查询语言
      desc: 每个函数与运算符，各附一个示例。
      icon: fa-solid fa-terminal
      url: docs/reference/
    - title: 发布说明
      desc: 每个版本改了什么，以及如何升级。
      icon: fa-solid fa-tag
      url: blog/

cta:
  title: 今天就跑通第一条查询。
  text: 在笔记本上走完快速上手只要十分钟。
  label: 开始使用
  url: docs/install/
  style: primary
```

站内链接写成不带前导斜杠的站点路径，例如 `docs/install/`。主题会补上语言前缀，所以同一个链接在中文首页上指向 `/zh/docs/install/`。要加一个分区，把它的名字追加到 `sections`，再写一个同名的键；要调整顺序，就调整这个列表。可用的分区见[分区类型](#registry)。

## 数据放在哪里 {#home-data}

首页的内容文件只保留标题与描述：

```yaml {title="content/_index.zh.md"}
---
title: Acme DB
description: 开源时序数据库
---
```

分区数据按语言分文件：

```filetree {title="首页数据"}
- data/
  - home/
    - en.yaml            # 英文首页
    - zh.yaml            # 中文首页
```

主题为每种语言读取 `data/home/<语言>.yaml`，找不到时回退到 `data/home/en.yaml`；单语言站点也可以直接用 `data/home.yaml`。

每份文件只有两层：`sections` 列表，以及列表点名的那些键。分区默认读取与类型同名的键；给它写一个 `key` 就能改读别的键，同一页放两组卡片网格就是这么做的：

```yaml {title="data/home/zh.yaml"}
sections:
  - hero          # 读 hero:
  - cards         # 读 cards:
  - type: cards   # 第二组卡片网格，读 release:
    key: release
  - cta

hero: { … }
cards: { … }
release: { … }
cta: { … }
```

### 分区条目 {#entry}

`sections` 的每一项可以是一个类型名，也可以是一个 map：

| 键 | 作用 |
| --- | --- |
| `type` | 分区类型；省略时把 `key` 当作类型 |
| `key` | 数据所在的顶层键，默认与类型同名；同一类型出现两次时用它区分 |
| `data` | 直接内联分区数据，不再到顶层键里找 |
| `id` | 分区的锚点 ID，默认由 `key` 或 `type` 生成 |
| `enabled: false` | 隐藏这个分区，保留数据 |
| `partial` | 用站点自己的某个 partial 渲染这份数据。数据因此绑定到你的模板，不能再搬到别的站点使用 |

类型名用连字符（`logo-wall`），写成下划线也会被规范化。类型名拼错时，构建给出 `unknown section type` 告警并跳过该分区。用 Docsy `blocks/*` 短代码搭的首页，需要按这种方式重建，见[从 Docsy 迁移](/zh/docs/admin/upgrade/#from-docsy)。

## Hero {#hero}

Hero 是首屏，也是唯一带大标题和配图的分区：

```yaml {title="data/home/zh.yaml"}
hero:
  eyebrow: Acme DB 3.0 · 开源               # 标题上方的小字，带状态点
  title_lines:                              # 大标题，一项一行
    - words:
        - { text: Acme DB }
  lead: 用一句话说清这是什么。               # 支持行内 Markdown 与 <br>
  note: 单个二进制文件即可运行               # 带图标的补充行
  note_icon: fa-solid fa-circle-check
  title_size: 4.25rem                       # 只接受 rem、em 或 px
  image:
    light: images/hero-light.webp
    dark: images/hero-dark.webp             # 只给一张时，深浅色共用
    alt: 查询延迟仪表盘
  media:
    ratio: '1fr 240px'                      # 文案与配图的列宽
    max_width: 240px
    hide_below: md                          # 在 sm | md | lg | xl 以下隐藏配图
  actions:
    - { label: 开始使用, url: docs/install/, icon: fa-solid fa-rocket, style: primary }
    - { label: GitHub, url: 'https://github.com/example/acme-db', external: true, style: ghost }
  detail: { label: 看看在线演示, url: docs/demo/ }
```

图片路径指向站点 `static/` 或 `assets/` 下的文件，上例对应 `static/images/hero-light.webp` 与 `static/images/hero-dark.webp`。配图是 CSS 背景图：有 `alt` 时，容器会以该文字作为图片向辅助技术朗读；没有 `alt` 时，对辅助技术隐藏。不写 `title_lines` 时显示 `title`，两者都没有时显示站点标题。

`align: center` 是纯文字的居中首屏，Starter 用的就是它：文案块加宽并居中，标题各行自动平衡，`note` 移到按钮下方。居中首屏放不下配图，两者同时出现时，主题告警并改用 `start` 对齐，保留配图。

## 分区类型 {#registry}

共有 22 种分区。除 `hero` 外，每种都接受相同的标题字段 `eyebrow`、`title` 与 `desc`（或 `text`），以及一个供站点 CSS 使用的 `class`。

| 类型 | 放什么 |
| --- | --- |
| `hero` | 首屏：大标题、按钮、随深浅色切换的配图 |
| `metrics` | 数字事实，可选计数动画与来源链接 |
| `capabilities` | 每行一项能力、左右交替排列，各配一块视觉面板 |
| `principles` | 带编号的产品原则 |
| `cards` | 通用卡片网格：功能、场景、入口 |
| `logo-wall` | 工具与合作伙伴，网格或纯 CSS 跑马灯 |
| `gallery` | 截图墙 |
| `testimonials` | 引语与署名 |
| `contributors` | 人物、角色、头像与链接 |
| `faq` | 问答，可折叠或平铺 |
| `markdown` | 一段自由 Markdown |
| `cta` | 结尾的行动号召 |
| `pricing` | 价格档位卡片 |
| `pricing-compare` | 档位与功能的对比矩阵 |
| `command-box` | 一条可复制的命令 |
| `steps` | 有序步骤，可附命令 |
| `timeline` | 带日期的里程碑 |
| `code-plate` | 展示面板里的代码 |
| `preview` | Markdown 源码与渲染结果并排 |
| `case-study` | 案例：指标、引语与出处 |
| `download` | 一条或多条 `data/download/` 记录 |
| `bar-chart` | 不用图表 JavaScript 绘制的数值对比 |

## 常用分区 {#section-examples}

`cards` 用 `columns` 指定列数：

```yaml {title="data/home/zh.yaml"}
cards:
  title: 应用场景
  columns: 4
  link_label: 了解详情
  items:
    - title: 监控
      meta: 指标
      icon: fa-solid fa-chart-line
      desc: 一整年的秒级指标，查询仍在毫秒级完成。
      url: docs/use-cases/monitoring/
```

`capabilities` 让每项能力独占一行，旁边配一块视觉面板。`visual.type` 取 `shell`、`components`、`code`、`image`、`card` 之一：

```yaml {title="data/home/zh.yaml"}
capabilities:
  eyebrow: 为什么选 Acme DB
  title: 为只增不减的数据而生
  items:
    - ref: 01 / 运维
      title: 一个二进制文件，不用照看集群
      url: docs/install/
      motto: 从第一次安装到第一百次升级
      bullets:
        - '不停机的滚动[升级](docs/upgrade/)'
        - '内置[备份](docs/backup/)与时间点恢复'
      value: 团队把时间花在查询上，而不是数据库上。
      visual:
        type: code
        title: install.sh
        lines:
          - { class: c, prefix: '# ', text: 一条命令，一个运行中的服务 }
          - { class: p, prefix: '$ ', text: acme-db start --data ./data }
          - { class: ok, prefix: '✓ ', text: 正在监听 :5433 }
```

> [!DETAILS] 另外十一种分区的最小 YAML
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

`download` 分区读取的就是[发布与下载页](/zh/docs/write/releases/)用的那份 `data/download/<key>.yaml` 记录，版本号只需写一次。

## 落地页 {#landing-page}

定价页、产品概览、活动页都可以用首页那套分区来搭。普通页面加两行 front matter，就成为全宽的落地页：保留顶栏、命令面板与页脚，去掉侧栏和目录。

```yaml {title="content/pricing.zh.md"}
---
title: 价格
layout: landing
landing: pricing
---
```

`landing: pricing` 指定数据，数据放在首页数据旁边，同样按语言分文件：

```filetree {title="落地页数据"}
- data/
  - landing/
    - pricing/
      - en.yaml
      - zh.yaml
```

也可以只用一个 `data/landing/pricing.yaml`：顶层直接写 `sections` 时所有语言共用；按语言代码各写一个 map 时，效果与目录形式相同。对语言标签为 `zh-cn` 的页面，主题依次尝试 `zh-cn`、`zh`、`en`。都找不到时，页面告警并渲染一个没有分区的落地页外壳。

只有一两个分区的页面，也可以直接写在 front matter 里，每个分区内联自己的数据。`landing:` 与 `sections:` 只能二选一；两者都写时，主题告警并使用内联的分区。

```yaml {title="content/pricing.zh.md"}
---
title: 价格
layout: landing
sections:
  - type: hero
    data:
      title: Acme DB Cloud，按节点计费
      actions:
        - { label: 阅读文档, url: docs/, style: primary }
  - type: cta
    data:
      title: 准备开始了吗？
      label: 阅读文档
      url: docs/
---
```

站点开启[本地搜索](/zh/docs/customize/search/)后，落地页也有搜索按钮与命令面板。要在首页以外的落地页上去掉搜索，设置 `params.ui.landing_search: false`。

## 多语言与本地事实 {#i18n}

每种语言的文字写在各自的文件里（`en.yaml`、`zh.yaml`）。以共享事实为主的记录（例如一个价格档位）也可以改用按语言区分的字段：主题依次读取 `<字段>_<语言>`、`<字段>_<主语言>`、`<字段>`，语言标签里的 `-` 写成 `_`。因此 `zh-cn` 页面依次读取 `title_zh_cn`、`title_zh`、`title`。不识别 camelCase 后缀。

分区里的文字属于站点数据，不经过主题的界面文案；只有跑马灯的暂停按钮、定价状态这类主题自带的控件由主题翻译。多语言站点的其余设置见[多语言](/zh/docs/customize/i18n/)。

分区不会在浏览器里获取任何数据：价格、star 数、截图、头像、下载状态都必须在 Hugo 运行时已经存在于仓库中。`hugo.yml` 里可以设置的两项顶栏信息也是如此：

```yaml {title="hugo.yml"}
params:
  ui:
    github_stars: 2189            # 显示在 GitHub 链接上，从不向 GitHub 请求
    alt_site: { label: English site, url: 'https://example.com/' }  # 单语言站点上的姊妹站链接
```

页脚有自己的数据：`data/footer/<语言>.yaml`，单语言站点用 `data/footer.yaml`，见[导航与菜单](/zh/docs/customize/navigation/#footer)。`data/home/<语言>.yaml` 里残留的 `footer` 键会被忽略，告警会指出新的位置。

## 输出形态 {#outputs}

| 输出 | 呈现 |
| --- | --- |
| HTML | 全部分区在服务端渲染，另外按需加载 `landing.js`，负责渐显、计数、复制按钮与深浅色配图切换 |
| 打印 | 保留内容，跑马灯等动态部分改为静态网格，控件移除 |
| Markdown | 标题、正文、列表、表格与代码，不带组件 class |
| RSS | 不输出落地页分区 |

没有 JavaScript，或者 `landing.js` 加载失败时，所有分区依然可见：数字指标直接显示格式化后的最终值与前后缀，跑马灯的暂停控件不依赖脚本。读者开启“减少动态效果”时，移动与渐显效果全部关闭。

## 验证 {#verify}

1. 运行 `hugo --printPathWarnings`。类型拼错、数据键不存在、同一页同时写了 `landing` 与 `sections`，都会在这里报出。
2. 在每种语言下打开首页与各个落地页，逐个分区对照数据文件。
3. 禁用 JavaScript 后刷新：内容仍在，只是没有动效。
4. 切换深浅色，确认 `image.light` 与 `image.dark` 各自出现在正确的模式下。
5. 部署在子路径下的站点，确认站内链接与图片都带上了前缀。

## 相关 {#related}

- [品牌外观](/zh/docs/customize/brand/) — 站名、Logo、配色与字体
- [导航与菜单](/zh/docs/customize/navigation/) — 顶栏、页脚与语言菜单
- [发布与下载页](/zh/docs/write/releases/) — `download` 分区的数据来源
- [多语言](/zh/docs/customize/i18n/) — 启用语言与按语言拆分数据
- [配置总览](/zh/docs/customize/config/) — `params.ui.landing_search`、`github_stars`、`alt_site` 等参数
