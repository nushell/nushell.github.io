---
title: math sin
categories: |
  math
version: 0.77.0
math: |
  Returns the sine of the number.
usage: |
  Returns the sine of the number.
---

# <code>{{ $frontmatter.title }}</code> for math

<div class='command-title'>{{ $frontmatter.math }}</div>

## Signature

```> math sin --degrees```

## Parameters

 -  `--degrees` `(-d)`: Use degrees instead of radians

## Examples

Apply the sine to π/2
```shell
> (math pi) / 2 | math sin
1
```

Apply the sine to a list of angles in degrees
```shell
> [0 90 180 270 360] | math sin -d | math round --precision 4
╭───┬─────────╮
│ 0 │  0.0000 │
│ 1 │  1.0000 │
│ 2 │  0.0000 │
│ 3 │ -1.0000 │
│ 4 │  0.0000 │
╰───┴─────────╯

```
