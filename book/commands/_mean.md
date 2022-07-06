---
title: mean
version: 0.65.1
usage: |
  Aggregates columns to their mean value
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> mean ```

## Examples

Mean value from columns in a dataframe
```shell
> [[a b]; [6 2] [4 2] [2 2]] | into df | mean
```
