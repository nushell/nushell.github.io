---
title: is-null
categories: |
  dataframe
  expression
version: 0.75.0
dataframe: |
  Creates mask where value is null
expression: |
  creates a is null expression
usage: |
  Creates mask where value is null
  creates a is null expression
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> is-null ```

## Examples

Create mask where values are null
```shell
> let s = ([5 6 0 8] | into df);
    let res = ($s / $s);
    $res | is-null
```

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> is-null ```

## Examples

Creates a is null expression from a column
```shell
> col a | is-null
```
