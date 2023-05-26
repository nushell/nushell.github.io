---
title: dfr open
categories: |
  dataframe
version: 0.80.0
dataframe: |
  Opens CSV, JSON, JSON lines, arrow, or parquet file to create dataframe.
usage: |
  Opens CSV, JSON, JSON lines, arrow, or parquet file to create dataframe.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr open (file) --lazy --type --delimiter --no-header --infer-schema --skip-rows --columns```

## Parameters

 -  `file`: file path to load values from
 -  `--lazy` `(-l)`: creates a lazy dataframe
 -  `--type {string}`: File type: csv, tsv, json, json lines, parquet, arrow. If omitted, derive from file extension
 -  `--delimiter {string}`: file delimiter character. CSV file
 -  `--no-header` `(-)`: Indicates if file doesn't have header. CSV file
 -  `--infer-schema {number}`: Number of rows to infer the schema of the file. CSV and JSON lines file
 -  `--skip-rows {number}`: Number of rows to skip from file. CSV file
 -  `--columns {list<string>}`: Columns to be selected from csv file. CSV and Parquet file

## Examples

Takes a file name and creates a dataframe
```shell
> dfr open test.csv

```
