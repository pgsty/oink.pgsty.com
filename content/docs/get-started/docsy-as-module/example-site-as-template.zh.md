---
title: 查看双语项目站点
linkTitle: 双语项目站点
description: 把独立 Oink 项目站点作为完整参考。
weight: 2
---

独立的 [`pgsty/oink.pgsty.com`](https://github.com/pgsty/oink.pgsty.com)
仓库是完整的双语示例与回归站点。它有意比 starter 更全面：应把它作为参考，然后只保留产品真正需要的内容与配置。

## 克隆项目站点 {#clone-the-project-site}

Oink 主题公开发布后，可以直接克隆并构建站点：

```sh
git clone https://github.com/pgsty/oink.pgsty.com.git product-docs
cd product-docs
hugo --gc --minify
```

已提交的 `go.mod` 会固定
`github.com/pgsty/oink`。本地开发主题时，请把主题克隆为同级目录，并使用
[Oink 快速开始](/zh/docs/oink/getting-started/#develop-against-a-local-checkout)记录的 workspace 命令。

## 运行站点检查 {#run-the-site-checks}

Hugo 本身即可构建站点。Node.js 只用于项目站点的格式、链接、翻译与回归检查：

```sh
npm install
npm test
```

打开生成的站点，分别检查中英文页面。请从具有译文的详情页使用语言切换器，不要只在首页测试。

## 替换示例身份 {#replace-the-example-identity}

编辑 `hugo.yaml` 与 `config/` 下的文件，并替换：

- 站点标题，以及各语言的标题与描述；
- `baseURL`；
- 代码仓库与分支 URL；
- 版权所有者与起始年份；
- Logo 与品牌素材；
- 中英文菜单标签。

不要创建 `oink.*`
参数命名空间。请使用 Hugo 的语言、菜单、模块、输出和 markup 设置，以及主题已经记录的参数。

## 替换示例内容 {#replace-the-example-content}

把每组译文放在一起：

```text
content/docs/getting-started.md
content/docs/getting-started.zh.md
```

删除产品不需要的历史与回归内容。只有在页面不再引用后，才删除对应示例资源。

中文标题应显式使用英文页面实际渲染出的 ID：

```markdown
## Configure search
```

```markdown
## 配置搜索 {#configure-search}
```

## 将新站点纳入版本控制 {#put-the-new-site-in-version-control}

发布派生站点前，请修改模块路径、仓库元数据与 remote。继续在 `go.mod`
中固定 Oink 版本。除非托管工作流有明确要求，否则不要提交生成的 `public/` 产物。

## 后续步骤 {#whats-next}

- 查看[基础配置](/zh/docs/get-started/basic-configuration/)。
- 学习[内容组件](/zh/docs/oink/components/)。
- 配置[部署](/zh/docs/oink/deployment/)。
- 使用[发布检查清单](/zh/docs/oink/release/)。
