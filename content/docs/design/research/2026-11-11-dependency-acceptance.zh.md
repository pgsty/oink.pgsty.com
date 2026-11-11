---
title: 依赖升级验收，2026-11-11
linkTitle: 依赖升级验收
description: OINK 1.5.1 之后本地依赖迁移的功能、故障回退与浏览器验收记录。
weight: 76
icon: fa-solid fa-list-check
design_kind: research
design_status: local-verification
research_date: 2026-11-11
---

> [!IMPORTANT] 本地候选版本
> 本记录覆盖主题 `ef3f119` 与文档站 `18cca3d` 之后的依赖迁移，
> 不代表新版本已发布、消费站点已升级或线上已部署。已发布基线仍为 OINK v1.5.1。

## 输入与方法 {#inputs}

[依赖契约](/zh/docs/design/architecture/#unreleased-dependencies)定义版本与迁移
边界。最初的运行时验收使用 macOS ARM64、Hugo Extended 0.168.0 及内置 LibSass、Go 1.27.3、
Node 26.12.0、npm 11.20.0、Python 3.14.8。两个 workspace 均关闭，文档站通过
单次命令级模块替换选择同级主题源码。主题检查构建新夹具，最终浏览器预览关闭
文件监听与实时刷新，生产检查使用 `/preview/` 下的全新压缩构建。Algolia、
演示 API 与服务端 PlantUML 返回受控响应，验证客户端集成，不验证远端服务可用性。

## 验收中发现并修复的问题 {#repairs}

| 范围 | 复现问题与修复 |
| --- | --- |
| Markmap 外观 | 已打开的注释保留旧配色；现在随明暗模式与预设实时更新，且不再触发多余的动画重绘。 |
| Markmap 动画展开 | `stateTween` 动画展开在初始 `render` 事件之后才插入子级 SVG 节点，导致展开后的链接缺少无障碍名称、注释标记缺少按钮语义；现在通过作用域受限的 `MutationObserver` 与 SVG 链接 `:focus-visible` 样式持续保持无障碍属性和焦点环。 |
| Markmap 键盘与双列视图 | 焦点引起的平滑滚动可能提前关闭刚打开的注释，SVG `<a>`（`SVGAElement`）在双列视图中点击跳转异常，且打开的 ARIA 注释浮层或重绘后的标记与双列视图快捷键冲突；现在打开前先完成滚动，双列视图解析 `SVGAElement` 地址并向打开的 ARIA 对话框让出快捷键，注释关闭时按实时节点恢复焦点。 |
| Markmap 模板与诊断 | 通过 `include` 引入的导图未在宿主页登记运行时能力，CRLF 头未被识别，旧配置告警在多输出格式下重复打印；现在统一写入宿主页、支持 CRLF 头并仅在 HTML 输出告警一次。 |
| Markmap 故障 | 注释 chunk 缺失时内容无法读取；现在恢复对应导图的完整 Markdown 与焦点，清理监听器，其他导图继续可用。 |
| Markmap 打印与链接 | 浮层进入打印，上游链接在浅色模式下对比度不足且没有下划线；现在打印隐藏浮层，注释链接使用正文链接颜色并带下划线。 |
| ReDoc 框架跨源校验 | 直接访问 `redoc-frame.<hash>.html?spec=https://...` 原先可加载任意远程规范；现在跨源规范要求运行于同源 `.td-redoc__frame` 内且与页面嵌入地址一致。 |
| Asciinema | 无 JavaScript 或播放器资源缺失时容器为空，录像获取或解析失败后也丢失文件入口；现在初始 HTML 提供链接，同步或异步错误恢复链接与播放器原有焦点。 |

## 验证证据 {#validation}

下文工具链更新之前，主题所属检查通过，包含依赖清单与校验值、内置 Sass、输出结构、命名空间、配置
与翻译键一致性、52 个输出 golden、82 项 JavaScript 测试及 90 项迁移测试。
媒体 golden 有意记录录像链接及其对字数统计的影响。文档站的 `make check` 与
规范浏览器套件覆盖无障碍、响应式阅读界面、键盘导航、组件、代码、外观、Expo、
图库、图表、表格和文档对照。失败用例修复后重跑所属套件，再完成验收；这些运行
累计覆盖规范套件的 544 项用例，包含新增的四项注释浮层无障碍检查。

最终依赖套件包含每引擎 23 项用例（修复后在 Chromium 与 WebKit 完成复验，连同首轮三引擎 63 项基线）；
显式服务套件包含每引擎 4 项用例，图表布局与数学兼容性在对应引擎全部通过。覆盖：

- ReDoc 独立路由、文章锚点、复制、下载、外部链接以及规范或模块缺失；
  Swagger 展开操作并实际发送受控 API 请求。
- DocSearch 指定索引、结果、跳转、键盘关闭及服务错误后的查询恢复；PlantUML
  的 UTF-8 编码、SVG 标识隔离、持久缓存复用，以及 IndexedDB 与本地存储不可用。
- 终端录像实际播放、暂停与主题切换，录像缺失或损坏；Markmap 富文本注释、公式、
  安全过滤、焦点、资源缺失、拖动与适应窗口、隐藏容器；Mermaid ELK 与已有操作，
  以及 KaTeX、Infographic 和 ECharts。

视觉审阅覆盖中英文、390/1440 px、明暗、打印与禁用 JavaScript。打开的注释通过
八组 WCAG AA 扫描与强制颜色模式可见性检查。生产子目录构建正确加载带指纹的
本地资源，未发现页面横向溢出或依赖发起意外外部请求。确定性审阅阻止站点显式
配置的可选统计与评论请求。

## 工具链更新 {#toolchain-refresh}

随后在 macOS ARM64 上使用 Go 1.27.4、Hugo Extended 0.169.0、Node 26.13.0
与 npm 12.2.2 复验。27 个 vendored 直接依赖均与 npm registry 的最新稳定版一致，
文档站的直接依赖也没有可用更新。兼容范围内的传递依赖已刷新，包括 Markmap
构建所用的 KaTeX 与语法高亮依赖。两个 npm 依赖集合的审计结果均为零漏洞。
CLI 构建与测试使用的依赖均已更新，包括 `golang.org/x/mod` 0.43.0，
`go mod verify` 通过；未参与构建的上游模块图条目保留其上游约束。

新工具链通过 43 项主题检查、82 项 JavaScript 测试、内置 Sass 检查和文档站
`make check`。已审阅的 golden 差异来自 Hugo 0.169.0 的纯文本间距变化、工具链
示例更新和搜索关闭按钮名称。CLI 离线测试与 `go vet` 通过；调整测试时限并重跑
应用套件后，真实 Hugo 集成也通过。发布固定版本测试改为断言 Hugo 0.169.0。真实 CLI 集成命令可能包含
多次隔离 Hugo 渲染，因此单次测试命令允许两分钟，集成目标的总时限为 30 分钟。
Axe 4.14 发现搜索关闭按钮的可见标签与无障碍名称不匹配。现已在本地化名称中
包含可见的 Esc 按键，并由所属输出检查器覆盖。
新浏览器还暴露了双列视图语言菜单跨越窄屏断点时偶发的焦点丢失：CSS 可能在
媒体查询回调捕获焦点之前隐藏旧容器。现在由同一次运行时更新控制容器显隐与菜单
迁移，浏览器检查覆盖 LTR、RTL 下菜单展开和关闭时的 899/900 px 与 390/1200 px。

出版检查使用 Pandoc 3.13、EPUBCheck 5.4.0、Temurin 27.0.1.0.2 和 Chrome
headless shell 157.0.8103.50。根路径与子路径 EPUB 均通过结构检查和 EPUBCheck，
没有错误或告警；两份 PDF 均通过页数、标题和内容检查。三项 PDF 隔离检查全部
通过，包括真实浏览器用例。下载工具与出版产物均保存在 Git 仓库之外。

使用 Playwright 1.65.0，初轮运行与修复后的定向复验累计覆盖规范 Chromium 套件的
全部 546 项用例。最终引擎为 Chromium 158.0.8127.18、Firefox 159.0 与 WebKit 27.2。
Firefox、WebKit 各通过 39 项依赖、图表布局和数学检查，以及 4 项服务检查。
三种引擎各通过全部 9 项多语言双列视图检查；Escape 用例明确建立键盘焦点起点，
避免假定所有引擎都会在鼠标点击按钮时赋予焦点。修复后，27 项普通双列视图与
历史记录检查也全部通过。

另行移除模块替换并关闭两个 workspace，以已发布 OINK v1.5.1 固定版本完成生产
构建，站点声明版本与模块 pin 一致。这验证了该已发布版本与新工具链的兼容性，
不表示本地主题改动已经发布。

提交前再次通过主题依赖清单、双列视图、命令面板和 52 个 golden 检查，以及文档站
`make check`。CLI 工具链改动还在其已提交源码上独立验证，通过模块校验、离线
测试、`go vet` 与真实 Hugo 集成。CLI 的其他功能开发保留在工作区，不纳入本轮提交。

## 复验方式与边界 {#repeat}

先运行主题 `AGENTS.md` 中的检查，再运行文档站的 `make check` 与 `make browser`。
服务套件已纳入 `test:content-components`。将固定版本 Hugo 放在 `PATH` 前面，
从文档站目录复验浏览器引擎：

```sh
export GOWORK=off HUGO_MODULE_WORKSPACE=off
export HUGO_MODULE_REPLACEMENTS="github.com/pgsty/oink -> $PWD/../oink"
npx playwright test tests/browser/dependencies.spec.mjs \
  tests/browser/diagram-layout.spec.mjs tests/browser/math-compat.spec.mjs --browser all
npx playwright test --config playwright.dependencies.config.mjs --browser all
```

DocSearch 5.2 在传输重试耗尽后显示空结果，不能可靠区分服务故障与没有匹配项，
但后续查询能够恢复。ReDoc 保留独立阅读器配色。Swagger 与 ReDoc 仍有
[已记录的上游无障碍限制](/zh/docs/write/openapi/#limits)，整站 WCAG 检查排除
其生成的内部界面。测试使用已安装的现代引擎，不覆盖最低浏览器要求允许的每一个
历史版本。真实 Algolia 凭据、消费站点升级和部署不属于本轮验收。
普通消费站点仍只需 Hugo，已接受的 LibSass 弃用诊断继续显示。
