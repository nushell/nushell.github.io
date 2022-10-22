---
title: path exists
categories: |
  default
version: 0.70.0
default: |
  Check whether a path exists
usage: |
  Check whether a path exists
---

# <code>{{ $frontmatter.title }}</code> for default

<div class='command-title'>{{ $frontmatter.default }}</div>

## Signature

```> path exists --columns```

## Parameters

 -  `--columns {table}`: Optionally operate by column path

## Examples

Check if a file exists
```shell
> 'C:\Users\joe\todo.txt' | path exists
```

Check if a file exists in a column
```shell
> ls | path exists -c [ name ]
```
