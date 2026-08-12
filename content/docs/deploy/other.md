---
downstream_modified: true
title: Other hosts
linkTitle: Other hosts
description: Deploying your OINK site on Netlify with Hugo alone.
weight: 30
aliases: [/docs/deployment/netlify/]
---

[Netlify][] can build a site from GitHub, GitLab, or Bitbucket and publish a
preview for each pull request. An OINK consumer build runs Hugo Extended
directly; it does not install Node.js packages or invoke PostCSS.

## Configure the site

Push the complete source to your Git provider, import the repository in Netlify,
and use these build settings:

| Setting           | Value                                        |
| ----------------- | -------------------------------------------- |
| Build command     | `hugo --gc --minify`                         |
| Publish directory | `public`                                     |
| `HUGO_VERSION`    | `0.164.0` or another theme-validated version |

If Netlify detects package manifests that exist only for theme-maintainer
tooling, disable automatic dependency installation for the site. They are not
part of the consumer build contract.

For a theme installed as a Git submodule, enable recursive submodule checkout.
For a Hugo module, Netlify also needs the normal Git and Go access required to
download the pinned module on a clean build. A complete offline distribution
uses the site-owned `themes/oink/` directory and avoids that first-build
download.

## Keep configuration in the repository

The same settings can be committed as `netlify.toml`:

```toml {filename="netlify.toml"}
[build]
command = "hugo --gc --minify"
publish = "public"

[build.environment]
HUGO_VERSION = "0.164.0"
```

Keep production and deploy-preview contexts on the same Hugo version unless a
preview is intentionally testing an upgrade. If preview builds need their
generated URL as the base URL, add Netlify's deploy URL to the Hugo command for
that context.

To prevent a non-production deployment from being indexed, use a non-production
Hugo environment as described in [Build environments and indexing][].

After saving the settings, trigger a deploy and inspect the build log. A normal
consumer build should show one Hugo command and no npm, PostCSS, Autoprefixer,
CDN download, or build-time remote-resource step.

[Build environments and indexing]: /docs/deploy/#build-environments
[Netlify]: https://www.netlify.com/

## Amazon S3 and CloudFront {#amazon-s3-and-cloudfront}

There are several options for publishing your web site using
[Amazon Web Services](https://aws.amazon.com). This section describes the most
basic option, deploying your site using an S3 bucket and activating the
CloudFront CDN (content delivery network) to speed up the delivery of your
deployed contents.

1. After your
   [registration](https://portal.aws.amazon.com/billing/signup#/start) at AWS,
   create your S3 bucket, connect it with your domain, and add it to the
   CloudFront CDN. This
   [blog post](https://www.noorix.com.au/blog/how-to/hosting-static-website-with-aws-s3-cloudfront/)
   has all the details and provides easy to follow step-by-step instructions for
   the whole procedure.
1. Download and install the latest version 2 of the AWS
   [Command Line Interface](https://docs.aws.amazon.com/cli/latest/userguide/get-started-install.html)
   (CLI). Then configure your CLI instance by issuing the command
   `aws configure` (make sure you have your AWS Access Key ID and your AWS
   Secret Access Key at hand):

   ```console
   $ aws configure
   AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
   AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
   Default region name [None]: eu-central-1
   Default output format [None]:
   ```

1. Check the proper configuration of your AWS CLI by issuing the command
   `aws s3 ls`, this should output a list of your S3 bucket(s).

<!-- prettier-ignore-start -->

1. Inside your `hugo.toml`/`hugo.yaml`/`hugo.json`, add a `[deployment]` section
   like this one:

    {{< tabpane >}}
{{< tab header="Configuration file:" disabled=true />}}
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

1. Run the command `hugo --gc --minify` to render the site's assets into the
   `public/` directory of your Hugo build environment.
1. Use Hugo's built-in `deploy` command to deploy the site to S3:

   ```console
   hugo deploy
   Deploying to target "aws" (www.your-domain.tld)
   Identified 77 file(s) to upload, totaling 5.3 MB, and 0 file(s) to delete.
   Success!
   Invalidating CloudFront CDN...
   Success!
   ```

   As you can see, issuing the `hugo deploy` command automatically
   [invalidates](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Invalidation.html)
   your CloudFront CDN cache.

1. That's all you need to do! From now on, you can easily deploy to your S3
   bucket using Hugo's built-in `deploy` command!

For more information about the Hugo `deploy` command, including command line
options, see this [synopsis](https://gohugo.io/commands/hugo_deploy). In
particular, you may find the `--maxDeletes int` option or the `--force` option
(which forces upload of all files) useful.

> [!NOTE] Automated deployment with GitHub actions
>
> If the source of your site lives in a GitHub repository, you can use
> [GitHub Actions](https://docs.github.com/en/actions) to deploy the site to
> your S3 bucket as soon as you commit changes to your GitHub repo. Setup of
> this workflow is described in this
> [blog post](https://capgemini.github.io/development/Using-GitHub-Actions-and-Hugo-Deploy-to-Deploy-to-AWS/).

> [!NOTE] Handling aliases
>
> If you are using [aliases](https://gohugo.io/content-management/urls/#aliases)
> for URL management, you should have a look at this
> [blog post](https://blog.cavelab.dev/2021/10/hugo-aliases-to-s3-redirects/).
> It explains how to turn aliases into proper `301` redirects when using Amazon
> S3.

If S3 does not meet your needs, consider AWS
[Amplify Console](https://aws.amazon.com/amplify/console/). This is a more
advanced continuous deployment (CD) platform with built-in support for the Hugo
static site generator. A
[starter](https://gohugo.io/hosting-and-deployment/hosting-on-aws-amplify/) can
be found in Hugo's official docs.
