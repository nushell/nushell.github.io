---
title: db as
layout: command
version: 0.62.0
usage: |
  Creates an alias for a column selection
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> db as (alias)```

## Parameters

 -  `alias`: alias name

## Examples

Creates an alias for a column selection
```shell
> db col name_a | db as new_a
```

Creates an alias for a table
```shell
> db open name
    | db select a
    | db from table_a
    | db as table_a_new
    | db describe
```
