---
title: get-year
categories: |
  dataframe
version: 0.74.0
dataframe: |
  Gets year from date
usage: |
  Gets year from date
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> get-year ```

## Examples

Returns year from a date
```shell
> let dt = ('2020-08-04T16:39:18+00:00' | into datetime -z 'UTC');
    let df = ([$dt $dt] | into df);
    $df | get-year
```
