---
title: math arcsin
categories: |
  math
version: 0.76.0
math: |
  Returns the arcsine of the number.
usage: |
  Returns the arcsine of the number.
---

# <code>{{ $frontmatter.title }}</code> for math

<div class='command-title'>{{ $frontmatter.math }}</div>

## Signature

```> math arcsin --degrees```

## Parameters

 -  `--degrees` `(-d)`: Return degrees instead of radians

## Examples

Get the arcsine of 1
```shell
> 1 | math arcsin
```

Get the arcsine of 1 in degrees
```shell
> 1 | math arcsin -d
```
