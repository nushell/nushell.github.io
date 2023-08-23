---
title: math tan
categories: |
  math
version: 0.84.0
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

 -  `--degrees` `(-d)`: Use degrees instead of radians


## Input/output types:

| input        | output       |
| ------------ | ------------ |
| list\<number\> | list\<number\> |
| number       | number       |
## Examples

Apply the tangent to π/4
```shell
> (math pi) / 4 | math tan
1
```

Apply the tangent to a list of angles in degrees
```shell
> [-45 0 45] | math tan -d
╭───┬───────╮
│ 0 │ -1.00 │
│ 1 │  0.00 │
│ 2 │  1.00 │
╰───┴───────╯

```


**Tips:** Command `math tan` was not included in the official binaries by default, you have to build it with `--features=extra` flag