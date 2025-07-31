# 메타데이터

Nu를 사용하면서 무대 뒤에서 뭔가 추가적인 일이 일어나고 있다고 느낀 적이 있을 것입니다. 예를 들어, Nu가 지원하는 파일을 열려고 시도했지만 잊어버리고 다시 변환하려고 시도했다고 가정해 보겠습니다.

```nu
open Cargo.toml | from toml
# => error: Expected a string from pipeline
# => - shell:1:18
# => 1 | open Cargo.toml | from toml
# =>   |                   ^^^^^^^^^ requires string input
# => - shell:1:5
# => 1 | open Cargo.toml | from toml
# =>   |      ---------- object originates from here
```

오류 메시지는 [`from toml`](/commands/docs/from_toml.md)에 전달한 것이 문자열이 아니라는 것뿐만 아니라 값이 원래 어디에서 왔는지도 알려줍니다. 어떻게 알 수 있을까요?

Nu의 파이프라인을 통해 흐르는 값에는 종종 추가 정보 또는 메타데이터 집합이 첨부됩니다. 이는 상점의 항목에 있는 태그와 같은 태그로 알려져 있습니다. 이러한 태그는 데이터에 영향을 미치지 않지만 Nu에게 해당 데이터로 작업하는 경험을 개선할 수 있는 방법을 제공합니다.

[`open`](/commands/docs/open.md) 명령을 다시 실행해 보겠습니다. 이번에는 반환되는 태그를 살펴보겠습니다.

```nu
metadata (open Cargo.toml)
# => ╭──────┬───────────────────╮
# => │ span │ {record 2 fields} │
# => ╰──────┴───────────────────╯
```

현재는 값이 어디에서 왔는지에 대한 범위만 추적합니다. 자세히 살펴보겠습니다.

```nu
metadata (open Cargo.toml) | get span
# => ╭───────┬────────╮
# => │ start │ 212970 │
# => │ end   │ 212987 │
# => ╰───────┴────────╯
```

여기서 "start"와 "end" 범위는 줄에서 밑줄이 쳐질 위치를 나타냅니다. 5를 세고 15까지 세면 "Cargo.toml" 파일 이름과 일치하는 것을 볼 수 있습니다. 이것이 이전에 본 오류가 무엇을 밑줄 쳐야 하는지 알았던 방법입니다.
