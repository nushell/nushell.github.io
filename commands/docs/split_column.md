---
title: split column
categories: |
  strings
version: 0.75.0
strings: |
  Split a string into multiple columns using a separator
usage: |
  Split a string into multiple columns using a separator
---

# <code>{{ $frontmatter.title }}</code> for strings

<div class='command-title'>{{ $frontmatter.strings }}</div>

## Signature

```> split column (separator) ...rest --collapse-empty```

## Parameters

 -  `separator`: the character or string that denotes what separates columns
 -  `...rest`: column names to give the new columns
 -  `--collapse-empty`: remove empty columns

## Examples

Split a string into columns by the specified separator
```shell
> 'a--b--c' | split column '--'
```

Split a string into columns of char and remove the empty columns
```shell
> 'abc' | split column -c ''
```

Split a list of strings into a table
```shell
> ['a-b' 'c-d'] | split column -
```
