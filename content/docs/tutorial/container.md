---
title: Container preview
linkTitle: Container preview
weight: 60
description:
  Run previews and production builds in a container instead of installing Hugo
  locally.
---

Containers are not required — OINK only asks for Hugo Extended. They suit a team
that wants a pinned toolchain, or that would rather not install Hugo on every
workstation.

## Build the image {#build-the-image}

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

> [!IMPORTANT] The image installs Go. **This is not optional when the site
> imports the theme as a Hugo Module** — Hugo needs Go to resolve and download
> modules. Sites using the offline archive, a submodule, or a clone can drop Go
> and get a much smaller image.

Building the image downloads Hugo and Go. In a network-isolated environment,
mirror the base image and both packages beforehand, or combine OINK's complete
offline archive with an internally approved image.

## Preview {#preview}

Mount the complete site source:

```sh
docker run --rm -it \
  -p 1313:1313 \
  -v "$PWD:/src" \
  oink-hugo
```

Open <http://localhost:1313/>. Edits on the host are picked up by Hugo's live
reload inside the container.

With the module method, mount the Go module cache too so each start does not
re-download:

```sh
docker run --rm -it \
  -p 1313:1313 \
  -v "$PWD:/src" \
  -v "$HOME/go/pkg/mod:/root/go/pkg/mod" \
  oink-hugo
```

## Production build {#production-build}

Override the default server command:

```sh
docker run --rm \
  -v "$PWD:/src" \
  oink-hugo --gc --minify
```

Output is written to `public/` inside the mounted directory.

> [!WARNING] Processes in the container run as root by default, so the generated
> `public/` is owned by root and the host user cannot delete it. Map the user ID
> in shared environments:
>
> ```sh
> docker run --rm --user "$(id -u):$(id -g)" -v "$PWD:/src" oink-hugo --gc --minify
> ```

This image needs no Node.js, npm, or PostCSS, and should contain no step that
fetches remote browser assets.

## Next steps {#next-steps}

- [Troubleshooting](../troubleshooting/): diagnosing failures inside a container
- [Deployment](/docs/deploy/): publish the output
