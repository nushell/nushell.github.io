---
title: to csv
categories: |
  dataframe
  formats
version: 0.70.0
dataframe: |
  Saves dataframe to csv file
formats: |
  Convert table into .csv text 
usage: |
  Saves dataframe to csv file
  Convert table into .csv text 
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> to csv (file) --delimiter --no-header```

## Parameters

 -  `file`: file path to save dataframe
 -  `--delimiter {string}`: file delimiter character
 -  `--no-header`: Indicates if file doesn't have header

## Examples

Saves dataframe to csv file
```shell
> [[a b]; [1 2] [3 4]] | into df | to csv test.csv
```

Saves dataframe to csv file using other delimiter
```shell
> [[a b]; [1 2] [3 4]] | into df | to csv test.csv -d '|'
```

# <code>{{ $frontmatter.title }}</code> for formats

<div class='command-title'>{{ $frontmatter.formats }}</div>

## Signature

```> to csv --separator --noheaders```

## Parameters

 -  `--separator {string}`: a character to separate columns, defaults to ','
 -  `--noheaders`: do not output the columns names as the first row

## Examples

Outputs an CSV string representing the contents of this table
```shell
> [[foo bar]; [1 2]] | to csv
```

Outputs an CSV string representing the contents of this table
```shell
> [[foo bar]; [1 2]] | to csv -s ';'
```
