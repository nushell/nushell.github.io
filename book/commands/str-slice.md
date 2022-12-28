---
title: str-slice
categories: |
  dataframe
version: 0.73.1
dataframe: |
  Slices the string from the start position until the selected length
usage: |
  Slices the string from the start position until the selected length
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> str-slice ```

## Examples

Creates slices from the strings
```shell
> [abcded abc321 abc123] | into df | str-slice 1 -l 2
```
