---
title: math tanh
categories: |
  math
version: 0.84.0
math: |
  Returns the hyperbolic tangent of the number.
usage: |
  Returns the hyperbolic tangent of the number.
---

# <code>{{ $frontmatter.title }}</code> for math

<div class='command-title'>{{ $frontmatter.math }}</div>

## Signature

```> math tanh ```


## Input/output types:

| input        | output       |
| ------------ | ------------ |
| list\<number\> | list\<number\> |
| number       | number       |
## Examples

Apply the hyperbolic tangent to 10*π
```shell
> (math pi) * 10 | math tanh
1
```


**Tips:** Command `math tanh` was not included in the official binaries by default, you have to build it with `--features=extra` flag