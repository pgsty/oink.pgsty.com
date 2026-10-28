---
title: OINK 1.3.2 与 Hugo 0.168 消费站点盘点
linkTitle: 2026-10-18 构建基线
description: 37 个维护中的 OINK 站点本地盘点，统一使用 v1.3.2 与 Hugo Extended 0.168.0，保留可见告警并单独记录发布状态。
date: 2026-10-18
weight: 13
design_kind: research
design_status: recorded
---

本记录盘点 `~/pgsty` 与 `~/www` 下的本地站点。
当前构建规则由[架构契约](/zh/docs/design/architecture/#hugo-toolchain)与
[诊断决策](/zh/docs/design/decisions/diagnostics/)维护。

## 基线 {#baseline}

OINK [v1.3.2](https://github.com/pgsty/oink/releases/tag/v1.3.2) 于
2026-10-18 13:37 UTC 发布，对应提交
`bd2e856e6e2f7027a9189af009701f5b8cf562cf`。
维护中的站点统一使用该版本及 Hugo Extended 0.168.0。CI、本地检查、预览与部署
命令均移除遇警告中断的开关，`HUGO_PANICONWARNING` 也必须保持未设置。
告警保持可见并接受审阅，上游 LibSass 弃用提示允许出现。普通站点不需要外部 Sass
编译器，不再以旧 Hugo 版本为开发与适配目标。

本地实际工具为 macOS arm64 上的 Hugo `0.168.0+extended+withdeploy` 与
Go `1.27.2`。模块核验禁用了环境替换及 Go、Hugo 两种 workspace；经典主题消费
站点的运行时源码与公开标签逐一比对。37 个站点均保留 Paper 默认外观及显式四款
预设的读者菜单。

## 站点 {#sites}

路径相对于用户主目录。每一行都使用 OINK v1.3.2 与 Hugo Extended 0.168.0。
“模块”表示实际解析的公开模块；“副本”和“子模块”表示经典 `themes/oink` 消费站点。

| 目录 | 主题来源 | 本地生产构建 |
| --- | --- | --- |
| `pgsty/barn.pgsty.com` | 模块 | 通过 |
| `pgsty/boar.pgsty.com` | 模块 | 通过 |
| `pgsty/caps.vonng.com` | 模块 | 通过 |
| `pgsty/cloudexit.org` | 模块 | 通过 |
| `pgsty/exp.pgsty.com` | 模块 | 通过 |
| `pgsty/oink-starter` | 模块 | 通过 |
| `pgsty/oink.pgsty.com` | 模块 | 通过 |
| `pgsty/pgetcd.pgsty.com` | 模块 | 通过 |
| `pgsty/pgext` | 模块 | 通过 |
| `pgsty/pgredis.pgsty.com` | 模块 | 通过 |
| `pgsty/pgsilo.pgsty.com` | 模块 | 通过 |
| `pgsty/pgsty.com` | 模块 | 使用本地报告数据通过，见下文 |
| `pgsty/pgsty.pro` | 模块 | 通过 |
| `pgsty/pig.pgsty.com` | 模块 | 通过 |
| `pgsty/pigsty.cc` | 模块 | 通过 |
| `pgsty/pigsty.io` | 模块 | 通过 |
| `pgsty/repo.pgsty.com` | 模块 | 通过 |
| `pgsty/silo.pgsty.com` | 模块 | 通过 |
| `pgsty/sow.pgsty.com` | 模块 | 通过 |
| `pgsty/wok.pgsty.com` | 模块 | 通过 |
| `www/aiempire` | 模块 | 通过 |
| `www/ca.vonng.com` | 子模块 | 通过 |
| `www/ddia` | 模块 | 通过 |
| `www/dharma` | 模块 | 通过 |
| `www/doc.pg.center` | 模块 | 通过 |
| `www/fzb/site` | 源码副本 | 通过 |
| `www/lzj` | 模块 | 通过 |
| `www/muse.vonng.com` | 源码副本 | 通过 |
| `www/pg-internal` | 模块 | 通过 |
| `www/pg36g` | 模块 | 通过 |
| `www/pgweekly` | 模块 | 通过 |
| `www/piglet.run` | 模块 | 通过 |
| `www/sg.vonng.com` | 子模块 | 通过 |
| `www/tpme` | 模块 | 通过 |
| `www/us.vonng.com` | 子模块 | 通过 |
| `www/vonng.com` | 模块 | 通过 |
| `www/zj` | 模块 | 通过 |

## 边界 {#boundaries}

- `pgsty.com` 拉取单独发布的报告清单时遇到 unexpected EOF 或超时。使用现有
  本地报告数据及 `HUGO_REPOORT_USE_LOCAL=1` 后构建通过。
- `sow.pgsty.com` 在既有的发布审阅分支验证。无 Git 元数据或使用
  源码副本的站点均原地验证。
- `pgsilo/work/silo-docs` 按所属仓库的说明属于冻结交付基线，不纳入维护站点升级。
- 本记录涵盖基于已发布 `v1.3.2` 标签的本地源码、模块解析、构建与渲染菜单检查。
