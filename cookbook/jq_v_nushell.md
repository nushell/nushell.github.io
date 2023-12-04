---
title: jq vs Nushell
---

# jq vs Nushell

Both [`jq`](https://jqlang.github.io/jq/) and `nu` have the ability to transform data in a composable way. This cookbook will walk you through common data manipulation tasks with the aim of building a solid mental model for using Nushell effectively.

All examples will stick to JSON to keep parity between examples.

## Consuming JSON

Let's start with the basics: consuming a JSON string.

In `jq`, inputs are always expected to be JSON so we simply do:

```sh
echo '{"title": "jq vs Nushell", "publication_date": "2023-11-20"}' | jq -r '.'
```

In `nu`, we need to be explicit because Nushell has a wider range of input choices:

```nu
'{"title": "jq vs Nushell", "publication_date": "2023-11-20"}'
| from json
```

Output:

```
╭──────────────────┬───────────────╮
│ title            │ jq vs Nushell │
│ publication_date │ 2023-11-20    │
╰──────────────────┴───────────────╯
```

The output for `jq` is a JSON string whereas in `nu` it's a Nushell value. To get the output of any pipeline as JSON, simply apply a [`to json`](/commands/docs/to_json.html) at the end:

```nu
'[{"name": "Alice", "age": 30}, {"name": "Bob", "age": 25}]'
| from json
| to json
```

Output:

```json
{
  "title": "jq vs Nushell",
  "publication_date": "2023-11-20"
}
```

When your JSON data is stored in a file, you can use [open](/commands/docs/open.html) instead of [from json](/commands/docs/from_json.html).

Before we get into the examples, the following glossary can help familiarise yourself with how Nushell data types map to jq data types.

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

## Basic operations

### Selecting values

In `jq`, to get the value from an object we do:

```sh
echo '{"name": "Alice", "age": 30}' | jq -r '.name'
```

In `nu` we do:

```nu
'{"name": "Alice", "age": 30}' | from json | get name
```

Output:

```
Alice
```

### Filtering lists

In `jq`, to filter an array we do:

```sh
echo '[{"name": "Alice", "age": 30}, {"name": "Bob", "age": 25}]' |
jq -r '.[] | select(.age > 28)'
```

In `nu` we do:

```nu
'[{"name": "Alice", "age": 30}, {"name": "Bob", "age": 25}]'
| from json
| where age > 28
```

```
╭───┬───────┬─────╮
│ # │ name  │ age │
├───┼───────┼─────┤
│ 0 │ Alice │  30 │
╰───┴───────┴─────╯
```

### Mapping over lists

In `jq`, to map over a list we do:

```sh
echo '[1, 2, 3, 4, 5]' |
jq -r 'map(. * 2)'
```

In `nu` we do:

```nu
'[1, 2, 3, 4, 5]'
| from json
| each { |x| $x * 2 }
```

Output:

```
╭───┬────╮
│ 0 │  2 │
│ 1 │  4 │
│ 2 │  6 │
│ 3 │  8 │
│ 4 │ 10 │
╰───┴────╯
```

Note that you can rely on the `$in` auto-binding for a slightly more compact block:

```nu
'[1, 2, 3, 4, 5]'
| from json
| each { $in * 2 }
```

### Mapping over records

In `jq`, to map over a record we do:

```sh
echo '{"items": [{"name": "Apple", "price": 1}, {"name": "Banana", "price": 0.5}]}' |
jq -r '.items | map({(.name): (.price * 2)}) | add'
```

In `nu` we do:

```nu
'{"items": [{"name": "Apple", "price": 1}, {"name": "Banana", "price": 0.5}]}'
| from json
| get items
| update price {|row| $row.price * 2}
```

In this case nu does not require creating new records because we can leverage the fact that a list of records is a table. However, in other situations it might be required as we have seen in [Composing records](#composing-records).

Output:

```
╭───┬────────┬───────╮
│ # │  name  │ price │
├───┼────────┼───────┤
│ 0 │ Apple  │     2 │
│ 1 │ Banana │  1.00 │
╰───┴────────┴───────╯
```

### Sorting lists

In `jq`, to sort a list we do:

```sh
echo '[3, 1, 4, 2, 5]' |
jq -r 'sort'
```

In `nu` we do:

```nu
'[3, 1, 4, 2, 5]'
| from json
| sort
```

Output:

```
╭───┬───╮
│ 0 │ 1 │
│ 1 │ 2 │
│ 2 │ 3 │
│ 3 │ 4 │
│ 4 │ 5 │
╰───┴───╯
```

### Filtering distinct values in a list

In `jq`, to filter a list keeping unique values we do:

```sh
echo '[1, 2, 2, 3, 4, 4, 5]' |
jq -r 'unique'
```

In `nu` we do:

```nu
'[1, 2, 2, 3, 4, 4, 5]'
| from json
| uniq
```

Output:

```
╭───┬───╮
│ 0 │ 1 │
│ 1 │ 2 │
│ 2 │ 3 │
│ 3 │ 4 │
│ 4 │ 5 │
╰───┴───╯
```

### Combining filters

In `jq`, to combine filters we do:

```sh
echo '[{"name": "Alice", "age": 30}, {"name": "Bob", "age": 25}]' |
jq -r '.[] | select(.age > 28) | .name'
```

In `nu` we do:

```nu
'[{"name": "Alice", "age": 30}, {"name": "Bob", "age": 25}]'
| from json
| where age > 28
| get name
```

Output:

```
╭───┬───────╮
│ 0 │ Alice │
╰───┴───────╯
```

### Splitting strings

In `jq`, to split a string we do:

```sh
echo '{"name": "Alice Smith"}' |
jq -r '.name | split(" ") | .[0]'
```

In `nu` we do:

```nu
'{"name": "Alice Smith"}'
| from json
| get name
| split words
| get 0
```

Output:

```
Alice
```

### Conditional logic

In `jq` to work with `if` expressions we do:

```sh
echo '{"name": "Alice", "age": 30}' |
jq -r 'if .age > 18 then "Adult" else "Child" end'
```

In `nu` we do:

```nu
'{"name": "Alice", "age": 30}'
| from json
| if $in.age > 18 { "Adult" } else { "Child" }
```

```
Adult
```

### Handling `null` values

In `jq`, to filter out `null` values we do:

```sh
echo '[1, null, 3, null, 5]' |
jq -r 'map(select(. != null))'
```

In `nu` we do:

```nu
'[1, null, 3, null, 5]'
| from json
| where { $in != null }
```

Output:

```
╭───┬───╮
│ 0 │ 1 │
│ 1 │ 3 │
│ 2 │ 5 │
╰───┴───╯
```

Alternatively, you can use [`compact`](/commands/docs/compact.html):

```nu
'[1, null, 3, null, 5]'
| from json
| compact
```

### Formating output

In `jq`, to output a formatted string we do:

```sh
echo '{"name": "Alice", "age": 30}' |
jq -r "Name: \(.name), Age: \(.age)"
```

In `nu` we do:

```nu
'{"name": "Alice", "age": 30}'
| from json
| items { |key, value| ["Name" $value] | str join ": " }
| str join ", "
```

Output:

```
Name: Alice, Name: 30
```

This approach is a bit involved but if we [install the full version](https://github.com/nushell/nushell/releases) which includes the _extra commands_ we can benefit from the [`format`](/commands/docs/format.html):

```nu
'{"name": "Alice", "age": 30}'
| from json
| format "Name: {name}, Age: {age}"
```

### Composing records

In `jq`, to compose a new JSON object (akin to a record in Nushell) we do:

```sh
echo '{"name": "Alice", "age": 30}' |
jq -r '{name: .name, age: (.age + 5)}'
```

In `nu` we do:

```nu
'{"name": "Alice", "age": 30}'
| from json
| {name: $in.name, age: ($in.age + 5)}
```

Output:

```
╭──────┬───────╮
│ name │ Alice │
│ age  │ 35    │
╰──────┴───────╯
```

## Dealing with nested items

### Filtering nested items

In `jq`, to recursively filter a tree structure we do:

```sh
echo '{"data": {"value": 42, "nested": {"value": 24}}}' |
jq -r '.. | .value?'
```

In `nu`, there is no built-in command to achieve this, however, we can define our own reusable commands. See the [Appendix: Custom commands](#appendix-custom-commands) for an implementation of the command `cherry-pick` shown in the example below.

```nu
'{"data": {"value": 42, "nested": {"value": 24}}}'
| from json
| cherry-pick { |x| $x.value? }
```

Output:

```
╭───┬────╮
│ 0 │    │
│ 1 │ 42 │
│ 2 │ 24 │
╰───┴────╯
```

### Filtering nested arrays

In `jq`, to filter nested arrays we do:

```sh
echo '{"data": [{"values": [1, 2, 3]}, {"values": [4, 5, 6]}]}' |
jq -r '.data[].values[] | select(. > 3)'
```

In `nu` we can take advantage of the fact that [a list of records is in fact a table](/book/types_of_data.html#tables) and simply do:

```nu
'{"data": [{"values": [1, 2, 3]}, {"values": [4, 5, 6]}]}'
| from json
| get data.values
| flatten
| where {|x| $x > 3}
```

Output:

```
╭───┬───╮
│ 0 │ 4 │
│ 1 │ 5 │
│ 2 │ 6 │
╰───┴───╯
```

### Flattening nested records

In `jq`, to flatten all records preserving their path we do:

```sh
echo '{"person": {"name": {"first": "Alice", "last": "Smith"}, "age": 30}}' |
jq -r 'paths as $p | select(getpath($p) | type != "object") | ($p | join(".")) + " = " + (getpath($p) | tostring)'
```

In `nu`, there is no built-in command to achieve this. See the [Appendix: Custom commands](#appendix-custom-commands) for an implementation of the command `flatten record-paths` shown in the example below.

```nu
'{"person": {"name": {"first": "Alice", "last": "Smith"}, "age": 30}}'
| from json
| flatten record-paths
```

Output:

```
╭───┬───────────────────┬───────╮
│ # │       path        │ value │
├───┼───────────────────┼───────┤
│ 0 │ person.name.first │ Alice │
│ 1 │ person.name.last  │ Smith │
│ 2 │ person.age        │    30 │
╰───┴───────────────────┴───────╯
```

### Mapping over nested items

In `jq`, to traverse a tree we can do:

```sh
echo '{"data": {"value": 42, "nested": {"value": 24}}}' |
jq -r 'recurse | .value? | select(. != null) | { value: (. * 5) } | add'
```

In `nu`, there is no built-in function equivalent to `recurse`. However, we can reuse the solution from [Filtering nested items](#filtering-nested-items) to extract the values to manipulate:

```nu
'{"data": {"value": 42, "nested": {"value": 24}}}'
| from json
| cherry-pick { |x| $x.value? }
| compact
| each { |x| $x * 5 }
```

Output:

```
╭───┬─────╮
│ 0 │ 210 │
│ 1 │ 120 │
╰───┴─────╯
```

### Filtering and mapping over nested items

In `jq`, to filter and map over a tree we do:

```sh
echo '{"data": {"values": [1, 2, 3], "nested": {"values": [4, 5, 6]}}}' |
jq -r 'walk(if type == "number" then . * 2 else . end)'
```

In `nu`, there is no built-in function to achieve this. See the [Appendix: Custom commands](#appendix-custom-commands) for an implementation of the command `filter-map` shown in the example below.

```nu
'{"data": {"values": [1, 2, 3], "nested": {"values": [4, 5, 6]}}}'
| from json
| filter-map {|value| if ($value | describe) == "int" { $value * 2 } else { $value }}
```

Output:

```
╭──────┬──────────────────────────────────────╮
│      │ ╭────────┬─────────────────────────╮ │
│ data │ │        │ ╭───┬───╮               │ │
│      │ │ values │ │ 0 │ 2 │               │ │
│      │ │        │ │ 1 │ 4 │               │ │
│      │ │        │ │ 2 │ 6 │               │ │
│      │ │        │ ╰───┴───╯               │ │
│      │ │        │ ╭────────┬────────────╮ │ │
│      │ │ nested │ │        │ ╭───┬────╮ │ │ │
│      │ │        │ │ values │ │ 0 │  8 │ │ │ │
│      │ │        │ │        │ │ 1 │ 10 │ │ │ │
│      │ │        │ │        │ │ 2 │ 12 │ │ │ │
│      │ │        │ │        │ ╰───┴────╯ │ │ │
│      │ │        │ ╰────────┴────────────╯ │ │
│      │ ╰────────┴─────────────────────────╯ │
╰──────┴──────────────────────────────────────╯
```

## Grouping and aggregating

### Grouping records by key

In `jq`, to group a list of records by key we do:

```sh
echo '[{"category": "A", "value": 10}, {"category": "B", "value": 20}, {"category": "A", "value": 5}]' |
jq -r 'group_by(.category)'
```

In `nu` we do:

```nu
'[{"category": "A", "value": 10}, {"category": "B", "value": 20}, {"category": "A", "value": 5}]'
| from json
| group-by --to-table category
```

Note that `--to-table` was added to Nushell in [version 0.87.0](blog/2023-11-14-nushell_0_87_0.html). Before that you had to [`transpose`](/commands/docs/transpose) the record resulting from `group-by` which was substantially slower for large sets.

Output:

```
╭───┬───────┬──────────────────────────╮
│ # │ group │          items           │
├───┼───────┼──────────────────────────┤
│ 0 │ A     │ ╭───┬──────────┬───────╮ │
│   │       │ │ # │ category │ value │ │
│   │       │ ├───┼──────────┼───────┤ │
│   │       │ │ 0 │ A        │    10 │ │
│   │       │ │ 1 │ A        │     5 │ │
│   │       │ ╰───┴──────────┴───────╯ │
│ 1 │ B     │ ╭───┬──────────┬───────╮ │
│   │       │ │ # │ category │ value │ │
│   │       │ ├───┼──────────┼───────┤ │
│   │       │ │ 0 │ B        │    20 │ │
│   │       │ ╰───┴──────────┴───────╯ │
╰───┴───────┴──────────────────────────╯
```

### Aggregating grouped values

In `jq`, to aggregate grouped values we do:

```sh
echo '[{"category": "A", "value": 10}, {"category": "B", "value": 20}, {"category": "A", "value": 5}]' |
jq -r 'group_by(.category) | map({category: .[0].category, sum: map(.value) | add})'
```

In `nu` we do:

```nu
'[{"category": "A", "value": 10}, {"category": "B", "value": 20}, {"category": "A", "value": 5}]'
| from json
| group-by --to-table category
| update items { |row| $row.items.value | math sum }
| rename category sum
```

### Filtering after aggregating

In `jq`, to filter after aggregating we do:

```sh
echo '[{"category": "A", "value": 10}, {"category": "B", "value": 20}, {"category": "A", "value": 5}]' |
jq -r 'group_by(.category) | map({category: .[0].category, sum: (map(.value) | add)}) | .[] | select(.sum > 17)'
```

In `nu` we do:

```nu
'[{"category": "A", "value": 10}, {"category": "B", "value": 20}, {"category": "A", "value": 5}]'
| from json
| group-by --to-table category
| update items { |row| $row.items.value | math sum }
| rename category value
| where value > 17
```

Output:

```
╭───┬──────────┬───────╮
│ # │ category │ value │
├───┼──────────┼───────┤
│ 0 │ B        │    20 │
╰───┴──────────┴───────╯
```

### Custom aggregations

In `jq`, to apply a custom aggregation we do:

```sh
echo '[{"value": 10}, {"value": 20}, {"value": 30}]' |
jq -r 'reduce .[] as $item (0; . + $item.value)'
```

In `nu` we do:

```nu
'[{"value": 10}, {"value": 20}, {"value": 30}]'
| from json
| reduce -f 0 { |item, acc| $acc + $item.value }
```

Output:

```
60
```

## Other operations

### Calculating averages

In `jq`, to calculate an average we do:

```sh
echo '[{"score": 90}, {"score": 85}, {"score": 95}]' |
jq -r 'map(.score) | add / length'
```

In `nu` we do:

```nu
'[{"score": 90}, {"score": 85}, {"score": 95}]'
| from json
| get score
| math avg
```

Output:

```
90
```

### Generating histogram bins

In `jq`, to calculate bins for a histogram we do:

```sh
echo '[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]' |
jq -r 'group_by(. / 5 | floor * 5) | map({ bin: .[0], count: length })'
```

In `nu` we do:

```nu
'[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]'
| from json
| group-by --to-table { $in // 5 * 5 }
| each { |row| {bin: $row.items.0, count: ($row.items | length)} }
```

Output:

```
╭───┬─────┬───────╮
│ # │ bin │ count │
├───┼─────┼───────┤
│ 0 │   1 │     4 │
│ 1 │   5 │     5 │
│ 2 │  10 │     5 │
│ 3 │  15 │     1 │
╰───┴─────┴───────╯
```

Note that if what you are after is computing a histogram, you can benefit from the [`histogram`](/commands/docs/histogram) command.

## Appendix: Custom commands

This section provides the implementation of the custom commands used in this cookbook. Note that they are illustrative and in no way optimised for large inputs. If you are interested in that, [plugins](/book/plugins.html) will likely be the answer as they can be written in general purpose languages such as Rust or Python.

```nu
> use toolbox.nu *
> help commands | where command_type == "custom"
```

```
╭──────┬─────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────────────────╮
│    # │          name           │                                              usage                                              │
├──────┼─────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────┤
│    0 │ cherry-pick             │ A command for cherry-picking values from a record key recursively                               │
│    1 │ filter-map              │ A command for walking through a complex data structure and tranforming its values recursively   │
│    2 │ flatten record-paths    │ A command for flattening trees whilst keeping paths as keys                                     │
╰──────┴─────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────────────────╯
```

```nu
# toolbox.nu
use std assert

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
        "table" | "block" | "closure" => { error make {msg: "Unexpected type"} },
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



# A command for walking through a complex data structure and tranforming its values recursively
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

## Credits

All jq examples were taken from the [The Ultimate Interactive JQ Guide](https://ishan.page/blog/2023-11-06-jq-by-example/).
