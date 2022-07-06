---
title: length
version: 0.65.1
usage: |
  Count the number of elements in the input.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> length --column```

## Parameters

 -  `--column`: Show the number of columns in a table

## Examples

Count the number of entries in a list
```shell
> echo [1 2 3 4 5] | length
```

Count the number of columns in the calendar table
```shell
> cal | length -c
```
