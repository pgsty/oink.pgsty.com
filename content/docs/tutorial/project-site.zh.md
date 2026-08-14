---
title: 用项目站点起步
linkTitle: 项目站点
weight: 50
description: 把 oink.pgsty.com 当模板改，快速得到一个配置完整的双语站点。
---

[`pgsty/oink.pgsty.com`](https://github.com/pgsty/oink.pgsty.com)
是 OINK 的双语示例兼回归站点。它有意比一个最小消费站点更完整——把它当参考，然后删掉产品用不到的部分。

适合这条路径的情况：你想要一个开箱即用的双语结构，不介意先删再改。想从零精确控制每一项，走[创建站点](../create-site/)。

## 克隆并构建 {#clone-and-build}

```sh
git clone https://github.com/pgsty/oink.pgsty.com.git product-docs
cd product-docs
hugo --gc --minify
```

已提交的 `go.mod` 固定了 `github.com/pgsty/oink`
的公开版本，所以克隆下来就能构建。

如果你同时要改主题，把主题克隆为同级目录，用[安装页记录的 workspace 命令](../install/#develop-against-a-local-checkout)。

## 站点检查需要 Node {#site-checks-need-node}

> [!IMPORTANT] 这一点容易误解：**使用 OINK 构建站点不需要 Node.js**。只有维护这个示例仓库、运行格式化/链接/翻译/回归检查时才需要：
>
> ```sh
> npm ci
> npm test
> ```
>
> 你自己的产品文档站不需要继承这套工具链。

## 替换示例身份 {#replace-the-example-identity}

编辑 `hugo.yml`，替换这些字段：

{{< fields >}} {{% field name="title / languages.<lang>.title" type="string" %}}
站点名称，各语言分别设置。 {{% /field %}}
{{% field name="baseURL" type="string" %}} 换成你自己的生产地址。 {{% /field %}}
{{% field name="params.github_repo" type="string" %}}
指向你自己的内容仓库，否则「编辑此页」会指向 OINK 的仓库。 {{% /field %}}
{{% field name="params.copyright" type="string | map" %}} bottom
bar 中兼容 Docsy 的作者与年份范围。 {{% /field %}}
{{% field name="params.footer_center_info" type="string" %}} bottom
bar 中间可选的行内 Markdown。 {{% /field %}}
{{% field name="params.logo / params.wordmark" type="string" %}}
品牌素材。同时替换 `static/` 下的 favicon。 {{% /field %}}
{{% field name="services.googleAnalytics.id" type="string" %}}
**删掉**，除非你确实要用分析统计。 {{% /field %}}
{{% field name="params.comments" type="map" %}}
giscus 配置指向 OINK 的仓库，务必替换或整段删除。 {{% /field %}} {{< /fields >}}

## 替换示例内容 {#replace-the-example-content}

`content/` 下这些目录是 OINK 自己的内容，删掉：

{{< filetree >}} {{< filetree/folder name="content" open=true >}}
{{< filetree/folder name="docs" >}}{{< /filetree/folder >}}
{{< filetree/folder name="blog" >}}{{< /filetree/folder >}}
{{< filetree/folder name="project" >}}{{< /filetree/folder >}}
{{< filetree/folder name="tests" >}}{{< /filetree/folder >}}
{{< /filetree/folder >}} {{< /filetree >}}

`project/` 是 OINK 的项目自述，`tests/` 是回归测试页——两者对你的产品都没有意义。

`docs/` 和 `blog/` 保留目录结构和 `_index` 页，把正文换成你自己的。

## 配置搜索 {#configure-search}

项目站点默认开启本地搜索：

```yaml {filename="hugo.yml"}
params:
  offlineSearch: true
  offlineSearchIndex: summary
  offlineSearchMaxResults: 10
```

`offlineSearchIndex` 有两个取值：

| 取值      | 索引内容         | 适用                               |
| --------- | ---------------- | ---------------------------------- |
| `summary` | 标题、描述、摘要 | **推荐**，索引体积可控             |
| `content` | 全部正文         | 小站点；千页级站点会产生数 MB 索引 |

## 纳入版本控制 {#put-it-in-version-control}

清理干净后重建仓库历史——你的产品文档不应该背着 OINK 的提交记录：

```sh
rm -rf .git
git init
git add .
git commit -m "Initial documentation site"
```

同时确认 `.gitignore` 里有 `public/`、`resources/` 和 `go.work`。

## 下一步 {#next-steps}

- [基础配置](../configuration/)：逐项核对配置
- [部署](/zh/docs/deploy/)：选一个托管目标
