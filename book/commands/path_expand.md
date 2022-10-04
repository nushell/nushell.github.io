---
title: path expand
version: 0.69.1
default: |
  Try to expand a path to its absolute form
usage: |
  Try to expand a path to its absolute form
---

# <code>{{ $frontmatter.title }}</code> for default

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.default }}</div>

## Signature

```> path expand --strict --no-symlink --columns```

## Parameters

 -  `--strict`: Throw an error if the path could not be expanded
 -  `--no-symlink`: Do not resolve symbolic links
 -  `--columns {table}`: Optionally operate by column path

## Examples

Expand an absolute path
```shell
> 'C:\Users\joe\foo\..\bar' | path expand
```

Expand a path in a column
```shell
> ls | path expand -c [ name ]
```

Expand a relative path
```shell
> 'foo\..\bar' | path expand
```

Expand an absolute path without following symlink
```shell
> 'foo\..\bar' | path expand -n
```
