---
title: dfr is-in
categories: |
  dataframe
  expression
version: 0.77.0
dataframe: |
  Checks if elements from a series are contained in right series.
expression: |
  Creates an is-in expression.
usage: |
  Checks if elements from a series are contained in right series.
  Creates an is-in expression.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr is-in ```

## Examples

Checks if elements from a series are contained in right series
```shell
> let other = ([1 3 6] | dfr into-df);
    [5 6 6 6 8 8 8] | dfr into-df | dfr is-in $other
╭───┬───────╮
│ # │ is_in │
├───┼───────┤
│ 0 │ false │
│ 1 │ true  │
│ 2 │ true  │
│ 3 │ true  │
│ 4 │ false │
│ 5 │ false │
│ 6 │ false │
╰───┴───────╯

```

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> dfr is-in ```

## Examples

Creates a is-in expression
```shell
> let df = ([[a b]; [one 1] [two 2] [three 3]] | dfr into-df);
    $df | dfr with-column (dfr col a | dfr is-in [one two] | dfr as a_in)
╭───┬───────┬───┬───────╮
│ # │   a   │ b │ a_in  │
├───┼───────┼───┼───────┤
│ 0 │ one   │ 1 │ true  │
│ 1 │ two   │ 2 │ true  │
│ 2 │ three │ 3 │ false │
╰───┴───────┴───┴───────╯

```
