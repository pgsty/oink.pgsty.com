---
title: 塑造首页与外观
linkTitle: 首页与外观
description: 用数据分区搭出首页，给站点设置名称、Logo 和强调色，挑选视觉预设，并让读者自己选择外观和深色模式。
book_kind: chapter
book_number: 8
weight: 80
aliases:
  - /book/04-design/
---

读者几秒钟内就会判断一个站点是不是为自己准备的，依据主要是第一屏和整体外观。在 OINK 里，这两样都不需要写模板：首页是一份从上到下列出各个分区的 YAML 文件，外观则是一套预设加上几项设置。本章先给 Acme DB 做一个讲清“它是什么、怎么安装”的首页，再赋予站点自己的形象。

## 首页是数据 {#home}

Starter 的 `data/home/en.yaml` 里有三个分区。把它换成讲述 Acme DB 的五个分区：它是什么、几个关键数字、从哪里开始、安装命令，以及结尾的行动号召：

```yaml {title="data/home/en.yaml" num="8-1" caption="Acme DB 的五段式首页。" #eg-home-data}
sections: [hero, metrics, cards, command-box, cta]

hero:
  align: center
  eyebrow: Open-source time-series database
  title_lines:
    - words: [{ text: Acme DB. }]
    - words: [{ text: Years of metrics, queried in milliseconds. }]
  lead: One binary. Write over HTTP, query with SQL, keep data as long as you need.
  actions:
    - { label: Quick start, url: docs/get-started/quick-start/, icon: fa-solid fa-rocket, style: primary }
    - { label: GitHub, url: 'https://github.com/acme/acme-db', external: true, style: ghost }

metrics:
  title: Acme DB 3.0 in numbers
  items:
    - { value: 3400000, compact: true, label: points per second on 8 cores }
    - { value: 10, suffix: '×', label: typical compression }
    - { value: 1, label: binary to install }

cards:
  eyebrow: Where to start
  title: Everything has a place
  columns: 3
  items:
    - title: Quick start
      desc: Start a server, write a point and query it in five minutes.
      icon: fa-solid fa-rocket
      url: docs/get-started/quick-start/
    - title: Operations
      desc: Backups, upgrades and capacity planning for production.
      icon: fa-solid fa-screwdriver-wrench
      url: docs/operations/
    - title: Release notes
      desc: What changed in each version, and how to upgrade.
      icon: fa-solid fa-tag
      url: blog/release/

command-box:
  title: Install
  code: curl -fsSL https://get.acme.example/install.sh | sh
  lang: bash

cta:
  title: Run your first query today.
  text: The quick start takes five minutes on a laptop.
  label: Get started
  url: docs/get-started/quick-start/
  style: primary
```

要调整页面顺序，就调整 `sections`；要隐藏某个分区，把它写成 `{ type: metrics, enabled: false }`，数据照样保留。指向自己页面的链接写成不带前导斜杠的站点路径，例如 `docs/operations/`，因为主题会补上语言前缀：同一个链接写在 `data/home/zh.yaml` 里，就会指向 `/zh/docs/operations/`；这份文件结构相同，只是文字换成了中文。拼错的分区类型会告警 `unknown section type` 并被跳过，所以某个分区没有出现时，先看构建输出。

