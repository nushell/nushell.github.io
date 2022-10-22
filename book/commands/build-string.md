---
title: build-string
categories: |
  strings
version: 0.70.0
strings: |
  Create a string from the arguments.
usage: |
  Create a string from the arguments.
---

# <code>{{ $frontmatter.title }}</code> for strings

<div class='command-title'>{{ $frontmatter.strings }}</div>

## Signature

```> build-string ...rest```

## Parameters

 -  `...rest`: list of string

## Examples

Builds a string from letters a b c
```shell
> build-string a b c
```

Builds a string from letters a b c
```shell
> build-string $"(1 + 2)" = one ' ' plus ' ' two
```
