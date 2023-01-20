---
title: reject
categories: |
  filters
version: 0.74.0
filters: |
  Remove the given columns from the table. To remove rows, use 'drop'.
usage: |
  Remove the given columns from the table. To remove rows, use 'drop'.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> reject ...rest```

## Parameters

 -  `...rest`: the names of columns to remove from the table

## Examples

Reject a column in the `ls` table
```shell
> ls | reject modified
```

Reject a column in a table
```shell
> [[a, b]; [1, 2]] | reject a
```

Reject the specified field in a record
```shell
> {a: 1, b: 2} | reject a
```

Reject a nested field in a record
```shell
> {a: {b: 3, c: 5}} | reject a.b
```
