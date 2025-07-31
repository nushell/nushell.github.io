# 환경

셸에서 일반적인 작업은 외부 응용 프로그램이 사용할 환경을 제어하는 것입니다. 이는 환경이 패키지화되어 외부 응용 프로그램이 시작될 때 제공되므로 종종 자동으로 수행됩니다. 그러나 때로는 응용 프로그램이 보는 환경 변수에 대해 더 정밀한 제어를 원할 수 있습니다.

$env 변수에서 현재 환경 변수를 볼 수 있습니다.

```nu
$env | table -e
# => ╭──────────────────────────────────┬───────────────────────────────────────────╮
# => │                                  │ ╭──────┬────────────────────────────────╮ │
# => │ ENV_CONVERSIONS                  │ │      │ ╭─────────────┬──────────────╮ │ │
# => │                                  │ │ PATH │ │ from_string │ <Closure 32> │ │ │
# => │                                  │ │      │ │ to_string   │ <Closure 34> │ │ │
# => │                                  │ │      │ ╰─────────────┴──────────────╯ │ │
# => │                                  │ │      │ ╭─────────────┬──────────────╮ │ │
# => │                                  │ │ Path │ │ from_string │ <Closure 36> │ │ │
# => │                                  │ │      │ │ to_string   │ <Closure 38> │ │ │
# => │                                  │ │      │ ╰─────────────┴──────────────╯ │ │
# => │                                  │ ╰──────┴────────────────────────────────╯ │
# => │ HOME                             │ /Users/jelle                              │
# => │ LSCOLORS                         │ GxFxCxDxBxegedabagaced                    │
# => | ...                              | ...                                       |
# => ╰──────────────────────────────────┴───────────────────────────────────────────╯
```

누셸에서 환경 변수는 모든 값과 모든 유형을 가질 수 있습니다. 예를 들어 `$env.PROMPT_COMMAND | describe`와 같이 describe 명령을 사용하여 환경 변수의 유형을 볼 수 있습니다.

