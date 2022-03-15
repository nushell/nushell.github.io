---
title: group
layout: command
version: 0.59.1
usage: |
  Groups input into groups of `group_size`.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> group (group_size)```

## Parameters

 -  `group_size`: the size of each group

## Examples

Group the a list by pairs
```shell
> echo [1 2 3 4] | group 2
```
