# 목록 작업

:::tip
목록은 테이블의 개별 열과 동일합니다. 목록을 본질적으로 "열 이름이 없는 한 열 테이블"로 생각할 수 있습니다. 따라서 열에서 작동하는 모든 명령은 목록에서도 _또한_ 작동합니다. 예를 들어, [`where`](/commands/docs/where.md)는 목록과 함께 사용할 수 있습니다.

```nu
[bell book candle] | where ($it =~ 'b')
# => ╭───┬──────╮
# => │ 0 │ bell │
# => │ 1 │ book │
# => ╰───┴──────╯
```

:::

## 목록 만들기

목록은 순서가 지정된 값 모음입니다.
목록은 공백, 줄 바꿈 및/또는 쉼표로 구분된 값을 둘러싼 대괄호를 사용하여 만듭니다.
예를 들어, `[foo bar baz]` 또는 `[foo, bar, baz]`입니다.

::: tip
누셸 목록은 JSON 배열과 유사합니다. JSON 배열을 나타내는 동일한 `[ "Item1", "Item2", "Item3" ]`을 사용하여 누셸 목록을 만들 수도 있습니다.
:::

## 목록 업데이트

파이프라인을 통해 흐르는 목록에 값을 [`insert`](/commands/docs/insert.md)할 수 있습니다. 예를 들어 목록 중간에 값 `10`을 삽입해 보겠습니다.

```nu
[1, 2, 3, 4] | insert 2 10
# => [1, 2, 10, 3, 4]
```

[`update`](/commands/docs/update.md)를 사용하여 두 번째 요소를 값 `10`으로 바꿀 수도 있습니다.

```nu
[1, 2, 3, 4] | update 1 10
# => [1, 10, 3, 4]
```

## 목록에서 항목 제거 또는 추가

[`insert`](/commands/docs/insert.md) 및 [`update`](/commands/docs/update.md) 외에도 [`prepend`](/commands/docs/prepend.md) 및 [`append`](/commands/docs/append.md)가 있습니다. 이를 통해 각각 목록의 시작 또는 끝에 삽입할 수 있습니다.

예시:

```nu
let colors = [yellow green]
let colors = ($colors | prepend red)
let colors = ($colors | append purple)
let colors = ($colors ++ ["blue"])
let colors = (["black"] ++ $colors)
$colors
# => [black red yellow green purple blue]
```

목록에서 항목을 제거하려는 경우 여러 가지 방법이 있습니다. [`skip`](/commands/docs/skip.md)을 사용하면 입력에서 첫 번째 행을 건너뛸 수 있고, [`drop`](/commands/docs/drop.md)을 사용하면 목록 끝에서 특정 번호가 매겨진 행을 건너뛸 수 있습니다.

```nu
let colors = [red yellow green purple]
let colors = ($colors | skip 1)
let colors = ($colors | drop 2)
$colors
# => [yellow]
```

또한 각각 목록의 끝 또는 시작에서 [`take`](/commands/docs/take.md)할 수 있는 [`last`](/commands/docs/last.md) 및 [`first`](/commands/docs/first.md)도 있습니다.

```nu
let colors = [red yellow green purple black magenta]
let colors = ($colors | last 3)
$colors
# => [purple black magenta]
```

그리고 목록의 시작부터,

```nu
let colors = [yellow green purple]
let colors = ($colors | first 2)
$colors
# => [yellow green]
```

### 스프레드 연산자 사용

