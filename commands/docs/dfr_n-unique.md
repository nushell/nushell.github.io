---
title: dfr n-unique
categories: |
  dataframe
  expression
version: 0.82.0
dataframe: |
  Counts unique values.
expression: |
  creates a n-unique expression
usage: |
  Counts unique values.
  creates a n-unique expression
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr n-unique ```

## Examples

Counts unique values
```shell
> [1 1 2 2 3 3 4] | dfr into-df | dfr n-unique
╭───┬──────────────╮
│ # │ count_unique │
├───┼──────────────┤
│ 0 │            4 │
╰───┴──────────────╯

```

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> dfr n-unique ```

## Examples

Creates a is n-unique expression from a column
```shell
> dfr col a | dfr n-unique

```
