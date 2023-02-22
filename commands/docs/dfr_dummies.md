---
title: dfr dummies
categories: |
  dataframe
version: 0.76.0
dataframe: |
  Creates a new dataframe with dummy variables
usage: |
  Creates a new dataframe with dummy variables
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr dummies ```

## Examples

Create new dataframe with dummy variables from a dataframe
```shell
> [[a b]; [1 2] [3 4]] | dfr into-df | dfr dummies
```

Create new dataframe with dummy variables from a series
```shell
> [1 2 2 3 3] | dfr into-df | dfr dummies
```
