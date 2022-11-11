---
title: random chars
categories: |
  random
version: 0.71.0
random: |
  Generate random chars
usage: |
  Generate random chars
---

# <code>{{ $frontmatter.title }}</code> for random

<div class='command-title'>{{ $frontmatter.random }}</div>

## Signature

```> random chars --length```

## Parameters

 -  `--length {int}`: Number of chars

## Examples

Generate random chars
```shell
> random chars
```

Generate random chars with specified length
```shell
> random chars -l 20
```
