---
title: 视觉预设验收，2026-10-05
linkTitle: 预设验收
description: Paper 与 Slate 的本地验证、真实主题输出，以及注明范围的浏览器证据。
weight: 15
icon: fa-solid fa-list-check
design_kind: research
design_status: local-verification
research_date: 2026-10-05
---

> [!IMPORTANT] 仅为本地证据
> 本记录针对同级主题 checkout 的真实输出，没有注入原型样式；不代表发布版本、
> 升级消费站点或验收线上站点。

## 输入 {#inputs}

2026-10-05 的主题与文档站工作树；macOS ARM64，Hugo Extended 0.166.0、
Go 1.27.1、Node 26.9.0、Playwright 1.62.1。常规浏览器套件使用 Chromium；
另有 Chromium、Firefox 与 WebKit 专项检查。站点仍固定 v1.1.0，
`make check`、`make browser` 与 `make dev` 使用同级本地主题，公开 pin 未修改。
本轮不是 Hugo 0.160.1 下限或 CI 固定工具链验收。

## 已执行检查 {#executed-checks}

| 证据 | 结果与范围 |
| --- | --- |
| `check-presets.py` | Paper 明暗 token 对称与正文、链接、代码、铜色 AA 对比度；冻结的 v1.1.0 Slate 基础色板；四种严格配置构建与 16 个 HTML 根元素，包括 404 和打印 |
| 现有主题检查器 | 参数、字体角色、vendor 清单、32 个语言目录、动作、外壳、输出、命名空间、Landing 和运行时隔离均通过；生成的 schema 与源码一致 |
| `check-goldens.py` | 52 个表面通过；已审阅并更新根属性、首绘颜色、菜单及其动作与运行时影响的 34 份 HTML/打印期望，其他输出格式未变 |
| 严格站点构建 | 真实本地主题中英文站以 `--panicOnWarning` 构建成功；翻译、渲染 Markdown 和站内链接检查通过 |
| `node --test 'tests/js/**/*.test.js'` | 49 个运行时测试通过 |
| `appearance.spec.mjs` | 25 个测试通过：Paper/Slate × EN/ZH × 390/1440 px × 浅深色，覆盖首页、配置长文、提示块和标签页；菜单 axe、键盘、持久化、恢复默认、跨语言导航、跨标签同步、禁用存储、非法值、无 JS、打印、命令面板、阅读锚点与断点处理、生成的评论样式表 |
| `appearance-engines.spec.mjs` | 6 项通过：Chromium、Firefox、WebKit × 390/1440 px；CSS 前恢复状态和浏览器栏颜色、原生键盘选择、焦点返回及跨语言导航。Chromium 桌面另加 4 倍 CPU 限速 |
| 字体请求 | 观测到的字体均来自本地；Paper 不请求 Inter，Slate 不请求 Plex Sans。两次真实文档站配置覆盖构建证明系统排版不请求内置文字字体，显式字体角色可覆盖两套预设 |
| `make check` | 完整非浏览器套件通过：57 个测试、141/141 篇翻译页面，以及既有 Markdown、渲染内容与站内链接检查 |
| `make browser` | 九个常规套件共 197 个测试通过；sitemap axe 扫描限定为下述 15 条路由 |
| 视觉抽查 | 已检查真实 Paper 桌面首页、手机 Docs 长文、中英文浅深色外观面板，以及 Slate 深色首页；截图来自浏览器测试，不是样式注入原型 |

浏览器套件的 sitemap axe 扫描通过 `A11Y_PATHS` 限定为 15 条代表性路由：中英文
首页、配置、提示块、标签页与 OpenAPI，以及英文搜索、Mermaid、ECharts、Blog
和一个 Book 章节。另运行现有响应式 axe 矩阵。跨域 Giscus 与 API 供应商组件 DOM
沿用既有排除规则，本轮不是全量 sitemap 扫描。

整合检查发现并修复了 Paper 深色高亮代码行的行号对比度，以及平滑滚动干扰阅读
锚点恢复的问题。章节强调色测试现在分别断言 Paper 的暖色不透明选中底和 Slate
原有的半透明选中底。

## 限制与后续检查 {#limits}

手工读屏播报和逐帧绘制追踪尚未验证。阻塞样式表及 CPU 限速断言验证初始化顺序，
不等同于证明所有浏览器的首个绘制帧。Slate 比较冻结基础色板并检查渲染字体行为，
不宣称包含其他 1.2
改动后的所有组件与 1.1.0 像素等价。

Mermaid/ECharts 继续仅随明暗。Ink 与 Terminal 仍为研究；衬线展示标题、完整
几何与密度 token、图表随预设配色留待后续。本轮没有创建发布标签、推送、跨站
升级或部署。
