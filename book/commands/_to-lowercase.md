---
title: to-lowercase
version: 0.64.0
usage: |
  Lowercase the strings in the column
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> to-lowercase ```

## Examples

Modifies strings to lowercase
```shell
> [Abc aBc abC] | to-df | to-lowercase
```
