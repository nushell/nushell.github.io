---
title: str trim
categories: |
  default
version: 0.76.1
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
```

Trim a specific character
```shell
> '=== Nu shell ===' | str trim -c '=' | str trim
```

Trim whitespace from the beginning of string
```shell
> ' Nu shell ' | str trim -l
```

Trim a specific character
```shell
> '=== Nu shell ===' | str trim -c '='
```

Trim whitespace from the end of string
```shell
> ' Nu shell ' | str trim -r
```

Trim a specific character
```shell
> '=== Nu shell ===' | str trim -r -c '='
```
