---
title: mv
categories: |
  filesystem
version: 0.82.0
filesystem: |
  Move files or directories.
usage: |
  Move files or directories.
---

# <code>{{ $frontmatter.title }}</code> for filesystem

<div class='command-title'>{{ $frontmatter.filesystem }}</div>

## Signature

```> mv (source) (destination) --verbose --force --interactive --update```

## Parameters

 -  `source`: the location to move files/directories from
 -  `destination`: the location to move files/directories to
 -  `--verbose` `(-v)`: make mv to be verbose, showing files been moved.
 -  `--force` `(-f)`: overwrite the destination.
 -  `--interactive` `(-i)`: ask user to confirm action
 -  `--update` `(-u)`: move only when the SOURCE file is newer than the destination file(with -f) or when the destination file is missing

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
