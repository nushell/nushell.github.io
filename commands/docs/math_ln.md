---
title: math ln
categories: |
  math
version: 0.84.0
math: |
  Returns the natural logarithm. Base: (math e).
usage: |
  Returns the natural logarithm. Base: (math e).
---

# <code>{{ $frontmatter.title }}</code> for math

<div class='command-title'>{{ $frontmatter.math }}</div>

## Signature

```> math ln ```


## Input/output types:

| input        | output       |
| ------------ | ------------ |
| list\<number\> | list\<number\> |
| number       | number       |
## Examples

Get the natural logarithm of e
```shell
> math e | math ln
1
```


**Tips:** Command `math ln` was not included in the official binaries by default, you have to build it with `--features=extra` flag