외부 응용 프로그램에 환경 변수를 보내려면 값을 문자열로 변환해야 합니다. 이것이 어떻게 작동하는지에 대한 자세한 내용은 [환경 변수 변환](#environment-variable-conversions)을 참조하십시오.

환경은 처음에 Nu [구성 파일](configuration.md)과 Nu가 실행되는 환경에서 생성됩니다.

## 환경 변수 설정

환경 변수를 설정하는 방법에는 여러 가지가 있습니다.

### $env.VAR 할당

`$env.VAR = "val"`을 사용하는 것이 가장 간단한 방법입니다.

```nu
$env.FOO = 'BAR'
```

따라서 예를 들어 Windows `Path` 변수를 확장하려면 다음과 같이 할 수 있습니다.

```nu
$env.Path = ($env.Path | prepend 'C:\path\you\want\to\add')
```

여기서는 폴더를 Path의 기존 폴더 앞에 추가했으므로 가장 높은 우선 순위를 갖습니다.
대신 가장 낮은 우선 순위를 부여하려면 [`append`](/commands/docs/append.md) 명령을 사용할 수 있습니다.

### [`load-env`](/commands/docs/load-env.md)

설정하려는 환경 변수가 두 개 이상인 경우 [`load-env`](/commands/docs/load-env.md)를 사용하여 이름/값 쌍의 테이블을 만들고 여러 변수를 동시에 로드할 수 있습니다.

```nu
load-env { "BOB": "FOO", "JAY": "BAR" }
```

### 일회성 환경 변수

이들은 코드 블록을 실행하는 동안 일시적으로만 활성화되도록 정의됩니다.
자세한 내용은 [일회용 환경 변수](environment.md#single-use-environment-variables)를 참조하십시오.

### [`def --env`](/commands/docs/def.md)로 정의된 명령 호출

자세한 내용은 [사용자 지정 명령에서 환경 정의](custom_commands.md#changing-the-environment-in-a-custom-command)를 참조하십시오.

### 모듈의 내보내기 사용

자세한 내용은 [모듈](modules.md)을 참조하십시오.

## 환경 변수 읽기

개별 환경 변수는 `$env` 변수에 저장된 레코드의 필드이며 `$env.VARIABLE`로 읽을 수 있습니다.

```nu
$env.FOO
# => BAR
```

때로는 설정되지 않은 환경 변수에 액세스해야 할 수도 있습니다. 오류를 피하기 위해 [물음표 연산자](types_of_data.md#optional-cell-paths)를 사용하는 것을 고려하십시오.

```nu
$env.FOO | describe
# => Error: nu::shell::column_not_found
# =>
# =>   × Cannot find column
# =>    ╭─[entry #1:1:1]
# =>  1 │ $env.FOO
# =>    · ──┬─ ─┬─
# =>    ·   │   ╰── cannot find column 'FOO'
# =>    ·   ╰── value originates here
# =>    ╰────

$env.FOO? | describe
# => nothing

$env.FOO? | default "BAR"
# => BAR
```

또는 `in`을 사용하여 환경 변수의 존재 여부를 확인할 수 있습니다.

```nu
$env.FOO
# => BAR

if "FOO" in $env {
    echo $env.FOO
}
# => BAR
```

### 대소문자 구분

누셸의 `$env`는 OS에 관계없이 대소문자를 구분하지 않습니다. `$env`는 대부분 레코드처럼 동작하지만 읽거나 업데이트할 때 대소문자를 무시한다는 점에서 특별합니다. 즉, 예를 들어 `$env.PATH`, `$env.Path` 또는 `$env.path` 중 어느 것을 사용하든 모든 OS에서 동일하게 작동합니다.

`$env`를 대소문자를 구분하여 읽으려면 `$env | get --sensitive`를 사용하십시오.

## 범위

환경 변수를 설정하면 현재 범위(현재 블록과 그 안의 모든 블록)에서만 사용할 수 있습니다.

다음은 환경 범위를 보여주는 간단한 예입니다.

```nu
$env.FOO = "BAR"
do {
    $env.FOO = "BAZ"
    $env.FOO == "BAZ"
}
# => true
$env.FOO == "BAR"
# => true
```

참조: [사용자 지정 명령에서 환경 변경](./custom_commands.html#changing-the-environment-in-a-custom-command).

## 디렉터리 변경

셸에서 일반적인 작업은 [`cd`](/commands/docs/cd.md) 명령을 사용하여 디렉터리를 변경하는 것입니다. 누셸에서 [`cd`](/commands/docs/cd.md)를 호출하는 것은 `PWD` 환경 변수를 설정하는 것과 같습니다. 따라서 다른 환경 변수와 동일한 규칙(예: 범위 지정)을 따릅니다.

## 일회용 환경 변수

Bash 등에서 영감을 받아 한 번 환경 변수를 설정하는 일반적인 약어가 있습니다.

```nu
FOO=BAR $env.FOO
# => BAR
```

[`with-env`](/commands/docs/with-env.md)를 사용하여 동일한 작업을 더 명시적으로 수행할 수도 있습니다.

```nu
with-env { FOO: BAR } { $env.FOO }
# => BAR
```

[`with-env`](/commands/docs/with-env.md) 명령은 환경 변수를 지정된 값으로 일시적으로 설정합니다(여기서는 "FOO" 변수에 "BAR" 값이 지정됨). 이 작업이 완료되면 [블록](types_of_data.md#blocks)이 이 새 환경 변수가 설정된 상태로 실행됩니다.

## 영구 환경 변수

시작 시 환경 변수를 설정하여 누셸이 실행되는 동안 사용할 수 있도록 할 수도 있습니다. 이렇게 하려면 [Nu 구성 파일](configuration.md) 내에서 환경 변수를 설정하십시오.

예시:

```nu
# config.nu에서
$env.FOO = 'BAR'
```

## 환경 변수 변환

`ENV_CONVERSIONS` 환경 변수를 설정하여 다른 환경 변수를 문자열과 값 간에 변환할 수 있습니다.
예를 들어, [기본 환경 구성](https://github.com/nushell/nushell/blob/main/crates/nu-utils/src/default_files/default_env.nu)에는 PATH(및 Windows에서 사용되는 Path) 환경 변수를 문자열에서 목록으로 변환하는 것이 포함됩니다.
`env.nu` 및 `config.nu`가 모두 로드된 후 `ENV_CONVERSIONS` 내에 지정된 기존 환경 변수는 `from_string` 필드에 따라 모든 유형의 값으로 변환됩니다.
외부 도구에는 환경 변수가 문자열이어야 하므로 문자열이 아닌 환경 변수는 먼저 변환해야 합니다.
값 -> 문자열 변환은 `ENV_CONVERSIONS`의 `to_string` 필드에 의해 설정되며 외부 명령이 실행될 때마다 수행됩니다.

예를 들어 변환을 설명해 보겠습니다.
config.nu에 다음을 넣으십시오.

```nu
$env.ENV_CONVERSIONS = {
    # ... 이미 Path 및 PATH가 있을 수 있습니다. 다음을 추가하십시오.
    FOO : {
        from_string: { |s| $s | split row '-' }
        to_string: { |v| $v | str join '-' }
    }
}
```

이제 누셸 인스턴스 내에서:

```nu
with-env { FOO : 'a-b-c' } { nu }  # FOO 환경 변수가 'a-b-c'로 설정된 누셸을 실행합니다.

$env.FOO
# =>   0   a
# =>   1   b
# =>   2   c
```

업데이트된 구성이 있는 새 누셸 인스턴스에서 `$env.FOO`가 이제 목록임을 알 수 있습니다.
수동으로 변환을 테스트할 수도 있습니다.

```nu
do $env.ENV_CONVERSIONS.FOO.from_string 'a-b-c'
```

이제 목록 -> 문자열 변환을 테스트하려면 다음을 실행하십시오.

```nu
nu -c '$env.FOO'
# => a-b-c
```

`nu`는 외부 프로그램이므로 누셸은 `[ a b c ]` 목록을 `ENV_CONVERSIONS.FOO.to_string`에 따라 변환하여 `nu` 프로세스에 전달했습니다.
`nu -c`로 명령을 실행하면 구성 파일이 로드되지 않으므로 `FOO`에 대한 환경 변환이 누락되어 일반 문자열로 표시됩니다. 이렇게 하면 변환이 성공했는지 확인할 수 있습니다.
`do $env.ENV_CONVERSIONS.FOO.to_string [a b c]`를 통해 이 단계를 수동으로 실행할 수도 있습니다.

_(중요! 환경 변환 문자열 -> 값은 env.nu 및 config.nu가 평가된 **후에** 발생합니다. env.nu 및 config.nu의 모든 환경 변수는 다른 값으로 수동으로 설정하지 않는 한 여전히 문자열입니다.)_

## 환경 변수 제거

[`hide-env`](/commands/docs/hide-env.md)를 통해 현재 범위에서 설정된 경우에만 환경 변수를 제거할 수 있습니다.

```nu
$env.FOO = 'BAR'
# => ...
hide-env FOO
```

숨기기도 범위가 지정되어 환경 변수를 일시적으로 제거하고 자식 범위 내에서 부모 환경을 수정하는 것을 방지할 수 있습니다.

```nu
$env.FOO = 'BAR'
do {
  hide-env FOO
  # $env.FOO는 존재하지 않습니다.
}
$env.FOO
# => BAR
```
