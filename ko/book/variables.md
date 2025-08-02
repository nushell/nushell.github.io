# 변수

누셸 값은 `let`, `const` 또는 `mut` 키워드를 사용하여 명명된 변수에 할당할 수 있습니다.
변수를 만든 후에는 `$` 다음에 이름을 사용하여 참조할 수 있습니다.

## 변수 유형

### 불변 변수

불변 변수는 선언 후 값을 변경할 수 없습니다. `let` 키워드를 사용하여 선언됩니다.

```nu
let val = 42
$val
# => 42
$val = 100
# => Error: nu::shell::assignment_requires_mutable_variable
# =>
# =>   × Assignment to an immutable variable.
# =>    ╭─[entry #10:1:1]
# =>  1 │ $val = 100
# =>    · ──┬─
# =>    ·   ╰── needs to be a mutable variable
# =>    ╰────
```

그러나 불변 변수는 '섀도잉'될 수 있습니다. 섀도잉은 다시 선언되어 동일한 범위 내에서 초기 값을 더 이상 사용할 수 없음을 의미합니다.

```nu
let val = 42                   # 변수 선언
do { let val = 101;  $val }    # 내부 범위에서 변수 섀도잉
# => 101
$val                           # 외부 범위에서 변수는 변경되지 않은 상태로 유지됩니다.
# => 42
let val = $val + 1             # 이제 외부 범위에서 원래 변수를 섀도잉합니다.
$val                           # 외부 범위에서 변수는 이제 섀도잉되고,
# => 43                               # 원래 값은 더 이상 사용할 수 없습니다.
```

### 가변 변수

가변 변수는 할당을 통해 값을 변경할 수 있습니다. `mut` 키워드를 사용하여 선언됩니다.

```nu
mut val = 42
$val += 27
$val
# => 69
```

가변 변수와 함께 사용되는 몇 가지 할당 연산자가 있습니다.

| 연산자 | 설명                                                                |
| -------- | -------------------------------------------------------------------------- |
| `=`      | 변수에 새 값을 할당합니다.                                        |
| `+=`     | 변수에 값을 더하고 합계를 새 값으로 만듭니다.               |
| `-=`     | 변수에서 값을 빼고 차이를 새 값으로 만듭니다. |
| `*=`     | 변수에 값을 곱하고 곱을 새 값으로 만듭니다.     |
| `/=`     | 변수를 값으로 나누고 몫을 새 값으로 만듭니다.       |
| `++=`    | 변수에 목록이나 값을 추가합니다.                                    |

::: tip 참고

1. `+=`, `-=`, `*=` 및 `/=`는 루트 연산이 작동할 것으로 예상되는 컨텍스트에서만 유효합니다. 예를 들어, `+=`는 덧셈을 사용하므로 일반적으로 덧셈이 실패하는 컨텍스트에서는 사용할 수 없습니다.
2. `++=`는 변수 **또는** 인수가 목록이어야 합니다.
   :::

#### 가변성에 대한 추가 정보

클로저 및 중첩된 `def`는 환경에서 가변 변수를 캡처할 수 없습니다. 예시

```nu
# 목록의 요소 수를 세는 순진한 방법
mut x = 0

[1 2 3] | each { $x += 1 }   # 오류: $x가 클로저에서 캡처됨
```

이러한 동작에 가변 변수를 사용하려면 루프를 사용하는 것이 좋습니다.

### 상수 변수

상수 변수는 구문 분석 시 완전히 평가될 수 있는 불변 변수입니다. 이것은 [`source`](/commands/docs/source.md), [`use`](/commands/docs/use.md) 및 [`plugin use`](/commands/docs/plugin_use.md)와 같이 구문 분석 시 인수 값을 알아야 하는 명령에 유용합니다. 자세한 설명은 [누셸 코드가 실행되는 방법](how_nushell_code_gets_run.md)을 참조하십시오. `const` 키워드를 사용하여 선언됩니다.

```nu
const script_file = 'path/to/script.nu'
source $script_file
```

## 가변 변수와 불변 변수 중에서 선택

대부분의 사용 사례에는 불변 변수를 사용하십시오.

누셸이 기본적으로 불변 변수를 사용하는 이유가 궁금할 수 있습니다. 누셸 개발의 처음 몇 년 동안 가변 변수는 언어 기능이 아니었습니다. 누셸 개발 초기에 우리는 언어에서 더 데이터 중심적인 함수형 스타일을 사용하여 얼마나 오래 갈 수 있는지 확인하기로 결정했습니다. 이 실험은 누셸이 병렬 처리를 도입했을 때 그 가치를 보여주었습니다. 누셸 스크립트에서 [`each`](/commands/docs/each.md)에서 [`par-each`](/commands/docs/par-each.md)로 전환하여 입력에 대해 해당 코드 블록을 병렬로 실행할 수 있습니다. 이것은 누셸의 디자인이 불변성, 구성 및 파이프라이닝에 크게 의존하기 때문에 가능합니다.

