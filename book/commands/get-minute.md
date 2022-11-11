---
title: get-minute
categories: |
  dataframe
version: 0.71.0
dataframe: |
  Gets minute from date
usage: |
  Gets minute from date
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> get-minute ```

## Examples

Returns minute from a date
```shell
> let dt = ('2020-08-04T16:39:18+00:00' | into datetime -z 'UTC');
    let df = ([$dt $dt] | into df);
    $df | get-minute
```
