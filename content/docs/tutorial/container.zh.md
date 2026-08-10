---
title: 在容器中运行 OINK
weight: 60
icon: fa-solid fa-box
date: 2018-07-30
description: 使用 Hugo Extended 容器构建和预览 OINK 站点。
aliases: [/docs/get-started/quickstart-docker/]
---

容器并非必需：OINK 本身只需要 Hugo
Extended。如果团队希望固定工具镜像，或不想在开发者工作站上安装 Hugo，可以选择容器方式。

## 创建 Hugo 镜像 {#create-the-hugo-image}

下面的 `Dockerfile` 从发布包安装当前验证过的 Hugo
Extended 版本。请让该版本始终与主题支持矩阵保持一致。

```dockerfile
FROM debian:bookworm-slim

ARG HUGO_VERSION=0.164.0
ARG TARGETARCH

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl git \
    && curl -L -o /tmp/hugo.deb \
      "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-${TARGETARCH}.deb" \
    && apt-get install -y /tmp/hugo.deb \
    && rm -rf /var/lib/apt/lists/* /tmp/hugo.deb

WORKDIR /src
EXPOSE 1313
ENTRYPOINT ["hugo"]
CMD ["server", "--bind", "0.0.0.0", "--disableFastRender"]
```

在站点根目录构建镜像：

```sh
docker build -t oink-hugo .
```

镜像构建过程会下载 Hugo。在网络隔离环境中，请预先镜像基础镜像和 Hugo 软件包，或者将 OINK 完整离线发行包与获准使用的内部镜像组合使用。

## 预览站点 {#preview-the-site}

挂载完整站点源码，包括相邻存放或随站点提供的主题：

```sh
docker run --rm -it \
  -p 1313:1313 \
  -v "$PWD:/src" \
  oink-hugo
```

打开
<http://localhost:1313/>。宿主机上的变更会被容器中的 Hugo 实时重载进程检测到。

## 执行生产构建 {#run-a-production-build}

覆盖默认的 server 命令：

```sh
docker run --rm \
  -v "$PWD:/src" \
  oink-hugo --gc --minify
```

生成的站点会写入挂载源码目录中的
`public/`。请确保容器用户对该目录具有写权限；在共享环境中，应按本地策略映射用户 ID 或修正文件所有权。

这个镜像不需要 Node.js、npm、PostCSS，也不应包含远程浏览器资源步骤。
