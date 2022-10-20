---
title: sample
version: 0.70.0
dataframe: |
  Create sample dataframe
usage: |
  Create sample dataframe
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> sample --n-rows --fraction --seed --replace --shuffle```

## Parameters

 -  `--n-rows {int}`: number of rows to be taken from dataframe
 -  `--fraction {number}`: fraction of dataframe to be taken
 -  `--seed {number}`: seed for the selection
 -  `--replace`: sample with replace
 -  `--shuffle`: shuffle sample

## Examples

Sample rows from dataframe
```shell
> [[a b]; [1 2] [3 4]] | into df | sample -n 1
```

Shows sample row using fraction and replace
```shell
> [[a b]; [1 2] [3 4] [5 6]] | into df | sample -f 0.5 -e
```
