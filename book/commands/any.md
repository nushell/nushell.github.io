---
title: any
version: 0.69.1
filters: |
  Tests if any element of the input fulfills a predicate expression.
usage: |
  Tests if any element of the input fulfills a predicate expression.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.filters }}</div>

## Signature

```> any (predicate)```

## Parameters

 -  `predicate`: the predicate expression that should return a boolean

## Examples

Find if a service is not running
```shell
> echo [[status]; [UP] [DOWN] [UP]] | any status == DOWN
```

Check if any of the values is odd
```shell
> echo [2 4 1 6 8] | any ($it mod 2) == 1
```
