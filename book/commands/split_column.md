---
title: split column
version: 0.68.0
usage: |
  Split a string into multiple columns using a separator
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> split column (separator) ...rest --collapse-empty```

## Parameters

 -  `separator`: the character or string that denotes what separates columns
 -  `...rest`: column names to give the new columns
 -  `--collapse-empty`: remove empty columns

## Examples

Split a string into columns by the specified separator
```shell
> echo 'a--b--c' | split column '--'
```

Split a string into columns of char and remove the empty columns
```shell
> echo 'abc' | split column -c ''
```
