---
title: jq vs Nushell
---

# jq vs Nushell

[`jq`](https://jqlang.github.io/jq/) 和 `nu` 都能够以可组合的方式转换数据。本实战指南将引导您完成常见的数据操作任务，旨在帮助您建立使用 Nushell 的有效心智模型。

所有示例都将使用 JSON 以保持示例之间的一致性。

## 消费 JSON

让我们从基础开始：消费 JSON 字符串。

在 `jq` 中，输入总是期望为 JSON，所以我们简单地这样做：

```sh
echo '{"title": "jq vs Nushell", "publication_date": "2023-11-20"}' | jq -r '.'
```

在 `nu` 中，我们需要明确指定，因为 Nushell 有更广泛的输入选择：

```nu
'{"title": "jq vs Nushell", "publication_date": "2023-11-20"}'
| from json
# => ╭──────────────────┬───────────────╮
# => │ title            │ jq vs Nushell │
# => │ publication_date │ 2023-11-20    │
# => ╰──────────────────┴───────────────╯
```

`jq` 的输出是 JSON 字符串，而在 `nu` 中它是 Nushell 值。要将任何管道的输出作为 JSON 获取，只需在末尾应用 [`to json`](/commands/docs/to_json.html)：

```nu
'[{"name": "Alice", "age": 30}, {"name": "Bob", "age": 25}]'
| from json
| to json
```

输出：

```json
{
  "title": "jq vs Nushell",
  "publication_date": "2023-11-20"
}
```

当您的 JSON 数据存储在文件中时，您可以使用 [open](/commands/docs/open.html) 而不是 [from json](/commands/docs/from_json.html)。

在我们深入示例之前，以下词汇表可以帮助您熟悉 Nushell 数据类型如何映射到 jq 数据类型。

| Nushell | jq             |
| ------- | -------------- |
| integer | number         |
| decimal | number         |
| string  | string         |
| boolean | boolean        |
| null    | null           |
| list    | array          |
| record  | object         |
| table   | not applicable |
| command | filter         |

## 基本操作

### 选择值

在 `jq` 中，要从对象获取值，我们这样做：

```sh
echo '{"name": "Alice", "age": 30}' | jq -r '.name'
```

在 `nu` 中我们这样做：

```nu
'{"name": "Alice", "age": 30}' | from json | get name
# => Alice
```

### 过滤列表

在 `jq` 中，要过滤数组，我们这样做：

```sh
echo '[{"name": "Alice", "age": 30}, {"name": "Bob", "age": 25}]' |
jq -r '.[] | select(.age > 28)'
```

在 `nu` 中我们这样做：

```nu
'[{"name": "Alice", "age": 30}, {"name": "Bob", "age": 25}]'
| from json
| where age > 28
# => ╭───┬───────┬─────╮
# => │ # │ name  │ age │
# => ├───┼───────┼─────┤
# => │ 0 │ Alice │  30 │
# => ╰───┴───────┴─────╯
```

### 映射列表

在 `jq` 中，要映射列表，我们这样做：

```sh
echo '[1, 2, 3, 4, 5]' |
jq -r 'map(. * 2)'
```

在 `nu` 中我们这样做：

```nu
'[1, 2, 3, 4, 5]'
| from json
| each { |x| $x * 2 }
# => ╭───┬────╮
# => │ 0 │  2 │
# => │ 1 │  4 │
# => │ 2 │  6 │
# => │ 3 │  8 │
# => │ 4 │ 10 │
# => ╰───┴────╯
```

注意，您可以依赖 `$in` 自动绑定来获得稍微更紧凑的块：

```nu
'[1, 2, 3, 4, 5]'
| from json
| each { $in * 2 }
```

### 映射记录

在 `jq` 中，要映射记录，我们这样做：

```sh
echo '{"items": [{"name": "Apple", "price": 1}, {"name": "Banana", "price": 0.5}]}' |
jq -r '.items | map({(.name): (.price * 2)}) | add'
```

在 `nu` 中我们这样做：

```nu
'{"items": [{"name": "Apple", "price": 1}, {"name": "Banana", "price": 0.5}]}'
| from json
| get items
| update price {|row| $row.price * 2}
# => ╭───┬────────┬───────╮
# => │ # │  name  │ price │
# => ├───┼────────┼───────┤
# => │ 0 │ Apple  │     2 │
# => │ 1 │ Banana │  1.00 │
# => ╰───┴────────┴───────╯
```

在这种情况下，nu 不需要创建新记录，因为我们可以利用记录列表实际上是表的事实。然而，在其他情况下可能需要，正如我们在[组合记录](#composing-records)中看到的那样。

### 排序列表

在 `jq` 中，要排序列表，我们这样做：

```sh
echo '[3, 1, 4, 2, 5]' |
jq -r 'sort'
```

在 `nu` 中我们这样做：

```nu
'[3, 1, 4, 2, 5]'
| from json
| sort
# => ╭───┬───╮
# => │ 0 │ 1 │
# => │ 1 │ 2 │
# => │ 2 │ 3 │
# => │ 3 │ 4 │
# => │ 4 │ 5 │
# => ╰───┴───╯
```

### 过滤列表中的唯一值

在 `jq` 中，要过滤列表保留唯一值，我们这样做：

```sh
echo '[1, 2, 2, 3, 4, 4, 5]' |
jq -r 'unique'
```

在 `nu` 中我们这样做：

```nu
'[1, 2, 2, 3, 4, 4, 5]'
| from json
| uniq
# => ╭───┬───╮
# => │ 0 │ 1 │
# => │ 1 │ 2 │
# => │ 2 │ 3 │
# => │ 3 │ 4 │
# => │ 4 │ 5 │
# => ╰───┴───╯
```

### 组合过滤器

在 `jq` 中，要组合过滤器，我们这样做：

```sh
echo '[{"name": "Alice", "age": 30}, {"name": "Bob", "age": 25}]' |
jq -r '.[] | select(.age > 28) | .name'
```

在 `nu` 中我们这样做：

```nu
'[{"name": "Alice", "age": 30}, {"name": "Bob", "age": 25}]'
| from json
| where age > 28
| get name
# => ╭───┬───────╮
# => │ 0 │ Alice │
# => ╰───┴───────╯
```

### 分割字符串

在 `jq` 中，要分割字符串，我们这样做：

```sh
echo '{"name": "Alice Smith"}' |
jq -r '.name | split(" ") | .[0]'
```

在 `nu` 中我们这样做：

```nu
'{"name": "Alice Smith"}'
| from json
| get name
| split words
| get 0
# => Alice
```

### 条件逻辑

在 `jq` 中使用 `if` 表达式，我们这样做：

```sh
echo '{"name": "Alice", "age": 30}' |
jq -r 'if .age > 18 then "Adult" else "Child" end'
```

在 `nu` 中我们这样做：

```nu
'{"name": "Alice", "age": 30}'
| from json
| if $in.age > 18 { "Adult" } else { "Child" }
# => Adult
```

### 处理 `null` 值

在 `jq` 中，要过滤掉 `null` 值，我们这样做：

```sh
echo '[1, null, 3, null, 5]' |
jq -r 'map(select(. != null))'
```

在 `nu` 中我们这样做：

```nu
'[1, null, 3, null, 5]'
| from json
| where { $in != null }
# => ╭───┬───╮
# => │ 0 │ 1 │
# => │ 1 │ 3 │
# => │ 2 │ 5 │
# => ╰───┴───╯
```

或者，您可以使用 [`compact`](/commands/docs/compact.html)：

```nu
'[1, null, 3, null, 5]'
| from json
| compact
```

### 格式化输出

在 `jq` 中，要输出格式化字符串，我们这样做：

```sh
echo '{"name": "Alice", "age": 30}' |
jq -r "Name: \(.name), Age: \(.age)"
```

在 `nu` 中我们这样做：

```nu
'{"name": "Alice", "age": 30}'
| from json
| items { |key, value| ["Name" $value] | str join ": " }
| str join ", "
# => Name: Alice, Name: 30
```

这种方法有点复杂，但如果我们[安装完整版本](https://github.com/nushell/nushell/releases)，其中包含*额外命令*，我们可以受益于 [`format`](/commands/docs/format.html)：

```nu
'{"name": "Alice", "age": 30}'
| from json
| format "Name: {name}, Age: {age}"
```

### 组合记录

在 `jq` 中，要组合新的 JSON 对象（类似于 Nushell 中的记录），我们这样做：

```sh
echo '{"name": "Alice", "age": 30}' |
jq -r '{name: .name, age: (.age + 5)}'
```

在 `nu` 中我们这样做：

```nu
'{"name": "Alice", "age": 30}'
| from json
| {name: $in.name, age: ($in.age + 5)}
# => ╭──────┬───────╮
# => │ name │ Alice │
# => │ age  │ 35    │
# => ╰──────┴───────╯
```

## 处理嵌套项

### 过滤嵌套项

在 `jq` 中，要递归过滤树结构，我们这样做：

```sh
echo '{"data": {"value": 42, "nested": {"value": 24}}}' |
jq -r '.. | .value?'
```

在 `nu` 中，没有内置命令来实现这一点，但是，我们可以定义自己的可重用命令。请参阅[附录：自定义命令](#appendix-custom-commands)了解下面示例中显示的 `cherry-pick` 命令的实现。

```nu
'{"data": {"value": 42, "nested": {"value": 24}}}'
| from json
| cherry-pick { |x| $x.value? }
# => ╭───┬────╮
# => │ 0 │    │
# => │ 1 │ 42 │
# => │ 2 │ 24 │
# => ╰───┴────╯
```

### 过滤嵌套数组

在 `jq` 中，要过滤嵌套数组，我们这样做：

```sh
echo '{"data": [{"values": [1, 2, 3]}, {"values": [4, 5, 6]}]}' |
jq -r '.data[].values[] | select(. > 3)'
```

在 `nu` 中，我们可以利用[记录列表实际上是表](/zh-CN/book/types_of_data.html#tables)这一事实，简单地这样做：

```nu
'{"data": [{"values": [1, 2, 3]}, {"values": [4, 5, 6]}]}'
| from json
| get data.values
| flatten
| where {|x| $x > 3}
# => ╭───┬───╮
# => │ 0 │ 4 │
# => │ 1 │ 5 │
# => │ 2 │ 6 │
# => ╰───┴───╯
```

### 展平嵌套记录

在 `jq` 中，要展平所有记录并保留它们的路径，我们这样做：

```sh
echo '{"person": {"name": {"first": "Alice", "last": "Smith"}, "age": 30}}' |
jq -r 'paths as $p | select(getpath($p) | type != "object") | ($p | join(".")) + " = " + (getpath($p) | tostring)'
```

在 `nu` 中，没有内置命令来实现这一点。请参阅[附录：自定义命令](#appendix-custom-commands)了解下面示例中显示的 `flatten record-paths` 命令的实现。

```nu
'{"person": {"name": {"first": "Alice", "last": "Smith"}, "age": 30}}'
| from json
| flatten record-paths
# => ╭───┬───────────────────┬───────╮
# => │ # │       path        │ value │
# => ├───┼───────────────────┼───────┤
# => │ 0 │ person.name.first │ Alice │
# => │ 1 │ person.name.last  │ Smith │
# => │ 2 │ person.age        │    30 │
# => ╰───┴───────────────────┴───────╯
```

### 映射嵌套项

在 `jq` 中，要遍历树，我们可以这样做：

```sh
echo '{"data": {"value": 42, "nested": {"value": 24}}}' |
jq -r 'recurse | .value? | select(. != null) | { value: (. * 5) } | add'
```

在 `nu` 中，没有与 `recurse` 等效的内置函数。但是，我们可以重用[过滤嵌套项](#filtering-nested-items)中的解决方案来提取要操作的值：

```nu
'{"data": {"value": 42, "nested": {"value": 24}}}'
| from json
| cherry-pick { |x| $x.value? }
| compact
| each { |x| $x * 5 }
# => ╭───┬─────╮
# => │ 0 │ 210 │
# => │ 1 │ 120 │
# => ╰───┴─────╯
```

### 过滤和映射嵌套项

在 `jq` 中，要过滤和映射树，我们这样做：

```sh
echo '{"data": {"values": [1, 2, 3], "nested": {"values": [4, 5, 6]}}}' |
jq -r 'walk(if type == "number" then . * 2 else . end)'
```

在 `nu` 中，没有内置函数来实现这一点。请参阅[附录：自定义命令](#appendix-custom-commands)了解下面示例中显示的 `filter-map` 命令的实现。

````nu
'{"data": {"values": [1, 2, 3], "nested": {"values": [4, 5, 6]}}}'
| from json
| filter-map {|value| if ($value | describe) == "int" { $value * 2 } else { $value }}
# => ╭──────┬──────────────────────────────────────╮
# => │      │ ╭────────┬─────────────────────────╮ │
# => │ data │ │        │ ╭───┬───╮               │ │
# => │      │ │ values │ │ 0 │ 2 │               │ │
# => │      │ │        │ │ 1 │ 4 │               │ │
# => │      │ │        │ │ 2 │ 6 │               │ │
# => │      │ │        │ ╰───┴───╯               │ │
# => │      │ │        │ ╭────────┬────────────╮ │ │
# => │      │ │ nested │ │        │ ╭───┬────╮ │ │ │
# => │      │ │        │ │ values │ │ 0 │  8 │ │ │ │
# => │      │ │        │ │        │ │ 1 │ 10 │ │ │ │
# => │      │ │        │ │        │ │ 2 │ 12 │ │ │ │
# => │      │ │        │ │        │ ╰───┴────╯ │ │ │
# => │      │ │        │ ╰────────┴────────────╯ │ │
# => │      │ ╰────────┴─────────────────────────╯ │
# => ╰──────┴──────────────────────────────────────╯

## 分组和聚合

### 按键分组记录

在 `jq` 中，要按键分组记录列表，我们这样做：

```sh
echo '[{"category": "A", "value": 10}, {"category": "B", "value": 20}, {"category": "A", "value": 5}]' |
jq -r 'group_by(.category)'
````

在 `nu` 中我们这样做：

```nu
'[{"category": "A", "value": 10}, {"category": "B", "value": 20}, {"category": "A", "value": 5}]'
| from json
| group-by --to-table category
# => ╭───┬───────┬──────────────────────────╮
# => │ # │ group │          items           │
# => ├───┼───────┼──────────────────────────┤
# => │ 0 │ A     │ ╭───┬──────────┬───────╮ │
# => │   │       │ │ # │ category │ value │ │
# => │   │       │ ├───┼──────────┼───────┤ │
# => │   │       │ │ 0 │ A        │    10 │ │
# => │   │       │ │ 1 │ A        │     5 │ │
# => │   │       │ ╰───┴──────────┴───────╯ │
# => │ 1 │ B     │ ╭───┬──────────┬───────╮ │
# => │   │       │ │ # │ category │ value │ │
# => │   │       │ ├───┼──────────┼───────┤ │
# => │   │       │ │ 0 │ B        │    20 │ │
# => │   │       │ ╰───┴──────────┴───────╯ │
# => ╰───┴───────┴──────────────────────────╯
```

注意 `--to-table` 是在 [版本 0.87.0](blog/2023-11-14-nushell_0_87_0.html) 中添加到 Nushell 的。在此之前，您必须对 `group-by` 产生的记录进行 [`transpose`](/commands/docs/transpose)，这对于大型数据集来说速度要慢得多。

### 聚合分组值

在 `jq` 中，要聚合分组值，我们这样做：

```sh
echo '[{"category": "A", "value": 10}, {"category": "B", "value": 20}, {"category": "A", "value": 5}]' |
jq -r 'group_by(.category) | map({category: .[0].category, sum: map(.value) | add})'
```

在 `nu` 中我们这样做：

```nu
'[{"category": "A", "value": 10}, {"category": "B", "value": 20}, {"category": "A", "value": 5}]'
| from json
| group-by --to-table category
| update items { |row| $row.items.value | math sum }
| rename category sum
```

### 聚合后过滤

在 `jq` 中，要在聚合后过滤，我们这样做：

```sh
echo '[{"category": "A", "value": 10}, {"category": "B", "value": 20}, {"category": "A", "value": 5}]' |
jq -r 'group_by(.category) | map({category: .[0].category, sum: (map(.value) | add)}) | .[] | select(.sum > 17)'
```

在 `nu` 中我们这样做：

```nu
'[{"category": "A", "value": 10}, {"category": "B", "value": 20}, {"category": "A", "value": 5}]'
| from json
| group-by --to-table category
| update items { |row| $row.items.value | math sum }
| rename category value
| where value > 17
# => ╭───┬──────────┬───────╮
# => │ # │ category │ value │
# => ├───┼──────────┼───────┤
# => │ 0 │ B        │    20 │
# => ╰───┴──────────┴───────╯
```

### 自定义聚合

在 `jq` 中，要应用自定义聚合，我们这样做：

```sh
echo '[{"value": 10}, {"value": 20}, {"value": 30}]' |
jq -r 'reduce .[] as $item (0; . + $item.value)'
```

在 `nu` 中我们这样做：

```nu
'[{"value": 10}, {"value": 20}, {"value": 30}]'
| from json
| reduce -f 0 { |item, acc| $acc + $item.value }
# => 60
```

## 其他操作

### 计算平均值

在 `jq` 中，要计算平均值，我们这样做：

```sh
echo '[{"score": 90}, {"score": 85}, {"score": 95}]' |
jq -r 'map(.score) | add / length'
```

在 `nu` 中我们这样做：

```nu
'[{"score": 90}, {"score": 85}, {"score": 95}]'
| from json
| get score
| math avg
# => 90
```

### 生成直方图分箱

在 `jq` 中，要计算直方图的分箱，我们这样做：

```sh
echo '[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]' |
jq -r 'group_by(. / 5 | floor * 5) | map({ bin: .[0], count: length })'
```

在 `nu` 中我们这样做：

```nu
'[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]'
| from json
| group-by --to-table { $in // 5 * 5 }
| each { |row| {bin: $row.items.0, count: ($row.items | length)} }
# => ╭───┬─────┬───────╮
# => │ # │ bin │ count │
# => ├───┼─────┼───────┤
# => │ 0 │   1 │     4 │
# => │ 1 │   5 │     5 │
# => │ 2 │  10 │     5 │
# => │ 3 │  15 │     1 │
# => ╰───┴─────┴───────╯
```

注意，如果您想要计算直方图，可以受益于 [`histogram`](/commands/docs/histogram) 命令。

## 附录：自定义命令

本节提供了本实战指南中使用的自定义命令的实现。请注意，它们是说明性的，并且没有针对大型输入进行优化。如果您对此感兴趣，[插件](/zh-CN/book/plugins.html)可能是答案，因为它们可以用通用语言（如 Rust 或 Python）编写。

```nu
use toolbox.nu *
help commands | where command_type == "custom"
# => ╭──────┬─────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────────────────╮
# => │    # │          name           │                                              usage                                              │
# => ├──────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────┤
# => │    0 │ cherry-pick             │ A command for cherry-picking values from a record key recursively                               │
# => │    1 │ filter-map              │ A command for walking through a complex data structure and transforming its values recursively  │
# => │    2 │ flatten record-paths    │ A command for flattening trees whilst keeping paths as keys                                     │
# => ╰──────┴─────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────────────────╯
```

```nu
# toolbox.nu
use std/assert

# A command for cherry-picking values from a record key recursively
export def cherry-pick [
    test               # The test function to run over each element
    list: list = []    # The initial list for collecting cherry-picked values
] {
    let input = $in

    if ($input | describe) =~ "record|table" {
        $input
        | values
        | reduce --fold $list { |value, acc|
            $acc | append [($value | cherry-pick $test)]
          }
        | prepend [(do $test $input)]
        | flatten
    } else {
        $list
    }
}


#[test]
def test_deep_record_with_key [] {
    assert equal ({data: {value: 42, nested: {value: 442}}} | cherry-pick {|x| $x.value?}) [null 42 442]
    assert equal ({value: 42, nested: {value: 442, nested: {other: 4442}}} | cherry-pick {|x| $x.value?}) [42 442 null]
    assert equal ({
        value: 1,
        nested: {value: 2, nested: {terminal: 3}}
        terminal: 4,
        nested2: {value: 5}} | cherry-pick {|x| $x.value?}) [1 2 null 5]
}

#[test]
def test_record_without_key [] {
    assert equal ({data: 1} | cherry-pick {|x| $x.value?}) [null]
}

#[test]
def test_integer [] {
    assert equal (1 | cherry-pick {|x| $x.value?}) []
}

def test_string [] {
    assert equal ("foo" | cherry-pick {|x| $x.value?}) []
}

#[test]
def test_list [] {
    assert equal (["foo"] | cherry-pick {|x| $x.value?}) []
}

#[test]
def test_table [] {
    assert equal ([[a b]; [1.1 1.2] [2.1 2.2]] | cherry-pick {|x| $x.value?}) [null null]
    assert equal ([[a b]; [1.1 1.2] [2.1 2.2]] | cherry-pick {|x| $x.b?}) [1.2 2.2]
}

#[test]
def test_record_with_key [] {
    assert equal ({value: 42} | cherry-pick {|x| $x.value?}) [42]
    assert equal ({value: null} | cherry-pick {|x| $x.value?}) [null]
}

#[test]
def test_deep_record_without_key [] {
    assert equal ({data: {v: 42}} | cherry-pick {|x| $x.value?}) [null null]
}

# Like `describe` but dropping item types for collections.
export def describe-primitive []: any -> string {
  $in | describe | str replace --regex '<.*' ''
}


# A command for cherry-picking values from a record key recursively
export def "flatten record-paths" [
    --separator (-s): string = "."    # The separator to use when chaining paths
] {
    let input = $in

    if ($input | describe) !~ "record" {
        error make {msg: "The record-paths command expects a record"}
    }

    $input | flatten-record-paths $separator
}

def flatten-record-paths [separator: string, ctx?: string] {
    let input = $in
    match ($input | describe-primitive) {
        "record" => {
            $input
            | items { |key, value|
                  let path = if $ctx == null { $key } else { [$ctx $key] | str join $separator }
                  {path: $path, value: $value}
              }
            | reduce -f [] { |row, acc|
                  $acc
                  | append ($row.value | flatten-record-paths $separator $row.path)
                  | flatten
              }
        },
        "list" => {
            $input
            | enumerate
            | each { |e|
                  {path: ([$ctx $e.index] | str join $separator), value: $e.item}
              }
        },
        "table" => {
            $input | enumerate | each { |r| $r.item | flatten-record-paths $separator ([$ctx $r.index] | str join $separator) }
        }
        "block" | "closure" => {
            error make {msg: "Unexpected type"}
        },
        _ => {
            {path: $ctx, value: $input}
        },
    }
}

#[test]
def test_record_path [] {
    assert equal ({a: 1} | flatten record-paths) [{path: "a", value: 1}]
    assert equal ({a: 1, b: [2 3]} | flatten record-paths) [[path value]; [a 1] ["b.0" 2] ["b.1" 3]]
    assert equal ({a: 1, b: {c: 2}} | flatten record-paths) [[path value]; [a 1] ["b.c" 2]]
    assert equal ({a: {b: {c: null}}} | flatten record-paths -s "->") [[path value]; ["a->b->c" null]]
}



# A command for walking through a complex data structure and transforming its values recursively
export def filter-map [mapping_fn: closure] {
    let input = $in

    match ($input | describe-primitive) {
        "record" => {
            $input
            | items { |key, value|
                  {key: $key, value: ($value | filter-map $mapping_fn)}
              }
            | transpose -rd
        },
        "list" => {
            $input
            | each { |value|
                  $value | filter-map $mapping_fn
              }
        },
        "table" | "block" | "closure" => { error make {msg: "unimplemented"} },
        _ => {
            do $mapping_fn $input
        },
    }
}

#[test]
def test_filtermap [] {
    assert equal ({a: 42} | filter-map {|x| if ($x | describe) == "int" { $x * 2 } else { $x }}) {a: 84}
    assert equal ({a: 1, b: 2, c: {d: 3}} | filter-map {|x| if ($x | describe) == "int" { $x * 2 } else { $x }}) {a: 2, b: 4, c: {d: 6}}
    assert equal ({a: 1, b: "2", c: {d: 3}} | filter-map {|x| if ($x | describe) == "int" { $x * 2 } else { $x }}) {a: 2, b: "2", c: {d: 6}}
}
```

## 致谢

所有 jq 示例均取自 [The Ultimate Interactive JQ Guide](https://ishan.page/blog/2023-11-06-jq-by-example/)。
