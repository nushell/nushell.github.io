---
title: where
categories: |
  filters
version: 0.73.1
filters: |
  Filter values based on a row condition.
usage: |
  Filter values based on a row condition.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> where (row_condition) --closure```

## Parameters

 -  `row_condition`: Filter condition
 -  `--closure {closure(any, int)}`: use with a closure instead (deprecated: use 'filter' command instead)

## Notes
```text
This command works similar to 'filter' but allows extra shorthands for working with
tables, known as "row conditions". On the other hand, reading the condition from a variable is
not supported.
```
## Examples

Filter rows of a table according to a condition
```shell
> [{a: 1} {a: 2}] | where a > 1
```

Filter items of a list according to a condition
```shell
> [1 2] | where {|x| $x > 1}
```

List all files in the current directory with sizes greater than 2kb
```shell
> ls | where size > 2kb
```

List only the files in the current directory
```shell
> ls | where type == file
```

List all files with names that contain "Car"
```shell
> ls | where name =~ "Car"
```

List all files that were modified in the last two weeks
```shell
> ls | where modified >= (date now) - 2wk
```
