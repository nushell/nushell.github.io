---
title: query web
version: 0.69.1
network: |
  execute selector query on html/web
usage: |
  execute selector query on html/web
---

# <code>{{ $frontmatter.title }}</code> for network

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.network }}</div>

## Signature

```> query web --query --as-html --attribute --as-table --inspect```

## Parameters

 -  `--query {string}`: selector query
 -  `--as-html`: return the query output as html
 -  `--attribute {string}`: downselect based on the given attribute
 -  `--as-table {table}`: find table based on column header list
 -  `--inspect`: run in inspect mode to provide more information for determining column headers
