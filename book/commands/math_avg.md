---
title: math avg
layout: command
version: 0.62.0
usage: |
  Finds the average of a list of numbers or tables
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> math avg ```

## Examples

Get the average of a list of numbers
```shell
> [-50 100.0 25] | math avg
```
