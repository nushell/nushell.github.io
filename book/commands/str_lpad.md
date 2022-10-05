---
title: str lpad
version: 0.69.1
strings: |
  Left-pad a string to a specific length
usage: |
  Left-pad a string to a specific length
---

# <code>{{ $frontmatter.title }}</code> for strings

<div class='command-title'>{{ $frontmatter.strings }}</div>

## Signature

```> str lpad ...rest --length --character```

## Parameters

 -  `...rest`: optionally check if string contains pattern by column paths
 -  `--length {int}`: length to pad to
 -  `--character {string}`: character to pad with

## Examples

Left-pad a string with asterisks until it's 10 characters wide
```shell
> 'nushell' | str lpad -l 10 -c '*'
```

Left-pad a string with zeroes until it's 10 character wide
```shell
> '123' | str lpad -l 10 -c '0'
```

Use lpad to truncate a string to its last three characters
```shell
> '123456789' | str lpad -l 3 -c '0'
```

Use lpad to pad Unicode
```shell
> '▉' | str lpad -l 10 -c '▉'
```
