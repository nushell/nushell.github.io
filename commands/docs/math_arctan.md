---
title: math arctan
categories: |
  math
version: 0.76.0
math: |
  Returns the arctangent of the number.
usage: |
  Returns the arctangent of the number.
---

# <code>{{ $frontmatter.title }}</code> for math

<div class='command-title'>{{ $frontmatter.math }}</div>

## Signature

```> math arctan --degrees```

## Parameters

 -  `--degrees`: Return degrees instead of radians

## Examples

Get the arctangent of 1
```shell
> 1 | math arctan
```

Get the arctangent of -1 in degrees
```shell
> -1 | math arctan -d
```
