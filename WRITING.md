# Writing the OINK docs

This file sets the bar for every page under `content/docs/` except the Design
section, which follows its own contract template. `TRANSLATION.md` covers
Chinese terminology and typography; this file covers what to say and how.

## Two readers

1. **A person** deciding whether OINK is worth adopting, then building a site
   with it. They skim, and they judge the project by whether the first screen
   answers their question.
2. **An agent** doing the same work for someone. It reads every word, follows
   instructions literally, and copies examples verbatim.

Both need the same thing: what a feature is for, the smallest thing that
works, then exact facts. Padding hurts both. The person stops reading; the
agent treats every sentence as an instruction it must satisfy.

## Page shape

Open with the reader's problem, not with the page. The first paragraph says
what the feature lets the reader do and when they would want it, in one to
three sentences. The shortest working example follows immediately. Never open
with "This page covers…" or "This section explains…".

Order the rest by how often readers need it: the common case, then
variations, then the reference table, then rare pitfalls.

| Genre | Shape |
| --- | --- |
| Section index (`_index.md`) | One paragraph on what this part of the site is for, then one task → page map. Do not list the same links twice. |
| Tutorial (Get started) | Numbered steps, each ending in something the reader can see. |
| Guide (Authoring, Customization, Operations) | Problem → working configuration → the choices and what each one changes → reference. |
| Component | When to use it and when not to → shortest source and result → variations → parameter table. Mention print, Markdown or RSS output only when it would surprise the reader. |
| Reference (Configuration, Page parameters) | Grouped tables with a one-sentence lead each. No essays. |

## Sentences

- **Give the reason.** Put the instruction and its reason or consequence in
  one sentence: "Add `fetch-depth: 0` to the checkout step; with a shallow
  clone every page shows the same last-modified date."
- **Write connected prose.** Join sentences that belong together with
  *because*, *so*, *unless*, *when*. A paragraph of five-word sentences reads
  like a machine translation.
- Address the reader as *you*. Use the active voice and the present tense.
- Use examples from a plausible project, such as an installation guide for a
  database, not `foo`/`bar` and not trivia about the theme itself.
- Cut page narration ("the table below shows", "you do not need to read every
  row"), sentences that restate the heading, closing summaries that repeat the
  section, and filler such as *simply*, *note that*, *it is important to*.

## Say it once

Each fact has one home. Other pages link to it instead of restating it.

| Fact | Home |
| --- | --- |
| Toolchain requirements (Git, Go, Hugo) | Get started |
| Requirements of older releases (Hugo Extended for 1.5.1 and older, retired hooks) | Upgrade |
| How invalid values behave (warn, fall back, keep building) | Configuration, once |
| Version history ("since 1.4.0", "changed in 1.2.0") | Upgrade and the release notes |
| CI flags, `baseURL`, host settings | Deploy |

Current pages describe current behavior. A short "Upgrading from 1.5?" link is
fine; a paragraph about how an older release behaved is not.

## Stay on the reader's side

Document what a reader can see, set, or do. Leave out how the theme is built
and tested (template internals, "the templates contain no `errorf`", the
regression harness, goldens, the maintainers' CI policy) unless the reader has
to act on it. That material belongs in Design.

A "do not" or "never" earns its place only when a reader would plausibly do
the thing and it would hurt them, and it always carries the reason. One per
topic is enough.

Callouts are for the thing that hurts when missed: data loss, a broken
deployment, a silent misconfiguration. Two per page is a lot.

## For agents

- Every snippet is complete enough to paste: the file name in `title`, the
  parent keys included.
- Name things exactly: the full key path (`params.ui.sidebar_width_min`), the
  file path, the default, the allowed values.
- Show the one recommended way first. Alternatives follow, each saying when to
  choose it.
- Give every `##` and `###` heading a stable English ID: `## Deploy {#deploy}`.
  Other pages, the agent skill, and the theme's warnings link to them.

## Chinese pages

Write the `.zh.md` page as native Chinese technical prose that carries the
same facts, examples and headings, not a sentence-by-sentence translation.
Heading count, order and IDs match the English page.

## Before you commit

- Does the first paragraph tell the reader why they would need this?
- Is any fact repeated from another page instead of linked?
- Does any sentence only describe the page itself?
- Does every "do not" give its reason?
- Do the English and Chinese headings line up, and do the site checks pass?
