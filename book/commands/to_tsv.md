---
title: to tsv
layout: command
version: 0.60.0
usage: |
  Convert table into .tsv text
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> to tsv --noheaders`

## Parameters

- `--noheaders`: do not output the column names as the first row

## Examples

Outputs an TSV string representing the contents of this table

```shell
> [[foo bar]; [1 2]] | to tsv
```
