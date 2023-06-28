---
title: math arcsin
categories: |
  math
version: 0.82.1
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
1.5707963267948966
```

Get the arcsine of 1 in degrees
```shell
> 1 | math arcsin -d
90
```
