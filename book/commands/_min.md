---
title: min
version: 0.67.1
usage: |
  Aggregates columns to their min value
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> min ```

## Examples

Min value from columns in a dataframe
```shell
> [[a b]; [6 2] [1 4] [4 1]] | into df | min
```
