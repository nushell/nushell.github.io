---
title: math stddev
layout: command
version: 0.60.0
usage: |
  Finds the stddev of a list of numbers or tables
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> math stddev --sample`

## Parameters

- `--sample`: calculate sample standard deviation

## Examples

Get the stddev of a list of numbers

```shell
> [1 2 3 4 5] | math stddev
```

Get the sample stddev of a list of numbers

```shell
> [1 2 3 4 5] | math stddev -s
```
