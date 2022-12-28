---
title: str rpad
categories: |
  strings
version: 0.73.1
strings: |
  Right-pad a string to a specific length
usage: |
  Right-pad a string to a specific length
---

# <code>{{ $frontmatter.title }}</code> for strings

<div class='command-title'>{{ $frontmatter.strings }}</div>

## Signature

```> str rpad ...rest --length --character```

## Parameters

 -  `...rest`: For a data structure input, pad strings at the given cell paths
 -  `--length {int}`: length to pad to
 -  `--character {string}`: character to pad with

## Examples

Right-pad a string with asterisks until it's 10 characters wide
```shell
> 'nushell' | str rpad -l 10 -c '*'
```

Right-pad a string with zeroes until it's 10 characters wide
```shell
> '123' | str rpad -l 10 -c '0'
```

Use rpad to truncate a string to its first three characters
```shell
> '123456789' | str rpad -l 3 -c '0'
```

Use rpad to pad Unicode
```shell
> '▉' | str rpad -l 10 -c '▉'
```
