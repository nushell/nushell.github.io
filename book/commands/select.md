---
title: select
version: 0.69.1
usage: |
  Down-select table to only these columns.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> select ...rest --ignore-errors```

## Parameters

 -  `...rest`: the columns to select from the table
 -  `--ignore-errors`: when a column has empty cells, instead of erroring out, replace them with nothing

## Examples

Select just the name column
```shell
> ls | select name
```

Select the name and size columns
```shell
> ls | select name size
```
