---
title: value-counts
version: 0.68.0
usage: |
  Returns a dataframe with the counts for unique values in series
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> value-counts ```

## Examples

Calculates value counts
```shell
> [5 5 5 5 6 6] | into df | value-counts
```
