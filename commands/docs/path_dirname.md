---
title: path dirname
categories: |
  default
version: 0.76.0
default: |
  Get the parent directory of a path
usage: |
  Get the parent directory of a path
---

# <code>{{ $frontmatter.title }}</code> for default

<div class='command-title'>{{ $frontmatter.default }}</div>

## Signature

```> path dirname --columns --replace --num-levels```

## Parameters

 -  `--columns {table}`: For a record or table input, convert strings at the given columns to their dirname
 -  `--replace {string}`: Return original path with dirname replaced by this string
 -  `--num-levels {int}`: Number of directories to walk up

## Examples

Get dirname of a path
```shell
> '/home/joe/code/test.txt' | path dirname
```

Get dirname of a path in a column
```shell
> ls ('.' | path expand) | path dirname -c [ name ]
```

Walk up two levels
```shell
> '/home/joe/code/test.txt' | path dirname -n 2
```

Replace the part that would be returned with a custom path
```shell
> '/home/joe/code/test.txt' | path dirname -n 2 -r /home/viking
```
