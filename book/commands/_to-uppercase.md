---
title: to-uppercase
version: 0.64.0
usage: |
  Uppercase the strings in the column
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> to-uppercase ```

## Examples

Modifies strings to uppercase
```shell
> [Abc aBc abC] | to-df | to-uppercase
```
