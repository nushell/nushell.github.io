---
title: math arcsinh
categories: |
  math
version: 0.84.0
math: |
  Returns the inverse of the hyperbolic sine function.
usage: |
  Returns the inverse of the hyperbolic sine function.
---

# <code>{{ $frontmatter.title }}</code> for math

<div class='command-title'>{{ $frontmatter.math }}</div>

## Signature

```> math arcsinh ```


## Input/output types:

| input        | output       |
| ------------ | ------------ |
| list\<number\> | list\<number\> |
| number       | number       |
## Examples

Get the arcsinh of 0
```shell
> 0 | math arcsinh
0
```


**Tips:** Command `math arcsinh` was not included in the official binaries by default, you have to build it with `--features=extra` flag