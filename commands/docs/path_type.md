---
title: path type
categories: |
  path
version: 0.84.0
path: |
  Get the type of the object a path refers to (e.g., file, dir, symlink).
usage: |
  Get the type of the object a path refers to (e.g., file, dir, symlink).
---

# <code>{{ $frontmatter.title }}</code> for path

<div class='command-title'>{{ $frontmatter.path }}</div>

## Signature

```> path type ```


## Input/output types:

| input        | output       |
| ------------ | ------------ |
| list\<string\> | list\<string\> |
| string       | string       |
## Examples

Show type of a filepath
```shell
> '.' | path type
dir
```

Show type of a filepaths in a list
```shell
> ls | get name | path type

```

## Notes
This checks the file system to confirm the path's object type.
If nothing is found, an empty string will be returned.