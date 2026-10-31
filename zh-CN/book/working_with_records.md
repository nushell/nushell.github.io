# 处理记录

:::tip
记录大致相当于表格中的单独一行。你可以把记录看作是一个“单行表格”。因此，大多数对表格行操作的命令*同样*适用于记录。例如，[`update`](/commands/docs/update.md) 可以用于记录：

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

请注意，`my_record` [变量是不可变的](variables.md)。[管道](pipelines.md)产生的更新后的记录会像代码块中显示的那样被打印出来。`my_record` 变量仍然保存着原始值——`$my_record.age` 仍然是 `30`。

:::

## 创建记录

记录是零个或多个键值对映射的集合。它类似于 JSON 对象，并且可以用相同的语法创建：

```nu
# Nushell
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

在 Nushell 中，记录的键值对也可以用空格或换行来分隔。

::: tip
由于记录可能有多个字段，默认情况下它们是纵向显示而不是横向显示。要让记录横向显示，请把它转换为 nuon。例如：

```nu
  {
    name: "Sam"
    rank: 10
  } | to nuon
  # =>   {name: Sam, rank: 10}
```

:::

## 更新记录

与列表一样，你可以在记录中 [`insert`](/commands/docs/insert.md) 值。例如，我们来添加一些梨：

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

你也可以 [`update`](/commands/docs/update.md) 值：

```nu
{ "apples": 543, "bananas": 411, "oranges": 0 }
| update oranges { 100 }
# => ╭─────────┬─────╮
# => │ apples  │ 543 │
# => │ bananas │ 411 │
# => │ oranges │ 100 │
# => ╰─────────┴─────╯
```

要创建一个带有新字段的记录副本，你可以：

- 使用 [`merge`](/commands/docs/merge.md) 命令：

  ```nu
  let first_record = { name: "Sam", rank: 10 }
  $first_record | merge { title: "Mayor" }
  # =>   ╭───────┬───────╮
  # =>   │ name  │ Sam   │
  # =>   │ rank  │ 10    │
  # =>   │ title │ Mayor │
  # =>   ╰───────┴───────╯
  ```

- 使用[展开运算符](operators.md#扩展运算符)（`...`）在新记录中展开第一个记录：

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

## 遍历记录

使用 [items](/commands/docs/items.md) 命令遍历每一对键值：

```nu
{ "apples": 543, "bananas": 411, "oranges": 0 } | items {|fruit, count| $"We have ($fruit) ($count)" }
# => ╭───┬─────────────────────╮
# => │ 0 │ We have apples 543  │
# => │ 1 │ We have bananas 411 │
# => │ 2 │ We have oranges 0   │
# => ╰───┴─────────────────────╯
```

或者，你也可以先用 [transpose](/commands/docs/transpose.md) 把记录转置成带列的表格，再逐行遍历：

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

## 转换记录

`record` 系列命令接收一个记录并返回一个记录，所以你不需要先把它 `transpose` 成表格再转回来，也不需要用 [`items`](/commands/docs/items.md) 配合 `into record` 重新构建。它们每一个也都接受表格，并对每一行生效。

[`record where`](/commands/docs/record_where.md) 保留 `key` 和 `value` 满足行条件的字段：

```nu
{ "apples": 543, "bananas": 411, "oranges": 0 } | record where value > 0
# => ╭─────────┬─────╮
# => │ apples  │ 543 │
# => │ bananas │ 411 │
# => ╰─────────┴─────╯
{ "apples": 543, "bananas": 411, "oranges": 0 } | record where key starts-with b
# => ╭─────────┬─────╮
# => │ bananas │ 411 │
# => ╰─────────┴─────╯
```

它也接受一个闭包，闭包接收键和值作为参数。若在条件之前加上 `--keys` 或 `--values`，闭包就只接收其中之一：

```nu
{ "apples": 543, "bananas": 411, "oranges": 0 } | record where --values {|count| $count > 500 }
# => ╭────────┬─────╮
# => │ apples │ 543 │
# => ╰────────┴─────╯
```

[`record each`](/commands/docs/record_each.md) 根据闭包返回的记录构造一个新记录，因此可以在一次处理中同时改变键和值：

```nu
{ "apples": 543, "bananas": 411, "oranges": 0 }
| record each {|fruit, count| {($fruit | str uppercase): ($count * 2)} }
# => ╭─────────┬──────╮
# => │ APPLES  │ 1086 │
# => │ BANANAS │ 822  │
# => │ ORANGES │ 0    │
# => ╰─────────┴──────╯
```

[`record walk`](/commands/docs/record_walk.md) 对嵌套在记录中任意位置的每个值运行闭包，并把结果放回原来的位置。闭包接收值和它的单元格路径。例如，隐藏配置记录中的每一处敏感值：

```nu
{db: {host: prod, password: hunter2}, api: {token: abc}}
| record walk {|value, path|
    if ($path | to text) =~ "(?i)secret|token|password" { "***" } else { $value }
}
| to nuon
# => {db: {host: prod, password: ***}, api: {token: ***}}
```

默认情况下只访问叶子节点。`--containers` 还会把嵌套的记录和列表也传给闭包，而 `--no-lists` 会把列表当作单个值，不再深入遍历。

[`record apply`](/commands/docs/record_apply.md) 接收一个由闭包组成的记录，并让每个闭包作用于同名的字段。没有对应闭包的字段保持原样：

```nu
{age: "42", email: "A@B.COM", tags: [x]} | record apply {age: {into int}, email: {str lowercase}}
# => ╭───────┬───────────────╮
# => │ age   │ 42            │
# => │ email │ a@b.com       │
# => │ tags  │ [list 1 item] │
# => ╰───────┴───────────────╯
```

由于表格就是记录的列表，同一份闭包记录也能转换每一行中的某一列：

```nu
[{name: a, size: "1"} {name: b, size: "2"}] | record apply {size: {into int}}
# => ╭───┬──────┬──────╮
# => │ # │ name │ size │
# => ├───┼──────┼──────┤
# => │ 0 │ a    │    1 │
# => │ 1 │ b    │    2 │
# => ╰───┴──────┴──────╯
```

若某个字段的闭包在输入中没有对应的字段，该闭包会被忽略；除非传入 `--strict`，此时会报错。

## 访问记录值

关于如何访问记录值（以及其它结构化数据）的深入说明，请参阅[导航与访问结构化数据](./navigating_structured_data.md)。

## 其它记录命令

请参阅[处理表格](./working_with_tables.md)——请记住，对表格行操作的命令通常以相同的方式作用于记录。
