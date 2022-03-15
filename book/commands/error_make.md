---
title: error make
layout: command
version: 0.59.1
usage: |
  Create an error.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> error make (error_struct)```

## Parameters

 -  `error_struct`: the error to create

## Examples

Create a custom error for a custom command
```shell
> def foo [x] {
      let span = (metadata $x).span;
      error make {msg: "this is fishy", label: {text: "fish right here", start: $span.start, end: $span.end } }
    }
```
