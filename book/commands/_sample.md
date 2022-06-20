---
title: sample
version: 0.64.0
usage: |
  Create sample dataframe
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> sample --n-rows --fraction --seed --replace```

## Parameters

 -  `--n-rows {int}`: number of rows to be taken from dataframe
 -  `--fraction {number}`: fraction of dataframe to be taken
 -  `--seed {number}`: seed for the selection
 -  `--replace`: sample with replace

## Examples

Sample rows from dataframe
```shell
> [[a b]; [1 2] [3 4]] | to-df | sample -n 1
```

Shows sample row using fraction and replace
```shell
> [[a b]; [1 2] [3 4] [5 6]] | to-df | sample -f 0.5 -e
```
