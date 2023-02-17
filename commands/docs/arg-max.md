---
title: arg-max
categories: |
  dataframe
version: 0.75.0
dataframe: |
  Return index for max value in series
usage: |
  Return index for max value in series
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> arg-max ```

## Examples

Returns index for max value
```shell
> [1 3 2] | into df | arg-max
```
