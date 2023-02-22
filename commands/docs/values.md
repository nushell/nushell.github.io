---
title: values
categories: |
  filters
version: 0.76.0
filters: |
  Given a record or table, produce a list of its columns' values.
usage: |
  Given a record or table, produce a list of its columns' values.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> values ```

## Notes
This is a counterpart to `columns`, which produces a list of columns' names.
## Examples

Get the values from the record (produce a list)
```shell
> { mode:normal userid:31415 } | values
```

Values are ordered by the column order of the record
```shell
> { f:250 g:191 c:128 d:1024 e:2000 a:16 b:32 } | values
```

Get the values from the table (produce a list of lists)
```shell
> [[name meaning]; [ls list] [mv move] [cd 'change directory']] | values
```
