---
title: shape
version: 0.70.0
dataframe: |
  Shows column and row size for a dataframe
usage: |
  Shows column and row size for a dataframe
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> shape ```

## Examples

Shows row and column shape
```shell
> [[a b]; [1 2] [3 4]] | into df | shape
```
