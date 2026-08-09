---
title: Logo 与图片
description: 在项目中添加和自定义 Logo、图标与图片。
cSpell:ignore: lookandfeel imgproc
---

## 添加 Logo {#add-your-logo}

默认情况下，OINK 会在顶部导航栏起始位置（即最左侧）显示站点 Logo。把项目的 SVG
Logo 放在 `assets/icons/logo.svg`，即可覆盖主题中的默认 Logo。

如果不希望顶部导航栏显示 Logo，请在项目配置中把站点参数 `navbar_logo` 设为
`false`：

<!-- markdownlint-disable no-shortcut-ref-link -->
<!-- prettier-ignore-start -->
{{< tabpane >}}
{{< tab header="配置文件：" disabled=true />}}
{{< tab header="hugo.toml" lang="toml" >}}
[params.ui]
navbar_logo = false
{{< /tab >}}
{{< tab header="hugo.yaml" lang="yaml" >}}
params:
  ui:
    navbar_logo: false
{{< /tab >}}
{{< tab header="hugo.json" lang="json" >}}

{
  "params": {
    "ui": {
      "navbar_logo": false
    }
  }
}
{{< /tab >}}
{{< /tabpane >}}
<!-- prettier-ignore-end -->
<!-- markdownlint-enable no-shortcut-ref-link -->

Logo 样式的更多信息请参阅[设置项目 Logo 与名称的样式][]。

[设置项目 Logo 与名称的样式]:
  /zh/docs/content/lookandfeel/#styling-your-project-logo-and-name

## 使用图标 {#use-icons}

OINK 默认包含免费版 Font Awesome 图标，其中也包括 GitHub、Stack
Overflow 等站点的 Logo。可以在
[Font Awesome 文档](https://fontawesome.com/icons/)中查看全部可用图标、每个图标加入的 Font
Awesome 版本，以及它是否对免费版用户开放。OINK 随发行物内置已经固定版本的字体与图标；确切版本记录在
`theme/VENDOR.json` 和发布说明中。

你可以把 Font Awesome 图标添加到[顶部导航栏][]、[侧栏导航][]或正文中的任意位置。

## 添加 favicon {#add-your-favicons}

主题本身不提供 favicon 文件，但会**发现并链接**采用约定名称的图标。请[生成 favicon 文件](#generate-favicons)，然后放入项目的
`static`
目录，使其发布到站点根目录——浏览器会在那里探测这些文件。OINK 会按以下顺序，为找到的文件在每个页面的
`<head>` 中添加 `<link>` 元素：

| 文件                       | 链接                                                |
| -------------------------- | --------------------------------------------------- |
| `favicon.ico`              | `rel="icon"`[^ico-link]                             |
| `favicon.svg`              | `rel="icon"`，并带有 `type="image/svg+xml"`         |
| `favicon-NxN.png`          | `rel="icon"`，并带有 `type="image/png" sizes="NxN"` |
| `apple-touch-icon.png`     | `rel="apple-touch-icon"`（隐含尺寸为 180×180）      |
| `apple-touch-icon-NxN.png` | `rel="apple-touch-icon"`，并带有 `sizes="NxN"`      |

如果提供了上述任意方形尺寸变体，OINK 会按尺寸升序添加。

[^ico-link]:
    `.ico` 链接不声明
    `sizes`：文件本身会描述所含帧尺寸（浏览器会读取），在链接中声明尺寸只会带来与真实文件不一致的风险。同时提供
    `favicon.svg` 时，支持 SVG
    favicon 的浏览器（绝大多数现代浏览器）会优先使用它，`.ico` 则作为回退。

一个现代 `favicon.ico` 加上 SVG 和
`apple-touch-icon.png`，足以覆盖常见浏览器与平台的 favicon 需求。如需更多能力：

- 在 [hooks/head-end.html][] 中添加 Web App Manifest `<link>` 元素。
- 如果需要自定义 favicon 链接本身，请覆盖
  [layouts/_partials/favicons.html][]。务必使用 `relURL`，确保站点 `baseURL`
  包含子路径时链接仍然正确。

### 生成 favicon {#generate-favicons}

还没有 favicon？可以通过 [favicon.io](https://favicon.io) 或
[RealFaviconGenerator][] 等在线工具，从单张图片生成 favicon。

如果已经有源 SVG 并安装了 [ImageMagick][]，OINK 也保留 `gen-favicons`
辅助工具。把源 SVG 保存为
`static/favicon.svg`——主题会直接链接它——再在同一位置生成栅格图标。从站点项目根目录运行命令。

对于上游 Docsy npm 包安装：

```sh
npx --no-install gen-favicons static/favicon.svg static/
```

其他安装方式运行：

```sh
node OINK_THEME_DIR/scripts/gen-favicons/cli.mjs static/favicon.svg static/
```

将 _`OINK_THEME_DIR`_ 替换为实际主题目录。使用 Git submodule 时通常是
`themes/oink/theme`；本仓库中则是 `theme/`。运行带 `--help`
的命令可以查看尺寸与其他选项。

该辅助工具只用于一次性生成素材，并不是站点构建依赖。消费端生产构建仍然只运行 Hugo；也可以使用其他获准的图片工具生成同名文件。

## 添加图片 {#add-images}

### 落地页 {#landing-pages}

OINK 的
[`blocks/cover` 短代码](/zh/docs/content/shortcodes/#blocks-cover)可以方便地为落地页添加封面图（也称为 Hero 图片）。短代码会在落地页的[页面包](adding-content/#page-bundles)中查找文件名包含
`background` 的图片。

例如，示例站点的落地页 `content/en/_index.md` 使用同一目录下的图片
`content/en/featured-background.jpg`；可在 GitHub 上查看 [content/en][] 文件夹。

通过区块的 [`height`
参数][]设置封面容器及其图片的首选显示高度。要铺满视口高度，请使用 `full`，并配合
`td-below-navbar` 辅助类把封面放在顶部导航栏下方：

```go-html-template
{{%/* blocks/cover
  title="Welcome to OINK!"
  image_anchor="top"
  height="full td-below-navbar"
*/%}}
...
{{%/* /blocks/cover */%}}
```

要使用较矮的图片，可以选择 `min`、`med`、`max`，或表示图片自然高度的 `auto`：

```go-html-template
{{%/* blocks/cover
  title="About the OINK Example"
  image_anchor="bottom"
  height="min td-below-navbar"
*/%}}
...
{{%/* /blocks/cover */%}}
```

### 其他页面 {#other-pages}

要在其他页面中添加行内图片，可以使用
[`imgproc` 短代码](/zh/docs/content/shortcodes/#imgproc)。也可以直接使用普通 Markdown 或 HTML 图片，并将图片文件放入项目的
`static`
目录。该目录的更多信息请参阅[添加静态内容](/zh/docs/content/adding-content/#adding-static-content)。

<!-- prettier-ignore-start -->
[content/en]: https://github.com/google/docsy-example/tree/main/content/en
[`height` 参数]: shortcodes/#blocks
[hooks/head-end.html]: https://github.com/google/docsy/blob/main/theme/layouts/_partials/hooks/head-end.html
[ImageMagick]: https://imagemagick.org
[layouts/_partials/favicons.html]: https://github.com/google/docsy/blob/main/theme/layouts/_partials/favicons.html
[顶部导航栏]: /zh/docs/content/navigation/#adding-icons-to-the-navbar
[RealFaviconGenerator]: https://realfavicongenerator.net
[侧栏导航]: /zh/docs/content/navigation/#adding-icons-to-the-side-nav
<!-- prettier-ignore-end -->
