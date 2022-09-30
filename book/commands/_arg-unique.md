---
title: arg-unique
version: 0.69.1
usage: |
  Returns indexes for unique values
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> arg-unique ```

## Examples

Returns indexes for unique values
```shell
> [1 2 2 3 3] | into df | arg-unique
```
