---
title: lowercase
version: 0.65.1
usage: |
  Lowercase the strings in the column
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> lowercase ```

## Examples

Modifies strings to lowercase
```shell
> [Abc aBc abC] | into df | lowercase
```
