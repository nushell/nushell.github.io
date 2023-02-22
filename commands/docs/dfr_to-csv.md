---
title: dfr to-csv
categories: |
  dataframe
version: 0.76.0
dataframe: |
  Saves dataframe to csv file
usage: |
  Saves dataframe to csv file
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr to-csv ```

## Examples

Saves dataframe to csv file
```shell
> [[a b]; [1 2] [3 4]] | dfr into-df | dfr to-csv test.csv
```

Saves dataframe to csv file using other delimiter
```shell
> [[a b]; [1 2] [3 4]] | dfr into-df | dfr to-csv test.csv -d '|'
```
