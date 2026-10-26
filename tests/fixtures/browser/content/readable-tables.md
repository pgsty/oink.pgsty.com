---
title: Table layout policy
type: docs
outputs: [HTML, Markdown, print]
---

## Ordinary prose

| Owner | Project | State | When | Notes |
| --- | --- | --- | --- | --- |
| Alice handles planning and coordination | Tokyo release | Ready for review | After final review and approval | A short explanation of the current delivery status. |
| Bob handles design and delivery | Osaka patch | Waiting on tests | Before the next release window | Another short explanation of the expected next step. |
{#ordinary-prose-table}

## Explicit technical width

| Variable | Required | Default | Configuration key | Description |
| --- | --- | --- | --- | --- |
| `HG_PD_GRPC_HOST` | Yes | None | `grpc.host` | Advertised gRPC hostname/IP; use container hostnames within a container network. |
| `HG_PD_INITIAL_STORE_COUNT` | No | `1` | `pd.initial-store-count` | Minimum Store count needed for cluster availability. |
| `HG_PD_ACTUATOR_EXPOSURE` | No | `health,metrics,prometheus` | `management.endpoints.web.exposure.include` | Public Actuator endpoint allowlist; `*` is forbidden. |
{#wide-technical-table .wide}

## Three-column configuration identifiers

| config option | default value | description |
| --- | --- | --- |
| rocksdb.data_path | `rocksdb-data/data` | RocksDB data directory; must not be empty. |
| rocksdb.data_disks | `[]` | Assign separate disks using STORE/TABLE: /path/disk. Supported keys include g/vertex, g/edge_out, g/edge_in, g/vertex_label_index, g/edge_label_index, g/range_int_index, g/range_float_index, g/range_long_index, g/range_double_index, g/secondary_index, g/search_index, g/shard_index, g/unique_index, and g/olap. Do not reuse rocksdb.data_path. |
{#configuration-keys-table .wide}

## Short ordinary table

| City | Port | Purpose |
| --- | --- | --- |
| Tokyo | 8080 | Graph API |
| Osaka | 8686 | Metadata |
{#short-prose-table}

## Explicit width with existing modifiers

| Component | Read | Write |
| --- | --- | --- |
| A long component identifier | Yes | No |
{#wide-matrix-table .matrix .full-width .wide caption="Existing modifiers remain independent"}

## Legacy width compatibility

| Variable | Required | Default | Configuration key | Description |
| --- | --- | --- | --- | --- |
| `HG_PD_GRPC_HOST` | Yes | None | `grpc.host` | Advertised gRPC hostname/IP; use container hostnames within a container network. |
| `HG_PD_INITIAL_STORE_COUNT` | No | `1` | `pd.initial-store-count` | Minimum Store count needed for cluster availability. |
| `HG_PD_ACTUATOR_EXPOSURE` | No | `health,metrics,prometheus` | `management.endpoints.web.exposure.include` | Public Actuator endpoint allowlist; `*` is forbidden. |
{#legacy-technical-table .td-table--wide}
