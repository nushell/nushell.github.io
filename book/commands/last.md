---
title: last
layout: command
version: 0.60.1
usage: |
  Show only the last number of rows.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> last (rows)`

## Parameters

- `rows`: starting from the back, the number of rows to return

## Examples

Get the last 2 items

```shell
> [1,2,3] | last 2
```
