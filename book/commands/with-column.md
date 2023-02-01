---
title: with-column
categories: |
  dataframe or lazyframe
version: 0.75.0
dataframe_or_lazyframe: |
  Adds a series to the dataframe
usage: |
  Adds a series to the dataframe
---

# <code>{{ $frontmatter.title }}</code> for dataframe or lazyframe

<div class='command-title'>{{ $frontmatter.dataframe_or_lazyframe }}</div>

## Signature

```> with-column ```

## Examples

Adds a series to the dataframe
```shell
> [[a b]; [1 2] [3 4]]
    | into df
    | with-column ([5 6] | into df) --name c
```

Adds a series to the dataframe
```shell
> [[a b]; [1 2] [3 4]]
    | into lazy
    | with-column [
        ((col a) * 2 | as "c")
        ((col a) * 3 | as "d")
      ]
    | collect
```
