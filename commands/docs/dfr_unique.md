---
title: dfr unique
categories: |
  dataframe or lazyframe
version: 0.76.0
dataframe_or_lazyframe: |
  Returns unique values from a dataframe
usage: |
  Returns unique values from a dataframe
---

# <code>{{ $frontmatter.title }}</code> for dataframe or lazyframe

<div class='command-title'>{{ $frontmatter.dataframe_or_lazyframe }}</div>

## Signature

```> dfr unique ```

## Examples

Returns unique values from a series
```shell
> [2 2 2 2 2] | dfr into-df | dfr unique
```

Creates a is unique expression from a column
```shell
> col a | unique
```