누셸에서 가변 변수에 대한 대부분의 사용 사례는 다음과 같은 기능적 솔루션을 가지고 있습니다.

- 불변 변수만 사용하므로...
- 성능이 더 좋습니다.
- 스트리밍을 지원합니다.
- 위에서 언급한 대로 `par-each`와 같은 추가 기능을 지원할 수 있습니다.

예를 들어, 루프 카운터는 가변 변수에 대한 일반적인 패턴이며 대부분의 반복 명령에 내장되어 있습니다. 예를 들어, [`each`](/commands/docs/each.md)와 [`enumerate`](/commands/docs/enumerate.md)를 사용하여 각 항목과 각 항목의 인덱스를 모두 얻을 수 있습니다.

```nu
ls | enumerate | each { |elt| $"Item #($elt.index) is size ($elt.item.size)" }
# => ╭───┬───────────────────────────╮
# => │ 0 │ Item #0 is size 812 B     │
# => │ 1 │ Item #1 is size 3.4 KiB   │
# => │ 2 │ Item #2 is size 11.0 KiB  │
# => │ 3 │ ...                       │
# => │ 4 │ Item #18 is size 17.8 KiB │
# => │ 5 │ Item #19 is size 482 B    │
# => │ 6 │ Item #20 is size 4.0 KiB  │
# => ╰───┴───────────────────────────╯
```

[`reduce`](/commands/docs/reduce.md) 명령을 사용하여 루프에서 변수를 변경하는 것과 같은 방식으로 작업할 수도 있습니다. 예를 들어, 문자열 목록에서 가장 긴 문자열을 찾으려면 다음과 같이 할 수 있습니다.

```nu
[one, two, three, four, five, six] | reduce {|current_item, max|
  if ($current_item | str length) > ($max | str length) {
      $current_item
  } else {
      $max
  }
}

three
```

`reduce`는 목록을 처리하지만 [`generate`](/commands/docs/generate.md) 명령은 외부 REST API와 같은 임의의 소스와 함께 사용할 수 있으며 가변 변수가 필요하지 않습니다. 다음은 매시간 로컬 날씨 데이터를 검색하고 해당 데이터에서 연속 목록을 생성하는 예입니다. `each` 명령을 사용하여 사용 가능해지면 각 새 목록 항목을 사용할 수 있습니다.

```nu
generate {|weather_station|
  let res = try {
    http get -ef $'https://api.weather.gov/stations/($weather_station)/observations/latest'
  } catch {
    null
  }
  sleep 1hr
  match $res {
    null => {
      next: $weather_station
    }
    _ => {
      out: ($res.body? | default '' | from json)
      next: $weather_station
    }
  }
} khot
| each {|weather_report|
    {
      time: ($weather_report.properties.timestamp | into datetime)
      temp: $weather_report.properties.temperature.value
    }
}
```

### 성능 고려 사항

불변 변수와 함께 [필터 명령](/commands/categories/filters.html)을 사용하는 것은 `for` 및 `while`과 같은 기존 흐름 제어 문과 함께 가변 변수를 사용하는 것보다 훨씬 성능이 뛰어난 경우가 많습니다. 예시:

- `for` 문을 사용하여 50,000개의 난수 목록 만들기:

  ```nu
  timeit {
    mut randoms = []
    for _ in 1..50_000 {
      $randoms = ($randoms | append (random int))
    }
  }
  ```

  결과: 1분 4초 191ms 135µs 90ns

- `each`를 사용하여 동일한 작업 수행:

  ```nu
  timeit {
    let randoms = (1..50_000 | each {random int})
  }
  ```

  결과: 19ms 314µs 205ns

- 10,000,000번 반복하는 `each` 사용:

  ```nu
  timeit {
    let randoms = (1..10_000_000 | each {random int})
  }
  ```

  결과: 4초 233ms 865µs 238ns

  많은 필터와 마찬가지로 `each` 문도 결과를 스트리밍하므로 파이프라인의 다음 단계는 결과를 변수로 수집하기를 기다리지 않고 계속 처리할 수 있습니다.

  위에서 언급했듯이 병렬화로 최적화할 수 있는 작업의 경우 `par-each`는 훨씬 더 극적인 성능 향상을 가져올 수 있습니다.

## 변수 이름

누셸의 변수 이름에는 포함할 수 있는 문자에 대한 몇 가지 제한 사항이 있습니다. 특히 다음 문자를 포함할 수 없습니다.

```text
.  [  (  {  +  -  *  ^  /  =  !  <  >  &  |
```

일부 스크립트에서 `$`로 시작하는 변수를 선언하는 것이 일반적입니다. 이것은 허용되며, `$`가 전혀 없는 것과 같습니다.

```nu
let $var = 42
# `let var = 42`와 동일
```
