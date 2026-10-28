# Get started

> Start from the official OINK Starter. Verify the local site, then customize content, language, brand, integrations, and deployment in that order.

---

LLMS index: [llms.txt](/llms.txt)

---

For a new site, start from
[`pgsty/oink-starter`](https://github.com/pgsty/oink-starter), a public GitHub
template that pins a published OINK release, builds out of the box, and
includes neutral project content and deployment workflows without this repository's
regression test harness.

> [!IMPORTANT] Current Hugo baseline
> Maintained sites use Hugo Extended 0.168.0 (with its
> built-in LibSass) and Go 1.27.3. If you start from an older Starter snapshot,
> update its workflow pins to match. Do not enable `--panicOnWarning` or
> `HUGO_PANICONWARNING`; keep warnings visible and review them (the upstream
> LibSass deprecation warning is expected).

## Choose a path {#choose}

| Starting point | Path | Result |
| --- | --- | --- |
| New documentation or project site | [OINK Starter](/docs/start/starter/) | A small three-language Docs, Blog, and Book site with two deployment workflows |
| Existing Hugo site | [From scratch](/docs/start/from-scratch/) | Add the OINK module and required Goldmark settings without replacing content |
| Existing Docsy or older OINK site | [Upgrade](/docs/admin/upgrade/) | Preserve content, migrate supported syntax, and review site overrides |

## Five-minute baseline {#baseline}

1. ### Install the tools {#tools}

   Install Git, Go 1.27.3 or newer, and Hugo Extended 0.168.0 or newer. The Hugo
   output must contain `extended`:

   ```console
   $ go version
   go version go1.27.3 darwin/arm64
   $ hugo version
   hugo v0.168.0+extended+withdeploy darwin/arm64
   ```

   On macOS, `brew install git go hugo` supplies them. On Linux and Windows,
   use the official [Hugo installation guide](https://gohugo.io/installation/)
   and [Go downloads](https://go.dev/dl/). Choose Hugo **Extended**.

1. ### Create or clone the site {#clone}

   If you intend to keep the repository, open the Starter and select
   **Use this template**. Then clone the repository that GitHub creates.
   To evaluate the original without changes, use these commands:

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
   sentence in `data/home/en.yaml`. Reload the browser. If both changes appear, configuration, content, and the
   pinned theme are connected correctly.
{.steps}

## Customize from shallow to deep {#learning-path}

- [Use OINK Starter](/docs/start/starter/) — choose languages first, then identity,
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

Verify the build and content tree before customizing languages, navigation,
CSS, analytics, and hosting; changing one layer at a time makes failures easy
to isolate.

## Publication gate {#publication-gate}

Before your first push, run the same production build command used by the
Starter workflows:

```bash
hugo --cleanDestinationDir --gc --minify --environment production \
  --printPathWarnings
```

Confirm that the build exits cleanly with `Total in …` and that `public/`
contains the language roots along with representative Docs, Blog, and Book
routes. After pushing, check the CI workflow and the live URL as well.

## Next {#next}

Start with the [complete Starter tutorial](/docs/start/starter/). If the
template has more structure than your project needs, use the
[repository tour](/docs/start/anatomy/) to remove it safely. Use
[From scratch](/docs/start/from-scratch/) only when adding OINK to an existing
site or when you explicitly want to assemble every file yourself.

---

Section pages:

- [Use OINK Starter](/docs/start/starter/): Create your project site from the official Starter. Change one part at a time: languages, identity, home page, content, navigation, brand, integrations, and deployment.
- [Starter repository tour](/docs/start/anatomy/): Find the oink-starter files that control identity, languages, home, content, navigation, brand, deployment, and the pinned theme.
- [From scratch and other install methods](/docs/start/from-scratch/): Build a minimal OINK site in an empty directory. Compare four install methods: Module, submodule, offline archive, and pinned source copy.

---

Backlinks:

- [Docs](/docs/)
- [Introduction](/docs/about/)
- [Highlights](/docs/about/features/)
- [Cases](/docs/about/showcase/)
- [Cards](/docs/components/cards/)
- [Presentation](/docs/components/presentation/)
- [Brand and appearance](/docs/customize/brand/)
- [From scratch](/docs/start/from-scratch/)
- [Writing pages](/docs/write/pages/)
