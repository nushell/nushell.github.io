---
title: get-hour
categories: |
  dataframe
version: 0.73.1
dataframe: |
  Gets hour from date
usage: |
  Gets hour from date
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> get-hour ```

## Examples

Returns hour from a date
```shell
> let dt = ('2020-08-04T16:39:18+00:00' | into datetime -z 'UTC');
    let df = ([$dt $dt] | into df);
    $df | get-hour
```
