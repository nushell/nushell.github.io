---
title: is-duplicated
categories: |
  dataframe
version: 0.73.1
dataframe: |
  Creates mask indicating duplicated values
usage: |
  Creates mask indicating duplicated values
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> is-duplicated ```

## Examples

Create mask indicating duplicated values
```shell
> [5 6 6 6 8 8 8] | into df | is-duplicated
```

Create mask indicating duplicated rows in a dataframe
```shell
> [[a, b]; [1 2] [1 2] [3 3] [3 3] [1 1]] | into df | is-duplicated
```
