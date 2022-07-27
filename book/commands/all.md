---
title: all?
version: 0.66.1
usage: |
  Test if every element of the input matches a predicate.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> all? (predicate)```

## Parameters

 -  `predicate`: the predicate that must match

## Examples

Find if services are running
```shell
> echo [[status]; [UP] [UP]] | all? status == UP
```

Check that all values are even
```shell
> echo [2 4 6 8] | all? ($it mod 2) == 0
```
