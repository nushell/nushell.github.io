# Working with Records

:::tip
Records are roughly equivalent to the individual rows of a table. You can think of a record as essentially being a "one-row table". Thus, most commands which operate on a table row _also_ operates on a record. For instance, [`update`](/commands/docs/update.md) can be used with records:

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

Note that the `my_record` [variable is immutable](variables.md). The updated record resulting from the [pipeline](pipelines.md) is printed as seen in the code block. The `my_record` variable still holds the original value - `$my_record.age` is still `30`.

:::

## Creating records

A record is a collection of zero or more key-value pair mappings. It is similar to a JSON object, and can be created using the same syntax:

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

In Nushell, the key-value pairs of a record can also be separated using spaces or line-breaks.

::: tip
As records can have many fields, they are, by default, displayed vertically rather than left-to-right. To display a record left-to-right, convert it to a nuon. For example:

```nu
  {
    name: "Sam"
    rank: 10
  } | to nuon
  # =>   {name: Sam, rank: 10}
```

:::

## Updating Records

As with lists, you can [`insert`](/commands/docs/insert.md) values in records. For example, let's add some pears:

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

You can also [`update`](/commands/docs/update.md) values:

```nu
{ "apples": 543, "bananas": 411, "oranges": 0 }
| update oranges { 100 }
# => ╭─────────┬─────╮
# => │ apples  │ 543 │
# => │ bananas │ 411 │
# => │ oranges │ 100 │
# => ╰─────────┴─────╯
```

To make a copy of a record with new fields, you can either:

- Use the [`merge`](/commands/docs/merge.md) command:

  ```nu
  let first_record = { name: "Sam", rank: 10 }
  $first_record | merge { title: "Mayor" }
  # =>   ╭───────┬───────╮
  # =>   │ name  │ Sam   │
  # =>   │ rank  │ 10    │
  # =>   │ title │ Mayor │
  # =>   ╰───────┴───────╯
  ```

- Use the [spread operator](/book/operators#spread-operator) (`...`) to expand the first record inside a new record:

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

## Iterating over a Record

Use the [items](/commands/docs/items.md) command to iterate over each pair of key and value:

```nu
{ "apples": 543, "bananas": 411, "oranges": 0 } | items {|fruit, count| $"We have ($fruit) ($count)" }
# => ╭───┬─────────────────────╮
# => │ 0 │ We have apples 543  │
# => │ 1 │ We have bananas 411 │
# => │ 2 │ We have oranges 0   │
# => ╰───┴─────────────────────╯
```

Alternatively, you can [transpose](/commands/docs/transpose.md) the record into a table with columns, and then iterate over rows:

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

## Accessing Record Values

See [Navigating and Accessing Structured Data](/book/navigating_structured_data.md) for an in-depth explanation of how to access record values (and other structured data).

## Other Record Commands

See [Working with Tables](./working_with_tables.md) - Remember, commands that operate on table rows will usually operate the same way on records.
