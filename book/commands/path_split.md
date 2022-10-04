---
title: path split
version: 0.69.1
default: |
  Split a path into parts by a separator.
usage: |
  Split a path into parts by a separator.
---

# <code>{{ $frontmatter.title }}</code> for default

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.default }}</div>

## Signature

```> path split --columns```

## Parameters

 -  `--columns {table}`: Optionally operate by column path

## Examples

Split a path into parts
```shell
> 'C:\Users\viking\spam.txt' | path split
```

Split all paths under the 'name' column
```shell
> ls ('.' | path expand) | path split -c [ name ]
```
