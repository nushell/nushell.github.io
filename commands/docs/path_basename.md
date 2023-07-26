---
title: path basename
categories: |
  default
version: 0.83.0
default: |
  Get the final component of a path.
usage: |
  Get the final component of a path.
---

# <code>{{ $frontmatter.title }}</code> for default

<div class='command-title'>{{ $frontmatter.default }}</div>

## Signature

```> path basename --replace```

## Parameters

 -  `--replace {string}`: Return original path with basename replaced by this string

## Examples

Get basename of a path
```shell
> '/home/joe/test.txt' | path basename
test.txt
```

Get basename of a list of paths
```shell
> [ /home/joe, /home/doe ] | path basename
╭───┬─────╮
│ 0 │ joe │
│ 1 │ doe │
╰───┴─────╯

```

Replace basename of a path
```shell
> '/home/joe/test.txt' | path basename -r 'spam.png'
/home/joe/spam.png
```
