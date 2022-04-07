---
title: length
layout: command
version: 0.60.1
usage: |
  Count the number of elements in the input.
---

# `{{ $frontmatter.title }}`

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
