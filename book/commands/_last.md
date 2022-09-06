---
title: last
version: 0.67.1
usage: |
  Creates new dataframe with tail rows or creates a last expression
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> last (rows)```

## Parameters

 -  `rows`: Number of rows for tail

## Examples

Create new dataframe with last rows
```shell
> [[a b]; [1 2] [3 4]] | into df | last 1
```
