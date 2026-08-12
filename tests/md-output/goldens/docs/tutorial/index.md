# Get started

> Build a bilingual OINK documentation site from scratch and deploy it.

---

LLMS index: [llms.txt](/llms.txt)

---

OINK is a Hugo theme that ships its browser runtimes with the theme. A consuming
site needs **only Hugo Extended**: no Node.js, no PostCSS, no CDN, and no remote
theme asset download during the build.

## What this chapter covers {#what-this-chapter-covers}

Read these seven pages in order and you will have a deployable bilingual
documentation site:

- `Prerequisites` — `5 min`

  <p>Install Hugo
  Extended and confirm the binary reports <code>extended</code>. Git and Go are needed
  depending on how you obtain the theme.</p>

- `Install OINK` — `5 min`

  <p>Pin a version with Hugo Modules.
  The other three distribution methods — offline archive, submodule, clone — are
  on the same page.</p>

- `Create a site` — `15 min`

  <p>From an empty directory to a
  previewable page, including how bilingual content is organized.</p>

- `Basic configuration` — `20 min`

  <p>Site identity, languages,
  search, repository links, and production build flags.</p>

- `Project site` — `optional`

  <p>Adapt <code>oink.pgsty.com</code>
  directly as a template, which suits an open-source project that wants a
  documentation site quickly.</p>

- `Container preview` — `optional`

  <p>Run previews and
  production builds in a container instead of installing Hugo locally.</p>

- `Troubleshooting` — `reference`

  <p>How to
  locate build, language, search, and platform problems.</p>

## Three starting points {#three-starting-points}

| Your situation      | Suggested path                                                                        |
| ------------------- | ------------------------------------------------------------------------------------- |
| New project         | [Prerequisites](prerequisites/) → [Install](install/) → [Create a site](create-site/) |
| Existing Hugo site  | Go straight to [Install](install/) and import OINK as a module                        |
| Existing Docsy site | See [Migrate from Docsy](/docs/upgrade/from-docsy/); prose does not need rewriting    |

## Shortest path {#shortest-path}

With Hugo Extended, Git, and Go already installed, three commands get you
running:

```sh
hugo mod init github.com/example/product-docs
hugo mod get github.com/pgsty/oink@v0.3.0
hugo server
```

Add the module import to `hugo.yaml`:

```yaml {filename="hugo.yaml"}
module:
  imports:
    - path: github.com/pgsty/oink
```

Every supported installation method uses the same preview and production
commands:

```sh
hugo server --disableFastRender   # local preview
hugo --gc --minify                # production build
```

## Next steps {#next-steps}

Once the site runs, continue as needed:

- [Site configuration](/docs/configure/): navigation menus, languages, versions
- [Components](/docs/components/): code blocks, Fields, FileTree, and the rest
- [Deployment](/docs/deploy/): Cloudflare Pages, GitHub Pages, and other hosts

---

Section pages:

- [Prerequisites](/docs/tutorial/prerequisites/): Install Hugo Extended, plus Git and Go when your method needs them.
- [Install OINK](/docs/tutorial/install/): Pin an OINK version with Hugo Modules, or choose the offline archive, submodule, or clone alternatives.
- [Create a site](/docs/tutorial/create-site/): From an empty directory to a first previewable bilingual page.
- [Basic configuration](/docs/tutorial/configuration/): Site identity, languages, search, repository links, and production build flags.
- [Start from the project site](/docs/tutorial/project-site/): Adapt oink.pgsty.com as a template to get a fully configured bilingual site quickly.
- [Container preview](/docs/tutorial/container/): Run previews and production builds in a container instead of installing Hugo locally.
- [Troubleshooting](/docs/tutorial/troubleshooting/): Locating build, language, search, upgrade, and platform problems.
