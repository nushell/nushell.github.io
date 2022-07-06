---
title: benchmark
version: 0.65.1
usage: |
  Time the running time of a block
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> benchmark (block)```

## Parameters

 -  `block`: the block to run

## Examples

Benchmarks a command within a block
```shell
> benchmark { sleep 500ms }
```
