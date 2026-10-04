---
title: Give the content a structure
linkTitle: Structure the content
description: Turn directories, section indexes, page bundles, and weights into one predictable reading and navigation order.
book_kind: chapter
book_number: 2
weight: 20
---

OINK does not keep a second navigation database for an ordinary site. The
content tree is the sidebar tree, and the same order drives the pager and the
Book contents. A reader should not encounter three different answers to “what
comes next?”

## Start from the reader's questions {#reader-questions}

Name the top-level sections after tasks or subjects the reader recognizes. A
small engineering site usually needs a start section, a reference, operations
guidance, and a record of change. Add a directory only when it gives several
pages a useful shared context.

Keep the Starter from Chapter 1, including its existing examples. In this
chapter, add one English page and its Chinese peer under the existing Docs
section. French can remain enabled; this exercise adds only the two peers below.

## Build the tree {#content-tree}

```filetree {title="Files used by this exercise; other Starter files stay in place"}
- content/
  - docs/
    - _index.md                         # existing section root
    - _index.zh.md                      # existing translated root
    - preview-check.md                  # add this page
    - preview-check.zh.md               # add its translation
```

Create these two files with the complete contents below. The section roots
already exist; do not replace them.

```markdown {title="content/docs/preview-check.md"}
---
title: Verify a local preview
description: Check that a documentation edit reaches the browser.
weight: 25
---

## Check the preview {#check-preview}

Open this page locally, change this sentence, and confirm the browser updates.
```

```markdown {title="content/docs/preview-check.zh.md"}
---
title: 验证本地预览
description: 确认文档修改已经显示在浏览器中。
weight: 25
---

## 检查预览 {#check-preview}

在本地打开本页，修改这句话，再确认浏览器已显示新内容。
```

A translation sits beside its English source with the `.zh.md` suffix. These
pages have no images or downloads, so individual Markdown files are enough;
use a page bundle when a page owns those resources.

## Keep order explicit {#ordering}

The existing sections use spaced weights. The new page uses `25` so it can
fit between neighbors without renumbering them. Keep the same weight on both
translations. For a new tree, multiples of ten leave similar room to grow:

| Item | Weight | Why it comes here |
| --- | ---: | --- |
| Get started | 10 | Establish the working baseline |
| Write content | 20 | Build on a running site |
| Customize | 30 | Change presentation after structure |
| Operate | 40 | Validate and publish the result |
{#tbl-reading-order num="2-1" caption="One explicit order is reused by navigation, paging, and generated contents."}

## Make stable addresses {#stable-addresses}

Write an explicit ID on every heading another page may cite. The English and
Chinese pages use the same ID even though their visible headings differ. This
keeps links, the table of contents, and whole-book print aligned across both
languages.

With `hugo server` running, open `/docs/preview-check/` and
`/zh/docs/preview-check/`. Both should appear in their Docs sidebar, and the
language switch should open the matching peer. The heading in both pages
should have `#check-preview`. Keep these files for Chapter 3.

For the complete rules, see [Writing pages](/docs/write/pages/) and
[Organizing content](/docs/write/organize/).
