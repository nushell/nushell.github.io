---
title: format
categories: |
  strings
version: 0.74.0
strings: |
  Format columns into a string using a simple pattern.
usage: |
  Format columns into a string using a simple pattern.
---

# <code>{{ $frontmatter.title }}</code> for strings

<div class='command-title'>{{ $frontmatter.strings }}</div>

## Signature

```> format (pattern)```

## Parameters

 -  `pattern`: the pattern to output. e.g.) "{foo}: {bar}"

## Examples

Print filenames with their sizes
```shell
> ls | format '{name}: {size}'
```

Print elements from some columns of a table
```shell
> [[col1, col2]; [v1, v2] [v3, v4]] | format '{col2}'
```
