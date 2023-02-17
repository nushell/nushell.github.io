---
title: dummies
categories: |
  dataframe
version: 0.75.0
dataframe: |
  Creates a new dataframe with dummy variables
usage: |
  Creates a new dataframe with dummy variables
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dummies ```

## Examples

Create new dataframe with dummy variables from a dataframe
```shell
> [[a b]; [1 2] [3 4]] | into df | dummies
```

Create new dataframe with dummy variables from a series
```shell
> [1 2 2 3 3] | into df | dummies
```
