---
title: var
version: 0.64.0
usage: |
  Aggregates columns to their var value
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> var ```

## Examples

Var value from columns in a dataframe
```shell
> [[a b]; [6 2] [4 2] [2 2]] | to-df | var
```
