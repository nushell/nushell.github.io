---
title: str distance
version: 0.68.0
usage: |
  compare to strings and return the edit distance/levenshtein distance
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

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
