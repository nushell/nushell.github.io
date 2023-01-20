---
title: math tan
categories: |
  math
version: 0.74.0
math: |
  Returns the tangent of the number.
usage: |
  Returns the tangent of the number.
---

# <code>{{ $frontmatter.title }}</code> for math

<div class='command-title'>{{ $frontmatter.math }}</div>

## Signature

```> math tan --degrees```

## Parameters

 -  `--degrees`: Use degrees instead of radians

## Examples

Apply the tangent to pi/4
```shell
> (math pi) / 4 | math tan
```

Apply the tangent to a list of angles in degrees
```shell
> [-45 0 45] | math tan -d
```
