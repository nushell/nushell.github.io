---
next:
  text: 누셸 기본
  link: /book/nu_fundamentals.md
---
# 누셸 치트 시트

## 데이터 유형

문자열을 정수로 변환:

```nu
"12" | into int
```

현재 날짜를 제공된 시간대로 변환:

```nu
date now | date to-timezone "Europe/London"
```

레코드의 언어를 업데이트하고 지정되지 않은 경우 제공된 값을 삽입합니다.

```nu
{'name': 'nu', 'stars': 5, 'language': 'Python'} | upsert language 'Rust'
```

문자열 목록을 yaml로 변환:

```nu
[one two three] | to yaml
```

테이블 데이터 인쇄:

```nu
[[framework, language]; [Django, Python] [Laravel, PHP]]
```

테이블에서 두 개의 명명된 열을 선택하고 해당 값을 인쇄합니다.

```nu
[{name: 'Robert' age: 34 position: 'Designer'}
 {name: 'Margaret' age: 30 position: 'Software Developer'}
 {name: 'Natalie' age: 50 position: 'Accountant'}
] | select name position
```

## 문자열

텍스트 보간:

```nu
let name = "Alice"
$"greetings, ($name)!"
# => greetings, Alice!
```

쉼표 구분 기호로 텍스트를 분할하고 목록을 `string_list` 변수에 저장합니다.

```nu
let string_list = "one,two,three" | split row ","
$string_list
# => ╭───┬───────╮
# => │ 0 │ one   │
# => │ 1 │ two   │
# => │ 2 │ three │
# => ╰───┴───────╯
```

문자열에 하위 문자열이 포함되어 있는지 확인:

```nu
"Hello, world!" | str contains "o, w"
# => true
```

구분 기호로 여러 문자열 결합:

```nu
let str_list = [zero one two]
$str_list | str join ','
# => zero,one,two
```

인덱스로 텍스트 슬라이스:

```nu
'Hello World!' | str substring 4..8
# => o Wor
```

문자열을 명명된 열로 구문 분석:

```nu
'Nushell 0.80' | parse '{shell} {version}'
# => ╭───┬─────────┬─────────╮
# => │ # │  shell  │ version │
# => ├───┼─────────┼─────────┤
# => │ 0 │ Nushell │ 0.80    │
# => ╰───┴─────────┴─────────╯
```

쉼표로 구분된 값(csv) 구문 분석:

```nu
"acronym,long\nAPL,A Programming Language" | from csv
# => ╭───┬─────────┬────────────────────────╮
# => │ # │ acronym │          long          │
# => ├───┼─────────┼────────────────────────┤
# => │ 0 │ APL     │ A Programming Language │
# => ╰───┴─────────┴────────────────────────╯
```

명령줄 터미널에서 텍스트 색상 지정:

```nu
$'(ansi purple_bold)This text is a bold purple!(ansi reset)'
# => This text is a bold purple!
```

## 목록

인덱스에 목록 값 삽입:

```nu
[foo bar baz] | insert 1 'beeze'
# => ╭───┬───────╮
# => │ 0 │ foo   │
# => │ 1 │ beeze │
# => │ 2 │ bar   │
# => │ 3 │ baz   │
# => ╰───┴───────╯
```

인덱스로 목록 값 업데이트:

```nu
[1, 2, 3, 4] | update 1 10
# => ╭───┬────╮
# => │ 0 │  1 │
# => │ 1 │ 10 │
# => │ 2 │  3 │
# => │ 3 │  4 │
# => ╰───┴────╯
```

목록 값 앞에 추가:

```nu
let numbers = [1, 2, 3]
$numbers | prepend 0
# => ╭───┬───╮
# => │ 0 │ 0 │
# => │ 1 │ 1 │
# => │ 2 │ 2 │
# => │ 3 │ 3 │
# => ╰───┴───╯
```

목록 값 추가:

```nu
let numbers = [1, 2, 3]
$numbers | append 4
# => ╭───┬───╮
# => │ 0 │ 1 │
# => │ 1 │ 2 │
# => │ 2 │ 3 │
# => │ 3 │ 4 │
# => ╰───┴───╯
```

첫 번째 목록 값 슬라이스:

