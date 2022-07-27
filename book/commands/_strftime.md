---
title: strftime
version: 0.66.1
usage: |
  Formats date based on string rule
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

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
