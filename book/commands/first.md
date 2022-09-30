---
title: first
version: 0.69.1
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

Return the first item of a list/table
```shell
> [1 2 3] | first
```

Return the first 2 items of a list/table
```shell
> [1 2 3] | first 2
```

Return the first 2 items of a bytes
```shell
> 0x[01 23 45] | first 2
```
