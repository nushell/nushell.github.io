---
title: path split
layout: command
version: 0.63.0
usage: |
  Split a path into parts by a separator.
---

# `{{ $frontmatter.title }}`

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
