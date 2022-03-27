---
title: dfr value-counts
layout: command
version: 0.60.1
usage: |
  Returns a dataframe with the counts for unique values in series
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> dfr value-counts `

## Examples

Calculates value counts

```shell
> [5 5 5 5 6 6] | dfr to-df | dfr value-counts
```
