---
title: dfr drop-duplicates
categories: |
  dataframe
version: 0.76.0
dataframe: |
  Drops duplicate values in dataframe
usage: |
  Drops duplicate values in dataframe
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr drop-duplicates ```

## Examples

drop duplicates
```shell
> [[a b]; [1 2] [3 4] [1 2]] | dfr into-df | dfr drop-duplicates
```
