---
title: from ods
layout: command
version: 0.60.1
usage: |
  Parse OpenDocument Spreadsheet(.ods) data and create table.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> from ods --sheets`

## Parameters

- `--sheets {list<string>}`: Only convert specified sheets

## Examples

Convert binary .ods data to a table

```shell
> open test.txt | from ods
```

Convert binary .ods data to a table, specifying the tables

```shell
> open test.txt | from ods -s [Spreadsheet1]
```
