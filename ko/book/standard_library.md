---
prev:
  text: (그렇게) 고급은 아님
  link: /book/advanced.md
---
# 표준 라이브러리 (미리보기)

누셸은 네이티브 Nu로 작성된 유용한 명령의 표준 라이브러리와 함께 제공됩니다. 기본적으로 표준 라이브러리는 누셸이 시작될 때 메모리에 로드되지만(자동으로 가져오지는 않음)

[[toc]]

## 개요

표준 라이브러리에는 현재 다음이 포함됩니다.

- 어설션
- 완성 기능을 지원하는 대체 `help` 시스템.
- 추가 JSON 변형 형식
- XML 액세스
- 로깅
- 그리고 더

표준 라이브러리에서 사용할 수 있는 명령의 전체 목록을 보려면 다음을 실행하십시오.

```nu
nu -c "
  use std
  scope commands
  | where name =~ '^std '
  | select name description extra_description
  | wrap 'Standard Library Commands'
  | table -e
"
```

::: note
위의 `use std` 명령은 전체 표준 라이브러리를 로드하여 모든 명령을 한 번에 볼 수 있도록 합니다. 이것은 일반적으로 사용되는 방식이 아닙니다(자세한 내용은 아래 참조). 또한 사용 중인 셸의 범위에 로드되지 않도록 별도의 Nu 하위 셸에서 실행됩니다.
:::

## 표준 라이브러리 가져오기

표준 라이브러리 모듈 및 하위 모듈은 다른 모듈과 마찬가지로 [`use`](/commands/docs/use.md) 명령으로 가져옵니다. 자세한 내용은 [모듈 사용](./modules/using_modules.md)을 참조하십시오.

명령줄에서 작업하는 동안 다음을 사용하여 전체 표준 라이브러리를 로드하는 것이 편리할 수 있습니다.

```nu
use std *
```

그러나 이 형식은 로드 시간이 가장 길기 때문에 사용자 지정 명령 및 스크립트에서는 피해야 합니다.

