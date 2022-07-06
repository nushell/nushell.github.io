---
title: reverse
version: 0.65.1
usage: |
  Reverses the LazyFrame
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> reverse ```

## Examples

Reverses the dataframe
```shell
> [[a b]; [6 2] [4 2] [2 2]] | into df | reverse
```
