---
prev:
  text: 누셸 프로그래밍
  link: /book/programming_in_nu.md
---
# 사용자 지정 명령

모든 프로그래밍 언어와 마찬가지로 긴 파이프라인과 표현식을 저장하여 필요할 때 쉽게 다시 호출할 수 있기를 원할 것입니다.

이것이 사용자 지정 명령이 필요한 이유입니다.

::: tip 참고
사용자 지정 명령은 많은 언어의 함수와 유사하지만, 누셸에서는 사용자 지정 명령이 _일급 명령 자체로 작동_합니다. 아래에서 보듯이, 기본 제공 명령과 함께 도움말 시스템에 포함되고, 파이프라인의 일부가 될 수 있으며, 형식 오류에 대해 실시간으로 구문 분석되는 등 훨씬 더 많은 기능을 제공합니다.
:::

[[toc]]

## 사용자 지정 명령 만들기 및 실행

간단한 `greet` 사용자 지정 명령으로 시작하겠습니다.

```nu
def greet [name] {
  $"Hello, ($name)!"
}
```

여기서 `greet` 명령을 정의하는데, 이 명령은 `name`이라는 단일 매개변수를 받습니다. 이 매개변수 다음에는 사용자 지정 명령이 실행될 때 일어날 일을 나타내는 블록이 있습니다. 호출되면 사용자 지정 명령은 `name`에 전달된 값을 `$name` 변수로 설정하며, 이 변수는 블록에서 사용할 수 있습니다.

이 명령을 실행하려면 기본 제공 명령을 호출하는 것과 똑같이 호출할 수 있습니다.

```nu
greet "World"
# => Hello, World!
```

## 명령에서 값 반환

위 예제에는 `return` 또는 `echo` 문이 없다는 것을 알 수 있습니다.

PowerShell 및 JavaScript(화살표 함수 사용)와 같은 일부 다른 언어와 마찬가지로 누셸은 _암시적 반환_ 기능을 제공하며, 명령의 마지막 표현식 값이 반환 값이 됩니다.

위 예제에는 문자열이라는 하나의 표현식만 있습니다. 이 문자열이 명령의 반환 값이 됩니다.

```nu
greet "World" | describe
# => string
```

물론 일반적인 명령은 여러 표현식으로 구성됩니다. 시연을 위해 3개의 표현식이 있는 무의미한 명령을 보여드리겠습니다.

```nu
def eight [] {
  1 + 1
  2 + 2
  4 + 4
}

eight
# => 8
```

반환 값은 다시 말하지만 명령의 _마지막_ 표현식인 `4 + 4`(8)의 결과입니다.

추가 예시:

::: details 조기 반환
어떤 조건으로 인해 조기에 종료해야 하는 명령은 [`return` 문](/commands/docs/return.md)을 사용하여 여전히 값을 반환할 수 있습니다.

```nu
def process-list [] {
  let input_length = length
  if $input_length > 10_000 {
    print "Input list is too long"
    return null
  }

  $in | each {|i|
    # 목록 처리
    $i * 4.25
  }
}
```

:::

::: details 반환 값 억제
표현식이 아닌 _문_으로 작동하고 값을 반환하지 않는 사용자 지정 명령을 만들고 싶을 때가 많습니다.

이 경우 `ignore` 키워드를 사용할 수 있습니다.

```nu
def create-three-files [] {
  [ file1 file2 file3 ] | each {|filename|
    touch $filename
  } | ignore
}
```

파이프라인 끝에 `ignore`가 없으면 명령은 `each` 문에서 빈 목록을 반환합니다.

마지막 표현식으로 `null`을 반환할 수도 있습니다. 또는 이 가상 예제에서는 값을 반환하지 않는 `for` 문을 사용할 수 있습니다(다음 예제 참조).
:::

::: details 값을 반환하지 않는 문
누셸의 일부 키워드는 값을 반환하지 않는 _문_입니다. 사용자 지정 명령의 마지막 표현식으로 이러한 문 중 하나를 사용하면 _반환 값_은 `null`이 됩니다. 이는 일부 경우에 예기치 않을 수 있습니다. 예시:

```nu
def exponents-of-three [] {
  for x in [ 0 1 2 3 4 5 ] {
    3 ** $x
  }
}
exponents-of-three
```

위 명령은 아무것도 표시하지 않으며, `for`가 값을 반환하지 않는 _문_이기 때문에 반환 값은 비어 있거나 `null`입니다.

