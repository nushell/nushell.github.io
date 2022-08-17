---
title: dummies
version: 0.67.0
usage: |
  Creates a new dataframe with dummy variables
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

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
