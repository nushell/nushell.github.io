---
title: char
version: 0.70.0
strings: |
  Output special characters (e.g., 'newline').
usage: |
  Output special characters (e.g., 'newline').
---

# <code>{{ $frontmatter.title }}</code> for strings

<div class='command-title'>{{ $frontmatter.strings }}</div>

## Signature

```> char (character) ...rest --list --unicode --integer```

## Parameters

 -  `character`: the name of the character to output
 -  `...rest`: multiple Unicode bytes
 -  `--list`: List all supported character names
 -  `--unicode`: Unicode string i.e. 1f378
 -  `--integer`: Create a codepoint from an integer

## Examples

Output newline
```shell
> char newline
```

Output prompt character, newline and a hamburger character
```shell
> echo [(char prompt) (char newline) (char hamburger)] | str join
```

Output Unicode character
```shell
> char -u 1f378
```

Create Unicode from integer codepoint values
```shell
> char -i (0x60 + 1) (0x60 + 2)
```

Output multi-byte Unicode character
```shell
> char -u 1F468 200D 1F466 200D 1F466
```
