---
downstream_modified: true
title: Deployment on Netlify
linkTitle: Netlify
description: Deploying your OINK site on Netlify with Hugo alone.
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
uses the adjacent `theme/` directory and avoids that first-build download.

## Keep configuration in the repository

The same settings can be committed as `netlify.toml`:

```toml
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

[Build environments and indexing]:
  /docs/deployment/#build-environments-and-indexing
[Netlify]: https://www.netlify.com/
