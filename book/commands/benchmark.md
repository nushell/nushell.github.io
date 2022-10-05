---
title: benchmark
version: 0.69.1
system: |
  Time the running time of a block
usage: |
  Time the running time of a block
---

# <code>{{ $frontmatter.title }}</code> for system

<div class='command-title'>{{ $frontmatter.system }}</div>

## Signature

```> benchmark (block)```

## Parameters

 -  `block`: the block to run

## Examples

Benchmarks a command within a block
```shell
> benchmark { sleep 500ms }
```
