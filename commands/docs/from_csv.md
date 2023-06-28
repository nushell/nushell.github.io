---
title: from csv
categories: |
  formats
version: 0.82.1
formats: |
  Parse text as .csv and create table.
usage: |
  Parse text as .csv and create table.
---

# <code>{{ $frontmatter.title }}</code> for formats

<div class='command-title'>{{ $frontmatter.formats }}</div>

## Signature

```> from csv --separator --comment --quote --escape --noheaders --flexible --no-infer --trim```

## Parameters

 -  `--separator {string}`: a character to separate columns, defaults to ','
 -  `--comment {string}`: a comment character to ignore lines starting with it
 -  `--quote {string}`: a quote character to ignore separators in strings, defaults to '"'
 -  `--escape {string}`: an escape character for strings containing the quote character
 -  `--noheaders` `(-n)`: don't treat the first row as column names
 -  `--flexible` `(-)`: allow the number of fields in records to be variable
 -  `--no-infer` `(-)`: no field type inferencing
 -  `--trim {string}`: drop leading and trailing whitespaces around headers names and/or field values

## Examples

Convert comma-separated data to a table
```shell
> "ColA,ColB
1,2" | from csv
╭───┬──────┬──────╮
│ # │ ColA │ ColB │
├───┼──────┼──────┤
│ 0 │    1 │    2 │
╰───┴──────┴──────╯

```

Convert comma-separated data to a table, ignoring headers
```shell
> open data.txt | from csv --noheaders

```

Convert semicolon-separated data to a table
```shell
> open data.txt | from csv --separator ';'

```

Convert comma-separated data to a table, ignoring lines starting with '#'
```shell
> open data.txt | from csv --comment '#'

```

Convert comma-separated data to a table, dropping all possible whitespaces around header names and field values
```shell
> open data.txt | from csv --trim all

```

Convert comma-separated data to a table, dropping all possible whitespaces around header names
```shell
> open data.txt | from csv --trim headers

```

Convert comma-separated data to a table, dropping all possible whitespaces around field values
```shell
> open data.txt | from csv --trim fields

```
