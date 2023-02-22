---
title: dfr rename
categories: |
  dataframe or lazyframe
version: 0.76.0
dataframe_or_lazyframe: |
  Rename a dataframe column
usage: |
  Rename a dataframe column
---

# <code>{{ $frontmatter.title }}</code> for dataframe or lazyframe

<div class='command-title'>{{ $frontmatter.dataframe_or_lazyframe }}</div>

## Signature

```> dfr rename ```

## Examples

Renames a series
```shell
> [5 6 7 8] | dfr into-df | dfr rename '0' new_name
```

Renames a dataframe column
```shell
> [[a b]; [1 2] [3 4]] | dfr into-df | dfr rename a a_new
```

Renames two dataframe columns
```shell
> [[a b]; [1 2] [3 4]] | dfr into-df | dfr rename [a b] [a_new b_new]
```
