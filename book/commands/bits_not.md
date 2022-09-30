---
title: bits not
version: 0.69.1
usage: |
  Performs logical negation on each bit
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> bits not --signed --number-bytes```

## Parameters

 -  `--signed`: always treat input number as a signed number
 -  `--number-bytes {string}`: the size of unsigned number in bytes, it can be 1, 2, 4, 8, auto

## Examples

Apply logical negation to a list of numbers
```shell
> [4 3 2] | bits not
```

Apply logical negation to a list of numbers, treat input as 2 bytes number
```shell
> [4 3 2] | bits not -n 2
```

Apply logical negation to a list of numbers, treat input as signed number
```shell
> [4 3 2] | bits not -s
```
