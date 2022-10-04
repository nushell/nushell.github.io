---
title: build-string
version: 0.69.1
strings: |
  Create a string from the arguments.
usage: |
  Create a string from the arguments.
---

# <code>{{ $frontmatter.title }}</code> for strings

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.strings }}</div>

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
