---
title: path type
version: 0.69.1
default: |
  Get the type of the object a path refers to (e.g., file, dir, symlink)
usage: |
  Get the type of the object a path refers to (e.g., file, dir, symlink)
---

# <code>{{ $frontmatter.title }}</code> for default

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.default }}</div>

## Signature

```> path type --columns```

## Parameters

 -  `--columns {table}`: Optionally operate by column path

## Examples

Show type of a filepath
```shell
> '.' | path type
```

Show type of a filepath in a column
```shell
> ls | path type -c [ name ]
```
