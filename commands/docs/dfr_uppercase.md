---
title: dfr uppercase
categories: |
  dataframe
version: 0.76.0
dataframe: |
  Uppercase the strings in the column
usage: |
  Uppercase the strings in the column
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr uppercase ```

## Examples

Modifies strings to uppercase
```shell
> [Abc aBc abC] | dfr into-df | dfr uppercase
```
