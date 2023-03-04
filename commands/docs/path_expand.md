---
title: path expand
categories: |
  default
version: 0.76.1
default: |
  Try to expand a path to its absolute form.
usage: |
  Try to expand a path to its absolute form.
---

# <code>{{ $frontmatter.title }}</code> for default

<div class='command-title'>{{ $frontmatter.default }}</div>

## Signature

```> path expand --strict --no-symlink --columns```

## Parameters

 -  `--strict` `(-s)`: Throw an error if the path could not be expanded
 -  `--no-symlink` `(-n)`: Do not resolve symbolic links
 -  `--columns {table}`: For a record or table input, expand strings at the given columns

## Examples

Expand an absolute path
```shell
> '/home/joe/foo/../bar' | path expand
```

Expand a path in a column
```shell
> ls | path expand -c [ name ]
```

Expand a relative path
```shell
> 'foo/../bar' | path expand
```
