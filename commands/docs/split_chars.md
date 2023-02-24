---
title: split chars
categories: |
  strings
version: 0.76.0
strings: |
  Split a string into a list of characters
usage: |
  Split a string into a list of characters
---

# <code>{{ $frontmatter.title }}</code> for strings

<div class='command-title'>{{ $frontmatter.strings }}</div>

## Signature

```> split chars --grapheme-clusters --code-points```

## Parameters

 -  `--grapheme-clusters` `(-g)`: split on grapheme clusters
 -  `--code-points` `(-c)`: split on code points (default; splits combined characters)

## Examples

Split the string into a list of characters
```shell
> 'hello' | split chars
```

Split on grapheme clusters
```shell
> '🇯🇵ほげ' | split chars -g
```
