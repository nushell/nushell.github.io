---
title: arg-min
categories: |
  dataframe
version: 0.70.0
dataframe: |
  Return index for min value in series
usage: |
  Return index for min value in series
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> arg-min ```

## Examples

Returns index for min value
```shell
> [1 3 2] | into df | arg-min
```
