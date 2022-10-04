---
title: group
version: 0.69.1
filters: |
  Groups input into groups of `group_size`.
usage: |
  Groups input into groups of `group_size`.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.filters }}</div>

## Signature

```> group (group_size)```

## Parameters

 -  `group_size`: the size of each group

## Examples

Group the a list by pairs
```shell
> echo [1 2 3 4] | group 2
```