```nu
[cammomile marigold rose forget-me-not] | first 2
# => ╭───┬───────────╮
# => │ 0 │ cammomile │
# => │ 1 │ marigold  │
# => ╰───┴───────────╯
```

목록 반복, `elt`는 현재 목록 값입니다.

```nu
let planets = [Mercury Venus Earth Mars Jupiter Saturn Uranus Neptune]
$planets | each { |elt| $"($elt) is a planet of the solar system" }
# => ╭───┬─────────────────────────────────────────╮
# => │ 0 │ Mercury is a planet of the solar system │
# => │ 1 │ Venus is a planet of the solar system   │
# => │ 2 │ Earth is a planet of the solar system   │
# => │ 3 │ Mars is a planet of the solar system    │
# => │ 4 │ Jupiter is a planet of the solar system │
# => │ 5 │ Saturn is a planet of the solar system  │
# => │ 6 │ Uranus is a planet of the solar system  │
# => │ 7 │ Neptune is a planet of the solar system │
# => ╰───┴─────────────────────────────────────────╯
```

인덱스와 값으로 목록을 반복합니다.

```nu
$planets | enumerate | each { |elt| $"($elt.index + 1) - ($elt.item)" }
# => ╭───┬─────────────╮
# => │ 0 │ 1 - Mercury │
# => │ 1 │ 2 - Venus   │
# => │ 2 │ 3 - Earth   │
# => │ 3 │ 4 - Mars    │
# => │ 4 │ 5 - Jupiter │
# => │ 5 │ 6 - Saturn  │
# => │ 6 │ 7 - Uranus  │
# => │ 7 │ 8 - Neptune │
# => ╰───┴─────────────╯
```

목록을 단일 값으로 줄입니다. `reduce`는 목록의 각 요소에 적용되는 누산기에 대한 액세스를 제공합니다.

```nu
let scores = [3 8 4]
$"total = ($scores | reduce { |elt, acc| $acc + $elt })"
# => total = 15
```

초기 값으로 줄입니다(`--fold`).

```nu
let scores = [3 8 4]
$"total = ($scores | reduce --fold 1 { |elt, acc| $acc * $elt })"
# => total = 96
```

목록의 세 번째 항목에 대한 액세스를 제공합니다.

```nu
let planets = [Mercury Venus Earth Mars Jupiter Saturn Uranus Neptune]
$planets.2
# => Earth
```

목록의 문자열 중 `E`로 시작하는 것이 있는지 확인합니다.

```nu
let planets = [Mercury Venus Earth Mars Jupiter Saturn Uranus Neptune]
$planets | any {|elt| $elt | str starts-with "E" }
# => true
```

제공된 조건을 만족하는 항목을 슬라이스합니다.

```nu
let cond = {|x| $x < 0 }; [-1 -2 9 1] | take while $cond
# => ╭───┬────╮
# => │ 0 │ -1 │
# => │ 1 │ -2 │
# => ╰───┴────╯
```

## 테이블

테이블 정렬:

```nu
ls | sort-by size
```

테이블 정렬, 첫 번째 행 가져오기:

```nu
ls | sort-by size | first 5
```

동일한 열을 가진 두 테이블 연결:

```nu
let $a = [[first_column second_column third_column]; [foo bar snooze]]
let $b = [[first_column second_column third_column]; [hex seeze feeze]]
$a | append $b
# => ╭───┬──────────────┬───────────────┬──────────────╮
# => │ # │ first_column │ second_column │ third_column │
# => ├───┼──────────────┼───────────────┼──────────────┤
# => │ 0 │ foo          │ bar           │ snooze       │
# => │ 1 │ hex          │ seeze         │ feeze        │
# => ╰───┴──────────────┴───────────────┴──────────────╯
```

테이블의 마지막 열 제거:

```nu
let teams_scores = [[team score plays]; ['Boston Celtics' 311 3] ['Golden State Warriors', 245 2]]
$teams_scores | drop column
# => ╭───┬───────────────────────┬───────╮
# => │ # │         team          │ score │
# => ├───┼───────────────────────┼───────┤
# => │ 0 │ Boston Celtics        │   311 │
# => │ 1 │ Golden State Warriors │   245 │
# => ╰───┴───────────────────────┴───────╯
```

