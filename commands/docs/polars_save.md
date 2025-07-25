---
title: polars save
categories: |
  lazyframe
version: 0.106.0
lazyframe: |
  Saves a dataframe to disk. For lazy dataframes a sink operation will be used if the file type supports it (parquet, ipc/arrow, csv, and ndjson).
usage: |
  Saves a dataframe to disk. For lazy dataframes a sink operation will be used if the file type supports it (parquet, ipc/arrow, csv, and ndjson).
editLink: false
contributors: false
---
<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# `polars save` for [lazyframe](/commands/categories/lazyframe.md)

<div class='command-title'>Saves a dataframe to disk. For lazy dataframes a sink operation will be used if the file type supports it (parquet, ipc&#x2f;arrow, csv, and ndjson).</div>

::: warning This command requires a plugin
The `polars save` command resides in the `polars` plugin.
To use this command, you must install and register `nu_plugin_polars`.
See the [Plugins](/book/plugins.html) chapter in the book for more information.
:::


## Signature

```> polars save {flags} (path)```

## Flags

 -  `--type, -t {string}`: File type: csv, json, parquet, arrow/ipc. If omitted, derive from file extension
 -  `--avro-compression {string}`: Compression for avro supports deflate or snappy
 -  `--csv-delimiter {string}`: file delimiter character
 -  `--csv-no-header`: Indicates to exclude a header row for CSV files.

## Parameters

 -  `path`: Path or cloud url to write to


## Input/output types:

| input | output |
| ----- | ------ |
| any   | string |
## Examples

Performs a streaming collect and save the output to the specified file
```nu
> [[a b];[1 2] [3 4]] | polars into-lazy | polars save test.parquet

```

Saves dataframe to parquet file
```nu
> [[a b]; [1 2] [3 4]] | polars into-df | polars save test.parquet

```

Saves dataframe to arrow file
```nu
> [[a b]; [1 2] [3 4]] | polars into-df | polars save test.arrow

```

Saves dataframe to NDJSON file
```nu
> [[a b]; [1 2] [3 4]] | polars into-df | polars save test.ndjson

```

Saves dataframe to avro file
```nu
> [[a b]; [1 2] [3 4]] | polars into-df | polars save test.avro

```

Saves dataframe to CSV file
```nu
> [[a b]; [1 2] [3 4]] | polars into-df | polars save test.csv

```

Saves dataframe to CSV file using other delimiter
```nu
> [[a b]; [1 2] [3 4]] | polars into-df | polars save test.csv --csv-delimiter '|'

```
