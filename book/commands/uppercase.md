---
title: uppercase
version: 0.69.1
dataframe: |
  Uppercase the strings in the column
usage: |
  Uppercase the strings in the column
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.dataframe }}</div>

## Signature

```> uppercase ```

## Examples

Modifies strings to uppercase
```shell
> [Abc aBc abC] | into df | uppercase
```
