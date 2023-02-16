---
title: math variance
categories: |
  math
version: 0.75.0
math: |
  Returns the variance of a list of numbers or of each column in a table
usage: |
  Returns the variance of a list of numbers or of each column in a table
---

# <code>{{ $frontmatter.title }}</code> for math

<div class='command-title'>{{ $frontmatter.math }}</div>

## Signature

```> math variance --sample```

## Parameters

 -  `--sample`: calculate sample variance (i.e. using N-1 as the denominator)

## Examples

Get the variance of a list of numbers
```shell
> [1 2 3 4 5] | math variance
```

Get the sample variance of a list of numbers
```shell
> [1 2 3 4 5] | math variance -s
```
