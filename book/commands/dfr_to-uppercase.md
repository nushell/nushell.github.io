---
title: dfr to-uppercase
layout: command
version: 0.59.1
usage: |
  Uppercase the strings in the column
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> dfr to-uppercase ```

## Examples

Modifies strings to uppercase
```shell
> [Abc aBc abC] | dfr to-df | dfr to-uppercase
```
