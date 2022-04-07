---
title: dfr to-lowercase
layout: command
version: 0.60.1
usage: |
  Lowercase the strings in the column
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> dfr to-lowercase ```

## Examples

Modifies strings to lowercase
```shell
> [Abc aBc abC] | dfr to-df | dfr to-lowercase
```
