---
downstream_modified: true
title: Run OINK in a container
weight: 3
date: 2018-07-30
description: Build and preview an OINK site with a Hugo Extended container.
---

A container is optional: OINK itself only needs Hugo Extended. Use a container
when the team wants a pinned tool image or does not install Hugo on developer
workstations.

## Create the Hugo image

The following `Dockerfile` installs the currently validated Hugo Extended
version from its release package. Keep the version aligned with the theme's
support matrix.

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

Build it from the site root:

```sh
docker build -t oink-hugo .
```

The image build downloads Hugo. For an air-gapped environment, mirror the base
image and Hugo package in advance or use OINK's complete offline distribution
with an approved internal image.

## Preview the site

Mount the complete site source, including its adjacent or vendored theme:

```sh
docker run --rm -it \
  -p 1313:1313 \
  -v "$PWD:/src" \
  oink-hugo
```

Open <http://localhost:1313/>. Changes on the host are visible to Hugo's live
reload process inside the container.

## Run a production build

Override the default server command:

```sh
docker run --rm \
  -v "$PWD:/src" \
  oink-hugo --gc --minify
```

The generated site is written to `public/` in the mounted source directory.
Ensure the container user can write there; in a shared environment, run with a
mapped user ID or fix ownership according to local policy.

No Node.js, npm, PostCSS, or remote browser asset step belongs in this image.
