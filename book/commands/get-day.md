---
title: get-day
categories: |
  dataframe
version: 0.71.0
dataframe: |
  Gets day from date
usage: |
  Gets day from date
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> get-day ```

## Examples

Returns day from a date
```shell
> let dt = ('2020-08-04T16:39:18+00:00' | into datetime -z 'UTC');
    let df = ([$dt $dt] | into df);
    $df | get-day
```
