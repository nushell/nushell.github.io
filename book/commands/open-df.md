---
title: open-df
categories: |
  dataframe
version: 0.71.0
dataframe: |
  Opens csv, json, arrow, or parquet file to create dataframe
usage: |
  Opens csv, json, arrow, or parquet file to create dataframe
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> open-df (file) --lazy --type --delimiter --no-header --infer-schema --skip-rows --columns```

## Parameters

 -  `file`: file path to load values from
 -  `--lazy`: creates a lazy dataframe
 -  `--type {string}`: File type: csv, tsv, json, parquet, arrow. If omitted, derive from file extension
 -  `--delimiter {string}`: file delimiter character. CSV file
 -  `--no-header`: Indicates if file doesn't have header. CSV file
 -  `--infer-schema {number}`: Number of rows to infer the schema of the file. CSV file
 -  `--skip-rows {number}`: Number of rows to skip from file. CSV file
 -  `--columns {list<string>}`: Columns to be selected from csv file. CSV and Parquet file

## Examples

Takes a file name and creates a dataframe
```shell
> open test.csv
```
