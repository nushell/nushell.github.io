---
title: dfr to-nu
layout: command
version: 0.63.0
usage: |
  Convert expression to a nu value for access and exploration
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> dfr to-nu ```

## Examples

Convert a col expression into a nushell value
```shell
> dfr col col_a | dfr to-nu
```