입력 목록에서 값을 반환하려면 `each` 명령과 같은 필터를 사용하십시오.

````nu
def exponents-of-three [] {
  [ 0 1 2 3 4 5 ] | each {|x|
    3 ** $x
  }
}

exponents-of-three

# => ╭───┬─────╮
# => │ 0 │   1 │
# => │ 1 │   3 │
# => │ 2 │   9 │
# => │ 3 │  27 │
# => │ 4 │  81 │
# => │ 5 │ 243 │
# => ╰───┴─────╯
:::

::: details 일치 표현식
```nu
# 현재 디렉터리에서 임의의 파일 반환
def "random file" [] {
  let files = (ls)
  let num_files = ($files | length)

  match $num_files {
    0 => null  # 빈 디렉터리에 대해 null 반환
    _ => {
      let random_file = (random int 0..($num_files - 1))
      ($files | get $random_file)
    }
  }
}
````

이 경우 마지막 표현식은 다음을 반환할 수 있는 `match` 문입니다.

- 디렉터리가 비어 있으면 `null`
- 그렇지 않으면 임의로 선택된 파일을 나타내는 `record`
:::

## 사용자 지정 명령 및 파이프라인

기본 제공 명령과 마찬가지로 사용자 지정 명령의 반환 값을 파이프라인의 다음 명령으로 전달할 수 있습니다. 사용자 지정 명령은 파이프라인 입력도 받을 수 있습니다. 또한 가능한 경우 파이프라인 입력 및 출력은 사용 가능해지면 스트리밍됩니다.

::: tip 중요!
참조: [파이프라인](./pipelines.html)
:::

### 파이프라인 출력

```nu
ls | get name
```

[`ls`](/commands/docs/ls.md)를 우리가 작성한 명령으로 옮겨 보겠습니다.

```nu
def my-ls [] { ls }
```

이 명령의 출력을 [`ls`](/commands/docs/ls.md)와 똑같이 사용할 수 있습니다.

```nu
my-ls | get name
# => ╭───┬───────────────────────╮
# => │ 0 │ myscript.nu           │
# => │ 1 │ myscript2.nu          │
# => │ 2 │ welcome_to_nushell.md │
# => ╰───┴───────────────────────╯
```

이를 통해 사용자 지정 명령을 쉽게 빌드하고 출력을 처리할 수 있습니다. 다른 언어처럼 반환 문을 사용하지 않는다는 것을 기억하십시오. 대신 [암시적 반환](#returning-values-from-a-command)을 통해 다른 파이프라인에 연결할 수 있는 데이터 스트림을 출력하는 파이프라인을 빌드할 수 있습니다.

::: tip 참고
이 경우 `ls` 콘텐츠는 별도의 명령에 있더라도 여전히 스트리밍됩니다. 느린(예: 네트워크) 파일 시스템의 긴 디렉터리에 대해 이 명령을 실행하면 행이 사용 가능해질 때마다 반환됩니다.
:::

### 파이프라인 입력

사용자 지정 명령은 다른 명령과 마찬가지로 파이프라인에서 입력을 받을 수도 있습니다. 이 입력은 사용자 지정 명령의 블록에 자동으로 전달됩니다.

입력으로 받는 모든 값을 두 배로 만드는 자체 명령을 만들어 보겠습니다.

```nu
def double [] {
  each { |num| 2 * $num }
}
```

이제 파이프라인에서 나중에 위 명령을 호출하면 입력으로 무엇을 하는지 볼 수 있습니다.

```nu
[1 2 3] | double
# => ╭───┬───╮
# => │ 0 │ 2 │
# => │ 1 │ 4 │
# => │ 2 │ 6 │
# => ╰───┴───╯
```

::: tip 멋지네요!
이 명령은 입력 및 출력 _스트리밍_을 모두 보여줍니다. 무한 입력으로 실행해 보십시오.

```nu
1.. | each {||} | double
```

입력 명령이 끝나지 않았더라도 `double` 명령은 여전히 사용 가능해지면 값을 수신하고 출력할 수 있습니다.

명령을 중지하려면 <kbd>Ctrl</kbd>+<kbd>C</kbd>를 누르십시오.
:::

[`$in` 변수](pipelines.html#pipeline-input-and-the-special-in-variable)를 사용하여 나중에 사용할 입력을 저장할 수도 있습니다.

```nu
def nullify [...cols] {
  let start = $in
  $cols | reduce --fold $start { |col, table|
    $table | upsert $col null
  }
}

