---
title: dfr to-csv
categories: |
  dataframe
version: 0.81.0
dataframe: |
  Saves dataframe to CSV file.
usage: |
  Saves dataframe to CSV file.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr to-csv (file) --delimiter --no-header```

## Parameters

 -  `file`: file path to save dataframe
 -  `--delimiter {string}`: file delimiter character
 -  `--no-header` `(-)`: Indicates if file doesn't have header

## Examples

Saves dataframe to CSV file
```shell
> [[a b]; [1 2] [3 4]] | dfr into-df | dfr to-csv test.csv

```

Saves dataframe to CSV file using other delimiter
```shell
> [[a b]; [1 2] [3 4]] | dfr into-df | dfr to-csv test.csv -d '|'

```
