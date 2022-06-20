---
title: to-nu
version: 0.64.0
usage: |
  Converts a section of the dataframe to Nushell Table
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> to-nu --rows --tail```

## Parameters

 -  `--rows {number}`: number of rows to be shown
 -  `--tail`: shows tail rows

## Examples

Shows head rows from dataframe
```shell
> [[a b]; [1 2] [3 4]] | to-df | to nu
```

Shows tail rows from dataframe
```shell
> [[a b]; [1 2] [3 4] [5 6]] | to-df | to nu -t -n 1
```
