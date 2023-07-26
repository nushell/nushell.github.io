---
title: path expand
categories: |
  default
version: 0.83.0
default: |
  Try to expand a path to its absolute form.
usage: |
  Try to expand a path to its absolute form.
---

# <code>{{ $frontmatter.title }}</code> for default

<div class='command-title'>{{ $frontmatter.default }}</div>

## Signature

```> path expand --strict --no-symlink```

## Parameters

 -  `--strict` `(-s)`: Throw an error if the path could not be expanded
 -  `--no-symlink` `(-n)`: Do not resolve symbolic links

## Examples

Expand an absolute path
```shell
> '/home/joe/foo/../bar' | path expand
/home/joe/bar
```

Expand a relative path
```shell
> 'foo/../bar' | path expand

```

Expand a list of paths
```shell
> [ /foo/../bar, /foo/../baz ] | path expand
╭───┬──────╮
│ 0 │ /bar │
│ 1 │ /baz │
╰───┴──────╯

```
