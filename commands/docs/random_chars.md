---
title: random chars
categories: |
  random
version: 0.84.0
random: |
  Generate random chars.
usage: |
  Generate random chars.
---

# <code>{{ $frontmatter.title }}</code> for random

<div class='command-title'>{{ $frontmatter.random }}</div>

## Signature

```> random chars --length```

## Parameters

 -  `--length {int}`: Number of chars


## Input/output types:

| input   | output |
| ------- | ------ |
| nothing | string |

## Examples

Generate random chars
```shell
> random chars

```

Generate random chars with specified length
```shell
> random chars -l 20

```
