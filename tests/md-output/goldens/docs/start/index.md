# Get started

> Start from the official OINK Starter, establish a working local baseline, then customize content, language, brand, integrations, and deployment in that order.

---

LLMS index: [llms.txt](/llms.txt)

---

The recommended path for a new site starts from
[`pgsty/oink-starter`](https://github.com/pgsty/oink-starter), not from a copy
of this documentation and regression repository. The Starter is a public
GitHub template: it pins OINK v0.8.1, builds as-is, and contains
only neutral project content and deployment workflows.

> [!IMPORTANT] Two version numbers have different jobs
> OINK's declared compatibility floor is Hugo Extended
> 0.160.1. The current Starter and its CI use Hugo Extended
> 0.165.0 and Go 1.27. Use that pinned Starter toolchain for the path below; use
> the lower floor only when maintaining an existing site that deliberately
> supports it.

## Choose a path {#choose}

| Starting point | Recommended path | Result |
| --- | --- | --- |
| New documentation or project site | [OINK Starter](/docs/start/starter/) | A small three-language Docs, Blog, and Book site with two deployment workflows |
| Existing Hugo site | [From scratch](/docs/start/from-scratch/) | Add the OINK module and required Goldmark settings without replacing content |
| Existing Docsy or older OINK site | [Upgrade](/docs/admin/upgrade/) | Preserve content, migrate supported syntax, and review site overrides |

## Five-minute baseline {#baseline}

1. ### Install the tools {#tools}

   Install Git, Go 1.27 or newer, and Hugo Extended 0.165.0 or newer. The Hugo
   output must contain `extended`:

   ```console
   $ go version
   go version go1.27.0 darwin/arm64
   $ hugo version
   hugo v0.165.0+extended+withdeploy darwin/arm64
   ```

   On macOS, `brew install git go hugo` supplies them. On Linux and Windows,
   use the official [Hugo installation guide](https://gohugo.io/installation/)
   and [Go downloads](https://go.dev/dl/); choose Hugo **Extended**.

1. ### Create or clone the site {#clone}

   For a repository you intend to keep, open the Starter and select
   **Use this template**, then clone the repository GitHub created for you.
   To evaluate the untouched original locally:

   ```bash
   git clone https://github.com/pgsty/oink-starter.git my-docs
   cd my-docs
   hugo server
   ```

1. ### Open the baseline {#open}

   Open <http://localhost:1313/>. The default Starter also publishes Chinese at
   `/zh/` and French at `/fr/`. Confirm that Docs, Blog, Book, search, language
   switching, and light/dark mode all work before editing anything.

1. ### Make one visible change {#first-change}

   Change the title and canonical URL at the top of `hugo.yaml`, then edit one
   sentence in `data/home/en.yaml`. A browser reload that shows both changes is
   the first useful proof that configuration, content, and the pinned theme are
   connected correctly.
{.steps}

## Customize from shallow to deep {#learning-path}

- [Use OINK Starter](/docs/start/starter/) — identity first, then languages,
  home page, content, navigation, brand, integrations, and deployment.
- [Starter repository tour](/docs/start/anatomy/) — which file owns each part
  of the site, what to replace, and what can be removed.
- [Writing pages](/docs/write/pages/) — front matter, headings, links, images,
  drafts, and the page-end controls.
- [Components](/docs/components/) — add expression only after the content tree
  is stable.
- [Brand and appearance](/docs/customize/brand/) — logo, accent, typography,
  width, and CSS extension points.
- [Deploy](/docs/admin/deploy/) — use the supplied GitHub Pages or Cloudflare
  Pages workflow, then verify the real public routes.
{.cards}

This order is deliberate. A site that first proves its build and content tree
is easier to debug than one that changes languages, navigation, CSS, analytics,
and hosting at the same time.

## Publication gate {#publication-gate}

Before the first push, run the same warning-strict production build the Starter
workflows use:

```bash
hugo --cleanDestinationDir --gc --minify --environment production \
  --printPathWarnings --panicOnWarning
```

Success means the command ends with `Total in …`, prints no warning or error,
and `public/` contains the language roots and representative Docs, Blog, and
Book routes. It does not yet prove deployment: a local build, a commit, a push,
a green workflow, and correct public rendering are separate gates.

## Next {#next}

Start with the [complete Starter tutorial](/docs/start/starter/). If the
template deliberately carries more structure than your project needs, use the
[repository tour](/docs/start/anatomy/) to remove it safely. Use
[From scratch](/docs/start/from-scratch/) only when adding OINK to an existing
site or when you explicitly want to assemble every file yourself.

---

Section pages:

- [Use OINK Starter](/docs/start/starter/): Turn the official starter into your project site, one controlled layer at a time — identity, languages, home page, content, navigation, brand, integrations, and deployment.
- [Starter repository tour](/docs/start/anatomy/): A file-level map of oink-starter — what owns identity, languages, home, content, navigation, brand, deployment, and the pinned theme.
- [From scratch and other install methods](/docs/start/from-scratch/): Build a minimal OINK site in an empty directory, and weigh the four install methods — Module, submodule, offline archive, pinned clone.

---

Backlinks:

- [Docs](/docs/)
- [Introduction](/docs/about/)
- [Highlights](/docs/about/features/)
- [Cases](/docs/about/showcase/)
- [Cards](/docs/components/cards/)
- [Brand and appearance](/docs/customize/brand/)
- [From scratch](/docs/start/from-scratch/)
- [Writing pages](/docs/write/pages/)
