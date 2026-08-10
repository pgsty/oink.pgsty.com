# OINK 中文文档翻译规范

本文件是 `oink.pgsty.com`
中英双语改造的术语、排版与验收基线。英文原文与中文译文并置在 `content/`
下，中文文件使用 `.zh.md` 后缀。

## 范围基线

2026-08-08 初次盘点结果：

| 内容树          | 英文源文件 | 英文词数 |
| --------------- | ---------: | -------: |
| `content/docs/` |         41 |   43,052 |
| `content/blog/` |         15 |   19,522 |
| 合计            |         56 |   62,574 |

两棵内容树在初次盘点时共有 503 个 Markdown 标题。除此之外，中文首页、OINK 专属文档、发布注记、开发日志，以及
`about/`、`examples/`、`community/` 三个一级内容入口也属于交付范围。

当前交付包含 70 组中英文页面，校准了 644 个英文源标题。覆盖检查逐一核对
`docs/`、`blog/`、`about/`、`examples/` 与
`community/`。以下命令同时检查文件覆盖率、显式锚点、中英文渲染 ID 和站内链接：

```bash
npm run wt -- build -- --destination /tmp/oink-docsy-review --baseURL http://localhost
node scripts/check-markdown-style.mjs
node scripts/check-doc-translations.mjs --public /tmp/oink-docsy-review
node scripts/check-rendered-markdown.mjs /tmp/oink-docsy-review
node scripts/check-rendered-links.mjs /tmp/oink-docsy-review
```

## 文件与元数据

- `page.md` 的译文命名为 `page.zh.md`；`index.md`、`_index.md` 同理。
- 保留日期、作者、权重、别名、资源引用和功能参数的语义；翻译标题、摘要、描述、标签及面向读者的字符串。
- 不翻译命令、代码、配置键、文件名、URL、版本号、HTML 属性和 shortcode 名称。
- 英文是第一语言，简体中文 `zh` 是第二语言。
- 中文页面不得以英文原文作为缺失译文的静默回退；覆盖检查必须保证
  `docs/`、`blog/`、`about/`、`examples/` 与 `community/` 一一配对。

## 稳定锚点

中文标题统一显式写入英文页面实际渲染出的标题 ID：

```markdown
## 开始使用 {#getting-started}
```

- 以英文基线站点生成的 HTML 为准，不凭标题文本猜测 ID。
- 英文标题已有显式稳定 ID 时原样保留。
- shortcode、徽章和内联 HTML 参与标题时，仍以渲染结果为准。
- 中英文对应页面的标题数量、顺序和 ID 必须一致；确有中文增补时使用独立、稳定且不冲突的 ID。
- 站内链接沿用这些稳定 ID，使 `/docs/page/#anchor` 与 `/zh/docs/page/#anchor`
  指向相同语义位置。

## 核心术语

| 英文                    | 统一中文                   | 说明                                  |
| ----------------------- | -------------------------- | ------------------------------------- |
| OINK                    | OINK                       | 当前项目工作名称，不翻译              |
| Docsy                   | Docsy                      | 上游项目名，不翻译                    |
| Hugo Extended           | Hugo Extended              | 产品名，不翻译                        |
| theme                   | 主题                       | 指 Hugo 主题                          |
| static site generator   | 静态站点生成器             | 首次出现可保留英文缩写                |
| front matter            | front matter（前置元数据） | 首次双写，后文可直接使用 front matter |
| shortcode               | 短代码                     | 代码中的 shortcode 名称不翻译         |
| partial                 | partial（局部模板）        | 文件与 API 名称保留 `partial`         |
| render hook             | 渲染钩子                   | 指 Hugo Markdown render hook          |
| page bundle             | 页面包                     | Hugo 内容模型术语                     |
| section                 | 分区                       | 指内容树中的 section                  |
| taxonomy                | 分类法                     | `tags`、`categories` 等术语           |
| module                  | 模块                       | Hugo Module 写作 Hugo 模块            |
| mount                   | 挂载                       | 名词按语境写“挂载项”                  |
| template                | 模板                       | 不写“模版”                            |
| local-first             | 本地优先                   | OINK 核心产品原则                     |
| Hugo-only               | 仅依赖 Hugo                | 必要时写作“仅依赖 Hugo 的构建”        |
| air gap / air-gapped    | 隔离网络 / 网络隔离环境    | 不使用含混的“离线”替代安全语义        |
| vendored dependency     | 随主题内置的依赖           | 维护语境可写 vendor 依赖              |
| fallback                | 回退                       | 多语言内容语境可写“缺失译文回退”      |
| canonical URL           | 规范 URL                   | 保留 HTML `canonical` 名称            |
| permalink               | 永久链接                   | Hugo 配置键 `permalinks` 不翻译       |
| table of contents / TOC | 目录 / TOC                 | 首次写“目录（TOC）”                   |
| navbar                  | 顶部导航栏                 | 模板或 CSS 名称保留 `navbar`          |
| sidebar                 | 侧栏                       | 不写“边栏”                            |
| breadcrumb              | 面包屑导航                 |                                       |
| code block              | 代码块                     |                                       |
| syntax highlighting     | 语法高亮                   |                                       |
| deployment              | 部署                       | 与“发布”区分                          |
| release                 | 版本发布                   | 作定语时可写“发布”                    |
| build artifact          | 构建产物                   |                                       |
| breaking change         | 破坏性变更                 |                                       |
| deprecation             | 弃用                       | deprecated 译为“已弃用”               |
| accessibility           | 无障碍                     | 不写“可访问性”，URL access 除外       |
| local search            | 本地搜索                   |                                       |
| content component       | 内容组件                   |                                       |

## 中文排版

- 中文与英文单词、阿拉伯数字之间留一个半角空格；中文标点前后不加空格。
- 正文使用全角中文标点；代码、命令、URL、版本和原样引用保持半角。
- 强调标记与前后普通文字之间各留一个半角空格；紧邻中文标点时不加空格。Prettier可能把
  `*强调*` 规范化为 `_强调_`，两种形式都必须保留清晰的外部边界，不要写作
  `正文_强调_正文`。加粗标签后紧接正文时，把中文标点放在标记之外，例如写作
  `**适用条件**：正文`，不要写作可能无法闭合的 `**适用条件：**正文`。
- 技术名词以准确、可检索为先，不为追求“汉化”创造陌生译名。
- 一段只表达一个中心意思；拆解英文长句，避免被动句和多层从句直译。
- 列表项保持并列关系与语法一致；表格以读者扫描效率为准调整列宽和换行。
- 链接文字翻译为自然中文，但引用式链接标签和目标必须保持可解析。
- 图片替代文字、按钮、提示、报错说明等可见文本必须翻译。

## 三审三校

1. 初审：逐段核对信息完整性、技术事实、条件、否定、版本和链接目标。
2. 二审：统一术语、语气、标题层级、跨页引用和 OINK/Docsy 边界。
3. 三审：以中文出版物标准润色，消除翻译腔、歧义、赘词和不自然断句。
4. 一校：检查 Markdown、front matter、shortcode、代码围栏和引用定义。
5. 二校：构建中英文站点，比对标题 ID、目录、导航、语言切换与内部链接。
6. 三校：抽查桌面端、移动端、深浅色、打印和本地搜索，确认 OINK 专属示例可用。

只有内容覆盖、构建、链接和渲染检查全部通过，才算完成本次双语交付。
