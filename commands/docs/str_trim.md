---
title: str trim
categories: |
  default
version: 0.77.0
default: |
  Trim whitespace or specific character.
usage: |
  Trim whitespace or specific character.
---

# <code>{{ $frontmatter.title }}</code> for default

<div class='command-title'>{{ $frontmatter.default }}</div>

## Signature

```> str trim ...rest --char --left --right```

## Parameters

 -  `...rest`: For a data structure input, trim strings at the given cell paths
 -  `--char {string}`: character to trim (default: whitespace)
 -  `--left` `(-l)`: trims characters only from the beginning of the string
 -  `--right` `(-r)`: trims characters only from the end of the string

## Examples

Trim whitespace
```shell
> 'Nu shell ' | str trim
Nu shell
```

Trim a specific character
```shell
> '=== Nu shell ===' | str trim -c '=' | str trim
Nu shell
```

Trim whitespace from the beginning of string
```shell
> ' Nu shell ' | str trim -l
Nu shell
```

Trim a specific character
```shell
> '=== Nu shell ===' | str trim -c '='
 Nu shell
```

Trim whitespace from the end of string
```shell
> ' Nu shell ' | str trim -r
 Nu shell
```

Trim a specific character
```shell
> '=== Nu shell ===' | str trim -r -c '='
=== Nu shell
```
