---
title: get-nanosecond
categories: |
  dataframe
version: 0.70.0
dataframe: |
  Gets nanosecond from date
usage: |
  Gets nanosecond from date
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> get-nanosecond ```

## Examples

Returns nanosecond from a date
```shell
> let dt = ('2020-08-04T16:39:18+00:00' | into datetime -z 'UTC');
    let df = ([$dt $dt] | into df);
    $df | get-nanosecond
```
