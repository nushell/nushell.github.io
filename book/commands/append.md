---
title: append
version: 0.69.1
dataframe: |
  Appends a new dataframe
filters: |
  Append any number of rows to a table.
usage: |
  Appends a new dataframe
  Append any number of rows to a table.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> append (other) --col```

## Parameters

 -  `other`: dataframe to be appended
 -  `--col`: appends in col orientation

## Examples

Appends a dataframe as new columns
```shell
> let a = ([[a b]; [1 2] [3 4]] | into df);
    $a | append $a
```

Appends a dataframe merging at the end of columns
```shell
> let a = ([[a b]; [1 2] [3 4]] | into df);
    $a | append $a --col
```

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> append (row)```

## Parameters

 -  `row`: the row, list, or table to append

## Examples

Append one Int item
```shell
> [0,1,2,3] | append 4
```

Append three Int items
```shell
> [0,1] | append [2,3,4]
```

Append Ints and Strings
```shell
> [0,1] | append [2,nu,4,shell]
```