ls | nullify name size
# => ╭───┬──────┬──────┬──────┬───────────────╮
# => │ # │ name │ type │ size │   modified    │
# => ├───┼──────┼──────┼──────┼───────────────┤
# => │ 0 │      │ file │      │ 8 minutes ago │
# => │ 1 │      │ file │      │ 8 minutes ago │
# => │ 2 │      │ file │      │ 8 minutes ago │
# => ╰───┴──────┴──────┴──────┴───────────────╯
```

## 명령 이름 지정

누셸에서 명령 이름은 문자열일 수 있습니다. 다음은 유효한 명령 이름의 몇 가지 예입니다. `greet`, `get-size`, `mycommand123`, `my command`, `命令`(영어 번역: "command") 및 `😊`까지도 가능합니다.

다른 파서 패턴과 혼동될 수 있는 문자열은 피해야 합니다. 예를 들어 다음 명령 이름은 호출할 수 없을 수 있습니다.

- `1`, `"1"` 또는 `"1.5"`: 누셸은 숫자를 명령 이름으로 사용하는 것을 허용하지 않습니다.
- `4MiB` 또는 `"4MiB"`: 누셸은 파일 크기를 명령 이름으로 사용하는 것을 허용하지 않습니다.
- `"number#four"` 또는 `"number^four"`: 캐럿 및 해시 기호는 명령 이름에 사용할 수 없습니다.
- `-a`, `"{foo}"`, `"(bar)"`: 누셸이 플래그, 클로저 또는 표현식으로 해석하므로 호출할 수 없습니다.

`"+foo"`와 같은 이름은 작동할 수 있지만 파서 규칙이 시간이 지남에 따라 변경될 수 있으므로 피하는 것이 가장 좋습니다. 확실하지 않은 경우 명령 이름을 가능한 한 간단하게 유지하십시오.

::: tip
누셸에서는 가독성을 높이기 위해 명령의 단어를 `-`로 구분하는 것이 일반적입니다. 예를 들어 `getsize` 또는 `get_size` 대신 `get-size`를 사용합니다.
:::

::: tip
`def`는 파서 키워드이므로 명령 이름은 구문 분석 시간에 알려져야 합니다. 즉, 명령 이름은 변수나 상수가 될 수 없습니다. 예를 들어 다음은 허용되지 _않습니다_.

```nu
let name = "foo"
def $name [] { foo }
```

:::

### 하위 명령

공백을 사용하여 명령의 하위 명령을 정의할 수도 있습니다. 예를 들어 [`str`](/commands/docs/str.md)에 새 하위 명령을 추가하려면 "str "으로 시작하는 하위 명령의 이름을 지정하여 만들 수 있습니다. 예시:

```nu
def "str mycommand" [] {
  "hello"
}
```

이제 사용자 지정 명령을 [`str`](/commands/docs/str.md)의 기본 제공 하위 명령인 것처럼 호출할 수 있습니다.

```nu
str mycommand
```

물론 이름에 공백이 있는 명령도 같은 방식으로 정의됩니다.

```nu
def "custom command" [] {
  "This is a custom command with a space in the name!"
}
```

## 매개변수

### 여러 매개변수

`def` 명령에서 매개변수는 [`list`](./types_of_data.md#lists)에 정의됩니다. 즉, 여러 매개변수를 공백, 쉼표 또는 줄 바꿈으로 구분할 수 있습니다.

예를 들어, 두 개의 이름을 받는 `greet` 버전입니다. 이 세 가지 정의 중 어느 것이든 작동합니다.

```nu
# 공백
def greet [name1 name2] {
  $"Hello, ($name1) and ($name2)!"
}

# 쉼표
def greet [name1, name2] {
  $"Hello, ($name1) and ($name2)!"
}

# 줄 바꿈
def greet [
  name1
  name2
] {
  $"Hello, ($name1) and ($name2)!"
}
```

### 필수 위치 매개변수

위에서 사용된 기본 인수 정의는 _위치_입니다. 위 `greet` 명령에 전달된 첫 번째 인수는 `name1` 매개변수(그리고 위에서 언급했듯이 `$name1` 변수)에 할당됩니다. 두 번째 인수는 `name2` 매개변수와 `$name2` 변수가 됩니다.

기본적으로 위치 매개변수는 _필수_입니다. 두 개의 필수 위치 매개변수가 있는 이전 `greet` 정의를 사용합니다.

```nu
def greet [name1, name2] {
  $"Hello, ($name1) and ($name2)!"
}

