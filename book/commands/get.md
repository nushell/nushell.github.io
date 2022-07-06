---
title: get
version: 0.65.1
usage: |
  Extract data using a cell path.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> get (cell_path) ...rest --ignore-errors --sensitive```

## Parameters

 -  `cell_path`: the cell path to the data
 -  `...rest`: additional cell paths
 -  `--ignore-errors`: return nothing if path can't be found
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
