---
title: url encode
categories: |
  strings
version: 0.84.0
strings: |
  Converts a string to a percent encoded web safe string.
usage: |
  Converts a string to a percent encoded web safe string.
---

# <code>{{ $frontmatter.title }}</code> for strings

<div class='command-title'>{{ $frontmatter.strings }}</div>

## Signature

```> url encode ...rest --all```

## Parameters

 -  `...rest`: For a data structure input, check strings at the given cell paths, and replace with result
 -  `--all` `(-a)`: encode all non-alphanumeric chars including `/`, `.`, `:`


## Input/output types:

| input        | output       |
| ------------ | ------------ |
| list\<string\> | list\<string\> |
| record       | record       |
| string       | string       |
| table        | table        |
## Examples

Encode a url with escape characters
```shell
> 'https://example.com/foo bar' | url encode
https://example.com/foo%20bar
```

Encode multiple urls with escape characters in list
```shell
> ['https://example.com/foo bar' 'https://example.com/a>b' '中文字/eng/12 34'] | url encode
╭───┬─────────────────────────────────────────╮
│ 0 │ https://example.com/foo%20bar           │
│ 1 │ https://example.com/a%3Eb               │
│ 2 │ %E4%B8%AD%E6%96%87%E5%AD%97/eng/12%2034 │
╰───┴─────────────────────────────────────────╯

```

Encode all non alphanumeric chars with all flag
```shell
> 'https://example.com/foo bar' | url encode --all
https%3A%2F%2Fexample%2Ecom%2Ffoo%20bar
```
