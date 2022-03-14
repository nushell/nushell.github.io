---
title: math abs
layout: command
version: 0.59.1
usage: |
  Returns absolute values of a list of numbers
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> math abs ```

## Examples

Get absolute of each value in a list of numbers
```shell
> [-50 -100.0 25] | math abs
```
