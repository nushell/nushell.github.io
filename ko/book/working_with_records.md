# 레코드 작업

:::tip
레코드는 테이블의 개별 행과 거의 동일합니다. 레코드를 본질적으로 "한 행 테이블"로 생각할 수 있습니다. 따라서 테이블 행에서 작동하는 대부분의 명령은 레코드에서도 _또한_ 작동합니다. 예를 들어, [`update`](/commands/docs/update.md)는 레코드와 함께 사용할 수 있습니다.

```nu
let my_record = {
 name: "Sam"
 age: 30
 }
$my_record | update age { $in + 1 }
# => ╭──────┬─────╮
# => │ name │ Sam │
# => │ age  │ 31  │
# => ╰──────┴─────╯
```

`my_record` [변수는 불변](variables.md)입니다. [파이프라인](pipelines.md)에서 반환된 업데이트된 레코드는 코드 블록에 표시된 대로 인쇄됩니다. `my_record` 변수는 여전히 원래 값을 보유하고 있습니다. `$my_record.age`는 여전히 `30`입니다.

:::

## 레코드 만들기

레코드는 0개 이상의 키-값 쌍 매핑 모음입니다. JSON 객체와 유사하며 동일한 구문을 사용하여 만들 수 있습니다.

```nu
# 누셸
{ "apples": 543, "bananas": 411, "oranges": 0 }
# => ╭─────────┬─────╮
# => │ apples  │ 543 │
# => │ bananas │ 411 │
# => │ oranges │ 0   │
# => ╰─────────┴─────╯
# JSON
'{ "apples": 543, "bananas": 411, "oranges": 0 }' | from json
# => ╭─────────┬─────╮
# => │ apples  │ 543 │
# => │ bananas │ 411 │
# => │ oranges │ 0   │
# => ╰─────────┴─────╯
```

누셸에서 레코드의 키-값 쌍은 공백이나 줄 바꿈으로 구분할 수도 있습니다.

::: tip
레코드는 많은 필드를 가질 수 있으므로 기본적으로 왼쪽에서 오른쪽이 아닌 세로로 표시됩니다. 레코드를 왼쪽에서 오른쪽으로 표시하려면 nuon으로 변환하십시오. 예시:

```nu
  {
    name: "Sam"
    rank: 10
  } | to nuon
  # =>   {name: Sam, rank: 10}
```

:::

## 레코드 업데이트

목록과 마찬가지로 레코드에 값을 [`insert`](/commands/docs/insert.md)할 수 있습니다. 예를 들어, 배를 좀 추가해 보겠습니다.

```nu
{ "apples": 543, "bananas": 411, "oranges": 0 }
| insert pears { 21 }
# => ╭─────────┬─────╮
# => │ apples  │ 543 │
# => │ bananas │ 411 │
# => │ oranges │ 0   │
# => │ pears   │ 21  │
# => ╰─────────┴─────╯
```

값을 [`update`](/commands/docs/update.md)할 수도 있습니다.

```nu
{ "apples": 543, "bananas": 411, "oranges": 0 }
| update oranges { 100 }
# => ╭─────────┬─────╮
# => │ apples  │ 543 │
# => │ bananas │ 411 │
# => │ oranges │ 100 │
# => ╰─────────┴─────╯
```

새 필드가 있는 레코드의 복사본을 만들려면 다음 중 하나를 수행할 수 있습니다.

- [`merge`](/commands/docs/merge.md) 명령 사용:

  ```nu
  let first_record = { name: "Sam", rank: 10 }
  $first_record | merge { title: "Mayor" }
  # =>   ╭───────┬───────╮
  # =>   │ name  │ Sam   │
  # =>   │ rank  │ 10    │
  # =>   │ title │ Mayor │
  # =>   ╰───────┴───────╯
  ```

- [스프레드 연산자](/book/operators#spread-operator)(`...`)를 사용하여 새 레코드 내에서 첫 번째 레코드를 확장합니다.

  ```nu
  let first_record = { name: "Sam", rank: 10 }
  {
    ...$first_record
    title: "Mayor"
  }
  # =>   ╭───────┬───────╮
  # =>   │ name  │ Sam   │
  # =>   │ rank  │ 10    │
  # =>   │ title │ Mayor │
  # =>   ╰───────┴───────╯
  ```

## 레코드 반복

레코드를 테이블로 전치하여 레코드의 키-값 쌍을 반복할 수 있습니다.

```nu
{ "apples": 543, "bananas": 411, "oranges": 0 }
| transpose fruit count
| each {|f| $"We have ($f.count) ($f.fruit)" }
# => ╭───┬─────────────────────╮
# => │ 0 │ We have 543 apples  │
# => │ 1 │ We have 411 bananas │
# => │ 2 │ We have 0 oranges   │
# => ╰───┴─────────────────────╯
```

## 레코드 값 액세스

레코드 값(및 기타 구조화된 데이터)에 액세스하는 방법에 대한 자세한 내용은 [구조화된 데이터 탐색 및 액세스](/book/navigating_structured_data.md)를 참조하십시오.

## 기타 레코드 명령

[테이블 작업](./working_with_tables.md)을 참조하십시오. 테이블 행에서 작동하는 명령은 일반적으로 레코드에서도 동일한 방식으로 작동합니다.
