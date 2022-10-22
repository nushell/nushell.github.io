---
title: get-weekday
categories: |
  dataframe
version: 0.70.0
dataframe: |
  Gets weekday from date
usage: |
  Gets weekday from date
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> get-weekday ```

## Examples

Returns weekday from a date
```shell
> let dt = ('2020-08-04T16:39:18+00:00' | into datetime -z 'UTC');
    let df = ([$dt $dt] | into df);
    $df | get-weekday
```
