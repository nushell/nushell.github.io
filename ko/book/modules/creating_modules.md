# 모듈 만들기

[[toc]]

::: important
아래 예제를 진행할 때 각 모듈 또는 명령의 업데이트된 버전을 가져오기 전에 새 셸을 시작하는 것이 좋습니다. 이렇게 하면 이전 가져오기의 정의로 인한 혼동을 줄이는 데 도움이 됩니다.
:::

## 개요

모듈(및 아래에서 다룰 하위 모듈)은 다음 두 가지 방법 중 하나로 만들어집니다.

- 가장 일반적으로 모듈에서 내보낼 정의의 `export` 문 시리즈가 있는 파일을 만들어 사용합니다.
- 모듈 내의 하위 모듈의 경우 `module` 명령을 사용합니다.

::: tip
`module` 명령을 사용하여 명령줄에서 직접 모듈을 만들 수 있지만, 재사용성을 위해 모듈 정의를 파일에 저장하는 것이 훨씬 더 유용하고 일반적입니다.
:::

모듈 파일은 다음 중 하나일 수 있습니다.

- `mod.nu`라는 파일, 이 경우 해당 _디렉터리_가 모듈 이름이 됩니다.
- 다른 `<module_name>.nu` 파일, 이 경우 파일 이름이 모듈 이름이 됩니다.

### 간단한 모듈 예제

다음 내용으로 `inc.nu`라는 파일을 만듭니다.

```nu
export def increment []: int -> int  {
    $in + 1
}
```

이것은 모듈입니다! 이제 가져와서 `increment` 명령을 사용할 수 있습니다.

```nu
use inc.nu *
5 | increment
# => 6
```

물론 다른 사람도 모듈을 사용할 수 있도록 이와 같은 파일을 쉽게 배포할 수 있습니다.

## 내보내기

위의 기본 모듈 개요에서 모듈에서 사용할 수 있는 정의 유형을 간략하게 다루었습니다. 이것이 최종 사용자에게는 충분한 설명일 수 있지만 모듈 작성자는 다음을 위해 내보내기 정의를 만드는 _방법_을 알아야 합니다.

- 명령 ([`export def`](/commands/docs/export_def.md))
- 별칭 ([`export alias`](/commands/docs/export_alias.md))
- 상수 ([`export const`](/commands/docs/export_const.md))
- 알려진 외부 명령 ([`export extern`](/commands/docs/export_extern.md))
- 하위 모듈 ([`export module`](/commands/docs/export_module.md))
- 다른 모듈에서 가져온 기호 ([`export use`](/commands/docs/export_use.md))
- 환경 설정 ([`export-env`](/commands/docs/export-env.md))

