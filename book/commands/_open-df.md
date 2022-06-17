---
title: open-df
version: 0.64.0
usage: |
  Opens csv, json or parquet file to create dataframe
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> open-df (file) --delimiter --no-header --infer-schema --skip-rows --columns```

## Parameters

 -  `file`: file path to load values from
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
