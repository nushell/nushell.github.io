---
title: math log
categories: |
  math
version: 0.77.0
math: |
  Returns the logarithm for an arbitrary base.
usage: |
  Returns the logarithm for an arbitrary base.
---

# <code>{{ $frontmatter.title }}</code> for math

<div class='command-title'>{{ $frontmatter.math }}</div>

## Signature

```> math log (base)```

## Parameters

 -  `base`: Base for which the logarithm should be computed

## Examples

Get the logarithm of 100 to the base 10
```shell
> 100 | math log 10
2
```

Get the log2 of a list of values
```shell
> [16 8 4] | math log 2
╭───┬────────╮
│ 0 │ 4.0000 │
│ 1 │ 3.0000 │
│ 2 │ 2.0000 │
╰───┴────────╯

```
