---
title: math arccosh
categories: |
  math
version: 0.84.0
math: |
  Returns the inverse of the hyperbolic cosine function.
usage: |
  Returns the inverse of the hyperbolic cosine function.
---

# <code>{{ $frontmatter.title }}</code> for math

<div class='command-title'>{{ $frontmatter.math }}</div>

## Signature

```> math arccosh ```


## Input/output types:

| input        | output       |
| ------------ | ------------ |
| list\<number\> | list\<number\> |
| number       | number       |
## Examples

Get the arccosh of 1
```shell
> 1 | math arccosh
0
```


**Tips:** Command `math arccosh` was not included in the official binaries by default, you have to build it with `--features=extra` flag