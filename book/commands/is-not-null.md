---
title: is-not-null
categories: |
  dataframe
  expression
version: 0.70.0
dataframe: |
  Creates mask where value is not null
expression: |
  creates a is not null expression
usage: |
  Creates mask where value is not null
  creates a is not null expression
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> is-not-null ```

## Examples

Create mask where values are not null
```shell
> let s = ([5 6 0 8] | into df);
    let res = ($s / $s);
    $res | is-not-null
```

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> is-not-null ```

## Examples

Creates a is not null expression from a column
```shell
> col a | is-not-null
```
