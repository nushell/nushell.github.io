---
title: dfr strftime
categories: |
  dataframe
version: 0.76.0
dataframe: |
  Formats date based on string rule
usage: |
  Formats date based on string rule
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr strftime ```

## Examples

Formats date
```shell
> let dt = ('2020-08-04T16:39:18+00:00' | into datetime -z 'UTC');
    let df = ([$dt $dt] | dfr into-df);
    $df | dfr strftime "%Y/%m/%d"
```
