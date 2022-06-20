---
title: max
version: 0.64.0
usage: |
  Aggregates columns to their max value
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> max ```

## Examples

Max value from columns in a dataframe
```shell
> [[a b]; [6 2] [1 4] [4 1]] | to-df | max
```