greet Wei Mei
# => Hello, Wei and Mei!

greet Wei
# => Error: nu::parser::missing_positional
# =>
# =>   × Missing required positional argument.
# =>    ╭─[entry #1:1:10]
# =>  1 │ greet Wei
# =>    ╰────
# =>   help: Usage: greet <name1> <name2> . Use `--help` for more information.
```

::: tip
이 `greet` 버전 뒤에 세 번째 이름을 입력해 보십시오. 파서가 자동으로 오류를 감지하고 실행 전에도 세 번째 인수를 오류로 강조 표시합니다.
:::

### 선택적 위치 매개변수

이름 뒤에 물음표(`?`)를 붙여 위치 매개변수를 선택적으로 정의할 수 있습니다. 예시:

```nu
def greet [name?: string] {
  $"Hello, ($name | default 'You')"
}

greet
# => Hello, You
```

::: tip
변수에 액세스하는 데 사용되는 이름에는 `?`가 포함되지 않습니다. 명령 서명의 정의에만 포함됩니다.
:::

선택적 매개변수가 전달되지 않으면 명령 본문의 값은 `null`과 같습니다. 위 예제에서는 `default` 명령을 사용하여 `name`이 `null`일 때 기본값으로 "You"를 제공합니다.

값을 직접 비교할 수도 있습니다.

```nu
def greet [name?: string] {
  match $name {
    null => "Hello! I don't know your name!"
    _ => $"Hello, ($name)!"
  }
}

greet
# => Hello! I don't know your name!
```

필수 및 선택적 위치 매개변수를 함께 사용하는 경우 정의에서 필수 매개변수가 먼저 나타나야 합니다.

#### 기본값이 있는 매개변수

누락된 경우 매개변수의 기본값을 설정할 수도 있습니다. 기본값이 있는 매개변수는 명령을 호출할 때도 선택 사항입니다.

```nu
def greet [name = "Nushell"] {
  $"Hello, ($name)!"
}
```

매개변수 없이 이 명령을 호출하거나 기본값을 재정의할 값을 사용하여 호출할 수 있습니다.

```nu
greet
# => Hello, Nushell!

greet world
# => Hello, World!
```

기본값을 [형식 주석](#parameter-types)과 결합할 수도 있습니다.

```nu
def congratulate [age: int = 18] {
  $"Happy birthday! You are ($age) years old now!"
}
```

### 매개변수 유형

각 매개변수에 대해 선택적으로 유형을 정의할 수 있습니다. 예를 들어 기본 `greet` 명령을 다음과 같이 작성할 수 있습니다.

```nu
def greet [name: string] {
  $"Hello, ($name)"
}
```

매개변수에 형식 주석이 없으면 누셸은 이를 [`any` 형식](./types_of_data.html#any)으로 처리합니다. 매개변수에 형식을 주석으로 달면 누셸은 함수를 호출할 때 해당 형식을 확인합니다.

예를 들어 `string` 대신 `int`만 받으려면 다음과 같이 합니다.

```nu
def greet [name: int] {
  $"hello ($name)"
}

