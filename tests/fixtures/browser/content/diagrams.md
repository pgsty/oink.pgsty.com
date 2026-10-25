---
title: Diagram reader regression
comments: false
outputs: [HTML, Print, Markdown]
---

This long introduction keeps every diagram beyond the initial viewport.

<div style="min-height: 1800px" aria-hidden="true"></div>

## Mermaid source

```mermaid
sequenceDiagram
Alice->>Bob: 中文 <tag> & "quotes"
```

<div style="min-height: 900px" aria-hidden="true"></div>

## PlantUML source

```plantuml
@startuml
Alice -> Bob: 中文 <tag> & "quotes"
@enduml
```

## Wide Mermaid

```mermaid
flowchart LR
 A[Author writes Markdown] --> B[Hugo renders content] --> C[Select local runtime] --> D[Wait until near viewport] --> E[Initialize shared engine] --> F[Render one diagram] --> G[Discard obsolete result] --> H[Display diagram] --> I[Open viewer] --> J[Pan and zoom] --> K[View original source] --> L[Download SVG]
```

## Wide PlantUML

```plantuml
@startuml
Alice -> Bob: first service
Bob -> Charlie: second service
Charlie -> David: third service
David -> Eve: fourth service
Eve -> Frank: fifth service
Frank -> Grace: sixth service
Grace -> Heidi: seventh service
Heidi -> Ivan: eighth service
Ivan -> Judy: ninth service
Judy -> Mallory: tenth service
@enduml
```

## Hidden tabs

{{< tabs >}}
{{< tab label="Overview" >}}
Select the second tab to render its diagrams.
{{< /tab >}}
{{< tab label="Hidden diagrams" >}}
```mermaid
flowchart LR
 Hidden --> Visible
```

```plantuml
Alice -> Bob: Revealed tab
```
{{< /tab >}}
{{< /tabs >}}

## Closed disclosure

<details data-diagram-fold><summary>More diagrams</summary>

```mermaid
flowchart LR
 Folded --> Open
```

```plantuml
Alice -> Bob: Revealed disclosure
```

</details>

## Zero-width container

<div id="diagram-zero" style="width:0;overflow:hidden">

```mermaid
flowchart LR
 Zero --> Measured
```

```plantuml
Alice -> Bob: Restored width
```

</div>

## Errors and recovery

```mermaid
not a valid diagram ?!?!
```

```plantuml
@startuml
!includeurl https://remote.invalid/unavailable.puml
Alice -> Bob
@enduml
```

```mermaid
flowchart LR
 Failure --> Recovery
```

```plantuml
Alice -> Bob: Still works
```
