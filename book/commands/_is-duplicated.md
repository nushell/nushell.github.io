---
title: is-duplicated
version: 0.64.0
usage: |
  Creates mask indicating duplicated values
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> is-duplicated ```

## Examples

Create mask indicating duplicated values
```shell
> [5 6 6 6 8 8 8] | to-df | is-duplicated
```
