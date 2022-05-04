---
title: random chars
layout: command
version: 0.62.0
usage: |
  Generate random chars
---

# `{{ $frontmatter.title }}`

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
