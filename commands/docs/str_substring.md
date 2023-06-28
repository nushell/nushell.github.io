---
title: str substring
categories: |
  default
version: 0.82.0
default: |
  Get part of a string. Note that the start is included but the end is excluded, and that the first character of a string is index 0.
usage: |
  Get part of a string. Note that the start is included but the end is excluded, and that the first character of a string is index 0.
---

# <code>{{ $frontmatter.title }}</code> for default

<div class='command-title'>{{ $frontmatter.default }}</div>

## Signature

```> str substring (range) ...rest --grapheme-clusters --utf-8-bytes```

## Parameters

 -  `range`: the indexes to substring [start end]
 -  `...rest`: For a data structure input, turn strings at the given cell paths into substrings
 -  `--grapheme-clusters` `(-g)`: count indexes and split using grapheme clusters (all visible chars have length 1)
 -  `--utf-8-bytes` `(-b)`: count indexes and split using UTF-8 bytes (default; non-ASCII chars have length 2+)

## Examples

Get a substring "nushell" from the text "good nushell" using a range
```shell
>  'good nushell' | str substring 5..12
nushell
```

Count indexes and split using grapheme clusters
```shell
>  '🇯🇵ほげ ふが ぴよ' | str substring -g 4..6
ふが
```
