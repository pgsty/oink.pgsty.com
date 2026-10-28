---
title: 有把握地交付
linkTitle: 校验与交付
description: 用一套可重复的发布清单，依次检查本地预览、生产构建、主题升级与线上部署。
book_kind: chapter
book_number: 6
weight: 60
---

文档站点的交付通常包含四个阶段：本地预览、仓库生产构建、按需升级固定的主题模块，以及推送到托管平台上线。
按顺序检查每个阶段，能在构建或部署出错时快速定位原因。

## 按阶段检查发布流程 {#delivery-states}

| 阶段 | 检查内容 | 下一步 |
| --- | --- | --- |
| 本地预览 | 页面、导航与内容修改可在 `hugo server` 中正常渲染 | 执行干净的生产构建 |
| 仓库构建 | 内容、配置与 `go.mod` 在 `--environment production` 下构建通过 | 推送分支或发起 Pull Request |
| 主题升级 | `hugo mod graph` 解析到目标公开标签并更新 `go.sum` | 查阅版本发布说明并检查页面排版 |
| 线上部署 | CI 工作流成功完成，主要公开路由均可正常访问 | 抽查桌面端与窄屏页面表现 |
{#tbl-delivery-states num="6-1" caption="从本地预览到线上部署的四阶段检查清单。"}

## 验证最小且有效的范围 {#validate}

在自己的 Starter 仓库中，先执行一次干净的生产构建，再触发部署工作流：

```bash
hugo --cleanDestinationDir --gc --minify --environment production \
  --printPathWarnings
```

确认 `hugo mod graph` 解析到 `go.mod` 中预期的公开版本，再按[Starter 部署步骤](/zh/docs/start/starter/#build-deploy)操作。
普通 Starter 站点不需要 npm 构建脚本或同级主题目录。如果同时在修改 OINK 主题本身，
可按[主题开发流程](/zh/docs/start/from-scratch/#local-theme-checkout)进行联调。

## 审阅真正渲染出的结果 {#visual-review}

自动检查能发现坏链接、重复 ID、无效短代码与无障碍回归，而版面与可读性仍需肉眼审阅。
请在桌面与窄屏宽度下抽查具有代表性的中英文页面，涵盖 Hero 裁切、宽表格、导航、主题切换控件、
代码块以及整书打印视图。

## 整理发布记录 {#handoff}

发起 Pull Request 或升级主题版本时，对照 {{< xref tbl="6-1" anchor="tbl-delivery-states" />}}
记录当前使用的 Hugo 版本、`go.mod` 中的主题版本、构建输出以及抽查过的页面路由。
在变更说明中附上这份简短清单，方便团队审阅与回滚排查。

完整的运维参考见[预览站点](/zh/docs/admin/preview/)、
[部署站点](/zh/docs/admin/deploy/)与[排查构建问题](/zh/docs/admin/troubleshooting/)。

