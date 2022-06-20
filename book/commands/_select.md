---
title: select
version: 0.64.0
usage: |
  Selects columns from lazyframe
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> select ...select expressions```

## Parameters

 -  `...select expressions`: Expression(s) that define the column selection

## Examples

Select a column from the dataframe
```shell
> [[a b]; [6 2] [4 2] [2 2]] | to-df | select a
```
