---
title: split chars
categories: |
  strings
version: 0.82.0
strings: |
  Split a string into a list of characters.
usage: |
  Split a string into a list of characters.
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
╭───┬───╮
│ 0 │ h │
│ 1 │ e │
│ 2 │ l │
│ 3 │ l │
│ 4 │ o │
╰───┴───╯

```

Split on grapheme clusters
```shell
> '🇯🇵ほげ' | split chars -g
╭───┬────╮
│ 0 │ 🇯🇵 │
│ 1 │ ほ │
│ 2 │ げ │
╰───┴────╯

```
