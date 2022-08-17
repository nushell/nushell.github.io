---
title: slice
version: 0.67.0
usage: |
  Creates new dataframe from a slice of rows
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> slice (offset) (size)```

## Parameters

 -  `offset`: start of slice
 -  `size`: size of slice

## Examples

Create new dataframe from a slice of the rows
```shell
> [[a b]; [1 2] [3 4]] | into df | slice 0 1
```
