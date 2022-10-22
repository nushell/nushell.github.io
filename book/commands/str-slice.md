---
title: str-slice
categories: |
  dataframe
version: 0.70.0
dataframe: |
  Slices the string from the start position until the selected length
usage: |
  Slices the string from the start position until the selected length
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> str-slice (start) --length```

## Parameters

 -  `start`: start of slice
 -  `--length {int}`: optional length

## Examples

Creates slices from the strings
```shell
> [abcded abc321 abc123] | into df | str-slice 1 -l 2
```
