---
title: drop-duplicates
categories: |
  dataframe
version: 0.75.0
dataframe: |
  Drops duplicate values in dataframe
usage: |
  Drops duplicate values in dataframe
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> drop-duplicates ```

## Examples

drop duplicates
```shell
> [[a b]; [1 2] [3 4] [1 2]] | into df | drop-duplicates
```
