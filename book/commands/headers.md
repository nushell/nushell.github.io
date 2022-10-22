---
title: headers
categories: |
  filters
version: 0.70.0
filters: |
  Use the first row of the table as column names.
usage: |
  Use the first row of the table as column names.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> headers ```

## Examples

Returns headers from table
```shell
> "a b c|1 2 3" | split row "|" | split column " " | headers
```

Don't panic on rows with different headers
```shell
> "a b c|1 2 3|1 2 3 4" | split row "|" | split column " " | headers
```
