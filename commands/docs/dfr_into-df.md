---
title: dfr into-df
categories: |
  dataframe
version: 0.83.0
dataframe: |
  Converts a list, table or record into a dataframe.
usage: |
  Converts a list, table or record into a dataframe.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr into-df ```

## Examples

Takes a dictionary and creates a dataframe
```shell
> [[a b];[1 2] [3 4]] | dfr into-df
╭───┬───┬───╮
│ # │ a │ b │
├───┼───┼───┤
│ 0 │ 1 │ 2 │
│ 1 │ 3 │ 4 │
╰───┴───┴───╯

```

Takes a list of tables and creates a dataframe
```shell
> [[1 2 a] [3 4 b] [5 6 c]] | dfr into-df
╭───┬───┬───┬───╮
│ # │ 0 │ 1 │ 2 │
├───┼───┼───┼───┤
│ 0 │ 1 │ 2 │ a │
│ 1 │ 3 │ 4 │ b │
│ 2 │ 5 │ 6 │ c │
╰───┴───┴───┴───╯

```

Takes a list and creates a dataframe
```shell
> [a b c] | dfr into-df
╭───┬───╮
│ # │ 0 │
├───┼───┤
│ 0 │ a │
│ 1 │ b │
│ 2 │ c │
╰───┴───╯

```

Takes a list of booleans and creates a dataframe
```shell
> [true true false] | dfr into-df
╭───┬───────╮
│ # │   0   │
├───┼───────┤
│ 0 │ true  │
│ 1 │ true  │
│ 2 │ false │
╰───┴───────╯

```
