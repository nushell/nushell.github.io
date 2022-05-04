---
title: dfr with-column
layout: command
version: 0.62.0
usage: |
  Adds a series to the dataframe
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> dfr with-column (series) --name```

## Parameters

 -  `series`: series to be added
 -  `--name {string}`: column name

## Examples

Adds a series to the dataframe
```shell
> [[a b]; [1 2] [3 4]] | dfr to-df | dfr with-column ([5 6] | dfr to-df) --name c
```
