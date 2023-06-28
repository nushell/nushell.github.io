---
title: dfr get-ordinal
categories: |
  dataframe
version: 0.82.0
dataframe: |
  Gets ordinal from date.
usage: |
  Gets ordinal from date.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr get-ordinal ```

## Examples

Returns ordinal from a date
```shell
> let dt = ('2020-08-04T16:39:18+00:00' | into datetime -z 'UTC');
    let df = ([$dt $dt] | dfr into-df);
    $df | dfr get-ordinal
╭───┬─────╮
│ # │  0  │
├───┼─────┤
│ 0 │ 217 │
│ 1 │ 217 │
╰───┴─────╯

```
