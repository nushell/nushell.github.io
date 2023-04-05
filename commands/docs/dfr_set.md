---
title: dfr set
categories: |
  dataframe
version: 0.78.0
dataframe: |
  Sets value where given mask is true.
usage: |
  Sets value where given mask is true.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr set ```

## Examples

Shifts the values by a given period
```shell
> let s = ([1 2 2 3 3] | dfr into-df | dfr shift 2);
    let mask = ($s | dfr is-null);
    $s | dfr set 0 --mask $mask
╭───┬───╮
│ # │ 0 │
├───┼───┤
│ 0 │ 0 │
│ 1 │ 0 │
│ 2 │ 1 │
│ 3 │ 2 │
│ 4 │ 2 │
╰───┴───╯

```
