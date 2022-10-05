---
title: length
version: 0.69.1
filters: |
  Count the number of elements in the input.
usage: |
  Count the number of elements in the input.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

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
