---
title: path dirname
categories: |
  default
version: 0.83.0
default: |
  Get the parent directory of a path.
usage: |
  Get the parent directory of a path.
---

# <code>{{ $frontmatter.title }}</code> for default

<div class='command-title'>{{ $frontmatter.default }}</div>

## Signature

```> path dirname --replace --num-levels```

## Parameters

 -  `--replace {string}`: Return original path with dirname replaced by this string
 -  `--num-levels {int}`: Number of directories to walk up

## Examples

Get dirname of a path
```shell
> '/home/joe/code/test.txt' | path dirname
/home/joe/code
```

Get dirname of a list of paths
```shell
> [ /home/joe/test.txt, /home/doe/test.txt ] | path dirname
╭───┬───────────╮
│ 0 │ /home/joe │
│ 1 │ /home/doe │
╰───┴───────────╯

```

Walk up two levels
```shell
> '/home/joe/code/test.txt' | path dirname -n 2
/home/joe
```

Replace the part that would be returned with a custom path
```shell
> '/home/joe/code/test.txt' | path dirname -n 2 -r /home/viking
/home/viking/code/test.txt
```
