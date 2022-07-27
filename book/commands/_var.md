---
title: var
version: 0.66.1
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
> [[a b]; [6 2] [4 2] [2 2]] | into df | var
```
