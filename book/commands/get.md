---
title: get
version: 0.70.0
dataframe: |
  Creates dataframe with the selected columns
filters: |
  Extract data using a cell path.
usage: |
  Creates dataframe with the selected columns
  Extract data using a cell path.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> get ...rest```

## Parameters

 -  `...rest`: column names to sort dataframe

## Examples

Returns the selected column
```shell
> [[a b]; [1 2] [3 4]] | into df | get a
```

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> get (cell_path) ...rest --ignore-errors --sensitive```

## Parameters

 -  `cell_path`: the cell path to the data
 -  `...rest`: additional cell paths
 -  `--ignore-errors`: when there are empty cells, instead of erroring out, replace them with nothing
 -  `--sensitive`: get path in a case sensitive manner

## Examples

Extract the name of files as a list
```shell
> ls | get name
```

Extract the name of the 3rd entry of a file list
```shell
> ls | get name.2
```

Extract the name of the 3rd entry of a file list (alternative)
```shell
> ls | get 2.name
```

Extract the cpu list from the sys information record
```shell
> sys | get cpu
```

Getting Path/PATH in a case insensitive way
```shell
> $env | get paTH
```

Getting Path in a case sensitive way, won't work for 'PATH'
```shell
> $env | get -s Path
```