分区类型共有 22 种，其中包括定价表、Logo 墙、FAQ、Markdown 源码与渲染结果的对照，以及由版本发布数据驱动的下载卡片；[首页与落地页](/zh/docs/customize/home/#registry)列出了全部类型。其他任何页面写上 `layout: landing`，也能使用同样的分区。

## 名称、Logo 与 favicon {#identity}

站名来自 `hugo.yaml`，你在第 3 章已经设置过。站名旁边的标志，在你指定自己的标志之前，一直是 Starter 自带的中性 `assets/icons/logo.svg`：

```yaml {title="hugo.yaml"}
params:
  logo: icons/acme-mark.svg
```

把 SVG 裁紧并写上 `viewBox`，否则它和旁边的文字对不齐；颜色要在浅色和深色背景上都看得清。favicon 不需要任何设置：把 `favicon.ico`、`favicon.svg` 和 `apple-touch-icon.png` 放进 `static/`，每个页面都会链接它们。

## 按分区设置强调色 {#theme-color}

强调色标出读者所在的位置：侧栏中选中的那一行、大纲里的当前小节、焦点环、悬停时的卡片边框。先给全站设一个，再在 `cascade` 里给某个分区单独设一个，读者就能分清站点的各个部分：

```yaml {title="hugo.yaml"}
params:
  ui:
    theme_color: '#0f766e'
```

```yaml {title="content/blog/_index.md"}
cascade:
  theme_color: '#6d28d9'
  theme_color_dark: '#a78bfa'
```

本书正是这样做的：它的根页面设置了 `theme_color: '#9a3412'`，所以这里侧栏中选中的章节和大纲标记是橙色的，到了文档里则是蓝色。正文链接和行内代码在所有地方都保持预设的颜色，读者在任何分区都能用同一种方式认出链接。

## 预设与读者的选择 {#presets}

预设是一整套浅色与深色外观：配色、字体、链接与表格样式。先选一套最接近自己品牌的，再动手调颜色：

| 预设 | 外观 |
| --- | --- |
| `paper` | 象牙色纸面、墨色文字、带下划线的蓝色链接、带边框的表格。默认值 |
| `slate` | 冷调蓝灰的技术风格 |
| `ink` | 黑白底色、红色标记、直角面板。实验性 |
| `terminal` | 通篇等宽字体、青色链接、琥珀色强调、紧凑的导航。实验性 |
{#tbl-presets num="8-1" caption="四套视觉预设。"}

```yaml {title="hugo.yaml"}
params:
  ui:
    preset: paper
    preset_menu: [paper, slate, ink, terminal]
    dark_mode: true
```

`preset` 是站点自己的外观；`preset_menu` 让读者在“外观”菜单里换成其他预设，`dark_mode` 再往菜单里加上“浅色”“深色”和“系统”三项。读者的选择保存在他们自己的浏览器里。可以在本页试试：按 {{< kbd "T" >}} 轮换预设，按 {{< kbd "Y" >}} 轮换浅色与深色。无论怎样组合，橙色强调色都保持不变，因为 `theme_color` 在每套预设中都优先生效。

## 字体与自定义 CSS {#css}

西文字体随主题分发，从你自己的站点加载，所以没有任何页面会请求字体服务；中文使用读者系统里已有的字体。`params.ui.typography: system` 会把所有字体角色切换为平台自带的字体。设置覆盖不到的地方，就在 `assets/css/project.css` 里写普通 CSS，它在主题样式表之后加载。下面这段在两种模式下重新设置页脚和落地页分区所用的暖色辅助强调色；之所以要单独写深色值，是因为每套预设都设有自己的深色值：

```css {title="assets/css/project.css"}
:root {
  --td-brand-copper: #a66722;
}

[data-bs-theme='dark'],
[data-td-preset='paper'][data-bs-theme='dark'] {
  --td-brand-copper: #e0a35c;
}
```

这是普通 CSS 而不是 SCSS，因为 Hugo 不经编译就直接发布它。能用设置解决的就不写选择器，能用选择器解决的就不复制模板：放在 `layouts/` 里的覆盖文件，从此收不到主题的修复。[品牌外观](/zh/docs/customize/brand/)列出了跨版本都可以依赖的字体角色和配色变量。

## 检查成果 {#checkpoint}

- 首页在两种语言下都显示首屏 Hero、三个指标、三张卡片、带复制按钮的安装命令，以及结尾的行动号召。
- 快速上手按钮在英文首页指向 `/docs/get-started/quick-start/`，在中文首页指向 `/zh/docs/get-started/quick-start/`。
- 博客使用紫色强调色，站点其余部分使用青绿色。
- “外观”菜单提供四套预设和三种明暗模式，每种组合都清晰可读。

## 交给 agent {#agent}

```text {num="8-2" caption="提示词：重做首页和外观。" #eg-agent-design}
按照 https://oink.pgsty.com/zh/docs/customize/home/，把 data/home/en.yaml 和
data/home/zh.yaml 重写为五个分区：hero、metrics、cards、command-box、cta。所有
事实都取自 README.md，不要编造数字。站内页面链接写成不带前导斜杠的站点路径。全站
theme_color 设为 <#0f766e>，并在 cascade 里给博客单独设一个颜色。保持 preset 为
paper、preset_menu 为 [paper, slate, ink, terminal]，并开启深色模式。然后在桌面
和手机两种宽度下，逐一检查四套预设的浅色与深色模式，并报告所有产生告警的分区。
```
