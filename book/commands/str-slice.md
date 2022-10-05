---
title: str-slice
version: 0.69.1
dataframe: |
  Slices the string from the start position until the selected length
usage: |
  Slices the string from the start position until the selected length
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.dataframe }}</div>

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
