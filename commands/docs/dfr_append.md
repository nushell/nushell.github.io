---
title: dfr append
categories: |
  dataframe
version: 0.76.0
dataframe: |
  Appends a new dataframe
usage: |
  Appends a new dataframe
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr append ```

## Examples

Appends a dataframe as new columns
```shell
> let a = ([[a b]; [1 2] [3 4]] | dfr into-df);
    $a | dfr append $a
```

Appends a dataframe merging at the end of columns
```shell
> let a = ([[a b]; [1 2] [3 4]] | dfr into-df);
    $a | dfr append $a --col
```