## 파일 및 파일 시스템

기본 텍스트 편집기로 텍스트 파일 열기:

```nu
start file.txt
```

문자열을 텍스트 파일에 저장:

```nu
'lorem ipsum ' | save file.txt
```

텍스트 파일 끝에 문자열 추가:

```nu
'dolor sit amet' | save --append file.txt
```

레코드를 file.json에 저장:

```nu
{ a: 1, b: 2 } | save file.json
```

파일 이름으로 파일 재귀적으로 검색:

```nu
glob **/*.{rs,toml} --depth 2
```

파일 감시, 변경될 때마다 명령 실행:

```nu
watch . --glob=**/*.rs {|| cargo test }
```

## 사용자 지정 명령

매개변수 유형이 문자열로 설정된 사용자 지정 명령:

```nu
def greet [name: string] {
    $"hello ($name)"
}
```

기본 매개변수가 누셸로 설정된 사용자 지정 명령:

```nu
def greet [name = "nushell"] {
    $"hello ($name)"
}
```

사용자 지정 명령에 대한 플래그를 정의하여 명명된 매개변수 전달:

```nu
def greet [
    name: string
    --age: int
] {
    [$name $age]
}

greet world --age 10
```

나이에 대한 약식 플래그(-a)가 있는 스위치로 플래그 사용:

```nu
def greet [
    name: string
    --age (-a): int
    --twice
] {
    if $twice {
        [$name $age $name $age]
    } else {
        [$name $age]
    }
}
greet -a 10 --twice hello
```

나머지 매개변수를 사용하여 임의의 수의 위치 인수를 사용하는 사용자 지정 명령:

```nu
def greet [...name: string] {
    print "hello all:"
    for $n in $name {
        print $n
    }
}
greet earth mars jupiter venus
# => hello all:
# => earth
# => mars
# => jupiter
# => venus
```

## 변수

불변 변수는 선언 후 값을 변경할 수 없습니다.

```nu
let val = 42
print $val
# => 42
```

변수 섀도잉(다른 범위에서 동일한 이름으로 변수 선언):

```nu
let val = 42
do { let val = 101;  $val }
# => 101
$val
# => 42
```

mut 키워드로 가변 변수 선언:

```nu
mut val = 42
$val += 27
$val
# => 69
```

클로저 및 중첩된 def는 환경에서 가변 변수를 캡처할 수 없습니다(오류).

```nu
mut x = 0
[1 2 3] | each { $x += 1 }
# => Error: nu::parser::expected_keyword
# =>
# =>   × Capture of mutable variable.
# =>    ╭─[entry #83:1:18]
# =>  1 │ [1 2 3] | each { $x += 1 }
# =>    ·                  ─┬
# =>    ·                   ╰── capture of mutable variable
# =>    ╰────
```

상수 변수는 불변이며 구문 분석 시 완전히 평가됩니다.

```nu
const file = 'path/to/file.nu'
source $file
```

제공된 경로가 잘못된 경우 오류 대신 null을 반환하려면 물음표 연산자 `?`를 사용합니다.

```nu
let files = (ls)
$files.name?.0?
```

파이프라인 결과를 변수에 할당:

```nu
let big_files = (ls | where size > 10kb)
$big_files
```

## 모듈

인라인 모듈 사용:

```nu
module greetings {
    export def hello [name: string] {
        $"hello ($name)!"
    }

    export def hi [where: string] {
        $"hi ($where)!"
    }
}
use greetings hello
hello "world"
```

파일에서 모듈을 가져오고 현재 범위에서 해당 환경을 사용합니다.

```nu
# greetings.nu
export-env {
    $env.MYNAME = "Arthur, King of the Britons"
}
export def hello [] {
    $"hello ($env.MYNAME)"
}

use greetings.nu
$env.MYNAME
# => Arthur, King of the Britons
greetings hello
# => hello Arthur, King of the Britons!
```

모듈에서 주 명령 사용:

```nu
# greetings.nu
export def hello [name: string] {
    $"hello ($name)!"
}

export def hi [where: string] {
    $"hi ($where)!"
}

export def main [] {
    "greetings and salutations!"
}

use greetings.nu
greetings
# => greetings and salutations!
greetings hello world
# => hello world!
```
