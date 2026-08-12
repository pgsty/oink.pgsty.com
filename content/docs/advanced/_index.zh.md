---
title: 高级功能
linkTitle: 高级功能
weight: 60
icon: fa-solid fa-gears
description: 搜索与命令面板、打印输出、AI 支持、评论与分析。
---

这一章是可选能力。每一项都需要显式启用——主题提供实现，但不替站点做策略决定。

## 本章内容 {#in-this-chapter}

- [搜索与命令面板](search/)：本地索引、搜索排序、`Cmd/Ctrl-K` 与 `/` 命令模式
- [打印输出](print/)：整个分区的打印视图
- [AI 与 Agent 支持](agent-support/)：Markdown 输出、`llms.txt`、页面操作
- [评论](comments/)：giscus 集成
- [分析统计](analytics/)：Google Analytics 与其他统计服务

## 默认全部关闭 {#opt-in-by-default}

| 能力     | 参数                                          | 默认    |
| -------- | --------------------------------------------- | ------- |
| 本地搜索 | `params.offlineSearch`                        | `false` |
| 明暗切换 | `params.ui.showLightDarkModeMenu`             | `false` |
| 图片缩放 | `params.ui.image_zoom.enable`                 | `false` |
| 评论     | `params.comments.enable`                      | `false` |
| 页面反馈 | `params.ui.feedback.enable`                   | `false` |
| 助手链接 | `params.ui.page_context_menu.assistant_links` | `false` |

这不是保守，而是边界问题：**是否把读者数据发给第三方，是站点的决定，不是主题的**。

同理，PlantUML 和 Draw.io 缺少显式端点配置时会中断构建，而不是悄悄用一个公共服务。
