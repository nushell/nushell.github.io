---
title: unique
version: 0.64.0
usage: |
  Returns unique values from a dataframe
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> unique --subset --last --maintain-order```

## Parameters

 -  `--subset {any}`: Subset of column(s) to use to maintain rows (lazy df)
 -  `--last`: Keeps last unique value. Default keeps first value (lazy df)
 -  `--maintain-order`: Keep the same order as the original DataFrame (lazy df)

## Examples

Returns unique values from a series
```shell
> [2 2 2 2 2] | to-df | unique
```

Creates a is unique expression from a column
```shell
> col a | unique
```
