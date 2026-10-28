---
title: 塑造阅读体验
linkTitle: 塑造体验
description: 把稳固的内容结构变成一份可辨识、响应式且双语对齐的出版物。
book_kind: chapter
book_number: 4
weight: 40
---

设计应该在内容树跑通之后开始。本章在你的 Starter 仓库中把品牌标识、视觉预设、首页编排、
导航层级与双语对齐连成一套完整的阅读体验。

## 建立视觉层级 {#hierarchy}

先处理标题、导语、正文、层级标题与局部导航。在加入色彩或装饰前，读者就应该明白下一个动作由哪个区域承接。
OINK 提供层级，站点变量提供身份。

打开 Starter 仓库中的 `hugo.yaml`，修改站点名称、规范 URL、默认视觉预设与品牌强调色：

```yaml {title="hugo.yaml"}
title: &siteTitle Acme Docs
baseURL: https://docs.acme.example/

params:
  ui:
    preset: paper
    preset_menu: [paper, slate, ink, terminal]
    dark_mode: true
    theme_color: '#245f94'
    typography: system
```

保存后刷新 `http://localhost:1313/`。YAML 锚点会一次性更新所有已启用语言的站名，顶栏右侧的外观菜单则允许读者在亮色和暗色模式下自由切换 `paper`、`slate`、`ink` 与 `terminal` 四套风格。

## 编排首页 {#home}

首页由 `data/home/` 下的数据文件驱动。YAML 分区列表应讲清楚几件事：项目是什么、面向谁，以及读者下一步可以做什么。

编辑 `data/home/zh.yaml`，把首屏主按钮指向你在第 2 章和第 3 章编写的验证页面：

```yaml {title="data/home/zh.yaml"}
sections:
  - hero
  - cards
  - cta

hero:
  eyebrow: Acme · 开源工程文档
  title: 清晰可靠的 Acme 运维指南。
  lead: 通过可直接复制的示例，在生产环境中安装、配置并运行 Acme。
  actions:
    - label: 验证本地预览
      url: docs/preview-check/
      icon: fa-solid fa-rocket
      style: primary
    - label: 浏览文档
      url: docs/
      style: ghost
```

## 保持导航可预期 {#navigation}

顶部菜单、外壳根切换器、侧栏、页内大纲与翻页器各自回答不同问题。请在桌面端与移动端同时检查它们，
并确保两种语言显示同一套内容顺序：

- **顶部导航栏（栏目根页的 `menus.main`）**：在顶层内容区（`Docs`、`Blog`、`Book`）之间切换。
- **左侧栏（目录树 + `weight`）**：展示当前页面在所属栏目中的位置。
- **右侧页内大纲（页面 `##` 与 `###` 标题）**：在当前页面内部快速跳转。
- **底部翻页器**：按侧栏顺序前往上一篇或下一篇。

## 同时设计两种语言 {#languages}

从一开始就把各语言版本当作对等页面来设计。在 `data/home/en.yaml` 中同步更新英文首屏配置，让英文读者也能通过相同入口直达 `/docs/preview-check/`：

```yaml {title="data/home/en.yaml"}
hero:
  eyebrow: Acme · Open Source Documentation
  title: Clear operational guides for Acme.
  lead: Install, configure, and run Acme in production with copy-ready examples.
  actions:
    - label: Verify Local Preview
      url: docs/preview-check/
      icon: fa-solid fa-rocket
      style: primary
    - label: Browse Docs
      url: docs/
      style: ghost
```

注意 `url: docs/preview-check/` 使用相对语言根的路径——OINK 会在英文下自动解析为 `/docs/preview-check/`，在中文下自动解析为 `/zh/docs/preview-check/`。更多视觉参数与落地页区块用法，请参考[品牌与外观](/zh/docs/customize/brand/)、[首页与落地页](/zh/docs/customize/home/)与[多语言](/zh/docs/customize/i18n/)。

