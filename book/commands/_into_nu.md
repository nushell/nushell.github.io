---
title: into nu
version: 0.66.1
usage: |
  Converts a section of the dataframe into nushell Table
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> into nu --rows --tail```

## Parameters

 -  `--rows {number}`: number of rows to be shown
 -  `--tail`: shows tail rows

## Examples

Shows head rows from dataframe
```shell
> [[a b]; [1 2] [3 4]] | into df | into nu
```

Shows tail rows from dataframe
```shell
> [[a b]; [1 2] [5 6] [3 4]] | into df | into nu -t -n 1
```
