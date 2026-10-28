---
title: OINK 迁移边界
linkTitle: 迁移边界
description: OINK 迁移所支持的源码、配置与验证边界，包含 1.4.0 升级。
weight: 50
icon: fa-solid fa-code-compare
search_keywords: [OINK 迁移契约, 0.4 迁移, 0.5 迁移, 配置重命名, 迁移工具]
contract_status: v1.4.0
---

> [!NOTE] OINK 1.4.0 契约
> 本契约描述 OINK v1.4.0。

本页定义维护者迁移工具与配置边界；面向读者的升级步骤见
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

代码围栏的内容不会改写，包括与有序或无序列表标记处于同一行、可带引用前缀的围栏。
代码示例里额外的字面引用前缀不会结束该围栏。
`book_figures.py` 保留范围明确的 TPME、DDIA v1/v2 与
pg-internal profile；它不是通用解析器。

隔离验证工具 `bin/measure-baseline.py` 和 `bin/sites/build-all.py` 会在清理已有
输出前，拒绝与任一输入站点、运行工具的 checkout、选中的主题 checkout 或其他
快照交叠的快照目录，包括通过符号链接别名指向这些位置的 `--keep` 目标，以及
通过 `--theme` 选择其他主题 checkout 的情况。

## 更新消费站点仓库 {#updating-consumers}

主题发布后，应清点维护中的消费站点 checkout，并升级它们固定的版本。
主题的 `bin/update-consumers.py` 扫描指定根目录下的直属项目及其 `site/` 目录，
不递归进入归档、生成站点、缓存或主题测试夹具。

此工具随 OINK 1.2.0 发布。在主题 checkout 中执行，先清点，再升级到正式标签。

```sh
python3 bin/update-consumers.py v1.4.0 --roots ~/www ~/pgsty
python3 bin/update-consumers.py v1.4.0 --roots ~/www ~/pgsty --write --check --check-appearance
```

第一条命令只报告版本采用情况。第二条更新 `go.mod` 和 `go.sum` 中的 OINK
条目，核对精确的模块解析图，并对每个选中站点运行保留告警的生产构建。
执行时禁用 `GOWORK`、Hugo 模块 workspace 和环境变量中的模块替换。日志与
原始模块文件保存在临时报告目录，也可通过 `--report-dir` 指定目录。
更新失败会恢复模块文件；构建失败则保留新版本以便排查，并返回失败状态。
扫描根目录无法读取或消费站模块格式错误时，会记录失败条目，继续清点其余站点，
并以非零状态退出。显式选择的目录不存在或不是 OINK 消费站时，也会明确报告失败。

工具跳过链接 worktree、隐藏副本和非默认分支。应检查所有跳过与阻塞条目：
显式项目根本身没有 Hugo 配置且不是 OINK 消费站时，会解析到包含 Hugo 站点的
`site/` 子目录。普通 Go 应用在根目录的 `go.mod` 不阻止此解析；真正的根目录消费站优先。
通过 `--sites <path>...` 显式选择已核对的站点，包括已有模块改动的 checkout 和没有
Git 的源目录。自动扫描会跳过无 Git 目录，显式选中后执行同样的文件备份与构建检查。
工具也会列出传统 `themes/oink` 消费站供独立维护：将干净的 Git 子模块切到已发布 tag，
或备份后替换已核对的上游源码副本；保留离线构建与站点层覆盖，再执行站点自身检查。
模块更新工具不会改写传统主题目录。
`go.mod` 中的 OINK 替换需要手工处理。vendor 主题需先独立核对，再使用
`--refresh-vendor` 备份并重新生成 `_vendor/`；只改模块版本不会更新 vendor
中的主题。是否实际使用 vendor 输出以 Hugo 解析的模块图为准；通过 `ignoreVendorPaths`
绕过的历史快照会保留，不会阻塞已发布模块的升级。

要开启四种风格，并以 Paper 为站点默认值，在站点配置中显式设置：

```yaml
params:
  ui:
    preset: paper
    preset_menu: [paper, slate, ink, terminal]
```

`preset_menu: true` 只提供稳定风格与站点默认值；显式列表还会开启 Ink 与 Terminal。
这些设置会在后续版本升级时保留。自定义外壳的站点需单独检查：绕过 OINK 外壳的模板
不会仅因配置更新就获得外观控件。

维护者 checkout 还支持将 `--check-appearance` 与 `--check` 一起使用，检查新构建的
首页及各语言入口是否以 Paper 为默认值并渲染四种风格控件。禁用首页的站点改查文档
入口，跳过重定向别名。浏览器交互和各站点自身的检查仍需独立执行。

保留无关改动，同步站点 README 和配置中的当前主题版本说明，并运行站点自身的
检查与视觉验收。该工具只更新模块固定版本并执行构建检查，不修改正文或自动提交。

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
| `ui.scrollSpy` | 无行为替代；`ui.scroll_spy` 仅作为 1.x 静默兼容 no-op 保留 |
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

已移除名称会警告，并采用文档规定的安全回退或不渲染；构建和预览可以继续。`blog_index_toggle`、
`featured_image: hero`、`toc_style` 与 `toc_taxonomies` 是增量选择启用项，不会
引入内容类型；沉浸式阅读仍使用普通博客外壳。

## 前置条件与验证 {#prerequisites-and-validation}

按照[组件契约](/zh/docs/design/components/)启用 Goldmark unsafe 渲染、块属性与
独立块图片。要使用 `\(...\)`、`\[...\]` 或 `$$...$$`，需要显式启用 passthrough；
Hugo 不会合并主题的 markup 配置。

针对改动的契约，使用固定的 Hugo Extended 0.168.0 工具链运行范围最小的源码与输出
检查；运行时变化时执行 JavaScript 测试，并生产构建根路径与子路径。对于维护范围
内的站点，在桌面与窄视口检查有代表性的 EN/ZH Docs 与 Blog 路由。
