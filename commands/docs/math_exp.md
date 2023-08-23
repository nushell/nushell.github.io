---
title: math exp
categories: |
  math
version: 0.84.0
math: |
  Returns e raised to the power of x.
usage: |
  Returns e raised to the power of x.
---

# <code>{{ $frontmatter.title }}</code> for math

<div class='command-title'>{{ $frontmatter.math }}</div>

## Signature

```> math exp ```


## Input/output types:

| input        | output       |
| ------------ | ------------ |
| list\<number\> | list\<number\> |
| number       | number       |
## Examples

Get e raised to the power of zero
```shell
> 0 | math exp
1
```

Get e (same as 'math e')
```shell
> 1 | math exp
2.718281828459045
```


**Tips:** Command `math exp` was not included in the official binaries by default, you have to build it with `--features=extra` flag