---
title: dfr to-dummies
layout: command
version: 0.63.0
usage: |
  Creates a new dataframe with dummy variables
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> dfr to-dummies ```

## Examples

Create new dataframe with dummy variables from a dataframe
```shell
> [[a b]; [1 2] [3 4]] | dfr to-df | dfr to-dummies
```

Create new dataframe with dummy variables from a series
```shell
> [1 2 2 3 3] | dfr to-df | dfr to-dummies
```
