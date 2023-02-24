---
title: str length
categories: |
  strings
version: 0.76.0
strings: |
  Output the length of any strings in the pipeline
usage: |
  Output the length of any strings in the pipeline
---

# <code>{{ $frontmatter.title }}</code> for strings

<div class='command-title'>{{ $frontmatter.strings }}</div>

## Signature

```> str length ...rest --grapheme-clusters --utf-8-bytes```

## Parameters

 -  `...rest`: For a data structure input, replace strings at the given cell paths with their length
 -  `--grapheme-clusters` `(-g)`: count length using grapheme clusters (all visible chars have length 1)
 -  `--utf-8-bytes` `(-b)`: count length using UTF-8 bytes (default; all non-ASCII chars have length 2+)

## Examples

Return the lengths of a string
```shell
> 'hello' | str length
```

Count length using grapheme clusters
```shell
> '🇯🇵ほげ ふが ぴよ' | str length -g
```

Return the lengths of multiple strings
```shell
> ['hi' 'there'] | str length
```
