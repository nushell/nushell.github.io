---
title: math cosh
categories: |
  math
version: 0.84.0
math: |
  Returns the hyperbolic cosine of the number.
usage: |
  Returns the hyperbolic cosine of the number.
---

# <code>{{ $frontmatter.title }}</code> for math

<div class='command-title'>{{ $frontmatter.math }}</div>

## Signature

```> math cosh ```


## Input/output types:

| input        | output       |
| ------------ | ------------ |
| list\<number\> | list\<number\> |
| number       | number       |
## Examples

Apply the hyperbolic cosine to 1
```shell
> 1 | math cosh
1.5430806348152435
```


**Tips:** Command `math cosh` was not included in the official binaries by default, you have to build it with `--features=extra` flag