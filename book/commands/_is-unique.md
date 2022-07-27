---
title: is-unique
version: 0.66.1
usage: |
  Creates mask indicating unique values
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> is-unique ```

## Examples

Create mask indicating unique values
```shell
> [5 6 6 6 8 8 8] | into df | is-unique
```
