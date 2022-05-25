---
title: sort
layout: command
version: 0.63.0
usage: |
  Sort in increasing order.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> sort --reverse --insensitive```

## Parameters

 -  `--reverse`: Sort in reverse order
 -  `--insensitive`: Sort string-based columns case-insensitively

## Examples

sort the list by increasing value
```shell
> [2 0 1] | sort
```

sort the list by decreasing value
```shell
> [2 0 1] | sort -r
```

sort a list of strings
```shell
> [betty amy sarah] | sort
```

sort a list of strings in reverse
```shell
> [betty amy sarah] | sort -r
```

Sort strings (case-insensitive)
```shell
> echo [airplane Truck Car] | sort -i
```

Sort strings (reversed case-insensitive)
```shell
> echo [airplane Truck Car] | sort -i -r
```
