---
title: drop column
version: 0.69.1
usage: |
  Remove the last number of columns. If you want to remove columns by name, try 'reject'.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> drop column (columns)```

## Parameters

 -  `columns`: starting from the end, the number of columns to remove

## Examples

Remove the last column of a table
```shell
> echo [[lib, extension]; [nu-lib, rs] [nu-core, rb]] | drop column
```
