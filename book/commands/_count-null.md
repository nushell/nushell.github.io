---
title: count-null
version: 0.64.0
usage: |
  Counts null values
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> count-null ```

## Examples

Counts null values
```shell
> let s = ([1 1 0 0 3 3 4] | to-df);
    ($s / $s) | count-null
```
