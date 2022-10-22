---
title: str substring
categories: |
  default
version: 0.70.0
default: |
  Get part of a string. Note that the start is included but the end is excluded, and that the first character of a string is index 0.
usage: |
  Get part of a string. Note that the start is included but the end is excluded, and that the first character of a string is index 0.
---

# <code>{{ $frontmatter.title }}</code> for default

<div class='command-title'>{{ $frontmatter.default }}</div>

## Signature

```> str substring (range) ...rest```

## Parameters

 -  `range`: the indexes to substring [start end]
 -  `...rest`: optionally substring text by column paths

## Examples

Get a substring "nushell" from the text "good nushell"
```shell
>  'good nushell' | str substring [5 12]
```

Alternatively, you can use the form
```shell
>  'good nushell' | str substring '5,12'
```

Drop the last `n` characters from the string
```shell
>  'good nushell' | str substring ',-5'
```

Get the remaining characters from a starting index
```shell
>  'good nushell' | str substring '5,'
```

Get the characters from the beginning until ending index
```shell
>  'good nushell' | str substring ',7'
```
