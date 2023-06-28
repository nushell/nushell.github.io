---
title: drop nth
categories: |
  filters
version: 0.82.1
filters: |
  Drop the selected rows.
usage: |
  Drop the selected rows.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> drop nth (row number or row range) ...rest```

## Parameters

 -  `row number or row range`: the number of the row to drop or a range to drop consecutive rows
 -  `...rest`: the number of the row to drop

## Examples

Drop the first, second, and third row
```shell
> [sam,sarah,2,3,4,5] | drop nth 0 1 2
╭───┬───╮
│ 0 │ 3 │
│ 1 │ 4 │
│ 2 │ 5 │
╰───┴───╯

```

Drop the first, second, and third row
```shell
> [0,1,2,3,4,5] | drop nth 0 1 2
╭───┬───╮
│ 0 │ 3 │
│ 1 │ 4 │
│ 2 │ 5 │
╰───┴───╯

```

Drop rows 0 2 4
```shell
> [0,1,2,3,4,5] | drop nth 0 2 4
╭───┬───╮
│ 0 │ 1 │
│ 1 │ 3 │
│ 2 │ 5 │
╰───┴───╯

```

Drop rows 2 0 4
```shell
> [0,1,2,3,4,5] | drop nth 2 0 4
╭───┬───╮
│ 0 │ 1 │
│ 1 │ 3 │
│ 2 │ 5 │
╰───┴───╯

```

Drop range rows from second to fourth
```shell
> [first second third fourth fifth] | drop nth (1..3)
╭───┬───────╮
│ 0 │ first │
│ 1 │ fifth │
╰───┴───────╯

```

Drop all rows except first row
```shell
> [0,1,2,3,4,5] | drop nth 1..
╭───┬───╮
│ 0 │ 0 │
╰───┴───╯

```

Drop rows 3,4,5
```shell
> [0,1,2,3,4,5] | drop nth 3..
╭───┬───╮
│ 0 │ 0 │
│ 1 │ 1 │
│ 2 │ 2 │
╰───┴───╯

```
