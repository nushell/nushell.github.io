# 문자열 작업

대부분의 언어와 마찬가지로 문자열은 텍스트를 나타내는 0개 이상의 문자 모음입니다. 여기에는 파일 이름, 파일 경로, 열 이름 등이 포함될 수 있습니다. 문자열은 매우 일반적이므로 누셸은 사용 사례에 맞는 여러 문자열 형식을 제공합니다.

## 한눈에 보는 문자열 형식

| 문자열 형식                                     | 예시                 | 이스케이프                   | 참고                                                                  |
| ---------------------------------------------------- | ----------------------- | ------------------------- | ---------------------------------------------------------------------- |
| [작은따옴표 문자열](#single-quoted-strings)       | `'[^\n]+'`              | 없음                      | 문자열 내에 작은따옴표를 포함할 수 없습니다.                         |
| [큰따옴표 문자열](#double-quoted-strings)       | `"The\nEnd"`            | C 스타일 백슬래시 이스케이프 | 모든 리터럴 백슬래시는 이스케이프해야 합니다.                                |
| [원시 문자열](#raw-strings)                          | `r#'Raw string'#`       | 없음                      | 작은따옴표를 포함할 수 있습니다.                                              |
| [일반 단어 문자열](#bare-word-strings)               | `ozymandias`            | 없음                      | "단어" 문자만 포함할 수 있습니다. 명령 위치에서는 사용할 수 없습니다. |
| [백틱 문자열](#backtick-quoted-strings)          | <code>\`[^\n]+\`</code> | 없음                      | 공백을 포함할 수 있는 일반 문자열입니다. 백틱을 포함할 수 없습니다.  |
| [작은따옴표 보간](#string-interpolation) | `$'Captain ($name)'`    | 없음                      | `'` 또는 짝이 맞지 않는 `()`를 포함할 수 없습니다.                               |
| [큰따옴표 보간](#string-interpolation) | `$"Captain ($name)"`    | C 스타일 백슬래시 이스케이프 | 모든 리터럴 백슬래시와 `()`는 이스케이프해야 합니다.                       |

## 작은따옴표 문자열

누셸에서 가장 간단한 문자열은 작은따옴표 문자열입니다. 이 문자열은 `'` 문자를 사용하여 일부 텍스트를 둘러쌉니다. 다음은 작은따옴표 문자열로 된 hello world 텍스트입니다.

```nu
'hello world'
# => hello world
'The
end'
# => The
# => end
```

작은따옴표 문자열은 주어진 텍스트에 아무런 영향을 미치지 않으므로 다양한 텍스트 데이터를 저장하는 데 이상적입니다.

## 큰따옴표 문자열

더 복잡한 문자열의 경우 누셸은 큰따옴표 문자열도 제공합니다. 이 문자열은 `"` 문자를 사용하여 텍스트를 둘러쌉니다. 또한 `\` 문자를 사용하여 텍스트 내에서 문자를 이스케이프하는 기능을 지원합니다.

예를 들어, 이스케이프 문자와 큰따옴표 문자열을 사용하여 hello 다음에 줄 바꿈을 쓰고 그 다음에 world를 쓸 수 있습니다.

```nu
"hello\nworld"
# => hello
# => world
```

이스케이프 문자를 사용하면 다른 방법으로는 입력하기 어려운 문자를 빠르게 추가할 수 있습니다.

누셸은 현재 다음 이스케이프 문자를 지원합니다.

- `\"` - 큰따옴표 문자
- `\'` - 작은따옴표 문자
- `\\` - 백슬래시
- `\/` - 슬래시
- `\b` - 백스페이스
- `\f` - 폼 피드
- `\r` - 캐리지 리턴
- `\n` - 줄 바꿈(라인 피드)
- `\t` - 탭
- `\u{X...}` - 단일 유니코드 문자, 여기서 X...는 1-6개의 16진수(0-9, A-F)입니다.

## 원시 문자열

원시 문자열은 원시 문자열이 작은따옴표를 포함할 수도 있다는 점을 제외하고 작은따옴표 문자열과 동일하게 작동합니다. 이는 원시 문자열이 시작 `r#'`과 닫는 `'#`로 둘러싸여 있기 때문에 가능합니다. 이 구문은 Rust 사용자에게 익숙할 것입니다.

```nu
r#'Raw strings can contain 'quoted' text.'#
# => Raw strings can contain 'quoted' text.
```

원시 문자열의 시작과 끝에 추가 `#` 기호를 추가하여 문자열의 `'` 기호 옆에 있는 동일한 수의 `#` 기호보다 하나 적은 수를 묶을 수 있습니다. 이것은 원시 문자열을 중첩하는 데 사용할 수 있습니다.

```nu
r###'r##'This is an example of a raw string.'##'###
# => r##'This is an example of a raw string.'##
```

## 일반 단어 문자열

다른 셸 언어와 마찬가지로(그러나 대부분의 다른 프로그래밍 언어와는 달리) 단일 '단어'로 구성된 문자열은 따옴표 없이도 작성할 수 있습니다.

```nu
print hello
# => hello
[hello] | describe
# => list<string>
```

하지만 조심하세요. 명령줄에서 일반 단어를 평범하게 사용하거나(즉, 데이터 구조 내에서가 아니거나 명령 매개변수로 사용되지 않음) 둥근 괄호 `(` `)` 안에 사용하면 외부 명령으로 해석됩니다.

```nu
hello
# => Error: nu::shell::external_command
# =>
# =>   × External command failed
# =>    ╭─[entry #5:1:1]
# =>  1 │ hello
# =>    · ──┬──
# =>    ·   ╰── executable was not found
# =>    ╰────
# =>   help: program not found
```

또한 많은 일반 단어는 nu에서 특별한 의미를 가지므로 문자열로 해석되지 않습니다.

```nu
true | describe
# => bool
[true] | describe
# => list<bool>
[trueX] | describe
# => list<string>
trueX | describe
# => Error: nu::shell::external_command
# =>
# =>   × External command failed
# =>    ╭─[entry #5:1:1]
# =>  1 │ trueX | describe
# =>    · ──┬──
# =>    ·   ╰── executable was not found
# =>    ╰────
# =>   help: program not found
```

따라서 일반 문자열은 비공식적인 명령줄 사용에 유용하지만 nu에서 더 공식적으로 프로그래밍할 때는 일반적으로 따옴표를 사용해야 합니다.

## 백틱으로 묶인 문자열

일반 단어 문자열은 본질적으로 공백이나 따옴표를 포함할 수 없습니다. 대안으로 누셸은 <code>`</code> 문자를 사용하는 백틱으로 묶인 문자열도 포함합니다. 대부분의 경우 이것은 일반 단어 문자열과 동일하게 작동해야 합니다.

예를 들어, 일반 단어와 마찬가지로 표현식의 첫 번째 위치에 있는 백틱으로 묶인 문자열은 _명령_ 또는 _경로_로 해석됩니다. 예시:

```nu
# 경로에서 찾은 외부 ls 바이너리 실행
`ls`

# 한 디렉터리 위로 이동
`..`

# 존재하는 경우 "my dir" 하위 디렉터리로 변경
`./my dir`
```

백틱으로 묶인 문자열은 공백을 포함하는 파일이나 디렉터리와 함께 glob를 결합하는 데 유용할 수 있습니다.

```nu
ls `./my dir/*`
```

백틱으로 묶인 문자열은 문자열 자체에 짝이 맞지 않는 백틱을 포함할 수 없습니다. 예시:

`````nu
echo ````
``

echo ```
# CLI에서 새 줄을 시작할 종료되지 않은 문자열
`````

## 외부 명령으로서의 문자열

문자열 앞에 `^` 기호를 붙여 누셸이 해당 문자열을 외부 명령인 것처럼 실행하도록 할 수 있습니다(변수 포함).

```nu
^'C:\Program Files\exiftool.exe'

let foo = 'C:\Program Files\exiftool.exe'
^$foo
```

이 목적을 위해 [`run-external`](/commands/docs/run-external.md) 명령을 사용할 수도 있으며, 추가 플래그와 옵션을 제공합니다.

## 문자열에 추가 및 앞에 추가

문자열에 추가하거나 앞에 추가하는 방법에는 여러 가지가 있습니다. 각 문자열의 시작 부분에 무언가를 추가하려면 클로저가 좋은 옵션입니다.

```nu
['foo', 'bar'] | each {|s| '~/' ++ $s} # ~/foo, ~/bar
['foo', 'bar'] | each {|s| '~/' + $s} # ~/foo, ~/bar
```

정규식을 사용하여 문자열의 시작 또는 끝을 바꿀 수도 있습니다.

```nu
['foo', 'bar'] | str replace -r '^' '~/'# ~/foo, ~/bar
['foo', 'bar'] | str replace -r '$' '~/'# foo~/, bar~/
```

끝에서 하나의 문자열을 얻으려면 `str join`이 친구입니다.

```nu
"hello" | append "world!" | str join " " # hello world!
```

reduce를 사용할 수도 있습니다.

```nu
1..10 | reduce -f "" {|elt, acc| $acc + ($elt | into string) + " + "} # 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10 +
```

문자열의 경우, 특히 문자열에 대해 작업할 필요가 없는 경우 `str join`을 사용하는 것이 일반적으로 더 쉽고 정확합니다(위 예제에서 끝에 추가 + 참고).

마지막으로 문자열 보간을 사용할 수도 있지만, 이는 너무 복잡하여 아래의 자체 하위 섹션에서 다룹니다.

## 문자열 보간

더 복잡한 문자열 사용 사례에는 새로운 형태의 문자열인 문자열 보간도 필요합니다. 이것은 원시 텍스트와 표현식 실행 결과 모두에서 텍스트를 구성하는 방법입니다. 문자열 보간은 결과를 함께 결합하여 새 문자열을 제공합니다.

문자열 보간은 `$" "` 및 `$' '`를 사용하여 보간된 텍스트를 래핑합니다.

예를 들어 `$name`이라는 변수가 있고 이 변수에 포함된 사람의 이름을 인사하고 싶다고 가정해 보겠습니다.

```nu
let name = "Alice"
$"greetings, ($name)"
# => greetings, Alice
```

표현식을 `()`로 래핑하여 완료될 때까지 실행하고 결과를 사용하여 문자열을 구성하는 데 사용할 수 있습니다.

문자열 보간에는 작은따옴표 `$' '`와 큰따옴표 `$" "` 형식이 모두 있습니다. 이것은 작은따옴표 및 큰따옴표 문자열에 해당합니다. 작은따옴표 문자열 보간은 이스케이프 문자를 지원하지 않는 반면 큰따옴표 문자열 보간은 지원합니다.

버전 0.61부터 보간된 문자열은 괄호를 이스케이프하는 것을 지원하므로 `(` 및 `)` 문자를 누셸이 그 사이에 나타나는 것을 평가하려고 시도하지 않고 문자열에서 사용할 수 있습니다.

```nu
$"2 + 2 is (2 + 2) \(you guessed it!)"
# => 2 + 2 is 4 (you guessed it!)
```

보간된 문자열은 구문 분석 시에 평가될 수 있지만, 서식이 구성에 따라 달라지는 값을 포함하고 `config.nu`가 아직 로드되지 않은 경우 기본 구성을 사용합니다. 따라서 `config.nu`에 다음과 같은 내용이 있는 경우 모든 파일 크기에 대해 `MB`를 사용하도록 구성이 되어 있더라도 `x`는 `"2.0 KB"`가 됩니다(날짜/시간도 마찬가지로 기본 구성을 사용함).

```nu
const x = $"(2kb)"
```

## 문자열 분할

[`split row`](/commands/docs/split_row.md) 명령은 구분 기호를 기반으로 문자열에서 목록을 만듭니다.

```nu
"red,green,blue" | split row ","
# => ╭───┬───────╮
# => │ 0 │ red   │
# => │ 1 │ green │
# => │ 2 │ blue  │
# => ╰───┴───────╯
```

[`split column`](/commands/docs/split_column.md) 명령은 구분 기호를 기반으로 문자열에서 테이블을 만듭니다. 이것은 테이블에 일반적인 열 이름을 적용합니다.

```nu
"red,green,blue" | split column ","
# => ╭───┬─────────┬─────────┬─────────╮
# => │ # │ column1 │ column2 │ column3 │
# => ├───┼─────────┼─────────┼─────────┤
# => │ 0 │ red     │ green   │ blue    │
# => ╰───┴─────────┴─────────┴─────────╯
```

마지막으로 [`split chars`](/commands/docs/split_chars.md) 명령은 문자열을 문자 목록으로 분할합니다.

```nu
'aeiou' | split chars
# => ╭───┬───╮
# => │ 0 │ a │
# => │ 1 │ e │
# => │ 2 │ i │
# => │ 3 │ o │
# => │ 4 │ u │
# => ╰───┴───╯
```

## [`str`](/commands/docs/str.md) 명령

많은 문자열 함수는 [`str`](/commands/docs/str.md) 명령의 하위 명령입니다. `help str`를 사용하여 전체 목록을 얻을 수 있습니다.

예를 들어, [`str contains`](/commands/docs/str_contains.md)를 사용하여 문자열에 특정 하위 문자열이 포함되어 있는지 확인할 수 있습니다.

```nu
"hello world" | str contains "o wo"
# => true
```

(간결함을 위해 `=~` 연산자(아래 설명)를 선호할 수도 있습니다.)

### 문자열 자르기

[`str trim`](/commands/docs/str_trim.md) 명령으로 문자열의 양쪽을 자를 수 있습니다. 기본적으로 [`str trim`](/commands/docs/str_trim.md) 명령은 문자열의 양쪽에서 공백을 자릅니다. 예시:

```nu
'       My   string   ' | str trim
# => My   string
```

`--right` 및 `--left` 옵션을 사용하여 자를 쪽을 지정할 수 있습니다. (`-r` 및 `-l`이 각각 약식 옵션임)

특정 문자를 자르려면 `--char <Character>` 또는 `-c <Character>`를 사용하여 자를 문자를 지정하십시오.

다음은 모든 옵션이 작동하는 예입니다.

```nu
'=== Nu shell ===' | str trim -r -c '='
# => === Nu shell
```

### 하위 문자열

하위 문자열은 문자열의 슬라이스입니다. 시작점과 끝점이 있습니다. 다음은 하위 문자열을 사용하는 예입니다.

```nu
'Hello World!' | str index-of 'o'
# => 4
'Hello World!' | str index-of 'r'
# => 8
'Hello World!' | str substring 4..8
# => o Wo
```

### 문자열 채우기

[`fill`](/commands/docs/fill.md) 명령으로 문자열에 패딩을 추가할 수 있습니다. 패딩은 문자열이 특정 길이가 될 때까지 문자를 추가합니다. 예시:

```nu
'1234' | fill -a right -c '0' -w 10
# => 0000001234
'1234' | fill -a left -c '0' -w 10 | str length
# => 10
```

### 문자열 뒤집기

이것은 [`str reverse`](/commands/docs/str_reverse.md) 명령으로 쉽게 할 수 있습니다.

```nu
'Nushell' | str reverse
# => llehsuN
['Nushell' 'is' 'cool'] | str reverse
# => ╭───┬─────────╮
# => │ 0 │ llehsuN │
# => │ 1 │ si      │
# => │ 2 │ looc    │
# => ╰───┴─────────╯
```

## 문자열 구문 분석

[`parse`](/commands/docs/parse.md) 명령으로 문자열을 열로 구문 분석할 수 있습니다. 예시:

```nu
'Nushell 0.80' | parse '{shell} {version}'
# => ╭───┬─────────┬─────────╮
# => │ # │  shell  │ version │
# => ├───┼─────────┼─────────┤
# => │ 0 │ Nushell │ 0.80    │
# => ╰───┴─────────┴─────────╯
'where all data is structured!' | parse --regex '(?P<subject>\w*\s?\w+) is (?P<adjective>\w+)'
# => ╭───┬──────────┬────────────╮
# => │ # │ subject  │ adjective  │
# => ├───┼──────────┼────────────┤
# => │ 0 │ all data │ structured │
# => ╰───┴──────────┴────────────╯
```

문자열에 쉼표로 구분되거나 탭으로 구분되거나 여러 공백으로 구분된 데이터가 포함된 것으로 알려진 경우 [`from csv`](/commands/docs/from_csv.md), [`from tsv`](/commands/docs/from_tsv.md) 또는 [`from ssv`](/commands/docs/from_ssv.md)를 사용할 수 있습니다.

```nu
"acronym,long\nAPL,A Programming Language" | from csv
# => ╭───┬─────────┬────────────────────────╮
# => │ # │ acronym │          long          │
# => ├───┼─────────┼────────────────────────┤
# => │ 0 │ APL     │ A Programming Language │
# => ╰───┴─────────┴────────────────────────╯
"name  duration\nonestop.mid  4:06" | from ssv
# => ╭───┬─────────────┬──────────╮
# => │ # │    name     │ duration │
# => ├───┼─────────────┼──────────┤
# => │ 0 │ onestop.mid │ 4:06     │
# => ╰───┴─────────────┴──────────╯
"rank\tsuit\nJack\tSpades\nAce\tClubs" | from tsv
# => ╭───┬──────┬────────╮
# => │ # │ rank │  suit  │
# => ├───┼──────┼────────┤
# => │ 0 │ Jack │ Spades │
# => │ 1 │ Ace  │ Clubs  │
# => ╰───┴──────┴────────╯
```

## 문자열 비교

표준 `==` 및 `!=` 연산자 외에도 문자열을 서로 비교하기 위한 몇 가지 연산자가 있습니다.

Bash 및 Perl에 익숙한 사람들은 정규식 비교 연산자를 인식할 것입니다.

```nu
'APL' =~ '^\w{0,3}$'
# => true
'FORTRAN' !~ '^\w{0,3}$'
# => true
```

더 간단한 비교를 위해 두 가지 다른 연산자가 있습니다.

```nu
'JavaScript' starts-with 'Java'
# => true
'OCaml' ends-with 'Caml'
# => true
```

## 문자열 변환

문자열을 다른 유형으로 변환하고 다른 유형에서 변환하는 방법에는 여러 가지가 있습니다.

### 문자열로 변환

1. [`into string`](/commands/docs/into_string.md) 사용. 예: `123 | into string`
2. 문자열 보간 사용. 예: `$'(123)'`

### 문자열에서 변환

1. [`into <type>`](/commands/docs/into.md) 사용. 예: `'123' | into int`

## 문자열 색상 지정

[`ansi`](/commands/docs/ansi.md) 명령으로 문자열에 색상을 지정할 수 있습니다. 예시:

```nu
$'(ansi purple_bold)This text is a bold purple!(ansi reset)'
```

`ansi purple_bold`는 텍스트를 굵은 보라색으로 만듭니다.
`ansi reset`은 색상을 기본값으로 재설정합니다.

::: tip
색상 지정된 문자열은 항상 `ansi reset`으로 끝나야 합니다.
:::
