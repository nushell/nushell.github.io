---
title: math cos
categories: |
  math
version: 0.81.0
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

 -  `--degrees` `(-d)`: Use degrees instead of radians

## Examples

Apply the cosine to π
```shell
> math pi | math cos
-1
```

Apply the cosine to a list of angles in degrees
```shell
> [0 90 180 270 360] | math cos -d
╭───┬─────────╮
│ 0 │  1.0000 │
│ 1 │  0.0000 │
│ 2 │ -1.0000 │
│ 3 │  0.0000 │
│ 4 │  1.0000 │
╰───┴─────────╯

```
