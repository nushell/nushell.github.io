---
title: rotate
categories: |
  filters
version: 0.82.1
filters: |
  Rotates a table or record clockwise (default) or counter-clockwise (use --ccw flag).
usage: |
  Rotates a table or record clockwise (default) or counter-clockwise (use --ccw flag).
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> rotate ...rest --ccw```

## Parameters

 -  `...rest`: the names to give columns once rotated
 -  `--ccw` `(-)`: rotate counter clockwise

## Examples

Rotate a record clockwise, producing a table (like `transpose` but with column order reversed)
```shell
> {a:1, b:2} | rotate
╭───┬─────────┬─────────╮
│ # │ column0 │ column1 │
├───┼─────────┼─────────┤
│ 0 │       1 │ a       │
│ 1 │       2 │ b       │
╰───┴─────────┴─────────╯

```

Rotate 2x3 table clockwise
```shell
> [[a b]; [1 2] [3 4] [5 6]] | rotate
╭───┬─────────┬─────────┬─────────┬─────────╮
│ # │ column0 │ column1 │ column2 │ column3 │
├───┼─────────┼─────────┼─────────┼─────────┤
│ 0 │       5 │       3 │       1 │ a       │
│ 1 │       6 │       4 │       2 │ b       │
╰───┴─────────┴─────────┴─────────┴─────────╯

```

Rotate table clockwise and change columns names
```shell
> [[a b]; [1 2]] | rotate col_a col_b
╭───┬───────┬───────╮
│ # │ col_a │ col_b │
├───┼───────┼───────┤
│ 0 │     1 │ a     │
│ 1 │     2 │ b     │
╰───┴───────┴───────╯

```

Rotate table counter clockwise
```shell
> [[a b]; [1 2]] | rotate --ccw
╭───┬─────────┬─────────╮
│ # │ column0 │ column1 │
├───┼─────────┼─────────┤
│ 0 │ b       │       2 │
│ 1 │ a       │       1 │
╰───┴─────────┴─────────╯

```

Rotate table counter-clockwise
```shell
> [[a b]; [1 2] [3 4] [5 6]] | rotate --ccw
╭───┬─────────┬─────────┬─────────┬─────────╮
│ # │ column0 │ column1 │ column2 │ column3 │
├───┼─────────┼─────────┼─────────┼─────────┤
│ 0 │ b       │       2 │       4 │       6 │
│ 1 │ a       │       1 │       3 │       5 │
╰───┴─────────┴─────────┴─────────┴─────────╯

```

Rotate table counter-clockwise and change columns names
```shell
> [[a b]; [1 2]] | rotate --ccw col_a col_b
╭───┬───────┬───────╮
│ # │ col_a │ col_b │
├───┼───────┼───────┤
│ 0 │ b     │     2 │
│ 1 │ a     │     1 │
╰───┴───────┴───────╯

```
