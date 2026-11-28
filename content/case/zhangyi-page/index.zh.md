---
title: personalpage-dvh.pages.dev
linkTitle: Zhangyi 技术笔记
description: >-
  Zhangyi 技术笔记是部署于 Cloudflare Pages 的中英双语个人工程站，用同一份 Markdown 源稿同时服务人类网页阅读与 AI Agent 读取。
images: [featured.webp]
site_url: https://personalpage-dvh.pages.dev/
case_group: community
weight: 550
date: 2026-11-13
search_keywords: [zhangyi1995, Cloudflare Pages, 个人技术笔记, 双语, AI Agent, 社区案例]
tags: [社区, 博客, 个人站]
---

[personalpage-dvh.pages.dev](https://personalpage-dvh.pages.dev/) 是部署在 Cloudflare Pages 上的中英双语技术笔记与决策备忘站，源码位于 [`zhangyi1995/PersonalPage`](https://github.com/zhangyi1995/PersonalPage)。全站 31 个 Markdown 文件，开启 KaTeX 公式、Giscus 评论与 `llms.txt`，并在首页直接点明核心理念：「用 Markdown 写作，人读网页，Agent 读同一份源。」

## 它展示了什么 {#what-it-demonstrates}

- 通过 `bin/build.sh` 显式下载固定版本的 Hugo 二进制，绕过 Cloudflare Pages 默认旧镜像版本限制。
- 在精炼的中英双语 OINK 站点中整合博客、项目记录、专题系列与面向 Agent 的输出。

→ [部署上线](/zh/docs/admin/deploy/) · [面向 AI Agent 输出](/zh/docs/customize/agents/) · [全部 OINK 案例](/zh/case/)
