---
title: dfr sort-by
categories: |
  lazyframe
version: 0.78.0
lazyframe: |
  sorts a lazy dataframe based on expression(s).
usage: |
  sorts a lazy dataframe based on expression(s).
---

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> dfr sort-by ```

## Examples

Sort dataframe by one column
```shell
> [[a b]; [6 2] [1 4] [4 1]] | dfr into-df | dfr sort-by a
╭───┬───┬───╮
│ # │ a │ b │
├───┼───┼───┤
│ 0 │ 1 │ 4 │
│ 1 │ 4 │ 1 │
│ 2 │ 6 │ 2 │
╰───┴───┴───╯

```

Sort column using two columns
```shell
> [[a b]; [6 2] [1 1] [1 4] [2 4]] | dfr into-df | dfr sort-by [a b] -r [false true]
╭───┬───┬───╮
│ # │ a │ b │
├───┼───┼───┤
│ 0 │ 1 │ 4 │
│ 1 │ 1 │ 1 │
│ 2 │ 2 │ 4 │
│ 3 │ 6 │ 2 │
╰───┴───┴───╯

```
