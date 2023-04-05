---
title: mv
categories: |
  filesystem
version: 0.78.0
filesystem: |
  Move files or directories.
usage: |
  Move files or directories.
---

# <code>{{ $frontmatter.title }}</code> for filesystem

<div class='command-title'>{{ $frontmatter.filesystem }}</div>

## Signature

```> mv (source) (destination) --verbose --force --interactive```

## Parameters

 -  `source`: the location to move files/directories from
 -  `destination`: the location to move files/directories to
 -  `--verbose` `(-v)`: make mv to be verbose, showing files been moved.
 -  `--force` `(-f)`: overwrite the destination.
 -  `--interactive` `(-i)`: ask user to confirm action

## Examples

Rename a file
```shell
> mv before.txt after.txt

```

Move a file into a directory
```shell
> mv test.txt my/subdirectory

```

Move many files into a directory
```shell
> mv *.txt my/subdirectory

```
