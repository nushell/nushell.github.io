---
title: dfr get-hour
categories: |
  dataframe
version: 0.81.0
dataframe: |
  Gets hour from date.
usage: |
  Gets hour from date.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr get-hour ```

## Examples

Returns hour from a date
```shell
> let dt = ('2020-08-04T16:39:18+00:00' | into datetime -z 'UTC');
    let df = ([$dt $dt] | dfr into-df);
    $df | dfr get-hour
╭───┬────╮
│ # │ 0  │
├───┼────┤
│ 0 │ 16 │
│ 1 │ 16 │
╰───┴────╯

```
