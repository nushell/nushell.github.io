---
title: wrap
layout: command
version: 0.60.1
usage: |
  Wrap the value into a column.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> wrap (name)```

## Parameters

 -  `name`: the name of the column

## Examples

Wrap a list into a table with a given column name
```shell
> echo [1 2 3] | wrap num
```
