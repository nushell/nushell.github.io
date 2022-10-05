---
title: n-unique
version: 0.69.1
dataframe: |
  Counts unique values
expression: |
  creates a n-unique expression
usage: |
  Counts unique values
  creates a n-unique expression
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.dataframe }}</div>

## Signature

```> n-unique ```

## Examples

Counts unique values
```shell
> [1 1 2 2 3 3 4] | into df | n-unique
```

# <code>{{ $frontmatter.title }}</code> for expression

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.expression }}</div>

## Signature

```> n-unique ```

## Examples

Creates a is n-unique expression from a column
```shell
> col a | n-unique
```