greet World
```

위를 실행하려고 하면 누셸은 형식이 일치하지 않는다고 알려줍니다.

```nu
Error: nu::parser::parse_mismatch

  × Parse mismatch during operation.
   ╭─[entry #1:1:7]
 1 │ greet World
   ·       ──┬──
   ·         ╰── expected int
   ╰────
```

::: tip 멋지네요!
형식 검사는 파서 기능입니다. 명령줄에서 사용자 지정 명령을 입력하면 누셸 파서는 실시간으로 잘못된 인수 형식을 감지하고 명령을 실행하기 전에 강조 표시할 수도 있습니다.

강조 표시 스타일은 [테마](https://github.com/nushell/nu_scripts/tree/main/themes)를 사용하거나 `$env.config.color_config.shape_garbage`를 사용하여 수동으로 변경할 수 있습니다.
:::

::: details 형식 주석 목록
대부분의 형식은 형식 주석으로 사용할 수 있습니다. 또한 사용할 수 있는 몇 가지 "모양"이 있습니다. 예시:

- `number`: `int` 또는 `float`를 받습니다.
- `path`: `~` 및 `.` 문자에 특별한 의미가 있고 전체 경로에 해당하는 것으로 자동으로 확장되는 문자열입니다. 사용 예는 언어 참조 가이드의 [경로](/lang-guide/chapters/types/other_types/path.html)를 참조하십시오.
- `directory`: `path`(위)의 하위 집합입니다. 매개변수에 대해 탭 완성을 사용할 때 디렉터리만 제공됩니다. 확장은 `path`와 마찬가지로 발생합니다.
- `error`: 사용 가능하지만 현재 알려진 유효한 사용법은 없습니다. 자세한 내용은 언어 참조 가이드의 [오류](/lang-guide/chapters/types/other_types/error.html)를 참조하십시오.

다음 [형식](./types_of_data.html)은 매개변수 주석에 사용할 수 있습니다.

- `any`
- `binary`
- `bool`
- `cell-path`
- `closure`
- `datetime`
- `duration`
- `filesize`
- `float`
- `glob`
- `int`
- `list`
- `nothing`
- `range`
- `record`
- `string`
- `table`

:::

### 플래그

위치 매개변수 외에도 명명된 플래그를 정의할 수도 있습니다.

예시:

```nu
def greet [
  name: string
  --age: int
] {
    {
      name: $name
      age: $age
    }
}
```

이 `greet` 버전에서는 `name` 위치 매개변수와 `age` 플래그를 정의합니다. 위치 매개변수(`?`가 없으므로)는 필수입니다. 명명된 플래그는 선택 사항입니다. `--age` 플래그 없이 명령을 호출하면 `$age`가 `null`로 설정됩니다.

`--age` 플래그는 위치 `name` 앞이나 뒤에 올 수 있습니다. 예시:

```nu
greet Lucia --age 23
# => ╭──────┬───────╮
# => │ name │ Lucia │
# => │ age  │ 23    │
# => ╰──────┴───────╯

greet --age 39 Ali
# => ╭──────┬─────╮
# => │ name │ Ali │
# => │ age  │ 39  │
# => ╰──────┴─────╯

greet World
# => ╭──────┬───────╮
# => │ name │ World │
# => │ age  │       │
# => ╰──────┴───────╯
```

플래그는 약식 버전으로도 정의할 수 있습니다. 이렇게 하면 더 간단한 플래그와 더 길고 읽기 쉬운 플래그를 전달할 수 있습니다.

이전 예제를 확장하여 `age` 값에 대한 약식 플래그를 사용해 보겠습니다.

```nu
def greet [
  name: string
  --age (-a): int
] {
    {
      name: $name
      age: $age
    }
  }
```

::: tip
결과 변수는 항상 긴 플래그 이름을 기반으로 합니다. 위 예제에서 변수는 계속해서 `$age`입니다. `$a`는 유효하지 않습니다.
:::

이제 약식 플래그를 사용하여 이 업데이트된 정의를 호출할 수 있습니다.

```nu
greet Akosua -a 35
# => ╭──────┬────────╮
# => │ name │ Akosua │
# => │ age  │ 35     │
# => ╰──────┴────────╯
```

플래그는 기본 스위치로도 사용할 수 있습니다. 스위치가 있으면 스위치를 기반으로 하는 변수는 `true`입니다. 없으면 `false`입니다.

```nu
def greet [
  name: string
  --caps
] {
    let greeting = $"Hello, ($name)!"
    if $caps {
      $greeting | str upcase
    } else {
      $greeting
    }
}

greet Miguel --caps
# => HELLO, MIGUEL!

greet Chukwuemeka
# => Hello, Chukwuemeka!
```

플래그를 활성화/비활성화하기 위해 `true`/`false`에 할당할 수도 있습니다.

```nu
greet Giulia --caps=false
# => Hello, Giulia!

greet Hiroshi --caps=true
# => HELLO, HIROSHI!
```

::: tip
다음 실수에 주의하십시오.

```nu
greet Gabriel --caps true
```

등호 대신 공백을 입력하면 `true`가 위치 인수로 전달되므로 원하는 결과가 아닐 수 있습니다!

혼동을 피하기 위해 플래그에 부울 형식을 주석으로 다는 것은 허용되지 않습니다.

```nu
def greet [
    --caps: bool   # 허용되지 않음
] { ... }
```

:::

플래그에는 대시가 포함될 수 있습니다. 결과 변수 이름에서 대시를 밑줄로 바꾸면 액세스할 수 있습니다.

```nu
def greet [
  name: string
  --all-caps
] {
    let greeting = $"Hello, ($name)!"
    if $all_caps {
      $greeting | str upcase
    } else {
      $greeting
    }
}
```

### 나머지 매개변수

임의의 수의 위치 인수를 받는 명령을 정의하려는 경우가 있을 수 있습니다. 다음 `...` 구문을 사용하여 "나머지" 매개변수로 이를 수행할 수 있습니다.

```nu
def multi-greet [...names: string] {
  for $name in $names {
    print $"Hello, ($name)!"
  }
}

multi-greet Elin Lars Erik
# => Hello, Elin!
# => Hello, Lars!
# => Hello, Erik!
```

위의 `greet` 명령 정의를 인수 없이 포함하여 임의의 수의 인수로 호출할 수 있습니다. 모든 인수는 `$names`에 목록으로 수집됩니다.

나머지 매개변수는 위치 매개변수와 함께 사용할 수 있습니다.

```nu
def vip-greet [vip: string, ...names: string] {
  for $name in $names {
    print $"Hello, ($name)!"
  }

  print $"And a special welcome to our VIP today, ($vip)!"
}

#         $vip          $name
#         ----- -------------------------
vip-greet Rahul Priya Arjun Anjali Vikram
# => Hello, Priya!
# => Hello, Arjun!
# => Hello, Anjali!
# => Hello, Vikram!
# => And a special welcome to our VIP today, Rahul!
```

나머지 매개변수에 목록을 전달하려면 [스프레드 연산자](/book/operators#spread-operator)(`...`)를 사용할 수 있습니다. 위의 `vip-greet` 명령 정의를 사용합니다.

```nu
let vip = "Tanisha"
let guests = [ Dwayne, Shanice, Jerome ]
vip-greet $vip ...$guests
# => Hello, Dwayne!
# => Hello, Shanice!
# => Hello, Jerome!
# => And a special welcome to our VIP today, Tanisha!
```

### 래핑된 외부 명령이 있는 나머지 매개변수

`def --wrapped`로 정의된 사용자 지정 명령은 알 수 없는 플래그와 인수를 나머지 매개변수로 수집한 다음 목록 확산을 통해 외부 명령에 전달할 수 있습니다. 이를 통해 사용자 지정 명령은 원래 매개변수를 모두 수락하면서 외부 명령을 "래핑"하고 확장할 수 있습니다. 예를 들어, 외부 `eza` 명령은 디렉터리 목록을 표시합니다. 기본적으로 그리드 배열을 표시합니다.

```nu
eza commands
# => categories  docs  README.md
```

항상 긴 목록을 표시하고 아이콘을 추가하는 새 명령 `ezal`을 정의할 수 있습니다.

```nu
def --wrapped ezal [...rest] {
  eza -l ...$rest
}
```

:::note
`--icons`를 추가할 수도 있습니다. 이 가이드에서는 해당 아이콘이 잘 표시되지 않기 때문에 이 예제에서는 생략합니다.
:::

`--wrapped`는 추가 매개변수를 `rest` 매개변수로 강제하므로 `eza`가 지원하는 모든 매개변수로 명령을 호출할 수 있습니다. 이러한 추가 매개변수는 목록 확산 연산 `...$rest`를 통해 확장됩니다.

```nu
ezal commands
# => drwxr-xr-x   - ntd  7 Feb 11:41 categories
# => drwxr-xr-x   - ntd  7 Feb 11:41 docs
# => .rw-r--r-- 936 ntd 14 Jun  2024 README.md

ezal -d commands
# => drwxr-xr-x - ntd 14 Jun  2024 commands
```

사용자 지정 명령은 특정 매개변수를 확인하고 그에 따라 동작을 변경할 수 있습니다. 예를 들어 `-G` 옵션을 사용하여 그리드를 강제할 때 `-l`을 `eza`에 전달하는 것을 생략할 수 있습니다.

```nu
def --wrapped ezal [...rest] {
  if '-G' in $rest {
    eza ...$rest
  } else {
    eza -l --icons ...$rest
  }
}

ezal -G commands
# => categories  docs  README.md
```

## 파이프라인 입출력 서명

기본적으로 사용자 지정 명령은 파이프라인 입력으로 [`<any>` 형식](./types_of_data.md#any)을 허용하고 마찬가지로 `<any>` 형식을 출력할 수 있습니다. 그러나 사용자 지정 명령에는 허용되는 형식을 좁히기 위해 명시적인 서명을 지정할 수도 있습니다.

예를 들어 [`str stats`](/commands/docs/str_stats.md)의 서명은 다음과 같습니다.

```nu
def "str stats" []: string -> record { }
```

여기서 `string -> record`는 명령의 _파이프라인 입출력_의 허용되는 형식을 정의합니다.

- 파이프라인 입력으로 `string`을 허용합니다.
- `record`를 출력합니다.

여러 입출력 형식이 있는 경우 [`str join`](/commands/docs/str_join.md)에서와 같이 대괄호 안에 넣고 쉼표나 줄 바꿈으로 구분할 수 있습니다.

```nu
def "str join" [separator?: string]: [
  list -> string
  string -> string
] { }
```

이는 `str join`이 파이프라인 입력으로 `list<any>` 또는 `string`을 받을 수 있음을 나타냅니다. 어느 경우든 `string`을 출력합니다.

일부 명령은 파이프라인 입력으로 데이터를 허용하거나 필요로 하지 않습니다. 이 경우 입력 형식은 `<nothing>`이 됩니다. 명령이 `null`을 반환하는 경우(예: [`rm`](/commands/docs/rm.md) 또는 [`hide`](/commands/docs/hide.md)) 출력 형식도 마찬가지입니다.

```nu
def xhide [module: string, members?]: nothing -> nothing { }
```

::: tip 참고
위 예제는 REPL에 복사할 때 기본 제공 `hide` 명령을 가리지 않도록 `xhide`로 이름이 변경되었습니다.
:::

입출력 서명은 명령에 대한 `help`에 표시되며 다음을 통해 검사할 수도 있습니다.

```nu
help commands | where name == <command_name>
scope commands | where name == <command_name>
```

:::tip 멋지네요!
입출력 서명을 통해 누셸은 구문 분석 시 두 가지 추가 오류 범주를 포착할 수 있습니다.

- 명령에서 잘못된 형식을 반환하려고 시도합니다. 예시:

  ```nu
  def inc []: int -> int {
    $in + 1
    print "Did it!"
  }

  # => Error: nu::parser::output_type_mismatch
  # =>
  # =>   × Command output doesn't match int.
  # =>    ╭─[entry #1:1:24]
  # =>  1 │ ╭─▶ def inc []: int -> int {
  # =>  2 │ │     $in + 1
  # =>  3 │ │     print "Did it!"
  # =>  4 │ ├─▶ }
  # =>    · ╰──── expected int, but command outputs nothing
  # =>    ╰────
  ```

- 그리고 명령에 잘못된 형식을 전달하려고 시도합니다.

  ```nu
  def inc []: int -> int { $in + 1 }
  "Hi" | inc
  # => Error: nu::parser::input_type_mismatch
  # =>
  # =>   × Command does not support string input.
  # =>    ╭─[entry #1:1:8]
  # =>  1 │ "Hi" | inc
  # =>    ·        ─┬─
  # =>    ·         ╰── command doesn't support string input
  # =>    ╰────
  ```

:::

## 명령 문서화

사용자가 사용자 지정 명령을 사용하는 방법을 가장 잘 이해하도록 돕기 위해 명령 및 매개변수에 대한 추가 설명으로 문서를 작성할 수도 있습니다.

`help vip-greet`를 실행하여 위에서 정의한 가장 최근 명령을 검사합니다.

```text
Usage:
  > vip-greet <vip> ...(names)

Flags:
  -h, --help - Display the help message for this command

Parameters:
  vip <string>
  ...names <string>

Input/output types:
  ╭───┬───────┬────────╮
  │ # │ input │ output │
  ├───┼───────┼────────┤
  │ 0 │ any   │ any    │
  ╰───┴───────┴────────╯
```

::: tip 멋지네요!
누셸이 지금까지의 정의를 기반으로 명령에 대한 몇 가지 기본 도움말을 자동으로 생성했음을 알 수 있습니다. 누셸은 또한 명령에 `--help`/`-h` 플래그를 자동으로 추가하므로 사용자는 `vip-greet --help`를 사용하여 도움말에 액세스할 수도 있습니다.
:::

명령과 매개변수를 설명하는 몇 가지 간단한 주석으로 도움말을 더 확장할 수 있습니다.

```nu
# VIP와 함께 손님을 맞이합니다.
#
# 생일, 졸업 파티,
# 은퇴 및 기타 모든 행사에 사용하세요.
# 특정인을 위한 행사를 축하합니다.
#
def vip-greet [
  vip: string        # 특별 손님
   ...names: string  # 다른 손님
] {
  for $name in $names {
    print $"Hello, ($name)!"
  }

  print $"And a special welcome to our VIP today, ($vip)!"
}
```

이제 `help vip-greet`를 다시 실행하여 차이점을 확인하십시오.

```text
VIP와 함께 손님을 맞이합니다.

생일, 졸업 파티,
은퇴 및 기타 모든 행사에 사용하세요.
특정인을 위한 행사를 축하합니다.

카테고리: 기본값

이 명령:
- 범위를 만들지 않습니다.
- 기본 제공 명령이 아닙니다.
- 하위 명령이 아닙니다.
- 플러그인의 일부가 아닙니다.
- 사용자 지정 명령입니다.
- 키워드가 아닙니다.

사용법:
  > vip-greet <vip>


플래그:


  -h, --help - 이 명령에 대한 도움말 메시지를 표시합니다.

서명:

  <any> | vip-greet[ <string>] -> <any>

매개변수:

  vip: <string> 특별 손님
  ...rest: <string> 다른 손님
```

`def` 문 바로 앞 줄의 주석이 도움말 시스템에서 명령에 대한 설명이 되는 것을 확인하십시오. 여러 줄의 주석을 사용할 수 있습니다. 첫 번째 줄(빈 주석 줄 앞)이 도움말 `description`이 됩니다. 이 정보는 명령을 탭 완성할 때도 표시됩니다.

나머지 주석 줄은 도움말 데이터에서 `extra_description`이 됩니다.

::: tip
다음을 실행합니다.

```nu
scope commands
| where name == 'vip-greet'
| wrap help
```

그러면 누셸이 만드는 도움말 _레코드_가 표시됩니다.
:::

매개변수 뒤의 주석이 해당 설명이 됩니다. 매개변수에는 한 줄 주석만 유효합니다.

::: tip 참고
인수 문서화 목적으로 동일한 줄에 계속되는 누셸 주석은 ` #` 파운드 기호 앞에 공백이 필요합니다.
:::

## 사용자 지정 명령에서 환경 변경

일반적으로 환경 변수 정의 및 변경은 블록 내에서 _범위가 지정_됩니다([./environment.html#scoping]). 즉, 사용자 지정 명령의 블록을 포함하여 블록이 끝날 때 범위가 벗어나면 해당 변수에 대한 변경 내용이 손실됩니다.

```nu
def foo [] {
    $env.FOO = 'After'
}

$env.FOO = "Before"
foo
$env.FOO
# => Before
```

그러나 [`def --env`](/commands/docs/def.md) 또는 [`export def --env`](/commands/docs/export_def.md)([모듈](modules.md)용)를 사용하여 정의된 명령은 호출자 측에서 환경을 유지합니다.

```nu
def --env foo [] {
    $env.FOO = 'After'
}

$env.FOO = "Before"
foo
$env.FOO
# => After
```

### 사용자 지정 명령에서 디렉터리 변경(cd)

마찬가지로 `cd` 명령을 사용하여 디렉터리를 변경하면 `$env.PWD` 환경 변수가 변경됩니다. 즉, 사용자 지정 명령이 끝나면 디렉터리 변경(`$env.PWD` 변수)도 재설정됩니다. 위와 같이 해결책은 `def --env` 또는 `export def --env`를 사용하는 것입니다.

```nu
def --env go-home [] {
  cd ~
}

cd /
go-home
pwd
# => 홈 디렉터리
```

## 영속성

향후 누셸 세션에서 사용자 지정 명령을 사용할 수 있도록 하려면 시작 구성에 추가해야 합니다. 명령 정의를 추가할 수 있습니다.

- `config.nu`에 직접
- `config.nu`에서 소싱하는 파일에
- `config.nu`에서 가져온 [모듈](./modules.html)에

자세한 내용은 [구성 장](configuration.md)을 참조하십시오.
