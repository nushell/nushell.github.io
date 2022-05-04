---
title: first
layout: command
version: 0.62.0
usage: |
  Show only the first number of rows.
---

# `{{ $frontmatter.title }}`

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
