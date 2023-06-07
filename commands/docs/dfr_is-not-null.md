---
title: dfr is-not-null
categories: |
  dataframe
  expression
version: 0.81.0
dataframe: |
  Creates mask where value is not null.
expression: |
  creates a is not null expression
usage: |
  Creates mask where value is not null.
  creates a is not null expression
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr is-not-null ```

## Examples

Create mask where values are not null
```shell
> let s = ([5 6 0 8] | dfr into-df);
    let res = ($s / $s);
    $res | dfr is-not-null
╭───┬─────────────╮
│ # │ is_not_null │
├───┼─────────────┤
│ 0 │ true        │
│ 1 │ true        │
│ 2 │ false       │
│ 3 │ true        │
╰───┴─────────────╯

```

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> dfr is-not-null ```

## Examples

Creates a is not null expression from a column
```shell
> dfr col a | dfr is-not-null

```
