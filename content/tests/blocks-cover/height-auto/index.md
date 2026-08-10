---
title: Height auto with td-below-navbar
linkTitle: Height auto
type: home
layout: home
description: A local-first Hugo theme for engineering documentation
---

{{% blocks/cover
  title="Welcome to OINK!"
  height="auto td-below-navbar"
%}}

<!-- prettier-ignore -->
{{% param description %}}
{.display-6}

<!-- prettier-ignore -->
<div class="td-cta-buttons my-5">
  <a {{% _param btn-lg primary %}}
    href='{{% siteGetPage "/docs/tutorial" RelPermalink %}}'>
    Get started
  </a>
  <a {{% _param btn-lg secondary %}}
    href="/docs/about/examples/">
    Explore examples
  </a>
</div>

{{% blocks/link-down color="info" %}}

{{% /blocks/cover %}}

{{% blocks/lead color="white" %}}

OINK is a local-first theme for the [Hugo][] static site generator. It combines
a focused documentation shell with multilingual search, rich content components,
and a Hugo-only consumer build.

[Hugo]: https://gohugo.io/

{{% /blocks/lead %}}

{{% blocks/section color="primary" type="row" %}}

{{% blocks/feature icon="fa-lightbulb" title="See OINK in action!" url="/docs/about/examples/" %}}

Compare the complete bilingual project site with the minimal theme example.

{{% /blocks/feature %}}

{{% blocks/feature icon="fa-brands fa-github" title="Contributions welcome!" url="https://github.com/pgsty/oink" %}}

OINK uses a [pull request](https://github.com/pgsty/oink/pulls) workflow on
**GitHub**. Theme and documentation changes have separate repository boundaries.

{{% /blocks/feature %}}

{{% blocks/feature icon="fa-solid fa-tag" title="Read release notes" url="/blog/release/" %}}

Review upgrade requirements, compatibility contracts, and verified scope for
each OINK release.

{{% /blocks/feature %}}

{{% /blocks/section %}}
