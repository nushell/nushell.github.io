---
title: seq
version: 0.67.0
usage: |
  Print sequences of numbers.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> seq ...rest --separator --terminator --widths```

## Parameters

 -  `...rest`: sequence values
 -  `--separator {string}`: separator character (defaults to \n)
 -  `--terminator {string}`: terminator character (defaults to \n)
 -  `--widths`: equalize widths of all numbers by padding with zeros

## Examples

sequence 1 to 10 with newline separator
```shell
> seq 1 10
```

sequence 1.0 to 2.0 by 0.1s with newline separator
```shell
> seq 1.0 0.1 2.0
```

sequence 1 to 10 with pipe separator
```shell
> seq -s '|' 1 10
```

sequence 1 to 10 with pipe separator padded with 0
```shell
> seq -s '|' -w 1 10
```

sequence 1 to 10 with pipe separator padded by 2s
```shell
> seq -s ' | ' -w 1 2 10
```
