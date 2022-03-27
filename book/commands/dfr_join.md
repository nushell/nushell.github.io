---
title: dfr join
layout: command
version: 0.60.1
usage: |
  Joins a dataframe using columns as reference
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> dfr join (dataframe) --left --right --type --suffix`

## Parameters

- `dataframe`: right dataframe to join
- `--left {table}`: left column names to perform join
- `--right {table}`: right column names to perform join
- `--type {string}`: type of join. Inner by default
- `--suffix {string}`: suffix for the columns of the right dataframe

## Examples

inner join dataframe

```shell
> let right = ([[a b c]; [1 2 5] [3 4 5] [5 6 6]] | dfr to-df);
    $right | dfr join $right -l [a b] -r [a b]
```
