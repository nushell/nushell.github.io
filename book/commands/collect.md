---
title: collect
layout: command
version: 0.60.0
usage: |
  Collect the stream and pass it to a block.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> collect (block)```

## Parameters

 -  `block`: the block to run once the stream is collected

## Examples

Use the second value in the stream
```shell
> echo 1 2 3 | collect { |x| echo $x.1 }
```
