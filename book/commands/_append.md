---
title: append
version: 0.65.1
usage: |
  Appends a new dataframe
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> append (other) --col```

## Parameters

 -  `other`: dataframe to be appended
 -  `--col`: appends in col orientation

## Examples

Appends a dataframe as new columns
```shell
> let a = ([[a b]; [1 2] [3 4]] | into df);
    $a | append $a
```

Appends a dataframe merging at the end of columns
```shell
> let a = ([[a b]; [1 2] [3 4]] | into df);
    $a | append $a --col
```
