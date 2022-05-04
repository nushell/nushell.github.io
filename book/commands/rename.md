---
title: rename
layout: command
version: 0.62.0
usage: |
  Creates a new table with columns renamed.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> rename ...rest --column```

## Parameters

 -  `...rest`: the new names for the columns
 -  `--column {list<string>}`: column name to be changed

## Examples

Rename a column
```shell
> [[a, b]; [1, 2]] | rename my_column
```

Rename many columns
```shell
> [[a, b, c]; [1, 2, 3]] | rename eggs ham bacon
```

Rename a specific column
```shell
> [[a, b, c]; [1, 2, 3]] | rename -c [a ham]
```
