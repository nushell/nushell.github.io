---
title: uppercase
version: 0.67.0
usage: |
  Uppercase the strings in the column
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> uppercase ```

## Examples

Modifies strings to uppercase
```shell
> [Abc aBc abC] | into df | uppercase
```
