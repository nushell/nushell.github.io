---
title: str distance
categories: |
  strings
version: 0.71.0
strings: |
  compare two strings and return the edit distance/levenshtein distance
usage: |
  compare two strings and return the edit distance/levenshtein distance
---

# <code>{{ $frontmatter.title }}</code> for strings

<div class='command-title'>{{ $frontmatter.strings }}</div>

## Signature

```> str distance (compare-string) ...rest```

## Parameters

 -  `compare-string`: the first string to compare
 -  `...rest`: optionally check if string contains pattern by column paths

## Examples

get the edit distance between two strings
```shell
> 'nushell' | str distance 'nutshell'
```
