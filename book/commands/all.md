---
title: all
categories: |
  filters
version: 0.70.0
filters: |
  Test if every element of the input fulfills a predicate expression.
usage: |
  Test if every element of the input fulfills a predicate expression.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> all (predicate)```

## Parameters

 -  `predicate`: the predicate expression that must evaluate to a boolean

## Examples

Find if services are running
```shell
> echo [[status]; [UP] [UP]] | all status == UP
```

Check that all values are even
```shell
> echo [2 4 6 8] | all ($it mod 2) == 0
```
