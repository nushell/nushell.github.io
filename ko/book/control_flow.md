# 제어 흐름

누셸은 여러 코드 그룹이 실행되는 방식을 결정하는 데 도움이 되는 여러 명령을 제공합니다. 프로그래밍 언어에서 이 기능은 종종 _제어 흐름_이라고 합니다.

::: tip
이 페이지에서 설명하는 모든 명령은 [블록](/book/types_of_data.html#blocks)을 사용한다는 점에 유의해야 합니다. 즉, [환경 변수](/book/environment.html) 및 기타 [가변 변수](/book/variables.html#mutable-variables)를 수정할 수 있습니다.
:::

## 이미 다룬 내용

아래에서는 제어 흐름과 관련된 몇 가지 명령을 다루지만, 그 전에 다른 섹션에서 이미 다룬 제어 흐름과 관련되거나 동일한 상황에서 사용할 수 있는 몇 가지 기능과 개념이 있다는 점에 유의해야 합니다. 여기에는 다음이 포함됩니다.

- [파이프라인](/book/pipelines.html) 페이지의 파이프.
- [데이터 유형](/book/types_of_data.html) 페이지의 클로저.
- [목록 작업](/book/working_with_lists.html) 페이지의 반복 명령. 예:
  - [`each`](/commands/docs/each.html)
  - [`where`](/commands/docs/where.html)
  - [`reduce`](/commands/docs/reduce.html)

## 선택 (조건부)

다음 명령은 주어진 조건에 따라 코드를 실행합니다.

::: tip
선택/조건부 명령은 이 페이지의 다른 명령과 달리 값을 반환하는 표현식입니다. 즉, 다음이 작동합니다.

```nu
'foo' | if $in == 'foo' { 1 } else { 0 } | $in + 2
# => 3
```

:::

### `if`

[`if`](/commands/docs/if.html)는 다른 프로그래밍 언어의 "if" 기능과 유사하게 하나 이상의 조건 결과에 따라 분기 [블록](/book/types_of_data.html#blocks)을 평가합니다. 예시:

```nu
if $x > 0 { 'positive' }
```

조건이 `true`일 때(`$x`가 0보다 클 때) `'positive'`를 반환하고 조건이 `false`일 때(`$x`가 0보다 작거나 같을 때) `null`을 반환합니다.

첫 번째 블록 뒤에 `if`에 `else` 분기를 추가할 수 있으며, 조건이 `false`일 때 `else` 블록에서 결과 값을 실행하고 반환합니다. 예시:

```nu
if $x > 0 { 'positive' } else { 'non-positive' }
```

이번에는 조건이 `true`일 때(`$x`가 0보다 클 때) `'positive'`를 반환하고 조건이 `false`일 때(`$x`가 0보다 작거나 같을 때) `'non-positive'`를 반환합니다.

다음과 같이 여러 `if`를 연결할 수도 있습니다.

```nu
if $x > 0 { 'positive' } else if $x == 0 { 'zero' } else { "negative" }
```

첫 번째 조건이 `true`일 때(`$x`가 0보다 클 때) `'positive'`를 반환하고, 첫 번째 조건이 `false`이고 다음 조건이 `true`일 때(`$x`가 0일 때) `'zero'`를 반환하고, 그렇지 않으면 `'negative'`를 반환합니다(`$x`가 0보다 작을 때).

### `match`

[`match`](/commands/docs/match.html)는 일치하도록 지정된 값을 기반으로 여러 조건부 분기 중 하나를 실행합니다. 목록 및 레코드와 같은 복합 유형의 값을 풀기 위해 [패턴 일치](/cookbook/pattern_matching.html)를 수행할 수도 있습니다.

[`match`](/commands/docs/match.html)의 기본 사용법은 다른 언어에서 일반적인 "switch" 문과 같이 다른 코드를 조건부로 실행할 수 있습니다. [`match`](/commands/docs/match.html)는 [`match`](/commands/docs/match.html) 단어 뒤의 값이 `=>` 앞의 각 분기 시작에 있는 값과 같은지 확인하고, 같으면 해당 분기의 `=>` 뒤에 있는 코드를 실행합니다.

```nu
match 3 {
    1 => 'one',
    2 => {
        let w = 'w'
        't' + $w + 'o'
    },
    3 => 'three',
    4 => 'four'
}
# => three
```

분기는 단일 값을 반환하거나, 두 번째 분기에서와 같이 [블록](/book/types_of_data.html#blocks)의 결과를 반환할 수 있습니다.

#### 모두 잡기 분기

주어진 값이 다른 조건과 일치하지 않을 때 일치하는 값이 `_`인 분기를 사용하여 모두 잡기 조건을 가질 수도 있습니다.

```nu
let foo = match 7 {
    1 => 'one',
    2 => 'two',
    3 => 'three',
    _ => 'other number'
}
$foo
# => other number
```

(참고로 [`match`](/commands/docs/match.html)는 표현식이므로 여기서 결과를 `$foo`에 할당할 수 있습니다.)

#### 패턴 일치

목록 및 레코드와 같은 유형에서 값을 "풀기" 위해 [패턴 일치](/cookbook/pattern_matching.html)를 사용할 수 있습니다. 그런 다음 풀고 싶은 부분에 변수를 할당하고 일치하는 표현식에서 사용할 수 있습니다.

```nu
let foo = { name: 'bar', count: 7 }
match $foo {
    { name: 'bar', count: $it } => ($it + 3),
    { name: _, count: $it } => ($it + 7),
    _ => 1
}
# => 10
```

두 번째 분기의 `_`는 `name`이 `'bar'`인 레코드뿐만 아니라 `name` 및 `count` 필드가 있는 모든 레코드와 일치함을 의미합니다.

#### 가드

분기가 일치해야 하는지 여부를 결정하기 위해 각 분기에 "가드"라는 추가 조건을 추가할 수도 있습니다. 이렇게 하려면 일치하는 패턴 뒤에 `if`를 넣고 `=>` 앞에 조건을 넣습니다.

```nu
let foo = { name: 'bar', count: 7 }
match $foo {
    { name: 'bar', count: $it } if $it < 5 => ($it + 3),
    { name: 'bar', count: $it } if $it >= 5 => ($it + 7),
    _ => 1
}
# => 14
```

---

[`match`](/commands/docs/match.html)에 대한 자세한 내용은 [패턴 일치 요리책 페이지](https://www.nushell.sh/cookbook/pattern_matching.html)에서 찾을 수 있습니다.

## 루프

루프 명령을 사용하면 코드 블록을 여러 번 반복할 수 있습니다.

### 루프 및 기타 반복 명령

루프 명령의 기능은 [`each`](/commands/docs/each.html) 또는 [`where`](/commands/docs/where.html)와 같이 목록이나 테이블의 요소에 클로저를 적용하는 명령과 유사하며, 많은 경우 어느 쪽으로든 동일한 작업을 수행할 수 있습니다. 예시:

```nu
mut result = []
for $it in [1 2 3] { $result = ($result | append ($it + 1)) }
$result
# => ╭───┬───╮
# => │ 0 │ 2 │
# => │ 1 │ 3 │
# => │ 2 │ 4 │
# => ╰───┴───╯


[1 2 3] | each { $in + 1 }
# => ╭───┬───╮
# => │ 0 │ 2 │
# => │ 1 │ 3 │
# => │ 2 │ 4 │
# => ╰───┴───╯
```

다른 언어에서 루프에 익숙하다면 루프를 사용하는 것이 유혹적일 수 있지만, 어느 쪽으로든 문제를 해결할 수 있을 때 클로저를 적용하는 명령을 사용하는 것이 더 [누셸 스타일](/book/thinking_in_nu.html)(관용적)로 간주됩니다. 그 이유는 루프 사용에 꽤 큰 단점이 있기 때문입니다.

#### 루프 단점

루프의 가장 큰 단점은 표현식인 [`each`](/commands/docs/each.html)와 달리 문이라는 것입니다. [`each`](/commands/docs/each.html)와 같은 표현식은 항상 일부 출력 값을 반환하지만 문은 그렇지 않습니다.

이는 불변 변수와 잘 작동하지 않으며 불변 변수를 사용하는 것이 더 [누셸 스타일](/book/thinking_in_nu.html#variables-are-immutable)로 간주된다는 것을 의미합니다. 이전 섹션의 예에서 미리 선언된 가변 변수가 없으면 [`for`](/commands/docs/each.html)를 사용하여 증가된 숫자의 목록이나 어떤 값이든 얻는 것이 불가능합니다.

문은 일부 출력이 필요한 누셸 파이프라인에서도 작동하지 않습니다. 실제로 누셸은 시도하면 오류를 발생시킵니다.

```nu
[1 2 3] | for x in $in { $x + 1 } | $in ++ [5 6 7]
# => Error: nu::parser::unexpected_keyword
# =>
# =>   × Statement used in pipeline.
# =>    ╭─[entry #5:1:1]
# =>  1 │ [1 2 3] | for x in $in { $x + 1 } | $in ++ [5 6 7]
# =>    ·           ─┬─
# =>    ·            ╰── not allowed in pipeline
# =>    ╰────
# =>   help: 'for' keyword is not allowed in pipeline. Use 'for' by itself, outside of a pipeline.
```

누셸은 매우 파이프라인 지향적이므로 [`each`](/commands/docs/each.html)와 같은 표현식 명령을 사용하는 것이 루프 문보다 일반적으로 더 자연스럽습니다.

#### 루프 장점

루프에 그렇게 큰 단점이 있다면 왜 존재할까요? 한 가지 이유는 [`each`](/commands/docs/each.html)에서 사용하는 것과 같은 클로저는 주변 환경의 가변 변수를 수정할 수 없기 때문입니다. 클로저에서 가변 변수를 수정하려고 하면 오류가 발생합니다.

```nu
mut foo = []
[1 2 3] | each { $foo = ($foo | append ($in + 1)) }
# => Error: nu::parser::expected_keyword
# =>
# =>   × Capture of mutable variable.
# =>    ╭─[entry #8:1:1]
# =>  1 │ [1 2 3] | each { $foo = ($foo | append ($in + 1)) }
# =>    ·                  ──┬─
# =>    ·                    ╰── capture of mutable variable
# =>    ╰────
```

클로저에서 환경 변수를 수정하면 할 수 있지만, 클로저 범위 내에서만 수정되고 다른 곳에서는 변경되지 않습니다. 그러나 루프는 [블록](/book/types_of_data.html#blocks)을 사용하므로 더 큰 범위 내에서 일반 가변 변수 또는 환경 변수를 수정할 수 있습니다.

```nu
mut result = []
for $it in [1 2 3] { $result = ($result | append ($it + 1)) }
$result
# => ╭───┬───╮
# => │ 0 │ 2 │
# => │ 1 │ 3 │
# => │ 2 │ 4 │
# => ╰───┴───╯
```

### `for`

[`for`](/commands/docs/for.html)는 범위나 목록 또는 테이블과 같은 컬렉션을 반복합니다.

```nu
for x in [1 2 3] { $x * $x | print }
# => 1
# => 4
# => 9
```

#### for 표현식 명령 대안

- [`each`](/commands/docs/each.html)
- [`par-each`](/commands/docs/par-each.html)
- [`where`](/commands/docs/where.html)/[`filter`](/commands/docs/filter.html)
- [`reduce`](/commands/docs/reduce.html)

### `while`

[`while`](/commands/docs/while.html)은 주어진 조건이 `false`가 될 때까지 동일한 코드 블록을 반복합니다.

```nu
mut x = 0; while $x < 10 { $x = $x + 1 }; $x
# => 10
```

#### while 표현식 명령 대안

"until" 및 기타 "while" 명령

- [`take until`](/commands/docs/take_until.html)
- [`take while`](/commands/docs/take_while.html)
- [`skip until`](/commands/docs/skip_until.html)
- [`skip while`](/commands/docs/skip_while.html)

### `loop`

[`loop`](/commands/docs/loop.html)는 블록을 무한정 반복합니다. [`break`](/commands/docs/break.html)(다음 섹션에서 설명)를 사용하여 반복 횟수를 제한할 수 있습니다. 대화형 프롬프트와 같이 지속적으로 실행되는 스크립트에 유용할 수도 있습니다.

```nu
mut x = 0; loop { if $x > 10 { break }; $x = $x + 1 }; $x
# => 11
```

### `break`

[`break`](/commands/docs/break.html)는 루프에서 코드 실행을 중지하고 루프 후에 실행을 재개합니다. 효과적으로 루프에서 "탈출"합니다.

```nu
for x in 1..10 { if $x > 3 { break }; print $x }
# => 1
# => 2
# => 3
```

### `continue`

[`continue`](/commands/docs/continue.html)는 현재 루프의 실행을 중지하고 루프의 나머지 코드를 건너뛰고 다음 루프로 이동합니다. [`for`](/commands/docs/for.html)가 주어진 모든 요소를 반복했거나 [`while`](/commands/docs/while.html)의 조건이 이제 false인 경우와 같이 루프가 정상적으로 종료되면 다시 반복되지 않고 루프 블록 후에 실행이 계속됩니다.

```nu
mut x = -1; while $x <= 6 { $x = $x + 1; if $x mod 3 == 0 { continue }; print $x }
# => 1
# => 2
# => 4
# => 5
# => 7
```

## 오류

### `error make`

[`error make`](/commands/docs/error_make.html)는 코드 실행과 이를 호출한 모든 코드 실행을 중지하는 오류를 생성하며, [`try`](/commands/docs/try.html) 블록에 의해 처리되거나 스크립트를 종료하고 오류 메시지를 출력할 때까지 계속됩니다. 이 기능은 다른 언어의 "예외"와 동일합니다.

```nu
print 'printed'; error make { msg: 'Some error info' }; print 'unprinted'
# => printed
# => Error:   × Some error info
# =>    ╭─[entry #9:1:1]
# =>  1 │ print 'printed'; error make { msg: 'Some error info' }; print 'unprinted'
# =>    ·                  ─────┬────
# =>    ·                       ╰── originates from here
# =>    ╰────
```

전달된 레코드는 이를 포착하는 코드나 결과 오류 메시지에 일부 정보를 제공합니다.

[`error make`](/commands/docs/error_make.html) 및 오류 개념에 대한 자세한 내용은 [자신만의 오류 만들기 페이지](/book/creating_errors.html)에서 확인할 수 있습니다.

### `try`

[`try`](/commands/docs/try.html)는 [`try`](/commands/docs/try.html)의 코드 블록 어디에서나 생성된 오류를 포착하고 블록 뒤의 코드 실행을 재개합니다.

```nu
try { error make { msg: 'Some error info' }}; print 'Resuming'
# => Resuming
```

여기에는 기본 제공 오류 포착이 포함됩니다.

```nu
try { 1 / 0 }; print 'Resuming'
# => Resuming
```

오류가 발생하면 결과 값은 `nothing`이 되고 오류가 발생하지 않으면 블록의 반환 값이 됩니다.

[`try`](/commands/docs/try.html) 블록 뒤에 `catch` 블록을 포함하면 [`try`](/commands/docs/try.html) 블록에서 오류가 발생한 경우 `catch` 블록의 코드를 실행합니다.

```nu
try { 1 / 0 } catch { 'An error happened!' } | $in ++ ' And now I am resuming.'
# => An error happened! And now I am resuming.
```

오류가 발생하지 않으면 `catch` 블록을 실행하지 않습니다.

`try`는 외부 명령에도 작동합니다.

```nu
try { ^nonexisting }; print 'a'
# => a

^nonexisting; print 'a'
# => Error: nu::shell::external_command
# =>
# =>   × External command failed
# =>    ╭─[entry #3:1:2]
# =>  1 │ ^nonexisting; print 'a'
# =>    ·  ─────┬─────
# =>    ·       ╰── Command `nonexisting` not found
# =>    ╰────
# =>   help: `nonexisting` is neither a Nushell built-in or a known external command
```

## 기타

### `return`

[`return`](/commands/docs/return.html)은 호출된 위치에서 클로저나 명령을 조기에 종료하고 나머지 명령/클로저를 실행하지 않고 주어진 값을 반환합니다. 클로저나 명령의 마지막 값도 반환되므로 자주 필요하지는 않지만 때로는 편리할 수 있습니다.

```nu
def 'positive-check' [it] {
    if $it > 0 {
        return 'positive'
    };

    'non-positive'
}
```

```nu
positive-check 3
# => positive

positive-check (-3)
# => non-positive

let positive_check = {|elt| if $elt > 0 { return 'positive' }; 'non-positive' }

do $positive_check 3
# => positive

do $positive_check (-3)
# => non-positive
```
