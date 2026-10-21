---
title: 文件树换行回归
type: docs
outputs: [HTML, Markdown, print]
---

```filetree {title="default" data-case="default"}
- runbooks/
  - a-deliberately-long-runbook-filename-for-a-failover-drill.md # 完整恢复流程：先确认原主节点状态，再检查复制进度、事务日志和归档完整性，最后才将备用节点提升为新的主节点。
  - identifier.txt # abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789
  - archive/ {open=false}
    - recovery.md # 完整恢复流程：先确认原主节点状态，再检查复制进度、事务日志和归档完整性，最后才将备用节点提升为新的主节点。
```

```filetree {title="false" data-case="false" wrap=false}
- runbooks/
  - a-deliberately-long-runbook-filename-for-a-failover-drill.md # 完整恢复流程：先确认原主节点状态，再检查复制进度、事务日志和归档完整性，最后才将备用节点提升为新的主节点。
  - identifier.txt # abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789
  - archive/ {open=false}
    - recovery.md # 完整恢复流程：先确认原主节点状态，再检查复制进度、事务日志和归档完整性，最后才将备用节点提升为新的主节点。
```

```filetree {title="true" data-case="true" wrap=true}
- runbooks/
  - a-deliberately-long-runbook-filename-for-a-failover-drill.md # 完整恢复流程：先确认原主节点状态，再检查复制进度、事务日志和归档完整性，最后才将备用节点提升为新的主节点。
  - identifier.txt # abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789
  - archive/ {open=false}
    - recovery.md # 完整恢复流程：先确认原主节点状态，再检查复制进度、事务日志和归档完整性，最后才将备用节点提升为新的主节点。
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
  - README.md # 完整恢复流程：先确认原主节点状态，再检查复制进度、事务日志和归档完整性，最后才将备用节点提升为新的主节点。
```
