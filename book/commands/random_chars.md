---
title: random chars
version: 0.69.1
random: |
  Generate random chars
usage: |
  Generate random chars
---

# <code>{{ $frontmatter.title }}</code> for random

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.random }}</div>

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