::: tip
`export`(또는 환경 변수의 경우 `export-env`)로 표시된 정의만 모듈을 가져올 때 액세스할 수 있습니다. `export`로 표시되지 않은 정의는 모듈 내부에서만 볼 수 있습니다. 일부 언어에서는 이를 "비공개" 또는 "로컬" 정의라고 합니다. 예는 아래 [추가 예제](#local-definitions)에서 찾을 수 있습니다.
:::

### `main` 내보내기

::: important
내보내기는 모듈 자체와 동일한 이름을 가질 수 없습니다.
:::

위의 [기본 예제](#basic-module-example)에서 `increment`라는 명령이 있는 `inc`라는 모듈이 있었습니다. 그러나 해당 파일의 이름을 `increment.nu`로 바꾸면 가져오기에 실패합니다.

```nu
mv inc.nu increment.nu
use increment.nu *
# => Error: nu::parser::named_as_module
# => ...
# => help: Module increment can't export command named
# => the same as the module. Either change the module
# => name, or export `main` command.
```

오류 메시지에서 친절하게 언급했듯이 내보내기 이름을 `main`으로 바꾸면 가져올 때 모듈 이름이 됩니다. `increment.nu` 파일을 편집합니다.

```nu
export def main []: int -> int {
    $in + 1
}
```

이제 예상대로 작동합니다.

```nu
use ./increment.nu
2024 | increment
# => 2025
```

::: note
`main`은 `export def` 및 `export extern` 정의 모두에 사용할 수 있습니다.
:::

::: tip
`main` 정의는 다음 경우에 가져옵니다.

- 전체 모듈을 `use <module>` 또는 `use <module.nu>`로 가져옵니다.
- `*` glob를 사용하여 모듈의 모든 정의를 가져옵니다(예: `use <module> *` 등).
- `main` 정의를 `use <module> main`, `use <module> [main]` 등으로 명시적으로 가져옵니다.

반대로 다음 형식은 `main` 정의를 가져오지 _않습니다_.

````nu
use <module> <other_definition>
# 또는
use <module> [ <other_definitions> ]
:::

::: note
또한 `main`은 내보내기 여부에 관계없이 스크립트 파일에서 사용될 때 특별한 동작을 합니다. 자세한 내용은 [스크립트](../scripts.html#parameterizing-scripts) 장을 참조하십시오.
:::

## 모듈 파일

위의 개요에서 간략하게 언급했듯이 모듈은 다음 중 하나로 만들 수 있습니다.

1. `<module_name>.nu`: "파일 형식" - 간단한 모듈에 유용합니다.
2. `<module_name>/mod.nu`: "디렉터리 형식" - 하위 모듈이 주 모듈의 하위 디렉터리로 쉽게 매핑될 수 있는 대규모 모듈 프로젝트를 구성하는 데 유용합니다.

위의 `increment.nu` 예제는 분명히 (1) 파일 형식의 예입니다. 디렉터리 형식으로 변환해 보겠습니다.

```nu
mkdir increment
mv increment.nu increment/mod.nu

use increment *
41 | increment
# => 42
````

가져온 모듈의 동작은 파일 형식을 사용하든 디렉터리 형식을 사용하든 관계없이 동일하며 경로만 변경됩니다.

::: note
기술적으로는 위 디렉터리 형식을 사용하거나 `use increment/mod.nu *`를 사용하여 명시적으로 가져올 수 있지만 `mod.nu`를 사용할 때는 디렉터리 약어가 선호됩니다.
:::

## 하위 명령

[사용자 지정 명령](../custom_commands.md)에서 다루었듯이 하위 명령을 사용하면 명령을 논리적으로 그룹화할 수 있습니다. 모듈을 사용하면 다음 두 가지 방법 중 하나로 이 작업을 수행할 수 있습니다.

1. 모든 사용자 지정 명령과 마찬가지로 명령을 `"<command> <subcommand>"`로 정의하고 따옴표 안에 공백을 사용할 수 있습니다. 위에서 정의한 `increment` 모듈에 `increment by` 하위 명령을 추가해 보겠습니다.

```nu
export def main []: int -> int {
    $in + 1
}

export def "increment by" [amount: int]: int -> int {
    $in + $amount
}
```

그런 다음 `use increment *`로 가져와 `increment` 명령과 `increment by` 하위 명령을 모두 로드할 수 있습니다.

2. 또는 전체 `increment` 모듈을 가져오면 동일한 명령이 생성되므로 하위 명령을 단순히 `by`라는 이름으로 정의할 수 있습니다.

```nu
export def main []: int -> int {
    $in + 1
}

export def by [amount: int]: int -> int {
    $in + $amount
}
```

이 모듈은 `use increment`(glob `*` 없음)를 사용하여 가져오며 동일한 `increment` 명령과 `increment by` 하위 명령을 생성합니다.

::: note
아래의 추가 예제에서는 이 버전을 계속 사용할 것이므로 가져오기 패턴이 아래에서 `use increment`( `use increment *` 대신)로 변경되었음을 확인하십시오.
:::

## 하위 모듈

하위 모듈은 다른 모듈에서 내보내는 모듈입니다. 모듈에 하위 모듈을 추가하는 방법에는 두 가지가 있습니다.

1. `export module` 사용: (a) 하위 모듈과 (b) 해당 정의를 하위 모듈의 멤버로 내보냅니다.
2. `export use` 사용: (a) 하위 모듈과 (b) 해당 정의를 부모 모듈의 멤버로 내보냅니다.

차이점을 설명하기 위해 `increment` 예제를 하위 모듈로 사용하여 새 `my-utils` 모듈을 만들어 보겠습니다. 또한 자체 하위 모듈에 새 `range-into-list` 명령을 만들겠습니다.

1. 새 `my-utils`용 디렉터리를 만들고 `increment.nu`를 그 안으로 이동합니다.

   ```nu
   mkdir my-utils
   # 필요에 따라 다음을 조정합니다.
   mv increment/mod.nu my-utils/increment.nu
   rm increment
   cd my-utils
   ```

2. `my-utils` 디렉터리에서 다음 내용으로 `range-into-list.nu` 파일을 만듭니다.

   ```nu
   export def main []: range -> list {
       # 이상하게 보일 수 있지만 다음은 단지
       # 범위를 목록으로 변환하는 간단한 방법입니다.
       each {||}
   }
   ```

3. 테스트합니다.

   ```nu
   use range-into-list.nu
   1..5 | range-into-list | describe
   # => list<int> (stream)
   ```

4. 이제 다음이 포함된 `my-utils` 디렉터리가 있어야 합니다.

   - `increment.nu` 모듈
   - `range-into-list.nu` 모듈

다음 예제는 하위 모듈이 있는 모듈을 만드는 방법을 보여줍니다.

### 예제: `export module`이 있는 하위 모듈

하위 모듈 정의의 가장 일반적인 형태는 `export module`입니다.

1. `my-utils`라는 새 모듈을 만듭니다. `my-utils` 디렉터리에 있으므로 `mod.nu`를 만들어 정의합니다. 이 `my-utils/mod.nu` 버전에는 다음이 포함됩니다.

   ```nu
   export module ./increment.nu
   export module ./range-into-list.nu
   ```

2. 이제 두 개의 하위 모듈이 있는 `my-utils` 모듈이 있습니다. 사용해 보십시오.

   ```nu
   # my-utils의 부모 디렉터리로 이동
   cd ..
   use my-utils *
   5 | increment by 4
   # => 9

   let file_indices = 0..2..<10 | range-into-list
   ls | select ...$file_indices
   # => 디렉터리의 첫 번째, 세 번째, 다섯 번째, 일곱 번째 및 아홉 번째 파일을 반환합니다.
   ```

다음 섹션으로 진행하기 전에 `scope modules`를 실행하고 `my-utils` 모듈을 찾으십시오. 자체 명령이 없고 두 개의 하위 모듈만 있다는 점에 유의하십시오.

### 예제: `export use`가 있는 하위 모듈

또는 다른 모듈에서 _정의_를 (다시) 내보낼 수 있습니다. 이것은 `increment` 및 `range-into-list`의 명령(및 다른 정의가 있는 경우)이 `my-utils` 모듈 자체의 _멤버_가 된다는 점에서 첫 번째 형태와 약간 다릅니다. `scope modules` 명령의 출력에서 차이점을 볼 수 있습니다.

`my-utils/mod.nu`를 다음으로 변경해 보겠습니다.

```nu
export use ./increment.nu
export use ./range-into-list.nu
```

위와 동일한 명령을 사용하여 사용해 보십시오.

```nu
# my-utils의 부모 디렉터리로 이동
cd ..
use my-utils *
5 | increment by 4
# => 9

let file_indices = 0..2..<10 | range-into-list
ls / | sort-by modified | select ...$file_indices
# => 디렉터리의 첫 번째, 세 번째, 다섯 번째, 일곱 번째 및 아홉 번째 파일을 가장 오래된 것부터 최신 것 순으로 반환합니다.
```

`scope modules`를 다시 실행하면 하위 모듈의 모든 명령이 `my-utils` 모듈로 다시 내보내진다는 것을 알 수 있습니다.

::: tip
`export module`이 권장되고 가장 일반적인 형태이지만 `export use`가 필요한 모듈 설계 시나리오가 하나 있습니다. `export use`는 하위 모듈에서 정의를 _선택적으로 내보내는_ 데 사용할 수 있으며, `export module`은 할 수 없는 작업입니다. 예는 [추가 예제 - 하위 모듈에서 선택적 내보내기](#selective-export-from-a-submodule)를 참조하십시오.
:::

::: note
`export` 없는 `module`은 로컬 모듈만 정의하며 하위 모듈을 내보내지 않습니다.
:::

## 모듈 문서화

[사용자 지정 명령](../custom_commands.md#documenting-your-command)과 마찬가지로 모듈에는 `help <module_name>`으로 볼 수 있는 문서가 포함될 수 있습니다. 문서는 모듈 파일의 시작 부분에 있는 일련의 주석 처리된 줄입니다. `my-utils` 모듈을 문서화해 보겠습니다.

```nu
# 유용한 유틸리티 함수 모음

export use ./increment.nu
export use ./range-into-list.nu
```

이제 도움말을 살펴보십시오.

```nu
use my-utils *
help my-utils

# => 유용한 유틸리티 함수 모음
```

또한 `increment` 및 `range-into-list`의 명령이 `export use ...`로 다시 내보내지므로 해당 명령이 주 모듈의 도움말에도 표시된다는 점에 유의하십시오.

## 환경 변수

모듈은 [`export-env`](/commands/docs/export-env.md)를 사용하여 환경을 정의할 수 있습니다. 앞으로 모듈을 배치할 공통 디렉터리에 대한 환경 변수 내보내기로 `my-utils` 모듈을 확장해 보겠습니다. 이 디렉터리는 (기본적으로) [모듈 사용 - 모듈 경로](./using_modules.md#module-path)에서 설명하는 `$env.NU_LIB_DIRS` 검색 경로에 있습니다.

```nu
# 유용한 유틸리티 함수 모음

export use ./increment.nu
export use ./range-into-list.nu

export-env {
    $env.NU_MODULES_DIR = ($nu.default-config-dir | path join "scripts")
}
```

이 모듈을 `use`로 가져오면 [`export-env`](/commands/docs/export-env.md) 블록 내부의 코드가 실행되고 해당 환경이 현재 범위에 병합됩니다.

```nu
use my-utils
$env.NU_MODULES_DIR
# => 디렉터리 이름 반환
cd $env.NU_MODULES_DIR
```

::: tip
`--env` 없이 정의된 모든 명령과 마찬가지로 모듈의 명령 및 기타 정의는 환경에 대해 자체 범위를 사용합니다. 이렇게 하면 사용자의 범위로 유출되지 않고 모듈 내부에서 변경할 수 있습니다. `my-utils/mod.nu`의 맨 아래에 다음을 추가하십시오.

```nu
export def examine-config-dir [] {
    # PWD 환경 변수 변경
    cd $nu.default-config-dir
    ls
}
```

이 명령을 실행하면 모듈에서 _로컬로_ 디렉터리가 변경되지만 변경 사항은 부모 범위로 전파되지 않습니다.

:::

## 주의 사항

### `export-env`는 `use` 호출이 _평가_될 때만 실행됩니다.

::: note
이 시나리오는 `std/log`를 사용하는 모듈을 만들 때 일반적으로 발생합니다.
:::

다른 환경 내에서 모듈의 환경을 가져오려고 하면 예상대로 작동하지 않을 수 있습니다. `my-utils`에서 위에서 정의한 `$env.NU_MODULES_DIR` 중 하나인 공통 디렉터리에 대한 "바로 가기"를 만드는 새 모듈 `go.nu`를 만들어 보겠습니다.

다음을 시도할 수 있습니다.

```nu
# go.nu, my-utils의 부모 디렉터리에 있음
use my-utils

export def --env home [] {
    cd ~
}

export def --env modules [] {
    cd $env.NU_MODULES_DIR
}
```

그런 다음 가져옵니다.

```nu
use go.nu
go home
# => 작동함
go modules
# => 오류: $env.NU_MODULES_DIR을 찾을 수 없습니다.
```

이 경우 `my-utils`가 _평가_되지 않기 때문에 작동하지 않습니다. `go.nu` 모듈을 가져올 때만 _구문 분석_됩니다. 이렇게 하면 다른 모든 내보내기가 범위로 가져오지만 `export-env` 블록은 _실행_되지 않습니다.

::: important
이 장의 시작 부분에서 언급했듯이 `my-utils`(및 해당 `$env.NU_MODULES_DIR`)가 이전 가져오기에서 여전히 범위에 있는 동안 이를 시도하면 예상대로 실패하지 _않습니다_. "정상적인" 실패를 보려면 새 셸 세션에서 테스트하십시오.
:::

`my-utils` 내보낸 환경을 `go.nu` 모듈의 범위로 가져오려면 두 가지 옵션이 있습니다.

1. 필요한 각 명령에서 모듈 가져오기

   `go home` 명령 자체에 `use my-utils`를 배치하면 해당 `export-env`가 명령이 실행될 때 _평가_됩니다. 예시:

   ```nu
   # go.nu
   export def --env home [] {
       cd ~
   }

   export def --env modules [] {
       use my-utils
       cd $env.NU_MODULES_DIR
   }
   ```

2. `go.nu` 모듈의 `export-env` 블록 내에서 `my-utils` 환경 가져오기

   ```nu
   use my-utils
   export-env {
       use my-utils []
   }

   export def --env home [] {
       cd ~
   }

   export def --env modules [] {
       cd $env.NU_MODULES_DIR
   }
   ```

   위 예제에서 `go.nu`는 `my-utils`를 두 번 가져옵니다.

   1. 첫 번째 `use my-utils`는 모듈과 해당 정의(환경 제외)를 모듈 범위로 가져옵니다.
   2. 두 번째 `use my-utils []`는 환경을 제외한 아무것도 `go.nu`의 내보낸 환경 블록으로 가져오지 않습니다. `go.nu`의 `export-env`는 모듈을 처음 가져올 때 실행되므로 `use my-utils []`도 평가됩니다.

첫 번째 방법은 `my-utils` 환경을 `go.nu` 모듈의 범위 내에 유지한다는 점에 유의하십시오. 반면에 두 번째 방법은 `my-utils` 환경을 사용자 범위로 다시 내보냅니다.

### 모듈 파일과 명령은 부모 모듈의 이름을 따서 명명할 수 없습니다.

`.nu` 파일은 모듈 디렉터리와 동일한 이름을 가질 수 없습니다(예: `spam/spam.nu`). 이름이 두 번 정의되는 모호한 조건이 생성되기 때문입니다. 이것은 위에서 설명한 명령이 부모와 동일한 이름을 가질 수 없는 상황과 유사합니다.

## Windows 경로 구문

::: important
Windows의 누셸은 경로 구분 기호로 슬래시와 백슬래시를 모두 지원합니다. 그러나 모든 플랫폼에서 작동하도록 하려면 모듈에서 슬래시 `/`만 사용하는 것이 좋습니다.
:::

## 추가 예제

### 로컬 정의

위에서 언급했듯이 [`export`](/commands/docs/export.md) 키워드가 없는 모듈의 정의는 모듈의 범위에서만 액세스할 수 있습니다.

설명하기 위해 새 모듈 `is-alphanumeric.nu`를 만듭니다. 이 모듈 내에서 `str is-alphanumeric` 명령을 만듭니다. 문자열의 문자 중 영숫자가 아닌 문자가 있으면 `false`를 반환합니다.

```nu
# is-alphanumeric.nu
def alpha-num-range [] {
    [
        ...(seq char 'a' 'z')
        ...(seq char 'A' 'Z')
        ...(seq 0 9 | each { into string })
    ]
}

export def "str is-alphanumeric" []: string -> bool {
    if ($in == '') {
        false
    } else {
        let chars = (split chars)
        $chars | all {|char| $char in (alpha-num-range)}
    }
}
```

이 모듈에는 `alpha-num-range`와 `str is-alphanumeric`라는 두 가지 정의가 있지만 두 번째만 내보내집니다.

```nu
use is-alphanumeric.nu *
'Word' | str is-alphanumeric
# => true
'Some punctuation?!' | str is-alphanumeric
# => false
'a' in (alpha-num-range)
# => Error:
# => help: `alpha-num-range` is neither a Nushell built-in or a known external command
```

### 하위 모듈에서 선택적 내보내기

::: note
다음은 드문 사용 사례이지만 이 기술은 표준 라이브러리에서 `dirs` 명령과 해당 별칭을 별도로 사용할 수 있도록 하는 데 사용됩니다.
:::

위의 [하위 모듈](#submodules) 섹션에서 언급했듯이 `export use`만 하위 모듈에서 정의를 선택적으로 내보낼 수 있습니다.

설명하기 위해 위 [`go.nu` 모듈 예제](#caveats)의 수정된 형식을 `my-utils`에 추가해 보겠습니다.

```nu
# go.nu, my-utils 디렉터리에 있음
export def --env home [] {
    cd ~
}

export def --env modules [] {
    cd ($nu.default-config-dir | path join "scripts")
}

export alias h = home
export alias m = modules
```

이 `go.nu`에는 원본과 다음과 같은 변경 사항이 포함되어 있습니다.

- 이제 `my-utils`의 하위 모듈이 되므로 `my-utils` 모드에 의존하지 않습니다.
- "바로 가기" 별칭을 추가합니다.
  `h`: 홈 디렉터리로 이동합니다(`go home`의 별칭).
  `m`: 모듈 디렉터리로 이동합니다(`go modules`의 별칭).

사용자는 다음을 사용하여 별칭만 가져올 수 있습니다.

```nu
use my-utils/go.nu [h, m]
```

그러나 `go.nu`가 `my-utils`의 하위 모듈이 되도록 하고 싶다고 가정해 보겠습니다. 사용자가 `my-utils`를 가져올 때 별칭이 아닌 명령만 가져와야 합니다. `my-utils/mod.nu`를 편집하고 다음을 추가합니다.

```nu
export use ./go.nu [home, modules]
```

거의 작동합니다. `home` 및 `modules`를 선택적으로 내보내지만 별칭은 내보내지 않습니다. 그러나 `go` 접두사 없이 그렇게 합니다. 예시:

```nu
use my-utils *
home
# => 작동함
go home
# => 오류: 명령을 찾을 수 없음
```

`go home` 및 `go modules`로 내보내려면 `my-utils/mod.nu`를 다음과 같이 변경하십시오.

```nu
# 기존 `export use`를 다음으로 바꿉니다.
export module go {
    export use ./go.nu [home, modules]
}
```

이렇게 하면 `go home` 및 `go modules`에 대해 선택적으로 (다시) 내보낸 정의가 있는 `my-utils`에 새 내보낸 하위 모듈 `go`가 생성됩니다.

```nu
use my-utils *
# => 예상대로:
go home
# => 작동함
home
# => 오류: 명령을 찾을 수 없음
```
