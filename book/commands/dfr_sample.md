---
title: dfr sample
layout: command
version: 0.59.1
usage: |
  Create sample dataframe
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> dfr sample --n-rows --fraction --replace`

## Parameters

- `--n-rows {int}`: number of rows to be taken from dataframe
- `--fraction {number}`: fraction of dataframe to be taken
- `--replace`: sample with replace

## Examples

Sample rows from dataframe

```shell
> [[a b]; [1 2] [3 4]] | dfr to-df | dfr sample -n 1
```

Shows sample row using fraction and replace

```shell
> [[a b]; [1 2] [3 4] [5 6]] | dfr to-df | dfr sample -f 0.5 -e
```
