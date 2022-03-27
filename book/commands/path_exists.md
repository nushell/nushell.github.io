---
title: path exists
layout: command
version: 0.60.1
usage: |
  Check whether a path exists
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> path exists --columns`

## Parameters

- `--columns {table}`: Optionally operate by column path

## Examples

Check if a file exists

```shell
> '/home/joe/todo.txt' | path exists
```

Check if a file exists in a column

```shell
> ls | path exists -c [ name ]
```
