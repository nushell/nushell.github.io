---
title: benchmark
layout: command
version: 0.60.0
usage: |
  Time the running time of a block
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> benchmark (block)`

## Parameters

- `block`: the block to run

## Examples

Benchmarks a command within a block

```shell
> benchmark { sleep 500ms }
```
