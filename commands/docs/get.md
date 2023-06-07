---
title: get
categories: |
  filters
version: 0.81.0
filters: |
  Extract data using a cell path.
usage: |
  Extract data using a cell path.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> get (cell_path) ...rest --ignore-errors --sensitive```

## Parameters

 -  `cell_path`: the cell path to the data
 -  `...rest`: additional cell paths
 -  `--ignore-errors` `(-i)`: ignore missing data (make all cell path members optional)
 -  `--sensitive` `(-s)`: get path in a case sensitive manner

## Notes
This is equivalent to using the cell path access syntax: `$env.OS` is the same as `$env | get OS`.

If multiple cell paths are given, this will produce a list of values.
## Examples

Get an item from a list
```shell
> [0 1 2] | get 1
1
```

Get a column from a table
```shell
> [{A: A0}] | get A
╭───┬────╮
│ 0 │ A0 │
╰───┴────╯

```

Get a cell from a table
```shell
> [{A: A0}] | get 0.A
A0
```

Extract the name of the 3rd record in a list (same as `ls | $in.name`)
```shell
> ls | get name.2

```

Extract the name of the 3rd record in a list
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
