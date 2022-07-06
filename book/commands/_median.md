---
title: median
version: 0.65.1
usage: |
  Aggregates columns to their median value
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> median ```

## Examples

Median value from columns in a dataframe
```shell
> [[a b]; [6 2] [4 2] [2 2]] | into df | median
```
