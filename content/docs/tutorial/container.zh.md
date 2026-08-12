---
title: 容器化预览
linkTitle: 容器预览
weight: 60
description: 不在本机装 Hugo，用容器跑预览和生产构建。
---

容器不是必需的——OINK 只要求 Hugo
Extended。适合用容器的情况：团队要固定工具链版本，或者不想在每台开发机上装 Hugo。

## 构建镜像 {#build-the-image}

```dockerfile {filename="Dockerfile" collapse=16}
FROM debian:bookworm-slim

ARG HUGO_VERSION=0.164.0
ARG GO_VERSION=1.25.5
ARG TARGETARCH

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl git \
    && curl -L -o /tmp/hugo.deb \
      "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-${TARGETARCH}.deb" \
    && apt-get install -y /tmp/hugo.deb \
    && curl -L -o /tmp/go.tgz \
      "https://go.dev/dl/go${GO_VERSION}.linux-${TARGETARCH}.tar.gz" \
    && tar -C /usr/local -xzf /tmp/go.tgz \
    && rm -rf /var/lib/apt/lists/* /tmp/hugo.deb /tmp/go.tgz

ENV PATH="/usr/local/go/bin:${PATH}"
WORKDIR /src
EXPOSE 1313
ENTRYPOINT ["hugo"]
CMD ["server", "--bind", "0.0.0.0", "--disableFastRender"]
```

```sh
docker build -t oink-hugo .
```

> [!IMPORTANT] 镜像里装了 Go。**如果站点用 Hugo
> Module 方式引入主题，这一步不能省**——Hugo 需要 Go 才能解析和下载模块。用离线归档、submodule 或克隆方式的站点可以去掉 Go，镜像会小很多。

镜像构建过程需要下载 Hugo 和 Go。网络隔离环境请预先镜像基础镜像和这两个软件包，或者把 OINK 完整离线归档与内部批准的镜像组合使用。

## 预览 {#preview}

挂载完整站点源码：

```sh
docker run --rm -it \
  -p 1313:1313 \
  -v "$PWD:/src" \
  oink-hugo
```

打开
<http://localhost:1313/>。宿主机上的文件改动会被容器里的 Hugo 实时重载检测到。

用模块方式时，建议把 Go 的模块缓存也挂进去，避免每次启动重新下载：

```sh
docker run --rm -it \
  -p 1313:1313 \
  -v "$PWD:/src" \
  -v "$HOME/go/pkg/mod:/root/go/pkg/mod" \
  oink-hugo
```

## 生产构建 {#production-build}

覆盖默认的 server 命令：

```sh
docker run --rm \
  -v "$PWD:/src" \
  oink-hugo --gc --minify
```

产物写入挂载目录下的 `public/`。

> [!WARNING] 容器内的进程默认以 root 运行，生成的 `public/`
> 会属于 root，宿主机上删不掉。共享环境里应映射用户 ID：
>
> ```sh
> docker run --rm --user "$(id -u):$(id -g)" -v "$PWD:/src" oink-hugo --gc --minify
> ```

这个镜像不需要 Node.js、npm 或 PostCSS，也不应该包含任何拉取远程浏览器资源的步骤。

## 下一步 {#next-steps}

- [故障排查](../troubleshooting/)：容器内构建失败的定位方法
- [部署](/zh/docs/deploy/)：把产物发布出去
