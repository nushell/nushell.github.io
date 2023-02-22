---
title: collect
categories: |
  filters
version: 0.76.0
filters: |
  Collect the stream and pass it to a block.
usage: |
  Collect the stream and pass it to a block.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> collect (closure) --keep-env```

## Parameters

 -  `closure`: the closure to run once the stream is collected
 -  `--keep-env`: let the block affect environment variables

## Examples

Use the second value in the stream
```shell
> [1 2 3] | collect { |x| $x.1 }
```
