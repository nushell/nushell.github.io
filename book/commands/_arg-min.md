---
title: arg-min
version: 0.64.0
usage: |
  Return index for min value in series
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> arg-min ```

## Examples

Returns index for min value
```shell
> [1 3 2] | to-df | arg-min
```
