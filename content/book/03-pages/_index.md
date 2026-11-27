---
title: Write a page and give it a place
linkTitle: Pages
description: Set up the sample site, write a page with three front matter keys and stable headings, and let the content tree place it in the sidebar, the pager and a second language.
book_kind: chapter
book_number: 3
weight: 30
aliases:
  - /book/02-structure/
---

Most of an OINK site is pages, and a page is a Markdown file whose path is its
address. You write no navigation: the directory tree becomes the sidebar, the
order of the files becomes the pager, and a file beside it with a `.zh.md`
suffix becomes the Chinese version. This chapter sets up the sample site and
adds one page to it.

## Set up the sample site {#setup}

1. Clone the Starter and start the preview:

   ```bash
   git clone https://github.com/pgsty/oink-starter.git acme-docs
   cd acme-docs
   hugo server
   ```

1. Name the site. The first two settings in `hugo.yaml` are marked
   `CHANGE ME`; the title is a YAML anchor that every language reuses:

   ```yaml {title="hugo.yaml"}
   title: &siteTitle Acme DB
   baseURL: https://docs.acme.example/
   ```

1. Open <http://localhost:1313/docs/>. The Starter's Docs section has four
   groups in the sidebar: Introduction, Get Started, Tutorial and Reference.
   The navbar now reads Acme DB.
{.steps}

## Write the page {#first-page}

Create the Quick start page inside Get Started, with this complete content:

`````markdown {title="content/docs/get-started/quick-start.md" num="3-1" caption="A complete documentation page: three front matter keys, a lead, three sections." #eg-quick-start}
---
title: Quick start
description: Start Acme DB on a laptop, write a data point and query it back in five minutes.
weight: 30
---

Start one Acme DB server, write a data point over HTTP and read it back with
SQL. You need only the `acme` binary from
[Installation](/docs/get-started/installation/).

## Start the server {#start}

```bash
acme server --data ./acme-data
```

The server listens on port 8086 and keeps its files in `./acme-data`.

## Write a data point {#write}

```bash
curl -X POST http://localhost:8086/write -d 'cpu,host=web1 usage=0.64'
```

## Query it {#query}

```bash
acme sql "SELECT host, usage FROM cpu ORDER BY time DESC LIMIT 1"
```
`````

Save it and look at the preview. Quick start appears in the sidebar under
Installation, the pager at the bottom of Installation now leads to it, and the
outline on the right lists its three sections.

Each front matter key has one job:

- `title` is the page heading, the browser tab and the search result title. Add `linkTitle` when the sidebar needs a shorter name.
- `description` is one sentence about what the reader can do with the page. It appears on section cards, in search results and on social cards, so it decides whether someone opens the page.
- `weight` orders the page among its siblings. The Starter's Requirements and Installation use 10 and 20, so 30 places Quick start after them, and steps of ten leave room for a page in between later.

Start the body with a sentence that says what the page achieves, not with a
heading. The theme renders `title` as the page's only `#` heading, so body
sections start at `##`.

## Headings that last {#headings}

Every heading in {{< xref eg="3-1" anchor="eg-quick-start" />}} carries an
explicit ID, such as `{#start}`. Without one, Hugo derives the ID from the
heading text, so rewording "Start the server" breaks every link to it, and the
Chinese heading would get a different ID from the English one. With the ID
written out, `/docs/get-started/quick-start/#start` keeps working through
rewrites and in both languages.

Link to other pages with their absolute site path, as the lead paragraph does
with `/docs/get-started/installation/`. The path names the published address,
survives moving the source file and is easy to find with a site-wide search.
Hugo does not check plain Markdown links, so when you move a page, add its old
path to `aliases` in its front matter and the old address keeps working:

```yaml {title="front matter of a moved page"}
aliases:
  - /docs/tutorial/first-query/
```

## Let the tree be the navigation {#tree}

A directory with an `_index.md` becomes a group in the sidebar, and its
`_index.md` is the group's own page. Add an Operations group with one page in
it:

```filetree {title="Files added in this step"}
- content/docs/
  - operations/
    - _index.md      # the group: title, description, weight 35, an icon
    - backup.md      # its first page
```

```markdown {title="content/docs/operations/_index.md"}
---
title: Operations
description: Back up, upgrade and monitor a running Acme DB server.
weight: 35
icon: fa-solid fa-screwdriver-wrench
---

Keep a production server healthy after the first install.
```

````markdown {title="content/docs/operations/backup.md"}
---
title: Back up a server
description: Take a consistent snapshot of a running server and restore it on another host.
weight: 10
---

Take snapshots while the server keeps accepting writes.

## Take a snapshot {#snapshot}

```bash
acme backup create --to /backups/acme-$(date +%F)
```
````

Weight 35 places the group after the Tutorial group (30) and before Reference
(40). Its icon
shows because the Starter sets `sidebar_icon_policy: groups`, which gives icons
to groups and keeps leaf pages plain. The group's page lists its children as
cards, because the Starter sets `section_index: cards`; the cards take their
text from each child's `description`, which is one more reason to write it well.

Two front matter keys move a page out of the way without deleting it.
`toc_hide: true` keeps a published page out of the sidebar and the pager, and
`draft: true` keeps it out of the build until it is ready; preview drafts with
`hugo server -D`.

## Add the Chinese peer {#translation}

The Starter already has Chinese and French, so a translation is one more file
beside the English one, with the same name and a language suffix:

`````markdown {title="content/docs/get-started/quick-start.zh.md"}
---
title: 快速上手
description: 在笔记本上启动 Acme DB，写入一个数据点并查询出来，五分钟完成。
weight: 30
---

启动一个 Acme DB 服务，通过 HTTP 写入一个数据点，再用 SQL 读出来。你只需要
[安装](/zh/docs/get-started/installation/)一节里的 `acme` 程序。

## 启动服务 {#start}

```bash
acme server --data ./acme-data
```

服务监听 8086 端口，数据文件保存在 `./acme-data`。

## 写入数据点 {#write}

```bash
curl -X POST http://localhost:8086/write -d 'cpu,host=web1 usage=0.64'
```

## 查询数据 {#query}

```bash
acme sql "SELECT host, usage FROM cpu ORDER BY time DESC LIMIT 1"
```
`````

The two files share the weight and every heading ID, and only the prose
changes; commands and code stay byte for byte the same. Open the English page
and switch to 简体中文 from the navbar: you land on `/zh/docs/get-started/quick-start/`,
and a link to `#write` lands on the same section in either language.
[Chapter 9](/book/09-navigation/) covers adding and removing languages.

## Check your work {#checkpoint}

With the preview open, you should see:

- Quick start in the sidebar after Installation, with the pager leading from one to the other;
- an Operations group with an icon between Tutorial and Reference, and a card for Back up a server on its page;
- the language switch on Quick start opening the Chinese page at the same section;
- `http://localhost:1313/docs/get-started/quick-start/index.md` returning the page as plain Markdown.

## Ask your agent {#agent}

```text {num="3-2" caption="Prompt: add a page to your own site." #eg-agent-pages}
Add a "Quick start" page to the Get started section of the docs, placed after
Installation by its weight. Front matter: title, a one-sentence description of
what the reader achieves, weight. Give every heading an explicit English ID.
Add the Chinese peer as quick-start.zh.md with the same weight and the same
heading IDs. Then open both in the browser and check the sidebar order, the
pager and the language switch.
```
