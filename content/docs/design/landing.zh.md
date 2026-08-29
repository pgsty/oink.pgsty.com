---
title: 落地页契约
linkTitle: 落地页
description: 落地页数据、内置区块注册表、语言解析、运行时、无障碍与输出的维护者契约。
weight: 40
icon: fa-solid fa-panorama
search_keywords: [OINK 落地页契约, 落地页区块, 首页数据, 渐进增强, 落地页输出]
contract_status: released-v0.8.1
---

> [!IMPORTANT] OINK 0.8.1 契约
> 这是随 OINK 0.8.1 正式发布的落地页契约。本页是权威中文源文件，与英文版本
> 一同维护在 `content/docs/design/`。

共享规则见[架构契约](/zh/docs/design/architecture/)与
[组件契约](/zh/docs/design/components/)；迁移行为属于
[迁移边界](/zh/docs/design/migration/)。

## 外壳与数据 {#shell-and-data}

任何普通页面都可以声明 `layout: landing`。它渲染顶部导航栏、全宽画布与页脚，
不显示 docs 侧栏或 TOC 导轨。首页继续把 `data/home/<lang>.yaml` 作为兼容的创作
路径，并通过同一个渲染器处理。

非首页依次从内联 front matter、`data/landing/<key>/<lang>.yaml`、单个
`data/landing/<key>.yaml` 中精确匹配语言的条目，以及英文或无后缀本地数据中
解析 `sections`。落地页绝不抓取可变事实；星标数、价格、截图与头像必须在 Hugo
运行前提交或生成。

`params.ui.landing_search` 默认为 true，而且只有启用 `offline_search` 时才打开
既有本地命令面板。`params.ui.github_stars` 与 `params.ui.alt_site` 是可选的本地
界面事实。

## 区块注册表 {#section-registry}

注册表恰好有 22 种内置区块：

- `hero`、`metrics`、`capabilities`、`principles`、`cards`、`logo-wall`、
  `gallery`、`testimonials`、`contributors`、`faq`、`markdown`、`cta`；
- `pricing`、`pricing-compare`、`command-box`、`steps`、`timeline`、
  `code-plate`、`preview`、`case-study`、`download`、`bar-chart`。

条目可以是类型字符串，也可以是包含 `type`、`key`、`id`、`enabled`、内联
`data` 或有意指定的本地 `partial` 的 map。作者提供唯一 ID，OINK 把它规范为
锚点安全值。未知类型遵循共享的警告与安全回退策略，绝不静默消失；发布时
`--panicOnWarning` 会拒绝它。内置区块由 `landing/` partial 负责；已经移除的
`home/` partial 名称不是 API。

`preview` 通过站点渲染钩子，把 Markdown `source` 放在 `RenderString` 输出旁，
因此其内容会登记与 docs 内容相同的运行时。源码面板使用 Chroma，并带默认值为
`page.md` 的 `file` 名称。Markdown 输出使用四个反引号包围的 `markdown` 围栏；
RSS 省略它。面板标签来自主题 i18n。

`hero.align` 可取 `start` 或 `center`。Center 只适用于文本；与图片组合时会警告，
并回退到 `start`，同时保留图片。`download` 消费与 shortcode 相同的
`data/download/<key>.yaml` 结构，不引入第二套 channel、版本、发布或插值模型。

## 语言、运行时与无障碍 {#language-runtime-and-accessibility}

叙述文件可以按语言拆分。共享事实字段依次解析 `<field>_<exact language>`——其中
`-` 规范为 `_`——再解析 `<field>_<primary language>`，最后解析无后缀字段。
不接受 camelCase 别名。叙述字段通过站点渲染钩子渲染行内或区块 Markdown；复用
为无障碍名称的值会转为纯文本。区块文案属于站点数据；只有主题控件使用 OINK
i18n。

交互式 HTML 设置 `hasLanding`，从而只按需添加 `landing.js`。运行时复用
`OinkSurfaceCoordinator`，负责出现动画、数字递增、复制、紧凑菜单与主题图片
增强。没有 JavaScript 时，服务端输出仍然完整。

跑马灯只用 CSS 复制；副本带 `aria-hidden` 与 `inert`，本地化复选框无需
JavaScript 也能持久保存暂停状态。减少动画会停用动画，强制颜色保留控件，主题
图片响应共享主题事件。顶部导航栏的 mega 面板与其 `columns` 参数已退役：仍然配置 `columns` 的菜单会告警并保持单列。紧凑菜单使用真实链接
与按钮，不捕获焦点，也不复制桌面导航树。

## 输出与兼容性 {#outputs-and-compatibility}

| 输出 | 契约 |
| --- | --- |
| HTML | 完整静态区块加渐进增强 |
| Print | 静态网格与内容，移除控件 |
| Markdown | 不带主题 class 的标题、正文、列表、表格与代码 |
| RSS | 省略落地页区块 |

非 HTML 输出不设置 Landing 标志或运行时。根相对链接与资源遵循部署子路径；普通
构建不下载图片。

已经移除的 0.4 组件形态属于迁移工具，不是并行的落地页实现。OINK 不增加价格
周期切换、远程事实 API、热点编辑器、可视化构建器或第二套注册表。既有首页数据
与显式自定义区块 partial 继续有效。
