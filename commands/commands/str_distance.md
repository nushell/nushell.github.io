---
title: str distance
categories: |
  strings
version: 0.75.0
strings: |
  Compare two strings and return the edit distance/Levenshtein distance
usage: |
  Compare two strings and return the edit distance/Levenshtein distance
---

# <code>{{ $frontmatter.title }}</code> for strings

<div class='command-title'>{{ $frontmatter.strings }}</div>

## Signature

```> str distance (compare-string) ...rest```

## Parameters

 -  `compare-string`: the first string to compare
 -  `...rest`: For a data structure input, check strings at the given cell paths, and replace with result

## Examples

get the edit distance between two strings
```shell
> 'nushell' | str distance 'nutshell'
```

Compute edit distance between strings in record and another string, using cell paths
```shell
> [{a: 'nutshell' b: 'numetal'}] | str distance 'nushell' 'a' 'b'
```
