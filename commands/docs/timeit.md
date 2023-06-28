---
title: timeit
categories: |
  debug
version: 0.82.0
debug: |
  Time the running time of a block.
usage: |
  Time the running time of a block.
---

# <code>{{ $frontmatter.title }}</code> for debug

<div class='command-title'>{{ $frontmatter.debug }}</div>

## Signature

```> timeit (command)```

## Parameters

 -  `command`: the command or block to run

## Examples

Times a command within a closure
```shell
> timeit { sleep 500ms }

```

Times a command using an existing input
```shell
> http get https://www.nushell.sh/book/ | timeit { split chars }

```

Times a command invocation
```shell
> timeit ls -la

```
