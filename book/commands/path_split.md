---
title: path split
version: 0.66.1
usage: |
  Split a path into parts by a separator.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> path split --columns```

## Parameters

 -  `--columns {table}`: Optionally operate by column path

## Examples

Split a path into parts
```shell
> '/home/viking/spam.txt' | path split
```

Split all paths under the 'name' column
```shell
> ls ('.' | path expand) | path split -c [ name ]
```
