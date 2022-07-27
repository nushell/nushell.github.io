---
title: mv
version: 0.66.1
usage: |
  Move files or directories.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> mv (destination) ...source(s) --verbose --interactive```

## Parameters

 -  `destination`: the location to move files/directories to
 -  `...source(s)`: the location(s) to move files/directories from
 -  `--verbose`: make mv to be verbose, showing files been moved.
 -  `--interactive`: ask user to confirm action

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
