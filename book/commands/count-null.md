---
title: count-null
version: 0.69.1
dataframe: |
  Counts null values
usage: |
  Counts null values
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.dataframe }}</div>

## Signature

```> count-null ```

## Examples

Counts null values
```shell
> let s = ([1 1 0 0 3 3 4] | into df);
    ($s / $s) | count-null
```
