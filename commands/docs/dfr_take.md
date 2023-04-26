---
title: dfr take
categories: |
  dataframe
version: 0.79.0
dataframe: |
  Creates new dataframe using the given indices.
usage: |
  Creates new dataframe using the given indices.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr take (indices)```

## Parameters

 -  `indices`: list of indices used to take data

## Examples

Takes selected rows from dataframe
```shell
> let df = ([[a b]; [4 1] [5 2] [4 3]] | dfr into-df);
    let indices = ([0 2] | dfr into-df);
    $df | dfr take $indices
╭───┬───┬───╮
│ # │ a │ b │
├───┼───┼───┤
│ 0 │ 4 │ 1 │
│ 1 │ 4 │ 3 │
╰───┴───┴───╯

```

Takes selected rows from series
```shell
> let series = ([4 1 5 2 4 3] | dfr into-df);
    let indices = ([0 2] | dfr into-df);
    $series | dfr take $indices
╭───┬───╮
│ # │ 0 │
├───┼───┤
│ 0 │ 4 │
│ 1 │ 5 │
╰───┴───╯

```
