---
title: dfr to-nu
layout: command
version: 0.60.1
usage: |
  Converts a section of the dataframe to Nushell Table
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> dfr to-nu --n-rows --tail```

## Parameters

 -  `--n-rows {number}`: number of rows to be shown
 -  `--tail`: shows tail rows

## Examples

Shows head rows from dataframe
```shell
> [[a b]; [1 2] [3 4]] | dfr to-df | dfr to-nu
```

Shows tail rows from dataframe
```shell
> [[a b]; [1 2] [3 4] [5 6]] | dfr to-df | dfr to-nu -t -n 1
```
