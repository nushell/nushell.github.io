---
title: error make
version: 0.67.1
usage: |
  Create an error.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> error make (error_struct) --unspanned```

## Parameters

 -  `error_struct`: the error to create
 -  `--unspanned`: remove the origin label from the error

## Examples

Create a custom error for a custom command
```shell
> def foo [x] {
      let span = (metadata $x).span;
      error make {msg: "this is fishy", label: {text: "fish right here", start: $span.start, end: $span.end } }
    }
```

Create a simple custom error for a custom command
```shell
> def foo [x] {
      error make {msg: "this is fishy"}
    }
```
