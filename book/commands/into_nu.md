---
title: into nu
categories: |
  dataframe
  expression
version: 0.75.0
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

```> into nu ```

## Examples

Shows head rows from dataframe
```shell
> [[a b]; [1 2] [3 4]] | into df | into nu
```

Shows tail rows from dataframe
```shell
> [[a b]; [1 2] [5 6] [3 4]] | into df | into nu -t -n 1
```

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> into nu ```

## Examples

Convert a col expression into a nushell value
```shell
> col a | into nu
```
