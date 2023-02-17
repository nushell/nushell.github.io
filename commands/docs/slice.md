---
title: slice
categories: |
  dataframe
version: 0.75.0
dataframe: |
  Creates new dataframe from a slice of rows
usage: |
  Creates new dataframe from a slice of rows
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> slice ```

## Examples

Create new dataframe from a slice of the rows
```shell
> [[a b]; [1 2] [3 4]] | into df | slice 0 1
```
