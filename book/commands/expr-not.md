---
title: expr-not
version: 0.68.0
usage: |
  creates a not expression
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> expr-not ```

## Examples

Creates a not expression
```shell
> (col a) > 2) | expr-not
```
