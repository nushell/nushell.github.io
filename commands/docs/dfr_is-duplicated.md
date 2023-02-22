---
title: dfr is-duplicated
categories: |
  dataframe
version: 0.76.0
dataframe: |
  Creates mask indicating duplicated values
usage: |
  Creates mask indicating duplicated values
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr is-duplicated ```

## Examples

Create mask indicating duplicated values
```shell
> [5 6 6 6 8 8 8] | dfr into-df | dfr is-duplicated
```

Create mask indicating duplicated rows in a dataframe
```shell
> [[a, b]; [1 2] [1 2] [3 3] [3 3] [1 1]] | dfr into-df | dfr is-duplicated
```
