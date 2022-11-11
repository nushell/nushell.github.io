---
title: math stddev
categories: |
  math
version: 0.71.0
math: |
  Finds the stddev of a list of numbers or tables
usage: |
  Finds the stddev of a list of numbers or tables
---

# <code>{{ $frontmatter.title }}</code> for math

<div class='command-title'>{{ $frontmatter.math }}</div>

## Signature

```> math stddev --sample```

## Parameters

 -  `--sample`: calculate sample standard deviation

## Examples

Get the stddev of a list of numbers
```shell
> [1 2 3 4 5] | math stddev
```

Get the sample stddev of a list of numbers
```shell
> [1 2 3 4 5] | math stddev -s
```
