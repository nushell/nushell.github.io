---
title: upsert
categories: |
  filters
version: 0.83.0
filters: |
  Update an existing column to have a new value, or insert a new column.
usage: |
  Update an existing column to have a new value, or insert a new column.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> upsert (field) (replacement value)```

## Parameters

 -  `field`: the name of the column to update or insert
 -  `replacement value`: the new value to give the cell(s), or a closure to create the value

## Examples

Update a record's value
```shell
> {'name': 'nu', 'stars': 5} | upsert name 'Nushell'
╭───────┬─────────╮
│ name  │ Nushell │
│ stars │ 5       │
╰───────┴─────────╯
```

Update each row of a table
```shell
> [[name lang]; [Nushell ''] [Reedline '']] | upsert lang 'Rust'
╭───┬──────────┬──────╮
│ # │   name   │ lang │
├───┼──────────┼──────┤
│ 0 │ Nushell  │ Rust │
│ 1 │ Reedline │ Rust │
╰───┴──────────┴──────╯

```

Insert a new entry into a single record
```shell
> {'name': 'nu', 'stars': 5} | upsert language 'Rust'
╭──────────┬──────╮
│ name     │ nu   │
│ stars    │ 5    │
│ language │ Rust │
╰──────────┴──────╯
```

Use in closure form for more involved updating logic
```shell
> [[count fruit]; [1 'apple']] | enumerate | upsert item.count {|e| ($e.item.fruit | str length) + $e.index } | get item
╭───┬───────┬───────╮
│ # │ count │ fruit │
├───┼───────┼───────┤
│ 0 │     5 │ apple │
╰───┴───────┴───────╯

```

Upsert an int into a list, updating an existing value based on the index
```shell
> [1 2 3] | upsert 0 2
╭───┬───╮
│ 0 │ 2 │
│ 1 │ 2 │
│ 2 │ 3 │
╰───┴───╯

```

Upsert an int into a list, inserting a new value based on the index
```shell
> [1 2 3] | upsert 3 4
╭───┬───╮
│ 0 │ 1 │
│ 1 │ 2 │
│ 2 │ 3 │
│ 3 │ 4 │
╰───┴───╯

```
