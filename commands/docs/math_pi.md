---
title: math pi
categories: |
  math
version: 0.84.0
math: |
  Returns the mathematical constant π.
usage: |
  Returns the mathematical constant π.
---

# <code>{{ $frontmatter.title }}</code> for math

<div class='command-title'>{{ $frontmatter.math }}</div>

## Signature

```> math pi ```


## Input/output types:

| input | output |
| ----- | ------ |
| any   | number |

## Examples

Get the first two decimal digits of π
```shell
> math pi | math round --precision 2
3.14
```


**Tips:** Command `math pi` was not included in the official binaries by default, you have to build it with `--features=extra` flag