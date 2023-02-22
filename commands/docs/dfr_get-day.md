---
title: dfr get-day
categories: |
  dataframe
version: 0.76.0
dataframe: |
  Gets day from date
usage: |
  Gets day from date
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr get-day ```

## Examples

Returns day from a date
```shell
> let dt = ('2020-08-04T16:39:18+00:00' | into datetime -z 'UTC');
    let df = ([$dt $dt] | dfr into-df);
    $df | dfr get-day
```
