---
title: dfr into-nu
categories: |
  dataframe
  expression
version: 0.76.0
dataframe: |
  Converts a section of the dataframe into nushell Table
expression: |
  Convert expression into a nu value for access and exploration
usage: |
  Converts a section of the dataframe into nushell Table
  Convert expression into a nu value for access and exploration
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr into-nu ```

## Examples

Shows head rows from dataframe
```shell
> [[a b]; [1 2] [3 4]] | dfr into-df | dfr into-nu
```

Shows tail rows from dataframe
```shell
> [[a b]; [1 2] [5 6] [3 4]] | dfr into-df | dfr into-nu -t -n 1
```

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> dfr into-nu ```

## Examples

Convert a col expression into a nushell value
```shell
> dfr col a | dfr into-nu
```
