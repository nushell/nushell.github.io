---
title: random chars
version: 0.66.1
usage: |
  Generate random chars
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

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
