---
title: benchmark
categories: |
  system
version: 0.75.0
system: |
  Time the running time of a closure
usage: |
  Time the running time of a closure
---

# <code>{{ $frontmatter.title }}</code> for system

<div class='command-title'>{{ $frontmatter.system }}</div>

## Signature

```> benchmark (closure)```

## Parameters

 -  `closure`: the closure to run

## Examples

Benchmarks a command within a closure
```shell
> benchmark { sleep 500ms }
```

Benchmark a command using an existing input
```shell
> http get https://www.nushell.sh/book/ | benchmark { split chars }
```
