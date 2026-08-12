---
title: 发布流程
weight: 50
icon: fa-solid fa-tag
description: 发布 Oink 主题并更新独立项目站点。
aliases: [/docs/oink/release/]
---

Oink 把实现、验证、公开发布与部署视为不同状态。一次绿色本地构建是有价值的证据，但它不是公开标签、可下载模块，也不是已经部署的文档更新。

## 发布状态 {#release-states}

| 状态     | 必需证据                                          |
| -------- | ------------------------------------------------- |
| 源码完成 | 范围、文档、变更日志、归属信息与评审全部完成      |
| 验证完成 | 主题模块与项目站点检查通过                        |
| 公开发布 | `pgsty/oink` 中存在不可变根标签，并可通过 Go 解析 |
| 文档完成 | `pgsty/oink.pgsty.com` 固定并记录该标签           |
| 部署完成 | 托管文档与目标消费站点通过验证                    |

应报告准确状态与证据；不要把本地构建称为发布。

## 版本管理 {#versioning}

主题版本在 `github.com/pgsty/oink` 使用 `vX.Y.Z`
这样的根标签。主题现在就是仓库根模块，因此不再使用嵌套的 `theme/vX.Y.Z` 标签。

项目站点的 `version` 参数标识发布的站点变体，不会自动成为 Git ref。安装说明与
`go.mod` 必须使用真实可解析的主题标签。

## 验证主题仓库 {#validate-the-theme-repository}

从干净的 `pgsty/oink` checkout 开始：

1. 检查源码 diff 与归属信息变更；
2. 验证 `VENDOR.json` 中每个文件与 SHA-256；
3. 确认仓库没有生成的 `public/`、资源缓存、`node_modules/` 或内嵌 example site；
4. 使用最低版本与当前支持版本的 Hugo Extended，通过 Hugo
   Module 路径构建最小消费站点；
5. 检查 module zip，确认布局、资源、翻译、静态文件、许可证与 NOTICE 都存在。

module zip 测试很重要，因为 Go 会从发布模块中排除 `vendor`
等特殊目录名。Oink 把随附依赖放在
`assets/third_party/`，确保它们能进入模块发行物。

## 验证项目站点 {#validate-the-project-site}

把 `pgsty/oink` 与 `pgsty/oink.pgsty.com`
克隆为同级目录，再用被忽略的 workspace 连接：

```sh
cd oink.pgsty.com
go work init .
go work edit -replace=github.com/pgsty/oink=../oink
export HUGO_MODULE_WORKSPACE=go.work
npm ci
npm test
```

检查具有代表性的中英文页面、移动导航、两种颜色模式、本地搜索、打印输出、图表、API 文档与
`404` 页面。这只能验证候选版本与站点配合正常，不会发布任何仓库。

## 标记并发布主题 {#tag-and-publish-the-theme}

评审完成后，在主题仓库中经过评审的 release
commit 上创建一个不可变的签名根标签。OINK 目前直接标记经过评审的 `main`
commit；维护分支是可选项，只有实际存在时文档才能引用：

```sh
git tag -s vX.Y.Z -m "Oink vX.Y.Z"
git push origin main vX.Y.Z
```

推送以及创建 GitHub release 都需要明确授权。标签公开后，从干净环境验证：

```sh
hugo mod get github.com/pgsty/oink@vX.Y.Z
hugo mod graph
```

如果 release 附带离线归档，请发布并独立验证 SHA-256。归档中必须保留
`LICENSE`、`NOTICE` 与 `VENDOR.json`。

## 更新项目站点 {#update-the-project-site}

主题标签能够公开解析后，更新独立站点仓库：

```sh
hugo mod get github.com/pgsty/oink@vX.Y.Z
hugo mod tidy
npm test
npm run test:browser
```

Pages workflow 还会运行 `node scripts/check-release-pin.mjs`；如果
`params.version`、`tdVersion.latest` 与 `go.mod`
中的主题精确版本不是同一个稳定标签，部署就会停止。候选验证仍可使用被忽略的同级目录
`go.work`，但该 workspace 绝不是公开发布证据。

把
`go.mod`、`go.sum`、版本参数、变更日志与升级指南一起提交。先验证部署预览，评审通过后再推进生产发布分支。

## 发布后验证 {#post-release-verification}

公开发布后：

1. 从干净 clone 获取标签并检查签名；
2. 通过公开 Go proxy 解析模块；
3. 使用文档命令构建一个全新最小站点；
4. 打开生产文档，验证模块说明、canonical 链接、语言、搜索与资源；
5. 验证所有发布归档与 checksum；
6. 记录最终标签、模块版本、托管 URL 与产物哈希。

## 热修复与回滚 {#hotfix-and-rollback}

热修复范围可以更小，但仍要经过同一证据链。绝不能移动或替换已经发布的标签。站点需要回滚时，应恢复到已知产物；主题需要修复时，则发布新的补丁版本。

## 完成定义 {#definition-of-done}

只有批准的标签已经存在、公开模块能够解析、必需检查通过、项目站点固定该标签，并且托管冒烟测试成功，版本才算发布完成。任何未完成项都应按实际状态报告。
