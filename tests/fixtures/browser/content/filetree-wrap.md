---
title: FileTree wrapping regression
type: docs
outputs: [HTML, Markdown, print]
---

```filetree {title="default" data-case="default"}
- runbooks/
  - a-deliberately-long-runbook-filename-for-a-failover-drill.md # Complete recovery procedure: verify the previous leader, inspect replication progress, transaction logs and archive integrity, and only then promote the standby.
  - identifier.txt # abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789
  - archive/ {open=false}
    - recovery.md # Complete recovery procedure: verify the previous leader, inspect replication progress, transaction logs and archive integrity, and only then promote the standby.
```

```filetree {title="false" data-case="false" wrap=false}
- runbooks/
  - a-deliberately-long-runbook-filename-for-a-failover-drill.md # Complete recovery procedure: verify the previous leader, inspect replication progress, transaction logs and archive integrity, and only then promote the standby.
  - identifier.txt # abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789
  - archive/ {open=false}
    - recovery.md # Complete recovery procedure: verify the previous leader, inspect replication progress, transaction logs and archive integrity, and only then promote the standby.
```

```filetree {title="true" data-case="true" wrap=true}
- runbooks/
  - a-deliberately-long-runbook-filename-for-a-failover-drill.md # Complete recovery procedure: verify the previous leader, inspect replication progress, transaction logs and archive integrity, and only then promote the standby.
  - identifier.txt # abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789
  - archive/ {open=false}
    - recovery.md # Complete recovery procedure: verify the previous leader, inspect replication progress, transaction logs and archive integrity, and only then promote the standby.
```

```filetree {title="No comments" data-case="plain" wrap=true}
- plain/
  - README.md
```

```filetree {tab="Compact" group="filetree" value="compact"}
- compact/
  - README.md # Short note
```
```filetree {tab="Wrapped" value="wrapped" wrap=true data-case="tabbed"}
- wrapped/
  - README.md # Complete recovery procedure: verify the previous leader, inspect replication progress, transaction logs and archive integrity, and only then promote the standby.
```
