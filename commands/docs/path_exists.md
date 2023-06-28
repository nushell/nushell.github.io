---
title: path exists
categories: |
  default
version: 0.82.0
default: |
  Check whether a path exists.
usage: |
  Check whether a path exists.
---

# <code>{{ $frontmatter.title }}</code> for default

<div class='command-title'>{{ $frontmatter.default }}</div>

## Signature

```> path exists --columns```

## Parameters

 -  `--columns {table}`: For a record or table input, check strings at the given columns, and replace with result

## Notes
This only checks if it is possible to either `open` or `cd` to the given path.
If you need to distinguish dirs and files, please use `path type`.
## Examples

Check if a file exists
```shell
> '/home/joe/todo.txt' | path exists
false
```

Check if a file exists in a column
```shell
> ls | path exists -c [ name ]

```
