---
downstream_modified: true
title: Serving your site locally
linkTitle: Local
---

Depending on your deployment choice you may want to serve your site locally
during development to preview content changes. To serve your site locally:

1. Ensure you have an up to date local copy of your site files cloned from your
   repo.

1. Ensure Hugo Extended and any source-fetch tools required by your chosen
   installation method are installed, as described in [Prerequisites and
   installation][prereq]. Node.js and PostCSS are not site-build prerequisites.
1. Run the `hugo server` command in your site root. By default your site will be
   available at <http://localhost:1313>.

Now that you're serving your site locally, Hugo will watch for changes to the
content and automatically refresh your site. If you have more than one local git
branch, when you switch between git branches the local website reflects the
files in the current branch.

[prereq]: /docs/get-started/docsy-as-module/installation-prerequisites
