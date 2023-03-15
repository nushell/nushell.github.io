---
title: dfr is-null
categories: |
  dataframe
  expression
version: 0.77.0
dataframe: |
  Creates mask where value is null.
expression: |
  creates a is null expression
usage: |
  Creates mask where value is null.
  creates a is null expression
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr is-null ```

## Examples

Create mask where values are null
```shell
> let s = ([5 6 0 8] | dfr into-df);
    let res = ($s / $s);
    $res | dfr is-null
╭───┬─────────╮
│ # │ is_null │
├───┼─────────┤
│ 0 │ false   │
│ 1 │ false   │
│ 2 │ true    │
│ 3 │ false   │
╰───┴─────────╯

```

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> dfr is-null ```

## Examples

Creates a is null expression from a column
```shell
> dfr col a | dfr is-null

```
