---
title: value-counts
version: 0.69.1
dataframe: |
  Returns a dataframe with the counts for unique values in series
usage: |
  Returns a dataframe with the counts for unique values in series
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.dataframe }}</div>

## Signature

```> value-counts ```

## Examples

Calculates value counts
```shell
> [5 5 5 5 6 6] | into df | value-counts
```
