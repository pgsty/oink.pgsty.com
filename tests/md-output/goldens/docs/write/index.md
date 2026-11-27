# Authoring

> Write documentation pages, blog posts, books, image albums, release pages and API references, and arrange them into a sidebar.

---

LLMS index: [llms.txt](/llms.txt)

---

Everything a reader sees comes from Markdown files under `content/`, and this
section shows how to write them: a documentation page, the folder tree that
becomes the sidebar, and the content types that bring their own layout, such
as blog posts, books, image albums, release pages and API references. They all
share one Markdown dialect and one set of front matter keys, so what you learn
in [Writing pages](/docs/write/pages/) carries over to every other type.

## Find it by task {#map}

| I want to… | Read |
| --- | --- |
| Write a documentation page: front matter, heading anchors, links, images, drafts | [Writing pages](/docs/write/pages/) |
| Add callouts, tabs, steps, cards or field tables with plain Markdown | [OINK's Markdown extensions](/docs/write/pages/#extensions) |
| Shape the tree and the sidebar: `_index.md`, `weight`, icons, folding, several sidebar roots | [Organizing content](/docs/write/organize/) |
| Look up what a front matter key does | [Page parameters](/docs/write/frontmatter/) |
| Publish a blog post or a release announcement, with RSS | [Blog posts](/docs/write/blog/) |
| Publish a book: chapter numbers, figures and tables, cross-references, whole-book print | [Books](/docs/write/book/) |
| Publish an image album: folder structure, metadata, layouts, the image viewer | [Expo albums](/docs/write/expo/) |
| Build a release and download page: version cards, asset tables, checksums | [Releases and downloads](/docs/write/releases/) |
| Publish an OpenAPI reference | [API reference pages](/docs/write/openapi/) |
| Write in two languages: paired files, aligned anchors, untranslated pages | [Languages](/docs/customize/i18n/) |
| Look up a component's syntax and parameters | [Components](/docs/components/) |

---

Section pages:

- [Writing pages](/docs/write/pages/): Create a documentation page, from where the file goes and the front matter it needs to stable anchors, links, images, drafts and the controls the theme adds at the end.
- [Organizing content](/docs/write/organize/): Arrange folders and `_index.md` files into the sidebar you want, then control order, section indexes, icons, folding, hidden pages and where documentation lives.
- [Page parameters](/docs/write/frontmatter/): Look up every front matter key OINK reads, with its type, default and effect, to change one page or a whole section.
- [Blog posts](/docs/write/blog/): Write blog posts with dates, bylines, series and featured images, then choose how the blog index, RSS feed and share bar present them.
- [Books](/docs/write/book/): Turn a directory tree into a book with `type: book`: chapter numbering, numbered figures and tables, cross-references, generated indexes and whole-book print.
- [Image albums with Expo](/docs/write/expo/): Create an image album, add optional metadata, select a layout, and use the image viewer.
- [Releases and downloads](/docs/write/releases/): Publish a release page with a GitHub release card, a checksummed asset table and install instructions, all built from facts kept in your repository.
- [API reference pages](/docs/write/openapi/): Render an OpenAPI specification as a browsable API reference with the bundled Swagger UI or Redoc, without a CDN.

---

Backlinks:

- [Cards](/docs/components/cards/)
- [Presentation](/docs/components/presentation/)
- [Customization](/docs/customize/)
