---
title: url encode
categories: |
  strings
version: 0.76.0
strings: |
  Converts a string to a percent encoded web safe string
usage: |
  Converts a string to a percent encoded web safe string
---

# <code>{{ $frontmatter.title }}</code> for strings

<div class='command-title'>{{ $frontmatter.strings }}</div>

## Signature

```> url encode ...rest --all```

## Parameters

 -  `...rest`: For a data structure input, check strings at the given cell paths, and replace with result
 -  `--all` `(-a)`: encode all non-alphanumeric chars including `/`, `.`, `:`

## Examples

Encode a url with escape characters
```shell
> 'https://example.com/foo bar' | url encode
```

Encode multiple urls with escape characters in list
```shell
> ['https://example.com/foo bar' 'https://example.com/a>b' '中文字/eng/12 34'] | url encode
```

Encode all non alphanumeric chars with all flag
```shell
> 'https://example.com/foo bar' | url encode --all
```
