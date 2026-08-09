---
title: 使用 Amazon S3 和 CloudFront 部署
linkTitle: Amazon S3
description: 使用 Amazon S3 和 Amazon CloudFront 部署 Docsy 站点。
cSpell:ignore: exampleid
---

通过 [Amazon Web Services](https://aws.amazon.com)
发布网站有多种方案。本节介绍最基础的一种：把站点部署到 S3 存储桶，并启用 CloudFront
CDN（内容分发网络）来加速已部署内容的传输。

1. 完成 AWS
   [注册](https://portal.aws.amazon.com/billing/signup#/start)后，创建 S3 存储桶，将其关联到你的域名，再加入 CloudFront
   CDN。可以参考这篇[博客文章](https://www.noorix.com.au/blog/how-to/hosting-static-website-with-aws-s3-cloudfront/)，其中包含完整流程和易于操作的分步说明。
1. 下载并安装最新版 AWS
   [命令行界面](https://docs.aws.amazon.com/cli/latest/userguide/get-started-install.html)（CLI）v2。随后运行
   `aws configure` 配置 CLI 实例（请提前准备 AWS Access Key ID 和 AWS Secret
   Access Key）：

   ```console
   $ aws configure
   AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
   AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
   Default region name [None]: eu-central-1
   Default output format [None]:
   ```

1. 运行 `aws s3 ls` 检查 AWS CLI 配置是否正确；命令应输出你的 S3 存储桶列表。

<!-- prettier-ignore-start -->

1. 在 `hugo.toml`、`hugo.yaml` 或 `hugo.json` 中添加如下 `[deployment]` 分区：

    {{< tabpane >}}
{{< tab header="配置文件：" disabled=true />}}
{{< tab header="hugo.toml" lang="toml" >}}
[deployment]
[[deployment.targets]]
name = "aws"
URL = "s3://www.your-domain.tld"
cloudFrontDistributionID = "E9RZ8T1EXAMPLEID"
{{< /tab >}}
{{< tab header="hugo.yaml" lang="yaml" >}}
deployment:
  targets:
    - name: aws
      URL: 's3://www.your-domain.tld'
      cloudFrontDistributionID: E9RZ8T1EXAMPLEID
{{< /tab >}}
{{< tab header="hugo.json" lang="json" >}}
{
  "deployment": {
    "targets": [
      {
        "name": "aws",
        "URL": "s3://www.your-domain.tld",
        "cloudFrontDistributionID": "E9RZ8T1EXAMPLEID"
      }
    ]
  }
}
{{< /tab >}}
    {{< /tabpane >}}

<!-- prettier-ignore-end -->

1. 运行 `hugo --gc --minify`，将站点资源渲染到 Hugo 构建环境的 `public/` 目录。
1. 使用 Hugo 内置的 `deploy` 命令把站点部署到 S3：

   ```console
   hugo deploy
   Deploying to target "aws" (www.your-domain.tld)
   Identified 77 file(s) to upload, totaling 5.3 MB, and 0 file(s) to delete.
   Success!
   Invalidating CloudFront CDN...
   Success!
   ```

   如输出所示，执行 `hugo deploy`
   会自动[使 CloudFront CDN 缓存失效](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Invalidation.html)。

1. 至此全部完成。今后只需使用 Hugo 内置的 `deploy`
   命令，即可轻松部署到 S3 存储桶。

有关 Hugo `deploy`
命令及其命令行参数的更多信息，请参阅[命令概览](https://gohugo.io/commands/hugo_deploy)。其中，`--maxDeletes int`
和强制上传所有文件的 `--force` 参数可能会很有用。

> [!NOTE] 使用 GitHub Actions 自动部署
>
> 如果站点源码位于 GitHub 仓库，可以使用
> [GitHub Actions](https://docs.github.com/en/actions)，在每次向仓库提交变更后自动把站点部署到 S3。这篇[博客文章](https://capgemini.github.io/development/Using-GitHub-Actions-and-Hugo-Deploy-to-Deploy-to-AWS/)介绍了工作流的配置方法。

> [!NOTE] 处理别名
>
> 如果使用[别名](https://gohugo.io/content-management/urls/#aliases)管理 URL，建议阅读这篇[博客文章](https://blog.cavelab.dev/2021/10/hugo-aliases-to-s3-redirects/)。它介绍了在 Amazon
> S3 上把别名转换为正确 `301` 重定向的方法。

如果 S3 无法满足需求，可以考虑 AWS
[Amplify Console](https://aws.amazon.com/amplify/console/)。这是更高级的持续部署（CD）平台，内置对 Hugo 静态站点生成器的支持。Hugo 官方文档提供了相应的[入门指南](https://gohugo.io/hosting-and-deployment/hosting-on-aws-amplify/)。