::: important 표준 라이브러리 사용 시 최적의 시작
구성이 전체 표준 라이브러리를 로드하지 않도록 하는 방법에 대한 [아래 참고 사항](#optimal-startup)을 참조하십시오.
:::

### 하위 모듈 가져오기

표준 라이브러리의 각 하위 모듈은 별도로 로드할 수 있습니다. 다시 말하지만, _최상의 성능을 위해 코드에 필요한 하위 모듈만 로드하십시오._

모듈 사용에 대한 일반적인 정보는 [모듈 가져오기](./modules/using_modules.md#importing-modules)를 참조하십시오. 각 표준 라이브러리 하위 모듈에 권장되는 가져오기는 다음과 같습니다.

#### 1. `<command> <subcommand>` 형식을 사용하는 하위 모듈

이러한 하위 모듈은 일반적으로 `use std/<submodule>`(glob/`*` 없음)으로 가져옵니다.

- `use std/assert`: `assert` 및 해당 하위 명령
- `use std/bench`: 벤치마킹 명령 `bench`
- `use std/dirs`: 디렉터리 스택 명령 `dirs` 및 해당 하위 명령
- `use std/input`: `input display` 명령
- `use std/help`: 완성 및 기타 기능을 지원하는 `help` 명령의 대체 버전
- `use std/iters`: 추가 `iters` 접두사가 붙은 반복 명령.
- `use std/log`: `log <subcommands>`(예: `log warning <msg>`)
- `use std/math`: `$math.E`와 같은 수학 상수. 아래 양식 #2에서와 같이 정의로 가져올 수도 있습니다.

#### 2. 모듈의 _정의_(내용) 직접 가져오기

일부 하위 모듈은 해당 정의(명령, 별칭, 상수 등)가 현재 범위에 로드될 때 사용하기 더 쉽습니다. 예시:

```nu
use std/formats *
ls | to jsonl
```

일반적으로 `use std/<submodule> *`(**with** glob/`*`)으로 가져오는 하위 모듈:

- `use std/dt *`: `date` 값으로 작업하기 위한 추가 명령
- `use std/formats *`: 추가 `to` 및 `from` 형식 변환
- `use std/math *`: `$E`와 같이 접두사가 없는 수학 상수. 위 양식 #1의 접두사 형식이 코드를 읽고 유지 관리할 때 더 이해하기 쉬울 수 있습니다.
- `use std/xml *`: XML 데이터로 작업하기 위한 추가 명령

#### 3. `use std <submodule>`

공백으로 구분된 형식을 사용하여 표준 라이브러리 하위 모듈을 가져올 _수_ 있습니다.

```nu
use std log
use std formats *
```

::: important
[모듈 사용](./modules/using_modules.md#module-definitions)에서 언급했듯이 이 형식(`use std *`와 같이)은 먼저 _전체_ 표준 라이브러리를 범위로 로드한 다음 하위 모듈을 가져옵니다. 반대로 위 #1 및 #2의 슬래시로 구분된 버전은 하위 모듈만 가져오므로 훨씬 빠릅니다.
:::

## 표준 라이브러리 후보 모듈

[누셸 저장소](https://github.com/nushell/nushell/tree/main/crates/nu-std/std-rfc)에 있는 `std-rfc`는 가능한 표준 라이브러리 추가를 위한 준비 단계 역할을 합니다.

표준 라이브러리에 추가하는 데 관심이 있는 경우 해당 저장소의 `std-rfc` 모듈에 PR을 통해 코드를 제출하십시오. 또한 이 모듈을 설치하고 예정된 후보 명령에 대한 피드백을 제공하는 것이 좋습니다.

::: details 자세한 내용

표준 라이브러리의 후보 명령은 일반적으로 다음을 수행해야 합니다.

- 광범위한 매력 - 많은 사용자 또는 사용 사례에 유용해야 합니다.
- 향후 유지 관리자를 위해 잘 작성되고 명확하게 주석 처리되어야 합니다.
- 예제 사용법이 포함된 도움말 주석을 구현해야 합니다.
- 명령이 표준 라이브러리의 일부여야 한다고 생각하는 이유를 설명하는 설명이 있어야 합니다. 이것을 사람들이 명령을 시도하고 피드백을 제공하여 나중에 승격될 수 있도록 설득하는 일종의 "광고"로 생각하십시오.

명령이 RFC에서 표준 라이브러리로 승격되려면 다음을 충족해야 합니다.

- 긍정적인 피드백
- 미해결 문제가 거의 없거나 없음(물론 심각한 문제는 없음)
- `std` 제출에 대한 PR 작성자. 이것이 반드시 명령의 원래 작성자일 필요는 없습니다.
- `std` 제출 PR의 일부로 테스트 사례

궁극적으로 핵심 팀의 구성원이 이러한 기준에 따라 명령을 `std`에 병합할지 여부와 시기를 결정합니다.

물론 `std-rfc`의 후보 명령이 더 이상 작동하지 않거나 문제가 너무 많으면 `std-rfc`에서 제거되거나 비활성화될 수 있습니다.

:::

## 표준 라이브러리 비활성화

표준 라이브러리를 비활성화하려면 다음을 사용하여 누셸을 시작할 수 있습니다.

```nu
nu --no-std-lib
```

이것은 `nu -c`를 사용하여 하위 셸에서 명령을 실행할 때 오버헤드를 최소화하는 데 특히 유용할 수 있습니다. 예시:

```nu
nu --no-std-lib -n -c "$nu.startup-time"
# => 1ms 125µs 10ns

nu -n -c "$nu.startup-time"
# => 4ms 889µs 576ns
```

이 방법으로 비활성화하면 라이브러리, 하위 모듈 또는 해당 명령을 가져올 수 없습니다.

## 모듈에서 `std/log` 사용

::: warning 중요!
`std/log`는 환경 변수를 내보냅니다. 자신의 모듈에서 `std/log` 모듈을 사용하려면 "모듈 만들기" 장의 [이 주의 사항](./modules/creating_modules.md#export-env-runs-only-when-the-use-call-is-evaluated)을 참조하십시오.

:::

## 최적의 시작

누셸의 시작 시간이 워크플로에 중요한 경우 `config.nu`, `env.nu` 및 잠재적으로 다른 곳에서 [시작 구성]([./configuration.md])을 검토하여 표준 라이브러리의 비효율적인 사용을 확인하십시오. 다음 명령은 문제 영역을 식별해야 합니다.

```nu
view files
| enumerate | flatten
| where filename !~ '^std'
| where filename !~ '^entry'
| where {|file|
    (view span $file.start $file.end) =~ 'use\W+std[^\/]'
  }
```

위의 [하위 모듈 가져오기](#importing-submodules) 섹션에서 권장하는 구문을 사용하도록 해당 파일을 편집하십시오.

::: note
누셸 라이브러리(예: [`nu_scripts` 저장소](https://github.com/nushell/nu_scripts)), 예제 또는 문서에서 이 구문을 사용하는 경우 문제 또는 PR을 통해 보고하십시오. 이들은 누셸 0.99.0이 출시된 후 시간이 지남에 따라 업데이트될 것입니다.

타사 모듈에서 이 구문을 사용하는 경우 작성자/유지 관리자에게 업데이트하도록 보고하십시오.
:::
