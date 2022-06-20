---
title: select
version: 0.64.0
usage: |
  Down-select table to only these columns.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> select ...rest```

## Parameters

 -  `...rest`: the columns to select from the table

## Examples

Select just the name column
```shell
> ls | select name
```

Select the name and size columns
```shell
> ls | select name size
```
