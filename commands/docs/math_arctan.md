---
title: math arctan
categories: |
  math
version: 0.81.0
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

 -  `--degrees` `(-d)`: Return degrees instead of radians

## Examples

Get the arctangent of 1
```shell
> 1 | math arctan
0.7853981633974483
```

Get the arctangent of -1 in degrees
```shell
> -1 | math arctan -d
-45
```
