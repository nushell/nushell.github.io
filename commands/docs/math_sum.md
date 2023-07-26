---
title: math sum
categories: |
  math
version: 0.83.0
math: |
  Returns the sum of a list of numbers or of each column in a table.
usage: |
  Returns the sum of a list of numbers or of each column in a table.
---

# <code>{{ $frontmatter.title }}</code> for math

<div class='command-title'>{{ $frontmatter.math }}</div>

## Signature

```> math sum ```

## Examples

Sum a list of numbers
```shell
> [1 2 3] | math sum
6
```

Get the disk usage for the current directory
```shell
> ls | get size | math sum

```
