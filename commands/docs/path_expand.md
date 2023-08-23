---
title: path expand
categories: |
  path
version: 0.84.0
path: |
  Try to expand a path to its absolute form.
usage: |
  Try to expand a path to its absolute form.
---

# <code>{{ $frontmatter.title }}</code> for path

<div class='command-title'>{{ $frontmatter.path }}</div>

## Signature

```> path expand --strict --no-symlink```

## Parameters

 -  `--strict` `(-s)`: Throw an error if the path could not be expanded
 -  `--no-symlink` `(-n)`: Do not resolve symbolic links


## Input/output types:

| input        | output       |
| ------------ | ------------ |
| list\<string\> | list\<string\> |
| string       | string       |
## Examples

Expand an absolute path
```shell
> '/home/joe/foo/../bar' | path expand
/home/joe/bar
```

Expand a relative path
```shell
> 'foo/../bar' | path expand

```

Expand a list of paths
```shell
> [ /foo/../bar, /foo/../baz ] | path expand
╭───┬──────╮
│ 0 │ /bar │
│ 1 │ /baz │
╰───┴──────╯

```
