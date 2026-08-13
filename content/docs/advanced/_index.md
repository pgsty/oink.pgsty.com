---
title: Advanced
linkTitle: Advanced
weight: 60
icon: fa-solid fa-gears
description:
  Search and the Command Palette, print output, AI support, comments, and
  analytics.
cascade:
  categories: [Advanced]
---

This chapter covers **optional capabilities**. Each one is enabled explicitly —
the theme supplies the implementation but does not set site policy on your
behalf.

## In this chapter {#in-this-chapter}

- [Search and Command Palette](search/): the local index, ranking, `Cmd/Ctrl-K`,
  and `/` command mode
- [Print output](print/): whole-section print views
- [AI and agent support](agent-support/): Markdown output, `llms.txt`, page
  actions
- [Comments](comments/): giscus integration
- [Analytics](analytics/): Google Analytics and other providers

## Everything is off by default {#opt-in-by-default}

| Capability        | Parameter                                     | Default |
| ----------------- | --------------------------------------------- | ------- |
| Local search      | `params.offlineSearch`                        | `false` |
| Light/dark toggle | `params.ui.showLightDarkModeMenu`             | `false` |
| Image zoom        | `params.ui.image_zoom.enable`                 | `false` |
| Comments          | `params.comments.enable`                      | `false` |
| Page feedback     | `params.ui.feedback.enable`                   | `false` |
| Assistant links   | `params.ui.page_context_menu.assistant_links` | `false` |

This is a boundary question rather than conservatism: **whether to send reader
data to a third party is the site's decision, not the theme's**.

For the same reason, PlantUML and Draw.io **fail the build** when enabled
without an explicit endpoint, instead of quietly using a public service.
