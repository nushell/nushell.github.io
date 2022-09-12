---
title: first
version: 0.68.0
usage: |
  Show only the first number of rows.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> first (rows)```

## Parameters

 -  `rows`: starting from the front, the number of rows to return

## Examples

Return the first row of a dataframe
```shell
> [[a b]; [1 2] [3 4]] | into df | first
```

Return the first two rows of a dataframe
```shell
> [[a b]; [1 2] [3 4]] | into df | first 2
```
