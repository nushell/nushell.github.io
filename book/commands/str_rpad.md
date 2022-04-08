---
title: str rpad
layout: command
version: 0.60.1
usage: |
  Right-pad a string to a specific length
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> str rpad ...rest --length --character```

## Parameters

 -  `...rest`: optionally check if string contains pattern by column paths
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

Use rpad to truncate a string
```shell
> '123456789' | str rpad -l 3 -c '0'
```

Use rpad to pad Unicode
```shell
> '▉' | str rpad -l 10 -c '▉'
```
