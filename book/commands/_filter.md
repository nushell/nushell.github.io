---
title: filter
version: 0.67.1
usage: |
  Filter dataframe based in expression
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> filter (filter expression)```

## Parameters

 -  `filter expression`: Expression that define the column selection

## Examples

Filter dataframe using an expression
```shell
> [[a b]; [6 2] [4 2] [2 2]] | into df | filter ((col a) >= 4)
```
