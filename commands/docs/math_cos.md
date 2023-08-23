---
title: math cos
categories: |
  math
version: 0.84.0
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


## Input/output types:

| input        | output       |
| ------------ | ------------ |
| list\<number\> | list\<number\> |
| number       | number       |
## Examples

Apply the cosine to π
```shell
> math pi | math cos
-1
```

Apply the cosine to a list of angles in degrees
```shell
> [0 90 180 270 360] | math cos -d
╭───┬───────╮
│ 0 │  1.00 │
│ 1 │  0.00 │
│ 2 │ -1.00 │
│ 3 │  0.00 │
│ 4 │  1.00 │
╰───┴───────╯

```


**Tips:** Command `math cos` was not included in the official binaries by default, you have to build it with `--features=extra` flag