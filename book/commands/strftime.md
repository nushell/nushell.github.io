---
title: strftime
categories: |
  dataframe
version: 0.70.0
dataframe: |
  Formats date based on string rule
usage: |
  Formats date based on string rule
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> strftime (fmt)```

## Parameters

 -  `fmt`: Format rule

## Examples

Formats date
```shell
> let dt = ('2020-08-04T16:39:18+00:00' | into datetime -z 'UTC');
    let df = ([$dt $dt] | into df);
    $df | strftime "%Y/%m/%d"
```
