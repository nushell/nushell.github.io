---
title: dfr column
layout: command
version: 0.60.1
usage: |
  Returns the selected column
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> dfr column (column)`

## Parameters

- `column`: column name

## Examples

Returns the selected column as series

```shell
> [[a b]; [1 2] [3 4]] | dfr to-df | dfr column a
```
