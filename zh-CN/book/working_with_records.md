# 处理记录(Records)

:::tip
记录大致相当于表格中的单行数据。你可以把记录看作是一个"单行表格"。因此，大多数对表格行操作的命令也适用于记录。例如，[`update`](/commands/docs/update.md)命令可以用于记录：

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

注意`my_record`[变量是不可变的](variables.md)。管道操作后更新的记录会如代码块所示打印出来。`my_record`变量仍保持原值 - `$my_record.age`仍然是`30`。

:::

## 创建记录

记录是零个或多个键值对的集合。它类似于JSON对象，可以使用相同的语法创建：

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

在Nushell中，记录的键值对也可以用空格或换行符分隔。

::: tip
由于记录可能有很多字段，默认情况下它们会垂直显示而不是从左到右。要水平显示记录，可以将其转换为nuon格式。例如：

```nu
  {
    name: "Sam"
    rank: 10
  } | to nuon
  # =>   {name: Sam, rank: 10}
```

:::

## 更新记录

与列表类似，你可以在记录中[`insert`](/commands/docs/insert.md)值。例如，让我们添加一些梨子：

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

你也可以[`update`](/commands/docs/update.md)值：

```nu
{ "apples": 543, "bananas": 411, "oranges": 0 }
| update oranges { 100 }
# => ╭─────────┬─────╮
# => │ apples  │ 543 │
# => │ bananas │ 411 │
# => │ oranges │ 100 │
# => ╰─────────┴─────╯
```

要创建带有新字段的记录副本，你可以：

- 使用[`merge`](/commands/docs/merge.md)命令：

  ```nu
  let first_record = { name: "Sam", rank: 10 }
  $first_record | merge { title: "Mayor" }
  # =>   ╭───────┬───────╮
  # =>   │ name  │ Sam   │
  # =>   │ rank  │ 10    │
  # =>   │ title │ Mayor │
  # =>   ╰───────┴───────╯
  ```

- 使用[展开运算符](/zh-CN/book/operators#spread-operator)(`...`)在新记录中展开原记录：

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

你可以先将记录转换为表格，然后遍历其键值对：

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

## 访问记录值

有关如何访问记录值(和其他结构化数据)的详细说明，请参阅[导航和访问结构化数据](/zh-CN/book/navigating_structured_data.md)。

## 其他记录命令

参见[使用表格](./working_with_tables.md) - 记住，对表格行操作的命令通常对记录也适用。
