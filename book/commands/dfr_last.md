---
title: dfr last
layout: command
version: 0.63.0
usage: |
  Creates new dataframe with tail rows or creates a last expression
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> dfr last (rows)```

## Parameters

 -  `rows`: Number of rows for tail

## Examples

Create new dataframe with last rows
```shell
> [[a b]; [1 2] [3 4]] | dfr to-df | dfr last 1
```

Creates a last expression from a column
```shell
> dfr col a | dfr last
```
