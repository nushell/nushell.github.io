---
title: math cos
categories: |
  math
version: 0.75.0
math: |
  Returns the cosine of the number.
usage: |
  Returns the cosine of the number.
---

# <code>{{ $frontmatter.title }}</code> for math

<div class='command-title'>{{ $frontmatter.math }}</div>

## Signature

```> math cos --degrees```

## Parameters

 -  `--degrees`: Use degrees instead of radians

## Examples

Apply the cosine to pi
```shell
> math pi | math cos
```

Apply the cosine to a list of angles in degrees
```shell
> [0 90 180 270 360] | math cos -d
```
