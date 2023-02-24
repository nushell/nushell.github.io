---
title: str trim
categories: |
  default
version: 0.76.0
default: |
  Trim whitespace or specific character
usage: |
  Trim whitespace or specific character
---

# <code>{{ $frontmatter.title }}</code> for default

<div class='command-title'>{{ $frontmatter.default }}</div>

## Signature

```> str trim ...rest --char --left --right --all --both --format```

## Parameters

 -  `...rest`: For a data structure input, trim strings at the given cell paths
 -  `--char {string}`: character to trim (default: whitespace)
 -  `--left` `(-l)`: trims characters only from the beginning of the string (default: whitespace)
 -  `--right` `(-r)`: trims characters only from the end of the string (default: whitespace)
 -  `--all` `(-a)`: trims all characters from both sides of the string *and* in the middle (default: whitespace)
 -  `--both` `(-b)`: trims all characters from left and right side of the string (default: whitespace)
 -  `--format` `(-f)`: trims spaces replacing multiple characters with singles in the middle (default: whitespace)

## Examples

Trim whitespace
```shell
> 'Nu shell ' | str trim
```

Trim a specific character
```shell
> '=== Nu shell ===' | str trim -c '=' | str trim
```

Trim all characters
```shell
> ' Nu   shell ' | str trim -a
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
