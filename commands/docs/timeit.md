---
title: timeit
categories: |
  debug
version: 0.77.0
debug: |
  Time the running time of a closure.
usage: |
  Time the running time of a closure.
---

# <code>{{ $frontmatter.title }}</code> for debug

<div class='command-title'>{{ $frontmatter.debug }}</div>

## Signature

```> timeit (closure)```

## Parameters

 -  `closure`: the closure to run

## Examples

Times a command within a closure
```shell
> timeit { sleep 500ms }

```

Times a command using an existing input
```shell
> http get https://www.nushell.sh/book/ | timeit { split chars }

```
