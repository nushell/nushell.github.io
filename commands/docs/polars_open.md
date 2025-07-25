---
title: polars open
categories: |
  dataframe
version: 0.106.0
dataframe: |
  Opens CSV, JSON, NDJSON/JSON lines, arrow, avro, or parquet file to create dataframe. A lazy dataframe will be created by default, if supported.
usage: |
  Opens CSV, JSON, NDJSON/JSON lines, arrow, avro, or parquet file to create dataframe. A lazy dataframe will be created by default, if supported.
editLink: false
contributors: false
---
<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# `polars open` for [dataframe](/commands/categories/dataframe.md)

<div class='command-title'>Opens CSV, JSON, NDJSON&#x2f;JSON lines, arrow, avro, or parquet file to create dataframe. A lazy dataframe will be created by default, if supported.</div>

::: warning This command requires a plugin
The `polars open` command resides in the `polars` plugin.
To use this command, you must install and register `nu_plugin_polars`.
See the [Plugins](/book/plugins.html) chapter in the book for more information.
:::


## Signature

```> polars open {flags} (file)```

## Flags

 -  `--eager`: Open dataframe as an eager dataframe
 -  `--type, -t {string}`: File type: csv, tsv, json, parquet, arrow, avro. If omitted, derive from file extension
 -  `--delimiter, -d {string}`: file delimiter character. CSV file
 -  `--no-header`: Indicates if file doesn't have header. CSV file
 -  `--infer-schema {number}`: Number of rows to infer the schema of the file. CSV file
 -  `--skip-rows {number}`: Number of rows to skip from file. CSV file
 -  `--columns {list<string>}`: Columns to be selected from csv file. CSV and Parquet file
 -  `--schema, -s {any}`: Polars Schema in format [{name: str}]. CSV, JSON, and JSONL files
 -  `--hive-enabled`: Enable hive support. Parquet and Arrow files
 -  `--hive-start-idx {number}`: Start index of hive partitioning. Parquet and Arrow files
 -  `--hive-schema {any}`: Hive schema in format [{name: str}]. Parquet and Arrow files
 -  `--hive-try-parse-dates`: Try to parse dates in hive partitioning. Parquet and Arrow files
 -  `--truncate-ragged-lines`: Truncate lines that are longer than the schema. CSV file

## Parameters

 -  `file`: file path or cloud url to load values from


## Input/output types:

| input | output    |
| ----- | --------- |
| any   | dataframe |
## Examples

Takes a file name and creates a dataframe
```nu
> polars open test.csv

```
