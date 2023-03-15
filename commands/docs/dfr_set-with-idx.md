---
title: dfr set-with-idx
categories: |
  dataframe
version: 0.77.0
dataframe: |
  Sets value in the given index.
usage: |
  Sets value in the given index.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr set-with-idx ```

## Examples

Set value in selected rows from series
```shell
> let series = ([4 1 5 2 4 3] | dfr into-df);
    let indices = ([0 2] | dfr into-df);
    $series | dfr set-with-idx 6 -i $indices
╭───┬───╮
│ # │ 0 │
├───┼───┤
│ 0 │ 6 │
│ 1 │ 1 │
│ 2 │ 6 │
│ 3 │ 2 │
│ 4 │ 4 │
│ 5 │ 3 │
╰───┴───╯

```
