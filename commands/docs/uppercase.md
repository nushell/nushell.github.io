---
title: uppercase
categories: |
  dataframe
version: 0.75.0
dataframe: |
  Uppercase the strings in the column
usage: |
  Uppercase the strings in the column
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> uppercase ```

## Examples

Modifies strings to uppercase
```shell
> [Abc aBc abC] | into df | uppercase
```
