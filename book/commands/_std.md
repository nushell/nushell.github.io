---
title: std
version: 0.68.0
usage: |
  Aggregates columns to their std value
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> std ```

## Examples

Std value from columns in a dataframe
```shell
> [[a b]; [6 2] [4 2] [2 2]] | into df | std
```
