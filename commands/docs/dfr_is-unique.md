---
title: dfr is-unique
categories: |
  dataframe
version: 0.76.0
dataframe: |
  Creates mask indicating unique values
usage: |
  Creates mask indicating unique values
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr is-unique ```

## Examples

Create mask indicating unique values
```shell
> [5 6 6 6 8 8 8] | dfr into-df | dfr is-unique
```

Create mask indicating duplicated rows in a dataframe
```shell
> [[a, b]; [1 2] [1 2] [3 3] [3 3] [1 1]] | dfr into-df | dfr is-unique
```
