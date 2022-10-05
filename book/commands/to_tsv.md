---
title: to tsv
version: 0.69.1
formats: |
  Convert table into .tsv text
usage: |
  Convert table into .tsv text
---

# <code>{{ $frontmatter.title }}</code> for formats

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.formats }}</div>

## Signature

```> to tsv --noheaders```

## Parameters

 -  `--noheaders`: do not output the column names as the first row

## Examples

Outputs an TSV string representing the contents of this table
```shell
> [[foo bar]; [1 2]] | to tsv
```
