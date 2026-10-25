---
title: Local PlantUML regression
comments: false
outputs: [HTML, Print, Markdown]
---

## Source fidelity

```plantuml
@startuml
Alice -> Bob: 中文 <tag> & "quotes"
@enduml
```

## Graphviz layout

```plantuml
@startuml
class Publication
class Subscription
Publication "1" --> "0..*" Subscription : 中文
@enduml
```

## Invalid syntax

```plantuml
@startuml
this is not a valid PlantUML diagram ?!?!
@enduml
```

## Missing standard library

```plantuml
@startuml
!include <C4/C4_Context>
Person(reader, "Reader")
@enduml
```

## Missing theme

```plantuml
@startuml
!theme plain
Alice -> Bob
@enduml
```

## Remote include

```plantuml
@startuml
!includeurl https://remote.invalid/private.puml
Alice -> Bob
@enduml
```

## Local include

```plantuml
@startuml
!include private.puml
Alice -> Bob
@enduml
```

## Valid diagram after errors

```plantuml
Alice -> Bob: Still works
```
