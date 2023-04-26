---
title: math stddev
categories: |
  math
version: 0.79.0
math: |
  Returns the standard deviation of a list of numbers, or of each column in a table.
usage: |
  Returns the standard deviation of a list of numbers, or of each column in a table.
---

# <code>{{ $frontmatter.title }}</code> for math

<div class='command-title'>{{ $frontmatter.math }}</div>

## Signature

```> math stddev --sample```

## Parameters

 -  `--sample` `(-s)`: calculate sample standard deviation (i.e. using N-1 as the denominator)

## Examples

Compute the standard deviation of a list of numbers
```shell
> [1 2 3 4 5] | math stddev
1.4142135623730951
```

Compute the sample standard deviation of a list of numbers
```shell
> [1 2 3 4 5] | math stddev -s
1.5811388300841898
```
