---
title: shape
version: 0.65.1
usage: |
  Shows column and row size for a dataframe
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> shape ```

## Examples

Shows row and column shape
```shell
> [[a b]; [1 2] [3 4]] | into df | shape
```
