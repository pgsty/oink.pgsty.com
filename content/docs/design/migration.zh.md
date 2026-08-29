---
title: OINK 迁移边界
linkTitle: 迁移边界
description: 从 OINK 0.4 到 OINK 1.0.0 所支持的源码、配置与验证迁移边界。
weight: 50
icon: fa-solid fa-code-compare
search_keywords: [OINK 迁移契约, 0.4 迁移, 0.5 迁移, 配置重命名, 迁移工具]
contract_status: released-v1.0.0
---

> [!IMPORTANT] OINK 1.0.0 契约
> 这是随 OINK 1.0.0 正式发布的迁移契约。本页是权威中文源文件，与英文版本
> 一同维护在 `content/docs/design/`。

这是源码与配置指南，不是版本发布流水账。本地源码、提交、标签、推送、消费站点
固定版本、部署与生产一致仍是彼此独立的状态。面向读者的升级流程见
[版本升级](/zh/docs/admin/upgrade/)。

## 工具范围 {#toolkit-scope}

`bin/migrations/oink06.py` 只扫描和自动改写站点内容目录下的 Markdown 文件，
包括受支持的 YAML front matter。它不改写 Hugo 配置、数据文件、布局、资源、
模块或生成输出。TOML/JSON front matter 与有歧义的 Markdown 会连同位置一起报告，
留给人工检查。

默认执行 dry-run；完成后的迁移具有幂等性：

```sh
python3 bin/migrations/oink06.py report --sites <dir>... --md report.md --json report.json
python3 bin/migrations/oink06.py migrate --site <dir>
python3 bin/migrations/oink06.py migrate --site <dir> --write
python3 bin/migrations/oink06.py check --site <dir>
```

代码围栏不会改写。`book_figures.py` 保留范围明确的 TPME、DDIA v1/v2 与
pg-internal profile；它不是通用解析器。

## 从 0.4 内容迁移到当前形态 {#content-to-current-forms}

| 已移除形态 | 当前形态 | 工具键 |
| --- | --- | --- |
| `alert`、`details`、`pageinfo`、原始 disclosure | `> [!TYPE]` 提示块 | `callout` |
| `tabpane`、旧 `tab`、`code-group`、`code-tab` | 相邻 `{tab=}` 区块，或 `tabs` / `tab` | `tabs` |
| FileTree shortcode 或 `{.filetree}` 列表 | `filetree` 围栏 | `filetree` |
| Gallery shortcode 或 `{.gallery}` 列表 | `gallery` 围栏 | `gallery` |
| ECharts / infographic shortcode | 同名数据围栏 | `datafence` |
| Docsy 卡片家族 | `.cards` 列表或 `cards` / `card` | `cards` |
| `imgproc`、`image` | Markdown 图片加属性 | `image` |
| `readfile` | `include` | `include` |
| 围栏 `filename=` | `title=` | `fencetitle` |
| `badge outline=` | 移除 `outline` | `badge` |
| 叶子 `example`、`book-figures kind=` | `eg`、显式 `book-*` 索引 | `eg` |
| 百分号分隔的 fields | 尖括号分隔的 `fields` / `field` | `fieldsdelim` |
| Docsy `_param` 占位符与 `card header=` 高亮 | Font Awesome / `badge` / `param` 或提示块 | `param_placeholders` |
| 不支持的旧 shortcode | 报告源码位置，人工检查 | `reportonly` |

## 配置与 front matter {#configuration-and-front-matter}

以下配置改动需要手工处理；工具可以报告匹配的 front matter 键，但绝不编辑站点
配置。

| 旧配置 | 当前配置 |
| --- | --- |
| `offlineSearch*` | `offline_search*` |
| `disable_click2copy_chroma` | `ui.code_copy`，取反 |
| `content_width` | `reading_width: slim | normal | wide` |
| `github_url` | `github_repo` |
| `ui.no_left_sidebar` | `ui.sidebar_enabled`，取反 |
| breadcrumb 别名 | `ui.breadcrumb` |
| `ui.scrollSpy` | `ui.scroll_spy`，取反 |
| `ui.showLightDarkModeMenu` | `ui.dark_mode.show_menu` |
| `ui.readingtime` | `ui.reading_time` |
| `ui.ul_show` | `ui.sidebar_expand_levels` |
| `ui.docs_root` | `ui.docs_sidebar_root` |
| `ui.pager` | `ui.pager_types` |
| annotation/zoom/keyboard/reading 的 `{ enable: bool }` map | 裸布尔值 |
| `ui.typography.preset` | `ui.typography` |
| `print.disable_toc` | `print.toc`，取反 |

Prism、`rss_sections` 与 `algolia_docsearch` 已移除。Chroma 是唯一高亮器；Algolia
配置为 `search.algolia`。页面级覆盖会去掉 `ui.` 前缀。旧 `hide_feedback`、
`hide_readingtime`、`exclude_search`、`content_width`、camelCase 手工链接与嵌套
front matter `ui` map 会连同替代项一起报告。

## 从 0.5 到 0.6 {#from-05-to-06}

- 用 `upstream_link` 加 `upstream_name`、`upstream_copyright`、
  `upstream_license`、`upstream_notice` 替代 `upstream_attribution`；把
  `downstream_modified` 改名为 `upstream_modified`。
- 用一个 GitHub `release_url` 替代 `release` map；从发布索引移除
  `release_products` 与 `release_group_by_product`。
- 博客与默认日期现在采用 ISO `2006-01-02`；面向读者的日期继续显式保留
  `time_format_blog` 或 `time_format_default`。

已移除名称会警告，并采用文档规定的安全回退或不渲染；普通预览可以继续，严格
门禁通过 `--panicOnWarning` 拒绝它们。`blog_index_toggle`、
`featured_image: hero`、`toc_style` 与 `toc_taxonomies` 是增量选择启用项，不会
引入内容类型；沉浸式阅读仍使用普通博客外壳。

## 前置条件与验证 {#prerequisites-and-validation}

按照[组件契约](/zh/docs/design/components/)启用 Goldmark unsafe 渲染、块属性与
独立块图片。要使用 `\(...\)`、`\[...\]` 或 `$$...$$`，需要显式启用 passthrough；
Hugo 不会合并主题的 markup 配置。

针对改动的契约，使用固定的 Hugo Extended 0.165.0 工具链运行范围最小的源码与输出
检查；运行时变化时执行 JavaScript 测试，并严格构建根路径与子路径。对于维护范围
内的站点，在桌面与窄视口检查有代表性的 EN/ZH Docs 与 Blog 路由，再分别记录固定
版本、部署与线上一致状态。
