---
title: dfr get
categories: |
  dataframe
version: 0.76.0
dataframe: |
  Creates dataframe with the selected columns
usage: |
  Creates dataframe with the selected columns
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr get ```

## Examples

Returns the selected column
```shell
> [[a b]; [1 2] [3 4]] | dfr into-df | dfr get a
```