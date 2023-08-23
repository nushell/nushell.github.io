---
title: math e
categories: |
  math
version: 0.84.0
math: |
  Returns the mathematical constant e (exp(1)/'1 | math exp').
usage: |
  Returns the mathematical constant e (exp(1)/'1 | math exp').
---

# <code>{{ $frontmatter.title }}</code> for math

<div class='command-title'>{{ $frontmatter.math }}</div>

## Signature

```> math e ```


## Input/output types:

| input | output |
| ----- | ------ |
| any   | number |

## Examples

Get the first three decimal digits of e
```shell
> math e | math round --precision 3
2.718
```


**Tips:** Command `math e` was not included in the official binaries by default, you have to build it with `--features=extra` flag