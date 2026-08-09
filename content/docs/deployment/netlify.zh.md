---
title: 部署到 Netlify
linkTitle: Netlify
description: 仅使用 Hugo 将 OINK 站点部署到 Netlify。
---

[Netlify][]
可以从 GitHub、GitLab 或 Bitbucket 构建站点，并为每个拉取请求发布预览。OINK 消费端会直接运行 Hugo
Extended，不安装 Node.js 软件包，也不调用 PostCSS。

## 配置站点 {#configure-the-site}

把完整源码推送到 Git 服务商，在 Netlify 中导入仓库，然后使用以下构建设置：

| 设置           | 值                               |
| -------------- | -------------------------------- |
| 构建命令       | `hugo --gc --minify`             |
| 发布目录       | `public`                         |
| `HUGO_VERSION` | `0.164.0` 或主题验证过的其他版本 |

如果 Netlify 检测到仅供主题维护工具使用的软件包清单，请为站点关闭自动依赖安装。这些工具不属于消费端构建合同。

如果通过 Git
submodule 安装主题，请启用递归 submodule 检出。如果使用 Hugo 模块，Netlify 还需要具备普通的 Git 和 Go 访问能力，以便在全新构建中下载已经固定版本的模块。完整离线发行包使用相邻的
`theme/` 目录，可避免首次构建时下载依赖。

## 将配置保存在仓库中 {#keep-configuration-in-the-repository}

也可以把同样的设置写入 `netlify.toml` 并提交：

```toml
[build]
command = "hugo --gc --minify"
publish = "public"

[build.environment]
HUGO_VERSION = "0.164.0"
```

除非预览环境专门用于测试升级，否则生产环境和部署预览应使用同一个 Hugo 版本。如果预览构建需要把自动生成的 URL 作为 base
URL，请在对应环境的 Hugo 命令中加入 Netlify 部署 URL。

如果不希望非生产部署被索引，请按照[构建环境与索引][]中的说明使用非生产 Hugo 环境。

保存设置后触发一次部署，并检查构建日志。正常的消费端构建应该只出现一条 Hugo 命令，不应运行 npm、PostCSS、Autoprefixer、CDN 下载或构建期远程资源步骤。

[Build environments and indexing]:
  /zh/docs/deployment/#build-environments-and-indexing
[Netlify]: https://www.netlify.com/
