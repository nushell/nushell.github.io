---
title: arg-true
version: 0.66.1
usage: |
  Returns indexes where values are true
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> arg-true ```

## Examples

Returns indexes where values are true
```shell
> [false true false] | into df | arg-true
```