하나 이상의 목록을 함께 추가하고 선택적으로 그 사이에 값을 산재시키려면 [스프레드 연산자](/book/operators#spread-operator)(`...`)를 사용할 수도 있습니다.

```nu
let x = [1 2]
[
  ...$x
  3
  ...(4..7 | take 2)
]
# => ╭───┬───╮
# => │ 0 │ 1 │
# => │ 1 │ 2 │
# => │ 2 │ 3 │
# => │ 3 │ 4 │
# => │ 4 │ 5 │
# => ╰───┴───╯
```

## 목록 반복

목록의 항목을 반복하려면 각 항목에 대해 수행할 작업을 지정하는 Nu 코드 [블록](types_of_data.html#blocks)과 함께 [`each`](/commands/docs/each.md) 명령을 사용합니다. 블록 매개변수(예: `{ |elt| print $elt }`의 `|elt|`)는 현재 목록 항목이지만, 필요한 경우 `index` 및 `item` 값을 제공하기 위해 [`enumerate`](/commands/docs/enumerate.md) 필터를 사용할 수 있습니다. 예시:

```nu
let names = [Mark Tami Amanda Jeremy]
$names | each { |elt| $"Hello, ($elt)!" }
# "Hello, Mark!"와 세 개의 유사한 줄을 출력합니다.

$names | enumerate | each { |elt| $"($elt.index + 1) - ($elt.item)" }
# "1 - Mark", "2 - Tami" 등을 출력합니다.
```

[`where`](/commands/docs/where.md) 명령을 사용하여 목록의 하위 집합을 만들 수 있으며, 조건을 기반으로 목록을 효과적으로 필터링합니다.

다음 예제는 이름이 "e"로 끝나는 모든 색상을 가져옵니다.

```nu
let colors = [red orange yellow green blue purple]
$colors | where ($it | str ends-with 'e')
# `where`에 전달된 블록은 부울로 평가되어야 합니다.
# 이것은 [orange blue purple] 목록을 출력합니다.
```

이 예제에서는 `7`보다 큰 값만 유지합니다.

```nu
let scores = [7 10 8 6 7]
$scores | where $it > 7 # [10 8]
```

[`reduce`](/commands/docs/reduce.md) 명령은 목록에서 단일 값을 계산합니다.
두 개의 매개변수를 사용하는 블록을 사용합니다. 현재 항목(일반적으로 `elt`로 명명됨)과 누산기(일반적으로 `acc`로 명명됨)입니다. 누산기의 초기 값을 지정하려면 `--fold` (`-f`) 플래그를 사용하십시오.
`elt`를 `index` 및 `item` 값을 갖도록 변경하려면 [`enumerate`](/commands/docs/enumerate.md) 필터를 사용하십시오.
예시:

```nu
let scores = [3 8 4]
$"total = ($scores | reduce { |elt, acc| $acc + $elt })" # total = 15

$"total = ($scores | math sum)" # 더 쉬운 접근 방식, 동일한 결과

$"product = ($scores | reduce --fold 1 { |elt, acc| $acc * $elt })" # product = 96

$scores | enumerate | reduce --fold 0 { |elt, acc| $acc + $elt.index * $elt.item } # 0*3 + 1*8 + 2*4 = 16
```

## 목록 액세스

::: tip 참고
다음은 기본 개요입니다. 이 주제에 대한 자세한 내용은 [구조화된 데이터 탐색 및 액세스](/book/navigating_structured_data.md) 장을 참조하십시오.
:::

지정된 인덱스에서 목록 항목에 액세스하려면 `$name`이 목록을 보유하는 변수인 `$name.index` 형식을 사용합니다.

예를 들어, 아래 목록의 두 번째 요소는 `$names.1`로 액세스할 수 있습니다.

```nu
let names = [Mark Tami Amanda Jeremy]
$names.1 # Tami를 제공합니다.
```

인덱스가 일부 변수 `$index`에 있는 경우 `get` 명령을 사용하여 목록에서 항목을 추출할 수 있습니다.

```nu
let names = [Mark Tami Amanda Jeremy]
let index = 1
$names | get $index # Tami를 제공합니다.
```

[`length`](/commands/docs/length.md) 명령은 목록의 항목 수를 반환합니다.
예를 들어, `[red green blue] | length`는 `3`을 출력합니다.

[`is-empty`](/commands/docs/is-empty.md) 명령은 문자열, 목록 또는 테이블이 비어 있는지 여부를 결정합니다.
목록과 함께 다음과 같이 사용할 수 있습니다.

```nu
let colors = [red green blue]
$colors | is-empty # false

let colors = []
$colors | is-empty # true
```

`in` 및 `not-in` 연산자는 값이 목록에 있는지 여부를 테스트하는 데 사용됩니다. 예시:

```nu
let colors = [red green blue]
'blue' in $colors # true
'yellow' in $colors # false
'gold' not-in $colors # true
```

[`any`](/commands/docs/any.md) 명령은 목록의 모든 항목이 주어진 조건을 만족하는지 여부를 결정합니다.
예시:

```nu
let colors = [red green blue]
# 색상 이름이 "e"로 끝나는 것이 있습니까?
$colors | any {|elt| $elt | str ends-with "e" } # true

# 색상 이름의 길이가 3보다 작은 것이 있습니까?
$colors | any {|elt| ($elt | str length) < 3 } # false

let scores = [3 8 4]
# 7보다 큰 점수가 있습니까?
$scores | any {|elt| $elt > 7 } # true

# 홀수인 점수가 있습니까?
$scores | any {|elt| $elt mod 2 == 1 } # true
```

[`all`](/commands/docs/all.md) 명령은 목록의 모든 항목이 주어진 조건을 만족하는지 여부를 결정합니다.
예시:

```nu
let colors = [red green blue]
# 모든 색상 이름이 "e"로 끝납니까?
$colors | all {|elt| $elt | str ends-with "e" } # false

# 모든 색상 이름의 길이가 3 이상입니까?
$colors | all {|elt| ($elt | str length) >= 3 } # true

let scores = [3 8 4]
# 모든 점수가 7보다 큽니까?
$scores | all {|elt| $elt > 7 } # false

# 모든 점수가 짝수입니까?
$scores | all {|elt| $elt mod 2 == 0 } # false
```

## 목록 변환

[`flatten`](/commands/docs/flatten.md) 명령은 중첩된 목록의 항목을 최상위 목록에 추가하여 기존 목록에서 새 목록을 만듭니다.
이것은 모든 깊이에서 중첩된 목록을 평탄화하기 위해 여러 번 호출할 수 있습니다.
예시:

```nu
[1 [2 3] 4 [5 6]] | flatten # [1 2 3 4 5 6]

[[1 2] [3 [4 5 [6 7 8]]]] | flatten | flatten | flatten # [1 2 3 4 5 6 7 8]
```

[`wrap`](/commands/docs/wrap.md) 명령은 목록을 테이블로 변환합니다. 각 목록 값은 단일 열이 있는 별도의 행으로 변환됩니다.

```nu
let zones = [UTC CET Europe/Moscow Asia/Yekaterinburg]

# 선택한 시간대에 대한 세계 시계 표시
$zones | wrap 'Zone' | upsert Time {|row| (date now | date to-timezone $row.Zone | format date '%Y.%m.%d %H:%M')}
```
