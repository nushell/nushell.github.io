---
title: dfr get-month
categories: |
  dataframe
version: 0.82.1
dataframe: |
  Gets month from date.
usage: |
  Gets month from date.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr get-month ```

## Examples

Returns month from a date
```shell
> let dt = ('2020-08-04T16:39:18+00:00' | into datetime -z 'UTC');
    let df = ([$dt $dt] | dfr into-df);
    $df | dfr get-month
╭───┬───╮
│ # │ 0 │
├───┼───┤
│ 0 │ 8 │
│ 1 │ 8 │
╰───┴───╯

```
