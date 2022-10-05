---
title: min
version: 0.69.1
expression: |
  Creates a min expression
lazyframe: |
  Aggregates columns to their min value
usage: |
  Creates a min expression
  Aggregates columns to their min value
---

# <code>{{ $frontmatter.title }}</code> for expression

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.expression }}</div>

## Signature

```> min ```

## Examples

Min aggregation for a group by
```shell
> [[a b]; [one 2] [one 4] [two 1]]
    | into df
    | group-by a
    | agg (col b | min)
```

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> min ```

## Examples

Min value from columns in a dataframe
```shell
> [[a b]; [6 2] [1 4] [4 1]] | into df | min
```
