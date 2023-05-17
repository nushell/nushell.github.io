---
title: to csv
categories: |
  formats
version: 0.80.0
formats: |
  Convert table into .csv text .
usage: |
  Convert table into .csv text .
---

# <code>{{ $frontmatter.title }}</code> for formats

<div class='command-title'>{{ $frontmatter.formats }}</div>

## Signature

```> to csv --separator --noheaders```

## Parameters

 -  `--separator {string}`: a character to separate columns, defaults to ','
 -  `--noheaders` `(-n)`: do not output the columns names as the first row

## Examples

Outputs an CSV string representing the contents of this table
```shell
> [[foo bar]; [1 2]] | to csv
foo,bar
1,2

```

Outputs an CSV string representing the contents of this table
```shell
> [[foo bar]; [1 2]] | to csv -s ';'
foo;bar
1;2

```

Outputs an CSV string representing the contents of this record
```shell
> {a: 1 b: 2} | to csv
a,b
1,2

```
